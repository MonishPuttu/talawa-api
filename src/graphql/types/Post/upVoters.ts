import {
<<<<<<< HEAD
=======
	type SQL,
>>>>>>> upstream
	and,
	asc,
	desc,
	eq,
	exists,
	gt,
	isNotNull,
	lt,
	or,
<<<<<<< HEAD
	type SQL,
=======
>>>>>>> upstream
} from "drizzle-orm";
import { z } from "zod";
import {
	postVotesTable,
	postVotesTableInsertSchema,
} from "~/src/drizzle/tables/postVotes";
import { User } from "~/src/graphql/types/User/User";
<<<<<<< HEAD
import envConfig from "~/src/utilities/graphqLimits";
=======
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
>>>>>>> upstream
import {
	defaultGraphQLConnectionArgumentsSchema,
	transformDefaultGraphQLConnectionArguments,
	transformToDefaultGraphQLConnection,
<<<<<<< HEAD
} from "~/src/utilities/graphqlConnection";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import { Post } from "./Post";

const upVotersArgumentsSchema = defaultGraphQLConnectionArgumentsSchema
	.transform(transformDefaultGraphQLConnectionArguments)
	.transform((arg, ctx) => {
		let cursor: z.infer<typeof cursorSchema> | undefined;
=======
} from "~/src/utilities/defaultGraphQLConnection";
import envConfig from "~/src/utilities/graphqLimits";
import { Post } from "./Post";
const upVotersArgumentsSchema = defaultGraphQLConnectionArgumentsSchema
	.transform(transformDefaultGraphQLConnectionArguments)
	.transform((arg, ctx) => {
		let cursor: z.infer<typeof cursorSchema> | undefined = undefined;
>>>>>>> upstream

		try {
			if (arg.cursor !== undefined) {
				cursor = cursorSchema.parse(
					JSON.parse(Buffer.from(arg.cursor, "base64url").toString("utf-8")),
				);
			}
<<<<<<< HEAD
		} catch (_error) {
=======
		} catch (error) {
>>>>>>> upstream
			ctx.addIssue({
				code: "custom",
				message: "Not a valid cursor.",
				path: [arg.isInversed ? "before" : "after"],
			});
		}

		return {
			cursor,
			isInversed: arg.isInversed,
			limit: arg.limit,
		};
	});

const cursorSchema = z
	.object({
		createdAt: z.string().datetime(),
		creatorId: postVotesTableInsertSchema.shape.creatorId.unwrap().unwrap(),
	})
	.transform((arg) => ({
		createdAt: new Date(arg.createdAt),
		creatorId: arg.creatorId,
	}));

<<<<<<< HEAD
export const upVotersComplexity = (args: {
	first?: number | null | undefined;
	last?: number | null | undefined;
}) => {
	return {
		field: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
		multiplier: args.first || args.last || 1,
	};
};

=======
>>>>>>> upstream
Post.implement({
	fields: (t) => ({
		upVoters: t.connection(
			{
				description:
					"GraphQL connection to traverse through the user that up voted the post.",
<<<<<<< HEAD
				complexity: upVotersComplexity,
=======
				complexity: (args) => {
					return {
						field: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
						multiplier: args.first || args.last || 1,
					};
				},
>>>>>>> upstream
				resolve: async (parent, args, ctx) => {
					const {
						data: parsedArgs,
						error,
						success,
					} = upVotersArgumentsSchema.safeParse(args);

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

					const { cursor, isInversed, limit } = parsedArgs;

					const orderBy = isInversed
						? [asc(postVotesTable.createdAt), asc(postVotesTable.creatorId)]
						: [desc(postVotesTable.createdAt), desc(postVotesTable.creatorId)];

					let where: SQL | undefined;

					if (isInversed) {
						if (cursor !== undefined) {
							where = and(
								exists(
									ctx.drizzleClient
										.select()
										.from(postVotesTable)
										.where(
											and(
												isNotNull(postVotesTable.creatorId),
												eq(postVotesTable.createdAt, cursor.createdAt),
												eq(postVotesTable.creatorId, cursor.creatorId),
												eq(postVotesTable.postId, parent.id),
												eq(postVotesTable.type, "up_vote"),
											),
										),
								),
								isNotNull(postVotesTable.creatorId),
								eq(postVotesTable.postId, parent.id),
								eq(postVotesTable.type, "up_vote"),
								or(
									and(
										eq(postVotesTable.createdAt, cursor.createdAt),
										gt(postVotesTable.creatorId, cursor.creatorId),
									),
									gt(postVotesTable.createdAt, cursor.createdAt),
								),
							);
						} else {
							where = and(
								isNotNull(postVotesTable.creatorId),
								eq(postVotesTable.postId, parent.id),
								eq(postVotesTable.type, "up_vote"),
							);
						}
					} else {
						if (cursor !== undefined) {
							where = and(
								exists(
									ctx.drizzleClient
										.select()
										.from(postVotesTable)
										.where(
											and(
												isNotNull(postVotesTable.creatorId),
												eq(postVotesTable.createdAt, cursor.createdAt),
												eq(postVotesTable.creatorId, cursor.creatorId),
												eq(postVotesTable.postId, parent.id),
												eq(postVotesTable.type, "up_vote"),
											),
										),
								),
								isNotNull(postVotesTable.creatorId),
								eq(postVotesTable.postId, parent.id),
								eq(postVotesTable.type, "up_vote"),
								or(
									and(
										eq(postVotesTable.createdAt, cursor.createdAt),
										lt(postVotesTable.creatorId, cursor.creatorId),
									),
									lt(postVotesTable.createdAt, cursor.createdAt),
								),
							);
						} else {
							where = and(
								isNotNull(postVotesTable.creatorId),
								eq(postVotesTable.postId, parent.id),
								eq(postVotesTable.type, "up_vote"),
							);
						}
					}

					const postVotes =
						await ctx.drizzleClient.query.postVotesTable.findMany({
							columns: {
								createdAt: true,
								creatorId: true,
							},
							limit,
							orderBy,
							with: {
								creator: true,
							},
							where,
						});

					if (cursor !== undefined && postVotes.length === 0) {
						throw new TalawaGraphQLError({
							extensions: {
								code: "arguments_associated_resources_not_found",
								issues: [
									{
										argumentPath: [isInversed ? "before" : "after"],
									},
								],
							},
						});
					}

					return transformToDefaultGraphQLConnection({
<<<<<<< HEAD
						createCursor: (vote) => ({
							createdAt: vote.createdAt,
							creatorId: vote.creatorId ?? "",
						}),
=======
						createCursor: (vote) =>
							Buffer.from(
								JSON.stringify({
									createdAt: vote.createdAt.toISOString(),
									creatorId: vote.creatorId,
								}),
							).toString("base64url"),
>>>>>>> upstream
						createNode: (vote) => vote.creator,
						parsedArgs,
						// None of the post votes below contain a `creator` field with `null` as the value because of the sql query logic. This filter operation is here just to prevent type errors.
						rawNodes: postVotes.filter(
							(
								vote,
							): vote is typeof vote & {
								creator: NonNullable<(typeof vote)["creator"]>;
							} => vote.creator !== null,
						),
					});
				},
				type: User,
			},
			{
				edgesField: {
					complexity: {
						field: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
						multiplier: 1,
					},
				},
				description: "",
			},
			{
				nodeField: {
					complexity: {
						field: envConfig.API_GRAPHQL_OBJECT_FIELD_COST,
						multiplier: 1,
					},
				},
				description: "",
			},
		),
	}),
});
