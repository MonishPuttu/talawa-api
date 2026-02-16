import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
<<<<<<< HEAD
import { afterEach, expect, suite, test, vi } from "vitest";
import {
	agendaCategoriesTable,
	agendaFoldersTable,
	eventsTable,
	organizationMembershipsTable,
	organizationsTable,
} from "~/src/drizzle/schema";
import { agendaItemsTable } from "~/src/drizzle/tables/agendaItems";
import { agendaItemUrlTable } from "~/src/drizzle/tables/agendaItemUrls";
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import {
	Mutation_createAgendaCategory,
=======
import { afterEach, expect, suite, test } from "vitest";
import {
	agendaFoldersTable,
	agendaItemsTable,
	usersTable,
} from "~/src/drizzle/schema";
import type {
	TalawaGraphQLFormattedError,
	UnauthenticatedExtensions,
} from "~/src/utilities/TalawaGraphQLError";
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import { createRegularUserUsingAdmin } from "../createRegularUserUsingAdmin";
import {
>>>>>>> upstream
	Mutation_createAgendaFolder,
	Mutation_createAgendaItem,
	Mutation_createEvent,
	Mutation_createOrganization,
	Mutation_createOrganizationMembership,
<<<<<<< HEAD
	Mutation_createUser,
	Mutation_updateAgendaItem,
	Query_signIn,
} from "../documentNodes";

let cachedAdminAuth: { token: string; userId: string } | null = null;

async function getAdminAuth() {
	if (cachedAdminAuth) return cachedAdminAuth;

	const signInResult = await mercuriusClient.query(Query_signIn, {
		variables: {
			input: {
				emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
				password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
			},
		},
	});

	assertToBeNonNullish(signInResult.data?.signIn?.authenticationToken);
	assertToBeNonNullish(signInResult.data?.signIn?.user?.id);

	cachedAdminAuth = {
		token: signInResult.data.signIn.authenticationToken,
		userId: signInResult.data.signIn.user.id,
	};

	return cachedAdminAuth;
}

async function getAdminUserId() {
	const auth = await getAdminAuth();
	return auth.userId;
}

async function insertAgendaItemUrls(agendaItemId: string, urls: string[]) {
	const adminUserId = await getAdminUserId();

	await server.drizzleClient.insert(agendaItemUrlTable).values(
		urls.map((url) => ({
			agendaItemId,
			url,
			creatorId: adminUserId,
			updaterId: adminUserId,
		})),
	);
}

async function createOrganizationAndEvent() {
	const { token, userId } = await getAdminAuth();

	const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
		headers: { authorization: `bearer ${token}` },
		variables: {
			input: {
				name: `Org ${faker.string.uuid()}`,
				countryCode: "us",
			},
		},
	});

	const orgId = orgRes.data?.createOrganization?.id;
	assertToBeNonNullish(orgId);

	await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
		headers: { authorization: `bearer ${token}` },
		variables: {
			input: {
				organizationId: orgId,
				memberId: userId,
				role: "administrator",
			},
		},
	});

	const eventRes = await mercuriusClient.mutate(Mutation_createEvent, {
		headers: { authorization: `bearer ${token}` },
		variables: {
			input: {
				organizationId: orgId,
				name: "Test Event",
				description: "Agenda Event",
				startAt: new Date(Date.now() + 5_000).toISOString(),
				endAt: new Date(Date.now() + 3_600_000 + 5_000).toISOString(),
				location: "Test Location",
			},
		},
	});

	const eventId = eventRes.data?.createEvent?.id;
	assertToBeNonNullish(eventId);

	return { orgId, eventId };
}

