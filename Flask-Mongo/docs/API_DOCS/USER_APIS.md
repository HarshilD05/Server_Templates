# User APIs Documentation

Complete documentation for user management and authentication endpoints.

## Table of Contents

- [Create User](#create-user)
- [Get User by ID](#get-user-by-id)
- [Get User by Email](#get-user-by-email)
- [Get All Users](#get-all-users)
- [Change Password](#change-password)
- [Health Check](#health-check)

---

## Create User

Create a new user with optional password authentication.

### Endpoint
```http
POST /users
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `user_type` | string | Yes | User type: `ADMIN` or `USER` |
| `password` | string | No | Password (min 8 chars, must include uppercase, lowercase, digit, special char) |

### Example Request

**With Password:**
```json
{
  "email": "john.doe@example.com",
  "user_type": "USER",
  "password": "SecureP@ss123"
}
```

**Without Password (External Auth):**
```json
{
  "email": "admin@example.com",
  "user_type": "ADMIN"
}
```

### Response

**Success (201 Created):**
```json
{
  "message": "User created successfully",
  "user_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@example.com",
  "user_type": "USER",
  "has_password": true
}
```

**Error Responses:**

*Missing Required Fields (400):*
```json
{
  "error": "email and user_type are required"
}
```

*Invalid Email Format (400):*
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

*Weak Password (400):*
```json
{
  "error": "Password must contain at least one uppercase letter"
}
```

*Duplicate Email (409):*
```json
{
  "error": "User with this email already exists"
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "user_type": "USER",
    "password": "SecureP@ss123"
  }'
```

---

## Get User by ID

Retrieve a specific user by their ID.

### Endpoint
```http
GET /users/{user_id}
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | MongoDB ObjectId of the user |

### Response

**Success (200 OK):**
```json
{
  "message": "User retrieved successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "user_type": "USER",
    "chats": ["507f191e810c19729de860ea"],
    "created_at": "2026-02-12T10:30:00",
    "updated_at": "2026-02-12T10:30:00"
  }
}
```

**Error Response:**

*User Not Found (404):*
```json
{
  "error": "User not found"
}
```

### cURL Example
```bash
curl -X GET http://localhost:3000/users/507f1f77bcf86cd799439011
```

### Notes
- Password hash is automatically excluded from the response for security
- Returns all user fields including chat references

---

## Get User by Email

Retrieve a user by their email address.

### Endpoint
```http
GET /users/email/{email}
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | User's email address |

### Response

**Success (200 OK):**
```json
{
  "message": "User retrieved successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "user_type": "USER",
    "chats": [],
    "created_at": "2026-02-12T10:30:00",
    "updated_at": "2026-02-12T10:30:00"
  }
}
```

**Error Response:**

*User Not Found (404):*
```json
{
  "error": "User not found"
}
```

### cURL Example
```bash
curl -X GET http://localhost:3000/users/email/john.doe@example.com
```

### Notes
- Email parameter is case-sensitive
- Password hash is excluded from response

---

## Get All Users

Retrieve a paginated list of all users.

### Endpoint
```http
GET /users
```

### Query Parameters

| Parameter | Type | Required | Default | Max | Description |
|-----------|------|----------|---------|-----|-------------|
| `limit` | integer | No | 50 | 100 | Number of users to return |
| `skip` | integer | No | 0 | - | Number of users to skip |

### Response

**Success (200 OK):**
```json
{
  "message": "Users retrieved successfully",
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "user_type": "USER",
      "chats": [],
      "created_at": "2026-02-12T10:30:00",
      "updated_at": "2026-02-12T10:30:00"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "email": "jane.smith@example.com",
      "user_type": "ADMIN",
      "chats": ["507f191e810c19729de860ea"],
      "created_at": "2026-02-11T09:15:00",
      "updated_at": "2026-02-12T08:20:00"
    }
  ],
  "count": 2,
  "limit": 50,
  "skip": 0
}
```

**Error Response:**

*Invalid Pagination (400):*
```json
{
  "error": "Invalid pagination parameters"
}
```

### cURL Example
```bash
# Get first 20 users
curl -X GET "http://localhost:3000/users?limit=20&skip=0"

# Get next 20 users
curl -X GET "http://localhost:3000/users?limit=20&skip=20"
```

### Notes
- Maximum limit is 100 per request
- Password hashes are excluded from all user objects
- Results are not sorted by default

---


## Change Password

Change a user's password with old password verification.

### Endpoint
```http
PUT /users/{user_id}/change-password
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | Yes | MongoDB ObjectId of the user |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `old_password` | string | Yes | Current password |
| `new_password` | string | Yes | New password (must meet strength requirements) |

### Example Request
```json
{
  "old_password": "OldP@ssw0rd123",
  "new_password": "NewSecureP@ss456"
}
```

### Response

**Success (200 OK):**
```json
{
  "message": "Password changed successfully",
  "user_id": "507f1f77bcf86cd799439011"
}
```

**Error Responses:**

*Missing Fields (400):*
```json
{
  "error": "old_password and new_password are required"
}
```

*User Not Found (404):*
```json
{
  "error": "User not found"
}
```

*No Password Set (400):*
```json
{
  "error": "User does not have a password set"
}
```

*Invalid Old Password (401):*
```json
{
  "error": "Invalid old password"
}
```

*Weak New Password (400):*
```json
{
  "error": "Password must contain at least one uppercase letter"
}
```

*Same Password (400):*
```json
{
  "error": "New password must be different from old password"
}
```

### cURL Example
```bash
curl -X PUT http://localhost:3000/users/507f1f77bcf86cd799439011/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "OldP@ssw0rd123",
    "new_password": "NewSecureP@ss456"
  }'
```

### Notes
- Old password must be correct
- New password must meet all strength requirements
- New password cannot be the same as old password
- Password is hashed with bcrypt before storage

---

## Health Check

Check the health status of the User API service.

### Endpoint
```http
GET /users/health
```

### Response

**Success (200 OK):**
```json
{
  "status": "healthy",
  "service": "user_apis",
  "endpoints": [
    "POST /users - Create user",
    "GET /users - Get all users (with pagination)",
    "GET /users/{user_id} - Get user by ID",
    "GET /users/{user_id}/chats - Get user chats",
    "GET /users/email/{email} - Get user by email",
    "PUT /users/{user_id}/change-password - Change user password"
  ]
}
```

### cURL Example
```bash
curl -X GET http://localhost:3000/users/health
```
