import { createMockGraphQLContext } from "test/_Mocks_/mockContextCreator/mockContextCreator";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GraphQLContext } from "~/src/graphql/context";
import { homePhoneNumberResolver } from "~/src/graphql/types/User/homePhoneNumber";
import type { User as UserType } from "~/src/graphql/types/User/User";
import { faker } from "@faker-js/faker";

describe("User field homePhoneNumber resolver", () => {
	let ctx: GraphQLContext;
	let mocks: ReturnType<typeof createMockGraphQLContext>["mocks"];
	let parent: UserType;
	let currentUserId: string;

	beforeEach(() => {
		currentUserId = faker.string.ulid();

		const { context, mocks: newMocks } = createMockGraphQLContext(
			true,
			currentUserId,
		);

		ctx = context;
		mocks = newMocks;

		parent = {
			id: currentUserId,
			name: "Test User",
			homePhoneNumber: "+1-555-0100",
			role: "regular",
			createdAt: new Date(),
			updatedAt: null,
			creatorId: faker.string.ulid(),
			updaterId: null,
		} as UserType;
	});

	it("throws unauthenticated error when client is not authenticated", async () => {
		const { context: unauthCtx } = createMockGraphQLContext(false);

		await expect(
			homePhoneNumberResolver(parent, {}, unauthCtx),
		).rejects.toThrow(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "unauthenticated",
				}),
			}),
		);
	});

	it("throws unauthenticated error when authenticated user does not exist in database", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue(
			undefined,
		);

		await expect(homePhoneNumberResolver(parent, {}, ctx)).rejects.toThrow(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "unauthenticated",
				}),
			}),
		);
	});

	it("throws unauthorized_action when non-admin accesses another user's phone", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			role: "regular",
		});

		const anotherUser = {
			...parent,
			id: faker.string.ulid(),
		} as UserType;

		await expect(
			homePhoneNumberResolver(anotherUser, {}, ctx),
		).rejects.toThrow(
			expect.objectContaining({
				extensions: expect.objectContaining({
					code: "unauthorized_action",
				}),
			}),
		);
	});

	it("returns phone when user accesses their own phone", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			role: "regular",
		});

		const result = await homePhoneNumberResolver(parent, {}, ctx);

		expect(result).toBe("+1-555-0100");
	});

	it("returns phone when administrator accesses another user's phone", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			role: "administrator",
		});

		const anotherUser = {
			...parent,
			id: faker.string.ulid(),
			homePhoneNumber: "+1-555-0200",
		} as UserType;

		const result = await homePhoneNumberResolver(anotherUser, {}, ctx);

		expect(result).toBe("+1-555-0200");
	});

	it("returns null when homePhoneNumber is null", async () => {
		mocks.drizzleClient.query.usersTable.findFirst.mockResolvedValue({
			role: "regular",
		});

		const nullPhoneParent = {
			...parent,
			homePhoneNumber: null,
		} as UserType;

		const result = await homePhoneNumberResolver(
			nullPhoneParent,
			{},
			ctx,
		);

		expect(result).toBeNull();
	});

	it("rethrows error when drizzle findFirst rejects", async () => {
		const error = new Error("Database failure");

		mocks.drizzleClient.query.usersTable.findFirst.mockRejectedValue(
			error,
		);

		await expect(
			homePhoneNumberResolver(parent, {}, ctx),
		).rejects.toThrow(error);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});
});
