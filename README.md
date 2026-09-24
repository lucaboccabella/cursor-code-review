# AutoShip

AutoShip is a modern, scalable automation workflow platform designed to streamline and orchestrate complex business processes with minimal manual intervention. This project provides a comprehensive solution for managing automation workflows, integrating with external APIs, monitoring execution in real-time, and handling errors gracefully with built-in rollback capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Getting Started](#getting-started)
4. [Local Development](#local-development)
5. [Project Structure](#project-structure)
6. [Architecture](#architecture)
7. [API Endpoints](#api-endpoints)
8. [Contributing](#contributing)
9. [Troubleshooting](#troubleshooting)
10. [Support](#support)

## Overview

AutoShip enables teams to:

- **Automate repetitive business processes** with configurable workflows
- **Integrate with multiple third-party services and APIs** seamlessly
- **Monitor and track automation workflows in real-time** with visibility into execution status
- **Scale operations efficiently** with minimal infrastructure overhead
- **Handle errors gracefully** with automatic rollback capabilities and conflict detection
- **Manage branch promotions** from development to production with safety checks

Built with TypeScript and Express.js, AutoShip provides a robust foundation for building scalable automation solutions.

## Key Features

- **Workflow Automation**: Create and manage complex automation workflows with fine-grained control
- **API Integration**: Seamlessly connect with popular third-party services and custom endpoints
- **Real-time Monitoring**: Track workflow execution, performance metrics, and operational status
- **Error Handling**: Robust error handling with retry mechanisms and detailed error reporting
- **Rollback Capabilities**: Automatic rollback with conflict detection to ensure data consistency
- **Branch Management**: Promote changes from develop to main with safety verification and rollback support
- **Scalability**: Built to handle high-volume automation tasks with minimal infrastructure overhead
- **Health Checks**: Built-in health check endpoints for deployment monitoring

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v16 or higher (check with `node -v`)
- **npm** v7 or higher (check with `npm -v`)
- Basic familiarity with TypeScript and Express.js concepts
- Git for version control

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

The `npm install` command will install all project dependencies including:
- Express.js (web framework)
- TypeScript (type-safe JavaScript)
- Jest (testing framework)
- ts-node (TypeScript execution for development)
- Additional development and production dependencies

## Local Development

### Running the Development Server

Start the development server on port 3000:

```bash
npm run dev
```

You should see output like:

```
Server is running on port 3000

Available endpoints:
  GET  /api/whoami        - Get anonymous user
  POST /api/branch/promote - Promote develop to main
  POST /api/branch/rollback - Rollback main branch
  GET  /api/branch/state  - Get current branch state
  GET  /health            - Health check
```

The server will automatically reload when you make changes to the TypeScript files.

### Building for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

This generates compiled JavaScript in the `dist/` directory. The build process:
- Compiles all TypeScript files to JavaScript
- Performs type checking to catch errors
- Outputs to the `dist/` folder for deployment

### Running Tests

Run the Jest test suite:

```bash
npm test
```

For continuous testing during development:

```bash
npm run test:watch
```

Tests are located in `src/__tests__/` and use the `.test.ts` extension. Jest provides:
- Unit testing framework
- Assertion library
- Coverage reporting
- Watch mode for rapid feedback

### Production Startup

After building, start the production server:

```bash
npm start
```

This runs the compiled JavaScript from `dist/index.js` on the configured port (default 3000).

## Project Structure

```
automation-workflow/
├── src/                          # Application source code
│   ├── index.ts                  # Server entry point
│   ├── app.ts                    # Express app initialization and middleware setup
│   ├── server.ts                 # Alternative server entry point
│   ├── api.ts                    # API configuration
│   ├── api/                      # API route handlers and endpoints
│   │   ├── index.ts              # Router registration
│   │   ├── branch.ts             # Branch promotion/rollback endpoints
│   │   ├── version.ts            # Version information endpoint
│   │   ├── greeting.ts           # Greeting endpoint
│   │   ├── rollback.ts           # Rollback functionality
│   │   ├── ready.ts              # Readiness check
│   │   └── whoami.ts             # User identification
│   ├── routes/                   # Route handler modules
│   │   ├── ping.ts               # Health check (GET /ping)
│   │   ├── status.ts             # Service status (GET /status)
│   │   ├── version.ts            # Version info (GET /version)
│   │   ├── ready.ts              # Readiness probe (GET /ready)
│   │   └── markerIsolationTestA.ts # Test isolation marker
│   ├── middleware/               # Express middleware functions
│   │   └── public-routes.ts      # Public route configuration (no auth required)
│   ├── features/                 # Feature modules with isolated logic
│   │   └── readme/               # README feature module
│   │       ├── readme.route.ts   # Route handler
│   │       ├── readme.service.ts # Business logic
│   │       ├── readme.schema.ts  # Data validation schemas
│   │       └── __tests__/        # Feature-specific tests
│   ├── types/                    # TypeScript type definitions
│   │   └── express.d.ts          # Extended Express types (custom Request/Response properties)
│   ├── services/                 # Business logic and service modules
│   │   └── branchManager.ts      # Branch management logic
│   ├── rollback/                 # Rollback and conflict management
│   │   ├── handler.ts            # Rollback request processing
│   │   └── conflictManager.ts    # Conflict detection and resolution
│   └── __tests__/                # Unit tests
│       └── rollback.test.ts      # Rollback feature tests
├── tests/                        # Integration and end-to-end tests
├── dist/                         # Compiled JavaScript (generated by npm run build)
├── package.json                  # Project metadata and dependencies
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest test runner configuration
└── README.md                     # This file
```

### Directory Descriptions

| Directory | Purpose |
|-----------|----------|
| `src/` | All application source code written in TypeScript |
| `src/api/` | API route handlers that define HTTP endpoints |
| `src/routes/` | Individual route modules (ping, status, version, etc.) |
| `src/middleware/` | Express middleware for authentication, authorization, and request processing |
| `src/features/` | Feature modules with encapsulated logic, schemas, routes, and tests |
| `src/types/` | TypeScript type definitions and type extensions |
| `src/services/` | Reusable business logic and service modules |
| `src/rollback/` | Rollback handling and conflict management logic |
| `src/__tests__/` | Unit tests for core functionality |
| `tests/` | Integration and end-to-end tests |
| `dist/` | Compiled JavaScript output (created by `npm run build`) |

## Architecture

### Tech Stack

- **Express.js**: Lightweight web framework for building HTTP APIs
- **TypeScript**: Statically-typed superset of JavaScript for safer, more maintainable code
- **Jest**: Testing framework with built-in assertion library and coverage support
- **ts-node**: Enables direct execution of TypeScript files in development
- **Node.js v16+**: JavaScript runtime environment

### Application Initialization

#### Entry Points

**`src/index.ts`** - Primary server entry point:
- Imports the Express app from `src/app.ts`
- Starts the HTTP server on port 3000 (or `PORT` environment variable)
- Logs available API endpoints on startup

**`src/server.ts`** - Alternative server entry point:
- Creates Express app instance directly
- Initializes middleware and routes
- Starts the server with health check endpoint

**`src/app.ts`** - Express application setup:
- Configures Express app with middleware (JSON parsing)
- Registers route handlers from `src/api/`
- Sets up the `/health` endpoint for monitoring

### Routing Architecture

#### Router Registration

**`src/api/index.ts`** - Central router registration:
- Imports and registers all API route handlers
- Mounts routers at appropriate base paths
- Example: registers `markerIsolationTestARouter` from `src/routes/markerIsolationTestA.ts`

#### Route Handlers

**`src/routes/`** - Individual route modules:
- `ping.ts` - `GET /api/ping` - Quick health check endpoint (returns 'pong')
- `status.ts` - `GET /api/status` - Service status (returns `{ok: true}`)
- `version.ts` - `GET /api/version` - API version information
- `ready.ts` - `GET /api/ready` - Readiness probe for deployment orchestration
- `markerIsolationTestA.ts` - Test isolation marker for CI/CD pipelines

**`src/api/`** - API-specific handlers:
- `branch.ts` - Branch promotion and rollback endpoints
- `whoami.ts` - User identification endpoint
- `version.ts` - Version endpoint implementation
- `greeting.ts` - Greeting endpoint
- `rollback.ts` - Rollback-specific API endpoint
- `ready.ts` - Readiness API endpoint

#### Public Routes

**`src/middleware/public-routes.ts`** - Route access control:
- Defines routes accessible without authentication (`/api/ping`)
- Provides `isPublicRoute()` utility function for middleware
- Used by authentication middleware to skip auth for public endpoints

### Feature Modules

**`src/features/`** - Encapsulated feature implementations:
- Each feature is a self-contained module with routes, services, schemas, and tests
- Example: `readme/` feature includes:
  - `readme.route.ts` - HTTP route handler
  - `readme.service.ts` - Business logic
  - `readme.schema.ts` - Data validation schemas
  - `__tests__/` - Feature-specific tests

### Core Services

**`src/services/branchManager.ts`** - Branch management logic:
- Handles branch state tracking
- Coordinates promotion from develop to main
- Manages rollback operations

### Rollback and Conflict Management

**`src/rollback/handler.ts`** - Rollback processing:
- `processRollback()` - Main function to execute rollback requests
- `RollbackRequest` interface - Defines rollback operation parameters
- `RollbackResult` interface - Describes rollback operation outcomes
- Integrates with conflict manager for safety

**`src/rollback/conflictManager.ts`** - Conflict detection:
- Detects conflicts between pending operations
- Prevents concurrent modifications to same resources
- Ensures data consistency across rollback operations

### Type Definitions

**`src/types/express.d.ts`** - Express type extensions:
- Extends Express Request interface with custom properties (e.g., `userId`)
- Provides TypeScript support for custom request attributes
- Ensures type safety throughout the application

## API Endpoints

### Health & Status Checks

```bash
# Health check
GET /health
Response: {"status": "ok"}

# Service status
GET /api/status
Response: {"ok": true}

# Ping endpoint (no auth required)
GET /api/ping
Response: pong (text/plain)

# Readiness probe
GET /api/ready
```

### Information Endpoints

```bash
# API version
GET /api/version
Response: {version: "x.x.x", ...}

# User identification
GET /api/whoami
Response: {userId: "...", ...}
```

### Branch Management

```bash
# Promote develop to main
POST /api/branch/promote
Body: {operationId: "...", ...}
Response: {success: true, ...}

# Rollback main branch
POST /api/branch/rollback
Body: {operationId: "...", affectedResources: [...]}
Response: {success: true, message: "Rollback completed successfully", ...}

# Get branch state
GET /api/branch/state
Response: {currentBranch: "main", ...}
```

### Environment Variables

Configure the application with environment variables:

```bash
# Server port (default: 3000)
PORT=3000

# Node environment
NODE_ENV=development  # or 'production'
```

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is valued.

### Contribution Workflow

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/autoship.git
   cd autoship
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit with clear messages:
   ```bash
   git add .
   git commit -m "feat: add new feature" # Use conventional commits
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** with a clear description of your changes

### Code Quality Standards

When contributing, please follow these standards:

- **TypeScript**: Write all code in TypeScript with proper type annotations
- **Testing**: Add tests for new features in `src/__tests__/` or feature-specific `__tests__/` directories
- **Linting**: Code should follow the existing style conventions
- **Documentation**: Update README.md if you change directory structure or add major features
- **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `test:` for test additions
  - `refactor:` for code refactoring

### Running Tests Before Submission

Always run tests before submitting a pull request:

```bash
npm test              # Run all tests once
npm run test:watch   # Run tests in watch mode during development
npm run build        # Verify TypeScript compilation
```

### Adding New Features

When adding a new feature:

1. Create a feature module in `src/features/` with the following structure:
   ```
   src/features/my-feature/
   ├── my-feature.route.ts
   ├── my-feature.service.ts
   ├── my-feature.schema.ts
   └── __tests__/
       └── my-feature.test.ts
   ```

2. Add route exports to `src/api/index.ts`

3. Write comprehensive tests covering happy paths and error cases

4. Update README.md if adding new public endpoints or changing the architecture

## Troubleshooting

Common issues and solutions when setting up and running AutoShip:

### Node Version Mismatch

**Problem**: `npm install` fails or `npm run dev` throws errors about Node features

**Solution**:
```bash
# Check your Node version
node -v

# You need v16 or higher. Install nvm (Node Version Manager):
# https://github.com/nvm-sh/nvm

# Switch to Node v16+
nvm install 16
nvm use 16

# Verify the version
node -v  # Should be v16.0.0 or higher
```

### npm Install Failures

**Problem**: `npm install` fails with peer dependency warnings or cache errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Port 3000 Already in Use

**Problem**: `npm run dev` fails with "EADDRINUSE: address already in use :::3000"

**Solution**:
```bash
# Option 1: Kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use a different port
PORT=3001 npm run dev
```

### TypeScript Compilation Errors

**Problem**: `npm run build` fails with TypeScript errors

**Solution**:
```bash
# Check the specific errors
npm run build

# Review the error messages carefully
# Common issues:
# - Missing type definitions: npm install @types/package-name
# - Type mismatches: Check variable assignments and function parameters
# - Missing imports: Add import statements for used modules

# After fixing errors, rebuild
npm run build
```

### Test Failures

**Problem**: `npm test` shows unexpected test failures

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Run tests again
npm test

# For specific test file
npm test -- src/__tests__/rollback.test.ts

# Watch mode helps with debugging
npm run test:watch
```

### Server Won't Start

**Problem**: `npm run dev` starts but crashes immediately

**Solution**:
```bash
# Check the error output for clues
npm run dev

# Common causes:
# 1. TypeScript errors - run npm run build to check
# 2. Missing dependencies - run npm install
# 3. Environment configuration - check process.env usage
# 4. File not found - verify all imports are correct

# After fixing the issue, restart
npm run dev
```

### Hot Reload Not Working

**Problem**: Changes to files don't automatically reload the dev server

**Solution**:
```bash
# ts-node watch mode may have issues
# Try restarting the dev server:
Ctrl+C  # Stop the server
npm run dev  # Restart

# If problems persist, use a file watcher:
# npm install --save-dev nodemon
# Update package.json "dev" script to use nodemon
```

## Support

Need help? Here are the best ways to get support:

### Getting Help

1. **Check Existing Issues**: Browse [GitHub Issues](https://github.com/your-org/autoship/issues) to see if your question has been answered

2. **Documentation**: Review this README and inline code comments first

3. **Open an Issue**: If you find a bug, [create a GitHub issue](https://github.com/your-org/autoship/issues/new) with:
   - Clear title describing the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (Node version, OS, etc.)

4. **Discussions**: For general questions and discussions, use [GitHub Discussions](https://github.com/your-org/autoship/discussions)

### Contact Information

- **Repository**: GitHub (see link in package.json)
- **Issues**: File bugs and feature requests on GitHub Issues
- **Development Team**: Contact via repository maintainers

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful of others and follow common sense in all interactions.

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Last Updated**: 2024

For the latest information, visit the [repository](https://github.com/your-org/autoship) or check the inline code documentation.
