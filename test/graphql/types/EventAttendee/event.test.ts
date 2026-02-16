import { createMockGraphQLContext } from "test/_Mocks_/mockContextCreator/mockContextCreator";
<<<<<<< HEAD
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GraphQLContext } from "~/src/graphql/context";
import type { EventAttendee as EventAttendeeType } from "~/src/graphql/types/EventAttendee/EventAttendee";
import { eventAttendeeEventResolver } from "~/src/graphql/types/EventAttendee/event";
import { getRecurringEventInstancesByIds } from "~/src/graphql/types/Query/eventQueries/recurringEventInstanceQueries";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";

vi.mock(
	"~/src/graphql/types/Query/eventQueries/recurringEventInstanceQueries",
	() => ({
		getRecurringEventInstancesByIds: vi.fn(),
	}),
);

describe("EventAttendee Event Resolver Tests", () => {
	let ctx: GraphQLContext;
	let mockEventAttendee: EventAttendeeType;

	// Moved up here so it is visible to ALL tests for type casting
	const mockResolvedInstance = {
		id: "instance-789",
		name: "Recurring Instance Event",
		description: "Instance description",
		location: "Instance location",
		actualStartTime: new Date("2024-03-15T09:00:00Z"),
		actualEndTime: new Date("2024-03-15T12:00:00Z"),
		organizationId: "org-123",
		baseRecurringEventId: "template-456",
		recurrenceRuleId: "rule-789",
		originalSeriesId: "series-123",
		originalInstanceStartTime: new Date("2024-03-15T09:00:00Z"),
		isCancelled: false,
		generatedAt: new Date("2024-03-01T00:00:00Z"),
		lastUpdatedAt: null,
		version: "1",
		sequenceNumber: 1,
		totalCount: 10,
		allDay: false,
		isPublic: true,
		isRegisterable: true,
		isInviteOnly: false,
		creatorId: "creator-123",
		updaterId: null,
		createdAt: new Date("2024-03-01T00:00:00Z"),
		updatedAt: null,
		hasExceptions: false,
		appliedExceptionData: null,
		exceptionCreatedBy: null,
		exceptionCreatedAt: null,
		attachments: [],
	};

	beforeEach(() => {
		const { context } = createMockGraphQLContext(true, "user-123");
		ctx = context;
=======
import { beforeEach, describe, expect, it } from "vitest";
import type { GraphQLContext } from "~/src/graphql/context";
import type { EventAttendee as EventAttendeeType } from "~/src/graphql/types/EventAttendee/EventAttendee";
import { eventAttendeeEventResolver } from "~/src/graphql/types/EventAttendee/event";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";

describe("EventAttendee Event Resolver Tests", () => {
	let ctx: GraphQLContext;
	let mockEventAttendee: EventAttendeeType;
	let mocks: ReturnType<typeof createMockGraphQLContext>["mocks"];

	beforeEach(() => {
		const { context, mocks: newMocks } = createMockGraphQLContext(
			true,
			"user-123",
		);
		ctx = context;
		mocks = newMocks;
>>>>>>> upstream
		mockEventAttendee = {
			id: "attendee-123",
			userId: "user-789",
			eventId: "event-456",
			recurringEventInstanceId: null,
			checkinTime: null,
			checkoutTime: null,
			feedbackSubmitted: false,
			isInvited: true,
			isRegistered: true,
			isCheckedIn: false,
			isCheckedOut: false,
			createdAt: new Date("2024-03-10T08:00:00Z"),
			updatedAt: new Date("2024-03-10T08:00:00Z"),
		} as EventAttendeeType;
	});

<<<<<<< HEAD
	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

=======
>>>>>>> upstream
	describe("Authentication", () => {
		it("should throw unauthenticated error if user is not logged in", async () => {
			ctx.currentClient.isAuthenticated = false;

			await expect(
				eventAttendeeEventResolver(mockEventAttendee, {}, ctx),
			).rejects.toThrow(
				new TalawaGraphQLError({ extensions: { code: "unauthenticated" } }),
			);
		});
	});

	describe("Standalone Event Resolution", () => {
		it("should successfully resolve standalone event", async () => {
			const mockEvent = {
				id: "event-456",
				name: "Test Event",
				description: "Test Description",
				startAt: new Date("2024-03-10T09:00:00Z"),
				endAt: new Date("2024-03-10T12:00:00Z"),
				organizationId: "org-123",
				isPublic: true,
				isRegisterable: true,
				allDay: false,
			};

<<<<<<< HEAD
			ctx.dataloaders.event.load = vi.fn().mockResolvedValue(mockEvent);
=======
			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				mockEvent,
			);
>>>>>>> upstream

			const result = await eventAttendeeEventResolver(
				mockEventAttendee,
				{},
				ctx,
			);

			expect(result).toEqual({
				...mockEvent,
				attachments: [],
			});
<<<<<<< HEAD
			expect(ctx.dataloaders.event.load).toHaveBeenCalledWith("event-456");
		});

		it("should throw unexpected error if standalone event is not found", async () => {
			ctx.dataloaders.event.load = vi.fn().mockResolvedValue(null);
=======
			expect(
				mocks.drizzleClient.query.eventsTable.findFirst,
			).toHaveBeenCalledWith({
				where: expect.any(Object),
			});
		});

		it("should throw unexpected error if standalone event is not found", async () => {
			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				undefined,
			);
>>>>>>> upstream

			await expect(
				eventAttendeeEventResolver(mockEventAttendee, {}, ctx),
			).rejects.toThrow(
				new TalawaGraphQLError({ extensions: { code: "unexpected" } }),
			);

			expect(ctx.log.warn).toHaveBeenCalledWith(
<<<<<<< HEAD
				{
					eventAttendeeId: "attendee-123",
					eventId: "event-456",
				},
				"DataLoader returned null for an event attendee's event id that isn't null.",
			);
		});

		it("should handle DataLoader error when fetching standalone event", async () => {
			ctx.dataloaders.event.load = vi
				.fn()
				.mockRejectedValue(new Error("Database connection failed"));
=======
				"Postgres select operation returned an empty array for an event attendee's event id that isn't null.",
			);
		});

		it("should handle database error when fetching standalone event", async () => {
			mocks.drizzleClient.query.eventsTable.findFirst.mockRejectedValue(
				new Error("Database connection failed"),
			);
>>>>>>> upstream

			await expect(
				eventAttendeeEventResolver(mockEventAttendee, {}, ctx),
			).rejects.toThrow("Database connection failed");
		});
	});

	describe("Recurring Event Instance Resolution", () => {
<<<<<<< HEAD
		it("should resolve recurring event instance and return resolved instance", async () => {
			ctx.dataloaders.event.load = vi.fn();

=======
		it("should return null for recurring event instances (TODO implementation)", async () => {
>>>>>>> upstream
			const recurringAttendee = {
				...mockEventAttendee,
				eventId: null,
				recurringEventInstanceId: "instance-789",
			} as EventAttendeeType;

<<<<<<< HEAD
			vi.mocked(getRecurringEventInstancesByIds).mockResolvedValue([
				{
					...mockResolvedInstance,
					// FIX: Use 'as unknown' to trick TS without using 'any'
					attachments:
						undefined as unknown as typeof mockResolvedInstance.attachments,
				},
			]);

=======
>>>>>>> upstream
			const result = await eventAttendeeEventResolver(
				recurringAttendee,
				{},
				ctx,
			);
<<<<<<< HEAD

			expect(result).toEqual({
				...mockResolvedInstance,
				attachments: [],
			});
			expect(getRecurringEventInstancesByIds).toHaveBeenCalledWith(
				["instance-789"],
				ctx.drizzleClient,
				ctx.log,
			);
			expect(ctx.dataloaders.event.load).not.toHaveBeenCalled();
		});

		it("should include attachments when resolved instance has attachments", async () => {
=======
			expect(result).toBeNull();
		});

		it("should handle future recurring instance implementation", async () => {
			// This test documents expected behavior once TODO is implemented
>>>>>>> upstream
			const recurringAttendee = {
				...mockEventAttendee,
				eventId: null,
				recurringEventInstanceId: "instance-789",
			} as EventAttendeeType;

<<<<<<< HEAD
			const instanceWithAttachments = {
				...mockResolvedInstance,
				attachments: [
					{
						name: "doc.pdf",
						creatorId: "creator-123",
						updaterId: null,
						mimeType: "image/png",
						eventId: "template-456",
						createdAt: new Date("2024-03-01T00:00:00Z"),
						updatedAt: null,
					},
				],
			};

			vi.mocked(getRecurringEventInstancesByIds).mockResolvedValue([
				instanceWithAttachments,
			]);

=======
			// Currently returns null, but should eventually resolve recurring instances
>>>>>>> upstream
			const result = await eventAttendeeEventResolver(
				recurringAttendee,
				{},
				ctx,
			);
<<<<<<< HEAD

			expect(result?.attachments).toEqual(instanceWithAttachments.attachments);
		});

		it("should throw unexpected error when recurring instance is not found", async () => {
			const recurringAttendee = {
				...mockEventAttendee,
				eventId: null,
				recurringEventInstanceId: "instance-789",
			} as EventAttendeeType;

			vi.mocked(getRecurringEventInstancesByIds).mockResolvedValue([]);

			await expect(
				eventAttendeeEventResolver(recurringAttendee, {}, ctx),
			).rejects.toThrow(
				new TalawaGraphQLError({ extensions: { code: "unexpected" } }),
			);

			expect(ctx.log.warn).toHaveBeenCalledWith(
				{
					eventAttendeeId: "attendee-123",
					recurringEventInstanceId: "instance-789",
				},
				"Failed to find recurring event instance for event attendee.",
			);
		});

		it("should propagate errors from getRecurringEventInstancesByIds", async () => {
			const recurringAttendee = {
				...mockEventAttendee,
				eventId: null,
				recurringEventInstanceId: "instance-789",
			} as EventAttendeeType;

			vi.mocked(getRecurringEventInstancesByIds).mockRejectedValue(
				new Error("Database connection failed"),
			);

			await expect(
				eventAttendeeEventResolver(recurringAttendee, {}, ctx),
			).rejects.toThrow("Database connection failed");
=======
			expect(result).toBeNull();

			// No database calls should be made for recurring instances yet
			expect(
				mocks.drizzleClient.query.eventsTable.findFirst,
			).not.toHaveBeenCalled();
>>>>>>> upstream
		});
	});

	describe("Edge Cases", () => {
		it("should return null when neither eventId nor recurringEventInstanceId exists", async () => {
			const invalidAttendee = {
				...mockEventAttendee,
				eventId: null,
				recurringEventInstanceId: null,
			} as EventAttendeeType;

			const result = await eventAttendeeEventResolver(invalidAttendee, {}, ctx);
			expect(result).toBeNull();
		});

		it("should handle malformed eventId gracefully", async () => {
			const malformedAttendee = {
				...mockEventAttendee,
				eventId: "invalid-uuid-format",
			} as EventAttendeeType;

<<<<<<< HEAD
			ctx.dataloaders.event.load = vi
				.fn()
				.mockRejectedValue(new Error("Invalid UUID format"));
=======
			mocks.drizzleClient.query.eventsTable.findFirst.mockRejectedValue(
				new Error("Invalid UUID format"),
			);
>>>>>>> upstream

			await expect(
				eventAttendeeEventResolver(malformedAttendee, {}, ctx),
			).rejects.toThrow("Invalid UUID format");
		});

		it("should handle deleted events", async () => {
<<<<<<< HEAD
			ctx.dataloaders.event.load = vi.fn().mockResolvedValue(null);
=======
			// Event was deleted but attendee record remains
			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				undefined,
			);
>>>>>>> upstream

			await expect(
				eventAttendeeEventResolver(mockEventAttendee, {}, ctx),
			).rejects.toThrow(
				new TalawaGraphQLError({ extensions: { code: "unexpected" } }),
			);
		});
	});

	describe("Event Data Handling", () => {
		it("should always include empty attachments array", async () => {
			const eventWithoutAttachments = {
				id: "event-456",
				name: "Simple Event",
				organizationId: "org-123",
			};

<<<<<<< HEAD
			ctx.dataloaders.event.load = vi
				.fn()
				.mockResolvedValue(eventWithoutAttachments);
=======
			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				eventWithoutAttachments,
			);
>>>>>>> upstream

			const result = await eventAttendeeEventResolver(
				mockEventAttendee,
				{},
				ctx,
			);

			expect(result).toEqual({
				...eventWithoutAttachments,
				attachments: [],
			});
			expect(result?.attachments).toEqual([]);
		});

		it("should handle events with complete data", async () => {
			const completeEvent = {
				id: "event-456",
				name: "Complete Event",
				description: "Full event description",
				location: "New York Convention Center",
				startAt: new Date("2024-03-15T09:00:00Z"),
				endAt: new Date("2024-03-15T17:00:00Z"),
				organizationId: "org-123",
				creatorId: "creator-123",
				updaterId: "updater-456",
				isPublic: true,
				isRegisterable: true,
				allDay: false,
				createdAt: new Date("2024-03-01T10:00:00Z"),
				updatedAt: new Date("2024-03-05T14:00:00Z"),
			};

<<<<<<< HEAD
			ctx.dataloaders.event.load = vi.fn().mockResolvedValue(completeEvent);
=======
			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				completeEvent,
			);
>>>>>>> upstream

			const result = await eventAttendeeEventResolver(
				mockEventAttendee,
				{},
				ctx,
			);

			expect(result).toEqual({
				...completeEvent,
				attachments: [],
			});
		});

		it("should handle events with minimal data", async () => {
			const minimalEvent = {
				id: "event-456",
				name: "Minimal Event",
				organizationId: "org-123",
<<<<<<< HEAD
			};

			ctx.dataloaders.event.load = vi.fn().mockResolvedValue(minimalEvent);
=======
				// Most other fields null/undefined
			};

			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				minimalEvent,
			);
>>>>>>> upstream

			const result = await eventAttendeeEventResolver(
				mockEventAttendee,
				{},
				ctx,
			);

			expect(result).toEqual({
				...minimalEvent,
				attachments: [],
			});
		});
	});

	describe("Performance Tests", () => {
		it("should handle multiple attendees for same event efficiently", async () => {
			const sharedEvent = {
				id: "event-456",
				name: "Popular Event",
				organizationId: "org-123",
			};

<<<<<<< HEAD
			ctx.dataloaders.event.load = vi.fn().mockResolvedValue(sharedEvent);

=======
			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				sharedEvent,
			);

			// Multiple attendees attending same event
>>>>>>> upstream
			const attendees = Array.from({ length: 12 }, (_, i) => ({
				...mockEventAttendee,
				id: `attendee-${i}`,
				userId: `user-${i}`,
			})) as EventAttendeeType[];

<<<<<<< HEAD
=======
			const startTime = Date.now();
>>>>>>> upstream
			const results = await Promise.all(
				attendees.map((attendee) =>
					eventAttendeeEventResolver(attendee, {}, ctx),
				),
			);
<<<<<<< HEAD
=======
			const endTime = Date.now();
>>>>>>> upstream

			expect(results).toHaveLength(12);
			for (const result of results) {
				expect(result).toEqual({
					...sharedEvent,
					attachments: [],
				});
			}
<<<<<<< HEAD
=======

			// Should handle bulk operations efficiently
			expect(endTime - startTime).toBeLessThan(200);
>>>>>>> upstream
		});

		it("should handle large event data without performance degradation", async () => {
			const largeEvent = {
				id: "event-456",
				name: "Large Event with Very Long Name ".repeat(50),
				description: "Large description ".repeat(200),
				location: "Large location data ".repeat(10),
				organizationId: "org-123",
			};

<<<<<<< HEAD
			ctx.dataloaders.event.load = vi.fn().mockResolvedValue(largeEvent);

=======
			mocks.drizzleClient.query.eventsTable.findFirst.mockResolvedValue(
				largeEvent,
			);

			const startTime = Date.now();
>>>>>>> upstream
			const result = await eventAttendeeEventResolver(
				mockEventAttendee,
				{},
				ctx,
			);
<<<<<<< HEAD
=======
			const endTime = Date.now();
>>>>>>> upstream

			expect(result).toEqual({
				...largeEvent,
				attachments: [],
			});
<<<<<<< HEAD
=======
			expect(endTime - startTime).toBeLessThan(100);
>>>>>>> upstream
		});
	});

	describe("Database Recovery Scenarios", () => {
		it("should handle transient database failures", async () => {
<<<<<<< HEAD
			ctx.dataloaders.event.load = vi
				.fn()
=======
			// First call fails, second succeeds
			mocks.drizzleClient.query.eventsTable.findFirst
>>>>>>> upstream
				.mockRejectedValueOnce(new Error("Transient database error"))
				.mockResolvedValueOnce({
					id: "event-456",
					name: "Recovery Test Event",
					organizationId: "org-123",
				});

			// First call should fail
			await expect(
				eventAttendeeEventResolver(mockEventAttendee, {}, ctx),
			).rejects.toThrow("Transient database error");

			// Second call should succeed
			const result = await eventAttendeeEventResolver(
				mockEventAttendee,
				{},
				ctx,
			);
			expect(result).toBeDefined();
			expect(result?.id).toBe("event-456");
		});

		it("should handle database rollback scenarios", async () => {
<<<<<<< HEAD
			ctx.dataloaders.event.load = vi
				.fn()
				.mockRejectedValue(new Error("Transaction was rolled back"));
=======
			mocks.drizzleClient.query.eventsTable.findFirst.mockRejectedValue(
				new Error("Transaction was rolled back"),
			);
>>>>>>> upstream

			await expect(
				eventAttendeeEventResolver(mockEventAttendee, {}, ctx),
			).rejects.toThrow("Transaction was rolled back");
		});
	});
