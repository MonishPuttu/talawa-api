[API Docs](/)

***

# Class: PluginLifecycle

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:40](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L40)
=======
Defined in: [src/plugin/manager/lifecycle.ts:35](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L35)
>>>>>>> upstream

## Constructors

### Constructor

> **new PluginLifecycle**(`pluginContext`, `loadedPlugins`, `extensionRegistry`): `PluginLifecycle`

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:41](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L41)
=======
Defined in: [src/plugin/manager/lifecycle.ts:36](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L36)
>>>>>>> upstream

#### Parameters

##### pluginContext

[`IPluginContext`](../../../types/interfaces/IPluginContext.md)

##### loadedPlugins

`Map`\<`string`, [`ILoadedPlugin`](../../../types/interfaces/ILoadedPlugin.md)\>

##### extensionRegistry

[`IExtensionRegistry`](../../../types/interfaces/IExtensionRegistry.md)

#### Returns

`PluginLifecycle`

## Methods

### activatePlugin()

> **activatePlugin**(`pluginId`, `pluginManager`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:137](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L137)
=======
Defined in: [src/plugin/manager/lifecycle.ts:121](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L121)
>>>>>>> upstream

Activate a plugin - trigger schema rebuild

#### Parameters

##### pluginId

`string`

##### pluginManager

`IPluginManager`

#### Returns

`Promise`\<`boolean`\>

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`, `pluginManager`, `dropTables`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:196](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L196)
=======
Defined in: [src/plugin/manager/lifecycle.ts:176](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L176)
>>>>>>> upstream

Deactivate a plugin - trigger schema rebuild

#### Parameters

##### pluginId

`string`

##### pluginManager

`IPluginManager`

##### dropTables

`boolean` = `false`

#### Returns

`Promise`\<`boolean`\>

***

### getPluginModule()

> **getPluginModule**(`pluginId`): `Promise`\<[`IPluginLifecycle`](../../../types/interfaces/IPluginLifecycle.md) \| `null`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:397](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L397)
=======
Defined in: [src/plugin/manager/lifecycle.ts:360](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L360)
>>>>>>> upstream

Get plugin module for lifecycle hooks

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<[`IPluginLifecycle`](../../../types/interfaces/IPluginLifecycle.md) \| `null`\>

***

### installPlugin()

> **installPlugin**(`pluginId`, `pluginManager`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:50](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L50)
=======
Defined in: [src/plugin/manager/lifecycle.ts:45](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L45)
>>>>>>> upstream

Install a plugin - install dependencies and create plugin-defined databases

#### Parameters

##### pluginId

`string`

##### pluginManager

`IPluginManager`

#### Returns

`Promise`\<`boolean`\>

***

### removeFromExtensionRegistry()

> **removeFromExtensionRegistry**(`pluginId`): `void`

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:417](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L417)
=======
Defined in: [src/plugin/manager/lifecycle.ts:380](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L380)
>>>>>>> upstream

Remove plugin from extension registry

#### Parameters

##### pluginId

`string`

#### Returns

`void`

***

### uninstallPlugin()

> **uninstallPlugin**(`pluginId`, `pluginManager`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:95](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L95)
=======
Defined in: [src/plugin/manager/lifecycle.ts:82](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L82)
>>>>>>> upstream

Uninstall a plugin - remove tables and cleanup

#### Parameters

##### pluginId

`string`

##### pluginManager

`IPluginManager`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`, `pluginManager`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/lifecycle.ts:546](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L546)
=======
Defined in: [src/plugin/manager/lifecycle.ts:506](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/lifecycle.ts#L506)
>>>>>>> upstream

Unload a plugin - remove from memory without database changes

#### Parameters

##### pluginId

`string`

##### pluginManager

`IPluginManager`

#### Returns

`Promise`\<`boolean`\>