async function createCategoryFolderAgendaItem() {
	const { token } = await getAdminAuth();
	const { orgId, eventId } = await createOrganizationAndEvent();

	const categoryRes = await mercuriusClient.mutate(
		Mutation_createAgendaCategory,
		{
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					eventId,
					name: "Category",
					description: "Agenda Category",
=======
	Mutation_deleteAgendaItem,
	Mutation_deleteOrganization,
	Mutation_deleteOrganizationMembership,
	Mutation_deleteStandaloneEvent,
	Mutation_updateAgendaItem,
	Query_signIn,
} from "../documentNodes";
// Helper Types
interface TestAgendaItem {
	agendaItemId: string;
	orgId: string;
	eventId: string;
	folderId: string;
	cleanup: () => Promise<void>;
}

/**
 * Helper function to get admin auth token with proper error handling
 * @throws {Error} If admin credentials are invalid or missing
 * @returns {Promise<string>} Admin authentication token
 */
let cachedAdminToken: string | null = null;
let cachedAdminId: string | null = null;
async function getAdminAuthTokenAndId(): Promise<{
	cachedAdminToken: string;
	cachedAdminId: string;
}> {
	if (cachedAdminToken && cachedAdminId) {
		return { cachedAdminToken, cachedAdminId };
	}

	try {
		// Check if admin credentials exist
		if (
			!server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS ||
			!server.envConfig.API_ADMINISTRATOR_USER_PASSWORD
		) {
			throw new Error(
				"Admin credentials are missing in environment configuration",
			);
		}
		const adminSignInResult = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		// Check for GraphQL errors
		if (adminSignInResult.errors) {
			throw new Error(
				`Admin authentication failed: ${
					adminSignInResult.errors[0]?.message || "Unknown error"
				}`,
			);
		}
		// Check for missing data
		if (!adminSignInResult.data?.signIn?.authenticationToken) {
			throw new Error(
				"Admin authentication succeeded but no token was returned",
			);
		}
		if (!adminSignInResult.data?.signIn?.user?.id) {
			throw new Error(
				"Admin authentication succeeded but no user id was returned",
			);
		}
		const token = adminSignInResult.data.signIn.authenticationToken;
		const id = adminSignInResult.data.signIn.user.id;
		cachedAdminToken = token;
		cachedAdminId = id;
		return { cachedAdminToken: token, cachedAdminId: id };
	} catch (error) {
		// Wrap and rethrow with more context
		throw new Error(
			`Failed to get admin authentication token: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}

async function createTestAgendaItem(): Promise<TestAgendaItem> {
	const { cachedAdminToken: adminAuthToken, cachedAdminId: adminId } =
		await getAdminAuthTokenAndId();

	// Create organization
	const createOrgResult = await mercuriusClient.mutate(
		Mutation_createOrganization,
		{
			headers: {
				authorization: `bearer ${adminAuthToken}`,
			},
			variables: {
				input: {
					name: `Org ${faker.string.uuid()}`,
					countryCode: "us",
>>>>>>> upstream
				},
			},
		},
	);

<<<<<<< HEAD
	const categoryId = categoryRes.data?.createAgendaCategory?.id;
	assertToBeNonNullish(categoryId);

	const folderRes = await mercuriusClient.mutate(Mutation_createAgendaFolder, {
		headers: { authorization: `bearer ${token}` },
		variables: {
			input: {
				eventId,
				organizationId: orgId,
				name: "Folder",
				sequence: 2,
=======
	assertToBeNonNullish(createOrgResult.data);
	assertToBeNonNullish(createOrgResult.data.createOrganization);
	const orgId = createOrgResult.data.createOrganization.id;

	// Create organization membership for the admin user
	const membershipResult = await mercuriusClient.mutate(
		Mutation_createOrganizationMembership,
		{
			headers: {
				authorization: `bearer ${adminAuthToken}`,
			},
			variables: {
				input: {
					organizationId: orgId,
					memberId: adminId,
					role: "administrator",
				},
			},
		},
	);

	if (membershipResult.errors) {
		throw new Error(
			`Failed to create organization membership. Errors: ${JSON.stringify(
				membershipResult.errors,
			)}`,
		);
	}

	// Create event
	const createEventResult = await mercuriusClient.mutate(Mutation_createEvent, {
		headers: {
			authorization: `bearer ${adminAuthToken}`,
		},
		variables: {
			input: {
				name: `Event ${faker.string.uuid()}`,
				organizationId: orgId,
				startAt: new Date().toISOString(),
				endAt: new Date(Date.now() + 86400000).toISOString(),
				description: "Test event",
>>>>>>> upstream
			},
		},
	});

<<<<<<< HEAD
	const folderId = folderRes.data?.createAgendaFolder?.id;
	assertToBeNonNullish(folderId);

	const agendaItemRes = await mercuriusClient.mutate(
		Mutation_createAgendaItem,
		{
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					name: "Agenda Item",
					type: "general",
					eventId,
					folderId,
					categoryId,
					sequence: 2,
=======
	assertToBeNonNullish(createEventResult.data);
	assertToBeNonNullish(createEventResult.data.createEvent);
	const eventId = createEventResult.data.createEvent.id;

	// Create agenda folder
	const createFolderResult = await mercuriusClient.mutate(
		Mutation_createAgendaFolder,
		{
			headers: {
				authorization: `bearer ${adminAuthToken}`,
			},
			variables: {
				input: {
					name: `Folder ${faker.string.uuid()}`,
					eventId: eventId,
					isAgendaItemFolder: true,
				},
			},
		},
	);

	assertToBeNonNullish(createFolderResult.data);
	assertToBeNonNullish(createFolderResult.data.createAgendaFolder);
	const folderId = createFolderResult.data.createAgendaFolder.id;

	// Create agenda item
	const createAgendaItemResult = await mercuriusClient.mutate(
		Mutation_createAgendaItem,
		{
			headers: {
				authorization: `bearer ${adminAuthToken}`,
			},
			variables: {
				input: {
					name: `Agenda Item ${faker.string.uuid()}`,
					folderId: folderId,
					type: "general",
					duration: "30m",
					description: "Test agenda item description",
>>>>>>> upstream
				},
			},
		},
	);

<<<<<<< HEAD
	const agendaItemId = agendaItemRes.data?.createAgendaItem?.id;
	assertToBeNonNullish(agendaItemId);

	return {
		orgId,
		eventId,
		folderId,
		categoryId,
		agendaItemId,
		cleanup: async () => {
			await server.drizzleClient
				.delete(agendaItemUrlTable)
				.where(eq(agendaItemUrlTable.agendaItemId, agendaItemId));

			await server.drizzleClient
				.delete(agendaItemsTable)
				.where(eq(agendaItemsTable.id, agendaItemId));

			await server.drizzleClient
				.delete(agendaFoldersTable)
				.where(eq(agendaFoldersTable.id, folderId));

			await server.drizzleClient
				.delete(agendaCategoriesTable)
				.where(eq(agendaCategoriesTable.id, categoryId));

			await server.drizzleClient
				.delete(eventsTable)
				.where(eq(eventsTable.id, eventId));

			await server.drizzleClient
				.delete(organizationMembershipsTable)
				.where(eq(organizationMembershipsTable.organizationId, orgId));

			await server.drizzleClient
				.delete(organizationsTable)
				.where(eq(organizationsTable.id, orgId));
=======
	assertToBeNonNullish(createAgendaItemResult.data);
	assertToBeNonNullish(createAgendaItemResult.data.createAgendaItem);
	const agendaItemId = createAgendaItemResult.data.createAgendaItem.id;

	return {
		agendaItemId,
		orgId,
		eventId,
		folderId,
		cleanup: async () => {
			const errors: Error[] = [];
			try {
				await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
					headers: { authorization: `bearer ${adminAuthToken}` },
					variables: { input: { id: agendaItemId } },
				});
			} catch (error) {
				errors.push(error as Error);
				console.error("Failed to delete agenda item:", error);
			}
			try {
				await mercuriusClient.mutate(Mutation_deleteStandaloneEvent, {
					headers: { authorization: `bearer ${adminAuthToken}` },
					variables: { input: { id: eventId } },
				});
			} catch (error) {
				errors.push(error as Error);
				console.error("Failed to delete event:", error);
			}
			try {
				await mercuriusClient.mutate(Mutation_deleteOrganization, {
					headers: { authorization: `bearer ${adminAuthToken}` },
					variables: { input: { id: orgId } },
				});
			} catch (error) {
				errors.push(error as Error);
				console.error("Failed to delete organization:", error);
			}
			if (errors.length > 0) {
				throw new AggregateError(errors, "One or more cleanup steps failed");
			}
>>>>>>> upstream
		},
	};
}

<<<<<<< HEAD
suite("Mutation field updateAgendaItem", () => {
	const cleanupFns: Array<() => Promise<void>> = [];
	afterEach(async () => {
		vi.restoreAllMocks();

		for (const fn of [...cleanupFns].reverse()) {
			try {
				await fn();
			} catch (e) {
				console.error("Cleanup failed:", e);
			}
		}

		cleanupFns.length = 0;
		cachedAdminAuth = null;
	});

	test("should update agenda item successfully", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					name: "Updated Name",
					description: "Updated description",
				},
			},
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.updateAgendaItem).toEqual(
			expect.objectContaining({
				id: agendaItemId,
				name: "Updated Name",
			}),
		);
	});

	test("should throw unauthenticated error when not authenticated", async () => {
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			variables: {
				input: {
					id: faker.string.uuid(),
					name: "Fail",
				},
			},
		});

		expect(result.errors?.[0]?.extensions?.code).toBe("unauthenticated");
	});

	test("should throw invalid_arguments error for invalid input", async () => {
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: "invalid-id",
					name: "Fail",
				},
			},
		});

		expect(result.errors?.[0]?.extensions?.code).toBe("invalid_arguments");
	});

	test("should throw not found error when agenda item does not exist", async () => {
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: faker.string.uuid(),
					name: "Fail",
				},
			},
		});

		expect(result.errors?.[0]?.extensions?.code).toBe(
			"arguments_associated_resources_not_found",
		);
	});

	test("should throw forbidden error when updating note type with duration", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;

		// Force type to "note" directly
		await server.drizzleClient
			.update(agendaItemsTable)
			.set({ type: "note" })
			.where(eq(agendaItemsTable.id, agendaItemId));
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					duration: "10m",
				},
			},
		});

		expect(result.errors?.[0]?.extensions?.code).toBe(
			"forbidden_action_on_arguments_associated_resources",
		);
	});

	test("should throw unauthorized error for non-admin user", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;
		const { token } = await getAdminAuth();
		const userRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					emailAddress: `user${faker.string.ulid()}@x.com`,
					password: "password",
					name: "User",
					role: "regular",
					isEmailAddressVerified: true,
				},
			},
		});

		const userToken = userRes.data?.createUser?.authenticationToken;
		assertToBeNonNullish(userToken);

		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${userToken}` },
			variables: {
				input: {
					id: agendaItemId,
					name: "Fail",
				},
			},
		});

		expect(result.errors?.[0]?.extensions?.code).toBe(
			"unauthorized_action_on_arguments_associated_resources",
		);
	});

	test("should replace attachments when provided", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					attachments: [
						{
							name: "file.jpeg",
							fileHash:
								"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
							mimeType: "IMAGE_JPEG",
							objectName: "file.jpeg",
						},
					],
				},
			},
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.updateAgendaItem?.attachments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "file.jpeg",
					mimeType: "image/jpeg",
				}),
			]),
		);
	});

	test("should update categoryId from one category to another", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const { eventId, categoryId, agendaItemId } = env;
		const { token } = await getAdminAuth();
		// Create a second category in the same event
		const secondCategoryRes = await mercuriusClient.mutate(
			Mutation_createAgendaCategory,
			{
				headers: { authorization: `bearer ${token}` },
				variables: {
					input: {
						eventId,
						name: "Second Category",
						description: "Another category",
					},
				},
			},
		);

		const newCategoryId = secondCategoryRes.data?.createAgendaCategory?.id;
		assertToBeNonNullish(newCategoryId);

		// Sanity check: agenda item initially has first category
		const beforeUpdate =
			await server.drizzleClient.query.agendaItemsTable.findFirst({
				columns: { categoryId: true },
				where: (fields, operators) => operators.eq(fields.id, agendaItemId),
			});

		assertToBeNonNullish(beforeUpdate);
		expect(beforeUpdate.categoryId).toBe(categoryId);
		// Update agenda item → change category
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					categoryId: newCategoryId,
				},
			},
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.updateAgendaItem).toEqual(
			expect.objectContaining({
				id: agendaItemId,
				category: expect.objectContaining({
					id: newCategoryId,
				}),
			}),
		);

		// Verify DB state reflects updated category
		const afterUpdate =
			await server.drizzleClient.query.agendaItemsTable.findFirst({
				columns: { categoryId: true },
				where: (fields, operators) => operators.eq(fields.id, agendaItemId),
			});

		assertToBeNonNullish(afterUpdate);
		expect(afterUpdate.categoryId).toBe(newCategoryId);
	});

	test("should throw not found error when categoryId does not exist", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;

		const nonExistentCategoryId = faker.string.uuid();
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					categoryId: nonExistentCategoryId,
				},
			},
		});

		expect(result.data?.updateAgendaItem ?? null).toEqual(null);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "arguments_associated_resources_not_found",
						issues: expect.arrayContaining([
							expect.objectContaining({
								argumentPath: ["input", "categoryId"],
							}),
						]),
					}),
				}),
			]),
		);
	});

	test("should throw forbidden error when category belongs to a different event", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const { agendaItemId, eventId: itemEventId } = env;
		// Create another organization + event
		const otherOrgEvent = await createOrganizationAndEvent();
		const { token } = await getAdminAuth();
		// Create category in DIFFERENT event
		const foreignCategoryRes = await mercuriusClient.mutate(
			Mutation_createAgendaCategory,
			{
				headers: { authorization: `bearer ${token}` },
				variables: {
					input: {
						eventId: otherOrgEvent.eventId,
						name: "Foreign Category",
						description: "Different event category",
					},
				},
			},
		);

		const foreignCategoryId = foreignCategoryRes.data?.createAgendaCategory?.id;
		assertToBeNonNullish(foreignCategoryId);

		// Sanity check (events differ)
		expect(otherOrgEvent.eventId).not.toBe(itemEventId);
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					categoryId: foreignCategoryId,
				},
			},
		});

		expect(result.data?.updateAgendaItem ?? null).toEqual(null);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "forbidden_action_on_arguments_associated_resources",
						issues: expect.arrayContaining([
							expect.objectContaining({
								argumentPath: ["input", "categoryId"],
								message: expect.stringContaining(
									"does not belong to the event",
								),
							}),
						]),
					}),
				}),
			]),
		);
	});

	test("should throw unexpected error when update returns nothing", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;

		// Mock required: This edge case (update returning empty array) cannot be
		// reproduced with real DB constraints. The mock ensures branch coverage
		// for the defensive check after agenda item update.
		const transactionSpy = vi
			.spyOn(server.drizzleClient, "transaction")
			.mockImplementation(async (callback) => {
				const mockTx = {
					...server.drizzleClient,
					update: vi.fn().mockImplementation(() => ({
						set: vi.fn().mockReturnThis(),
						where: vi.fn().mockReturnThis(),
						returning: vi.fn().mockResolvedValue([]),
					})),
					delete: vi.fn().mockReturnThis(),
					insert: vi.fn().mockReturnThis(),
				};

				return callback(mockTx as unknown as Parameters<typeof callback>[0]);
			});

		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					name: "Fail",
				},
			},
		});

		expect(transactionSpy).toHaveBeenCalled();
		expect(result.errors?.[0]?.extensions?.code).toBe("unexpected");
	});

	test("should delete all URLs when url is provided as empty array", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;

		await insertAgendaItemUrls(agendaItemId, [
			"https://example.com/1",
			"https://example.com/2",
		]);
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					url: [],
				},
			},
		});

		expect(result.errors).toBeUndefined();

		const urlsAfter = await server.drizzleClient
			.select()
			.from(agendaItemUrlTable)
			.where(eq(agendaItemUrlTable.agendaItemId, agendaItemId));

		expect(urlsAfter).toHaveLength(0);
	});

	test("should replace URLs when non-empty url array is provided", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;

		await insertAgendaItemUrls(agendaItemId, [
			"https://old.com/1",
			"https://old.com/2",
		]);

		const newUrls = ["https://new.com/a", "https://new.com/b"];
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					url: newUrls.map((url) => ({ url })),
				},
			},
		});

		expect(result.errors).toBeUndefined();

		const urlsAfter = await server.drizzleClient
			.select()
			.from(agendaItemUrlTable)
			.where(eq(agendaItemUrlTable.agendaItemId, agendaItemId));

		expect(urlsAfter).toHaveLength(2);
		expect(urlsAfter.map((u) => u.url).sort()).toEqual(newUrls.sort());
	});

	test("should not modify URLs when url input is omitted", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;

		const initialUrls = ["https://keep.com/1", "https://keep.com/2"];

		await insertAgendaItemUrls(agendaItemId, initialUrls);
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					name: "Updated name only",
				},
			},
		});

		expect(result.errors).toBeUndefined();

		const urlsAfter = await server.drizzleClient
			.select()
			.from(agendaItemUrlTable)
			.where(eq(agendaItemUrlTable.agendaItemId, agendaItemId));

		expect(urlsAfter).toHaveLength(2);
		expect(urlsAfter.map((u) => u.url).sort()).toEqual(initialUrls.sort());
	});

	test("should update notes successfully", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;
		const { token } = await getAdminAuth();
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					notes: "These are updated notes",
				},
			},
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.updateAgendaItem).toEqual(
			expect.objectContaining({
				id: agendaItemId,
				notes: "These are updated notes",
			}),
		);

		const itemInDb =
			await server.drizzleClient.query.agendaItemsTable.findFirst({
				columns: { notes: true },
				where: (fields, operators) => operators.eq(fields.id, agendaItemId),
			});

		assertToBeNonNullish(itemInDb);
		expect(itemInDb.notes).toBe("These are updated notes");
	});

	test("should set notes to null when explicitly provided as null", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;
		const { token } = await getAdminAuth();
		// first set notes
		await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					notes: "Initial notes",
				},
			},
		});
		// now clear notes
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					notes: null,
				},
			},
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.updateAgendaItem?.notes).toBeNull();

		const itemInDb =
			await server.drizzleClient.query.agendaItemsTable.findFirst({
				columns: { notes: true },
				where: (fields, operators) => operators.eq(fields.id, agendaItemId),
			});

		assertToBeNonNullish(itemInDb);
		expect(itemInDb.notes).toBeNull();
	});

	test("should not modify notes when notes field is omitted", async () => {
		const env = await createCategoryFolderAgendaItem();
		cleanupFns.push(env.cleanup);

		const agendaItemId = env.agendaItemId;
		const { token } = await getAdminAuth();
		// set initial notes
		await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					notes: "Keep this note",
				},
			},
		});
		// update something else
		const result = await mercuriusClient.mutate(Mutation_updateAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: {
				input: {
					id: agendaItemId,
					name: "Updated name only",
				},
			},
		});

		expect(result.errors).toBeUndefined();

		const itemInDb =
			await server.drizzleClient.query.agendaItemsTable.findFirst({
				columns: { notes: true },
				where: (fields, operators) => operators.eq(fields.id, agendaItemId),
			});

		assertToBeNonNullish(itemInDb);
		expect(itemInDb.notes).toBe("Keep this note");
