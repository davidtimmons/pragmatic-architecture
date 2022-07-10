# Centralize the API instead of distributing endpoints throughout the application

## Status

Accepted

## Context

A decentralized API with each endpoint located adjacent to the component it calls can be beneficial. This approach bundles interdependencies together, making it easier to see how a change to one file impacts another while ensuring that the lifecycle of an API endpoint never outlives the component it calls. However, spreading the API across various application components can easily reduce the cohesiveness of the overall API design, hindering organization stakeholders from effectively managing the API as its own product.

## Decision

- The API is its own centralized layer.

## Consequences

Services and workflows could own their own API endpoints. That is a reasonable choice. However, centralizing the API as a single layer allows it to be handled separately from the application. It becomes its own business product. Designing an API for public (and sometimes private) use has user experience considerations that, in some circumstances, are every bit as important as the user interface. Designing a coherent API can be easier when its pieces are not sprinkled throughout the application.
