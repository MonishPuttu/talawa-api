<<<<<<< HEAD
import { vi } from "vitest";
import type { AppLogger } from "~/src/utilities/logging/logger";
=======
import type { FastifyBaseLogger } from "fastify";
import { vi } from "vitest";

/**
 * Configuration options for the mock logger.
 * @interface MockLoggerConfig
 * @property {string} [level] - The logging level to use. Defaults to "info".
 * @property {Set<string>} [enabledLevels] - Set of enabled log levels.
 */
>>>>>>> upstream

interface MockLoggerConfig {
	level?: string;
	enabledLevels?: Set<string>;
}

<<<<<<< HEAD
export const createMockLogger = (config?: MockLoggerConfig): AppLogger => {
=======
export const createMockLogger = (
	config?: MockLoggerConfig,
): FastifyBaseLogger => {
>>>>>>> upstream
	const level = config?.level ?? "info";
	const enabledLevels =
		config?.enabledLevels ??
		new Set(["error", "warn", "info", "debug", "trace", "fatal", "silent"]);

	if (level && !enabledLevels.has(level)) {
		throw new Error(`Invalid log level: ${level}`);
	}

	const logger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
		trace: vi.fn(),
		fatal: vi.fn(),
		silent: vi.fn(),
		child: () => createMockLogger(config),
		level,
		isLevelEnabled: (l: string) => enabledLevels.has(l),
		bindings: vi.fn().mockReturnValue({}),
		flush: vi.fn(),
		isFatalEnabled: () => enabledLevels.has("fatal"),
		isErrorEnabled: () => enabledLevels.has("error"),
		isWarnEnabled: () => enabledLevels.has("warn"),
		isInfoEnabled: () => enabledLevels.has("info"),
		isDebugEnabled: () => enabledLevels.has("debug"),
		isTraceEnabled: () => enabledLevels.has("trace"),
		isSilentEnabled: () => enabledLevels.has("silent"),
<<<<<<< HEAD
		msgPrefix: "",
		version: "1.0.0",
		levels: {
			labels: {},
			values: {},
		},
		useLevelLabels: false,
		levelVal: 30,
		onChild: vi.fn(),
		[Symbol.for("pino.serializers")]: {},
	} as unknown as AppLogger;
=======
	};
>>>>>>> upstream

	return logger;
};
