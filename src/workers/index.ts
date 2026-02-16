/**
 * Background workers for event materialization system.
 *
 * This module provides:
 * - BackgroundWorkerService: Main orchestrator for all workers
 * - EventCleanupWorker: Removes old instances
 * - Functional worker modules: Direct access to functional components
 */

<<<<<<< HEAD
export {
	cleanupOldGeneratedInstances,
	extendGenerationWindow,
	getCleanupStats,
	initializeGenerationWindow,
	validateWindowConfig,
} from "../services/eventGeneration/windowManager";
export * from "./backgroundWorkerService";
export * from "./eventCleanupWorker";
// Functional worker API - imported directly from modules
export {
	createDefaultWorkerConfig,
	runMaterializationWorker,
	runSingleOrganizationWorker,
	type WorkerConfig,
	type WorkerResult,
} from "./eventGeneration/eventGenerationPipeline";
export {
	type EventGenerationExecutionResult,
	type EventGenerationJob,
	executeBatchEventGeneration,
	executeEventGeneration,
} from "./eventGeneration/executionEngine";
export {
	createDefaultJobDiscoveryConfig,
	createEventGenerationJobs,
	type DiscoveredWorkload,
	discoverEventGenerationWorkloads,
=======
export * from "./backgroundWorkerService";
export * from "./eventCleanupWorker";

// Functional worker API - imported directly from modules
export {
	runMaterializationWorker,
	runSingleOrganizationWorker,
	createDefaultWorkerConfig,
	type WorkerConfig,
	type WorkerResult,
} from "./eventGeneration/eventGenerationPipeline";

export {
	executeEventGeneration,
	executeBatchEventGeneration,
	type EventGenerationJob,
	type EventGenerationExecutionResult,
} from "./eventGeneration/executionEngine";

export {
	discoverEventGenerationWorkloads,
	createEventGenerationJobs,
	createDefaultJobDiscoveryConfig,
	type DiscoveredWorkload,
>>>>>>> upstream
	type JobDiscoveryConfig,
} from "./eventGeneration/jobDiscovery";

export {
<<<<<<< HEAD
	createDefaultPostProcessingConfig,
	executePostProcessing,
=======
	initializeGenerationWindow,
	extendGenerationWindow,
	cleanupOldGeneratedInstances,
	getCleanupStats,
	validateWindowConfig,
} from "../services/eventGeneration/windowManager";

export {
	executePostProcessing,
	createDefaultPostProcessingConfig,
>>>>>>> upstream
	type PostProcessingConfig,
	type PostProcessingResult,
} from "./eventGeneration/postProcessor";

export type {
<<<<<<< HEAD
	ProcessingMetrics,
	ProcessingResult,
	ResourceUsage,
	WorkerDependencies,
} from "./eventGeneration/types";

// Metrics aggregation worker exports
export { runMetricsAggregationWorker } from "./metrics/metricsAggregationWorker";
export type {
	AggregatedMetrics,
	CacheMetrics,
	OperationMetrics,
	TimeSeriesMetrics,
} from "./metrics/types";
=======
	WorkerDependencies,
	ProcessingMetrics,
	ResourceUsage,
	ProcessingResult,
} from "./eventGeneration/types";
>>>>>>> upstream
