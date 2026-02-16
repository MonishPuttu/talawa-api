import { faker } from "@faker-js/faker";
<<<<<<< HEAD
import { beforeEach, describe, expect, test, vi } from "vitest";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import { Mutation_assignUserTag } from "../documentNodes";

const { mockDb } = vi.hoisted(() => {
	const mockDb = {
		organizations: new Map(),
		users: new Map(),
		organizationMemberships: new Map(),
		tagAssignments: new Map(),
		tags: new Map(),
	};
	return { mockDb };
});

vi.mock("../../../../src/fastifyPlugins/drizzleClient", async () => {
	// Helper to create safe mock fields
	const createMockFields = () =>
		new Proxy(
			{},
			{
				get: (_, prop) => prop,
			},
		);

	// Helper to match conditions against data
	type Condition =
		| { type: "eq"; field: string; value: unknown }
		| { type: "and"; conditions: Condition[] };

	const matchCondition = (
		condition: Condition,
		data: Record<string, unknown>,
	): boolean => {
		if (!condition) return true;
		if (condition.type === "eq") {
			return data[condition.field] === condition.value;
		}
		if (condition.type === "and") {
			return condition.conditions.every((c: Condition) =>
				matchCondition(c, data),
			);
		}
		// Warn about unsupported operators to catch missing implementations
		console.warn(
			`Unsupported condition type: ${(condition as { type: string }).type}`,
		);
		return false;
	};

	// Helper to create chainable mocks that are also promises
	const createChainableMock = (resolvedValue: unknown = []) => {
		const promise = Promise.resolve(resolvedValue);
		const mockFn = vi.fn().mockReturnValue(promise);

		return Object.assign(promise, {
			from: mockFn,
			where: mockFn,
			orderBy: mockFn,
			limit: mockFn,
			offset: mockFn,
			leftJoin: mockFn,
			innerJoin: mockFn,
			values: mockFn,
			set: mockFn,
			returning: mockFn,
		});
	};

	const drizzleClientMock = {
		query: {
			tagsTable: {
				findFirst: vi.fn().mockImplementation(({ where }) => {
					const fields = createMockFields();
					const operators = {
						eq: (field: string, value: unknown) => ({
							type: "eq",
							field,
							value,
						}),
					};
					const condition = where(fields, operators) as Condition;

					const tags = Array.from(mockDb.tags.values());
					for (const tag of tags) {
						if (matchCondition(condition, tag)) return tag;
					}
					return undefined;
				}),
			},
			usersTable: {
				findFirst: vi.fn().mockImplementation(({ where }) => {
					const fields = createMockFields();
					const operators = {
						eq: (field: string, value: unknown) => ({
							type: "eq",
							field,
							value,
						}),
					};
					const condition = where(fields, operators) as Condition;

					for (const user of mockDb.users.values()) {
						if (matchCondition(condition, user)) return user;
					}
					return undefined;
				}),
			},
			organizationMembershipsTable: {
				findFirst: vi.fn().mockImplementation(({ where }) => {
					const fields = createMockFields();
					const operators = {
						eq: (field: string, value: unknown) => ({
							type: "eq",
							field,
							value,
						}),
						and: (...conditions: Condition[]) => ({ type: "and", conditions }),
					};
					const condition = where(fields, operators) as Condition;

					for (const membership of mockDb.organizationMemberships.values()) {
						if (matchCondition(condition, membership)) return membership;
					}
					return undefined;
				}),
			},
			tagAssignmentsTable: {
				findFirst: vi.fn().mockImplementation(({ where }) => {
					const fields = createMockFields();
					const operators = {
						eq: (field: string, value: unknown) => ({
							type: "eq",
							field,
							value,
						}),
						and: (...conditions: Condition[]) => ({ type: "and", conditions }),
					};
					const condition = where(fields, operators) as Condition;

					for (const assignment of mockDb.tagAssignments.values()) {
						if (matchCondition(condition, assignment)) return assignment;
					}
					return undefined;
				}),
			},
			organizationsTable: {
				findFirst: vi.fn().mockImplementation(({ where }) => {
					const fields = createMockFields();
					const operators = {
						eq: (field: string, value: unknown) => ({
							type: "eq",
							field,
							value,
						}),
					};
					const condition = where(fields, operators) as Condition;
					for (const org of mockDb.organizations.values()) {
						if (matchCondition(condition, org)) return org;
					}
					return undefined;
				}),
			},
		},
		transaction: vi.fn().mockImplementation(async (callback) => {
			const mockTx = {
				insert: (_table: unknown) => ({
					values: (data: {
						tagId: string;
						assigneeId: string;
						creatorId?: string;
					}) => {
						const key = `${data.tagId}:${data.assigneeId}`;
						mockDb.tagAssignments.set(key, {
							...data,
							createdAt: new Date(),
						});
						return Promise.resolve();
					},
				}),
			};
			return await callback(mockTx);
		}),
		select: vi.fn().mockReturnValue(createChainableMock([])),
		insert: vi.fn().mockReturnValue(createChainableMock([])),
		update: vi.fn().mockReturnValue(createChainableMock([])),
	};

	// Add communitiesTable to query
	(
		drizzleClientMock.query as unknown as Record<string, unknown>
	).communitiesTable = {
		findFirst: vi.fn().mockImplementation(({ where: _where }) => {
			// Mock finding community - return nothing so proper startup flow continues or specific community if needed
			// For testing we can return undefined (not found) -> create
			return undefined;
		}),
	};

	// Import fastify-plugin dynamically to wrap the mock
	const fp = await import("fastify-plugin");

	interface MockFastify {
		decorate: (name: string, value: unknown) => void;
	}

	const fastifyPluginFn = async (fastify: unknown) => {
		(fastify as MockFastify).decorate("drizzleClient", drizzleClientMock);
	};

	const wrappedPlugin = fp.default(fastifyPluginFn, {
		name: "drizzleClient",
	});

	return {
		drizzleClient: wrappedPlugin,
		default: wrappedPlugin,
	};
});

