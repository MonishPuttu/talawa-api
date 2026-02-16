<<<<<<< HEAD
import { Buffer } from "node:buffer";
import { createMockGraphQLContext } from "test/_Mocks_/mockContextCreator/mockContextCreator";
import { beforeEach, describe, expect, it } from "vitest";
import type { GraphQLContext } from "~/src/graphql/context";
import type { AgendaFolder as AgendaFolderType } from "~/src/graphql/types/AgendaFolder/AgendaFolder";
import {
	itemsArgumentsSchema,
	resolveItems,
} from "~/src/graphql/types/AgendaFolder/items";

/**
 * IMPORTANT:
 * Cursor MUST match agendaItemsTableInsertSchema-derived cursorSchema
 */
function encodeValidCursor() {
	return Buffer.from(
		JSON.stringify({
			id: "550e8400-e29b-41d4-a716-446655440000",
			sequence: 1,
		}),
	).toString("base64url");
}

describe("itemsArgumentsSchema", () => {
	it("parses valid forward pagination cursor", () => {
		const result = itemsArgumentsSchema.safeParse({
			first: 5,
			after: encodeValidCursor(),
		});

		expect(result.success).toBe(true);

		if (result.success) {
			expect(result.data).toEqual({
				cursor: {
					id: expect.any(String),
					sequence: 1,
				},
				isInversed: false,
=======
import { faker } from "@faker-js/faker";
import { initGraphQLTada } from "gql.tada";
import { afterEach, describe, expect, it } from "vitest";
import type { ClientCustomScalars } from "~/src/graphql/scalars/index";
import { itemsArgumentsSchema } from "~/src/graphql/types/AgendaFolder/items";
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import {
	Mutation_createAgendaFolder,
	Mutation_createAgendaItem,
	Mutation_createEvent,
	Mutation_createOrganization,
	Mutation_createOrganizationMembership,
	Mutation_deleteAgendaItem,
	Mutation_deleteOrganization,
	Mutation_deleteStandaloneEvent,
	Query_signIn,
} from "../documentNodes";
import type { introspection } from "../gql.tada";

const gql = initGraphQLTada<{
	introspection: introspection;
	scalars: ClientCustomScalars;
}>();

// Local query to use AgendaFolder.items connection field
const Query_agendaFolder_items = gql(`
  query AgendaFolderItems($id: String!, $first: Int, $after: String, $last: Int, $before: String) {
    agendaFolder(input: { id: $id }) {
      id
      items(first: $first, after: $after, last: $last, before: $before) {
        edges {
          cursor
          node {
            id
            name
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`);

type AdminAuth = { token: string; userId: string };
async function getAdminAuth(): Promise<AdminAuth> {
	const signInResult = await mercuriusClient.query(Query_signIn, {
		variables: {
			input: {
				emailAddress: server.envConfig.API_ADMINISTRATOR_USER_EMAIL_ADDRESS,
				password: server.envConfig.API_ADMINISTRATOR_USER_PASSWORD,
			},
		},
	});
	assertToBeNonNullish(signInResult.data?.signIn?.authenticationToken);
	assertToBeNonNullish(signInResult.data?.signIn?.user);
	return {
		token: signInResult.data.signIn.authenticationToken,
		userId: signInResult.data.signIn.user.id,
	};
}

async function createOrgEventFolder(authToken: string, adminUserId: string) {
	const orgResult = await mercuriusClient.mutate(Mutation_createOrganization, {
		headers: { authorization: `bearer ${authToken}` },
		variables: {
			input: {
				name: `Org ${faker.string.uuid()}`,
				countryCode: "us",
			},
		},
	});
	assertToBeNonNullish(orgResult.data?.createOrganization?.id);
	const orgId = orgResult.data.createOrganization.id as string;

	// Ensure admin is a member of the organization to be authorized for event creation
	// Create organization membership for admin as administrator
	// Reuse existing test helper pattern
	const membership = await mercuriusClient.mutate(
		Mutation_createOrganizationMembership,
		{
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					organizationId: orgId,
					memberId: adminUserId,
					role: "administrator",
				},
			},
		},
	);
	assertToBeNonNullish(membership.data?.createOrganizationMembership?.id);

	const eventResult = await mercuriusClient.mutate(Mutation_createEvent, {
		headers: { authorization: `bearer ${authToken}` },
		variables: {
			input: {
				name: `Event ${faker.string.uuid()}`,
				organizationId: orgId,
				startAt: new Date().toISOString(),
				endAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
				description: "Test event",
			},
		},
	});
	assertToBeNonNullish(eventResult.data?.createEvent?.id);
	const eventId = eventResult.data.createEvent.id as string;

	const folderResult = await mercuriusClient.mutate(
		Mutation_createAgendaFolder,
		{
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					name: `Folder ${faker.string.uuid()}`,
					eventId,
					isAgendaItemFolder: true,
				},
			},
		},
	);
	assertToBeNonNullish(folderResult.data?.createAgendaFolder?.id);
	const folderId = folderResult.data.createAgendaFolder.id as string;

	return { orgId, eventId, folderId };
}

async function createItems(
	authToken: string,
	folderId: string,
	names: string[],
) {
	const createdIds: string[] = [];
	for (const name of names) {
		const res = await mercuriusClient.mutate(Mutation_createAgendaItem, {
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					name,
					folderId,
					type: "general",
					duration: "15m",
					description: `${name} description`,
				},
			},
		});
		assertToBeNonNullish(res.data?.createAgendaItem?.id);
		createdIds.push(res.data.createAgendaItem.id as string);
	}
	return createdIds;
}

async function cleanup(
	authToken: string,
	{
		orgId,
		eventId,
		itemIds,
	}: { orgId: string; eventId: string; itemIds: string[] },
) {
	for (const id of itemIds) {
		try {
			await mercuriusClient.mutate(Mutation_deleteAgendaItem, {
				headers: { authorization: `bearer ${authToken}` },
				variables: { input: { id } },
			});
		} catch {}
	}
	try {
		await mercuriusClient.mutate(Mutation_deleteStandaloneEvent, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { input: { id: eventId } },
		});
	} catch {}
	try {
		await mercuriusClient.mutate(Mutation_deleteOrganization, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { input: { id: orgId } },
		});
	} catch {}
}