=======
async function createOrganizationMembership(
	authToken: string,
	memberId: string,
	orgId: string,
	role?: "administrator" | "regular",
) {
	const createOrganizationMembershipResult = await mercuriusClient.mutate(
		Mutation_createOrganizationMembership,
		{
			headers: {
				authorization: `bearer ${authToken}`,
			},
			variables: {
				input: {
					memberId,
					organizationId: orgId,
					role,
				},
			},
		},
	);

	assertToBeNonNullish(createOrganizationMembershipResult.data);
	assertToBeNonNullish(
		createOrganizationMembershipResult.data.createOrganizationMembership,
	);
	assertToBeNonNullish(
		createOrganizationMembershipResult.data.createOrganizationMembership.id,
	);
	const organizationMembershipId =
		createOrganizationMembershipResult.data.createOrganizationMembership.id;
	return {
		organizationMembershipId,
		cleanup: async () => {
			await mercuriusClient.mutate(Mutation_deleteOrganizationMembership, {
				headers: {
					authorization: `bearer ${authToken}`,
				},
				variables: {
					input: {
						memberId,
						organizationId: orgId,
					},
				},
			});
		},
	};
}

suite("Mutation updateAgendaItem", () => {
	suite("Authentication and Authorization", () => {
		const testCleanupFunctions: Array<() => Promise<void>> = [];

		afterEach(async () => {
			for (const cleanup of testCleanupFunctions.reverse()) {
				try {
					await cleanup();
				} catch (error) {
					console.error("Cleanup failed:", error);
				}
			}
			// Reset the cleanup functions array
			testCleanupFunctions.length = 0;
		});
		test("Returns an error when the user is unauthenticated", async () => {
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					variables: {
						input: {
							id: faker.string.uuid(),
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining<UnauthenticatedExtensions>({
							code: "unauthenticated",
						}),
						message: expect.any(String),
						path: ["updateAgendaItem"],
					}),
				]),
			);
		});

		test("Returns an error when the user is present in the token but not found in the database", async () => {
			// create a regular user
			const regularUser = await createRegularUserUsingAdmin();
			// get the user's auth token
			const { authToken } = regularUser;
			// delete the user
			await server.drizzleClient
				.delete(usersTable)
				.where(eq(usersTable.id, regularUser.userId))
				.execute();
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: faker.string.uuid(),
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining<UnauthenticatedExtensions>({
							code: "unauthenticated",
						}),
						message: expect.any(String),
						path: ["updateAgendaItem"],
					}),
				]),
			);
		});

		test("Returns an error when a non-admin, non-organization member tries to update an agenda item", async () => {
			// create a regular user
			const regularUser = await createRegularUserUsingAdmin();
			// get the user's auth token
			const { authToken } = regularUser;
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "unauthorized_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "id"]),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});

		test("Returns an error when a regular member of the organization tries to update an agenda item", async () => {
			// create a regular user
			const regularUser = await createRegularUserUsingAdmin();
			// get the user's auth token
			const { authToken } = regularUser;
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// create an organization membership
			const organizationMembership = await createOrganizationMembership(
				authToken,
				regularUser.userId,
				agendaItem.orgId,
			);
			testCleanupFunctions.push(organizationMembership.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "unauthorized_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "id"]),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});

		test("Successfully updates the agenda item when an organization admin tries to update it", async () => {
			// create a regular user
			const regularUser = await createRegularUserUsingAdmin();
			// get the user's auth token
			const { authToken } = regularUser;
			// get admin auth token
			const { cachedAdminToken: adminAuthToken } =
				await getAdminAuthTokenAndId();
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// create an organization membership
			const organizationMembership = await createOrganizationMembership(
				adminAuthToken,
				regularUser.userId,
				agendaItem.orgId,
				"administrator",
			);
			testCleanupFunctions.push(organizationMembership.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeUndefined();
			expect(updateAgendaItemResult.data).toBeDefined();
			expect(updateAgendaItemResult.data.updateAgendaItem).toBeDefined();
			assertToBeNonNullish(updateAgendaItemResult.data.updateAgendaItem);
			assertToBeNonNullish(updateAgendaItemResult.data.updateAgendaItem.id);
			expect(updateAgendaItemResult.data.updateAgendaItem.id).toEqual(
				agendaItem.agendaItemId,
			);
			expect(updateAgendaItemResult.data.updateAgendaItem.name).toEqual(
				"Updated agenda item name",
			);
		});
		test("Successfully updates the agenda item when an admin (non-organization member) tries to update it", async () => {
			// get admin auth token
			const { cachedAdminToken: adminAuthToken } =
				await getAdminAuthTokenAndId();
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${adminAuthToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeUndefined();
			expect(updateAgendaItemResult.data).toBeDefined();
			expect(updateAgendaItemResult.data.updateAgendaItem).toBeDefined();
			assertToBeNonNullish(updateAgendaItemResult.data.updateAgendaItem);
			assertToBeNonNullish(updateAgendaItemResult.data.updateAgendaItem.id);
			expect(updateAgendaItemResult.data.updateAgendaItem.id).toEqual(
				agendaItem.agendaItemId,
			);
			expect(updateAgendaItemResult.data.updateAgendaItem.name).toEqual(
				"Updated agenda item name",
			);
		});
	});

	suite("Input Validation", () => {
		const testCleanupFunctions: Array<() => Promise<void>> = [];

		afterEach(async () => {
			for (const cleanup of testCleanupFunctions.reverse()) {
				try {
					await cleanup();
				} catch (error) {
					console.error("Cleanup failed:", error);
				}
			}
			// Reset the cleanup functions array
			testCleanupFunctions.length = 0;
		});
		test("Returns an error when id and folderId are not valid UUIDs", async () => {
			// create a regular user
			const regularUser = await createRegularUserUsingAdmin();
			// get the user's auth token
			const { authToken } = regularUser;

			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: "invalid-uuid",
							folderId: "invalid-uuid",
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "invalid_arguments",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "id"]),
								}),
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "folderId"]),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
		test("Returns an error when only id is provided", async () => {
			// create a regular user
			const regularUser = await createRegularUserUsingAdmin();
			// get the user's auth token
			const { authToken } = regularUser;

			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: faker.string.uuid(),
						},
					},
				},
			);

			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "invalid_arguments",
							issues: expect.arrayContaining([
								expect.objectContaining({
									message: expect.stringContaining(
										"At least one optional argument must be provided.",
									),
									argumentPath: expect.arrayContaining(["input"]),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
	});

	suite("Type Specific Validation", () => {
		const testCleanupFunctions: Array<() => Promise<void>> = [];

		afterEach(async () => {
			for (const cleanup of testCleanupFunctions.reverse()) {
				try {
					await cleanup();
				} catch (error) {
					console.error("Cleanup failed:", error);
				}
			}
			// Reset the cleanup functions array
			testCleanupFunctions.length = 0;
		});
		test("Returns an error when the type is note and duration is provided", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();

			// get the user's auth token
			const { authToken } = regularUser;
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			await server.drizzleClient
				.update(agendaItemsTable)
				.set({
					type: "note",
					duration: null,
				})
				.where(eq(agendaItemsTable.id, agendaItem.agendaItemId))
				.execute();

			testCleanupFunctions.push(agendaItem.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							duration: "30m",
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "duration"]),
									message:
										'Cannot be provided for an agenda item of type "note"',
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
		test("Returns an error when the type is note and key is provided", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();

			// get the user's auth token
			const { authToken } = regularUser;
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			await server.drizzleClient
				.update(agendaItemsTable)
				.set({
					type: "note",
				})
				.where(eq(agendaItemsTable.id, agendaItem.agendaItemId))
				.execute();

			testCleanupFunctions.push(agendaItem.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							key: "key",
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "key"]),
									message:
										'Cannot be provided for an agenda item of type "note"',
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
		test("Returns an error when the type is general and key is provided", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();

			// get the user's auth token
			const { authToken } = regularUser;
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			await server.drizzleClient
				.update(agendaItemsTable)
				.set({
					type: "general",
				})
				.where(eq(agendaItemsTable.id, agendaItem.agendaItemId))
				.execute();

			testCleanupFunctions.push(agendaItem.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							key: "key",
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "key"]),
									message:
										'Cannot be provided for an agenda item of type "general"',
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
		test("Returns an error when the type is scripture and key is provided", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();

			// get the user's auth token
			const { authToken } = regularUser;
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			await server.drizzleClient
				.update(agendaItemsTable)
				.set({
					type: "scripture",
				})
				.where(eq(agendaItemsTable.id, agendaItem.agendaItemId))
				.execute();

			testCleanupFunctions.push(agendaItem.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							key: "key",
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "key"]),
									message:
										'Cannot be provided for an agenda item of type "scripture"',
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
	});

	suite("resource existence", () => {
		const testCleanupFunctions: Array<() => Promise<void>> = [];

		afterEach(async () => {
			for (const cleanup of testCleanupFunctions.reverse()) {
				try {
					await cleanup();
				} catch (error) {
					console.error("Cleanup failed:", error);
				}
			}
			// Reset the cleanup functions array
			testCleanupFunctions.length = 0;
		});
		test("Returns an error when the agenda item does not exist", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();
			// get the user's auth token
			const { authToken } = regularUser;
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: faker.string.uuid(),
							name: "Updated agenda item name",
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "id"]),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
		test("Returns an error when the agenda folder does not exist", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();

			// get the user's auth token
			const { authToken } = regularUser;
			// create an agenda item
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							name: "Updated agenda item name",
							folderId: faker.string.uuid(),
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "folderId"]),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
		test("Returns an error when the agenda folder does not belong to the agenda item's event", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();
			// create two agendaItems and use the folder of the first agenda item for the second agenda item
			const agendaItem1 = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem1.cleanup);
			const agendaItem2 = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem2.cleanup);
			// get the user's auth token
			const { authToken } = regularUser;
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem2.agendaItemId,
							name: "Updated agenda item name",
							folderId: agendaItem1.folderId,
						},
					},
				},
			);
			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "folderId"]),
									message: expect.stringContaining(
										"This agenda folder does not belong to the event to the agenda item.",
									),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});

		test("Returns an error when the agenda folder cannot be a folder for agenda items", async () => {
			// create regular user
			const regularUser = await createRegularUserUsingAdmin();
			// create an agendaItem and use the folder of the agenda item for the event
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);

			// update agenda folder's isAgendaItemFolder to false
			await server.drizzleClient
				.update(agendaFoldersTable)
				.set({
					isAgendaItemFolder: false,
				})
				.where(eq(agendaFoldersTable.id, agendaItem.folderId))
				.execute();

			// get the user's auth token
			const { authToken } = regularUser;
			// try to update the agenda item
			const updateAgendaItemResult = await mercuriusClient.mutate(
				Mutation_updateAgendaItem,
				{
					headers: {
						authorization: `bearer ${authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
							name: "Updated agenda item name",
							folderId: agendaItem.folderId,
						},
					},
				},
			);

			expect(updateAgendaItemResult.errors).toBeDefined();
			expect(updateAgendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: expect.arrayContaining(["input", "folderId"]),
									message: expect.stringContaining(
										"This agenda folder cannot be a folder to agenda items.",
									),
								}),
							]),
						}),
						message: expect.any(String),
					}),
				]),
			);
		});
>>>>>>> upstream
	});
});
