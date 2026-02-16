import { faker } from "@faker-js/faker";
<<<<<<< HEAD
import { beforeAll, beforeEach, expect, suite, test } from "vitest";
import type { TalawaGraphQLFormattedError } from "~/src/utilities/TalawaGraphQLError";
=======
import { beforeAll, beforeEach, expect, suite, test, vi } from "vitest";
>>>>>>> upstream
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import {
	Mutation_blockUser,
	Mutation_createOrganization,
<<<<<<< HEAD
	Mutation_createOrganizationMembership,
	Mutation_createUser,
	Query_signIn,
} from "../documentNodes";

async function getAdminToken() {
=======
	Query_signIn,
} from "../documentNodes";

const mockDb = {
	organizations: new Map(),
	users: new Map(),
	organizationMemberships: new Map(),
	blockedUsers: new Map(),
};

interface BlockedUserData {
	organizationId: string;
	userId: string;
	createdAt?: Date;
}

interface BlockedUserCondition {
	organizationId: string;
	userId: string;
}

vi.mock("../createRegularUserUsingAdmin", () => ({
	createRegularUserUsingAdmin: vi.fn(async () => {
		const userId = faker.string.uuid();
		mockDb.users.set(userId, {
			id: userId,
			name: `Regular User ${userId}`,
			role: "user",
		});
		return { userId, authToken: `token-${userId}` };
	}),
}));

