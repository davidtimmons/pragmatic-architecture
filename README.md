# Pragmatic Monolith Architecture

This is a sample project demonstrating a pragmatic monolith architecture for web applications.

## Contents

- [Overview](#overview)
- [Simplifying Assumptions](#simplifying-assumptions)
- [Design Decisions](#design-decisions)
- [Installation](#installation)
  - [Running the Server](#running-the-server)
  - [Automated Tests](#automated-tests)
  - [Manual API Tests](#manual-api-tests)
- [Project Dependencies](#project-dependencies)

## Overview

This project features a simple marketplace where users can buy and sell widgets. Domain specific logic is intentionally minimal, existing only to demonstrate the broader concepts. The point of this example is to show a possible architecture for small to mid-sized applications that is easy to understand, easy to maintain, and easy to scale. To that end, this architecture incorporates a strict separation of concerns enabling an engineering team to gradually break off components from the original application into independent applications as bottlenecks become apparent through stress testing or production usage. The overall goal of this design is to start simple but retain the flexibility to grow in the direction needed as an application scales.

## Simplifying Assumptions

This is a simple application. It is not intended to include every feature and security measure required of a real world application. Accordingly, the following design considerations are in effect:

- Every user is honest.
  - *No authentication.*
  - *No authorization.*
  - *No protected API routes.*
  - *No accounting for users inappropriately modifying users or widgets.*
  - *No scrubbing external data before feeding it into the application.*
  - *No keeping the .env environment file a secret.*
- Every user is careful.
  - *No checking API requests for the correct data.*
  - *No checking API requests for malformed content.*
- Traffic levels will start small and have no spikes.
  - *A monolithic architecture is suitable.*
  - *A lightweight database is suitable.*
  - *No database connection pools.*
  - *No database sharding, replication, or read/write splits.*
- Not all code needs comments.
  - *Simple code can stand on its own.*
  - *Well-tested code can stand on its own.*
  - *Code for "internal" audiences does not* always *need as much documentation as code for "external" audiences.*

## Design Decisions

This project includes "Architecture Decision Records" (ADR) to document its structure. These are the decisions that "affect the structure, non-functional characteristics, dependencies, interfaces, or construction techniques" of the application (see "[Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)" by Michael Nygard). For the design decisions affecting this project, see [docs/adr](./docs/adr).

## Installation

Installation is unnecessary for the purposes of this example project. However, this is still a working application that interested developers can run if desired. Follow these steps to get started:

1. Install the latest LTS version of [Node.js](https://nodejs.org/en/).
2. Navigate to the root directory of this project.
3. Run `npm install` from the console.

### Running the Server

- Run `npm start` to launch the *production* server.
- Run `npm run start:dev` to launch the *development* server.

### Automated Tests

*Note: The server does NOT need to be running to run these tests.*

- Run `npm test` to run all tests.
- Run `npm run test:standard` to run all tests that do *not* require the database.
- Run `npm run test:db` to run all tests that *do* require the database.

### Manual API Tests

*Note: The server DOES need to be running to run these commands.*

Use these *curl* commands to probe the different API routes found in this application:

```bash
# Users:
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"first_name":"Babe", "last_name":"Ruth", "email":"bruth@example.com"}' \
  http://localhost:8080/users

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"first_name":"Ryan", "last_name":"Laukat", "email":"rlaukat@example.com"}' \
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

## Project Dependencies

- **dotenv:** Provides a framework to configure the application environment
- **express:** Common Node.js API framework
- **neverthrow:** Expressive type framework to handle possible error results
- **SQLite database:** File-based, SQL-compliant database perfect for prototyping
- **sqlite3:** Database driver for SQLite
- **sqlite:** Works with sqlite3 to enable promise chaining and database migrations
- **@types/express:** Provides TypeScript definitions for Express.js
- **@types/node:** Provides TypeScript definitions for Node.js
- **@types/sqlite3:** Provides TypeScript definitions for the sqlite3 database driver
- **ava:** Minimalist test runner for Node.js applications
- **prettier:** Opinionated code formatter to enforce consistent style choices
- **ts-node:** Provides an environment to run TypeScript code without the need to compile it first
- **typescript:** Compiler to support the TypeScript language and statically typed JavaScript
