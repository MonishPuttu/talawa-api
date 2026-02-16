[API Docs](/)

***

# Variable: mutationCreateChatMessageInputSchema

<<<<<<< HEAD
> `const` **mutationCreateChatMessageInputSchema**: `ZodObject`\<\{ `body`: `ZodString`; `chatId`: `ZodString`; `parentMessageId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, \{ \}\>
=======
> `const` **mutationCreateChatMessageInputSchema**: `ZodObject`\<`Pick`\<\{ `body`: `ZodString`; `chatId`: `ZodString`; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `parentMessageId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; \}, `"body"` \| `"chatId"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `body`: `string`; `chatId`: `string`; `parentMessageId?`: `string`; \}, \{ `body`: `string`; `chatId`: `string`; `parentMessageId?`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationCreateChatMessageInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateChatMessageInput.ts#L5)
