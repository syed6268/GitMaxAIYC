# GrantMax Backend

Simple Express.js backend to receive FOA and grant package PDF uploads.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoint

### POST /api/upload

Accepts multipart/form-data with:
- `foaDocument` (file): FOA PDF document (optional if foaUrl is provided)
- `foaUrl` (string): FOA URL (optional if foaDocument is provided)
- `grantPackages` (files): Grant package documents (multiple files allowed)

#### Response
```json
{
  "success": true,
  "message": "Documents uploaded successfully",
  "data": {
    "foaDocument": {
      "filename": "...",
      "originalName": "...",
      "size": 123456,
      "path": "..."
    },
    "foaUrl": "...",
    "grantPackages": [...]
  }
}
```

## Port

Server runs on port 3001 by default.
