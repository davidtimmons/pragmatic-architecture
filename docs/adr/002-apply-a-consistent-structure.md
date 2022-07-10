# Apply a consistent structure to all similar components

## Status

Accepted

## Context

One downside to decoupling software components is that every part of the application can potentially have a radically different code structure. When the structure of a component diverges from other components, this makes it more difficult to quickly orient within unrelated parts of the application. Consistency across the application is a better approach because it decreases the cognitive load that comes with understanding a component well enough to change it.

## Decision

- Data access functions go in a *persistence* file.
  - *Persistence files modify or return database state.*
  - *Persistence files cannot contain business logic.*
- Business logic goes in a *logic* file.
  - *Logic files apply business logic as needed before or after calling a persistence function.*
  - *Logic files may simply re-export persistence functions.*
- Error descriptions go in an *errors* file.
  - *An errors file contains descriptions of possible failures unique to its described component.*
- Files export private functions and types as needed for testing.
  - *Functions and types intended to be private are excluded from the default export.*
- Public interfaces go in an *index* file.
  - *Index files expose types as necessary from any adjacent file.*
  - *Index files expose logic functions.*
  - *Index files cannot export persistence functions.*
- Test files go in a *test* directory located within the tested component.
  - *Test files are named after the tested file.*

## Consequences

Consistent organization leads to easier orientation within a large codebase. It also makes it easier to know where to find the public interface a component exposes. Additionally, while TypeScript and JavaScript cannot enforce *public*, *private*, and *protected* code as easily as other languages, hints can be provided through consistent code structure and file naming.
