[API Docs](/)

***

# Type Alias: UnauthorizedArgumentsExtensions

> **UnauthorizedArgumentsExtensions** = `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:226](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L226)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:181](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L181)
>>>>>>> upstream

When the client is not authorized to perform an action with certain arguments.

## Example

```ts
throw new TalawaGraphQLError({
	extensions: {
		code: "unauthorized_arguments",
		issues: [
			{
				argumentPath: ["input", "role"],
				message: "You are not authorzied to change your user role.",
			},
		],
	},
});
```

## Properties

### code

> **code**: `"unauthorized_arguments"`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:230](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L230)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:185](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L185)
>>>>>>> upstream

***

### issues

> **issues**: `object`[]

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:227](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L227)

#### argumentPath

> **argumentPath**: `JSONArgumentPathKey`[]
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:182](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L182)

#### argumentPath

> **argumentPath**: (`string` \| `number`)[]
>>>>>>> upstream