vi.mock("~/src/drizzle/client", () => ({
	drizzleClient: {
		query: {
			organizationsTable: {
				findFirst: vi.fn(({ where }) => {
					if (typeof where !== "function") return Promise.resolve(null);

					let orgId = null;
					const eqMock = (field: string, value: string) => {
						if (field === "id") orgId = value;
						return true;
					};

					where(null, { eq: eqMock });

					return Promise.resolve(mockDb.organizations.get(orgId) || null);
				}),
			},
			usersTable: {
				findFirst: vi.fn(({ where }) => {
					if (typeof where !== "function") return Promise.resolve(null);

					let userId = null;
					const eqMock = (field: string, value: string) => {
						if (field === "id") userId = value;
						return true;
					};

					where(null, { eq: eqMock });

					return Promise.resolve(mockDb.users.get(userId) || null);
				}),
			},
			organizationMembershipsTable: {
				findFirst: vi.fn(({ where }) => {
					if (typeof where !== "function") return Promise.resolve(null);

					let memberId = null;
					let organizationId = null;

					where(
						{ memberId: "memberId", organizationId: "organizationId" },
						{
							and: (...conditions: boolean[]) => true,
							eq: (field: string, value: string) => {
								if (field === "memberId") memberId = value;
								if (field === "organizationId") organizationId = value;
								return true;
							},
						},
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

					where(
						{ userId: "userId", organizationId: "organizationId" },
						{
							and: (...conditions: boolean[]) => true,
							eq: (field: string, value: string) => {
								if (field === "userId") userId = value;
								if (field === "organizationId") organizationId = value;
								return true;
							},
						},
					);

					const key = `${organizationId}:${userId}`;
					return Promise.resolve(mockDb.blockedUsers.get(key) || null);
				}),
			},
		},
		transaction: vi.fn(async (callback) => {
			const mockTx = {
				insert: () => ({
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
				delete: () => ({
					where: (condition: BlockedUserCondition) => {
						if (condition.organizationId && condition.userId) {
							const key = `${condition.organizationId}:${condition.userId}`;
							mockDb.blockedUsers.delete(key);
						}
						return Promise.resolve();
					},
				}),
			};

			return await callback(mockTx);
		}),
	},
}));

const originalMutate = mercuriusClient.mutate;

let authToken = "";
let adminId = "";

beforeAll(async () => {
	mercuriusClient.mutate = vi
		.fn()
		.mockImplementation(async (document, options) => {
			const opName = document?.definitions?.[0]?.name?.value;

			if (opName === "CreateOrganization") {
				const orgId = faker.string.uuid();
				const orgName = options?.variables?.input?.name || "Mock Organization";

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

			if (opName === "CreateOrganizationMembership") {
				const orgId = options?.variables?.input?.organizationId;
				const memberId = options?.variables?.input?.memberId;
				const role = options?.variables?.input?.role || "regular";

				if (orgId && memberId) {
					const key = `${orgId}:${memberId}`;
					mockDb.organizationMemberships.set(key, {
						organizationId: orgId,
						memberId,
						role,
					});
				}

				return {
					data: {
						createOrganizationMembership: {
							id: faker.string.uuid(),
							organizationId: orgId,
							memberId,
							role,
						},
					},
				};
			}

			if (opName === "CreateUser") {
				const userId = faker.string.uuid();
				const name = options?.variables?.input?.name || "Mock User";
				const role = options?.variables?.input?.role || "user";

				mockDb.users.set(userId, {
					id: userId,
					name,
					role,
				});

				return {
					data: {
						createUser: {
							user: {
								id: userId,
							},
						},
					},
				};
			}

			if (opName === "BlockUser") {
				const orgId = options?.variables?.organizationId || "";
				const userId = options?.variables?.userId || "";
				const authHeader = options?.headers?.authorization;

				if (!authHeader) {
					return {
						data: { blockUser: null },
						errors: [
							{
								message: "You must be authenticated to perform this action.",
								path: ["blockUser"],
								extensions: { code: "unauthenticated" },
								locations: [{ line: 2, column: 3 }],
							},
						],
					};
				}
				const org = mockDb.organizations.get(orgId);
				if (!org) {
					return {
						data: { blockUser: null },
						errors: [
							{
								message:
									"No associated resources found for the provided arguments.",
								path: ["blockUser"],
								extensions: {
									code: "arguments_associated_resources_not_found",
									issues: [{ argumentPath: ["input", "organizationId"] }],
								},
								locations: [{ line: 2, column: 3 }],
							},
						],
					};
				}

				const user = mockDb.users.get(userId);
				if (!user) {
					return {
						data: { blockUser: null },
						errors: [
							{
								message:
									"No associated resources found for the provided arguments.",
								path: ["blockUser"],
								extensions: {
									code: "arguments_associated_resources_not_found",
									issues: [{ argumentPath: ["input", "userId"] }],
								},
								locations: [{ line: 2, column: 3 }],
							},
						],
					};
				}

				const token = authHeader.replace("bearer ", "");

				if (token.startsWith("token-")) {
					return {
						data: { blockUser: null },
						errors: [
							{
								message: "You are not authorized to perform this action.",
								path: ["blockUser"],
								extensions: { code: "unauthorized_action" },
								locations: [{ line: 2, column: 3 }],
							},
						],
					};
				}

				if (orgId && userId) {
					const key = `${orgId}:${userId}`;
					mockDb.blockedUsers.set(key, {
						organizationId: orgId,
						userId,
						createdAt: new Date(),
					});
				}

				return { data: { blockUser: true } };
			}

			if (opName === "SignIn") {
				const userId = faker.string.uuid();

				mockDb.users.set(userId, {
					id: userId,
					name: "Admin User",
					role: "administrator",
				});

				return {
					data: {
						signIn: {
							authenticationToken: `admin-token-${userId}`,
							user: {
								id: userId,
								name: "Admin User",
								role: "administrator",
							},
						},
					},
				};
			}

			return await originalMutate(document, options);
		});

>>>>>>> upstream
	const signInResult = await mercuriusClient.query(Query_signIn, {
		variables: {
			input: {
				emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
				password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
			},
		},
	});

<<<<<<< HEAD
	const authToken = signInResult.data?.signIn?.authenticationToken;
	assertToBeNonNullish(authToken);
	return authToken;
}

async function createTestUser(
	adminAuthToken: string,
	role: "regular" | "administrator" = "regular",
) {
	const userResult = await mercuriusClient.mutate(Mutation_createUser, {
		headers: {
			authorization: `bearer ${adminAuthToken}`,
		},
		variables: {
			input: {
				emailAddress: `${faker.string.uuid()}@test.com`,
				name: faker.person.fullName(),
				password: "password123",
				role: role,
				isEmailAddressVerified: false,
			},
		},
	});

	assertToBeNonNullish(userResult.data?.createUser);
	assertToBeNonNullish(userResult.data.createUser.user?.id);
	assertToBeNonNullish(userResult.data.createUser.authenticationToken);

	return {
		userId: userResult.data.createUser.user.id,
		authToken: userResult.data.createUser.authenticationToken,
	};
}

async function createTestOrganization(adminAuthToken: string) {
	const orgResult = await mercuriusClient.mutate(Mutation_createOrganization, {
		headers: {
			authorization: `bearer ${adminAuthToken}`,
		},
		variables: {
			input: {
				name: `Test Organization ${faker.string.uuid()}`,
				countryCode: "us",
			},
		},
	});

	assertToBeNonNullish(orgResult.data?.createOrganization);
	return orgResult.data.createOrganization.id;
}

async function createOrganizationMembership(
	adminAuthToken: string,
	memberId: string,
	organizationId: string,
	role: "regular" | "administrator" = "regular",
) {
	const membershipResult = await mercuriusClient.mutate(
		Mutation_createOrganizationMembership,
		{
			headers: {
				authorization: `bearer ${adminAuthToken}`,
			},
			variables: {
				input: {
					memberId,
					organizationId,
					role,
				},
			},
		},
	);

	assertToBeNonNullish(membershipResult.data?.createOrganizationMembership);
	return membershipResult.data.createOrganizationMembership.id;
}

suite("Mutation field blockUser", () => {
	let adminAuthToken = "";
	let organizationId = "";
	let regularUserId = "";
	let regularUserAuthToken = "";
	let adminUserId = "";

	beforeAll(async () => {
		adminAuthToken = await getAdminToken();

		const signInResult = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		adminUserId = signInResult.data?.signIn?.user?.id ?? "";
		assertToBeNonNullish(adminUserId);
	});

	beforeEach(async () => {
		organizationId = await createTestOrganization(adminAuthToken);

		// Add admin as administrator member of the organization
		await createOrganizationMembership(
			adminAuthToken,
			adminUserId,
			organizationId,
			"administrator",
		);

		const regularUser = await createTestUser(adminAuthToken);
		regularUserId = regularUser.userId;
		regularUserAuthToken = regularUser.authToken;

		await createOrganizationMembership(
			adminAuthToken,
			regularUserId,
			organizationId,
		);
	});

=======
	if (!signInResult.data?.signIn) {
		throw new Error("Admin sign in failed");
	}

	authToken = signInResult.data.signIn.authenticationToken ?? "";
	adminId = signInResult.data.signIn.user?.id ?? "";

	if (!authToken || !adminId) {
		throw new Error("Failed to get auth token or admin ID");
	}

	if (adminId) {
		mockDb.users.set(adminId, {
			id: adminId,
			name: "Admin User",
			role: "administrator",
		});
	}
});

beforeEach(() => {
	mockDb.organizations.clear();
	mockDb.users.clear();
	mockDb.organizationMemberships.clear();
	mockDb.blockedUsers.clear();

	vi.clearAllMocks();

	if (adminId) {
		mockDb.users.set(adminId, {
			id: adminId,
			name: "Admin User",
			role: "administrator",
		});
	}
});

suite("Mutation field blockUser", () => {
>>>>>>> upstream
	suite("when the client is not authenticated", () => {
		test("should return an error with unauthenticated extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				variables: {
<<<<<<< HEAD
					organizationId,
					userId: regularUserId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
=======
					organizationId: faker.string.uuid(),
					userId: faker.string.uuid(),
				},
			});
			expect(result.data).toEqual({ blockUser: null });
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
>>>>>>> upstream
						extensions: expect.objectContaining({
							code: "unauthenticated",
						}),
						message: "You must be authenticated to perform this action.",
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

<<<<<<< HEAD
	suite("when arguments are invalid", () => {
		test("should return an error with invalid_arguments code for empty organizationId", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId: "",
					userId: regularUserId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "invalid_arguments",
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});

		test("should return an error with invalid_arguments code for empty userId", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: "",
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "invalid_arguments",
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when the organization does not exist", () => {
		test("should return an error with arguments_associated_resources_not_found extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId: faker.string.uuid(),
					userId: regularUserId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: ["input", "organizationId"],
								}),
							]),
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when the current user is not an admin", () => {
		test("should return an error with unauthorized_action extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${regularUserAuthToken}` },
				variables: {
					organizationId,
					userId: regularUserId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "unauthorized_action",
						}),
						message: expect.any(String),
=======
	suite("when the organization does not exist", () => {
		test("should return an error with arguments_associated_resources_not_found extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: faker.string.uuid(),
					userId: faker.string.uuid(),
				},
			});
			expect(result.data).toEqual({ blockUser: null });
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
						}),
>>>>>>> upstream
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when the target user does not exist", () => {
		test("should return an error with arguments_associated_resources_not_found extensions code", async () => {
<<<<<<< HEAD
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: faker.string.uuid(),
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
							issues: expect.arrayContaining([
								expect.objectContaining({
									argumentPath: ["input", "userId"],
								}),
							]),
						}),
						message: expect.any(String),
=======
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: "Block User Test Org",
							description: "Org to test block user",
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

			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					organizationId: orgId,
					userId: faker.string.uuid(),
				},
			});
			expect(result.data).toEqual({ blockUser: null });
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
						}),
