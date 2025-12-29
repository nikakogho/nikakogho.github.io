Hyper-Text Transfer Protocol
Layer 7 (application layer) protocol

Most common for accessing websites and all that

Uses [[TCP]] under the hood.
Today every website is expected to use [[HTTPS]].

## Commands
- GET - read content
- POST - insert
- PUT - update with this new object
- PATCH - update just these given fields (less common)
- DELETE

## Status Codes
### 1XX - Informational
- 100 - Continue

### 2XX - Success
- 200 - OK (most common)
- 202 - Accepted (for asynchronous processes)
- 207 - Multi-Status (partial success for a list of actions)

### 3XX - Redirect
- 301 - Moved Permanently

### 4XX - Client Error
- 400 - Bad Request
- 401 - Unauthorized
- 404 - Not Found
- 429 - Too Many Requests (rate limiting)

### 5XX - Server Error
- 500 - Internal Server Error
