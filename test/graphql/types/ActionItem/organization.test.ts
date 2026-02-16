<<<<<<< HEAD
import { faker } from "@faker-js/faker";
import { initGraphQLTada } from "gql.tada";
import { describe, expect, it, vi } from "vitest";
import type { ClientCustomScalars } from "~/src/graphql/scalars/index";
// Import the actual implementation to ensure it's loaded for coverage
import "~/src/graphql/types/ActionItem/organization";
import { resolveOrganization } from "~/src/graphql/types/ActionItem/organization";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import { assertToBeNonNullish } from "../../../helpers";
import { server } from "../../../server";
import { mercuriusClient } from "../client";
import {
	Mutation_createActionItem,
	Mutation_createActionItemCategory,
	Mutation_createEvent,
	Mutation_createEventVolunteer,
	Mutation_createOrganization,
	Mutation_createOrganizationMembership,
	Mutation_createUser,
	Query_signIn,
} from "../documentNodes";
import type { introspection } from "../gql.tada";

const gql = initGraphQLTada<{
	introspection: introspection;
	scalars: ClientCustomScalars;
}>();

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

// Query to fetch action items with organization field
const Query_ActionItem_Organization = gql(`
  query ActionItemsByOrganizationWithOrg($input: QueryActionItemsByOrganizationInput!) {
    actionItemsByOrganization(input: $input) {
      id
      isCompleted
      organization {
        id
        name
        countryCode
        description
        addressLine1
        city
        state
        postalCode
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

async function createTestOrganization(authToken: string) {
	const orgName = `ActionItem Org Test ${faker.string.uuid()}`;
	const createOrgResult = await mercuriusClient.mutate(
		Mutation_createOrganization,
		{
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					name: orgName,
					description: "Organization for ActionItem.organization tests",
					countryCode: "us",
					state: "CA",
					city: "San Francisco",
					postalCode: "94101",
					addressLine1: "100 Test Street",
					addressLine2: "Suite 200",
				},
			},
		},
	);
	assertToBeNonNullish(createOrgResult.data?.createOrganization);
	const org = createOrgResult.data.createOrganization;
	assertToBeNonNullish(org.id);
	return { id: org.id as string, name: org.name as string };
}

async function createOrgMembership(
	authToken: string,
	organizationId: string,
	memberId: string,
) {
	await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
		headers: { authorization: `bearer ${authToken}` },
		variables: {
			input: {
				organizationId,
				memberId,
				role: "administrator",
			},
		},
	});
}

async function createTestCategory(authToken: string, organizationId: string) {
	const createCategoryResult = await mercuriusClient.mutate(
		Mutation_createActionItemCategory,
		{
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					name: `Test Category ${faker.string.uuid()}`,
					description: "A category for organization resolver testing",
					organizationId,
					isDisabled: false,
				},
			},
		},
	);
	assertToBeNonNullish(createCategoryResult.data?.createActionItemCategory);
	const category = createCategoryResult.data.createActionItemCategory;
	assertToBeNonNullish(category.id);
	return { id: category.id as string, name: category.name };
}

async function createTestEventAndVolunteer(
	authToken: string,
	organizationId: string,
	userId: string,
) {
	// Create an event
	const eventResult = await mercuriusClient.mutate(Mutation_createEvent, {
		headers: { authorization: `bearer ${authToken}` },
		variables: {
			input: {
				organizationId,
				name: "Test Event for ActionItem",
				description: "Test event for action item organization tests",
				startAt: new Date(Date.now() + ONE_DAY_MS).toISOString(),
				endAt: new Date(Date.now() + ONE_DAY_MS + ONE_HOUR_MS).toISOString(),
				location: "Test Location",
			},
		},
	});
	assertToBeNonNullish(eventResult.data?.createEvent);
	const eventId = eventResult.data.createEvent.id;

	// Create a volunteer
	const volunteerResult = await mercuriusClient.mutate(
		Mutation_createEventVolunteer,
		{
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					eventId,
					userId,
				},
			},
		},
	);
	assertToBeNonNullish(volunteerResult.data?.createEventVolunteer);
	const volunteerId = volunteerResult.data.createEventVolunteer.id;
	assertToBeNonNullish(volunteerId);
	return {
		eventId: eventId as string,
		volunteerId: volunteerId as string,
	};
}

async function createTestActionItem(
	authToken: string,
	categoryId: string,
	organizationId: string,
	volunteerId: string,
) {
	const createActionItemResult = await mercuriusClient.mutate(
		Mutation_createActionItem,
		{
			headers: { authorization: `bearer ${authToken}` },
			variables: {
				input: {
					categoryId,
					organizationId,
					volunteerId,
					assignedAt: new Date().toISOString(),
					preCompletionNotes: "Test action item notes",
				},
			},
		},
	);
	assertToBeNonNullish(createActionItemResult.data?.createActionItem);
	return createActionItemResult.data.createActionItem;
}

async function createRegularUser(adminToken: string) {
	const createUserResult = await mercuriusClient.mutate(Mutation_createUser, {
		headers: { authorization: `bearer ${adminToken}` },
		variables: {
			input: {
				emailAddress: faker.internet.email(),
				password: faker.internet.password(),
				role: "regular",
				name: `Test User ${faker.string.uuid()}`,
				isEmailAddressVerified: true,
			},
		},
	});

	// Check for errors first
	if (createUserResult.errors) {
		throw new Error(
			`createUser mutation failed: ${JSON.stringify(createUserResult.errors)}`,
		);
	}
	assertToBeNonNullish(
		createUserResult.data,
		"createUser mutation returned no data",
	);
	const user = createUserResult.data.createUser;
	assertToBeNonNullish(user, "createUser returned null user payload");
	assertToBeNonNullish(
		user.authenticationToken,
		"createUser returned no authenticationToken",
	);
	assertToBeNonNullish(user.user, "createUser returned no user object");

	return {
		id: user.user.id as string,
		token: user.authenticationToken,
	};
}

describe("ActionItem.organization Resolver - Integration", () => {
	describe("Organization Resolution", () => {
		it("should successfully resolve organization when querying action items", async () => {
			const adminAuth = await getAdminAuth();
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			// Exact count: we created exactly 1 action item for this fresh organization
			expect(result.data.actionItemsByOrganization.length).toBe(1);

			const actionItem = result.data.actionItemsByOrganization[0];
			assertToBeNonNullish(actionItem?.organization);
			expect(actionItem.organization.id).toBe(organization.id);
			expect(actionItem.organization.name).toBe(organization.name);
		});

		it("should return organization with all requested fields", async () => {
			const adminAuth = await getAdminAuth();
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			const actionItem = result.data.actionItemsByOrganization[0];
			assertToBeNonNullish(actionItem?.organization);

			// Verify all requested organization fields are present
			expect(actionItem.organization.id).toBe(organization.id);
			expect(actionItem.organization.name).toBe(organization.name);
			expect(actionItem.organization.countryCode).toBe("us");
			expect(actionItem.organization.description).toBe(
				"Organization for ActionItem.organization tests",
			);
			expect(actionItem.organization.addressLine1).toBe("100 Test Street");
			expect(actionItem.organization.city).toBe("San Francisco");
			expect(actionItem.organization.state).toBe("CA");
			expect(actionItem.organization.postalCode).toBe("94101");
		});

		it("should resolve organization correctly for multiple action items", async () => {
			const adminAuth = await getAdminAuth();
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);

			// Create multiple action items
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			// Exact count: we created exactly 3 action items for this fresh organization
			expect(result.data.actionItemsByOrganization.length).toBe(3);

			// All action items should have the same organization
			for (const actionItem of result.data.actionItemsByOrganization) {
				assertToBeNonNullish(actionItem?.organization);
				expect(actionItem.organization.id).toBe(organization.id);
				expect(actionItem.organization.name).toBe(organization.name);
			}
		});
	});

	describe("Authentication", () => {
		it("should return unauthenticated error when not logged in", async () => {
			const adminAuth = await getAdminAuth();
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			// Query without auth header - pass empty authorization in query options
			// instead of mutating global client state with setHeaders({})
			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
					headers: { authorization: "" },
				},
			);

			expect(result.errors).toBeDefined();
			expect(result.errors?.[0]?.extensions?.code).toBe("unauthenticated");
		});

		it("should reject query from user in a different organization", async () => {
			const adminAuth = await getAdminAuth();

			// Create original organization with action items
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			// Create a different organization and a user who is only a member of that org
			const otherOrg = await createTestOrganization(adminAuth.token);
			const otherUser = await createRegularUser(adminAuth.token);
			await createOrgMembership(adminAuth.token, otherOrg.id, otherUser.id);

			// Query the original organization with the other user's token
			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${otherUser.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeDefined();
			expect(result.errors?.[0]?.extensions?.code).toBe(
				"unauthorized_action_on_arguments_associated_resources",
			);
		});

		it("should allow regular member to query action items in their organization", async () => {
			const adminAuth = await getAdminAuth();

			// Create organization with action items
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			// Create a regular user and add them as a member of the organization
			const regularUser = await createRegularUser(adminAuth.token);
			await mercuriusClient.mutate(Mutation_createOrganizationMembership, {
				headers: { authorization: `bearer ${adminAuth.token}` },
				variables: {
					input: {
						organizationId: organization.id,
						memberId: regularUser.id,
						role: "regular",
					},
				},
			});

			// Query with the regular member's token - should succeed
			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${regularUser.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			// Exact count: we created exactly 1 action item for this fresh organization
			expect(result.data.actionItemsByOrganization.length).toBe(1);

			const actionItem = result.data.actionItemsByOrganization[0];
			assertToBeNonNullish(actionItem?.organization);
			expect(actionItem.organization.id).toBe(organization.id);
		});

		it("should reject query from user with no organization membership", async () => {
			const adminAuth = await getAdminAuth();

			// Create organization with action items
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			// Create a user who has no membership in any organization
			const userWithNoMembership = await createRegularUser(adminAuth.token);

			// Query with the user's token - should be rejected
			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${userWithNoMembership.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeDefined();
			expect(result.errors?.[0]?.extensions?.code).toBe(
				"unauthorized_action_on_arguments_associated_resources",
=======
import { createMockGraphQLContext } from "test/_Mocks_/mockContextCreator/mockContextCreator";
import { beforeEach, describe, expect, it } from "vitest";
import type { GraphQLContext } from "~/src/graphql/context";
import type { ActionItem as ActionItemType } from "~/src/graphql/types/ActionItem/ActionItem";
import { resolveOrganization } from "~/src/graphql/types/ActionItem/organization";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";

describe("ActionItem Resolver - Organization Field", () => {
	let ctx: GraphQLContext;
	let mockActionItem: ActionItemType;
	let mocks: ReturnType<typeof createMockGraphQLContext>["mocks"];

	beforeEach(() => {
		mockActionItem = {
			id: "01234567-89ab-cdef-0123-456789abcdef",
			organizationId: "org-123",
			categoryId: "category-456",
			assignedAt: new Date("2024-01-01T10:00:00Z"),
			isCompleted: false,
			completionAt: null,
			preCompletionNotes: null,
			postCompletionNotes: null,
			assigneeId: "user-789",
			creatorId: "user-admin",
			updaterId: "user-update",
			eventId: null,
			isTemplate: false,
			recurringEventInstanceId: null,
			volunteerId: null,
			volunteerGroupId: null,
			createdAt: new Date("2024-01-01T09:00:00Z"),
			updatedAt: new Date("2024-01-01T10:00:00Z"),
		} as ActionItemType;

		const { context, mocks: newMocks } = createMockGraphQLContext(
			true,
			"user-123",
		);
		ctx = context;
		mocks = newMocks;
	});

	describe("Organization Resolution", () => {
		it("should successfully resolve organization when it exists", async () => {
			const mockOrganization = {
				id: "org-123",
				name: "Test Organization",
				description: "Test Organization Description",
				countryCode: "US",
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01"),
				addressLine1: "123 Main St",
				addressLine2: null,
				avatarMimeType: null,
				city: "Test City",
				state: "Test State",
				zipCode: "12345",
				userRegistrationRequired: false,
				membershipRequestsEnabled: true,
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				mockOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(mockOrganization);
			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
		});

		it("should throw unexpected error when organization does not exist", async () => {
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				undefined,
			);

			await expect(
				resolveOrganization(mockActionItem, {}, ctx),
			).rejects.toThrow(
				new TalawaGraphQLError({
					extensions: { code: "unexpected" },
				}),
			);

			expect(ctx.log.error).toHaveBeenCalledWith(
				"Postgres select operation returned an empty array for an action item's organization id that isn't null.",
>>>>>>> upstream
			);
		});
	});

<<<<<<< HEAD
	describe("Organization via createActionItem mutation", () => {
		it("should return organization when creating action item", async () => {
			const adminAuth = await getAdminAuth();
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);

			// The Mutation_createActionItem already requests organization { id, name }
			const result = await mercuriusClient.mutate(Mutation_createActionItem, {
				headers: { authorization: `bearer ${adminAuth.token}` },
				variables: {
					input: {
						categoryId: category.id,
						organizationId: organization.id,
						volunteerId,
						assignedAt: new Date().toISOString(),
					},
				},
			});

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.createActionItem);
			assertToBeNonNullish(result.data.createActionItem.organization);
			expect(result.data.createActionItem.organization.id).toBe(
				organization.id,
			);
			expect(result.data.createActionItem.organization.name).toBe(
				organization.name,
			);
		});
	});

	describe("DataLoader Behavior", () => {
		it("should efficiently batch organization lookups for multiple action items", async () => {
			const adminAuth = await getAdminAuth();
			const organization = await createTestOrganization(adminAuth.token);
			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);

			// Create multiple action items that will all need the same organization
			const actionItemPromises = [];
			for (let i = 0; i < 5; i++) {
				actionItemPromises.push(
					createTestActionItem(
						adminAuth.token,
						category.id,
						organization.id,
						volunteerId,
					),
				);
			}
			await Promise.all(actionItemPromises);

			// Query all action items - DataLoader should batch the organization lookups
			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			// Exact count: we created exactly 5 action items for this fresh organization
			expect(result.data.actionItemsByOrganization.length).toBe(5);

			// Verify all action items have the organization resolved correctly
			for (const actionItem of result.data.actionItemsByOrganization) {
				assertToBeNonNullish(actionItem?.organization);
				expect(actionItem.organization.id).toBe(organization.id);
			}
		});
	});

	describe("Edge Cases", () => {
		it("should handle organization with minimal required fields", async () => {
			const adminAuth = await getAdminAuth();

			// Create organization with minimal fields
			const orgName = `Minimal Org ${faker.string.uuid()}`;
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							name: orgName,
							countryCode: "us",
						},
					},
				},
			);
			assertToBeNonNullish(createOrgResult.data?.createOrganization);
			const organization = createOrgResult.data.createOrganization;

			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			const actionItem = result.data.actionItemsByOrganization[0];
			assertToBeNonNullish(actionItem?.organization);
			expect(actionItem.organization.id).toBe(organization.id);
			expect(actionItem.organization.name).toBe(orgName);
			expect(actionItem.organization.countryCode).toBe("us");
			// Optional fields should be null
			expect(actionItem.organization.description).toBeNull();
			expect(actionItem.organization.addressLine1).toBeNull();
		});

		it("should handle organization with special characters in name", async () => {
			const adminAuth = await getAdminAuth();

			// Create organization with special characters
			const orgName = `Test Org & Co. <Special> ${faker.string.uuid()}`;
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							name: orgName,
							countryCode: "us",
						},
					},
				},
			);
			assertToBeNonNullish(createOrgResult.data?.createOrganization);
			const organization = createOrgResult.data.createOrganization;

			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			const actionItem = result.data.actionItemsByOrganization[0];
			assertToBeNonNullish(actionItem?.organization);
			expect(actionItem.organization.name).toBe(orgName);
		});

		it("should handle different country codes correctly", async () => {
			const adminAuth = await getAdminAuth();

			// Test with Canadian country code
			const orgName = `Canadian Org ${faker.string.uuid()}`;
			const createOrgResult = await mercuriusClient.mutate(
				Mutation_createOrganization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							name: orgName,
							countryCode: "ca",
							state: "ON",
							city: "Toronto",
						},
					},
				},
			);
			assertToBeNonNullish(createOrgResult.data?.createOrganization);
			const organization = createOrgResult.data.createOrganization;

			await createOrgMembership(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			const category = await createTestCategory(
				adminAuth.token,
				organization.id,
			);
			const { volunteerId } = await createTestEventAndVolunteer(
				adminAuth.token,
				organization.id,
				adminAuth.userId,
			);
			await createTestActionItem(
				adminAuth.token,
				category.id,
				organization.id,
				volunteerId,
			);

			const result = await mercuriusClient.query(
				Query_ActionItem_Organization,
				{
					headers: { authorization: `bearer ${adminAuth.token}` },
					variables: {
						input: {
							organizationId: organization.id,
						},
					},
				},
			);

			expect(result.errors).toBeUndefined();
			assertToBeNonNullish(result.data?.actionItemsByOrganization);
			const actionItem = result.data.actionItemsByOrganization[0];
			assertToBeNonNullish(actionItem?.organization);
			expect(actionItem.organization.countryCode).toBe("ca");
			expect(actionItem.organization.state).toBe("ON");
			expect(actionItem.organization.city).toBe("Toronto");
		});
	});

	describe("DataLoader Unit Tests - Batching Verification", () => {
		it("should call DataLoader exactly once per resolver invocation", async () => {
=======
	describe("Database Query Verification", () => {
		it("should call database query with correct organization ID", async () => {
>>>>>>> upstream
			const mockOrganization = {
				id: "org-123",
				name: "Test Organization",
				countryCode: "US",
			};

<<<<<<< HEAD
			const mockActionItem = {
				id: "action-item-123",
				organizationId: "org-123",
				categoryId: "category-123",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-123",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const mockCtx = {
				dataloaders: {
					organization: {
						load: vi.fn().mockResolvedValue(mockOrganization),
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			const result = await resolveOrganization(
				mockActionItem,
				{},
				mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
			);

			expect(result).toEqual(mockOrganization);
			expect(mockCtx.dataloaders.organization.load).toHaveBeenCalledTimes(1);
			expect(mockCtx.dataloaders.organization.load).toHaveBeenCalledWith(
				"org-123",
			);
		});

		it("should batch organization lookups when resolving multiple action items with same org", async () => {
			const mockOrganization = {
				id: "org-shared",
				name: "Shared Organization",
				countryCode: "US",
			};

			// Create mock DataLoader that tracks calls
			const loadFn = vi.fn().mockResolvedValue(mockOrganization);

			const mockCtx = {
				dataloaders: {
					organization: {
						load: loadFn,
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			// Create multiple action items with the same organizationId
			const actionItems = [
				{
					id: "action-item-1",
					organizationId: "org-shared",
					categoryId: "category-1",
					eventId: null,
					volunteerId: null,
					volunteerGroupId: null,
					assigneeId: null,
					assignerId: null,
					isCompleted: false,
					isTemplate: false,
					creatorId: "creator-1",
					updaterId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
					completedAt: null,
					completionAt: null,
					preCompletionNotes: null,
					postCompletionNotes: null,
					dueAt: null,
					assignedAt: new Date(),
					recurringEventInstanceId: null,
				},
				{
					id: "action-item-2",
					organizationId: "org-shared",
					categoryId: "category-2",
					eventId: null,
					volunteerId: null,
					volunteerGroupId: null,
					assigneeId: null,
					assignerId: null,
					isCompleted: false,
					isTemplate: false,
					creatorId: "creator-2",
					updaterId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
					completedAt: null,
					completionAt: null,
					preCompletionNotes: null,
					postCompletionNotes: null,
					dueAt: null,
					assignedAt: new Date(),
					recurringEventInstanceId: null,
				},
				{
					id: "action-item-3",
					organizationId: "org-shared",
					categoryId: "category-3",
					eventId: null,
					volunteerId: null,
					volunteerGroupId: null,
					assigneeId: null,
					assignerId: null,
					isCompleted: false,
					isTemplate: false,
					creatorId: "creator-3",
					updaterId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
					completedAt: null,
					completionAt: null,
					preCompletionNotes: null,
					postCompletionNotes: null,
					dueAt: null,
					assignedAt: new Date(),
					recurringEventInstanceId: null,
				},
			];

			// Resolve all action items in parallel
			const results = await Promise.all(
				actionItems.map((actionItem) =>
					resolveOrganization(
						actionItem,
						{},
						mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
					),
				),
			);

			// All results should be the same organization
			expect(results).toHaveLength(3);
			for (const result of results) {
				expect(result).toEqual(mockOrganization);
			}

			// DataLoader was called for each action item (batching happens at DataLoader level)
			expect(loadFn).toHaveBeenCalledTimes(3);
			expect(loadFn).toHaveBeenCalledWith("org-shared");
		});

		it("should handle different organization IDs correctly in DataLoader", async () => {
			const mockOrg1 = {
				id: "org-1",
				name: "Organization 1",
				countryCode: "US",
			};
			const mockOrg2 = {
				id: "org-2",
=======
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				mockOrganization,
			);

			await resolveOrganization(mockActionItem, {}, ctx);

			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledTimes(1);
			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
		});

		it("should handle different organization IDs correctly", async () => {
			const mockOrganization1 = {
				id: "org-111",
				name: "Organization 1",
				countryCode: "US",
			};

			const mockOrganization2 = {
				id: "org-222",
>>>>>>> upstream
				name: "Organization 2",
				countryCode: "CA",
			};

<<<<<<< HEAD
			const loadFn = vi
				.fn()
				.mockImplementation((orgId: string) =>
					Promise.resolve(orgId === "org-1" ? mockOrg1 : mockOrg2),
				);

			const mockCtx = {
				dataloaders: {
					organization: {
						load: loadFn,
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			const actionItem1 = {
				id: "action-item-1",
				organizationId: "org-1",
				categoryId: "category-1",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-1",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const actionItem2 = {
				id: "action-item-2",
				organizationId: "org-2",
				categoryId: "category-2",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-2",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const [result1, result2] = await Promise.all([
				resolveOrganization(
					actionItem1,
					{},
					mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
				),
				resolveOrganization(
					actionItem2,
					{},
					mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
				),
			]);

			expect(result1).toEqual(mockOrg1);
			expect(result2).toEqual(mockOrg2);
			expect(loadFn).toHaveBeenCalledWith("org-1");
			expect(loadFn).toHaveBeenCalledWith("org-2");
			expect(loadFn).toHaveBeenCalledTimes(2);
		});

		it("should use organizationId from parent action item correctly", async () => {
=======
			// Test with first organization ID
			mockActionItem.organizationId = "org-111";
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValueOnce(
				mockOrganization1,
			);

			let result = await resolveOrganization(mockActionItem, {}, ctx);
			expect(result).toEqual(mockOrganization1);

			// Test with second organization ID
			mockActionItem.organizationId = "org-222";
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValueOnce(
				mockOrganization2,
			);

			result = await resolveOrganization(mockActionItem, {}, ctx);
			expect(result).toEqual(mockOrganization2);

			// Verify both calls were made
			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledTimes(2);
		});

		it("should use organizationId from parent correctly", async () => {
>>>>>>> upstream
			const mockOrganization = {
				id: "custom-org-id",
				name: "Custom Org",
				countryCode: "UK",
			};

<<<<<<< HEAD
			const loadFn = vi.fn().mockResolvedValue(mockOrganization);

			const mockCtx = {
				dataloaders: {
					organization: {
						load: loadFn,
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			const mockActionItem = {
				id: "action-item-custom",
				organizationId: "custom-org-id",
				categoryId: "category-custom",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-custom",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			await resolveOrganization(
				mockActionItem,
				{},
				mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
			);

			expect(loadFn).toHaveBeenCalledWith("custom-org-id");
		});
	});

	describe("Error Handling - DataLoader Returns Null", () => {
		it("should throw 'unexpected' error when organization DataLoader returns null", async () => {
			// Create a mock ActionItem parent object
			const mockActionItem = {
				id: "action-item-123",
				organizationId: "org-that-does-not-exist-123",
				categoryId: "category-123",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-123",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			// Create a mock context with a DataLoader that returns null
			const mockCtx = {
				dataloaders: {
					organization: {
						load: vi.fn().mockResolvedValue(null),
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			// Call the resolver and expect it to throw
			await expect(
				resolveOrganization(
					mockActionItem,
					{},
					mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
				),
			).rejects.toThrow(TalawaGraphQLError);

			// Verify the error was logged with correct structured format
			expect(mockCtx.log.error).toHaveBeenCalledWith(
				{
					actionItemId: mockActionItem.id,
					organizationId: mockActionItem.organizationId,
				},
				"DataLoader returned null for an action item's organization id that isn't null",
			);

			// Verify the DataLoader was called with the correct organization ID
			expect(mockCtx.dataloaders.organization.load).toHaveBeenCalledWith(
				mockActionItem.organizationId,
			);
		});

		it("should throw error with 'unexpected' code when organization is not found", async () => {
			const mockActionItem = {
				id: "action-item-456",
				organizationId: "missing-org-456",
				categoryId: "category-456",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-456",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const mockCtx = {
				dataloaders: {
					organization: {
						load: vi.fn().mockResolvedValue(null),
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			let thrownError: unknown;
			try {
				await resolveOrganization(
					mockActionItem,
					{},
					mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
				);
			} catch (error) {
				thrownError = error;
			}

			expect(thrownError).toBeDefined();
			expect(thrownError).toBeInstanceOf(TalawaGraphQLError);
			expect((thrownError as TalawaGraphQLError).extensions.code).toBe(
				"unexpected",
			);
		});

		it("should return undefined without throwing when DataLoader returns undefined", async () => {
			// This test documents actual behavior: the resolver only checks for === null,
			// so undefined is returned without throwing. This may be intentional to
			// distinguish between "not found" (null) and "not loaded" (undefined).
			const mockActionItem = {
				id: "action-item-undefined",
				organizationId: "org-undefined",
				categoryId: "category-undefined",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-undefined",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const mockCtx = {
				dataloaders: {
					organization: {
						load: vi.fn().mockResolvedValue(undefined),
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			// The resolver uses === null check, so undefined passes through without throwing
			const result = await resolveOrganization(
				mockActionItem,
				{},
				mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
			);

			expect(result).toBeUndefined();
			// Error logging should not have been called since this is not a null case
			expect(mockCtx.log.error).not.toHaveBeenCalled();
		});
	});

	describe("Error Handling - DataLoader Throws Error", () => {
		it("should propagate error when DataLoader throws", async () => {
			const mockActionItem = {
				id: "action-item-error",
				organizationId: "org-throws-error",
				categoryId: "category-error",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-error",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const dataLoaderError = new Error("DataLoader internal failure");
			const mockCtx = {
				dataloaders: {
					organization: {
						load: vi.fn().mockRejectedValue(dataLoaderError),
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			// The resolver should propagate the DataLoader error
			await expect(
				resolveOrganization(
					mockActionItem,
					{},
					mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
				),
			).rejects.toThrow("DataLoader internal failure");

			// Verify the DataLoader was called with the correct organization ID
			expect(mockCtx.dataloaders.organization.load).toHaveBeenCalledWith(
				mockActionItem.organizationId,
			);
		});

		it("should propagate database connection error from DataLoader", async () => {
			const mockActionItem = {
				id: "action-item-db-error",
				organizationId: "org-db-connection-error",
				categoryId: "category-db-error",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-db-error",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const dbError = new Error("ECONNREFUSED: Database connection failed");
			const mockCtx = {
				dataloaders: {
					organization: {
						load: vi.fn().mockRejectedValue(dbError),
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			await expect(
				resolveOrganization(
					mockActionItem,
					{},
					mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
				),
			).rejects.toThrow("ECONNREFUSED: Database connection failed");
		});

		it("should propagate timeout error from DataLoader", async () => {
			const mockActionItem = {
				id: "action-item-timeout",
				organizationId: "org-timeout",
				categoryId: "category-timeout",
				eventId: null,
				volunteerId: null,
				volunteerGroupId: null,
				assigneeId: null,
				assignerId: null,
				isCompleted: false,
				isTemplate: false,
				creatorId: "creator-timeout",
				updaterId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				completedAt: null,
				completionAt: null,
				preCompletionNotes: null,
				postCompletionNotes: null,
				dueAt: null,
				assignedAt: new Date(),
				recurringEventInstanceId: null,
			};

			const timeoutError = new Error("Query execution timeout");
			const mockCtx = {
				dataloaders: {
					organization: {
						load: vi.fn().mockRejectedValue(timeoutError),
					},
				},
				log: {
					error: vi.fn(),
					info: vi.fn(),
					warn: vi.fn(),
					debug: vi.fn(),
				},
			};

			await expect(
				resolveOrganization(
					mockActionItem,
					{},
					mockCtx as unknown as Parameters<typeof resolveOrganization>[2],
				),
			).rejects.toThrow("Query execution timeout");
=======
			mockActionItem.organizationId = "custom-org-id";
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				mockOrganization,
			);

			await resolveOrganization(mockActionItem, {}, ctx);

			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
		});
	});

	describe("Error Handling", () => {
		it("should log error with correct message when organization is not found", async () => {
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				undefined,
			);

			try {
				await resolveOrganization(mockActionItem, {}, ctx);
			} catch (error) {
				expect(ctx.log.error).toHaveBeenCalledWith(
					"Postgres select operation returned an empty array for an action item's organization id that isn't null.",
				);
				expect(error).toBeInstanceOf(TalawaGraphQLError);
				expect((error as TalawaGraphQLError).extensions.code).toBe(
					"unexpected",
				);
				expect((error as TalawaGraphQLError).message).toBe(
					"Something went wrong. Please try again later.",
				);
			}
		});

		it("should handle database errors gracefully", async () => {
			const databaseError = new Error("Database connection failed");
			mocks.drizzleClient.query.organizationsTable.findFirst.mockRejectedValue(
				databaseError,
			);

			await expect(
				resolveOrganization(mockActionItem, {}, ctx),
			).rejects.toThrow(databaseError);

			// Verify the query was attempted
			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledTimes(1);
		});

		it("should not log errors for successful operations", async () => {
			const mockOrganization = {
				id: "org-123",
				name: "Success Organization",
				countryCode: "US",
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				mockOrganization,
			);

			await resolveOrganization(mockActionItem, {}, ctx);

			expect(ctx.log.error).not.toHaveBeenCalled();
		});

		it("should handle query timeout errors", async () => {
			const timeoutError = new Error("Query timeout");
			timeoutError.name = "TimeoutError";
			mocks.drizzleClient.query.organizationsTable.findFirst.mockRejectedValue(
				timeoutError,
			);

			await expect(
				resolveOrganization(mockActionItem, {}, ctx),
			).rejects.toThrow(timeoutError);
		});

		it("should handle database constraint violations", async () => {
			const constraintError = new Error("Foreign key constraint violation");
			constraintError.name = "PostgresError";
			mocks.drizzleClient.query.organizationsTable.findFirst.mockRejectedValue(
				constraintError,
			);

			await expect(
				resolveOrganization(mockActionItem, {}, ctx),
			).rejects.toThrow(constraintError);
		});
	});

	describe("Return Values", () => {
		it("should return organization with all expected properties", async () => {
			const mockOrganization = {
				id: "org-123",
				name: "Complete Organization",
				description: "A comprehensive organization",
				countryCode: "US",
				createdAt: new Date("2024-01-01T00:00:00Z"),
				updatedAt: new Date("2024-01-01T12:00:00Z"),
				addressLine1: "123 Business Ave",
				addressLine2: "Suite 100",
				avatarMimeType: "image/png",
				city: "Business City",
				state: "Business State",
				zipCode: "12345",
				userRegistrationRequired: true,
				membershipRequestsEnabled: false,
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				mockOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(mockOrganization);
			expect(result).toHaveProperty("id", "org-123");
			expect(result).toHaveProperty("name", "Complete Organization");
			expect(result).toHaveProperty(
				"description",
				"A comprehensive organization",
			);
			expect(result).toHaveProperty("countryCode", "US");
			expect(result).toHaveProperty("city", "Business City");
			expect(result).toHaveProperty("userRegistrationRequired", true);
		});

		it("should return minimal organization data correctly", async () => {
			const minimalOrganization = {
				id: "org-123",
				name: "Minimal Organization",
				countryCode: "US",
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01"),
				addressLine1: null,
				addressLine2: null,
				avatarMimeType: null,
				city: null,
				state: null,
				zipCode: null,
				description: null,
				userRegistrationRequired: null,
				membershipRequestsEnabled: null,
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				minimalOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(minimalOrganization);
			expect(result).toHaveProperty("id", "org-123");
			expect(result).toHaveProperty("name", "Minimal Organization");
			expect(result).toHaveProperty("countryCode", "US");
		});

		it("should preserve all organization properties from database", async () => {
			const complexOrganization = {
				id: "org-123",
				name: "Complex Organization",
				description: "Organization with many properties",
				countryCode: "CA",
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-02"),
				addressLine1: "456 Complex St",
				addressLine2: "Floor 5",
				avatarMimeType: "image/jpeg",
				city: "Complex City",
				state: "Complex Province",
				zipCode: "A1B 2C3",
				userRegistrationRequired: false,
				membershipRequestsEnabled: true,
				customField: "custom value", // Additional field
				metadata: { type: "nonprofit", verified: true },
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				complexOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(complexOrganization);
			expect(result).toHaveProperty("customField", "custom value");
			expect(result).toHaveProperty("metadata.type", "nonprofit");
			expect(result).toHaveProperty("metadata.verified", true);
		});
	});

	describe("Edge Cases", () => {
		it("should handle organizationId with UUID format", async () => {
			const uuidOrgId = "01234567-89ab-cdef-0123-456789abcdef";
			const uuidOrganization = {
				id: uuidOrgId,
				name: "UUID Organization",
				countryCode: "US",
			};

			mockActionItem.organizationId = uuidOrgId;
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				uuidOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(uuidOrganization);
			expect(result.id).toBe(uuidOrgId);
		});

		it("should handle organizations with special characters in name", async () => {
			const specialOrganization = {
				id: "org-123",
				name: "Organization with Special Chars: & < > \" ' %",
				countryCode: "US",
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				specialOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(specialOrganization);
			expect(result.name).toBe("Organization with Special Chars: & < > \" ' %");
		});

		it("should handle organizations with different country codes", async () => {
			const internationalOrgs = [
				{ id: "org-us", name: "US Org", countryCode: "US" },
				{ id: "org-ca", name: "Canadian Org", countryCode: "CA" },
				{ id: "org-uk", name: "UK Org", countryCode: "GB" },
				{ id: "org-jp", name: "Japan Org", countryCode: "JP" },
			];

			for (const org of internationalOrgs) {
				mockActionItem.organizationId = org.id;
				mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValueOnce(
					org,
				);

				const result = await resolveOrganization(mockActionItem, {}, ctx);
				expect(result).toEqual(org);
				expect(result.countryCode).toBe(org.countryCode);
			}
		});

		it("should handle organizations with null optional fields", async () => {
			const organizationWithNulls = {
				id: "org-123",
				name: "Org with Nulls",
				countryCode: "US",
				description: null,
				addressLine1: null,
				addressLine2: null,
				avatarMimeType: null,
				city: null,
				state: null,
				zipCode: null,
				userRegistrationRequired: null,
				membershipRequestsEnabled: null,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01"),
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				organizationWithNulls,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(organizationWithNulls);
			expect(result.description).toBeNull();
			expect(result.addressLine1).toBeNull();
			expect(result.city).toBeNull();
		});

		it("should handle very long organization names", async () => {
			const longName = `${"Very".repeat(50)}Long Organization Name`;
			const longNameOrganization = {
				id: "org-123",
				name: longName,
				countryCode: "US",
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				longNameOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(longNameOrganization);
			expect(result.name).toBe(longName);
		});
	});

	describe("Performance Considerations", () => {
		it("should make exactly one database query", async () => {
			const mockOrganization = {
				id: "org-123",
				name: "Test",
				countryCode: "US",
			};
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				mockOrganization,
			);

			await resolveOrganization(mockActionItem, {}, ctx);

			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledTimes(1);
		});

		it("should not cache organization data between calls", async () => {
			const mockOrganization1 = {
				id: "org-1",
				name: "Org 1",
				countryCode: "US",
			};
			const mockOrganization2 = {
				id: "org-2",
				name: "Org 2",
				countryCode: "CA",
			};

			// First call
			mockActionItem.organizationId = "org-1";
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValueOnce(
				mockOrganization1,
			);
			await resolveOrganization(mockActionItem, {}, ctx);

			// Second call with different org
			mockActionItem.organizationId = "org-2";
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValueOnce(
				mockOrganization2,
			);
			await resolveOrganization(mockActionItem, {}, ctx);

			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledTimes(2);
		});
	});

	describe("Data Integrity", () => {
		it("should always require organizationId to be present", async () => {
			// Since organizationId is non-null in the schema, this test verifies
			// that the resolver assumes organizationId will always be present
			const mockOrganization = {
				id: "org-123",
				name: "Required Org",
				countryCode: "US",
			};

			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				mockOrganization,
			);

			const result = await resolveOrganization(mockActionItem, {}, ctx);

			expect(result).toEqual(mockOrganization);
			// organizationId should always be used in the query
			expect(
				mocks.drizzleClient.query.organizationsTable.findFirst,
			).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
		});

		it("should handle organization referential integrity violations", async () => {
			// Test case where organizationId exists but organization was deleted
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				undefined,
			);

			await expect(
				resolveOrganization(mockActionItem, {}, ctx),
			).rejects.toThrow(
				new TalawaGraphQLError({
					extensions: { code: "unexpected" },
				}),
			);

			expect(ctx.log.error).toHaveBeenCalledWith(
				expect.stringContaining("organization id that isn't null"),
			);
		});
	});

	describe("Logging Verification", () => {
		it("should log error for missing organization with specific message", async () => {
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				undefined,
			);

			try {
				await resolveOrganization(mockActionItem, {}, ctx);
			} catch (error) {
				expect(ctx.log.error).toHaveBeenCalledWith(
					"Postgres select operation returned an empty array for an action item's organization id that isn't null.",
				);
			}
		});

		it("should include organization context in error logs", async () => {
			mocks.drizzleClient.query.organizationsTable.findFirst.mockResolvedValue(
				undefined,
			);

			mockActionItem.organizationId = "missing-org-123";

			try {
				await resolveOrganization(mockActionItem, {}, ctx);
			} catch (error) {
				expect(ctx.log.error).toHaveBeenCalledWith(
					expect.stringContaining("action item's organization id"),
				);
			}
>>>>>>> upstream
		});
	});
});
