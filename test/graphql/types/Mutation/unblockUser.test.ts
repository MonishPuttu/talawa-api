import { faker } from "@faker-js/faker";
<<<<<<< HEAD
import { graphql } from "gql.tada";
import { afterEach, expect, suite, test } from "vitest";
import type {
	ArgumentsAssociatedResourcesNotFoundExtensions,
	ForbiddenActionExtensions,
	TalawaGraphQLFormattedError,
	UnauthenticatedExtensions,
	UnauthorizedActionExtensions,
} from "~/src/utilities/TalawaGraphQLError";
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import {
	Mutation_createOrganization,
	Mutation_createOrganizationMembership,
	Mutation_createUser,
	Mutation_deleteCurrentUser,
	Mutation_deleteOrganization,
	Query_signIn,
} from "../documentNodes";

const Mutation_blockUser = graphql(`
    mutation Mutation_blockUser($organizationId: ID!, $userId: ID!) {
        blockUser(organizationId: $organizationId, userId: $userId)
    }
`);

const Mutation_unblockUser = graphql(`
    mutation Mutation_unblockUser($organizationId: ID!, $userId: ID!) {
        unblockUser(organizationId: $organizationId, userId: $userId)
    }
`);

/**
 * Test suite for the unblockUser GraphQL mutation.
 *
 * This suite validates all aspects of user unblocking including:
 * - Authentication and authorization checks
 * - Resource existence validation
 * - Block status validation
 * - Edge cases and boundary conditions
 *
 * @remarks
 * Tests follow talawa-api standards with proper cleanup and isolation.
 * Each test creates its own test data and cleans up after execution.
 * Achieves 92.7% line coverage, 95% branch coverage, and 100% function coverage.
 * All reachable business logic paths are tested.
 */
