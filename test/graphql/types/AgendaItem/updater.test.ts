import { createMockGraphQLContext } from "test/_Mocks_/mockContextCreator/mockContextCreator";
<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from "vitest";
=======
import { beforeEach, describe, expect, it } from "vitest";
>>>>>>> upstream
import type { GraphQLContext } from "~/src/graphql/context";
import type { AgendaItem as AgendaItemType } from "~/src/graphql/types/AgendaItem/AgendaItem";
import { resolveUpdater } from "~/src/graphql/types/AgendaItem/updater";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";

<<<<<<< HEAD
describe("AgendaItem.updater resolver", () => {
	let ctx: GraphQLContext;
	let mockAgendaItem: AgendaItemType;
	let mocks: ReturnType<typeof createMockGraphQLContext>["mocks"];

	beforeEach(() => {
=======
describe("AgendaItem Resolver - Updater Field", () => {
	let ctx: GraphQLContext;
	let mockAgendaItem: AgendaItemType;
	let mocks: ReturnType<typeof createMockGraphQLContext>["mocks"];
	beforeEach(() => {
		mockAgendaItem = {
			id: "agendaItem-123",
			folderId: "folder-123",
			updaterId: "user-123",
		} as AgendaItemType;
>>>>>>> upstream
		const { context, mocks: newMocks } = createMockGraphQLContext(
			true,
			"user-123",
		);
		ctx = context;
		mocks = newMocks;
<<<<<<< HEAD

		mockAgendaItem = {
			id: "agenda-item-123",
			folderId: "folder-123",
			updaterId: "user-123",
		} as AgendaItemType;
	});

	it("should throw unauthenticated error if client is not authenticated", async () => {
		ctx.currentClient.isAuthenticated = false;

		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
			new TalawaGraphQLError({ extensions: { code: "unauthenticated" } }),
		);
	});

	it("should throw unauthenticated error if current user is not found", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue(undefined);

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			isAgendaItemFolder: true,
			event: {
				startAt: new Date(),
				organization: {
					countryCode: "US",
					membershipsWhereOrganization: [{ role: "administrator" }],
				},
			},
		});

=======
	});

	it("should throw unauthenticated error if user is not logged in or not found", async () => {
		ctx.currentClient.isAuthenticated = false;
		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
			new TalawaGraphQLError({ extensions: { code: "unauthenticated" } }),
		);

		ctx.currentClient.isAuthenticated = true;
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue(undefined);
>>>>>>> upstream
		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
			new TalawaGraphQLError({ extensions: { code: "unauthenticated" } }),
		);
	});

<<<<<<< HEAD
	it("should throw unexpected error if agenda folder does not exist", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			id: "user-123",
			role: "administrator",
		});

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue(
			undefined,
		);

		const logSpy = vi.spyOn(ctx.log, "error");

		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
			new TalawaGraphQLError({ extensions: { code: "unexpected" } }),
		);

		expect(logSpy).toHaveBeenCalledWith(
			"Postgres select operation returned an empty array for an agenda item's folder id that isn't null.",
		);
	});

	it("should throw unauthorized_action if user is not admin and not org admin", async () => {
=======
	it("should throw unauthorized_action error if user is not an administrator", async () => {
>>>>>>> upstream
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			id: "user-123",
			role: "member",
		});
<<<<<<< HEAD

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			isAgendaItemFolder: true,
			event: {
				startAt: new Date(),
				organization: {
					countryCode: "US",
=======
		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			event: {
				organization: {
>>>>>>> upstream
					membershipsWhereOrganization: [{ role: "member" }],
				},
			},
		});

		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
<<<<<<< HEAD
			new TalawaGraphQLError({ extensions: { code: "unauthorized_action" } }),
		);
	});

	it("should return null if updaterId is null", async () => {
		mockAgendaItem.updaterId = null;

=======
			new TalawaGraphQLError({
				extensions: { code: "unauthorized_action" },
			}),
		);
	});

	it("should throw unexpected error if agenda folder is not found", async () => {
>>>>>>> upstream
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			id: "user-123",
			role: "administrator",
		});
