[API Docs](/)

***

# Type Alias: ArgumentsAssociatedResourcesNotFoundExtensions

> **ArgumentsAssociatedResourcesNotFoundExtensions** = `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:35](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L35)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:32](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L32)
>>>>>>> upstream

When resources associated to the provided graphql arguments cannot be not found.

## Example

```ts
throw new TalawaGraphQLError({
	extensions: {
		code: "arguments_associated_resources_not_found",
		issues: [
			{
				argumentPath: ["input", 0, "id"],
			},
			{
				argumentPath: ["input", 3, "id"],
			},
			{
				argumentPath: ["input", 19, "id"],
			},
		],
	},
});
```

## Properties

### code

> **code**: `"arguments_associated_resources_not_found"`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:36](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L36)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:33](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L33)
>>>>>>> upstream

***

### issues

> **issues**: `object`[]

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:37](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L37)

#### argumentPath

> **argumentPath**: `JSONArgumentPathKey`[]
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:34](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L34)

#### argumentPath

> **argumentPath**: (`string` \| `number`)[]
>>>>>>> upstream
