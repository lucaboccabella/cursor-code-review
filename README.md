# Add README

This feature lets authorized users attach a `README.md` document to a project.

## Endpoint

```
POST /api/projects/:projectId/readme
```

### Auth

Requires an authenticated user whose role on the target project is `owner`,
`maintainer`, or a global `admin`. Everyone else receives `403 Forbidden`.
Unauthenticated requests receive `401 Unauthorized`.

### Request body

| Field      | Type     | Required | Notes                                              |
| ---------- | -------- | -------- | -------------------------------------------------- |
| `content`  | `string` | yes      | 1–100,000 characters of Markdown.                   |
| `filename` | `string` | no       | Defaults to `README.md`. Must match `*.md`/`*.markdown`, no path separators. |
| `overwrite`| `boolean`| no       | Defaults to `false`. Required to replace an existing README. |

### Responses

| Status | Meaning                                                      |
| ------ | ------------------------------------------------------------ |
| `201`  | README created.                                               |
| `200`  | Existing README replaced (`overwrite: true`).                 |
| `400`  | Validation failure — body contains a descriptive `message`.   |
| `401`  | Missing/invalid session.                                      |
| `403`  | Caller lacks the required project role.                       |
| `404`  | Project not found.                                            |
| `409`  | README already exists and `overwrite` was not set.            |

### Example

```bash
curl -X POST https://api.example.com/api/projects/42/readme \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $TOKEN' \
  -d '{ "content": "# My project\n\nHello.", "overwrite": false }'
```

```json
{
  "readme": {
    "projectId": "42",
    "filename": "README.md",
    "content": "# My project\n\nHello.",
    "updatedAt": "2024-05-01T12:00:00.000Z",
    "updatedBy": "user_7"
  }
}
```
