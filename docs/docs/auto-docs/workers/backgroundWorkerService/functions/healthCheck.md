[API Docs](/)

***

# Function: healthCheck()

<<<<<<< HEAD
> **healthCheck**(`statusGetter`): `Promise`\<\{ `details`: `Record`\<`string`, `unknown`\>; `status`: `"healthy"` \| `"unhealthy"`; \}\>

Defined in: [src/workers/backgroundWorkerService.ts:387](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/workers/backgroundWorkerService.ts#L387)

Performs a health check of the background worker service, suitable for use by monitoring systems.

## Parameters

### statusGetter

() => `object`

=======
> **healthCheck**(): `Promise`\<\{ `details`: `Record`\<`string`, `unknown`\>; `status`: `"healthy"` \| `"unhealthy"`; \}\>

Defined in: [src/workers/backgroundWorkerService.ts:239](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/workers/backgroundWorkerService.ts#L239)

Performs a health check of the background worker service, suitable for use by monitoring systems.

>>>>>>> upstream
## Returns

`Promise`\<\{ `details`: `Record`\<`string`, `unknown`\>; `status`: `"healthy"` \| `"unhealthy"`; \}\>

<<<<<<< HEAD
- A promise that resolves to an object indicating the health status and any relevant details.
=======
A promise that resolves to an object indicating the health status and any relevant details.
>>>>>>> upstream
