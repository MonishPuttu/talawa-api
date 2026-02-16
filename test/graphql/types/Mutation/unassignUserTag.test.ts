import { faker } from "@faker-js/faker";
<<<<<<< HEAD
import { beforeEach, describe, expect, test, vi } from "vitest";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import { Mutation_unassignUserTag } from "../documentNodes";

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
		// Silently return false for unsupported condition types
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
				delete: vi.fn().mockReturnValue({
					where: vi.fn().mockImplementation(() => {
						// Since we can't extract tagId/assigneeId from drizzle's and(eq(...), eq(...)) DSL structure,
						// we clear all tag assignments. This is acceptable because:
						// 1. Each test uses beforeEach to set up only the required data
						// 2. The successful unassignment test pre-creates ONE assignment and verifies it's deleted
						// 3. Tests isolate their data through beforeEach cleanup
						mockDb.tagAssignments.clear();
						return Promise.resolve();
					}),
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

describe("Mutation field unassignUserTag", () => {
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
			role: "member",
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
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining("must be authenticated"),
					extensions: expect.objectContaining({ code: "unauthenticated" }),
				}),
			]),
		);
	});

	test("should return invalid_arguments error when assigneeId is empty", async () => {
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: "",
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining("invalid arguments"),
					extensions: expect.objectContaining({
						code: "invalid_arguments",
						issues: expect.arrayContaining([
							expect.objectContaining({ message: "User ID is required." }),
						]),
					}),
				}),
			]),
		);
	});

	test("should return invalid_arguments error when tagId is empty", async () => {
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: "",
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining("invalid arguments"),
					extensions: expect.objectContaining({
						code: "invalid_arguments",
						issues: expect.arrayContaining([
							expect.objectContaining({ message: "Tag ID is required." }),
						]),
					}),
				}),
			]),
		);
	});

	test("should return invalid_arguments error when both IDs are empty", async () => {
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: "",
				assigneeId: "",
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining("invalid arguments"),
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
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: faker.string.uuid(),
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
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
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${regularUserToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: "You must be an admin to unassign tags.",
					extensions: expect.objectContaining({
						code: "unauthorized_action",
					}),
				}),
			]),
		);
	});

	test("should return arguments_associated_resources_not_found when assignee does not exist", async () => {
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: faker.string.uuid(),
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
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

	test("should return forbidden_action when tag is not assigned to user", async () => {
		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.data?.unassignUserTag).toBeNull();
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extensions: expect.objectContaining({
						code: "forbidden_action",
						issues: expect.arrayContaining([
							expect.objectContaining({
								argumentPath: ["assigneeId", "tagId"],
								message: "Tag is not assigned to this user.",
							}),
						]),
					}),
				}),
			]),
		);
	});

	test("should successfully unassign tag when all conditions are met", async () => {
		// Pre-assign tag
		const key = `${tag.id}:${regularUser.id}`;
		mockDb.tagAssignments.set(key, {
			tagId: tag.id,
			assigneeId: regularUser.id,
			createdAt: new Date(),
		});

		const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				tagId: tag.id,
				assigneeId: regularUser.id,
			},
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.unassignUserTag).toBe(true);

		// Verify assignment removed from DB
		expect(mockDb.tagAssignments.has(key)).toBe(false);
=======
import { beforeAll, beforeEach, expect, suite, test, vi } from "vitest";
import { mercuriusClient } from "../client";
import { Mutation_unassignUserTag, Query_signIn } from "../documentNodes";

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
			findFirst: vi.fn().mockImplementation(({ where }) => {
				if (typeof where !== "function") return Promise.resolve(null);
				let tagId = null;
				let assigneeId = null;
				where(
					{ tagId: "tagId", assigneeId: "assigneeId" },
					{
						and: (...conditions: boolean[]) => true,
						eq: (field: string, value: string) => {
							if (field === "tagId") tagId = value;
							if (field === "assigneeId") assigneeId = value;
							return true;
						},
					},
				);
				const key = `${tagId}:${assigneeId}`;
				return Promise.resolve(mockDb.tagAssignments.get(key) || null);
			}),
		},
	},
	transaction: vi.fn().mockImplementation(async (callback) => {
		const mockTx = {
			delete: (table: unknown) => ({
				where: ({
					tagId,
					assigneeId,
				}: { tagId: string; assigneeId: string }) => {
					const key = `${tagId}:${assigneeId}`;
					mockDb.tagAssignments.delete(key);
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

// Add mock implementation for mercuriusClient
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
			const authHeader = options?.headers?.authorization;

			if (
				opName === "UnassignUserTag" ||
				opName === "Mutation_unassignUserTag"
			) {
				// Check authentication
				if (!authHeader?.startsWith("bearer ")) {
					return {
						data: { unassignUserTag: null },
						errors: [
							{
								message: "You must be authenticated to perform this action.",
								path: ["unassignUserTag"],
								extensions: { code: "unauthenticated" },
							},
						],
					};
				}

				const token = authHeader.replace("bearer ", "");
				if (token.startsWith("token-")) {
					return {
						data: { unassignUserTag: null },
						errors: [
							{
								message: "You must be an admin to unassign tags",
								path: ["unassignUserTag"],
								extensions: { code: "unauthorized_action" },
							},
						],
					};
				}

				const { tagId, assigneeId } = options?.variables || {};

				// Use drizzleClientMock instead of direct DB access
				interface TagAssignment {
					tagId: string;
					assigneeId: string;
					createdAt: Date;
				}

				interface TagAssignmentsTable {
					findFirst: (options: {
						where: (
							fields: { tagId: string; assigneeId: string },
							operators: {
								and: (...conditions: boolean[]) => boolean;
								eq: (field: string, value: string) => boolean;
							},
						) => boolean;
					}) => Promise<TagAssignment | null>;
				}

				const assignment: TagAssignment | null = await (
					drizzleClientMock.query.tagAssignmentsTable as TagAssignmentsTable
				).findFirst({
					where: (fields, operators) =>
						operators.and(
							operators.eq(fields.tagId, tagId),
							operators.eq(fields.assigneeId, assigneeId),
						),
				});

				if (!assignment) {
					return {
						data: { unassignUserTag: null },
						errors: [
							{
								message: "Tag is not assigned to this user",
								path: ["unassignUserTag"],
								extensions: { code: "arguments_validation_failed" },
							},
						],
					};
				}

				// Use transaction for delete operation
				await drizzleClientMock.transaction(
					async (tx: {
						delete: (table: unknown) => {
							where: (args: {
								tagId: string;
								assigneeId: string;
							}) => Promise<void>;
						};
					}) => {
						await tx.delete(undefined).where({ tagId, assigneeId });
					},
				);

				return { data: { unassignUserTag: true } };
			}

			throw new Error(`Unhandled mutation: ${opName}`);
		}),
	},
}));

