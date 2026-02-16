[API Docs](/)

***

# Type Alias: UnauthorizedActionExtensions

> **UnauthorizedActionExtensions** = `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:184](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L184)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:139](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L139)
>>>>>>> upstream

When the client is not authorized to perform an action.

## Example

```ts
throw new TalawaGraphQLError({
	extensions: {
		code: "unauthorized_action",
	},
});
```

## Properties

### code

> **code**: `"unauthorized_action"`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:185](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L185)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:140](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L140)
>>>>>>> upstream
