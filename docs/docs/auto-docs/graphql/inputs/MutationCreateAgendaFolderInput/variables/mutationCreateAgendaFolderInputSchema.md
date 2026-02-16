[API Docs](/)

***

# Variable: mutationCreateAgendaFolderInputSchema

<<<<<<< HEAD
> `const` **mutationCreateAgendaFolderInputSchema**: `ZodObject`\<\{ `description`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `eventId`: `ZodUUID`; `name`: `ZodString`; `organizationId`: `ZodUUID`; `sequence`: `ZodNullable`\<`ZodOptional`\<`ZodInt`\>\>; \}, \{ \}\>
=======
> `const` **mutationCreateAgendaFolderInputSchema**: `ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `eventId`: `ZodString`; `id`: `ZodOptional`\<`ZodString`\>; `isAgendaItemFolder`: `ZodBoolean`; `name`: `ZodString`; `parentFolderId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"name"` \| `"eventId"` \| `"isAgendaItemFolder"` \| `"parentFolderId"`\>, `"strip"`, `ZodTypeAny`, \{ `eventId`: `string`; `isAgendaItemFolder`: `boolean`; `name`: `string`; `parentFolderId?`: `string` \| `null`; \}, \{ `eventId`: `string`; `isAgendaItemFolder`: `boolean`; `name`: `string`; `parentFolderId?`: `string` \| `null`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationCreateAgendaFolderInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateAgendaFolderInput.ts#L5)
