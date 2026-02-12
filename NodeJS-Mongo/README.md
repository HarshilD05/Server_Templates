# Node.js + Express + MongoDB Template Server

A production-ready template server built with Node.js, Express, and MongoDB (Mongoose), featuring user authentication with secure password hashing (PBKDF2). This template provides a clean, scalable architecture with proper separation of concerns, allowing developers to quickly bootstrap their projects and focus on building core features.

## Features

- ✅ **Express REST API** with modular routing
- ✅ **MongoDB Integration** with Mongoose ODM and connection pooling
- ✅ **User Authentication** with PBKDF2 password hashing (SHA-512)
- ✅ **Clean Architecture** - Routes → Controllers → Models → Database
- ✅ **Password Validation** with strength requirements
- ✅ **Mongoose Models** with schema validation and static methods
- ✅ **Environment Configuration** with proper URL encoding
- ✅ **Logging** throughout the application
- ✅ **Error Handling** with appropriate HTTP status codes
- ✅ **Graceful Shutdown** for SIGTERM and SIGINT signals
- ✅ **ES Modules** (.mjs files) for modern JavaScript

## Quick Setup

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NodeJS-Mongo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your MongoDB credentials
   # For MongoDB Atlas:
   MONGODB_URL="mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"
   MONGODB_PASSWORD="your_actual_password"
   MONGODB_DATABASE="your_database_name"
   SERVER_PORT=5000
   NODE_ENV=development
   ```

4. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

   The server will start at `http://localhost:5000`

### Verify Installation

Check if the server is running:
```bash
curl http://localhost:5000/api/users/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "user_apis",
  "endpoints": [...]
}
```

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URL` | MongoDB connection string with `<password>` placeholder | Yes | `mongodb+srv://user:<password>@cluster.mongodb.net/?retryWrites=true` |
| `MONGODB_PASSWORD` | Database password (auto URL-encoded) | Yes* | `P@ssw0rd!#$%` |
| `MONGODB_DATABASE` | Database name | Yes | `my_app_db` |
| `SERVER_PORT` | Server port number | No | `5000` (default) |
| `NODE_ENV` | Environment mode | No | `development` or `production` |

*Required only if using `<password>` placeholder in `MONGODB_URL`

## API Documentation

Comprehensive API documentation is available at:

📚 **[API Documentation](docs/API_DOCS/main.md)**

Quick links:
- [User APIs](docs/API_DOCS/USER_APIS.md) - User management and authentication endpoints
- [Data Models](docs/DATA_MODELS.md) - Database schema and model definitions

## Development

### Adding New Features

1. **Add Model** - Define Mongoose schema in `models/`
2. **Add Controller** - Implement business logic in `controllers/`
3. **Add Routes** - Define API endpoints in `routes/`
4. **Register Routes** - Add to `routes/main_router.mjs`
5. **Update Docs** - Document in `docs/`


## Security Features

- ✅ Passwords hashed with PBKDF2 (100k iterations, SHA-512)
- ✅ Password strength validation
- ✅ Password fields excluded from API responses (Mongoose `select: false`)
- ✅ URL encoding for special characters in credentials
- ✅ Input validation with Mongoose schemas
- ✅ Environment-based configuration
- ✅ Graceful shutdown handlers

## Graceful Shutdown

The application properly handles shutdown signals:

- **SIGTERM** - Termination signal (e.g., from Docker, Kubernetes)
- **SIGINT** - Interrupt signal (Ctrl+C)
- **Uncaught Exceptions** - Unexpected errors
- **Unhandled Promise Rejections** - Unhandled async errors

**Shutdown Process:**
1. Stop accepting new HTTP connections
2. Close existing connections gracefully
3. Close Mongoose/MongoDB connection
4. Exit with appropriate code

## Testing

Use the included Postman collection:
```
postman_apis/User.postman_collection.json
```

Import this into Postman to test all API endpoints.


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

Built with ❤️ using Node.js, Express, and MongoDB
