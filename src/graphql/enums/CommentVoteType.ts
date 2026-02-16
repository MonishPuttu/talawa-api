<<<<<<< HEAD
import { commentVoteTypeValues } from "~/src/drizzle/enums/commentVoteType";
=======
import { commentVoteTypeEnum } from "~/src/drizzle/enums/commentVoteType";
>>>>>>> upstream
import { builder } from "~/src/graphql/builder";

export const CommentVoteType = builder.enumType("CommentVoteType", {
	description: "Possible variants of the type of of a vote on a comment.",
<<<<<<< HEAD
	values: commentVoteTypeValues,
=======
	values: commentVoteTypeEnum.options,
>>>>>>> upstream
});