function encodeCursor(obj: { id: string; name: string }) {
	return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function decodeCursor(cursor: string): { id: string; name: string } {
	return JSON.parse(Buffer.from(cursor, "base64url").toString("utf-8"));
}

describe("Testing AgendaFolder/items - itemsArgumentsSchema", () => {
	it("parses valid after cursor (first/after)", () => {
		const validCursor = {
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Item A",
		};
		const encoded = Buffer.from(JSON.stringify(validCursor)).toString(
			"base64url",
		);

		const result = itemsArgumentsSchema.safeParse({
			first: 10,
			after: encoded,
			before: null,
			last: null,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({
				cursor: validCursor,
				isInversed: false,
				// first + 1
				limit: 11,
			});
		}
	});

	it("parses valid before cursor (last/before)", () => {
		const validCursor = {
			id: "550e8400-e29b-41d4-a716-446655440001",
			name: "Item B",
		};
		const encoded = Buffer.from(JSON.stringify(validCursor)).toString(
			"base64url",
		);

		const result = itemsArgumentsSchema.safeParse({
			last: 5,
			before: encoded,
			first: null,
			after: null,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({
				cursor: validCursor,
				isInversed: true,
				// last + 1
>>>>>>> upstream
				limit: 6,
			});
		}
	});

<<<<<<< HEAD
	it("parses valid backward pagination cursor", () => {
		const result = itemsArgumentsSchema.safeParse({
			last: 3,
			before: encodeValidCursor(),
		});

		expect(result.success).toBe(true);

		if (result.success) {
			expect(result.data).toEqual({
				cursor: {
					id: expect.any(String),
					sequence: 1,
				},
				isInversed: true,
				limit: 4,
			});
		}
	});

	it("fails with custom issue for invalid backward cursor", () => {
		const result = itemsArgumentsSchema.safeParse({
			last: 2,
			before: "not-a-valid-cursor",
		});

		expect(result.success).toBe(false);

=======
	it("reports custom issue for invalid 'after' cursor when using first/after", () => {
		const result = itemsArgumentsSchema.safeParse({
			first: 3,
			after: "not-a-valid-base64url",
			before: null,
			last: null,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			// Should surface the custom issue with correct message and path
			const issue = result.error.issues.find(
				(i) => i.message === "Not a valid cursor.",
			);
			expect(issue).toBeDefined();
			expect(issue?.path).toEqual(["after"]);
		}
	});

	it("reports custom issue for invalid 'before' cursor when using last/before", () => {
		const result = itemsArgumentsSchema.safeParse({
			last: 2,
			before: "@@@",
			first: null,
			after: null,
		});

		expect(result.success).toBe(false);
>>>>>>> upstream
		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.message === "Not a valid cursor.",
			);
			expect(issue).toBeDefined();
			expect(issue?.path).toEqual(["before"]);
		}
	});

<<<<<<< HEAD
	it("fails with custom issue for invalid cursor", () => {
		const result = itemsArgumentsSchema.safeParse({
			first: 2,
			after: "not-a-valid-cursor",
		});

		expect(result.success).toBe(false);

=======
	it("returns undefined cursor when none provided", () => {
		const result = itemsArgumentsSchema.safeParse({
			first: 1,
			after: undefined,
			before: null,
			last: null,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({
				cursor: undefined,
				isInversed: false,
				limit: 2,
			});
		}
	});

	it("reports custom issue when cursor JSON decodes but fails schema", () => {
		// Missing required fields (id, name), will fail cursorSchema.parse
		const badObject = { foo: "bar" };
		const encoded = Buffer.from(JSON.stringify(badObject)).toString(
			"base64url",
		);

		const result = itemsArgumentsSchema.safeParse({
			first: 4,
			after: encoded,
			before: null,
			last: null,
		});

		expect(result.success).toBe(false);
>>>>>>> upstream
		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.message === "Not a valid cursor.",
			);
			expect(issue).toBeDefined();
			expect(issue?.path).toEqual(["after"]);
		}
	});
});

<<<<<<< HEAD
describe("AgendaFolder.items resolver", () => {
	let ctx: GraphQLContext;
	let mocks: ReturnType<typeof createMockGraphQLContext>["mocks"];
	let parent: AgendaFolderType;

	beforeEach(() => {
		const mock = createMockGraphQLContext(true, "user-1");
		ctx = mock.context;
		mocks = mock.mocks;

		parent = {
			id: "folder-1",
			name: "Folder",
			description: null,
			organizationId: "org-1",
			eventId: "event-1",
			isAgendaItemFolder: true,
			parentFolderId: null,
			sequence: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
			creatorId: "user-1",
			updaterId: "user-1",
			isDefaultFolder: false,
		} as AgendaFolderType;
	});

	it("throws invalid_arguments when cursor is invalid", async () => {
		await expect(
			resolveItems(parent, { first: 2, after: "bad-cursor" }, ctx),
		).rejects.toMatchObject({
			extensions: {
				code: "invalid_arguments",
				issues: expect.arrayContaining([
					expect.objectContaining({ argumentPath: ["after"] }),
				]),
			},
		});
	});

	it("returns items without cursor (forward)", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([
			{ id: "item-1", name: "Alpha" },
			{ id: "item-2", name: "Bravo" },
		] as never);

		const result = await resolveItems(parent, { first: 2 }, ctx);

		expect(result.edges).toHaveLength(2);
		expect(result.edges[0]?.node?.name).toBe("Alpha");
		expect(result.pageInfo.hasNextPage).toBe(false);

		expect(
			mocks.drizzleClient.query.agendaItemsTable.findMany,
		).toHaveBeenCalledWith(
			expect.objectContaining({
				limit: 3,
			}),
		);
	});

	it("returns items when cursor is provided (forward)", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([
			{ id: "item-2", name: "Bravo" },
			{ id: "item-3", name: "Charlie" },
		] as never);

		const result = await resolveItems(
			parent,
			{ first: 2, after: encodeValidCursor() },
			ctx,
		);

		expect(result.edges).toHaveLength(2);
		expect(result.edges[0]?.node?.name).toBe("Bravo");
	});

	it("throws arguments_associated_resources_not_found when cursor exists but no rows returned", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([]);
		mocks.drizzleClient.query.agendaItemsTable.findFirst.mockResolvedValue(
			undefined,
		);

		await expect(
			resolveItems(parent, { first: 2, after: encodeValidCursor() }, ctx),
		).rejects.toMatchObject({
			extensions: {
				code: "arguments_associated_resources_not_found",
				issues: [{ argumentPath: ["after"] }],
			},
		});
	});

	it("supports inverse pagination (before / last)", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([
			{ id: "item-3", name: "Charlie" },
			{ id: "item-2", name: "Bravo" },
		] as never);

		const result = await resolveItems(
			parent,
			{ last: 2, before: encodeValidCursor() },
			ctx,
		);

		expect(result.edges).toHaveLength(2);
		expect(result.edges[0]?.node?.name).toBe("Bravo");
		expect(result.pageInfo.hasPreviousPage).toBe(false);
		expect(result.pageInfo.hasNextPage).toBe(true);
	});

	it("supports inverse pagination without cursor", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([
			{ id: "item-3", name: "Charlie" },
			{ id: "item-2", name: "Bravo" },
		] as never);

		const result = await resolveItems(parent, { last: 2 }, ctx);

		expect(result.edges).toHaveLength(2);
		expect(result.edges[0]?.node?.name).toBe("Bravo");
	});

	it("returns hasNextPage true when more items exist", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([
			{ id: "item-1", name: "Alpha" },
			{ id: "item-2", name: "Bravo" },
			{ id: "item-3", name: "Charlie" },
		] as never);

		const result = await resolveItems(parent, { first: 2 }, ctx);

		expect(result.edges).toHaveLength(2);
		expect(result.pageInfo.hasNextPage).toBe(true);
	});

	it("returns empty connection when no items and no cursor", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([]);

		const result = await resolveItems(parent, { first: 5 }, ctx);

		expect(result.edges).toHaveLength(0);
		expect(result.pageInfo.hasNextPage).toBe(false);
	});

	it("returns empty connection when cursor exists but no rows after cursor", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([]);
		mocks.drizzleClient.query.agendaItemsTable.findFirst.mockResolvedValue({
			id: "item-1",
		} as never);

		const result = await resolveItems(
			parent,
			{ first: 2, after: encodeValidCursor() },
			ctx,
		);

		expect(result.edges).toHaveLength(0);
		expect(result.pageInfo.hasNextPage).toBe(false);
	});

	it("throws arguments_associated_resources_not_found for backward cursor when cursor not found", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([]);
		mocks.drizzleClient.query.agendaItemsTable.findFirst.mockResolvedValue(
			undefined,
		);

		await expect(
			resolveItems(parent, { last: 2, before: encodeValidCursor() }, ctx),
		).rejects.toMatchObject({
			extensions: {
				code: "arguments_associated_resources_not_found",
				issues: [{ argumentPath: ["before"] }],
			},
		});
	});

	it("returns hasPreviousPage true when more items exist (inverse)", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([
			{ id: "item-3", name: "Charlie" },
			{ id: "item-2", name: "Bravo" },
			{ id: "item-1", name: "Alpha" },
		] as never);

		const result = await resolveItems(parent, { last: 2 }, ctx);

		expect(result.edges).toHaveLength(2);
		expect(result.pageInfo.hasPreviousPage).toBe(true);
	});

	it("returns empty connection when cursor exists but no rows before cursor (inverse)", async () => {
		mocks.drizzleClient.query.agendaItemsTable.findMany.mockResolvedValue([]);
		mocks.drizzleClient.query.agendaItemsTable.findFirst.mockResolvedValue({
			id: "item-1",
		} as never);

		const result = await resolveItems(
			parent,
			{ last: 2, before: encodeValidCursor() },
			ctx,
		);

		expect(result.edges).toHaveLength(0);
		expect(result.pageInfo.hasPreviousPage).toBe(false);
=======
describe("AgendaFolder.items connection", () => {
	const disposers: Array<() => Promise<void>> = [];

	afterEach(async () => {
		while (disposers.length) {
			const dispose = disposers.pop();
			if (dispose) {
				try {
					await dispose();
				} catch {}
			}
		}
	});

	it("returns invalid_arguments when cursor string is not valid (after)", async () => {
		const admin = await getAdminAuth();
		const authToken = admin.token;
		const { orgId, eventId, folderId } = await createOrgEventFolder(
			authToken,
			admin.userId,
		);
		const itemIds = await createItems(authToken, folderId, ["A", "B", "C"]);
		disposers.push(() => cleanup(authToken, { orgId, eventId, itemIds }));

		const result = await mercuriusClient.query(Query_agendaFolder_items, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { id: folderId, first: 2, after: "not-a-valid-cursor" },
		});

		// Error is on the items field under agendaFolder
		expect(result.data?.agendaFolder?.items ?? null).toBeNull();
		expect(result.errors?.[0]?.path).toEqual(["agendaFolder", "items"]);
		const extAfter = result.errors?.[0]?.extensions as
			| {
					code?: unknown;
					issues?: Array<{ argumentPath?: unknown; message?: unknown }>;
			  }
			| undefined;
		expect(extAfter?.code).toBe("invalid_arguments");
		expect(extAfter?.issues ?? []).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ argumentPath: ["after"] }),
			]),
		);
	});

	it("returns invalid_arguments when cursor string is not valid (before)", async () => {
		const admin = await getAdminAuth();
		const authToken = admin.token;
		const { orgId, eventId, folderId } = await createOrgEventFolder(
			authToken,
			admin.userId,
		);
		const itemIds = await createItems(authToken, folderId, ["A", "B", "C"]);
		disposers.push(() => cleanup(authToken, { orgId, eventId, itemIds }));

		const result = await mercuriusClient.query(Query_agendaFolder_items, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { id: folderId, last: 2, before: "still-not-a-valid-cursor" },
		});

		expect(result.data?.agendaFolder?.items ?? null).toBeNull();
		expect(result.errors?.[0]?.path).toEqual(["agendaFolder", "items"]);
		const extBefore = result.errors?.[0]?.extensions as
			| {
					code?: unknown;
					issues?: Array<{ argumentPath?: unknown; message?: unknown }>;
			  }
			| undefined;
		expect(extBefore?.code).toBe("invalid_arguments");
		expect(extBefore?.issues ?? []).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ argumentPath: ["before"] }),
			]),
		);
	});

	it("throws arguments_associated_resources_not_found when cursor points to non-existent item (after)", async () => {
		const admin = await getAdminAuth();
		const authToken = admin.token;
		const { orgId, eventId, folderId } = await createOrgEventFolder(
			authToken,
			admin.userId,
		);
		const itemIds = await createItems(authToken, folderId, ["A", "B", "C"]);
		disposers.push(() => cleanup(authToken, { orgId, eventId, itemIds }));

		const bogusCursor = encodeCursor({ id: faker.string.uuid(), name: "Zzz" });
		const result = await mercuriusClient.query(Query_agendaFolder_items, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { id: folderId, first: 2, after: bogusCursor },
		});

		expect(result.data?.agendaFolder?.items ?? null).toBeNull();
		expect(result.errors?.[0]?.path).toEqual(["agendaFolder", "items"]);
		const extMissing = result.errors?.[0]?.extensions as
			| {
					code?: unknown;
					issues?: Array<{ argumentPath?: unknown; message?: unknown }>;
			  }
			| undefined;
		expect(extMissing?.code).toBe("arguments_associated_resources_not_found");
		expect(extMissing?.issues ?? []).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ argumentPath: ["after"] }),
			]),
		);
	});

	it("returns items in ascending order with forward pagination and valid cursors", async () => {
		const admin = await getAdminAuth();
		const authToken = admin.token;
		const { orgId, eventId, folderId } = await createOrgEventFolder(
			authToken,
			admin.userId,
		);
		const names = ["Alpha", "Alpha", "Beta", "Charlie", "Delta"]; // ensures name, then id sort
		const itemIds = await createItems(authToken, folderId, names);
		disposers.push(() => cleanup(authToken, { orgId, eventId, itemIds }));

		const page1 = await mercuriusClient.query(Query_agendaFolder_items, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { id: folderId, first: 2 },
		});

		const items1 = page1.data?.agendaFolder?.items;
		assertToBeNonNullish(items1);
		const edges1Raw = items1.edges;
		assertToBeNonNullish(edges1Raw);
		const edges1 = edges1Raw.filter(
			(
				e,
			): e is {
				cursor: string;
				node: { id: string; name: string | null } | null;
			} => e !== null,
		);

		expect(edges1.length).toBe(2);

		const cursors1 = edges1.map((e) => e.cursor);
		const nodes1 = edges1.map((e) => {
			assertToBeNonNullish(e.node);
			return e.node;
		});

		// cursor encodes id and name
		cursors1.forEach((c, i) => {
			const parsed = decodeCursor(c);
			const nodeAtIndex = nodes1[i];
			assertToBeNonNullish(nodeAtIndex);
			expect(parsed.id).toBe(nodeAtIndex.id);
			expect(parsed.name).toBe(nodeAtIndex.name ?? undefined);
		});

		const endCursor1 = items1.pageInfo.endCursor;
		assertToBeNonNullish(endCursor1);
		expect(items1.pageInfo.hasNextPage).toBe(true);
		expect(items1.pageInfo.hasPreviousPage).toBe(false);

		const page2 = await mercuriusClient.query(Query_agendaFolder_items, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { id: folderId, first: 2, after: endCursor1 },
		});

		const items2 = page2.data?.agendaFolder?.items;
		assertToBeNonNullish(items2);
		const edges2Raw = items2.edges;
		assertToBeNonNullish(edges2Raw);
		const edges2 = edges2Raw.filter(
			(
				e,
			): e is {
				cursor: string;
				node: { id: string; name: string | null } | null;
			} => e !== null,
		);

		// verify ascending by (name, id)
		const combined = [
			...nodes1,
			...edges2.map((e) => {
				assertToBeNonNullish(e.node);
				return e.node;
			}),
		];
		const sortedByNameId = [...combined].sort(
			(a, b) =>
				(a.name ?? "").localeCompare(b.name ?? "") || a.id.localeCompare(b.id),
		);
		expect(combined.map((n) => n.id)).toEqual(sortedByNameId.map((n) => n.id));
	});

	it("supports inverse pagination using before/last and orders descending by name then id", async () => {
		const admin = await getAdminAuth();
		const authToken = admin.token;
		const { orgId, eventId, folderId } = await createOrgEventFolder(
			authToken,
			admin.userId,
		);
		const names = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];
		const itemIds = await createItems(authToken, folderId, names);
		disposers.push(() => cleanup(authToken, { orgId, eventId, itemIds }));

		// Get last 2 items (should be Delta, Echo in ascending order within the page)
		const page1 = await mercuriusClient.query(Query_agendaFolder_items, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { id: folderId, last: 2 },
		});

		const items1 = page1.data?.agendaFolder?.items;
		assertToBeNonNullish(items1);
		const edges1Raw = items1.edges;
		assertToBeNonNullish(edges1Raw);
		const edges1 = edges1Raw.filter(
			(
				e,
			): e is {
				cursor: string;
				node: { id: string; name: string | null } | null;
			} => e !== null,
		);
		expect(edges1.length).toBe(2);

		const page1Nodes = edges1.map((e) => {
			assertToBeNonNullish(e.node);
			return e.node;
		});

		// Within a page returned by `last`, nodes are in ascending order
		// but represent the "last N" items when ordered ascending globally
		const isSortedAsc = (arr: { id: string; name: string | null }[]) =>
			arr.every(
				(v, i, a) =>
					i === 0 ||
					(a[i - 1]?.name ?? "").localeCompare(v.name ?? "") <= 0 ||
					((a[i - 1]?.name ?? "") === (v.name ?? "") &&
						(a[i - 1]?.id ?? "").localeCompare(v.id) <= 0),
			);

		expect(isSortedAsc(page1Nodes)).toBe(true);

		const startCursor = items1.pageInfo.startCursor;
		assertToBeNonNullish(startCursor);

		// Get previous 2 items before the start cursor
		const page2 = await mercuriusClient.query(Query_agendaFolder_items, {
			headers: { authorization: `bearer ${authToken}` },
			variables: { id: folderId, last: 2, before: startCursor },
		});

		const items2 = page2.data?.agendaFolder?.items;
		assertToBeNonNullish(items2);
		const edges2Raw = items2.edges;
		assertToBeNonNullish(edges2Raw);
		const edges2 = edges2Raw.filter(
			(
				e,
			): e is {
				cursor: string;
				node: { id: string; name: string | null } | null;
			} => e !== null,
		);

		const page2Nodes = edges2.map((e) => {
			assertToBeNonNullish(e.node);
			return e.node;
		});

		expect(isSortedAsc(page2Nodes)).toBe(true);

		// Verify that page2 nodes come before page1 nodes in global ascending order
		// All names in page2 should be <= all names in page1
		const lastPage2Name = page2Nodes[page2Nodes.length - 1]?.name ?? "";
		const firstPage1Name = page1Nodes[0]?.name ?? "";
		expect(lastPage2Name.localeCompare(firstPage1Name) <= 0).toBe(true);

		// Verify pageInfo flags
		expect(items1.pageInfo.hasPreviousPage).toBe(true);
		expect(items2.pageInfo.hasNextPage).toBe(true);
>>>>>>> upstream
	});
});
