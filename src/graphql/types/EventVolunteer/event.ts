<<<<<<< HEAD
import { Event } from "~/src/graphql/types/Event/Event";
import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import type { GraphQLContext } from "../../context";
import type { EventVolunteer as EventVolunteerType } from "./EventVolunteer";
import { EventVolunteer } from "./EventVolunteer";

/**
 * Resolves the event that an event volunteer is associated with.
 *
 * @param parent - The parent EventVolunteer object containing the eventId.
 * @param _args - GraphQL arguments (unused).
 * @param ctx - The GraphQL context containing dataloaders and logging utilities.
 * @returns The event the volunteer is associated with.
 * @throws TalawaGraphQLError with code "unauthenticated" if user is not authenticated.
 * @throws TalawaGraphQLError with code "unexpected" if event is not found (indicates data corruption).
 */
=======
import { eq } from "drizzle-orm";
import { eventsTable } from "~/src/drizzle/tables/events";
import { Event } from "~/src/graphql/types/Event/Event";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
import type { GraphQLContext } from "../../context";
import { EventVolunteer } from "./EventVolunteer";
import type { EventVolunteer as EventVolunteerType } from "./EventVolunteer";

>>>>>>> upstream
export const EventVolunteerEventResolver = async (
	parent: EventVolunteerType,
	_args: Record<string, never>,
	ctx: GraphQLContext,
) => {
	if (!ctx.currentClient.isAuthenticated) {
		throw new TalawaGraphQLError({
			extensions: {
				code: "unauthenticated",
			},
		});
	}

<<<<<<< HEAD
	const event = await ctx.dataloaders.event.load(parent.eventId);

	if (event === null) {
		ctx.log.warn(
			{
				eventVolunteerId: parent.id,
				eventId: parent.eventId,
			},
			"DataLoader returned null for an event volunteer's event id that isn't null.",
=======
	const event = await ctx.drizzleClient.query.eventsTable.findFirst({
		where: eq(eventsTable.id, parent.eventId),
	});

	if (event === undefined) {
		ctx.log.warn(
			"Postgres select operation returned an empty array for an event volunteer's event id that isn't null.",
>>>>>>> upstream
		);
		throw new TalawaGraphQLError({
			extensions: {
				code: "unexpected",
			},
		});
	}

	// Return event with empty attachments array to match Event type
	return {
		...event,
		attachments: [],
	};
};

EventVolunteer.implement({
	fields: (t) => ({
		event: t.field({
			description: "The event being volunteered for.",
			resolve: EventVolunteerEventResolver,
			type: Event,
			complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
		}),
	}),
});
