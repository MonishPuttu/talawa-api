import { Organization } from "~/src/graphql/types/Organization/Organization";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
>>>>>>> upstream
import { TagFolder } from "./TagFolder";

TagFolder.implement({
	fields: (t) => ({
		organization: t.field({
			description: "Organization which the tag folder belongs to.",
			complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
			resolve: async (parent, _args, ctx) => {
<<<<<<< HEAD
				const existingOrganization = await ctx.dataloaders.organization.load(
					parent.organizationId,
				);

				// Organization id existing but the associated organization not existing is a business logic error and probably means that the corresponding data in the database is in a corrupted state. It must be investigated and fixed as soon as possible to prevent additional data corruption.
				if (existingOrganization === null) {
					ctx.log.error(
						{
							tagFolderId: parent.id,
							organizationId: parent.organizationId,
						},
						"DataLoader returned null for a tag folder's organization id that isn't null.",
=======
				const existingOrganization =
					await ctx.drizzleClient.query.organizationsTable.findFirst({
						where: (fields, operators) =>
							operators.eq(fields.id, parent.organizationId),
					});

				// Organziation id existing but the associated organization not existing is a business logic error and probably means that the corresponding data in the database is in a corrupted state. It must be investigated and fixed as soon as possible to prevent additional data corruption.
				if (existingOrganization === undefined) {
					ctx.log.error(
						"Postgres select operation returned an empty array for a tag folder's organization id that isn't null.",
>>>>>>> upstream
					);

					throw new TalawaGraphQLError({
						extensions: {
							code: "unexpected",
						},
					});
				}

				return existingOrganization;
			},
			type: Organization,
		}),
	}),
});
