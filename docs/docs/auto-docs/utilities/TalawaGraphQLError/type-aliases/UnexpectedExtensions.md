[API Docs](/)

***

# Type Alias: UnexpectedExtensions

> **UnexpectedExtensions** = `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:243](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L243)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:198](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L198)
>>>>>>> upstream

When an error that doesn't fit one of the error types listed above occurs. One example would be a database request failure.

## Example

```ts
throw new TalawaGraphQLError({
	extensions: {
		code: "unexpected",
	},
});
```

## Properties

### code

> **code**: `"unexpected"`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:244](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L244)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:199](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L199)
>>>>>>> upstream
