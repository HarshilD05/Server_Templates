# API Documentation

Welcome to the Node.js-Express-MongoDB Template Server API documentation. This server provides RESTful APIs for user management with built-in authentication.

## Base URL

```
http://localhost:5000
```

## Available API Modules

### 1. [User APIs](USER_APIS.md)
User management and authentication endpoints including:
- User registration with password
- User retrieval and listing
- Password management
- User profile operations

## API Standards

### Response Format

All API responses follow a consistent JSON format:

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request succeeded |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid input or validation error |
| `401` | Unauthorized - Authentication failed |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `500` | Internal Server Error - Server error |

### Common Headers

**Request Headers:**
```
Content-Type: application/json
```

**Response Headers:**
```
Content-Type: application/json
```

## Authentication

Currently, this template includes basic password-based authentication. You can extend it with JWT tokens, OAuth, or other authentication mechanisms as needed.

### Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

## Pagination

APIs that return lists support pagination through query parameters:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | integer | 50 | 100 | Number of items to return |
| `skip` | integer | 0 | - | Number of items to skip |

**Example:**
```
GET /api/users?limit=20&skip=40
```

## Data Models

For detailed information about data structures and schemas, see:
- [Data Models Documentation](../DATA_MODELS.md)

## Error Handling

### Validation Errors

When Mongoose validation fails:
```json
{
  "error": "Validation error",
  "details": [
    {
      "loc": ["field_name"],
      "msg": "error message",
      "type": "error_type"
    }
  ]
}
```

### Common Errors

**Missing Required Fields:**
```json
{
  "error": "email and user_type are required"
}
```

**Invalid Email Format:**
```json
{
  "error": "Validation error",
  "details": [
    {
      "loc": ["email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

**Duplicate Email:**
```json
{
  "error": "User with this email already exists"
}
```

## Testing

### Health Check

Every API module includes a health check endpoint:

```bash
GET /api/users/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "user_apis",
  "endpoints": [
    "POST /api/users - Create user",
    "GET /api/users - Get all users (with pagination)",
    "..."
  ]
}
```

### Postman Collection

Import the Postman collection for easy API testing:
```
postman_apis/User.postman_collection.json
```

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider adding:
- express-rate-limit
- Redis-based rate limiting
- API Gateway rate limiting
