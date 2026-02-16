[API Docs](/)

***

# Class: TalawaGraphQLError

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:372](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L372)

Custom GraphQL error class that provides structured error handling with typed extensions.

This class extends the standard GraphQLError and enforces strict TypeScript typing
on error metadata within the `extensions` field. It prevents arbitrary, undocumented
errors from being returned to GraphQL clients and standardizes error responses.

The class integrates with the unified error handling system by supporting ErrorCode
enum values and providing consistent error shapes across REST and GraphQL endpoints.
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:264](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L264)

This class extends the `GraphQLError` class and is used to create graphql error instances with strict typescript assertion on providing the error metadata within the `extensions` field. This assertion prevents talawa api contributers from returning arbitrary, undocumented errors to the talawa api graphql clients.

This also standardizes the errors that the client developers using talawa api can expect in the graphql responses, helping them design better UI experiences for end users. If necessary, the localization of the error messages(i18n) can be done within the graphql resolvers where this function is used.

The following example shows the usage of `createTalawaGraphQLError` function within a graphql resolver for resolving the user record of the best friend of a user:
>>>>>>> upstream

## Example

```ts
<<<<<<< HEAD
// Basic authentication error
throw new TalawaGraphQLError({
  extensions: {
    code: ErrorCode.UNAUTHENTICATED
  }
});

// Error with details and custom message
throw new TalawaGraphQLError({
  message: "Organization not found",
  extensions: {
    code: ErrorCode.NOT_FOUND,
    details: { organizationId: "123" }
  }
});

// Legacy typed extension (for backward compatibility)
throw new TalawaGraphQLError({
  extensions: {
    code: "arguments_associated_resources_not_found",
    issues: [
      { argumentPath: ["input", "id"] }
    ]
  }
});
```

The following example shows usage within a GraphQL resolver:
```ts
export const user = async (parent, args, ctx) => {
  const existingUser = await ctx.drizzleClient.query.user.findFirst({
    where: (fields, operators) => operators.eq(fields.id, args.input.id),
  });

  if (existingUser === undefined) {
    throw new TalawaGraphQLError({
      extensions: {
        code: ErrorCode.NOT_FOUND,
        details: { userId: args.input.id }
      }
    });
  }

  return user;
=======
export const user = async (parent, args, ctx) => {
 const existingUser = await ctx.drizzleClient.query.user.findFirst({
     where: (fields, operators) => operators.eq(fields.id, args.input.id),
 });

	if (user === undefined) {
		throw new TalawaGraphQLError({
			extensions: {
				code: "arguments_associated_resources_not_found",
				issues: [
					{
						argumentPath: ["input", "id"],
					},
				],
			},

     })
	}

 return user;
>>>>>>> upstream
}
```

## Extends

- `GraphQLError`

## Constructors

### Constructor

<<<<<<< HEAD
> **new TalawaGraphQLError**(`options`): `TalawaGraphQLError`

Defined in: [src/utilities/TalawaGraphQLError.ts:383](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L383)

Creates a new TalawaGraphQLError instance.

#### Parameters

##### options

`GraphQLErrorOptions` & `object`

Error configuration object containing:
  - message: Optional custom error message (uses default if not provided)
  - extensions: Typed error extensions containing error code and details
  - extensions.code: Error code (ErrorCode enum or legacy string codes)
  - extensions.details: Optional additional error context
  - extensions.httpStatus: Optional HTTP status code override

=======
> **new TalawaGraphQLError**(`__namedParameters`): `TalawaGraphQLError`

Defined in: [src/utilities/TalawaGraphQLError.ts:265](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L265)

#### Parameters

##### \_\_namedParameters

`GraphQLErrorOptions` & `object`

>>>>>>> upstream
#### Returns

`TalawaGraphQLError`

#### Overrides

`GraphQLError.constructor`
