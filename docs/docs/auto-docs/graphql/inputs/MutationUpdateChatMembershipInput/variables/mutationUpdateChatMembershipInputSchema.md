[API Docs](/)

***

# Variable: mutationUpdateChatMembershipInputSchema

<<<<<<< HEAD
> `const` **mutationUpdateChatMembershipInputSchema**: `ZodObject`\<\{ `chatId`: `ZodUUID`; `memberId`: `ZodUUID`; `role`: `ZodString`; \}, \{ \}\>
=======
> `const` **mutationUpdateChatMembershipInputSchema**: `ZodObject`\<`Pick`\<\{ `chatId`: `ZodString`; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `lastReadAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `memberId`: `ZodString`; `role`: `ZodEnum`\<\[`"administrator"`, `"regular"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"role"` \| `"chatId"` \| `"memberId"`\>, `"strip"`, `ZodTypeAny`, \{ `chatId`: `string`; `memberId`: `string`; `role`: `"administrator"` \| `"regular"`; \}, \{ `chatId`: `string`; `memberId`: `string`; `role`: `"administrator"` \| `"regular"`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationUpdateChatMembershipInput.ts:6](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateChatMembershipInput.ts#L6)
