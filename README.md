# Pragmatic Architecture

- **Author:** David Timmons
- **Description:** A sample project demonstrating a pragmatic, monolithic architecture for web applications
- **Objective:** Write a marketplace application where users can buy and sell widgets

## Installation

1. Install the latest LTS version of [Node.js](https://nodejs.org/en/).
2. Navigate to the root directory of this project.
3. Run `npm install` from the console.

## Running the Server

- Run `npm start` to launch the *production* server.
- Run `npm run start:dev` to launch the *development* server.

## Unit & Integration Tests

*Note: The server does NOT need to be running to run these tests.*

- Run `npm test` to run all tests.
- Run `npm run test:standard` to run all tests that do *not* require the database.
- Run `npm run test:db` to run all tests that *do* require the database.

## API Tests

*Note: The server DOES need to be running to run these commands.*

Use these *curl* commands to probe the different API routes found in this application:

```bash
# Users:
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"first_name":"Babe", "last_name":"Ruth", "email":"b.ruth@example.com"}' \
  http://localhost:8080/users

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"first_name":"Ryan", "last_name":"Laukat", "email":"r.laukat@example.com"}' \
  http://localhost:8080/users

curl --header "Content-Type: application/json" \
  --request PATCH \
  --data '{"balance":10.00}' \
  http://localhost:8080/users/2

curl http://localhost:8080/users/1

curl http://localhost:8080/users/2

# Widget:
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"id_seller":1, "description":"A very nice widget", "price":5.75}' \
  http://localhost:8080/widgets

curl http://localhost:8080/widgets/1

# Transaction:
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"buyer_id":2}' \
  http://localhost:8080/widgets/1
```

## Assumptions

- Everyone is honest.
  - *No authentication.*
  - *No authorization.*
  - *No protected API routes.*
  - *No accounting for users inappropriately modifying users or widgets.*
  - *No scrubbing external data before feeding it into the application.*
  - *No keeping the .env environment file a secret.*
- Everyone is careful.
  - *No checking API requests for the correct data.*
  - *No checking API requests for malformed content.*
- Traffic levels will be small and have no spikes.
  - *A monolithic architecture is suitable.*
  - *A lightweight database is suitable.*
  - *No database connection pools.*
  - *No database sharding, replication, or read/write splits.*
- Not all code needs comments.
  - *Simple code can stand on its own.*
  - *Well-tested code can stand on its own.*
  - *Code for "internal" audiences does not* always *need as much documentation as code for "external" audiences.*

## Design Decisions

### Split app functions into *services*, *workflows*, *database*, and *API* layers

- The API layer can call services or workflows but not the database.
- The database layer presents a facade to enable data access.
  - *Other layers are unaware of the underlying database technologies.*
  - *Other layers work with the database through the facade.*
- Services are fully encapsulated from all other services.
  - *Services cannot call other services.*
  - *Services can own their own database table.*
  - *Services cannot call database tables they do not own.*
- Workflows are the communication layer between services.
  - *Workflows can call services.*
  - *Workflows cannot call other workflows.*
  - *Workflows can own their own database tables.*
  - *Workflows cannot call database tables they do not own.*

#### Reasoning

Splitting the application in this way is intended to minimize coupling between the different components. Highly cohesive, minimally coupled components are easier to maintain and refactor without introducing bugs into the application. Additionally, minimally coupled components ease the burden of transitioning from a monolith architecture to a distributed architecture as the application grows large enough to require horizontal scaling.

### Build the API as a monolith instead of distributed among the services

- The API is its own layer.

#### Reasoning

Services and workflows could own their own API endpoints. That is a very reasonable choice. However, keeping the API unified as a single layer allows it to be handled separately from the application. It becomes its own business product. Designing an API for public (and sometimes private) use has user experience considerations that, in some circumstances, are every bit as important as the user interface. Designing a coherent API can be easier when its pieces are not sprinkled throughout the application.

### Bubble errors from the bottom to the top of the call stack

- Errors are not designed to crash the application.
  - *Everything, from database access to malformed input, may occasionally generate an error.*
  - *Useful error messages can be communicated back through the API to the end user.*

#### Reasoning

Designing the application to bubble errors creates a little more clutter in the code, but it enables the system design to communicate application status back to the end user in whatever granularity the developer desires. This can improve the user experience. Additionally, it provides a framework to intentionally communicate errors in such a way that fixing production bugs becomes easier. Some bugs make their way to users, and bugs with useful error messages are easier to triage.

### Apply consistent organization for each component

- Data access functions go in a *persistence* file.
- Application logic functions go in a *logic* file.
- Public interfaces go in an *index* file.

#### Reasoning

Consistent organization makes it easier to orient within a large codebase. It also makes it easier to know where to find the public interface that a component exposes. While TypeScript/JavaScript cannot enforce the concepts of "public" and "private" as easily as other languages, hints can be provided through code structure and file naming.

### Test persistence functions using an isolated test group targeting a test database

- Tests that can run concurrently go in a *\*.test.ts* file named after the file it tests.
- Database tests go in a *\*.db-test.ts* file named after the file it tests.
- The same database migration files will build the schema in both the production and test databases.

#### Reasoning

Carefully naming test files enables the developer to isolate test groups into slow and fast tests or tests that are effectively stateless versus tests that require extensive state. Testing data access functions can easily lead to race conditions when the testing framework runs tests concurrently. Separating stateful tests into their own group allows the test runner to specially accommodate them. Additionally, testing against a special purpose database makes it easier to test stateful functions without inadvertently corrupting the state of an important data store.

## Dependencies

- **dotenv:** Provides a framework to configure the application environment
- **express:** Common Node.js API framework
- **SQLite database:** File-based, SQL-compliant database perfect for prototyping
- **sqlite3:** Database driver for SQLite
- **sqlite:** Works with sqlite3 to enable Promise chaining and database migrations
- **@types/express:** Provides TypeScript definitions for Express.js
- **@types/node:** Provides TypeScript definitions for Node.js
- **@types/sqlite3:** Provides TypeScript definitions for the sqlite3 database driver
- **ava:** Minimalist test runner for Node.js applications
- **prettier:** Opinionated code formatter to enforce consistent style choices
- **ts-node:** Provides an environment to run TypeScript code without the need to compile it first
- **typescript:** Compiler to support the TypeScript language and statically typed JavaScript
