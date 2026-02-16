[API Docs](/)

***

# Function: installPluginDependenciesWithErrorHandling()

> **installPluginDependenciesWithErrorHandling**(`pluginId`, `logger?`): `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/utilities/pluginDependencyInstaller.ts:248](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/pluginDependencyInstaller.ts#L248)
=======
Defined in: [src/utilities/pluginDependencyInstaller.ts:100](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/utilities/pluginDependencyInstaller.ts#L100)
>>>>>>> upstream

Install dependencies for a plugin with error handling that throws TalawaGraphQLError

## Parameters

### pluginId

`string`

The ID of the plugin

### logger?

Optional logger for output

#### error?

(`message`) => `void`

#### info?

(`message`) => `void`

## Returns

`Promise`\<`void`\>

## Throws

TalawaGraphQLError if installation fails