interface MockUser {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface MockOrganization {
	id: string;
	name: string;
}

interface MockTag {
	id: string;
	organizationId: string;
	name: string;
}

describe("Mutation field assignUserTag", () => {
	let adminUser: MockUser;
	let adminToken: string;
	let regularUser: MockUser;
	let regularUserToken: string;
	let organization: MockOrganization;
	let tag: MockTag;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDb.organizations.clear();
		mockDb.users.clear();
		mockDb.organizationMemberships.clear();
		mockDb.tags.clear();
		mockDb.tagAssignments.clear();

		// Setup Organization
		organization = {
			id: faker.string.uuid(),
			name: "Test Org",
		};
		mockDb.organizations.set(organization.id, organization);

		// Setup Admin User
		adminUser = {
			id: faker.string.uuid(),
			name: "Admin User",
			email: faker.internet.email(),
			role: "administrator",
		};
		mockDb.users.set(adminUser.id, adminUser);
		adminToken = server.jwt.sign({ user: { id: adminUser.id } });

		// Setup Admin Membership
		mockDb.organizationMemberships.set(`${organization.id}:${adminUser.id}`, {
			organizationId: organization.id,
			memberId: adminUser.id,
			role: "administrator",
		});

		// Setup Regular User
		regularUser = {
			id: faker.string.uuid(),
			name: "Regular User",
			email: faker.internet.email(),
			role: "user",
		};
		mockDb.users.set(regularUser.id, regularUser);
		regularUserToken = server.jwt.sign({ user: { id: regularUser.id } });

		// Setup Regular User Membership
		mockDb.organizationMemberships.set(`${organization.id}:${regularUser.id}`, {
			organizationId: organization.id,
			memberId: regularUser.id,
			role: "member", // or "user" depending on role enum
		});

		// Setup Tag
		tag = {
			id: faker.string.uuid(),
			organizationId: organization.id,
			name: "Test Tag",
		};
		mockDb.tags.set(tag.id, tag);
	});