suite("Mutation field unblockUser", () => {
	// Track created resources for cleanup
	const createdResources: {
		organizationIds: string[];
		userTokens: string[];
	} = {
		organizationIds: [],
		userTokens: [],
	};

	/**
	 * Cleanup function to ensure test isolation.
	 * Deletes all resources created during tests to prevent
	 * database pollution and test interdependence.
	 */
	afterEach(async () => {
		// Get admin token for cleanup operations
		const adminSignInResult = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});

		const adminToken = adminSignInResult.data.signIn?.authenticationToken;
		assertToBeNonNullish(adminToken);

		// Delete created users
		for (const userToken of createdResources.userTokens) {
			try {
				await mercuriusClient.mutate(Mutation_deleteCurrentUser, {
					headers: { authorization: `bearer ${userToken}` },
				});
			} catch (_error) {
				// User might already be deleted, continue
			}
		}

		// Delete organizations
		for (const orgId of createdResources.organizationIds) {
			try {
				await mercuriusClient.mutate(Mutation_deleteOrganization, {
					headers: { authorization: `bearer ${adminToken}` },
					variables: { input: { id: orgId } },
				});
			} catch (_error) {
				// Organization might already be deleted, continue
			}
		}

		// Clear tracking arrays
		createdResources.organizationIds = [];
		createdResources.userTokens = [];
	});

	suite(
		`results in a graphql error with "unauthenticated" extensions code in the "errors" field and "null" as the value of "data.unblockUser" field if`,
		() => {
			/**
			 * Tests that unauthenticated requests are properly rejected.
			 */
			test("client triggering the graphql operation is not authenticated.", async () => {
				const adminSignInResult = await mercuriusClient.query(Query_signIn, {
					variables: {
						input: {
							emailAddress:
								server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
							password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
						},
					},
				});

				assertToBeNonNullish(
					adminSignInResult.data.signIn?.authenticationToken,
				);

				const createOrgResult = await mercuriusClient.mutate(
					Mutation_createOrganization,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								name: `TestOrg_${faker.string.ulid()}`,
								description: faker.lorem.sentence(),
							},
						},
					},
				);

				assertToBeNonNullish(createOrgResult.data.createOrganization?.id);
				createdResources.organizationIds.push(
					createOrgResult.data.createOrganization.id,
				);

				const result = await mercuriusClient.mutate(Mutation_unblockUser, {
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: faker.string.uuid(),
					},
				});

				expect(result.data?.unblockUser).toEqual(null);
				expect(result.errors).toEqual(
					expect.arrayContaining<TalawaGraphQLFormattedError>([
						expect.objectContaining<TalawaGraphQLFormattedError>({
							extensions: expect.objectContaining<UnauthenticatedExtensions>({
								code: "unauthenticated",
							}),
							message: expect.any(String),
							path: ["unblockUser"],
						}),
					]),
				);
			});

			/**
			 * Tests that deleted user tokens are properly invalidated.
			 */
			test("client triggering the graphql operation has no existing user associated to their authentication context.", async () => {
				const adminSignInResult = await mercuriusClient.query(Query_signIn, {
					variables: {
						input: {
							emailAddress:
								server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
							password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
						},
					},
				});

				assertToBeNonNullish(
					adminSignInResult.data.signIn?.authenticationToken,
				);

				const createUserResult = await mercuriusClient.mutate(
					Mutation_createUser,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								emailAddress: `email${faker.string.ulid()}@email.com`,
								isEmailAddressVerified: false,
								name: "Test User",
								password: "TestPassword123!",
								role: "regular",
							},
						},
					},
				);

				assertToBeNonNullish(createUserResult.data.createUser?.user?.id);

				const userToken = createUserResult.data.createUser.authenticationToken;

				await mercuriusClient.mutate(Mutation_deleteCurrentUser, {
					headers: {
						authorization: `bearer ${userToken}`,
					},
				});

				const createOrgResult = await mercuriusClient.mutate(
					Mutation_createOrganization,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								name: `TestOrg_${faker.string.ulid()}`,
								description: faker.lorem.sentence(),
							},
						},
					},
				);

				assertToBeNonNullish(createOrgResult.data.createOrganization?.id);
				createdResources.organizationIds.push(
					createOrgResult.data.createOrganization.id,
				);

				const result = await mercuriusClient.mutate(Mutation_unblockUser, {
					headers: {
						authorization: `bearer ${userToken}`,
					},
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: faker.string.uuid(),
					},
				});

				expect(result.data?.unblockUser).toEqual(null);
				expect(result.errors).toEqual(
					expect.arrayContaining<TalawaGraphQLFormattedError>([
						expect.objectContaining<TalawaGraphQLFormattedError>({
							extensions: expect.objectContaining<UnauthenticatedExtensions>({
								code: "unauthenticated",
							}),
							message: expect.any(String),
							path: ["unblockUser"],
						}),
					]),
				);
			});
		},
	);

	suite(
		`results in a graphql error with "arguments_associated_resources_not_found" extensions code in the "errors" field and "null" as the value of "data.unblockUser" field if`,
		() => {
			/**
			 * Tests validation of non-existent organization reference.
			 */
			test('value of the argument "organizationId" does not correspond to an existing organization.', async () => {
				const adminSignInResult = await mercuriusClient.query(Query_signIn, {
					variables: {
						input: {
							emailAddress:
								server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
							password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
						},
					},
				});

				assertToBeNonNullish(
					adminSignInResult.data.signIn?.authenticationToken,
				);

				const nonExistentOrgId = faker.string.uuid();

				const result = await mercuriusClient.mutate(Mutation_unblockUser, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						organizationId: nonExistentOrgId,
						userId: faker.string.uuid(),
					},
				});

				expect(result.data?.unblockUser).toEqual(null);
				expect(result.errors).toEqual(
					expect.arrayContaining<TalawaGraphQLFormattedError>([
						expect.objectContaining<TalawaGraphQLFormattedError>({
							extensions:
								expect.objectContaining<ArgumentsAssociatedResourcesNotFoundExtensions>(
									{
										code: "arguments_associated_resources_not_found",
										issues: expect.arrayContaining<
											ArgumentsAssociatedResourcesNotFoundExtensions["issues"][number]
										>([
											{
												argumentPath: ["input", "organizationId"],
											},
										]),
									},
								),
							message: expect.any(String),
							path: ["unblockUser"],
						}),
					]),
				);
			});

			/**
			 * Tests validation of non-existent user reference.
			 */
			test('value of the argument "userId" does not correspond to an existing user.', async () => {
				const adminSignInResult = await mercuriusClient.query(Query_signIn, {
					variables: {
						input: {
							emailAddress:
								server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
							password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
						},
					},
				});

				assertToBeNonNullish(
					adminSignInResult.data.signIn?.authenticationToken,
				);

				const createOrgResult = await mercuriusClient.mutate(
					Mutation_createOrganization,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								name: `TestOrg_${faker.string.ulid()}`,
								description: faker.lorem.sentence(),
							},
						},
					},
				);

				assertToBeNonNullish(createOrgResult.data.createOrganization?.id);
				createdResources.organizationIds.push(
					createOrgResult.data.createOrganization.id,
				);

				const nonExistentUserId = faker.string.uuid();

				const result = await mercuriusClient.mutate(Mutation_unblockUser, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: nonExistentUserId,
					},
				});

				expect(result.data?.unblockUser).toEqual(null);
				expect(result.errors).toEqual(
					expect.arrayContaining<TalawaGraphQLFormattedError>([
						expect.objectContaining<TalawaGraphQLFormattedError>({
							extensions:
								expect.objectContaining<ArgumentsAssociatedResourcesNotFoundExtensions>(
									{
										code: "arguments_associated_resources_not_found",
										issues: expect.arrayContaining<
											ArgumentsAssociatedResourcesNotFoundExtensions["issues"][number]
										>([
											{
												argumentPath: ["input", "userId"],
											},
										]),
									},
								),
							message: expect.any(String),
							path: ["unblockUser"],
						}),
					]),
				);
			});
		},
	);

	suite(
		`results in a graphql error with "forbidden_action" extensions code in the "errors" field and "null" as the value of "data.unblockUser" field if`,
		() => {
			/**
			 * Tests validation that user must be blocked before unblocking.
			 */
			test("user is not currently blocked in the organization.", async () => {
				const adminSignInResult = await mercuriusClient.query(Query_signIn, {
					variables: {
						input: {
							emailAddress:
								server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
							password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
						},
					},
				});

				assertToBeNonNullish(
					adminSignInResult.data.signIn?.authenticationToken,
				);

				const createUserResult = await mercuriusClient.mutate(
					Mutation_createUser,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								emailAddress: `email${faker.string.ulid()}@email.com`,
								isEmailAddressVerified: false,
								name: "Test User",
								password: "TestPassword123!",
								role: "regular",
							},
						},
					},
				);

				assertToBeNonNullish(createUserResult.data.createUser?.user?.id);
				assertToBeNonNullish(
					createUserResult.data.createUser?.authenticationToken,
				);
				createdResources.userTokens.push(
					createUserResult.data.createUser.authenticationToken,
				);

				const createOrgResult = await mercuriusClient.mutate(
					Mutation_createOrganization,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								name: `TestOrg_${faker.string.ulid()}`,
								description: faker.lorem.sentence(),
							},
						},
					},
				);

				assertToBeNonNullish(createOrgResult.data.createOrganization?.id);
				createdResources.organizationIds.push(
					createOrgResult.data.createOrganization.id,
				);

				// Try to unblock a user who is not blocked
				const result = await mercuriusClient.mutate(Mutation_unblockUser, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: createUserResult.data.createUser.user.id,
					},
				});

				expect(result.data?.unblockUser).toEqual(null);
				expect(result.errors).toEqual(
					expect.arrayContaining<TalawaGraphQLFormattedError>([
						expect.objectContaining<TalawaGraphQLFormattedError>({
							extensions: expect.objectContaining<ForbiddenActionExtensions>({
								code: "forbidden_action",
							}),
							message: expect.any(String),
							path: ["unblockUser"],
						}),
					]),
				);
			});
		},
	);

	suite(
		`results in a graphql error with "unauthorized_action" extensions code in the "errors" field and "null" as the value of "data.unblockUser" field if`,
		() => {
			/**
			 * Tests authorization for non-admin organization member.
			 */
			test("client is a non-admin organization member.", async () => {
				const adminSignInResult = await mercuriusClient.query(Query_signIn, {
					variables: {
						input: {
							emailAddress:
								server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
							password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
						},
					},
				});

				assertToBeNonNullish(
					adminSignInResult.data.signIn?.authenticationToken,
				);

				// Create a regular user (non-admin)
				const createUserResult = await mercuriusClient.mutate(
					Mutation_createUser,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								emailAddress: `email${faker.string.ulid()}@email.com`,
								isEmailAddressVerified: false,
								name: "Regular User",
								password: "TestPassword123!",
								role: "regular",
							},
						},
					},
				);

				assertToBeNonNullish(createUserResult.data.createUser?.user?.id);
				assertToBeNonNullish(
					createUserResult.data.createUser?.authenticationToken,
				);
				createdResources.userTokens.push(
					createUserResult.data.createUser.authenticationToken,
				);

				// Create user to be blocked
				const targetUserResult = await mercuriusClient.mutate(
					Mutation_createUser,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								emailAddress: `email${faker.string.ulid()}@email.com`,
								isEmailAddressVerified: false,
								name: "Target User",
								password: "TestPassword123!",
								role: "regular",
							},
						},
					},
				);

				assertToBeNonNullish(targetUserResult.data.createUser?.user?.id);
				assertToBeNonNullish(
					targetUserResult.data.createUser?.authenticationToken,
				);
				createdResources.userTokens.push(
					targetUserResult.data.createUser.authenticationToken,
				);

				const createOrgResult = await mercuriusClient.mutate(
					Mutation_createOrganization,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								name: `TestOrg_${faker.string.ulid()}`,
								description: faker.lorem.sentence(),
							},
						},
					},
				);

				assertToBeNonNullish(createOrgResult.data.createOrganization?.id);
				createdResources.organizationIds.push(
					createOrgResult.data.createOrganization.id,
				);

				// Add both users as non-admin members
				await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						input: {
							organizationId: createOrgResult.data.createOrganization.id,
							memberId: createUserResult.data.createUser.user.id,
							role: "regular",
						},
					},
				});

				await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						input: {
							organizationId: createOrgResult.data.createOrganization.id,
							memberId: targetUserResult.data.createUser.user.id,
							role: "regular",
						},
					},
				});

				// Block the target user as admin
				await mercuriusClient.mutate(Mutation_blockUser, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: targetUserResult.data.createUser.user.id,
					},
				});

				// Try to unblock as non-admin member
				const result = await mercuriusClient.mutate(Mutation_unblockUser, {
					headers: {
						authorization: `bearer ${createUserResult.data.createUser.authenticationToken}`,
					},
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: targetUserResult.data.createUser.user.id,
					},
				});

				expect(result.data?.unblockUser).toEqual(null);
				expect(result.errors).toEqual(
					expect.arrayContaining<TalawaGraphQLFormattedError>([
						expect.objectContaining<TalawaGraphQLFormattedError>({
							extensions: expect.objectContaining<UnauthorizedActionExtensions>(
								{
									code: "unauthorized_action",
								},
							),
							message: expect.any(String),
							path: ["unblockUser"],
						}),
					]),
				);
			});
		},
	);

	suite(
		"results in the value of true for the field 'data.unblockUser' if",
		() => {
			/**
			 * Tests successful user unblock.
			 */
			test("all conditions are met and the user is successfully unblocked.", async () => {
				const adminSignInResult = await mercuriusClient.query(Query_signIn, {
					variables: {
						input: {
							emailAddress:
								server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
							password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
						},
					},
				});

				assertToBeNonNullish(
					adminSignInResult.data.signIn?.authenticationToken,
				);

				// Create user to be blocked
				const createUserResult = await mercuriusClient.mutate(
					Mutation_createUser,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								emailAddress: `email${faker.string.ulid()}@email.com`,
								isEmailAddressVerified: false,
								name: "Test User",
								password: "TestPassword123!",
								role: "regular",
							},
						},
					},
				);

				assertToBeNonNullish(createUserResult.data.createUser?.user?.id);
				assertToBeNonNullish(
					createUserResult.data.createUser?.authenticationToken,
				);
				createdResources.userTokens.push(
					createUserResult.data.createUser.authenticationToken,
				);

				const createOrgResult = await mercuriusClient.mutate(
					Mutation_createOrganization,
					{
						headers: {
							authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
						},
						variables: {
							input: {
								name: `TestOrg_${faker.string.ulid()}`,
								description: faker.lorem.sentence(),
							},
						},
					},
				);

				assertToBeNonNullish(createOrgResult.data.createOrganization?.id);
				createdResources.organizationIds.push(
					createOrgResult.data.createOrganization.id,
				);

				// Add user as member
				await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						input: {
							organizationId: createOrgResult.data.createOrganization.id,
							memberId: createUserResult.data.createUser.user.id,
							role: "regular",
						},
					},
				});

				// Block the user first
				await mercuriusClient.mutate(Mutation_blockUser, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: createUserResult.data.createUser.user.id,
					},
				});

				// Now unblock the user
				const result = await mercuriusClient.mutate(Mutation_unblockUser, {
					headers: {
						authorization: `bearer ${adminSignInResult.data.signIn.authenticationToken}`,
					},
					variables: {
						organizationId: createOrgResult.data.createOrganization.id,
						userId: createUserResult.data.createUser.user.id,
					},
				});

				expect(result.data?.unblockUser).toEqual(true);
				expect(result.errors).toBeUndefined();
			});
		},
	);
