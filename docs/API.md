# SPL API Documentation

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Headers

```
Authorization: Bearer <access_token>
```

### Token Refresh

Access tokens expire in 15 minutes. Use the refresh token to get new tokens.

---

## Endpoints

### Auth

#### POST /auth/register

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "jwt...",
      "refreshToken": "jwt..."
    }
  },
  "message": "Conta criada com sucesso"
}
```

#### POST /auth/login

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "jwt...",
      "refreshToken": "jwt..."
    }
  }
}
```

#### POST /auth/refresh

Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "jwt..."
}
```

#### GET /auth/profile

Get current user profile. Requires authentication.

#### POST /auth/change-password

Change user password. Requires authentication.

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

---

### Companies

All endpoints require authentication.

#### GET /companies

List user's companies.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `search` (string): Search by name or CNPJ

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### GET /companies/:id

Get company details.

#### POST /companies

Create a new company.

**Request Body:**
```json
{
  "cnpj": "11222333000181",
  "razaoSocial": "Empresa LTDA",
  "nomeFantasia": "Minha Empresa",
  "email": "empresa@example.com",
  "phone": "92999999999",
  "state": "AM",
  "city": "Manaus",
  "address": "Rua das Flores, 123",
  "cnaePrincipal": "0111301",
  "cnaesSecundarios": ["0112101", "0113000"]
}
```

#### PATCH /companies/:id

Update company.

#### DELETE /companies/:id

Delete company.

#### GET /companies/lookup/cnpj/:cnpj

Lookup company data from Receita Federal.

**Response:**
```json
{
  "success": true,
  "data": {
    "cnpj": "11222333000181",
    "razaoSocial": "EMPRESA EXEMPLO LTDA",
    "nomeFantasia": "EXEMPLO",
    "email": "contato@exemplo.com",
    "state": "AM",
    "city": "Manaus",
    "cnaePrincipal": "0111301",
    "cnaePrincipalDescricao": "Cultivo de arroz",
    "cnaesSecundarios": [...]
  }
}
```

#### GET /companies/:id/obligations

List company obligations.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status (pending, in_progress, completed, overdue)
- `riskLevel`: Filter by risk (low, medium, high, critical)
- `category`: Filter by category
- `agency`: Filter by agency

#### POST /companies/:id/generate-obligations

Generate legal obligations based on CNAEs and location.

---

### Obligations

All endpoints require authentication.

#### GET /obligations

List all user's obligations across all companies.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `riskLevel`: Filter by risk level

#### GET /obligations/:id

Get obligation details.

#### POST /obligations

Create new obligation.

**Request Body:**
```json
{
  "companyId": "uuid",
  "code": "OL-001",
  "title": "Licença Ambiental",
  "description": "Renovação da licença ambiental",
  "category": "Ambiental",
  "agency": "IPAAM",
  "riskLevel": "high",
  "deadline": "2024-12-31T00:00:00Z",
  "priority": "high"
}
```

#### PATCH /obligations/:id

Update obligation.

#### PATCH /obligations/:id/status

Update obligation status.

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Valid statuses:** `pending`, `in_progress`, `completed`, `overdue`, `not_applicable`

#### DELETE /obligations/:id

Delete obligation.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message in Portuguese",
  "errors": {
    "field": ["Validation error 1", "Validation error 2"]
  }
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| General | 100 req / 15 min |
| Auth (login/register) | 10 req / 15 min |
| API endpoints | 60 req / 1 min |
| Scraping (CNPJ lookup) | 5 req / 1 min |

---

## Health Check

#### GET /health

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-12-04T12:00:00.000Z",
    "version": "1.0.0"
  }
}
```
