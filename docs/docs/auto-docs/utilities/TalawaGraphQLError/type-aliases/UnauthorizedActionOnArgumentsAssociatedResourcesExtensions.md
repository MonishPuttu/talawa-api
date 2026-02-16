[API Docs](/)

***

# Type Alias: UnauthorizedActionOnArgumentsAssociatedResourcesExtensions

> **UnauthorizedActionOnArgumentsAssociatedResourcesExtensions** = `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:203](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L203)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:158](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L158)
>>>>>>> upstream

When the client is not authorized to perform an action on a resource associated to an argument.

## Example

```ts
throw new TalawaGraphQLError({
	extensions: {
		code: "unauthorized_action_on_arguments_associated_resources",
		issues: [
			{
				argumentPath: ["input", "id"],
			},
		],
	},
});
```

## Properties

### code

> **code**: `"unauthorized_action_on_arguments_associated_resources"`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:207](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L207)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:162](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L162)
>>>>>>> upstream

***

### issues

> **issues**: `object`[]

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:204](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L204)

#### argumentPath

> **argumentPath**: `JSONArgumentPathKey`[]
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:159](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L159)

#### argumentPath

> **argumentPath**: (`string` \| `number`)[]
>>>>>>> upstream