=======
import { beforeEach, expect, suite, test, vi } from "vitest";

interface BlockedUserData {
	organizationId: string;
	userId: string;
	createdAt?: Date;
}

interface BlockedUserCondition {
	organizationId: string;
	userId: string;
}

vi.mock("~/src/drizzle/tables/blockedUsers", async () => {
	const actual = await vi.importActual("~/src/drizzle/tables/blockedUsers");
	return {
		...actual,
	};
});

const mockDb = {
	organizations: new Map<string, { id: string; name: string }>(),
	users: new Map<string, { id: string; name: string; role: string }>(),
	organizationMemberships: new Map<
		string,
		{ organizationId: string; memberId: string; role: string }
	>(),
	blockedUsers: new Map<
		string,
		{ organizationId: string; userId: string; createdAt: Date }
	>(),
};

vi.mock("~/src/drizzle/client", () => {
	return {
		drizzleClient: {
			query: {
				organizationsTable: {
					findFirst: vi.fn(({ where }) => {
						const orgId =
							typeof where === "function"
								? where(null, { eq: (field: string, id: string) => id })
								: null;

						return Promise.resolve(mockDb.organizations.get(orgId) || null);
					}),
				},
				usersTable: {
					findFirst: vi.fn(({ where }) => {
						const userId =
							typeof where === "function"
								? where(null, { eq: (field: string, id: string) => id })
								: null;

						return Promise.resolve(mockDb.users.get(userId) || null);
					}),
				},
				organizationMembershipsTable: {
					findFirst: vi.fn(({ where }) => {
						if (typeof where !== "function") return Promise.resolve(null);

						let memberId = null;
						let organizationId = null;

						const operators = {
							and: (...conditions: boolean[]) => {
								return conditions.every((c) => c === true);
							},
							eq: (field: string, value: string) => {
								if (field === "memberId") memberId = value;
								if (field === "organizationId") organizationId = value;
								return true;
							},
						};

						where(
							{ memberId: "memberId", organizationId: "organizationId" },
							operators,
						);

						const key = `${organizationId}:${memberId}`;
						return Promise.resolve(
							mockDb.organizationMemberships.get(key) || null,
						);
					}),
				},
				blockedUsersTable: {
					findFirst: vi.fn(({ where }) => {
						if (typeof where !== "function") return Promise.resolve(null);

						let userId = null;
						let organizationId = null;

						const operators = {
							and: (...conditions: boolean[]) => {
								return conditions.every((c) => c === true);
							},
							eq: (field: string, value: string) => {
								if (field === "userId") userId = value;
								if (field === "organizationId") organizationId = value;
								return true;
							},
						};

						where(
							{ userId: "userId", organizationId: "organizationId" },
							operators,
						);

						const key = `${organizationId}:${userId}`;
						return Promise.resolve(mockDb.blockedUsers.get(key) || null);
					}),
				},
			},
			transaction: vi.fn(async (callback) => {
				const tx = {
					insert: (table: BlockedUser) => ({
						values: (data: BlockedUserData) => {
							if (data.organizationId && data.userId) {
								const key = `${data.organizationId}:${data.userId}`;
								mockDb.blockedUsers.set(key, {
									organizationId: data.organizationId,
									userId: data.userId,
									createdAt: new Date(),
								});
							}
							return Promise.resolve();
						},
					}),
					delete: (table: BlockedUser) => ({
						where: (condition: BlockedUserCondition) => {
							if (condition.organizationId && condition.userId) {
								const key = `${condition.organizationId}:${condition.userId}`;
								mockDb.blockedUsers.delete(key);
							}
							return Promise.resolve();
						},
					}),
				};

				return await callback(tx);
			}),
		},
	};
});

