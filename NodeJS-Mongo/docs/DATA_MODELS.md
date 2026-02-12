# Data Models Documentation

This document describes all data models used in the Node.js-Express-MongoDB Template Server.

## Table of Contents

- [Overview](#overview)
- [Models List](#models-list)
  - [UserType Enum](#usertype-enum)
  - [User Model](#user-model)

---

## Overview

All data models are defined using **Mongoose** schemas for robust validation and type checking. Models are stored in MongoDB as documents and validated before database operations.

### Technology Stack

- **Mongoose**: ODM (Object Data Modeling) library with schema-based validation
- **MongoDB**: Document-based NoSQL database
- **BSON ObjectId**: Primary key for all documents


---

## Models List

### UserType Enum

**Location:** `models/user.mjs`

**Constant:** `UserType`

| Value | Description |
|-------|-------------|
| `ADMIN` | Administrator with full system access |
| `USER` | Regular user with standard permissions |

---

### User Model

The User model represents an authenticated user in the system with optional password-based authentication.

**Location:** `models/user.mjs`

**Model:** `User` (Mongoose Model)

#### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `email` | String | Yes | - | User's email address (validated format, lowercase) |
| `user_type` | String | Yes | - | User role/type (ADMIN or USER, enum validated) |
| `password_salt` | String | No | null | Random 32-byte salt (hexadecimal, excluded from queries) |
| `password_hash` | String | No | null | PBKDF2 hashed password with SHA-512 (excluded from queries) |
| `created_at` | Date | Auto | - | UTC timestamp of user creation (auto-managed) |
| `updated_at` | Date | Auto | - | UTC timestamp of last update (auto-managed) |

#### MongoDB Document Example

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "john.doe@example.com",
  "user_type": "USER",
  "password_salt": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  "password_hash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08c7f4dfc2d6e1234567890abcdef1234567890abcdef1234567890abcdef123456",
  "created_at": ISODate("2026-02-12T10:30:00.000Z"),
  "updated_at": ISODate("2026-02-12T14:45:00.000Z")
}
```

**Note:** `password_salt` and `password_hash` are hexadecimal strings generated using PBKDF2 with SHA-512.

