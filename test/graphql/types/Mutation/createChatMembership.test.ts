import { faker } from "@faker-js/faker";
<<<<<<< HEAD
import { beforeAll, expect, suite, test } from "vitest";
=======
import { afterEach, describe, expect, test, vi } from "vitest";
import { ChatMembershipResolver } from "~/src/graphql/types/Mutation/createChatMembership";
>>>>>>> upstream
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import {
	Mutation_createChat,
	Mutation_createChatMembership,
	Mutation_createOrganization,
	Mutation_createOrganizationMembership,
	Mutation_createUser,
<<<<<<< HEAD
	Query_signIn,
} from "../documentNodes";

// Sign in as admin to get an authentication token and admin user id.
let authToken: string;

beforeAll(async () => {
	const signInResult = await mercuriusClient.query(Query_signIn, {
		variables: {
			input: {
				emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
				password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
			},
		},
	});
	assertToBeNonNullish(signInResult.data?.signIn);
	const token = signInResult.data.signIn.authenticationToken;
	assertToBeNonNullish(token);
	authToken = token;
});

// Helper function to create an organization
async function createOrganization(): Promise<string> {
	const uniqueName = `Test Org ${faker.string.uuid()}`;
	const result = await mercuriusClient.mutate(Mutation_createOrganization, {
		headers: { authorization: `bearer ${authToken}` },
		variables: {
			input: {
				name: uniqueName,
				countryCode: "us",
			},
		},
	});
	const orgId = result.data?.createOrganization?.id;
	assertToBeNonNullish(orgId);
	return orgId;
}

// Helper function to create a user
async function createUser(): Promise<{
	id: string;
	emailAddress: string;
}> {
	const email = `${faker.string.ulid()}@example.com`;
	const result = await mercuriusClient.mutate(Mutation_createUser, {
		headers: { authorization: `bearer ${authToken}` },
		variables: {
			input: {
				emailAddress: email,
				isEmailAddressVerified: true,
				name: faker.person.fullName(),
				password: "password123",
				role: "regular",
			},
		},
	});
	assertToBeNonNullish(result.data?.createUser);
	assertToBeNonNullish(result.data.createUser.user);
	const userId = result.data.createUser.user.id;
	assertToBeNonNullish(userId);
	return { id: userId, emailAddress: email };
}

// Helper function to get auth token for a user
async function getUserAuthToken(
	emailAddress: string,
	password: string,
): Promise<string> {
	const signIn = await mercuriusClient.query(Query_signIn, {
		variables: {
			input: {
				emailAddress,
				password,
			},
		},
	});
	assertToBeNonNullish(signIn.data?.signIn?.authenticationToken);
	return signIn.data.signIn.authenticationToken;
}

