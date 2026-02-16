import { faker } from "@faker-js/faker";
<<<<<<< HEAD
import { eq } from "drizzle-orm";
import { afterEach, expect, suite, test, vi } from "vitest";

import { usersTable } from "~/src/drizzle/schema";
import { agendaItemsTable } from "~/src/drizzle/tables/agendaItems";
import type {
	ArgumentsAssociatedResourcesNotFoundExtensions,
	TalawaGraphQLFormattedError,
	UnauthenticatedExtensions,
} from "~/src/utilities/TalawaGraphQLError";

=======

import { afterEach, expect, suite, test } from "vitest";

import { eq } from "drizzle-orm";
import { usersTable } from "~/src/drizzle/schema";
import { organizationMembershipsTable } from "~/src/drizzle/tables/organizationMemberships";
import type {
	TalawaGraphQLFormattedError,
	UnauthenticatedExtensions,
} from "~/src/utilities/TalawaGraphQLError";
>>>>>>> upstream
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import { createRegularUserUsingAdmin } from "../createRegularUserUsingAdmin";
import {
<<<<<<< HEAD
	Mutation_createAgendaItem,
	Mutation_createEvent,
	Mutation_createOrganization,
	Mutation_createOrganizationMembership,
=======
	Mutation_createAgendaFolder,
	Mutation_createAgendaItem,
	Mutation_createEvent,
	Mutation_createOrganization,
>>>>>>> upstream
	Mutation_deleteAgendaItem,
	Mutation_deleteOrganization,
	Mutation_deleteStandaloneEvent,
	Query_signIn,
} from "../documentNodes";

<<<<<<< HEAD
let cachedAdminAuth: { token: string; userId: string } | null = null;

async function getAdminAuth() {
	if (cachedAdminAuth) return cachedAdminAuth;

	const result = await mercuriusClient.query(Query_signIn, {
		headers: { authorization: "" },
		variables: {
			input: {
				emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
				password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
			},
		},
	});

	expect(result.errors).toBeUndefined();
	assertToBeNonNullish(result.data?.signIn?.authenticationToken);
	assertToBeNonNullish(result.data?.signIn?.user?.id);

	cachedAdminAuth = {
		token: result.data.signIn.authenticationToken,
		userId: result.data.signIn.user.id,
	};

	return cachedAdminAuth;
}

async function addOrganizationMembership(params: {
	adminAuthToken: string;
	memberId: string;
	organizationId: string;
	role: "administrator" | "regular";
}) {
	const result = await mercuriusClient.mutate(
		Mutation_createOrganizationMembership,
		{
			headers: { authorization: `bearer ${params.adminAuthToken}` },
			variables: {
				input: {
					memberId: params.memberId,
					organizationId: params.organizationId,
					role: params.role,
=======
// Helper function to add membership with conflict handling
async function addMembership(
	organizationId: string,
	memberId: string,
	role: "administrator" | "regular",
) {
	await server.drizzleClient
		.insert(organizationMembershipsTable)
		.values({
			organizationId,
			memberId,
			role,
		})
		.onConflictDoNothing()
		.execute();
}

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
	expect(result.errors).toBeUndefined();
	assertToBeNonNullish(result.data?.createOrganizationMembership);
}

async function createAgendaItemEnv(adminToken: string) {
	const adminUserId = (await getAdminAuth()).userId;

	const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
		headers: { authorization: `bearer ${adminToken}` },
		variables: {
			input: { name: `Org ${faker.string.uuid()}`, countryCode: "us" },
		},
	});
	expect(orgRes.errors).toBeUndefined();
	assertToBeNonNullish(orgRes.data?.createOrganization);
	const organizationId = orgRes.data.createOrganization.id;

	await addOrganizationMembership({
		adminAuthToken: adminToken,
		memberId: adminUserId,
		organizationId,
		role: "administrator",
	});

	const startAt = new Date(Date.now() + 5_000);
	const endAt = new Date(startAt.getTime() + 3_600_000);
	const eventRes = await mercuriusClient.mutate(Mutation_createEvent, {
		headers: { authorization: `bearer ${adminToken}` },
		variables: {
			input: {
				name: `Event ${faker.string.uuid()}`,
				organizationId,
				startAt: startAt.toISOString(),
				endAt: endAt.toISOString(),
			},
		},
	});
	expect(eventRes.errors).toBeUndefined();
	assertToBeNonNullish(eventRes.data?.createEvent);
	const eventId = eventRes.data.createEvent.id;

	const itemRes = await mercuriusClient.mutate(Mutation_createAgendaItem, {
		headers: { authorization: `bearer ${adminToken}` },
		variables: {
			input: {
				eventId,
				name: "Agenda Item",
				sequence: 1,
				type: "general",
			},
		},
	});
	expect(itemRes.errors).toBeUndefined();
	assertToBeNonNullish(itemRes.data?.createAgendaItem);
	const itemId = itemRes.data.createAgendaItem.id;

	return {
		itemId,
		organizationId,
		eventId,
		cleanup: async () => {
			await mercuriusClient.mutate(Mutation_deleteStandaloneEvent, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: eventId } },
			});
			await mercuriusClient.mutate(Mutation_deleteOrganization, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: organizationId } },
			});
