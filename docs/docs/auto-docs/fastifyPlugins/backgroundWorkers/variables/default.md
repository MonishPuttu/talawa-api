[API Docs](/)

***

# Variable: default()

> **default**: (`fastify`) => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/fastifyPlugins/backgroundWorkers.ts:53](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/fastifyPlugins/backgroundWorkers.ts#L53)
=======
Defined in: [src/fastifyPlugins/backgroundWorkers.ts:31](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/fastifyPlugins/backgroundWorkers.ts#L31)
>>>>>>> upstream

Background worker plugin for event materialization.

This plugin:
- Initializes the background worker service
- Starts the materialization and cleanup workers
<<<<<<< HEAD
- Starts metrics aggregation worker if enabled (requires performance plugin)
- Handles graceful shutdown of workers
- Provides worker status endpoints

**Dependencies:** The performance plugin must be registered before this plugin.
This is enforced via the `dependencies` array in the plugin configuration.

=======
- Handles graceful shutdown of workers
- Provides worker status endpoints

>>>>>>> upstream
## Parameters

### fastify

`FastifyInstance`

## Returns

`Promise`\<`void`\>
