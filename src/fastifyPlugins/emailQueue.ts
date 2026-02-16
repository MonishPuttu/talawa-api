import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import {
	initializeEmailQueue,
	stopEmailQueue,
<<<<<<< HEAD
} from "~/src/services/email/emailServiceInstance";
import type { AppLogger } from "../utilities/logging/logger";
=======
} from "~/src/services/ses/emailServiceInstance";
>>>>>>> upstream

const emailQueuePlugin = async (fastify: FastifyInstance) => {
	// Initialize after drizzle client is available
	initializeEmailQueue({
		drizzleClient: fastify.drizzleClient,
<<<<<<< HEAD
		log: fastify.log as AppLogger,
=======
		log: fastify.log,
>>>>>>> upstream
		envConfig: fastify.envConfig as { API_ENABLE_EMAIL_QUEUE: boolean },
	});

	fastify.addHook("onClose", async (instance) => {
		stopEmailQueue(instance.log);
	});
};

export default fastifyPlugin(emailQueuePlugin, {
	name: "emailQueue",
	dependencies: ["drizzleClient"],
});
