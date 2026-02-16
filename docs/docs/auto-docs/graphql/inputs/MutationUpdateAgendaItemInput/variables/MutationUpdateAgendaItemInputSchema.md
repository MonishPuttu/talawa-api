[API Docs](/)

***

# Variable: MutationUpdateAgendaItemInputSchema

<<<<<<< HEAD
> `const` **MutationUpdateAgendaItemInputSchema**: `ZodObject`\<\{ `attachments`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `fileHash`: `ZodString`; `mimeType`: `ZodEnum`\<\{ `image/avif`: `"image/avif"`; `image/jpeg`: `"image/jpeg"`; `image/png`: `"image/png"`; `image/webp`: `"image/webp"`; `video/mp4`: `"video/mp4"`; `video/quicktime`: `"video/quicktime"`; `video/webm`: `"video/webm"`; \}\>; `name`: `ZodString`; `objectName`: `ZodString`; \}, `$strip`\>\>\>; `categoryId`: `ZodOptional`\<`ZodUUID`\>; `description`: `ZodOptional`\<`ZodString`\>; `duration`: `ZodOptional`\<`ZodOptional`\<`ZodNullable`\<`ZodString`\>\>\>; `folderId`: `ZodOptional`\<`ZodUUID`\>; `id`: `ZodUUID`; `key`: `ZodOptional`\<`ZodOptional`\<`ZodNullable`\<`ZodString`\>\>\>; `name`: `ZodOptional`\<`ZodString`\>; `notes`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `url`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `url`: `ZodString`; \}, `$strip`\>\>\>; \}, \{ \}\>

Defined in: [src/graphql/inputs/MutationUpdateAgendaItemInput.ts:15](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateAgendaItemInput.ts#L15)
=======
> `const` **MutationUpdateAgendaItemInputSchema**: `ZodEffects`\<`ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `description`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `duration`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `folderId`: `ZodString`; `id`: `ZodOptional`\<`ZodString`\>; `key`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `name`: `ZodString`; `type`: `ZodEnum`\<\[`"general"`, `"note"`, `"scripture"`, `"song"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"duration"` \| `"description"` \| `"key"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `description?`: `string` \| `null`; `duration?`: `string` \| `null`; `folderId?`: `string`; `id`: `string`; `key?`: `string` \| `null`; `name?`: `string`; \}, \{ `description?`: `string` \| `null`; `duration?`: `string` \| `null`; `folderId?`: `string`; `id`: `string`; `key?`: `string` \| `null`; `name?`: `string`; \}\>, \{ `description?`: `string` \| `null`; `duration?`: `string` \| `null`; `folderId?`: `string`; `id`: `string`; `key?`: `string` \| `null`; `name?`: `string`; \}, \{ `description?`: `string` \| `null`; `duration?`: `string` \| `null`; `folderId?`: `string`; `id`: `string`; `key?`: `string` \| `null`; `name?`: `string`; \}\>

Defined in: [src/graphql/inputs/MutationUpdateAgendaItemInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateAgendaItemInput.ts#L5)
>>>>>>> upstream