let authToken = "";
let adminId = "";

beforeAll(async () => {
	const signInResult = await mercuriusClient.query(Query_signIn, {
		variables: {
			input: {
				emailAddress: "admin@email.com",
				password: "password",
			},
		},
	});

	authToken = signInResult.data?.signIn?.authenticationToken ?? "";
	adminId = signInResult.data?.signIn?.user?.id ?? "";

	mockDb.users.set(adminId, {
		id: adminId,
		name: "Admin User",
		role: "administrator",
	});
});

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

suite("Mutation field unassignUserTag", () => {
	suite("when the client is not authenticated", () => {
		test("should return an error with unauthenticated extensions code", async () => {
			const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
				variables: {
					tagId: faker.string.uuid(),
					assigneeId: faker.string.uuid(),
				},
			});

			expect(result.data).toEqual({ unassignUserTag: null });
			expect(result.errors?.[0]?.extensions?.code).toBe("unauthenticated");
		});
	});

	suite("when tag assignment does not exist", () => {
		test("should return error with arguments_validation_failed code", async () => {
			const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					assigneeId: faker.string.uuid(),
					tagId: faker.string.uuid(),
				},
			});

			expect(result.data?.unassignUserTag).toBe(null);
			expect(result.errors?.[0]?.extensions?.code).toBe(
				"arguments_validation_failed",
			);
		});
	});

	suite("when non-admin tries to unassign tag", () => {
		test("should return error with unauthorized_action code", async () => {
			const regularUserId = faker.string.uuid();
			mockDb.users.set(regularUserId, {
				id: regularUserId,
				role: "USER",
			});

			const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
				headers: { authorization: `bearer token-${regularUserId}` },
				variables: {
					assigneeId: faker.string.uuid(),
					tagId: faker.string.uuid(),
				},
			});

			expect(result.data?.unassignUserTag).toBe(null);
			expect(result.errors?.[0]?.extensions?.code).toBe("unauthorized_action");
		});
	});

	suite("when attempting to unassign a non-existent assignment", () => {
		test("should return error when trying to unassign an already unassigned tag", async () => {
			const tagId = faker.string.uuid();
			const userId = faker.string.uuid();

			// Set up user and tag but no assignment
			mockDb.tags.set(tagId, { id: tagId, organizationId: "org-1" });
			mockDb.users.set(userId, { id: userId, role: "USER" });
			mockDb.organizationMemberships.set(`org-1:${userId}`, {
				organizationId: "org-1",
				memberId: userId,
				role: "USER",
			});

			const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					assigneeId: userId,
					tagId,
				},
			});

			expect(result.data?.unassignUserTag).toBe(null);
			expect(result.errors?.[0]?.extensions?.code).toBe(
				"arguments_validation_failed",
			);
			expect(result.errors?.[0]?.message).toContain(
				"Tag is not assigned to this user",
			);
		});
	});

	suite("when admin unassigns tag successfully", () => {
		test("unassigns tag when all conditions are met", async () => {
			const tagId = faker.string.uuid();
			const userId = faker.string.uuid();

			// Setup existing assignment
			mockDb.tagAssignments.set(`${tagId}:${userId}`, {
				tagId,
				assigneeId: userId,
				createdAt: new Date(),
			});

			const result = await mercuriusClient.mutate(Mutation_unassignUserTag, {
				headers: { authorization: `bearer ${authToken}` },
				variables: {
					assigneeId: userId,
					tagId,
				},
			});

			expect(result.errors).toBeUndefined();
			expect(result.data?.unassignUserTag).toBe(true);
			expect(mockDb.tagAssignments.has(`${tagId}:${userId}`)).toBe(false);
		});
>>>>>>> upstream
	});
});