=======
	assertToBeNonNullish(createOrgResult.data);
	assertToBeNonNullish(createOrgResult.data.createOrganization);
	const orgId = createOrgResult.data.createOrganization.id;

	// Create organization membership for the admin user
	await addMembership(orgId, adminId, "administrator");

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
			},
		},
	});

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
				},
			},
		},
	);

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

suite("Mutation field deleteAgendaItem", () => {
<<<<<<< HEAD
	const cleanupFns: Array<() => Promise<void>> = [];

	afterEach(async () => {
		vi.restoreAllMocks();
		for (const fn of cleanupFns.reverse()) {
			try {
				await fn();
			} catch (err) {
				// Cleanup errors are swallowed to prevent cascading failures during teardown.
				// Log in development for debugging visibility.
				if (process.env.DEBUG) {
					console.warn("Cleanup error (non-fatal):", err);
				}
			}
		}
		cleanupFns.length = 0;
	});

	test("Returns unauthenticated when client is not authenticated", async () => {
		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			variables: { input: { id: faker.string.uuid() } },
		});

		expect(result.data?.deleteAgendaItem ?? null).toEqual(null);
		expect(result.errors).toEqual(
			expect.arrayContaining<TalawaGraphQLFormattedError>([
				expect.objectContaining({
					extensions: expect.objectContaining<UnauthenticatedExtensions>({
						code: "unauthenticated",
					}),
				}),
			]),
		);
	});

	test("Returns unauthenticated when token user does not exist", async () => {
		const user = await createRegularUserUsingAdmin();

		await server.drizzleClient
			.delete(usersTable)
			.where(eq(usersTable.id, user.userId));

		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${user.authToken}` },
			variables: { input: { id: faker.string.uuid() } },
		});

		expect(result.data?.deleteAgendaItem ?? null).toEqual(null);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "unauthenticated",
					}),
				}),
			]),
		);
	});

	test("Returns invalid_arguments for invalid UUID", async () => {
		const { token } = await getAdminAuth();

		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: { input: { id: "not-a-uuid" } },
		});

		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "invalid_arguments",
					}),
				}),
			]),
		);
	});

	test("Returns not found when agenda item does not exist", async () => {
		const { token } = await getAdminAuth();

		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: { input: { id: faker.string.uuid() } },
		});

		expect(result.errors).toEqual(
			expect.arrayContaining<TalawaGraphQLFormattedError>([
				expect.objectContaining({
					extensions:
						expect.objectContaining<ArgumentsAssociatedResourcesNotFoundExtensions>(
							{
								code: "arguments_associated_resources_not_found",
								issues: expect.arrayContaining([
									expect.objectContaining({
										argumentPath: ["input", "id"],
									}),
								]),
							},
						),
				}),
			]),
		);
	});

	test("Returns unauthorized for regular org member", async () => {
		const [{ token }, regular] = await Promise.all([
			getAdminAuth(),
			createRegularUserUsingAdmin(),
		]);

		const env = await createAgendaItemEnv(token);
		cleanupFns.push(env.cleanup);

		await addOrganizationMembership({
			adminAuthToken: token,
			memberId: regular.userId,
			organizationId: env.organizationId,
			role: "regular",
		});

		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${regular.authToken}` },
			variables: { input: { id: env.itemId } },
		});

		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "unauthorized_action_on_arguments_associated_resources",
					}),
				}),
			]),
		);
	});

	test("Returns unauthorized for user not in organization", async () => {
		const [{ token }, regular] = await Promise.all([
			getAdminAuth(),
			createRegularUserUsingAdmin(),
		]);

		// Admin creates org + agenda item
		const env = await createAgendaItemEnv(token);
		cleanupFns.push(env.cleanup);

		// Do NOT add organization membership for `regular`
		// This user is NOT part of the org at all
		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${regular.authToken}` },
			variables: { input: { id: env.itemId } },
		});

		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "unauthorized_action_on_arguments_associated_resources",
					}),
				}),
			]),
		);
	});

	test("Deletes agenda item successfully as organization administrator", async () => {
		const [{ token }, regular] = await Promise.all([
			getAdminAuth(),
			createRegularUserUsingAdmin(),
		]);

		const env = await createAgendaItemEnv(token);
		cleanupFns.push(env.cleanup);

		// Make regular user an ORG ADMIN (not system admin)
		await addOrganizationMembership({
			adminAuthToken: token,
			memberId: regular.userId,
			organizationId: env.organizationId,
			role: "administrator",
		});

		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${regular.authToken}` },
			variables: { input: { id: env.itemId } },
		});

		expect(result.errors).toBeUndefined();
		assertToBeNonNullish(result.data?.deleteAgendaItem);
		expect(result.data.deleteAgendaItem.id).toBe(env.itemId);
	});

	test("Deletes agenda item successfully as admin", async () => {
		const { token } = await getAdminAuth();
		const env = await createAgendaItemEnv(token);
		cleanupFns.push(env.cleanup);

		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: { input: { id: env.itemId } },
		});

		expect(result.errors).toBeUndefined();
		assertToBeNonNullish(result.data?.deleteAgendaItem);
		expect(result.data.deleteAgendaItem.id).toBe(env.itemId);
	});

	test("Returns unexpected when delete returns empty array", async () => {
		const { token } = await getAdminAuth();
		const env = await createAgendaItemEnv(token);
		cleanupFns.push(env.cleanup);

		const originalDelete = server.drizzleClient.delete.bind(
			server.drizzleClient,
		);

		vi.spyOn(server.drizzleClient, "delete").mockImplementation((table) => {
			if (table === agendaItemsTable) {
				// 👇 Intentional partial mock – escape typing safely
				return {
					where: () => ({
						returning: async () => [],
					}),
				} as unknown as ReturnType<typeof server.drizzleClient.delete>;
			}

			return originalDelete(table);
		});

		const result = await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
			headers: { authorization: `bearer ${token}` },
			variables: { input: { id: env.itemId } },
		});

		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "unexpected",
					}),
				}),
			]),
		);
