# Data Models Documentation

This document describes all data models used in the Flask-MongoDB Template Server.

## Table of Contents

- [Overview](#overview)
- [Models List](#models-list)
  - [UserType Enum](#usertype-enum)
  - [User Model](#user-model)

---

## Overview

All data models are defined using **Pydantic** for robust validation and type checking. Models are stored in MongoDB as documents and validated before database operations.

### Technology Stack

- **Pydantic**: Data validation and schema definition
- **MongoDB**: Document-based NoSQL database
- **BSON ObjectId**: Primary key for all documents


---

## Models List

### UserType Enum

**Location:** `models/user.py`

**Class:** `UserType`

| Value | Description |
|-------|-------------|
| `ADMIN` | Administrator with full system access |
| `USER` | Regular user with standard permissions |

---

### User Model

The User model represents an authenticated user in the system with optional password-based authentication.

**Location:** `models/user.py`

**Class:** `UserModel`

#### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `email` | EmailStr | Yes | - | User's email address (validated format) |
| `user_type` | UserType | Yes | - | User role/type (ADMIN or USER) |
| `password_hash` | str | No | None | Bcrypt hashed password (includes salt) |
| `created_at` | datetime | No | None | UTC timestamp of user creation |
| `updated_at` | datetime | No | None | UTC timestamp of last update |

#### MongoDB Document Example

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "john.doe@example.com",
  "user_type": "USER",
  "password_hash": "$2b$12$KIXqJvCfQX.yGPZe6X4QYO8JQn4gQ7r...",
  "created_at": ISODate("2026-02-12T10:30:00.000Z"),
  "updated_at": ISODate("2026-02-12T14:45:00.000Z")
}
```

