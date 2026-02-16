[API Docs](/)

***

# Variable: mutationCreateTagInputSchema

<<<<<<< HEAD
> `const` **mutationCreateTagInputSchema**: `ZodObject`\<\{ `folderId`: `ZodOptional`\<`ZodNullable`\<`ZodUUID`\>\>; `name`: `ZodString`; `organizationId`: `ZodUUID`; \}, \{ \}\>
=======
> `const` **mutationCreateTagInputSchema**: `ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `folderId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `organizationId`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"name"` \| `"organizationId"` \| `"folderId"`\>, `"strip"`, `ZodTypeAny`, \{ `folderId?`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; \}, \{ `folderId?`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationCreateTagInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateTagInput.ts#L5)
