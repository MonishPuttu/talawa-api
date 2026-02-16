<<<<<<< HEAD
import { z } from "zod";
=======
import type { FileUpload } from "graphql-upload-minimal";
import { ulid } from "ulidx";
import { z } from "zod";
import { imageMimeTypeEnum } from "~/src/drizzle/enums/imageMimeType";
>>>>>>> upstream
import { communitiesTable } from "~/src/drizzle/tables/communities";
import { builder } from "~/src/graphql/builder";
import {
	MutationUpdateCommunityInput,
	mutationUpdateCommunityInputSchema,
} from "~/src/graphql/inputs/MutationUpdateCommunityInput";
import { Community } from "~/src/graphql/types/Community/Community";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
import { isNotNullish } from "~/src/utilities/isNotNullish";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";

const mutationUpdateCommunityArgumentsSchema = z.object({
	input: mutationUpdateCommunityInputSchema,
=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import envConfig from "~/src/utilities/graphqLimits";
import { isNotNullish } from "~/src/utilities/isNotNullish";
const mutationUpdateCommunityArgumentsSchema = z.object({
	input: mutationUpdateCommunityInputSchema.transform(async (arg, ctx) => {
		let logo:
			| (FileUpload & {
					mimetype: z.infer<typeof imageMimeTypeEnum>;
			  })
			| null
			| undefined;

		if (isNotNullish(arg.logo)) {
			const rawAvatar = await arg.logo;
			const result = imageMimeTypeEnum.safeParse(rawAvatar.mimetype);

			if (!result.success) {
				ctx.addIssue({
					code: "custom",
					path: ["logo"],
					message: `Mime type ${rawAvatar.mimetype} not allowed for this file upload.`,
				});
			} else {
				logo = Object.assign(rawAvatar, {
					mimetype: result.data,
				});
			}

			return {
				...arg,
				logo,
			};
		}

		return {
			...arg,
			logo: arg.logo,
		};
	}),
>>>>>>> upstream
});

builder.mutationField("updateCommunity", (t) =>
	t.field({
		args: {
			input: t.arg({
				description: "",
				required: true,
				type: MutationUpdateCommunityInput,
			}),
		},
		complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
		description: "Mutation field to update the community.",
		resolve: async (_parent, args, ctx) => {
			if (!ctx.currentClient.isAuthenticated) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unauthenticated",
					},
				});
			}

			const {
				success,
				data: parsedArgs,
				error,
			} = await mutationUpdateCommunityArgumentsSchema.safeParseAsync(args);

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

			const [currentUser, existingCommunity] = await Promise.all([
				ctx.drizzleClient.query.usersTable.findFirst({
					columns: {
						role: true,
					},
					where: (fields, operators) => operators.eq(fields.id, currentUserId),
				}),
				ctx.drizzleClient.query.communitiesTable.findFirst({
					columns: {
						logoName: true,
					},
				}),
			]);

			if (currentUser === undefined) {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unauthenticated",
					},
				});
			}

			if (currentUser.role !== "administrator") {
				throw new TalawaGraphQLError({
					extensions: {
						code: "unauthorized_action",
					},
				});
			}

			// Community not existing is a business logic error and means that the corresponding data in the database is in a corrupted state. It must be investigated and fixed as soon as possible to prevent additional data corruption.
			if (existingCommunity === undefined) {
				ctx.log.error(
					"Postgres select operation returned an empty array for the community.",
				);

				throw new TalawaGraphQLError({
					extensions: {
						code: "unexpected",
					},
				});
			}

