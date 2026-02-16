[API Docs](/)

***

# Type Alias: ForbiddenActionExtensions

> **ForbiddenActionExtensions** = `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:71](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L71)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:51](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L51)
>>>>>>> upstream

When the client tries to perform an action that conflicts with real world expectations of the application.

## Example

```ts
throw new TalawaGraphQLError(
	{
		extensions: {
			code: "forbidden_action",
		},
	},
);
```

## Properties

### code

> **code**: `"forbidden_action"`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:72](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L72)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:52](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L52)
>>>>>>> upstream