=======
	suite("Authorization and Authentication", () => {
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
		test("Returns an error if the client is not authenticated", async () => {
			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					variables: {
						input: {
							id: faker.string.uuid(),
						},
					},
				},
			);
			expect(agendaItemResult.data.deleteAgendaItem).toEqual(null);
			expect(agendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining<UnauthenticatedExtensions>({
							code: "unauthenticated",
						}),
						message: expect.any(String),
						path: ["deleteAgendaItem"],
					}),
				]),
			);
		});

		test("Returns an error if the user is present in the token but not in the database", async () => {
			// create a user
			const regularUser = await createRegularUserUsingAdmin();
			// delete the user
			await server.drizzleClient
				.delete(usersTable)
				.where(eq(usersTable.id, regularUser.userId));

			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					headers: {
						authorization: `bearer ${regularUser.authToken}`,
					},
					variables: {
						input: {
							id: faker.string.uuid(),
						},
					},
				},
			);
			expect(agendaItemResult.data.deleteAgendaItem).toEqual(null);
			expect(agendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining<UnauthenticatedExtensions>({
							code: "unauthenticated",
						}),
						message: expect.any(String),
						path: ["deleteAgendaItem"],
					}),
				]),
			);
		});
		test("Returns an error when a non-admin, non-organization member tries to delete an agenda item", async () => {
			const regularUser = await createRegularUserUsingAdmin();

			// create a agendaItem
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// delete the agendaItem

			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					headers: {
						authorization: `bearer ${regularUser.authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
						},
					},
				},
			);
			expect(agendaItemResult.data.deleteAgendaItem).toEqual(null);
			expect(agendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "unauthorized_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: ["input", "id"],
								}),
							]),
						}),
						message: expect.any(String),
						path: ["deleteAgendaItem"],
					}),
				]),
			);
		});
		test("Returns an error when a regular member of the organization tries to delete an agenda item", async () => {
			const regularUser = await createRegularUserUsingAdmin();
			// create a agendaItem
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// create organization membership

			await addMembership(agendaItem.orgId, regularUser.userId, "regular");
			// delete the agendaItem

			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					headers: {
						authorization: `bearer ${regularUser.authToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
						},
					},
				},
			);
			expect(agendaItemResult.data.deleteAgendaItem).toEqual(null);
			expect(agendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "unauthorized_action_on_arguments_associated_resources",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: ["input", "id"],
								}),
							]),
						}),
						message: expect.any(String),
						path: ["deleteAgendaItem"],
					}),
				]),
			);
		});
		test("Deletes the agenda item successfully when an admin (non-organization member) tries to delete it", async () => {
			const { cachedAdminToken: adminAuthToken } =
				await getAdminAuthTokenAndId();
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);

			// delete the agendaItem

			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					headers: {
						authorization: `bearer ${adminAuthToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
						},
					},
				},
			);
			assertToBeNonNullish(agendaItemResult.data);
			assertToBeNonNullish(agendaItemResult.data.deleteAgendaItem);
			expect(agendaItemResult.data.deleteAgendaItem.id).toEqual(
				agendaItem.agendaItemId,
			);
			expect(agendaItemResult.errors).toBeUndefined();
		});

		test("Deletes the agenda item successfully when an admin (organization member) tries to delete it", async () => {
			const { cachedAdminToken: adminAuthToken, cachedAdminId: adminId } =
				await getAdminAuthTokenAndId();
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// create organization membership
			await addMembership(agendaItem.orgId, adminId, "administrator");
			// delete the agendaItem

			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					headers: {
						authorization: `bearer ${adminAuthToken}`,
					},
					variables: {
						input: {
							id: agendaItem.agendaItemId,
						},
					},
				},
			);
			assertToBeNonNullish(agendaItemResult.data);
			assertToBeNonNullish(agendaItemResult.data.deleteAgendaItem);
			expect(agendaItemResult.data.deleteAgendaItem.id).toEqual(
				agendaItem.agendaItemId,
			);
			expect(agendaItemResult.errors).toBeUndefined();
		});
	});
	suite("Input Validation", () => {
		test("Returns an error when an invalid UUID format is provided", async () => {
			const { cachedAdminToken: adminAuthToken } =
				await getAdminAuthTokenAndId();
			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					headers: {
						authorization: `bearer ${adminAuthToken}`,
					},
					variables: {
						input: {
							id: "invalid-id",
						},
					},
				},
			);
			expect(agendaItemResult.data.deleteAgendaItem).toEqual(null);
			expect(agendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "invalid_arguments",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: ["input", "id"],
								}),
							]),
						}),
						message: expect.any(String),
						path: ["deleteAgendaItem"],
					}),
				]),
			);
		});
	});

	suite("Resource Existence", () => {
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
			const { cachedAdminToken: adminAuthToken, cachedAdminId: adminId } =
				await getAdminAuthTokenAndId();
			// create a user
			const agendaItem = await createTestAgendaItem();
			testCleanupFunctions.push(agendaItem.cleanup);
			// create organization membership
			await addMembership(agendaItem.orgId, adminId, "administrator");
			// delete the agendaItem
			const agendaItemResult = await mercuriusClient.mutate(
				Mutation_deleteAgendaItem,
				{
					headers: {
						authorization: `bearer ${adminAuthToken}`,
					},
					variables: {
						input: {
							id: faker.string.uuid(),
						},
					},
				},
			);
			expect(agendaItemResult.data.deleteAgendaItem).toEqual(null);
			expect(agendaItemResult.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: ["input", "id"],
								}),
							]),
						}),
						message: expect.any(String),
						path: ["deleteAgendaItem"],
					}),
				]),
			);
		});
>>>>>>> upstream
	});
});
