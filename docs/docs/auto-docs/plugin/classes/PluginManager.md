[API Docs](/)

***

# Class: PluginManager

Defined in: [src/plugin/manager/core.ts:32](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L32)

Plugin System Main Entry Point for Talawa API

This file exports all the main plugin system components and utilities
for use throughout the API application.

## Extends

- `EventEmitter`

## Constructors

### Constructor

> **new PluginManager**(`context`, `pluginsDir?`): `PluginManager`

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:62](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L62)
=======
Defined in: [src/plugin/manager/core.ts:61](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L61)
>>>>>>> upstream

#### Parameters

##### context

[`IPluginContext`](../types/interfaces/IPluginContext.md)

##### pluginsDir?

`string`

#### Returns

`PluginManager`

#### Overrides

`EventEmitter.constructor`

## Methods

### activatePlugin()

> **activatePlugin**(`pluginId`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:329](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L329)
=======
Defined in: [src/plugin/manager/core.ts:321](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L321)
>>>>>>> upstream

Activate a plugin

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### clearErrors()

> **clearErrors**(): `void`

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:498](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L498)
=======
Defined in: [src/plugin/manager/core.ts:487](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L487)
>>>>>>> upstream

Clear plugin errors

#### Returns

`void`

***

### deactivatePlugin()

> **deactivatePlugin**(`pluginId`, `dropTables`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:336](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L336)
=======
Defined in: [src/plugin/manager/core.ts:328](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L328)
>>>>>>> upstream

Deactivate a plugin

#### Parameters

##### pluginId

`string`

##### dropTables

`boolean` = `false`

#### Returns

`Promise`\<`boolean`\>

***

### executePostHooks()

> **executePostHooks**(`event`, `data`): `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:471](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L471)
=======
Defined in: [src/plugin/manager/core.ts:460](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L460)
>>>>>>> upstream

Execute post hooks for an event

#### Parameters

##### event

`string`

##### data

`unknown`

#### Returns

`Promise`\<`void`\>

***

### executePreHooks()

> **executePreHooks**(`event`, `data`): `Promise`\<`unknown`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:450](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L450)
=======
Defined in: [src/plugin/manager/core.ts:442](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L442)
>>>>>>> upstream

Execute pre hooks for an event

#### Parameters

##### event

`string`

##### data

`unknown`

#### Returns

`Promise`\<`unknown`\>

***

### getActivePlugins()

> **getActivePlugins**(): [`ILoadedPlugin`](../types/interfaces/ILoadedPlugin.md)[]

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:412](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L412)
=======
Defined in: [src/plugin/manager/core.ts:404](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L404)
>>>>>>> upstream

Get active plugins

#### Returns

[`ILoadedPlugin`](../types/interfaces/ILoadedPlugin.md)[]

***

### getErrors()

> **getErrors**(): [`IPluginError`](../types/interfaces/IPluginError.md)[]

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:491](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L491)
=======
Defined in: [src/plugin/manager/core.ts:480](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L480)
>>>>>>> upstream

Get plugin errors

#### Returns

[`IPluginError`](../types/interfaces/IPluginError.md)[]

***

### getExtensionRegistry()

> **getExtensionRegistry**(): [`IExtensionRegistry`](../types/interfaces/IExtensionRegistry.md)

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:443](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L443)
=======
Defined in: [src/plugin/manager/core.ts:435](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L435)
>>>>>>> upstream

Get extension registry

#### Returns

[`IExtensionRegistry`](../types/interfaces/IExtensionRegistry.md)

***

### getLoadedPluginIds()

> **getLoadedPluginIds**(): `string`[]

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:405](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L405)
=======
Defined in: [src/plugin/manager/core.ts:397](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L397)
>>>>>>> upstream

Get loaded plugin IDs

#### Returns

`string`[]

***

### getLoadedPlugins()

> **getLoadedPlugins**(): [`ILoadedPlugin`](../types/interfaces/ILoadedPlugin.md)[]

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:398](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L398)
=======
Defined in: [src/plugin/manager/core.ts:390](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L390)
>>>>>>> upstream

Get all loaded plugins

#### Returns

[`ILoadedPlugin`](../types/interfaces/ILoadedPlugin.md)[]

***

### getPlugin()

> **getPlugin**(`pluginId`): [`ILoadedPlugin`](../types/interfaces/ILoadedPlugin.md) \| `undefined`

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:421](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L421)
=======
Defined in: [src/plugin/manager/core.ts:413](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L413)
>>>>>>> upstream

Get a specific plugin

#### Parameters

##### pluginId

`string`

#### Returns

[`ILoadedPlugin`](../types/interfaces/ILoadedPlugin.md) \| `undefined`

***

### getPluginContext()

> **getPluginContext**(): [`IPluginContext`](../types/interfaces/IPluginContext.md)

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:526](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L526)
=======
Defined in: [src/plugin/manager/core.ts:508](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L508)
>>>>>>> upstream

Get plugin context

#### Returns

[`IPluginContext`](../types/interfaces/IPluginContext.md)

***

### getPluginsDirectory()

> **getPluginsDirectory**(): `string`

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:519](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L519)
=======
Defined in: [src/plugin/manager/core.ts:501](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L501)
>>>>>>> upstream

Get plugins directory

#### Returns

`string`

***

### gracefulShutdown()

> **gracefulShutdown**(): `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:534](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L534)
=======
Defined in: [src/plugin/manager/core.ts:516](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L516)
>>>>>>> upstream

