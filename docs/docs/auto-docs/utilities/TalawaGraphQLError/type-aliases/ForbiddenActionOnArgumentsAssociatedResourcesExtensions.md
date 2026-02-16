[API Docs](/)

***

# Type Alias: ForbiddenActionOnArgumentsAssociatedResourcesExtensions

> **ForbiddenActionOnArgumentsAssociatedResourcesExtensions** = `object`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:95](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L95)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:75](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L75)
>>>>>>> upstream

When the client tries to perform actions on resources associated to arguments that conflict with real world expectations of the application. One example would be a user trying to follow their own account on a social media application.

## Example

```ts
throw new TalawaGraphQLError({
	extensions: {
		code: "forbidden_action_on_arguments_associated_resources",
		issues: [
			{
				argumentPath: ["input", 0, "emailAddress"],
				message: "This email address is not available.",
			},
			{
				argumentPath: ["input", 3, "username"],
				message: "This username is not available.",
			},
		],
	},
});
```

## Properties

### code

> **code**: `"forbidden_action_on_arguments_associated_resources"`

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:96](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L96)
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:76](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L76)
>>>>>>> upstream

***

### issues

> **issues**: `object`[]

<<<<<<< HEAD
Defined in: [src/utilities/TalawaGraphQLError.ts:97](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L97)

#### argumentPath

> **argumentPath**: `JSONArgumentPathKey`[]
=======
Defined in: [src/utilities/TalawaGraphQLError.ts:77](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/TalawaGraphQLError.ts#L77)

#### argumentPath

> **argumentPath**: (`string` \| `number`)[]
>>>>>>> upstream

#### message

> **message**: `string`
