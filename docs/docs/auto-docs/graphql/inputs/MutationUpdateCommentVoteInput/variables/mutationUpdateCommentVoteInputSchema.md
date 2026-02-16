[API Docs](/)

***

# Variable: mutationUpdateCommentVoteInputSchema

<<<<<<< HEAD
> `const` **mutationUpdateCommentVoteInputSchema**: `ZodObject`\<\{ `commentId`: `ZodUUID`; `type`: `ZodNullable`\<`ZodEnum`\<\{ `down_vote`: `"down_vote"`; `up_vote`: `"up_vote"`; \}\>\>; \}, \{ \}\>
=======
> `const` **mutationUpdateCommentVoteInputSchema**: `ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `commentId`: `string`; `type`: `"down_vote"` \| `"up_vote"` \| `null`; \}, \{ `commentId`: `string`; `type`: `"down_vote"` \| `"up_vote"` \| `null`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationUpdateCommentVoteInput.ts:6](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateCommentVoteInput.ts#L6)
