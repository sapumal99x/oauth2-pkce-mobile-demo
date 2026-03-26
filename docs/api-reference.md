# API Reference

## `GET /api/authorize`

Issues an authorization code and redirects to callback URI.

### Query params

- `client_id` (required)
- `redirect_uri` (required)
- `code_challenge` (required)
- `sso_user_id` (optional)
- `sso_user_email` (optional)

### Example request

```http
GET /api/authorize?client_id=mobile-demo-client&redirect_uri=myapp%3A%2F%2Fcallback&code_challenge=abc123
```

### Example response

- HTTP `307 Temporary Redirect`
- `Location: myapp://callback?code=xyz123`

## `POST /api/token`

Exchanges authorization code for access token after PKCE validation.

### JSON body

- `code` (required)
- `code_verifier` (required)

### Example request

```http
POST /api/token
Content-Type: application/json

{
  "code": "xyz123",
  "code_verifier": "very-long-random-verifier"
}
```

### Example success response

```json
{
  "access_token": "mock_token",
  "token_type": "Bearer"
}
```

### Example error response

```json
{
  "error": "PKCE verification failed"
}
```

## `GET /api/sso-provider`

Simulates an external identity provider and redirects back to authorize endpoint with mock user identity.

### Query params

- `client_id` (required)
- `redirect_uri` (required)
- `code_challenge` (required)

### Example request

```http
GET /api/sso-provider?client_id=mobile-demo-client&redirect_uri=myapp%3A%2F%2Fcallback&code_challenge=abc123
```

### Example behavior

- Creates mock user:
  - `id: mock_user_<random>`
  - `email: mock_user_<random>@example.com`
- Redirects to `/api/authorize` with user identity attached as query params.
