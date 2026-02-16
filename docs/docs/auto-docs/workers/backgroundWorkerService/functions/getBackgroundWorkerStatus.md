[API Docs](/)

***

# Function: getBackgroundWorkerStatus()

> **getBackgroundWorkerStatus**(): `object`

<<<<<<< HEAD
Defined in: [src/workers/backgroundWorkerService.ts:344](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/workers/backgroundWorkerService.ts#L344)
=======
Defined in: [src/workers/backgroundWorkerService.ts:219](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/workers/backgroundWorkerService.ts#L219)
>>>>>>> upstream

Retrieves the current status of the background worker service, including scheduling information.

## Returns

`object`

<<<<<<< HEAD
- An object containing the current status of the service.
=======
An object containing the current status of the service.
>>>>>>> upstream

### cleanupSchedule

> **cleanupSchedule**: `string`

### isRunning

> **isRunning**: `boolean`

### materializationSchedule

> **materializationSchedule**: `string`

<<<<<<< HEAD
### metricsEnabled?

> `optional` **metricsEnabled**: `boolean`

### metricsSchedule?

> `optional` **metricsSchedule**: `string`

=======
>>>>>>> upstream
### nextCleanupRun?

> `optional` **nextCleanupRun**: `Date`

### nextMaterializationRun?

> `optional` **nextMaterializationRun**: `Date`
