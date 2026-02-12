import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import logging
from urllib.parse import quote_plus

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB Configuration
MONGODB_URL = os.getenv('MONGODB_URL', '').strip()
MONGODB_PASSWORD = os.getenv('MONGODB_PASSWORD', '').strip()
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE', '').strip()

# Validate MongoDB URL
if not MONGODB_URL:
    raise ValueError("[MongoDB] Environment variable 'MONGODB_URL' is missing or empty. Please set MONGODB_URL in your .env file.")

# Handle password encoding for Atlas URLs (mongodb+srv://username:<password>@...)
if '<password>' in MONGODB_URL:
    if not MONGODB_PASSWORD:
        raise ValueError("[MongoDB] MONGODB_URL contains '<password>' placeholder but MONGODB_PASSWORD is not set. Please set MONGODB_PASSWORD in your .env file.")
    # URL encode only the password to handle special characters
    encoded_password = quote_plus(MONGODB_PASSWORD)
    MONGODB_URL = MONGODB_URL.replace('<password>', encoded_password)
    logger.info("[MongoDB] Password placeholder replaced with encoded password")

# Validate MongoDB Database
if not MONGODB_DATABASE:
    raise ValueError("[MongoDB] Environment variable 'MONGODB_DATABASE' is missing or empty. Please set MONGODB_DATABASE in your .env file.")

logger.info(f"[MongoDB] Configuration loaded successfully")
 

class MongoDBConnection:
    """MongoDB Connection Pool Manager"""
    
    _instance = None
    _client = None
    _database = None
    
    def __new__(cls):
        """Singleton pattern to ensure only one connection pool"""
        if cls._instance is None:
            cls._instance = super(MongoDBConnection, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize MongoDB connection pool"""
        if self._client is None:
            self._connect()
    
    def _connect(self):
        """Establish connection to MongoDB with connection pooling"""
        try:
            self._client = MongoClient(
                MONGODB_URL,
                retryWrites=True,
                w='majority'  # Write concern
            )
            
            # Test the connection
            self._client.admin.command('ping')
            logger.info(f"[MongoDB] Successfully connected to MongoDB!")
            
            # Set database
            self._database = self._client[MONGODB_DATABASE]
            logger.info(f"[MongoDB] Using database: {MONGODB_DATABASE}")
            
        except ConnectionFailure as e:
            logger.error(f"[MongoDB] Failed to connect to MongoDB: {e}")
            raise
        except ServerSelectionTimeoutError as e:
            logger.error(f"[MongoDB] Server selection timeout: {e}")
            raise
        except Exception as e:
            logger.error(f"[MongoDB] Unexpected error during connection: {e}")
            raise
    
    def get_client(self):
        """Get MongoDB client"""
        if self._client is None:
            self._connect()
        return self._client
    
    def get_database(self):
        """Get MongoDB database"""
        if self._database is None:
            self._connect()
        return self._database
    
    def get_collection(self, collection_name):
        """Get a specific collection"""
        return self.get_database()[collection_name]
    
    def test_connection(self):
        """Test MongoDB connection"""
        try:
            self.get_client().admin.command('ping')
            return True, "MongoDB connection is healthy"
        except Exception as e:
            return False, str(e)
    
    def close_connection(self):
        """Close MongoDB connection"""
        if self._client:
            self._client.close()
            self._client = None
            self._database = None
            logger.info("[MongoDB] Connection closed")
    
    def get_server_info(self):
        """Get MongoDB server information"""
        try:
            return self.get_client().server_info()
        except Exception as e:
            logger.error(f"[MongoDB] Error getting server info: {e}")
            return None
    
    def list_collections(self):
        """List all collections in the database"""
        try:
            return self.get_database().list_collection_names()
        except Exception as e:
            logger.error(f"[MongoDB] Error listing collections: {e}")
            return []

# Global MongoDB connection instance
mongodb_connection = MongoDBConnection()

def get_mongodb_client():
    """Get MongoDB client instance"""
    return mongodb_connection.get_client()

def get_mongodb_database():
    """Get MongoDB database instance"""
    return mongodb_connection.get_database()

def get_mongodb_collection(collection_name):
    """Get MongoDB collection instance"""
    return mongodb_connection.get_collection(collection_name)

def ensure_mongodb_connection():
    """Ensure MongoDB connection is established"""
    try:
        is_healthy, message = mongodb_connection.test_connection()
        if is_healthy:
            logger.info(f"[MongoDB] Connection verified: {message}")
        else:
            logger.error(f"[MongoDB] Connection failed: {message}")
            raise ConnectionError(message)
    except Exception as e:
        logger.error(f"[MongoDB] Error ensuring connection: {e}")
        raise

# Initialize connection when module is imported
try:
    ensure_mongodb_connection()
except Exception as e:
    logger.warning(f"[MongoDB] Failed to initialize connection on import: {e}")
    logger.warning("[MongoDB] Connection will be retried when needed")