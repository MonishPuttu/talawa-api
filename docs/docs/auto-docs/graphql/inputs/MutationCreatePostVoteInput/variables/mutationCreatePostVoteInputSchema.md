[API Docs](/)

***

# Variable: mutationCreatePostVoteInputSchema

<<<<<<< HEAD
> `const` **mutationCreatePostVoteInputSchema**: `ZodObject`\<\{ `postId`: `ZodUUID`; `type`: `ZodString`; \}, \{ \}\>
=======
> `const` **mutationCreatePostVoteInputSchema**: `ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `postId`: `ZodString`; `type`: `ZodEnum`\<\[`"down_vote"`, `"up_vote"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; \}, `"type"` \| `"postId"`\>, `"strip"`, `ZodTypeAny`, \{ `postId`: `string`; `type`: `"down_vote"` \| `"up_vote"`; \}, \{ `postId`: `string`; `type`: `"down_vote"` \| `"up_vote"`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationCreatePostVoteInput.ts:6](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreatePostVoteInput.ts#L6)
