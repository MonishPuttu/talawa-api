[API Docs](/)

***

# Variable: mutationDeleteCommentVoteInputSchema

<<<<<<< HEAD
> `const` **mutationDeleteCommentVoteInputSchema**: `ZodObject`\<\{ `commentId`: `ZodUUID`; `creatorId`: `ZodUUID`; \}, \{ \}\>
=======
> `const` **mutationDeleteCommentVoteInputSchema**: `ZodObject`\<`Pick`\<\{ `commentId`: `ZodString`; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `type`: `ZodEnum`\<\[`"down_vote"`, `"up_vote"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; \}, `"commentId"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `commentId`: `string`; `creatorId`: `string`; \}, \{ `commentId`: `string`; `creatorId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationDeleteCommentVoteInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationDeleteCommentVoteInput.ts#L5)
