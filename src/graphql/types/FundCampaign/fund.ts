import { Fund } from "~/src/graphql/types/Fund/Fund";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import type { GraphQLContext } from "../../context";
import { FundCampaign } from "./FundCampaign";

export const fundCampaignFundResolver = async (
	parent: FundCampaign,
	_args: Record<string, never>,
	ctx: GraphQLContext,
) => {
	const existingFund = await ctx.drizzleClient.query.fundsTable.findFirst({
		where: (fields, operators) => operators.eq(fields.id, parent.fundId),
	});

	// Fund id existing but the associated fund not existing is a business logic error and probably means that the corresponding data in the database is in a corrupted state. It must be investigated and fixed as soon as possible to prevent additional data corruption.
	if (existingFund === undefined) {
		ctx.log.error(
			"Postgres select operation returned an empty array for a fund campaign's fund id that isn't null.",
		);

		throw new TalawaGraphQLError({
			extensions: {
				code: "unexpected",
			},
		});
	}

	return existingFund;
};

=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
import { FundCampaign } from "./FundCampaign";
>>>>>>> upstream
FundCampaign.implement({
	fields: (t) => ({
		fund: t.field({
			description: "Fund which the fund campaign belongs to.",
			complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
<<<<<<< HEAD
			resolve: fundCampaignFundResolver,
=======
			resolve: async (parent, _args, ctx) => {
				const existingFund = await ctx.drizzleClient.query.fundsTable.findFirst(
					{
						where: (fields, operators) =>
							operators.eq(fields.id, parent.fundId),
					},
				);

				// Fund id existing but the associated fund not existing is a business logic error and probably means that the corresponding data in the database is in a corrupted state. It must be investigated and fixed as soon as possible to prevent additional data corruption.
				if (existingFund === undefined) {
					ctx.log.error(
						"Postgres select operation returned an empty array for a tag's fund id that isn't null.",
					);

					throw new TalawaGraphQLError({
						extensions: {
							code: "unexpected",
						},
					});
				}

				return existingFund;
			},
>>>>>>> upstream
			type: Fund,
		}),
	}),
});
