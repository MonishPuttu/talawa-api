import { Organization } from "~/src/graphql/types/Organization/Organization";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import type { GraphQLContext } from "../../context";
import { Fund } from "./Fund";

/**
 * Resolves the organization that a fund belongs to.
 *
 * @param parent - The parent Fund object containing the organizationId.
 * @param _args - GraphQL arguments (unused).
 * @param ctx - The GraphQL context containing dataloaders and logging utilities.
 * @returns The organization the fund belongs to.
 * @throws TalawaGraphQLError with code "unexpected" if organization is not found (indicates data corruption).
 */
export const resolveOrganization = async (
	parent: Fund,
	_args: Record<string, never>,
	ctx: GraphQLContext,
) => {
	const existingOrganization = await ctx.dataloaders.organization.load(
		parent.organizationId,
	);

	if (existingOrganization === null) {
		ctx.log.error(
			{
				fundId: parent.id,
				organizationId: parent.organizationId,
			},
			"DataLoader returned null for a fund's organization id that isn't null.",
		);

		throw new TalawaGraphQLError({
			extensions: {
				code: "unexpected",
			},
		});
	}

	return existingOrganization;
};
=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
import { Fund } from "./Fund";
>>>>>>> upstream
Fund.implement({
	fields: (t) => ({
		organization: t.field({
			description: "Organization which the fund belongs to.",
			complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
<<<<<<< HEAD
			resolve: resolveOrganization,
=======
			resolve: async (parent, _args, ctx) => {
				const existingOrganization =
					await ctx.drizzleClient.query.organizationsTable.findFirst({
						where: (fields, operators) =>
							operators.eq(fields.id, parent.organizationId),
					});

				// Organziation id existing but the associated organization not existing is a business logic error and probably means that the corresponding data in the database is in a corrupted state. It must be investigated and fixed as soon as possible to prevent additional data corruption.
				if (existingOrganization === undefined) {
					ctx.log.error(
						"Postgres select operation returned an empty array for a fund's organization id that isn't null.",
					);

					throw new TalawaGraphQLError({
						extensions: {
							code: "unexpected",
						},
					});
				}

				return existingOrganization;
			},
>>>>>>> upstream
			type: Organization,
		}),
	}),
});
