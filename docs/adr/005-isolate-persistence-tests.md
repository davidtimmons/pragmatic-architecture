# Test persistence functions using an isolated test group that targets a test database

## Status

Accepted

## Context

Features that require access to the database can be difficult to test. In the worst outcomes, running database-related tests can lead to intermittently failing tests despite correct logic when the database state unexpectedly changes and data races occur. Mocking the database is an option, but that requires considerable work as the application grows. Dependency injection is another option, but this can require explicitly rewriting features to support it. Arguably the simplest approach is to isolate tests that need the database and run them against a live test database that perfectly mirrors the schema found in the production database.

## Decision

- Tests that can run concurrently go in *\*.test.\** files named after the files they test.
- Database tests go in *\*.db-test.\** files named after the files they test.
- The same database migration files build a schema in both the production and test databases.

## Consequences

Carefully naming test files enables the developer to isolate test groups into slow and fast tests or tests that are effectively stateless versus tests that require extensive state. Testing data access functions can easily lead to race conditions when the testing framework runs tests concurrently. Separating stateful tests into their own group allows the test runner to specially accommodate them. Additionally, testing against a special purpose database makes it easier to test stateful functions without inadvertently corrupting the state of an important data store.