<<<<<<< HEAD
			let logoMimeType: string | undefined;
			let logoName: string | undefined;

			// Allowed image MIME types for logo
			const allowedLogoMimeTypes = [
				"image/png",
				"image/jpeg",
				"image/webp",
				"image/gif",
			];

			if (isNotNullish(parsedArgs.input.logo)) {
				// Validate mimeType against allowed image types
				if (!allowedLogoMimeTypes.includes(parsedArgs.input.logo.mimeType)) {
					throw new TalawaGraphQLError({
						extensions: {
							code: "invalid_arguments",
							issues: [
								{
									argumentPath: ["input", "logo", "mimeType"],
									message: `Invalid MIME type. Allowed types: ${allowedLogoMimeTypes.join(", ")}`,
								},
							],
						},
					});
				}

				logoName = parsedArgs.input.logo.objectName;
				logoMimeType = parsedArgs.input.logo.mimeType;

				// Verify file exists in MinIO BEFORE database update
				try {
					await ctx.minio.client.statObject(ctx.minio.bucketName, logoName);
				} catch (error) {
					// Only treat NotFound as user error
					if (
						error instanceof Error &&
						(error.name === "NotFound" ||
							error.message.includes("Not Found") ||
							(error as { code?: string }).code === "NotFound")
					) {
						throw new TalawaGraphQLError({
							extensions: {
								code: "invalid_arguments",
								issues: [
									{
										argumentPath: ["input", "logo", "objectName"],
										message:
											"File not found in storage. Please upload the file first.",
									},
								],
							},
						});
					}
					// For other errors, throw unexpected
					throw new TalawaGraphQLError({
						extensions: {
							code: "unexpected",
						},
					});
				}

				// Remove old logo if it exists and has a different name (before DB update)
				if (
					existingCommunity.logoName !== null &&
					existingCommunity.logoName !== logoName
				) {
					try {
						await ctx.minio.client.removeObject(
							ctx.minio.bucketName,
							existingCommunity.logoName,
						);
					} catch (error) {
						// Log but don't throw - old file cleanup is non-critical
						ctx.log.warn(
							{ err: error, oldLogoName: existingCommunity.logoName },
							"Failed to remove old logo during update",
						);
					}
				}
			} else if (
				parsedArgs.input.logo !== undefined &&
				existingCommunity.logoName !== null
			) {
				// Logo was explicitly set to null, remove old logo before DB update
				try {
					await ctx.minio.client.removeObject(
						ctx.minio.bucketName,
						existingCommunity.logoName,
					);
				} catch (error) {
					// Log but don't throw - cleanup is non-critical
					ctx.log.warn(
						{ err: error, oldLogoName: existingCommunity.logoName },
						"Failed to remove old logo during null assignment",
					);
				}
=======
			let logoMimeType: z.infer<typeof imageMimeTypeEnum>;
			let logoName: string;

			if (isNotNullish(parsedArgs.input.logo)) {
				logoName =
					existingCommunity.logoName === null
						? ulid()
						: existingCommunity.logoName;
				logoMimeType = parsedArgs.input.logo.mimetype;
>>>>>>> upstream
			}

			return await ctx.drizzleClient.transaction(async (tx) => {
				const [updatedCommunity] = await tx
					.update(communitiesTable)
					.set({
						facebookURL: parsedArgs.input.facebookURL,
						githubURL: parsedArgs.input.githubURL,
						inactivityTimeoutDuration:
							parsedArgs.input.inactivityTimeoutDuration,
						logoMimeType: isNotNullish(parsedArgs.input.logo)
							? logoMimeType
							: null,
						logoName: isNotNullish(parsedArgs.input.logo) ? logoName : null,
						instagramURL: parsedArgs.input.instagramURL,
						linkedinURL: parsedArgs.input.linkedinURL,
						name: parsedArgs.input.name,
						redditURL: parsedArgs.input.redditURL,
						slackURL: parsedArgs.input.slackURL,
						updaterId: currentUserId,
						websiteURL: parsedArgs.input.websiteURL,
						xURL: parsedArgs.input.xURL,
						youtubeURL: parsedArgs.input.youtubeURL,
					})
					.returning();

<<<<<<< HEAD
				// Updated community not being returned is a business logic error
=======
				// Updated community not being returned is a business logic error and means that the corresponding data in the database is in a corrupted state. It must be investigated and fixed as soon as possible to prevent additional data corruption.
>>>>>>> upstream
				if (updatedCommunity === undefined) {
					ctx.log.error(
						"Postgres update operation returned an empty array for the community.",
					);

					throw new TalawaGraphQLError({
						extensions: {
							code: "unexpected",
						},
					});
				}

<<<<<<< HEAD
=======
				if (isNotNullish(parsedArgs.input.logo)) {
					await ctx.minio.client.putObject(
						ctx.minio.bucketName,
						logoName,
						parsedArgs.input.logo.createReadStream(),
						undefined,
						{
							"content-type": parsedArgs.input.logo.mimetype,
						},
					);
				} else if (
					parsedArgs.input.logo !== undefined &&
					existingCommunity.logoName !== null
				) {
					await ctx.minio.client.removeObject(
						ctx.minio.bucketName,
						existingCommunity.logoName,
					);
				}

>>>>>>> upstream
				return updatedCommunity;
			});
		},
		type: Community,
	}),
);