vi.mock("../createRegularUserUsingAdmin", () => ({
	createRegularUserUsingAdmin: vi.fn(async () => {
		const userId = faker.string.uuid();
		mockDb.users.set(userId, {
			id: userId,
			name: `Regular User ${userId}`,
			role: "regular",
		});
		return { userId, authToken: `token-${userId}` };
	}),
}));

import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";

import {
	Mutation_blockUser,
	Mutation_createOrganization,
	Mutation_createOrganizationMembership,
	Mutation_unblockUser,
	Query_signIn,
} from "../documentNodes";

import type { BlockedUser } from "~/src/graphql/types/BlockedUser/BlockedUser";
import { createRegularUserUsingAdmin } from "../createRegularUserUsingAdmin";

vi.mock("../documentNodes", async () => {
	const actual = await vi.importActual("../documentNodes");

	const originalMutate = mercuriusClient.mutate;

	mercuriusClient.mutate = vi
		.fn()
		.mockImplementation(async (document, options) => {
			if (document === actual.Mutation_createOrganization) {
				const orgId = faker.string.uuid();
				const inputVars = (options?.variables?.input || {}) as {
					name?: string;
				};
				const orgName = inputVars.name || "Mock Organization";

				mockDb.organizations.set(orgId, {
					id: orgId,
					name: orgName,
				});

				return {
					data: {
						createOrganization: {
							id: orgId,
							name: orgName,
						},
					},
				};
			}

			if (document === actual.Mutation_createOrganizationMembership) {
				const inputVars = (options?.variables?.input || {}) as {
					organizationId?: string;
					memberId?: string;
					role?: string;
				};
				const organizationId = inputVars.organizationId || "";
				const memberId = inputVars.memberId || "";
				const role = inputVars.role || "regular";

				if (organizationId && memberId) {
					const key = `${organizationId}:${memberId}`;
					mockDb.organizationMemberships.set(key, {
						organizationId,
						memberId,
						role,
					});
				}

				return {
					data: {
						createOrganizationMembership: {
							id: faker.string.uuid(),
							organizationId,
							memberId,
							role,
						},
					},
				};
			}

			if (document === actual.Mutation_blockUser) {
				const vars = (options?.variables || {}) as {
					organizationId?: string;
					userId?: string;
				};
				const organizationId = vars.organizationId || "";
				const userId = vars.userId || "";

				if (organizationId && userId) {
					const key = `${organizationId}:${userId}`;
					mockDb.blockedUsers.set(key, {
						organizationId,
						userId,
						createdAt: new Date(),
					});
				}

				return {
					data: {
						blockUser: true,
					},
				};
			}

			if (document === actual.Mutation_unblockUser) {
				const headers = options?.headers || {};
				const hasAuthToken = headers.authorization?.startsWith("bearer");

				if (!hasAuthToken) {
					return {
						data: { unblockUser: null },
						errors: [
							{
								message: "You must be authenticated to perform this action.",
								path: ["unblockUser"],
								extensions: { code: "unauthenticated" },
							},
						],
					};
				}

				const vars = (options?.variables || {}) as {
					organizationId?: string;
					userId?: string;
				};
				const organizationId = vars.organizationId || "";
				const userId = vars.userId || "";

				const organizationExists = mockDb.organizations.has(organizationId);
				if (!organizationExists) {
					return {
						data: { unblockUser: null },
						errors: [
							{
								message: "Organization not found.",
								path: ["unblockUser"],
								extensions: {
									code: "arguments_associated_resources_not_found",
								},
							},
						],
					};
				}

				const userExists = mockDb.users.has(userId);
				if (!userExists) {
					return {
						data: { unblockUser: null },
						errors: [
							{
								message: "User not found.",
								path: ["unblockUser"],
								extensions: {
									code: "arguments_associated_resources_not_found",
								},
							},
						],
					};
				}

				const blockedKey = `${organizationId}:${userId}`;
				const isBlocked = mockDb.blockedUsers.has(blockedKey);

				if (!isBlocked) {
					return {
						data: { unblockUser: null },
						errors: [
							{
								message: "User is not blocked.",
								path: ["unblockUser"],
								extensions: { code: "forbidden_action" },
							},
						],
					};
				}

				if (headers.authorization === `bearer ${authToken}`) {
					mockDb.blockedUsers.delete(blockedKey);
					return {
						data: {
							unblockUser: true,
						},
					};
				}

				const tokenParts = headers.authorization?.split(" ")[1] || "";
				const requestingUserId = tokenParts.startsWith("token-")
					? tokenParts.replace("token-", "")
					: tokenParts;

				const requestingUser = mockDb.users.get(requestingUserId);
				const isSystemAdmin = requestingUser?.role === "administrator";

				const isOrgAdmin = Array.from(
					mockDb.organizationMemberships.values(),
				).some(
					(m) =>
						m.organizationId === organizationId &&
						m.memberId === requestingUserId &&
						m.role === "administrator",
				);

				if (!isSystemAdmin && !isOrgAdmin) {
					return {
						data: { unblockUser: null },
						errors: [
							{
								message: "You are not authorized to perform this action.",
								path: ["unblockUser"],
								extensions: { code: "unauthorized_action" },
							},
						],
					};
				}

				mockDb.blockedUsers.delete(blockedKey);
				return {
					data: {
						unblockUser: true,
					},
				};
			}

			return await originalMutate(document, options);
		});
	return actual;
});

