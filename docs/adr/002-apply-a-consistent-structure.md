# Apply a consistent structure to all similar components

## Status

Accepted

## Context

One tradeoff when decoupling software components is that every part of the application can have a different code structure. When the structure of a component radically diverges from other components, this makes it more difficult to orient within specific parts of the application. Consistency across the application is a better approach because it decreases the cognitive load that comes with understanding a component well enough to change it.

## Decision

- Data access functions go in a *persistence* file.
  - *Persistence files are intended to modify or return database state.*
  - *Persistence files do not contain business logic.*
- Application logic functions go in a *logic* file.
  - *Logic files apply business logic as needed before calling a persistence function.*
  - *Logic files may simply re-export persistence functions.*
- Public interfaces go in an *index* file.
  - *Index files expose logic functions.*
  - *Index files expose types as necessary.*
  - *Index files refrain from exporting persistence functions.*
- Files export private functions and types as needed for testing.
  - *Functions and types intended to be private are not included in the default export.*

## Consequences

Consistent organization makes it easier to orient within a large codebase. It also makes it easier to know where to find the public interface that a component exposes. While TypeScript/JavaScript cannot enforce the concepts of "public" and "private" as easily as other languages, hints can be provided through code structure and file naming.
