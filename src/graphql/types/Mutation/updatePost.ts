import { eq } from "drizzle-orm";
<<<<<<< HEAD
import { ulid } from "ulidx";
=======
>>>>>>> upstream
import { uuidv7 } from "uuidv7";
import { z } from "zod";
import { postAttachmentsTable } from "~/src/drizzle/tables/postAttachments";
import { postsTable } from "~/src/drizzle/tables/posts";
import { builder } from "~/src/graphql/builder";
import {
	MutationUpdatePostInput,
	mutationUpdatePostInputSchema,
} from "~/src/graphql/inputs/MutationUpdatePostInput";
import { Post } from "~/src/graphql/types/Post/Post";
<<<<<<< HEAD
import { getKeyPathsWithNonUndefinedValues } from "~/src/utilities/getKeyPathsWithNonUndefinedValues";
import envConfig from "~/src/utilities/graphqLimits";
import { isNotNullish } from "~/src/utilities/isNotNullish";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import { getKeyPathsWithNonUndefinedValues } from "~/src/utilities/getKeyPathsWithNonUndefinedValues";
import envConfig from "~/src/utilities/graphqLimits";
>>>>>>> upstream

const mutationUpdatePostArgumentsSchema = z.object({
	input: mutationUpdatePostInputSchema,
});

