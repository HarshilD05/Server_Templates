# Flask + MongoDB Template Server

A production-ready template server built with Flask and MongoDB, featuring basic user authentication with password hashing (bcrypt). This template provides a clean, scalable architecture with proper separation of concerns, allowing developers to quickly bootstrap their projects and focus on building core features.

## Features

- ✅ **Flask REST API** with Blueprint-based routing
- ✅ **MongoDB Integration** with connection pooling
- ✅ **User Authentication** with bcrypt password hashing
- ✅ **Clean Architecture** - Routes → Controllers → Utils → Database
- ✅ **Password Validation** with strength requirements
- ✅ **Pydantic Models** for data validation
- ✅ **Environment Configuration** with proper URL encoding
- ✅ **Logging** throughout the application
- ✅ **Error Handling** with appropriate HTTP status codes

## Quick Setup

### Prerequisites

- Python 3.8 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Flask-Mongo
   ```

2. **Create and activate virtual environment**
   ```bash
   # Create virtual environment
   python -m venv .venv

   # Activate on Windows
   .venv\Scripts\activate

   # Activate on macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your MongoDB credentials
   # For MongoDB Atlas:
   MONGODB_URL="mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"
   MONGODB_PASSWORD="your_actual_password"
   MONGODB_DATABASE="your_database_name"
   SERVER_PORT=3000
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

   The server will start at `http://localhost:3000`

### Verify Installation

Check if the server is running:
```bash
curl http://localhost:3000/users/health
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
| `SERVER_PORT` | Server port number | No | `3000` (default) |

*Required only if using `<password>` placeholder in `MONGODB_URL`

## API Documentation

Comprehensive API documentation is available at:

📚 **[API Documentation](docs/API_DOCS/main.md)**

Quick links:
- [User APIs](docs/API_DOCS/USER_APIS.md) - User management and authentication endpoints
- [Data Models](docs/DATA_MODELS.md) - Database schema and model definitions

## Development

### Adding New Features

1. **Add Model** - Define your data structure in `models/`
2. **Add Utils** - Create database operations in `utils/`
3. **Add Controller** - Implement business logic in `controllers/`
4. **Add Routes** - Define API endpoints in `routes/`
5. **Register Blueprint** - Add to `app.py`

### Code Architecture

**Routes** (HTTP layer)
- Handle request/response
- Parse query params
- Call controllers

**Controllers** (Business logic)
- Validate input
- Apply business rules
- Return (response_dict, status_code)

**Utils** (Data layer)
- Database operations
- Data transformations
- External service calls

**Models** (Schema)
- Pydantic models for validation
- Data structure definitions

## Security Features

- ✅ Passwords hashed with bcrypt (auto-salted)
- ✅ Password strength validation
- ✅ Password hash excluded from API responses
- ✅ URL encoding for special characters in credentials
- ✅ Input validation with Pydantic
- ✅ Environment-based configuration

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

Built with ❤️ using Flask and MongoDB
