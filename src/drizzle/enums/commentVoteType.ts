import { z } from "zod";

/**
 * Possible variants of the type of of a vote on a comment.
 */
<<<<<<< HEAD
export const commentVoteTypeValues = ["down_vote", "up_vote"] as const;

export const commentVoteTypeZodEnum = z.enum(commentVoteTypeValues);
=======
export const commentVoteTypeEnum = z.enum(["down_vote", "up_vote"]);
>>>>>>> upstream
