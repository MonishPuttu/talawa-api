[API Docs](/)

***

# Variable: mutationCreateChatMembershipInputSchema

<<<<<<< HEAD
> `const` **mutationCreateChatMembershipInputSchema**: `ZodObject`\<\{ `chatId`: `ZodUUID`; `memberId`: `ZodUUID`; `role`: `ZodOptional`\<`ZodString`\>; \}, \{ \}\>
=======
> `const` **mutationCreateChatMembershipInputSchema**: `ZodObject`\<`Pick`\<\{ `chatId`: `ZodString`; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `lastReadAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `memberId`: `ZodString`; `role`: `ZodEnum`\<\[`"administrator"`, `"regular"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"chatId"` \| `"memberId"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `chatId`: `string`; `memberId`: `string`; `role?`: `"administrator"` \| `"regular"`; \}, \{ `chatId`: `string`; `memberId`: `string`; `role?`: `"administrator"` \| `"regular"`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationCreateChatMembershipInput.ts:6](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateChatMembershipInput.ts#L6)
