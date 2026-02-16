<<<<<<< HEAD
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { fundCampaignPledgesTable } from "~/src/drizzle/tables/fundCampaignPledges";
import { fundCampaignsTable } from "~/src/drizzle/tables/fundCampaigns";
=======
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fundCampaignPledgesTable } from "~/src/drizzle/tables/fundCampaignPledges";
>>>>>>> upstream
import { builder } from "~/src/graphql/builder";
import {
	MutationUpdateFundCampaignPledgeInput,
	mutationUpdateFundCampaignPledgeInputSchema,
} from "~/src/graphql/inputs/MutationUpdateFundCampaignPledgeInput";
import { FundCampaignPledge } from "~/src/graphql/types/FundCampaignPledge/FundCampaignPledge";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";

=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
>>>>>>> upstream
const mutationUpdateFundCampaignPledgeArgumentsSchema = z.object({
	input: mutationUpdateFundCampaignPledgeInputSchema,
});

builder.mutationField("updateFundCampaignPledge", (t) =>
	t.field({
		args: {
			input: t.arg({
				description: "",
				required: true,
				type: MutationUpdateFundCampaignPledgeInput,
			}),
		},
		complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
		description: "Mutation field to update a fund campaign pledge.",
		resolve: async (_parent, args, ctx) => {
			if (!ctx.currentClient.isAuthenticated) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unauthenticated",
					},
				});
			}

			const {
				data: parsedArgs,
				error,
				success,
			} = mutationUpdateFundCampaignPledgeArgumentsSchema.safeParse(args);

			if (!success) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "invalid_arguments",
						issues: error.issues.map((issue) => ({
							argumentPath: issue.path,
							message: issue.message,
						})),
					},
				});
			}

			const currentUserId = ctx.currentClient.user.id;

			const [currentUser, existingFundCampaignPledge] = await Promise.all([
				ctx.drizzleClient.query.usersTable.findFirst({
					columns: {
						role: true,
					},
					where: (fields, operators) => operators.eq(fields.id, currentUserId),
				}),
				ctx.drizzleClient.query.fundCampaignPledgesTable.findFirst({
					columns: {
						pledgerId: true,
<<<<<<< HEAD
						amount: true,
						campaignId: true,
=======
>>>>>>> upstream
					},
					with: {
						campaign: {
							columns: {
								startAt: true,
							},
							with: {
								fund: {
									columns: {
										isTaxDeductible: true,
									},
									with: {
										organization: {
											columns: {
												countryCode: true,
											},
											with: {
												membershipsWhereOrganization: {
													columns: {
														role: true,
													},
													where: (fields, operators) =>
														operators.eq(fields.memberId, currentUserId),
												},
											},
										},
									},
								},
							},
						},
					},
					where: (fields, operators) =>
						operators.eq(fields.id, parsedArgs.input.id),
				}),
			]);

			if (currentUser === undefined) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unauthenticated",
					},
				});
			}

			if (existingFundCampaignPledge === undefined) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "arguments_associated_resources_not_found",
						issues: [
							{
								argumentPath: ["input", "id"],
							},
						],
					},
				});
			}

			const currentUserOrganizationMembership =
				existingFundCampaignPledge.campaign.fund.organization
					.membershipsWhereOrganization[0];

			if (
				currentUser.role !== "administrator" &&
				(currentUserOrganizationMembership === undefined ||
					(currentUserOrganizationMembership.role !== "administrator" &&
						currentUserId !== existingFundCampaignPledge.pledgerId))
			) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unauthorized_action_on_arguments_associated_resources",
						issues: [
							{
								argumentPath: ["input", "id"],
							},
						],
					},
				});
			}

<<<<<<< HEAD
			const updatedFundCampaignPledge = await ctx.drizzleClient.transaction(
				async (tx) => {
					const [updatedPledge] = await tx
						.update(fundCampaignPledgesTable)
						.set({
							amount: parsedArgs.input.amount,
							note: parsedArgs.input.note,
							updaterId: currentUserId,
						})
						.where(eq(fundCampaignPledgesTable.id, parsedArgs.input.id))
						.returning();

					if (updatedPledge === undefined) {
						tx.rollback();
						return;
					}

					const newAmount =
						parsedArgs.input.amount !== undefined &&
						parsedArgs.input.amount !== null
							? parsedArgs.input.amount
							: existingFundCampaignPledge.amount;

					const amountDifference =
						newAmount - existingFundCampaignPledge.amount;

					if (amountDifference !== 0) {
						await tx
							.update(fundCampaignsTable)
							.set({
								amountRaised: sql`${fundCampaignsTable.amountRaised} + ${amountDifference}`,
							})
							.where(
								eq(
									fundCampaignsTable.id,
									existingFundCampaignPledge.campaignId,
								),
							);
					}

					return updatedPledge;
				},
			);
=======
			const [updatedFundCampaignPledge] = await ctx.drizzleClient
				.update(fundCampaignPledgesTable)
				.set({
					amount: parsedArgs.input.amount,
					note: parsedArgs.input.note,
					updaterId: currentUserId,
				})
				.where(eq(fundCampaignPledgesTable.id, parsedArgs.input.id))
				.returning();
>>>>>>> upstream

			// Updated fund campaign pledge not being returned means that either it was deleted or its `id` column was changed by external entities before this update operation could take place.
			if (updatedFundCampaignPledge === undefined) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unexpected",
					},
				});
			}

			return updatedFundCampaignPledge;
		},
		type: FundCampaignPledge,
	}),
);