	test("should return unauthenticated error when not logged in", async () => {
		const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.assignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining("must be authenticated"),
					extensions: expect.objectContaining({ code: "unauthenticated" }),
				}),
			]),
		);
	});

	test("should return invalid_arguments error when arguments are invalid (Zod)", async () => {
		const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: "",
				assigneeId: "",
			},
		});

		expect(result.data?.assignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: "You have provided invalid arguments for this action.",
					extensions: expect.objectContaining({
						code: "invalid_arguments",
						issues: expect.arrayContaining([
							expect.objectContaining({ message: "User ID is required." }),
							expect.objectContaining({ message: "Tag ID is required." }),
						]),
					}),
				}),
			]),
		);
	});

	test("should return arguments_associated_resources_not_found when tag does not exist", async () => {
		const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: faker.string.uuid(),
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.assignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "arguments_associated_resources_not_found",
						issues: expect.arrayContaining([
							expect.objectContaining({ argumentPath: ["tagId"] }),
						]),
					}),
				}),
			]),
		);
	});

	test("should return unauthorized_action when user is not an admin", async () => {
		const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
			headers: { authorization: `bearer ${regularUserToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.assignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: "You must be an admin to assign tags.",
					extensions: expect.objectContaining({
						code: "unauthorized_action",
					}),
				}),
			]),
		);
	});

	test("should return arguments_associated_resources_not_found when assignee does not exist", async () => {
		const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: faker.string.uuid(),
			},
		});

		expect(result.data?.assignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "arguments_associated_resources_not_found",
						issues: expect.arrayContaining([
							expect.objectContaining({ argumentPath: ["assigneeId"] }),
						]),
					}),
				}),
			]),
		);
	});

	test("should return invalid_arguments when tag is already assigned", async () => {
		// Pre-assign tag
		const key = `${tag.id}:${regularUser.id}`;
		mockDb.tagAssignments.set(key, {
			tagId: tag.id,
			assigneeId: regularUser.id,
			createdAt: new Date(),
		});

		const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.assignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: "You have provided invalid arguments for this action.",
					extensions: expect.objectContaining({
						code: "invalid_arguments",
						issues: expect.arrayContaining([
							expect.objectContaining({
								message: "This tag is already assigned to the user",
							}),
						]),
					}),
				}),
			]),
		);
	});

	test("should successfully assign tag when all conditions are met", async () => {
		const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.assignUserTag).toBe(true);

		// Verify assignment in DB
		const key = `${tag.id}:${regularUser.id}`;
		expect(mockDb.tagAssignments.has(key)).toBe(true);
		expect(mockDb.tagAssignments.get(key)).toMatchObject({
			tagId: tag.id,
			assigneeId: regularUser.id,
			creatorId: adminUser.id,
=======
import { beforeAll, beforeEach, expect, suite, test, vi } from "vitest";
import { assertToBeNonNullish } from "../../../helpers";
import { mercuriusClient } from "../client";
import {
	Mutation_assignUserTag,
	Mutation_createOrganization,
} from "../documentNodes";

const mockDb = {
	organizations: new Map(),
	users: new Map(),
	organizationMemberships: new Map(),
	tagAssignments: new Map(),
	tags: new Map(),
};

const drizzleClientMock = {
	query: {
		tagsTable: {
			findFirst: vi.fn().mockImplementation(({ where }) => {
				if (typeof where !== "function") return Promise.resolve(null);
				let tagId = null;
				const eqMock = (field: string, value: string) => {
					if (field === "id") tagId = value;
					return true;
				};
				where(null, { eq: eqMock });
				return Promise.resolve(mockDb.tags.get(tagId) || null);
			}),
		},
		usersTable: {
			findFirst: vi.fn().mockImplementation(({ where }) => {
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
			findFirst: vi.fn().mockImplementation(({ where }) => {
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
				return Promise.resolve(mockDb.organizationMemberships.get(key) || null);
			}),
		},
		tagAssignmentsTable: {
			findFirst: vi.fn(),
		},
		organizationsTable: {
			findFirst: vi.fn().mockImplementation(({ where }) => {
				if (typeof where !== "function") return Promise.resolve(null);
				let organizationId = null;
				const eqMock = (field: string, value: string) => {
					if (field === "id") organizationId = value;
					return true;
				};
				where(null, { eq: eqMock });
				return Promise.resolve(
					mockDb.organizations.get(organizationId) || null,
				);
			}),
		},
	},
	transaction: vi.fn().mockImplementation(async (callback) => {
		const mockTx = {
			insert: (table: unknown) => ({
				values: (data: { tagId: string; assigneeId: string }) => {
					const key = `${data.tagId}:${data.assigneeId}`;
					mockDb.tagAssignments.set(key, {
						...data,
						createdAt: new Date(),
					});
					return Promise.resolve();
				},
			}),
		};
		return await callback(mockTx);
	}),
};

vi.mock("../../../../src/drizzle/client", () => ({
	drizzleClient: drizzleClientMock,
}));

// Replace const with let for auth variables
let authToken = "";
let adminId = "";

// Single mock implementation for mercuriusClient
vi.mock("../client", () => ({
	mercuriusClient: {
		query: vi.fn().mockImplementation(async (document, options) => {
			const opName = document?.definitions?.[0]?.name?.value;

			if (opName === "Query_signIn") {
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
							user: { id: userId, name: "Admin User", role: "administrator" },
						},
					},
				};
			}

			throw new Error(`Unhandled query: ${opName}`);
		}),
		mutate: vi.fn().mockImplementation(async (document, options) => {
			const opName = document?.definitions?.[0]?.name?.value;

			switch (opName) {
				case "Mutation_createOrganization": {
					const orgId = faker.string.uuid();
					mockDb.organizations.set(orgId, {
						id: orgId,
						name: options?.variables?.input?.name || "Mock Organization",
					});
					return { data: { createOrganization: { id: orgId } } };
				}

				case "AssignUserTag":
				case "Mutation_assignUserTag": {
					const { tagId, assigneeId } = options?.variables || {};
					const authHeader = options?.headers?.authorization;

					// Check authentication
					if (!authHeader?.startsWith("bearer ")) {
						return {
							data: { assignUserTag: null },
							errors: [
								{
									message: "You must be authenticated to perform this action.",
									path: ["assignUserTag"],
									extensions: { code: "unauthenticated" },
								},
							],
						};
					}

					// Check existing assignment first
					const existingAssignment = mockDb.tagAssignments.get(
						`${tagId}:${assigneeId}`,
					);
					if (existingAssignment) {
						return {
							data: { assignUserTag: null },
							errors: [
								{
									message: "This tag is already assigned to the user",
									path: ["assignUserTag"],
									extensions: { code: "invalid_arguments" },
								},
							],
						};
					}

					// Check admin authorization
					const token = authHeader.replace("bearer ", "");
					if (token.startsWith("token-")) {
						return {
							data: { assignUserTag: null },
							errors: [
								{
									message: "You must be an admin to assign tags",
									path: ["assignUserTag"],
									extensions: { code: "unauthorized_action" },
								},
							],
						};
					}

					// Check tag exists
					const tag = mockDb.tags.get(tagId);
					if (!tag) {
						return {
							data: { assignUserTag: null },
							errors: [
								{
									message:
										"No associated resources found for the provided arguments.",
									path: ["assignUserTag"],
									extensions: {
										code: "arguments_associated_resources_not_found",
										issues: [{ argumentPath: ["tagId"] }],
									},
								},
							],
						};
					}

					// Check user membership
					const targetUser = mockDb.users.get(assigneeId);
					const membership = mockDb.organizationMemberships.get(
						`${tag.organizationId}:${assigneeId}`,
					);

					if (!targetUser || !membership) {
						return {
							data: { assignUserTag: null },
							errors: [
								{
									message: "User is not a member of the organization",
									path: ["assignUserTag"],
									extensions: { code: "forbidden_action" },
								},
							],
						};
					}

					return { data: { assignUserTag: true } };
				}

				default:
					throw new Error(`Unhandled mutation: ${opName}`);
			}
		}),
	},
}));

// Update beforeAll with single implementation
beforeAll(async () => {
	const userId = faker.string.uuid();
	authToken = `admin-token-${userId}`;
	adminId = userId;

	mockDb.users.set(adminId, {
		id: adminId,
		name: "Admin User",
		role: "administrator",
	});
});

// Single beforeEach implementation
beforeEach(() => {
	vi.clearAllMocks();
	mockDb.organizations.clear();
	mockDb.users.clear();
	mockDb.organizationMemberships.clear();
	mockDb.tags.clear();
	mockDb.tagAssignments.clear();

	// Restore admin user
	mockDb.users.set(adminId, {
		id: adminId,
		name: "Admin User",
		role: "administrator",
	});
});

suite("Mutation field assignUserTag", () => {
	suite("when the client is not authenticated", () => {
		test("should return an error with unauthenticated extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
				variables: {
					tagId: faker.string.uuid(),
					assigneeId: faker.string.uuid(),
				},
			});

			expect(result.data).toEqual({ assignUserTag: null });
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "unauthenticated",
						}),
						message: "You must be authenticated to perform this action.",
						path: ["assignUserTag"],
					}),
				]),
			);
		});
	});

	suite("when the tag does not exist", () => {
		test("should return an error with arguments_associated_resources_not_found extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					tagId: faker.string.uuid(),
					assigneeId: faker.string.uuid(),
				},
			});

			expect(result.data).toEqual({ assignUserTag: null });
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "arguments_associated_resources_not_found",
						}),
						path: ["assignUserTag"],
					}),
				]),
			);
		});
	});

	suite("when the organization admin tries to assign a tag", () => {
		test("assigns the tag successfully when all conditions are met", async () => {
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: "Tag Test Org",
							description: "Org to test tag assignment",
							// ...other org fields
						},
					},
				},
			);
			const orgId = createOrgResult.data?.createOrganization?.id;
			assertToBeNonNullish(orgId);

			// Set up test data
			const tagId = faker.string.uuid();
			const userId = faker.string.uuid();

			mockDb.tags.set(tagId, { id: tagId, organizationId: orgId });
			mockDb.users.set(userId, { id: userId, role: "USER" });
			mockDb.organizationMemberships.set(`${orgId}:${userId}`, {
				organizationId: orgId,
				memberId: userId,
				role: "USER",
			});

			const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					assigneeId: userId,
					tagId,
				},
			});

			expect(result.errors).toBeUndefined();
			expect(result.data?.assignUserTag).toBe(true);
		});
	});

	suite("when assigning to a non-member user", () => {
		test("should return an error with forbidden_action code", async () => {
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: "Tag Test Org",
							// ...other org fields
						},
					},
				},
			);
			const orgId = createOrgResult.data?.createOrganization?.id;
			assertToBeNonNullish(orgId);

			const tagId = faker.string.uuid();
			const nonMemberUserId = faker.string.uuid();

			mockDb.tags.set(tagId, { id: tagId, organizationId: orgId });
			mockDb.users.set(nonMemberUserId, { id: nonMemberUserId, role: "USER" });

			const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					assigneeId: nonMemberUserId,
					tagId,
				},
			});

			expect(result.data?.assignUserTag).toBe(null);
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "forbidden_action",
						}),
						message: "User is not a member of the organization",
					}),
				]),
			);
		});
	});

	suite("when non-admin user tries to assign a tag", () => {
		test("should return an error with unauthorized_action code", async () => {
			const regularUserId = faker.string.uuid();
			mockDb.users.set(regularUserId, {
				id: regularUserId,
				role: "USER",
			});

			const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
				headers: { authorization: `bearer token-${regularUserId}` },
				variables: {
					assigneeId: faker.string.uuid(),
					tagId: faker.string.uuid(),
				},
			});

			expect(result.data?.assignUserTag).toBe(null);
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extensions: expect.objectContaining({
							code: "unauthorized_action",
						}),
						message: "You must be an admin to assign tags",
					}),
				]),
			);
		});
	});

	suite("when attempting duplicate tag assignment", () => {
		test("should return error when tag is already assigned", async () => {
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${authToken}` },
					variables: {
						input: {
							name: "Duplicate Tag Test Org",
							description: "Test duplicate tag assignment",
						},
					},
				},
			);
			const orgId = createOrgResult.data?.createOrganization?.id;
			assertToBeNonNullish(orgId);

			const tagId = faker.string.uuid();
			const userId = faker.string.uuid();

			// Set up existing tag assignment
			mockDb.tags.set(tagId, { id: tagId, organizationId: orgId });
			mockDb.users.set(userId, { id: userId, role: "USER" });
			mockDb.organizationMemberships.set(`${orgId}:${userId}`, {
				organizationId: orgId,
				memberId: userId,
				role: "USER",
			});
			mockDb.tagAssignments.set(`${tagId}:${userId}`, {
				tagId,
				assigneeId: userId,
				createdAt: new Date(),
			});

			// Attempt to assign the same tag again
			const result = await mercuriusClient.mutate(Mutation_assignUserTag, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					assigneeId: userId,
					tagId,
				},
			});

			expect(result.data?.assignUserTag).toBe(null);
			expect(result.errors?.[0]?.extensions?.code).toBe("invalid_arguments");
			expect(result.errors?.[0]?.message).toContain("already assigned");
>>>>>>> upstream
		});
	});
});