Gracefully shutdown plugin system without triggering deactivation or schema updates
This is used during server shutdown to avoid unnecessary operations

#### Returns

`Promise`\<`void`\>

***

<<<<<<< HEAD
### hasInitializationBeenAttempted()

> **hasInitializationBeenAttempted**(): `boolean`

Defined in: [src/plugin/manager/core.ts:512](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L512)

Check if initialization was attempted (regardless of success/failure)

#### Returns

`boolean`

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/plugin/manager/core.ts:85](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L85)

Initialize the plugin system

#### Returns

`Promise`\<`void`\>

***

=======
>>>>>>> upstream
### installPlugin()

> **installPlugin**(`pluginId`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:322](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L322)
=======
Defined in: [src/plugin/manager/core.ts:314](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L314)
>>>>>>> upstream

Install a plugin

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### isPluginActive()

> **isPluginActive**(`pluginId`): `boolean`

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:435](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L435)
=======
Defined in: [src/plugin/manager/core.ts:427](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L427)
>>>>>>> upstream

Check if plugin is active

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`

***

### isPluginLoaded()

> **isPluginLoaded**(`pluginId`): `boolean`

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:428](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L428)
=======
Defined in: [src/plugin/manager/core.ts:420](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L420)
>>>>>>> upstream

Check if plugin is loaded

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`

***

### isSystemInitialized()

> **isSystemInitialized**(): `boolean`

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:505](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L505)

Check if system is initialized (successfully)
=======
Defined in: [src/plugin/manager/core.ts:494](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L494)

Check if system is initialized
>>>>>>> upstream

#### Returns

`boolean`

***

### loadPlugin()

> **loadPlugin**(`pluginId`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:189](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L189)
=======
Defined in: [src/plugin/manager/core.ts:183](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L183)
>>>>>>> upstream

Load a specific plugin

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### uninstallPlugin()

> **uninstallPlugin**(`pluginId`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:346](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L346)
=======
Defined in: [src/plugin/manager/core.ts:338](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L338)
>>>>>>> upstream

Uninstall a plugin

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### unloadPlugin()

> **unloadPlugin**(`pluginId`): `Promise`\<`boolean`\>

<<<<<<< HEAD
Defined in: [src/plugin/manager/core.ts:353](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L353)
=======
Defined in: [src/plugin/manager/core.ts:345](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/plugin/manager/core.ts#L345)
>>>>>>> upstream

Unload a plugin from memory

#### Parameters

##### pluginId

`string`

#### Returns

`Promise`\<`boolean`\>