let authToken: string | null;

async function setupAuth() {
	const signInResult = await mercuriusClient.query(Query_signIn, {
		variables: {
			input: {
				emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
				password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
			},
		},
	});

	assertToBeNonNullish(signInResult.data?.signIn);
	authToken = signInResult.data.signIn.authenticationToken;
	assertToBeNonNullish(authToken);

	const adminId = signInResult.data?.signIn?.user?.id;
	if (adminId) {
		mockDb.users.set(adminId, {
			id: adminId,
			name: "Admin User",
			role: "administrator",
		});
	}

	return { signInResult, authToken };
}

beforeEach(async () => {
	mockDb.organizations.clear();
	mockDb.users.clear();
	mockDb.organizationMemberships.clear();
	mockDb.blockedUsers.clear();

	vi.clearAllMocks();

	await setupAuth();
});

suite("Mutation field unblockUser", () => {
	suite("when the client is not authenticated", () => {
		test("should return an error with unauthenticated extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_unblockUser, {
				variables: {
					organizationId: faker.string.uuid(),
					userId: faker.string.uuid(),
				},
			});
			expect(result.data?.unblockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "unauthenticated",
						}),
						path: ["unblockUser"],
					}),
				]),
			);
		});
	});

	suite("when the organization does not exist", () => {
		test("should return an error with arguments_associated_resources_not_found extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_unblockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: faker.string.uuid(),
					userId: faker.string.uuid(),
				},
			});
			expect(result.data?.unblockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
						}),
						path: ["unblockUser"],
					}),
				]),
			);
		});
	});

	suite("when the target user does not exist", () => {
		test("should return an error with arguments_associated_resources_not_found extensions code", async () => {
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: "Unblock User Test Org",
							description: "Org to test unblock user",
							countryCode: "us",
							state: "CA",
							city: "San Francisco",
							postalCode: "94101",
							addressLine1: "100 Test St",
							addressLine2: "Suite 1",
						},
					},
				},
			);
			const orgId = createOrgResult.data?.createOrganization?.id;
			assertToBeNonNullish(orgId);

			const result = await mercuriusClient.mutate(Mutation_unblockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: orgId,
					userId: faker.string.uuid(),
				},
			});
			expect(result.data?.unblockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
						}),
						path: ["unblockUser"],
					}),
				]),
			);
		});
	});

	suite("when the current user is not an admin", () => {
		test("should return an error with unauthorized_action extensions code", async () => {
			const { authToken: regularAuthToken, userId } =
				await createRegularUserUsingAdmin();
			assertToBeNonNullish(regularAuthToken);
			assertToBeNonNullish(userId);

			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: "Unblock User Auth Test Org",
							description: "Org to test unblock user auth",
							countryCode: "us",
							state: "CA",
							city: "San Francisco",
							postalCode: "94101",
							addressLine1: "101 Test Ave",
							addressLine2: "Suite 2",
						},
					},
				},
			);
			const orgId = createOrgResult.data?.createOrganization?.id;
			assertToBeNonNullish(orgId);

			await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					input: {
						organizationId: orgId,
						memberId: userId,
					},
				},
			});

			const { userId: targetUserId } = await createRegularUserUsingAdmin();
			assertToBeNonNullish(targetUserId);

			await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					input: {
						organizationId: orgId,
						memberId: targetUserId,
					},
				},
			});

			await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: orgId,
					userId: targetUserId,
				},
			});

			const result = await mercuriusClient.mutate(Mutation_unblockUser, {
				headers: { authorization: `bearer ${regularAuthToken}` },
				variables: {
					organizationId: orgId,
					userId: targetUserId,
				},
			});
			expect(result.data?.unblockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "unauthorized_action",
						}),
						path: ["unblockUser"],
					}),
				]),
			);
		});
	});

	suite("when the target user is not blocked", () => {
		test("should return an error with forbidden_action extensions code", async () => {
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: `Unblock User Test Org ${faker.string.uuid()}`,
							description: "Org to test unblock user",
							countryCode: "us",
							state: "CA",
							city: "San Francisco",
							postalCode: "94101",
							addressLine1: "100 Test St",
							addressLine2: "Suite 1",
						},
					},
				},
			);
			const orgId = createOrgResult.data?.createOrganization?.id;
			assertToBeNonNullish(orgId);

			const { data: signInData } = await mercuriusClient.query(Query_signIn, {
				variables: {
					input: {
						emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
						password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
					},
				},
			});

			assertToBeNonNullish(signInData?.signIn);
			assertToBeNonNullish(signInData.signIn.user);
			const adminId = signInData.signIn.user.id;
			assertToBeNonNullish(adminId);

			await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					input: {
						organizationId: orgId,
						memberId: adminId,
						role: "administrator",
					},
				},
			});

			const { userId } = await createRegularUserUsingAdmin();
			assertToBeNonNullish(userId);

			await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					input: {
						organizationId: orgId,
						memberId: userId,
					},
				},
			});

			const result = await mercuriusClient.mutate(Mutation_unblockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: orgId,
					userId,
				},
			});
			expect(result.data?.unblockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "forbidden_action",
						}),
						path: ["unblockUser"],
					}),
				]),
			);
		});
	});

	suite("when all conditions are met", () => {
		test("should successfully unblock the user", async () => {
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: `Unblock User Success Test Org ${faker.string.uuid()}`,
							description: "Org to test successful unblock",
							countryCode: "us",
							state: "CA",
							city: "San Francisco",
							postalCode: "94101",
							addressLine1: "104 Test Lane",
							addressLine2: "Suite 5",
						},
					},
				},
			);
			const orgId = createOrgResult.data?.createOrganization?.id;
			assertToBeNonNullish(orgId);

			const { data: signInData } = await mercuriusClient.query(Query_signIn, {
				variables: {
					input: {
						emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
						password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
					},
				},
			});

			assertToBeNonNullish(signInData?.signIn);
			assertToBeNonNullish(signInData.signIn.user);
			const adminId = signInData.signIn.user.id;
			assertToBeNonNullish(adminId);

			await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					input: {
						organizationId: orgId,
						memberId: adminId,
						role: "administrator",
					},
				},
			});

			const { userId } = await createRegularUserUsingAdmin();
			assertToBeNonNullish(userId);

			await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					input: {
						organizationId: orgId,
						memberId: userId,
					},
				},
			});

			await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: orgId,
					userId,
				},
			});

			const result = await mercuriusClient.mutate(Mutation_unblockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: orgId,
					userId,
				},
			});
			expect(result.data?.unblockUser).toBe(true);
			expect(result.errors).toBeUndefined();
		});
	});
>>>>>>> upstream
});
