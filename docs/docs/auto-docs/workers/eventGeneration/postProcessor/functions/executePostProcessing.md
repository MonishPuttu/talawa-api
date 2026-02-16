[API Docs](/)

***

# Function: executePostProcessing()

<<<<<<< HEAD
> **executePostProcessing**(`executionResults`, `_metrics`, `config`, `deps`): `Promise`\<[`PostProcessingResult`](../interfaces/PostProcessingResult.md)\>
=======
> **executePostProcessing**(`executionResults`, `metrics`, `config`, `deps`): `Promise`\<[`PostProcessingResult`](../interfaces/PostProcessingResult.md)\>
>>>>>>> upstream

Defined in: [src/workers/eventGeneration/postProcessor.ts:30](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/workers/eventGeneration/postProcessor.ts#L30)

Executes post-processing tasks after the materialization of event instances is complete.
This includes operations like cleaning up old data and logging final statistics.

## Parameters

### executionResults

[`EventGenerationExecutionResult`](../../executionEngine/interfaces/EventGenerationExecutionResult.md)[]

An array of results from the materialization execution.

<<<<<<< HEAD
### \_metrics

[`ProcessingMetrics`](../../types/interfaces/ProcessingMetrics.md)

=======
### metrics

[`ProcessingMetrics`](../../types/interfaces/ProcessingMetrics.md)

The metrics collected during the materialization process.

>>>>>>> upstream
### config

[`PostProcessingConfig`](../interfaces/PostProcessingConfig.md)

The configuration for post-processing.

### deps

[`WorkerDependencies`](../../types/interfaces/WorkerDependencies.md)

The dependencies required for the worker.

## Returns

`Promise`\<[`PostProcessingResult`](../interfaces/PostProcessingResult.md)\>

<<<<<<< HEAD
- A promise that resolves to the result of the post-processing operations.
=======
A promise that resolves to the result of the post-processing operations.
>>>>>>> upstream
