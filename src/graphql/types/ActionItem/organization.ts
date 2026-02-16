import type { GraphQLContext } from "~/src/graphql/context";
import { Organization } from "~/src/graphql/types/Organization/Organization";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import type { ActionItem as ActionItemType } from "./ActionItem";
import { ActionItem } from "./ActionItem";

/**
 * Resolves the organization that an action item belongs to.
 *
 * @param parent - The parent ActionItem object containing the organizationId.
 * @param _args - GraphQL arguments (unused).
 * @param ctx - The GraphQL context containing dataloaders and logging utilities.
 * @returns The organization the action item belongs to.
 * @throws TalawaGraphQLError with code "unexpected" if organization is not found (indicates data corruption).
 */
=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
import { ActionItem } from "./ActionItem";
import type { ActionItem as ActionItemType } from "./ActionItem";

>>>>>>> upstream
// Export the resolver function so it can be tested
export const resolveOrganization = async (
	parent: ActionItemType,
	_args: Record<string, never>,
	ctx: GraphQLContext,
) => {
<<<<<<< HEAD
	const existingOrganization = await ctx.dataloaders.organization.load(
		parent.organizationId,
	);

	if (existingOrganization === null) {
		ctx.log.error(
			{
				actionItemId: parent.id,
				organizationId: parent.organizationId,
			},
			"DataLoader returned null for an action item's organization id that isn't null",
=======
	const existingOrganization =
		await ctx.drizzleClient.query.organizationsTable.findFirst({
			where: (fields, operators) =>
				operators.eq(fields.id, parent.organizationId),
		});

	if (existingOrganization === undefined) {
		ctx.log.error(
			"Postgres select operation returned an empty array for an action item's organization id that isn't null.",
>>>>>>> upstream
		);

		throw new TalawaGraphQLError({
			extensions: {
				code: "unexpected",
			},
		});
	}

	return existingOrganization;
};

ActionItem.implement({
	fields: (t) => ({
		organization: t.field({
			description: "The organization the action item belongs to.",
			type: Organization,
			complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
			resolve: resolveOrganization, // Use the exported function
		}),
	}),
});
