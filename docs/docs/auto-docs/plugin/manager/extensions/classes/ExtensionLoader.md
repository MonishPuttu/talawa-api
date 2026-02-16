[API Docs](/)

***

# Class: ExtensionLoader

<<<<<<< HEAD
Defined in: [src/plugin/manager/extensions.ts:22](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/extensions.ts#L22)
=======
Defined in: [src/plugin/manager/extensions.ts:21](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/extensions.ts#L21)
>>>>>>> upstream

## Constructors

### Constructor

> **new ExtensionLoader**(`pluginsDirectory`, `loadedPlugins`, `extensionRegistry`): `ExtensionLoader`

<<<<<<< HEAD
Defined in: [src/plugin/manager/extensions.ts:23](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/extensions.ts#L23)
=======
Defined in: [src/plugin/manager/extensions.ts:22](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/extensions.ts#L22)
>>>>>>> upstream

#### Parameters

##### pluginsDirectory

`string`

##### loadedPlugins

`Map`\<`string`, [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)\>

##### extensionRegistry

[`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)

#### Returns

`ExtensionLoader`

## Methods

### loadExtensionPoints()

> **loadExtensionPoints**(`pluginId`, `manifest`, `pluginModule`): `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/extensions.ts:32](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/extensions.ts#L32)
=======
Defined in: [src/plugin/manager/extensions.ts:31](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/extensions.ts#L31)
>>>>>>> upstream

Load extension points for a plugin

#### Parameters

##### pluginId

`string`

##### manifest

[`IPluginManifest`](../../../types/interfaces/IPluginManifest.md)

##### pluginModule

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>