builder.mutationField("updatePost", (t) =>
	t.field({
		args: {
			input: t.arg({
				description: "",
				required: true,
				type: MutationUpdatePostInput,
			}),
		},
		complexity: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
		description: "Mutation field to update a post.",
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
<<<<<<< HEAD
			} = await mutationUpdatePostArgumentsSchema.safeParseAsync(args);
=======
			} = mutationUpdatePostArgumentsSchema.safeParse(args);
>>>>>>> upstream

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

			const [currentUser, existingPost] = await Promise.all([
				ctx.drizzleClient.query.usersTable.findFirst({
					columns: {
						role: true,
					},
					where: (fields, operators) => operators.eq(fields.id, currentUserId),
				}),
				ctx.drizzleClient.query.postsTable.findFirst({
					columns: {
						pinnedAt: true,
						creatorId: true,
					},
					with: {
						attachmentsWherePost: true,
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

			if (existingPost === undefined) {
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

			if (currentUser.role === "administrator") {
				if (currentUserId !== existingPost.creatorId) {
					const unauthorizedArgumentPaths = getKeyPathsWithNonUndefinedValues({
						keyPaths: [["input", "caption"]],
						object: parsedArgs,
					});

					if (unauthorizedArgumentPaths.length !== 0) {
						throw new TalawaGraphQLError({
							extensions: {
								code: "unauthorized_arguments",
								issues: unauthorizedArgumentPaths.map((argumentPath) => ({
									argumentPath,
								})),
							},
						});
					}
				}
			} else {
				const currentUserOrganizationMembership =
					existingPost.organization.membershipsWhereOrganization[0];

				if (currentUserOrganizationMembership === undefined) {
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

				if (currentUserOrganizationMembership.role === "administrator") {
					if (currentUserId !== existingPost.creatorId) {
						const unauthorizedArgumentPaths = getKeyPathsWithNonUndefinedValues(
							{
								keyPaths: [["input", "caption"]],
								object: parsedArgs,
							},
						);

						if (unauthorizedArgumentPaths.length !== 0) {
							throw new TalawaGraphQLError({
								extensions: {
									code: "unauthorized_arguments",
									issues: unauthorizedArgumentPaths.map((argumentPath) => ({
										argumentPath,
									})),
								},
							});
						}
					}
				} else {
					const unauthorizedArgumentPaths = getKeyPathsWithNonUndefinedValues({
						keyPaths: [["input", "isPinned"]],
						object: parsedArgs,
					});

					if (unauthorizedArgumentPaths.length !== 0) {
						throw new TalawaGraphQLError({
							extensions: {
								code: "unauthorized_arguments",
								issues: unauthorizedArgumentPaths.map((argumentPath) => ({
									argumentPath,
								})),
							},
						});
					}

					if (currentUserId !== existingPost.creatorId) {
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
				}
			}

<<<<<<< HEAD
=======
			// ...existing code...

			// Replace the simple update with a transaction
>>>>>>> upstream
			return await ctx.drizzleClient.transaction(async (tx) => {
				const [updatedPost] = await tx
					.update(postsTable)
					.set({
						caption: parsedArgs.input.caption,
<<<<<<< HEAD
						body: parsedArgs.input.body,
=======
>>>>>>> upstream
						pinnedAt:
							parsedArgs.input.isPinned === undefined
								? undefined
								: parsedArgs.input.isPinned
									? existingPost.pinnedAt === null
										? new Date()
										: undefined
									: null,
						updaterId: currentUserId,
					})
					.where(eq(postsTable.id, parsedArgs.input.id))
					.returning();

				// Updated post not being returned means that either it was deleted or its `id` column was changed
				if (updatedPost === undefined) {
<<<<<<< HEAD
					ctx.log.error(
						"Postgres update operation unexpectedly returned an empty array instead of throwing an error.",
					);
=======
>>>>>>> upstream
					throw new TalawaGraphQLError({
						extensions: {
							code: "unexpected",
						},
					});
				}

<<<<<<< HEAD
				// Handle direct file upload
				let createdAttachment: typeof postAttachmentsTable.$inferSelect | null =
					null;

				if (isNotNullish(parsedArgs.input.attachment)) {
					const attachment = parsedArgs.input.attachment;
					const objectName = ulid();

					// Upload new file first before any cleanup
					try {
						await ctx.minio.client.putObject(
							ctx.minio.bucketName,
							objectName,
							attachment.createReadStream(),
							undefined,
							{
								"content-type": attachment.mimetype,
							},
						);
					} catch (error) {
						ctx.log.error(`Error uploading file to MinIO: ${error}`);
						throw new TalawaGraphQLError({
							extensions: {
								code: "unexpected",
							},
						});
					}

					// After successfully uploading the new file, delete old MinIO objects
					for (const oldAttachment of existingPost.attachmentsWherePost) {
						try {
							await ctx.minio.client.removeObject(
								ctx.minio.bucketName,
								oldAttachment.objectName,
							);
						} catch (removeError) {
							ctx.log.error(
								`Failed to remove old MinIO object ${oldAttachment.objectName}: ${removeError}`,
							);
							throw new TalawaGraphQLError({
								extensions: {
									code: "unexpected",
								},
							});
						}
					}

=======
				// Handle attachments if they're provided in the input
				if (parsedArgs.input.attachments !== undefined) {
>>>>>>> upstream
					// First delete existing attachments
					await tx
						.delete(postAttachmentsTable)
						.where(eq(postAttachmentsTable.postId, updatedPost.id));

<<<<<<< HEAD
					// Create attachment record
					const attachmentRecord = {
						creatorId: currentUserId,
						mimeType: attachment.mimetype,
						id: uuidv7(),
						name: attachment.filename || "uploaded-file",
						postId: updatedPost.id,
						objectName: objectName,
						fileHash: ulid(), // Placeholder - no deduplication for direct uploads
					};

					const [attachmentResult] = await tx
						.insert(postAttachmentsTable)
						.values(attachmentRecord)
						.returning();

					if (attachmentResult) {
						createdAttachment = attachmentResult;
					}

					return Object.assign(updatedPost, {
						attachments: createdAttachment ? [createdAttachment] : [],
					});
				}

				// Handle explicit null attachment (remove existing attachments)
				if (parsedArgs.input.attachment === null) {
					await tx
						.delete(postAttachmentsTable)
						.where(eq(postAttachmentsTable.postId, updatedPost.id));
					// Delete existing MinIO objects
					for (const oldAttachment of existingPost.attachmentsWherePost) {
						try {
							await ctx.minio.client.removeObject(
								ctx.minio.bucketName,
								oldAttachment.objectName,
							);
						} catch (removeError) {
							ctx.log.error(
								`Failed to remove old MinIO object ${oldAttachment.objectName}: ${removeError}`,
							);
							throw new TalawaGraphQLError({
								extensions: {
									code: "unexpected",
								},
							});
						}
					}

=======
					// Then insert new attachments
					const attachments = parsedArgs.input.attachments;
					if (attachments.length > 0) {
						const createdPostAttachments = await tx
							.insert(postAttachmentsTable)
							.values(
								attachments.map((attachment) => ({
									updaterId: currentUserId,
									mimeType: attachment.mimetype,
									id: uuidv7(),
									name: attachment.name,
									postId: updatedPost.id,
									objectName: attachment.objectName,
									fileHash: attachment.fileHash,
								})),
							)
							.returning();

						return Object.assign(updatedPost, {
							attachments: createdPostAttachments,
						});
					}

					// Return empty attachments array if no new attachments
>>>>>>> upstream
					return Object.assign(updatedPost, {
						attachments: [],
					});
				}

				// If attachments aren't part of the update, keep the existing ones
				return Object.assign(updatedPost, {
					attachments: existingPost.attachmentsWherePost,
				});
			});
		},
		type: Post,
	}),
);
