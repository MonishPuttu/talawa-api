[API Docs](/)

***

# Type Alias: TalawaGraphQLFormattedError

> **TalawaGraphQLFormattedError** = `GraphQLFormattedError` & `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:419](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L419)

Formatted error type returned by Talawa API's GraphQL implementation.

This type extends the standard GraphQLFormattedError with typed extensions
that include structured error metadata for consistent client-side error handling.
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:282](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L282)

Type of the error returned by talawa api's graphql implementation in the root "errors" field of the graphql responses.
>>>>>>> upstream

## Type Declaration

### extensions

> **extensions**: [`TalawaGraphQLErrorExtensions`](TalawaGraphQLErrorExtensions.md)
<<<<<<< HEAD

Typed error extensions with structured metadata

## Example

```json
{
  "message": "User not found",
  "path": ["user"],
  "extensions": {
    "code": "not_found",
    "details": { "userId": "123" },
    "correlationId": "req-abc123",
    "httpStatus": 404
  }
}
```
=======
>>>>>>> upstream