<<<<<<< HEAD

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			isAgendaItemFolder: true,
			event: {
				startAt: new Date(),
				organization: {
					countryCode: "US",
					membershipsWhereOrganization: [],
				},
			},
		});

		const result = await resolveUpdater(mockAgendaItem, {}, ctx);
		expect(result).toBeNull();
	});

	it("should allow access if user is organization administrator (not system admin)", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			id: "user-123",
			role: "member", // not a system admin
		});

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			isAgendaItemFolder: true,
			event: {
				startAt: new Date(),
				organization: {
					countryCode: "US",
					membershipsWhereOrganization: [{ role: "administrator" }], // is org admin
				},
			},
		});

		mockAgendaItem.updaterId = null;
		const result = await resolveUpdater(mockAgendaItem, {}, ctx);
		expect(result).toBeNull();
	});

	it("should return current user if updaterId matches current user id", async () => {
		const currentUser = {
			id: "user-123",
			role: "administrator",
		};

		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue(
			currentUser,
		);

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			isAgendaItemFolder: true,
			event: {
				startAt: new Date(),
				organization: {
					countryCode: "US",
					membershipsWhereOrganization: [],
				},
			},
		});

		const result = await resolveUpdater(mockAgendaItem, {}, ctx);
		expect(result).toEqual(currentUser);
	});

	it("should throw unexpected error if updater user does not exist", async () => {
		mockAgendaItem.updaterId = "user-456";

=======
		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue(
			undefined,
		);

		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
			new TalawaGraphQLError({
				extensions: { code: "unexpected" },
			}),
		);
		expect(ctx.log.error).toHaveBeenCalledWith(
			"Postgres select operation returned an empty array for an agenda item's folder id that isn't null.",
		);
	});

	it("should throw unexpected error if updater user does not exist", async () => {
>>>>>>> upstream
		mocks.drizzleClient.query.usersTable.findFirst
			.mockResolvedValueOnce({
				id: "user-123",
				role: "administrator",
<<<<<<< HEAD
			}) // current user
			.mockResolvedValueOnce(undefined); // updater not found

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			isAgendaItemFolder: true,
			event: {
				startAt: new Date(),
				organization: {
					countryCode: "US",
					membershipsWhereOrganization: [],
=======
			}) // First call: current user
			.mockResolvedValueOnce(undefined); // Second call: updater does not exist

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			event: {
				organization: {
					membershipsWhereOrganization: [{ role: "administrator" }],
>>>>>>> upstream
				},
			},
		});

<<<<<<< HEAD
		const logSpy = vi.spyOn(ctx.log, "error");

		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
			new TalawaGraphQLError({ extensions: { code: "unexpected" } }),
		);

		expect(logSpy).toHaveBeenCalledWith(
=======
		// the updater ID in the mockAgendaItem to a different user.
		mockAgendaItem.updaterId = "user-456";

		await expect(resolveUpdater(mockAgendaItem, {}, ctx)).rejects.toThrow(
			new TalawaGraphQLError({
				extensions: { code: "unexpected" },
			}),
		);

		expect(ctx.log.error).toHaveBeenCalledWith(
>>>>>>> upstream
			"Postgres select operation returned an empty array for an agenda item's updater id that isn't null.",
		);
	});

<<<<<<< HEAD
	it("should return updater user if different from current user", async () => {
		mockAgendaItem.updaterId = "user-456";

		const currentUser = {
			id: "user-123",
			role: "administrator",
		};

		const updaterUser = {
			id: "user-456",
			role: "member",
		};

		mocks.drizzleClient.query.usersTable.findFirst
			.mockResolvedValueOnce(currentUser) // current user
			.mockResolvedValueOnce(updaterUser); // updater user

		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			isAgendaItemFolder: true,
			event: {
				startAt: new Date(),
				organization: {
					countryCode: "US",
					membershipsWhereOrganization: [],
=======
	it("should resolve successfully if user is an administrator and part of the organization", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			id: "user-123",
			role: "administrator",
		});
		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			event: {
				organization: {
					membershipsWhereOrganization: [{ role: "administrator" }],
>>>>>>> upstream
				},
			},
		});

<<<<<<< HEAD
		const result = await resolveUpdater(mockAgendaItem, {}, ctx);
		expect(result).toEqual(updaterUser);
=======
		await expect(
			resolveUpdater(mockAgendaItem, {}, ctx),
		).resolves.toBeDefined();

		mockAgendaItem.updaterId = null;
		const result_1 = await resolveUpdater(mockAgendaItem, {}, ctx);
		expect(result_1).toBeNull();
	});

	it("should test the innermost where clause in query", async () => {
		// Mock the return value of usersTable.findFirst
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			id: "user-123",
			role: "administrator",
		});

		// Mock the return value of agendaFoldersTable.findFirst
		mocks.drizzleClient.query.agendaFoldersTable.findFirst.mockResolvedValue({
			event: {
				organization: {
					membershipsWhereOrganization: [{ role: "administrator" }],
				},
			},
		});

		await expect(
			resolveUpdater(mockAgendaItem, {}, ctx),
		).resolves.toBeDefined();
>>>>>>> upstream
	});
});
