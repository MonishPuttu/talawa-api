[API Docs](/)

***

# Variable: mutationDeletePostVoteInputSchema

<<<<<<< HEAD
> `const` **mutationDeletePostVoteInputSchema**: `ZodObject`\<\{ `creatorId`: `ZodUUID`; `postId`: `ZodUUID`; \}, \{ \}\>
=======
> `const` **mutationDeletePostVoteInputSchema**: `ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `postId`: `ZodString`; `type`: `ZodEnum`\<\[`"down_vote"`, `"up_vote"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; \}, `"postId"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `creatorId`: `string`; `postId`: `string`; \}, \{ `creatorId`: `string`; `postId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationDeletePostVoteInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationDeletePostVoteInput.ts#L5)
