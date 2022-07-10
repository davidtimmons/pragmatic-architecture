# Bubble errors from the bottom to the top of the call stack

## Status

Accepted

## Context

Every function with a side effect and every function that handles user input may occasionally generate an application state resulting in an error. Crashing the application instead of intentionally handling possible errors can lead to software bugs that degrade the user experience. This can also lead to bugs that are more difficult to troubleshoot since a generic stack trace may not have enough context for the developer to know what application state led to the crash.

## Decision

- Errors are intentionally designed to be informative.
  - *Detailed error messages are logged.*
  - *Limited but useful error messages are communicated back through the API to the end user.*
  - *Errors should never crash the application when running in production mode.*
  - *Errors may only crash the application when useful during the development process.*

## Consequences

Designing the application to bubble errors creates a little more clutter in the code, but it enables the system design to communicate application status back to the end user in whatever granularity the developer desires. This can improve the user experience. Additionally, it provides space to build a framework that intentionally communicates errors in such a way that fixing production bugs becomes easier. Some bugs will occasionally make their way to users, and bugs with useful error messages are easier to triage.