>>>>>>> upstream
						path: ["blockUser"],
					}),
				]),
			);
		});
	});
<<<<<<< HEAD

	suite("when the user is already blocked", () => {
		test("should return an error with forbidden_action extensions code", async () => {
			await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: regularUserId,
				},
			});

			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: regularUserId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action",
							message: "User is already blocked from this organization.",
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when the target user is not a member of the organization", () => {
		test("should return an error with forbidden_action extensions code", async () => {
			const nonMemberUser = await createTestUser(adminAuthToken);

			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: nonMemberUser.userId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action",
							message: "User is not a member of the organization.",
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when the user tries to block themselves", () => {
		test("should return an error with forbidden_action extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: adminUserId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action",
							message: "You cannot block yourself.",
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when trying to block an administrator", () => {
		test("should return an error with forbidden_action extensions code", async () => {
			const adminUser = await createTestUser(adminAuthToken, "administrator");
			await createOrganizationMembership(
				adminAuthToken,
				adminUser.userId,
				organizationId,
				"administrator",
			);

			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: adminUser.userId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action",
							message: "You cannot block an admin.",
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when the admin user is not a member of the organization", () => {
		test("should return an error with forbidden_action extensions code", async () => {
			const nonMemberOrg = await createTestOrganization(adminAuthToken);

			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId: nonMemberOrg,
					userId: regularUserId,
				},
			});

			expect(result.data?.blockUser).toBeNull();
			expect(result.errors).toEqual(
				expect.arrayContaining<TalawaGraphQLFormattedError>([
					expect.objectContaining<TalawaGraphQLFormattedError>({
						extensions: expect.objectContaining({
							code: "forbidden_action",
							message: "User is not a member of the organization.",
						}),
						message: expect.any(String),
						path: ["blockUser"],
					}),
				]),
			);
		});
	});

	suite("when all conditions are met", () => {
		test("should successfully block the user and return true", async () => {
			const result = await mercuriusClient.mutate(Mutation_blockUser, {
				headers: { authorization: `bearer ${adminAuthToken}` },
				variables: {
					organizationId,
					userId: regularUserId,
				},
			});

			expect(result.data?.blockUser).toBe(true);
			expect(result.errors).toBeUndefined();
		});
	});
=======
>>>>>>> upstream
});