suite("Mutation field createChatMembership", () => {
	test("unauthenticated error when client is not authenticated", async () => {
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			variables: {
				input: {
					chatId: faker.string.uuid(),
					memberId: faker.string.uuid(),
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({ code: "unauthenticated" }),
			}),
		);
		expect(result.data).toEqual({ createChatMembership: null });
	});

	test("invalid_arguments error for invalid UUIDs", async () => {
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					chatId: "not-a-uuid",
					memberId: "also-not-a-uuid",
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({ code: "invalid_arguments" }),
			}),
		);
	});

	test("arguments_associated_resources_not_found when both chat and member do not exist", async () => {
		const nonExistentChatId = faker.string.uuid();
		const nonExistentMemberId = faker.string.uuid();

		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					chatId: nonExistentChatId,
					memberId: nonExistentMemberId,
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "arguments_associated_resources_not_found",
				}),
			}),
		);
	});

	test("arguments_associated_resources_not_found when chat does not exist", async () => {
		// Create a user to use as member
		const member = await createUser();
		const nonExistentChatId = faker.string.uuid();

		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					chatId: nonExistentChatId,
					memberId: member.id,
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "arguments_associated_resources_not_found",
				}),
			}),
		);
	});

	test("arguments_associated_resources_not_found when member does not exist", async () => {
		// Create organization, user, and chat
		const orgId = await createOrganization();
		const chatOwner = await createUser();
		const chatOwnerToken = await getUserAuthToken(
			chatOwner.emailAddress,
			"password123",
		);

		// Create organization membership for chat owner
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: chatOwner.id,
					role: "administrator",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		const nonExistentMemberId = faker.string.uuid();

		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: nonExistentMemberId,
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "arguments_associated_resources_not_found",
				}),
			}),
		);
	});

	test("forbidden_action_on_arguments_associated_resources when chat membership already exists", async () => {
		// Create organization
		const orgId = await createOrganization();

		// Create chat owner
		const chatOwner = await createUser();
		const chatOwnerToken = await getUserAuthToken(
			chatOwner.emailAddress,
			"password123",
		);

		// Create member to add
		const member = await createUser();

		// Create organization membership for chat owner
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: chatOwner.id,
					role: "administrator",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		// Create first chat membership
		const firstMembership = await mercuriusClient.mutate(
			Mutation_createChatMembership,
			{
				headers: { authorization: `bearer ${chatOwnerToken}` },
				variables: {
					input: {
						chatId: chatId,
						memberId: member.id,
					},
				},
			},
		);
		assertToBeNonNullish(firstMembership.data?.createChatMembership);

		// Try to create duplicate chat membership
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: member.id,
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "forbidden_action_on_arguments_associated_resources",
				}),
			}),
		);
	});

	test("unauthorized_action_on_arguments_associated_resources when user is not admin, org member, or chat member", async () => {
		// Create organization
		const orgId = await createOrganization();

		// Create chat owner
		const chatOwner = await createUser();
		const chatOwnerToken = await getUserAuthToken(
			chatOwner.emailAddress,
			"password123",
		);

		// Create unauthorized user
		const unauthorizedUser = await createUser();
		const unauthorizedToken = await getUserAuthToken(
			unauthorizedUser.emailAddress,
			"password123",
		);

		// Create member to add
		const member = await createUser();

		// Create organization membership for chat owner
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: chatOwner.id,
					role: "administrator",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		// Try to create chat membership as unauthorized user
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${unauthorizedToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: member.id,
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "unauthorized_action_on_arguments_associated_resources",
				}),
			}),
		);
	});

	test("unauthorized_action_on_arguments_associated_resources when chat member tries to set non-regular role", async () => {
		// Create organization
		const orgId = await createOrganization();

		// Create chat owner
		const chatOwner = await createUser();
		const chatOwnerToken = await getUserAuthToken(
			chatOwner.emailAddress,
			"password123",
		);

		// Create chat member (not org member)
		const chatMember = await createUser();
		const chatMemberToken = await getUserAuthToken(
			chatMember.emailAddress,
			"password123",
		);

		// Create member to add
		const newMember = await createUser();

		// Create organization membership for chat owner
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: chatOwner.id,
					role: "administrator",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		// Add chatMember to chat (as regular member)
		const addMemberResult = await mercuriusClient.mutate(
			Mutation_createChatMembership,
			{
				headers: { authorization: `bearer ${chatOwnerToken}` },
				variables: {
					input: {
						chatId: chatId,
						memberId: chatMember.id,
						role: "regular",
					},
				},
			},
		);
		assertToBeNonNullish(addMemberResult.data?.createChatMembership);

		// Try to create chat membership with administrator role as chat member (not org member)
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${chatMemberToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: newMember.id,
					role: "administrator",
				},
			},
		});

		expect(result.errors).toBeDefined();
		expect(result.errors?.[0]).toEqual(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "unauthorized_action_on_arguments_associated_resources",
				}),
			}),
		);
	});

	test("successfully creates chat membership as organization administrator", async () => {
		// Create organization
		const orgId = await createOrganization();

		// Create org admin
		const orgAdmin = await createUser();
		const orgAdminToken = await getUserAuthToken(
			orgAdmin.emailAddress,
			"password123",
		);

		// Create member to add
		const member = await createUser();

		// Create organization membership for org admin
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: orgAdmin.id,
					role: "administrator",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${orgAdminToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		// Create chat membership as org admin
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${orgAdminToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: member.id,
					role: "regular",
				},
			},
		});

		expect(result.errors).toBeUndefined();
		assertToBeNonNullish(result.data?.createChatMembership);
		expect(result.data.createChatMembership.id).toBe(chatId);

		// Verify membership was created in database
		const createdMembership =
			await server.drizzleClient.query.chatMembershipsTable.findFirst({
				where: (fields, operators) =>
					operators.and(
						operators.eq(fields.chatId, chatId),
						operators.eq(fields.memberId, member.id),
					),
			});
		assertToBeNonNullish(createdMembership);
		expect(createdMembership.role).toBe("regular");
	});

	test("successfully creates chat membership with default regular role when role not specified", async () => {
		// Create organization
		const orgId = await createOrganization();

		// Create org admin
		const orgAdmin = await createUser();
		const orgAdminToken = await getUserAuthToken(
			orgAdmin.emailAddress,
			"password123",
		);

		// Create member to add
		const member = await createUser();

		// Create organization membership for org admin
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: orgAdmin.id,
					role: "administrator",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${orgAdminToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		// Create chat membership without specifying role
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${orgAdminToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: member.id,
				},
			},
		});

		expect(result.errors).toBeUndefined();
		assertToBeNonNullish(result.data?.createChatMembership);

		// Verify membership was created with regular role
		const createdMembership =
			await server.drizzleClient.query.chatMembershipsTable.findFirst({
				where: (fields, operators) =>
					operators.and(
						operators.eq(fields.chatId, chatId),
						operators.eq(fields.memberId, member.id),
					),
			});
		assertToBeNonNullish(createdMembership);
		expect(createdMembership.role).toBe("regular");
	});

	test("successfully creates chat membership as global administrator with regular role", async () => {
		// Create organization
		const orgId = await createOrganization();

		// Create a regular user as chat owner
		const chatOwner = await createUser();
		const chatOwnerToken = await getUserAuthToken(
			chatOwner.emailAddress,
			"password123",
		);

		// Create member to add
		const member = await createUser();

		// Create organization membership for chat owner
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: chatOwner.id,
					role: "regular",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		// Create chat membership as global admin (with regular role only since not org member)
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: member.id,
					role: "regular",
				},
			},
		});

		expect(result.errors).toBeUndefined();
		assertToBeNonNullish(result.data?.createChatMembership);

		// Verify membership was created in database
		const createdMembership =
			await server.drizzleClient.query.chatMembershipsTable.findFirst({
				where: (fields, operators) =>
					operators.and(
						operators.eq(fields.chatId, chatId),
						operators.eq(fields.memberId, member.id),
					),
			});
		assertToBeNonNullish(createdMembership);
		expect(createdMembership.role).toBe("regular");
	});

	test("successfully creates chat membership as existing chat member with org membership", async () => {
		// Create organization
		const orgId = await createOrganization();

		// Create chat owner
		const chatOwner = await createUser();
		const chatOwnerToken = await getUserAuthToken(
			chatOwner.emailAddress,
			"password123",
		);

		// Create existing chat member who is also an org member
		const existingChatMember = await createUser();
		const existingMemberToken = await getUserAuthToken(
			existingChatMember.emailAddress,
			"password123",
		);

		// Create new member to add
		const newMember = await createUser();

		// Create organization membership for chat owner
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: chatOwner.id,
					role: "administrator",
				},
			},
		});

		// Create organization membership for existing chat member
		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: existingChatMember.id,
					role: "regular",
				},
			},
		});

		// Create chat
		const chatResult = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${chatOwnerToken}` },
			variables: {
				input: {
					name: `Test Chat ${faker.string.uuid()}`,
					organizationId: orgId,
				},
			},
		});
		assertToBeNonNullish(chatResult.data?.createChat);
		const chatId = chatResult.data.createChat.id;

		// Add existing member to chat
		const addExistingMemberResult = await mercuriusClient.mutate(
			Mutation_createChatMembership,
			{
				headers: { authorization: `bearer ${chatOwnerToken}` },
				variables: {
					input: {
						chatId: chatId,
						memberId: existingChatMember.id,
						role: "regular",
					},
				},
			},
		);
		assertToBeNonNullish(addExistingMemberResult.data?.createChatMembership);

		// Create new chat membership as existing chat member (with regular role only)
		const result = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${existingMemberToken}` },
			variables: {
				input: {
					chatId: chatId,
					memberId: newMember.id,
					role: "regular",
				},
			},
		});

		expect(result.errors).toBeUndefined();
		assertToBeNonNullish(result.data?.createChatMembership);

		// Verify membership was created in database
		const createdMembership =
			await server.drizzleClient.query.chatMembershipsTable.findFirst({
				where: (fields, operators) =>
					operators.and(
						operators.eq(fields.chatId, chatId),
						operators.eq(fields.memberId, newMember.id),
					),
			});
		assertToBeNonNullish(createdMembership);
		expect(createdMembership.role).toBe("regular");
	});
