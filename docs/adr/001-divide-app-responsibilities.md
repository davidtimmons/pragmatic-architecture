# Divide app responsibilities into *infrastructure*, *API*, *database*, *service*, and *workflow* layers

## Status

Accepted

## Context

Inappropriate coupling causes an application to become unwieldy and difficult to maintain as it grows. This slows development velocity and increases the likelihood of introducing bugs into the software system as changes are made.

## Decision

- The infrastructure layer is available to any component that needs it.
  - *The infrastructure layer cannot call any other layers.*
  - *The infrastructure layer cannot own any database tables.*
- The API layer exists only to coordinate system communication with external users.
  - *The API can call services.*
  - *The API can call workflows.*
  - *The API cannot call the database.*
  - *The API cannot contain business logic.*
  - *No other layer can call the API.*
- The database layer exists only to enable data access.
  - *Other layers interact with the database through this layer's public facade.*
  - *Other layers are unaware of the underlying database technologies.*
  - *The database layer cannot call services.*
  - *The database layer cannot call workflows.*
  - *The database layer cannot own any database tables.*
- Services are fully encapsulated from all other services.
  - *Services can own their own database table.*
  - *Services cannot call database tables they do not own.*
  - *Services cannot call other services.*
  - *Services cannot call workflows.*
- Workflows are the communication layer between services.
  - *Workflows can call services.*
  - *Workflows can own their own database tables.*
  - *Workflows cannot call database tables they do not own.*
  - *Workflows cannot call other workflows.*

## Consequences

Splitting the application in this way is intended to minimize coupling between the different components. Highly cohesive, minimally coupled components are easier to maintain and refactor without introducing bugs into the application. Additionally, minimally coupled components ease the burden of transitioning from a monolith to a distributed architecture as the application grows large enough to require horizontal scaling.
