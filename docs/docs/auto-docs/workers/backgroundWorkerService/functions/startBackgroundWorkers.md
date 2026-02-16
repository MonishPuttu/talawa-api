[API Docs](/)

***

# Function: startBackgroundWorkers()

<<<<<<< HEAD
> **startBackgroundWorkers**(`drizzleClient`, `logger`, `getMetricsSnapshots?`): `Promise`\<`void`\>

Defined in: [src/workers/backgroundWorkerService.ts:39](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/workers/backgroundWorkerService.ts#L39)
=======
> **startBackgroundWorkers**(`drizzleClient`, `logger`): `Promise`\<`void`\>

Defined in: [src/workers/backgroundWorkerService.ts:21](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/workers/backgroundWorkerService.ts#L21)
>>>>>>> upstream

Initializes and starts all background workers, scheduling them to run at their configured intervals.

## Parameters

### drizzleClient

`NodePgDatabase`\<[API Docs](/)\>

<<<<<<< HEAD
Drizzle database client

=======
>>>>>>> upstream
### logger

`FastifyBaseLogger`

<<<<<<< HEAD
Fastify logger instance

### getMetricsSnapshots?

(`windowMinutes?`) => [`PerfSnapshot`](../../../utilities/metrics/performanceTracker/type-aliases/PerfSnapshot.md)[]

Optional function to retrieve performance snapshots for metrics aggregation

=======
>>>>>>> upstream
## Returns

`Promise`\<`void`\>