<<<<<<< HEAD

	describe("Attachments Nullish Coalescing", () => {
		it("should return empty array when resolved instance has null attachments", async () => {
			const recurringAttendee = {
				...mockEventAttendee,
				eventId: null,
				recurringEventInstanceId: "instance-789",
			} as EventAttendeeType;

			const instanceWithNullAttachments = {
				id: "instance-789",
				name: "Recurring Instance Event",
				description: "Instance description",
				location: "Instance location",
				actualStartTime: new Date("2024-03-15T09:00:00Z"),
				actualEndTime: new Date("2024-03-15T12:00:00Z"),
				organizationId: "org-123",
				baseRecurringEventId: "template-456",
				recurrenceRuleId: "rule-789",
				originalSeriesId: "series-123",
				originalInstanceStartTime: new Date("2024-03-15T09:00:00Z"),
				isCancelled: false,
				generatedAt: new Date("2024-03-01T00:00:00Z"),
				lastUpdatedAt: null,
				version: "1",
				sequenceNumber: 1,
				totalCount: 10,
				allDay: false,
				isPublic: true,
				isRegisterable: true,
				isInviteOnly: false,
				creatorId: "creator-123",
				updaterId: null,
				createdAt: new Date("2024-03-01T00:00:00Z"),
				updatedAt: null,
				hasExceptions: false,
				appliedExceptionData: null,
				exceptionCreatedBy: null,
				exceptionCreatedAt: null,

				attachments: null as unknown as typeof mockResolvedInstance.attachments,
			};

			vi.mocked(getRecurringEventInstancesByIds).mockResolvedValue([
				instanceWithNullAttachments,
			]);

			const result = await eventAttendeeEventResolver(
				recurringAttendee,
				{},
				ctx,
			);

			expect(result?.attachments).toEqual([]);
		});
	});
=======
>>>>>>> upstream
});
