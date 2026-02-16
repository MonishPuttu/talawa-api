import { eq } from "drizzle-orm";
import { eventAttendeesTable } from "~/src/drizzle/tables/eventAttendees";
import { Event } from "~/src/graphql/types/Event/Event";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import type { GraphQLContext } from "../../context";
import type { User as UserType } from "./User";
import { User } from "./User";
=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
import type { GraphQLContext } from "../../context";
import { User } from "./User";
import type { User as UserType } from "./User";
>>>>>>> upstream

export const userEventsAttendedResolver = async (
	parent: UserType,
	_args: Record<string, never>,
	ctx: GraphQLContext,
) => {
	try {
<<<<<<< HEAD
		// Require authentication to view attended events
		if (!ctx.currentClient.isAuthenticated) {
			throw new TalawaGraphQLError({
				extensions: {
					code: "unauthenticated",
				},
			});
		}

=======
>>>>>>> upstream
		// Get all events this user has attended (where they are registered/checked-in)
		const userAttendances =
			await ctx.drizzleClient.query.eventAttendeesTable.findMany({
				where: eq(eventAttendeesTable.userId, parent.id),
				with: {
<<<<<<< HEAD
					event: {
						with: {
							attachmentsWhereEvent: true,
						},
					},
					recurringEventInstance: {
						with: {
							baseRecurringEvent: true,
							// Note: Attachments are not fetched for recurring event instances
							// as they inherit from the base template and instance-specific
							// attachments are not currently supported in this resolver.
=======
					event: true,
					recurringEventInstance: {
						with: {
							baseRecurringEvent: true,
>>>>>>> upstream
						},
					},
				},
			});

<<<<<<< HEAD
		// Convert to Event objects
		// Note: Since users have already attended these events, they can see them
		// regardless of invite-only status (attendance implies prior authorization).
=======
		// Convert to Event objects, filtering out invalid ones
>>>>>>> upstream
		const eventsAttended = userAttendances
			.map((attendance) => {
				if (attendance.event) {
					// Standalone event
<<<<<<< HEAD
					// Drizzle returns an array (possibly empty) when attachmentsWhereEvent: true
					return {
						...attendance.event,
						attachments: attendance.event.attachmentsWhereEvent ?? [],
					};
				}
				if (attendance.recurringEventInstance) {
					// Recurring event instance - merge base event with instance data
					// Note: Attachments are intentionally omitted for recurring instances
					// as they inherit from the base template and instance-specific attachments
					// are not currently supported in this resolver.
					const instance = attendance.recurringEventInstance;
					const baseEvent = instance.baseRecurringEvent;
					return {
						...baseEvent,
=======
					return {
						...attendance.event,
						attachments: [],
					};
				}
				if (attendance.recurringEventInstance) {
					// Recurring event instance
					const instance = attendance.recurringEventInstance;
					return {
						...instance.baseRecurringEvent,
>>>>>>> upstream
						...instance,
						attachments: [],
					};
				}
				return null;
			})
			.filter((event): event is NonNullable<typeof event> => event !== null);

<<<<<<< HEAD
		// Return all attended events - attendance implies prior authorization.
		return eventsAttended;
	} catch (error) {
		ctx.log.error(error);

		// Preserve TalawaGraphQLError instances to maintain proper error codes
		if (error instanceof TalawaGraphQLError) {
			throw error;
		}

		// Only wrap unknown errors as unexpected
=======
		return eventsAttended;
	} catch (error) {
		ctx.log.error(error);
>>>>>>> upstream
		throw new TalawaGraphQLError({
			message: "Internal server error",
			extensions: {
				code: "unexpected",
			},
		});
	}
};

User.implement({
	fields: (t) => ({
		eventsAttended: t.field({
			description: "List of events the user has attended or registered for.",
			resolve: userEventsAttendedResolver,
			type: [Event],
			complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
		}),
	}),
});