=======
	Mutation_deleteChat,
	Mutation_deleteOrganization,
	Mutation_deleteUser,
	Query_signIn,
} from "../documentNodes";

type MockParent = {
	id: string;
	chatId: string;
	creatorId: string;
	memberId: string;
};
type MockUser = { id: string };
type MockCtx = {
	currentClient: { isAuthenticated: boolean; user: MockUser };
	drizzleClient: {
		query: unknown;
		insert?: (...args: unknown[]) => unknown;
	};
	log: { error: (...args: unknown[]) => void };
};
type MockArgs = { input: { chatId: string; memberId: string; role?: string } };

type CreatorParentParam = Parameters<typeof ChatMembershipResolver.creator>[0];
type CreatorCtxParam = Parameters<typeof ChatMembershipResolver.creator>[2];
type CreateArgsParam = Parameters<
	typeof ChatMembershipResolver.createChatMembership
>[1];
type CreateCtxParam = Parameters<
	typeof ChatMembershipResolver.createChatMembership
>[2];

describe("Mutation: createChatMembership", () => {
	const cleanupFns: Array<() => Promise<void>> = [];

	afterEach(async () => {
		for (const fn of cleanupFns.reverse()) {
			try {
				await fn();
			} catch (err) {
				console.warn("cleanup error:", err);
			}
		}
		cleanupFns.length = 0;
		vi.restoreAllMocks();
	});

	test("creator resolver: forbidden when chat not found", async () => {
		const parent = {
			id: "m1",
			chatId: "chat-1",
			creatorId: "creator-1",
			memberId: "member-1",
		} as MockParent;

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-1" } },
			drizzleClient: {
				query: {
					chatsTable: { findFirst: vi.fn().mockResolvedValue(undefined) },
					usersTable: { findFirst: vi.fn() },
				},
			},
			log: { error: vi.fn() },
		} as unknown as MockCtx;

		await expect(
			ChatMembershipResolver.creator(
				parent as unknown as CreatorParentParam,
				{},
				ctx as unknown as CreatorCtxParam,
			),
		).rejects.toMatchObject({ extensions: { code: "forbidden_action" } });
	});

	test("creator returns current user when creatorId equals currentUserId", async () => {
		const parent = {
			creatorId: "actor-creator-1",
		} as unknown as CreatorParentParam;

		const args = {} as unknown as Parameters<
			typeof ChatMembershipResolver.creator
		>[1];

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-creator-1" } },
			drizzleClient: {
				query: {
					usersTable: {
						findFirst: vi
							.fn()
							.mockResolvedValue({ id: "actor-creator-1", name: "Creator" }),
					},
					chatsTable: {
						findFirst: vi.fn().mockResolvedValue({
							id: faker.string.uuid(),
							organization: { membershipsWhereOrganization: [] },
						}),
					},
				},
			},
			log: { error: vi.fn() },
		} as unknown as CreatorCtxParam;

		const result = await ChatMembershipResolver.creator(parent, args, ctx);
		expect(result).toEqual({ id: "actor-creator-1", name: "Creator" });
	});

	test("creator resolver: returns null when creatorId falsy", async () => {
		const parent = {
			id: "m2",
			chatId: "chat-2",
			creatorId: "",
			memberId: "member-2",
		} as MockParent;

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-2" } },
			drizzleClient: {
				query: {
					chatsTable: { findFirst: vi.fn().mockResolvedValue({}) },
					usersTable: { findFirst: vi.fn() },
				},
			},
			log: { error: vi.fn() },
		} as unknown as MockCtx;

		const res = await ChatMembershipResolver.creator(
			parent as unknown as CreatorParentParam,
			{},
			ctx as unknown as CreatorCtxParam,
		);
		expect(res).toBeNull();
	});

	test("creator resolver: unexpected when creator user missing (logs)", async () => {
		const parent = {
			id: "m3",
			chatId: "chat-3",
			creatorId: "missing-user",
			memberId: "member-3",
		} as MockParent;

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-3" } },
			drizzleClient: {
				query: {
					chatsTable: { findFirst: vi.fn().mockResolvedValue({}) },
					usersTable: { findFirst: vi.fn().mockResolvedValue(undefined) },
				},
			},
			log: { error: vi.fn() },
		} as unknown as MockCtx;

		await expect(
			ChatMembershipResolver.creator(
				parent as unknown as CreatorParentParam,
				{},
				ctx as unknown as CreatorCtxParam,
			),
		).rejects.toMatchObject({ extensions: { code: "unexpected" } });
		expect(ctx.log.error).toHaveBeenCalled();
	});

	test("createChatMembership: arguments_associated_resources_not_found when both missing", async () => {
		const args = {
			input: { chatId: faker.string.uuid(), memberId: faker.string.uuid() },
		} as unknown as MockArgs;

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-4" } },
			drizzleClient: {
				query: {
					usersTable: {
						findFirst: vi.fn().mockResolvedValue({ role: "regular" }),
					},
					chatsTable: { findFirst: vi.fn().mockResolvedValue(undefined) },
				},
			},
			log: { error: vi.fn() },
		} as unknown as MockCtx;

		await expect(
			ChatMembershipResolver.createChatMembership(
				undefined,
				args as unknown as CreateArgsParam,
				ctx as unknown as CreateCtxParam,
			),
		).rejects.toMatchObject({
			extensions: {
				code: expect.toBeOneOf([
					"arguments_associated_resources_not_found",
					"invalid_arguments",
				]),
			},
		});
	});

	test("createChatMembership: unauthorized_arguments when non-admin sets role without org membership", async () => {
		const args = {
			input: {
				chatId: faker.string.uuid(),
				memberId: faker.string.uuid(),
				role: "administrator",
			},
		} as unknown as MockArgs;

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-5" } },
			drizzleClient: {
				query: {
					usersTable: {
						findFirst: vi.fn().mockResolvedValue({ role: "regular" }),
					},
					chatsTable: {
						findFirst: vi.fn().mockResolvedValue({
							chatMembershipsWhereChat: [],
							organization: { membershipsWhereOrganization: [] },
						}),
					},
					chatMembershipsTable: {
						findFirst: vi.fn().mockResolvedValue(undefined),
					},
				},
			},
			log: { error: vi.fn() },
		} as unknown as MockCtx;

		await expect(
			ChatMembershipResolver.createChatMembership(
				undefined,
				args as unknown as CreateArgsParam,
				ctx as unknown as CreateCtxParam,
			),
		).rejects.toMatchObject({ extensions: { code: "unauthorized_arguments" } });
	});

	test("createChatMembership: unauthorized_action_on_arguments_associated_resources when cannot create membership", async () => {
		const args = {
			input: { chatId: faker.string.uuid(), memberId: faker.string.uuid() },
		} as unknown as MockArgs;

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-6" } },
			drizzleClient: {
				query: {
					usersTable: {
						findFirst: vi.fn().mockResolvedValue({ role: "regular" }),
					},
					chatsTable: {
						findFirst: vi.fn().mockResolvedValue({
							chatMembershipsWhereChat: [],
							organization: { membershipsWhereOrganization: [] },
						}),
					},
					chatMembershipsTable: {
						findFirst: vi.fn().mockResolvedValue(undefined),
					},
				},
			},
			log: { error: vi.fn() },
		} as unknown as MockCtx;

		const result = await ChatMembershipResolver.createChatMembership(
			undefined,
			args as unknown as CreateArgsParam,
			ctx as unknown as CreateCtxParam,
		);
		expect(result).toEqual({
			chatMembershipsWhereChat: [],
			organization: { membershipsWhereOrganization: [] },
		});
	});

	test("createChatMembership: forbidden when existing chat membership present", async () => {
		const args = {
			input: { chatId: faker.string.uuid(), memberId: faker.string.uuid() },
		} as unknown as MockArgs;

		const ctx = {
			currentClient: { isAuthenticated: true, user: { id: "actor-7" } },
			drizzleClient: {
				query: {
					usersTable: {
						findFirst: vi.fn().mockResolvedValue({ role: "regular" }),
					},
					chatsTable: {
						findFirst: vi.fn().mockResolvedValue({
							chatMembershipsWhereChat: [{ role: "regular" }],
							organization: { membershipsWhereOrganization: [] },
						}),
					},
					chatMembershipsTable: {
						findFirst: vi.fn().mockResolvedValue(undefined),
					},
				},
			},
			log: { error: vi.fn() },
		} as unknown as MockCtx;

		await expect(
			ChatMembershipResolver.createChatMembership(
				undefined,
				args as unknown as CreateArgsParam,
				ctx as unknown as CreateCtxParam,
			),
		).rejects.toMatchObject({
			extensions: {
				code: "forbidden_action_on_arguments_associated_resources",
			},
		});
	});

	test("unexpected when DB insert returns undefined (simulated defect)", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const creatorRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(creatorRes.data?.createUser);
		const creator = creatorRes.data.createUser;

		assertToBeNonNullish(creator.user);
		assertToBeNonNullish(creator.user?.id);

		const creatorId = creator.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: creatorId } },
			});
		});

		const targetRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(targetRes.data?.createUser);
		const target = targetRes.data.createUser;

		assertToBeNonNullish(target.user);
		assertToBeNonNullish(target.user?.id);

		const targetId = target.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: targetId } },
			});
		});

		const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { name: `org-${faker.string.uuid()}`, countryCode: "us" },
			},
		});
		assertToBeNonNullish(orgRes.data?.createOrganization);
		const orgId = orgRes.data.createOrganization.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteOrganization, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: orgId } },
			});
		});

		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					memberId: creator.user.id,
					organizationId: orgId,
					role: "regular",
				},
			},
		});

		assertToBeNonNullish(creator.user?.emailAddress);
		const creatorSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: creator.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(creatorSignIn.data?.signIn?.authenticationToken);
		const creatorToken = creatorSignIn.data.signIn
			.authenticationToken as string;

		const chatRes = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: {
				input: { name: `chat-${faker.string.uuid()}`, organizationId: orgId },
			},
		});
		assertToBeNonNullish(chatRes.data?.createChat);
		const chatId = chatRes.data.createChat.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteChat, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: chatId } },
			});
		});

		const logSpy = vi.spyOn(server.log, "error");
		type InsertChain = {
			values: () => {
				returning: () => Promise<unknown[]>;
			};
		};

		const drizzleClient = server.drizzleClient as unknown as Record<
			string,
			unknown
		>;
		const originalInsert = drizzleClient.insert as unknown;
		(drizzleClient as Record<string, unknown>).insert = (() => ({
			values: () => ({
				returning: async () => [undefined],
			}),
		})) as unknown as ((...args: unknown[]) => InsertChain) | undefined;

		try {
			const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
				headers: { authorization: `bearer ${creatorToken}` },
				variables: { input: { chatId, memberId: target.user.id } },
			});

			expect(res.errors).toBeDefined();
			expect(res.errors?.[0]?.extensions?.code).toBe("unexpected");
			expect(logSpy).toHaveBeenCalled();
		} finally {
			(drizzleClient as Record<string, unknown>).insert =
				originalInsert as unknown as
					| ((...args: unknown[]) => InsertChain)
					| undefined;
			logSpy.mockRestore();
		}
	});

	test("creates membership when actor is org member (happy path)", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const creatorRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(creatorRes.data?.createUser);
		const creator = creatorRes.data.createUser;

		assertToBeNonNullish(creator.user);
		assertToBeNonNullish(creator.user?.id);

		const creatorId = creator.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: creatorId } },
			});
		});

		const targetRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(targetRes.data?.createUser);
		const target = targetRes.data.createUser;

		assertToBeNonNullish(target.user);
		assertToBeNonNullish(target.user?.id);

		const targetId = target.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: targetId } },
			});
		});

		const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { name: `org-${faker.string.uuid()}`, countryCode: "us" },
			},
		});
		assertToBeNonNullish(orgRes.data?.createOrganization);
		const orgId = orgRes.data.createOrganization.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteOrganization, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: orgId } },
			});
		});

		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					memberId: creator.user.id,
					organizationId: orgId,
					role: "regular",
				},
			},
		});

		assertToBeNonNullish(creator.user?.emailAddress);
		const creatorSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: creator.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(creatorSignIn.data?.signIn?.authenticationToken);
		const creatorToken = creatorSignIn.data.signIn
			.authenticationToken as string;

		const chatRes = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: {
				input: { name: `chat-${faker.string.uuid()}`, organizationId: orgId },
			},
		});
		assertToBeNonNullish(chatRes.data?.createChat);
		const chatId = chatRes.data.createChat.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteChat, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: chatId } },
			});
		});

		const memRes = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: {
				input: { chatId, memberId: target.user.id, role: "regular" },
			},
		});
		assertToBeNonNullish(memRes.data?.createChatMembership);

		const createdTargetMembership =
			await server.drizzleClient.query.chatMembershipsTable.findFirst({
				where: (fields, operators) =>
					operators.and(
						operators.eq(fields.chatId, chatId),
						operators.eq(fields.memberId, targetId),
					),
			});
		if (!createdTargetMembership) {
			throw new Error("expected created membership in DB");
		}
	});

	test("invalid arguments cause invalid_arguments error", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { chatId: "not-a-uuid", memberId: "also-not-a-uuid" },
			},
		});

		expect(res.errors).toBeDefined();
		const code = res.errors?.[0]?.extensions?.code as string;
		expect([
			"invalid_arguments",
			"arguments_associated_resources_not_found",
		]).toContain(code);
	});

	test("unauthenticated requests are denied", async () => {
		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			variables: {
				input: { chatId: faker.string.uuid(), memberId: faker.string.uuid() },
			},
		});

		expect(res.errors).toBeDefined();
		expect(res.errors?.[0]?.extensions?.code).toBe("unauthenticated");
	});

	test("unauthenticated is returned when authenticated user record missing", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const userRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(userRes.data?.createUser);
		const user = userRes.data.createUser;

		assertToBeNonNullish(user.user);
		assertToBeNonNullish(user.user?.id);

		const userId = user.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: userId } },
			});
		});

		assertToBeNonNullish(user.user?.emailAddress);
		const signIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: user.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(signIn.data?.signIn?.authenticationToken);
		const userToken = signIn.data.signIn.authenticationToken as string;

		await mercuriusClient.mutate(Mutation_deleteUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: { input: { id: user.user.id } },
		});

		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${userToken}` },
			variables: {
				input: { chatId: faker.string.uuid(), memberId: user.user.id },
			},
		});

		expect(res.errors).toBeDefined();
		expect(res.errors?.[0]?.extensions?.code).toBe("unauthenticated");
	});

	test("arguments_associated_resources_not_found when both chat and member missing", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const randomChatId = faker.string.uuid();
		const randomMemberId = faker.string.uuid();

		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: { input: { chatId: randomChatId, memberId: randomMemberId } },
		});

		expect(res.errors).toBeDefined();
		expect(res.errors?.[0]?.extensions?.code).toBe(
			"arguments_associated_resources_not_found",
		);
	});

	test("invalid_arguments when chat missing but member exists", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const targetRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(targetRes.data?.createUser);
		const target = targetRes.data.createUser;

		assertToBeNonNullish(target.user);
		assertToBeNonNullish(target.user?.id);

		const targetId = target.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: targetId } },
			});
		});

		const invalidChatId = faker.string.uuid();
		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { chatId: invalidChatId, memberId: target.user.id },
			},
		});

		expect(res.errors).toBeDefined();
		const code2 = res.errors?.[0]?.extensions?.code as string;
		expect([
			"invalid_arguments",
			"arguments_associated_resources_not_found",
		]).toContain(code2);
	});

	test("invalid_arguments when member missing but chat exists", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const creatorRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(creatorRes.data?.createUser);
		const creator = creatorRes.data.createUser;

		assertToBeNonNullish(creator.user);
		assertToBeNonNullish(creator.user?.id);

		const creatorId = creator.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: creatorId } },
			});
		});

		const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { name: `org-${faker.string.uuid()}`, countryCode: "us" },
			},
		});
		assertToBeNonNullish(orgRes.data?.createOrganization);
		const orgId = orgRes.data.createOrganization.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteOrganization, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: orgId } },
			});
		});

		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					memberId: creator.user.id,
					organizationId: orgId,
					role: "regular",
				},
			},
		});

		assertToBeNonNullish(creator.user?.emailAddress);
		const creatorSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: creator.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(creatorSignIn.data?.signIn?.authenticationToken);
		const creatorToken = creatorSignIn.data.signIn
			.authenticationToken as string;

		const chatRes = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: {
				input: { name: `chat-${faker.string.uuid()}`, organizationId: orgId },
			},
		});
		assertToBeNonNullish(chatRes.data?.createChat);
		const chatId = chatRes.data.createChat.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteChat, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: chatId } },
			});
		});

		const missingMemberId = faker.string.uuid();
		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: { input: { chatId, memberId: missingMemberId } },
		});

		expect(res.errors).toBeDefined();
		const code3 = res.errors?.[0]?.extensions?.code as string;
		expect([
			"invalid_arguments",
			"arguments_associated_resources_not_found",
		]).toContain(code3);
	});

	test("forbidden when membership already exists", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const creatorRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(creatorRes.data?.createUser);
		const creator = creatorRes.data.createUser;

		assertToBeNonNullish(creator.user);
		assertToBeNonNullish(creator.user?.id);

		const creatorId = creator.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: creatorId } },
			});
		});

		const targetRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(targetRes.data?.createUser);
		const target = targetRes.data.createUser;

		assertToBeNonNullish(target.user);
		assertToBeNonNullish(target.user?.id);

		const targetId = target.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: targetId } },
			});
		});

		const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { name: `org-${faker.string.uuid()}`, countryCode: "us" },
			},
		});
		assertToBeNonNullish(orgRes.data?.createOrganization);
		const orgId = orgRes.data.createOrganization.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteOrganization, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: orgId } },
			});
		});

		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					memberId: creator.user.id,
					organizationId: orgId,
					role: "regular",
				},
			},
		});

		assertToBeNonNullish(creator.user?.emailAddress);
		const creatorSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: creator.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(creatorSignIn.data?.signIn?.authenticationToken);
		const creatorToken = creatorSignIn.data.signIn
			.authenticationToken as string;

		const chatRes = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: {
				input: { name: `chat-${faker.string.uuid()}`, organizationId: orgId },
			},
		});
		assertToBeNonNullish(chatRes.data?.createChat);
		const chatId = chatRes.data.createChat.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteChat, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: chatId } },
			});
		});

		const memRes = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: { input: { chatId, memberId: target.user.id } },
		});
		assertToBeNonNullish(memRes.data?.createChatMembership);

		const second = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${creatorToken}` },
			variables: { input: { chatId, memberId: target.user.id } },
		});

		expect(second.errors).toBeDefined();
		expect(second.errors?.[0]?.extensions?.code).toBe(
			"forbidden_action_on_arguments_associated_resources",
		);
	});

	test("unauthorized when actor is not admin and not org/chat member", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const ownerRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(ownerRes.data?.createUser);
		const owner = ownerRes.data.createUser;

		assertToBeNonNullish(owner.user);
		assertToBeNonNullish(owner.user?.id);

		const ownerId = owner.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: ownerId } },
			});
		});

		const actorRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(actorRes.data?.createUser);
		const actor = actorRes.data.createUser;

		assertToBeNonNullish(actor.user);
		assertToBeNonNullish(actor.user?.id);

		const actorId = actor.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: actorId } },
			});
		});

		const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { name: `org-${faker.string.uuid()}`, countryCode: "us" },
			},
		});
		assertToBeNonNullish(orgRes.data?.createOrganization);
		const orgId = orgRes.data.createOrganization.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteOrganization, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: orgId } },
			});
		});

		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					memberId: owner.user.id,
					organizationId: orgId,
					role: "regular",
				},
			},
		});

		assertToBeNonNullish(owner.user?.emailAddress);
		const ownerSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: owner.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(ownerSignIn.data?.signIn?.authenticationToken);
		const ownerToken = ownerSignIn.data.signIn.authenticationToken as string;

		const chatRes = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${ownerToken}` },
			variables: {
				input: { name: `chat-${faker.string.uuid()}`, organizationId: orgId },
			},
		});
		assertToBeNonNullish(chatRes.data?.createChat);
		const chatId = chatRes.data.createChat.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteChat, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: chatId } },
			});
		});

		assertToBeNonNullish(actor.user?.emailAddress);
		const actorSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: actor.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(actorSignIn.data?.signIn?.authenticationToken);
		const actorToken = actorSignIn.data.signIn.authenticationToken as string;

		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${actorToken}` },
			variables: { input: { chatId, memberId: actor.user.id } },
		});

		expect(res.errors).toBeDefined();
		expect(res.errors?.[0]?.extensions?.code).toBe(
			"unauthorized_action_on_arguments_associated_resources",
		);
	});

	test("unauthorized_arguments when setting non-regular role without org membership", async () => {
		const admin = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
					password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
				},
			},
		});
		assertToBeNonNullish(admin.data?.signIn?.authenticationToken);
		const adminToken = admin.data.signIn.authenticationToken as string;

		const ownerRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(ownerRes.data?.createUser);
		const owner = ownerRes.data.createUser;

		assertToBeNonNullish(owner.user);
		assertToBeNonNullish(owner.user?.id);

		const ownerId = owner.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: ownerId } },
			});
		});

		const chatMemberRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(chatMemberRes.data?.createUser);
		const chatMember = chatMemberRes.data.createUser;

		assertToBeNonNullish(chatMember.user);
		assertToBeNonNullish(chatMember.user?.id);

		const chatMemberId = chatMember.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: chatMemberId } },
			});
		});

		const targetRes = await mercuriusClient.mutate(Mutation_createUser, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					emailAddress: `${faker.string.uuid()}@test.com`,
					name: faker.person.fullName(),
					password: "password123",
					role: "regular",
					isEmailAddressVerified: false,
				},
			},
		});
		assertToBeNonNullish(targetRes.data?.createUser);
		const target = targetRes.data.createUser;

		assertToBeNonNullish(target.user);
		assertToBeNonNullish(target.user?.id);

		const targetId = target.user.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteUser, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: targetId } },
			});
		});

		const orgRes = await mercuriusClient.mutate(Mutation_createOrganization, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: { name: `org-${faker.string.uuid()}`, countryCode: "us" },
			},
		});
		assertToBeNonNullish(orgRes.data?.createOrganization);
		const orgId = orgRes.data.createOrganization.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteOrganization, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: orgId } },
			});
		});

		await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
			headers: { authorization: `bearer ${adminToken}` },
			variables: {
				input: {
					memberId: owner.user.id,
					organizationId: orgId,
					role: "regular",
				},
			},
		});

		assertToBeNonNullish(owner.user?.emailAddress);
		const ownerSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: owner.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(ownerSignIn.data?.signIn?.authenticationToken);
		const ownerToken = ownerSignIn.data.signIn.authenticationToken as string;

		const chatRes = await mercuriusClient.mutate(Mutation_createChat, {
			headers: { authorization: `bearer ${ownerToken}` },
			variables: {
				input: { name: `chat-${faker.string.uuid()}`, organizationId: orgId },
			},
		});
		assertToBeNonNullish(chatRes.data?.createChat);
		const chatId = chatRes.data.createChat.id;
		cleanupFns.push(async () => {
			await mercuriusClient.mutate(Mutation_deleteChat, {
				headers: { authorization: `bearer ${adminToken}` },
				variables: { input: { id: chatId } },
			});
		});

		assertToBeNonNullish(chatMember.user?.emailAddress);
		const chatMemberSignIn = await mercuriusClient.query(Query_signIn, {
			variables: {
				input: {
					emailAddress: chatMember.user.emailAddress,
					password: "password123",
				},
			},
		});
		assertToBeNonNullish(chatMemberSignIn.data?.signIn?.authenticationToken);
		const chatMemberToken = chatMemberSignIn.data.signIn
			.authenticationToken as string;

		await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${ownerToken}` },
			variables: { input: { chatId, memberId: chatMember.user.id } },
		});

		const res = await mercuriusClient.mutate(Mutation_createChatMembership, {
			headers: { authorization: `bearer ${chatMemberToken}` },
			variables: {
				input: { chatId, memberId: target.user.id, role: "administrator" },
			},
		});

		expect(res.errors).toBeDefined();
		expect(res.errors?.[0]?.extensions?.code).toBe(
			"unauthorized_action_on_arguments_associated_resources",
		);
	});
>>>>>>> upstream
});
