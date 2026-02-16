[API Docs](/)

***

# Variable: mutationUpdateVenueInputSchema

<<<<<<< HEAD
> `const` **mutationUpdateVenueInputSchema**: `ZodObject`\<\{ `attachments`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `fileHash`: `ZodString`; `mimeType`: `ZodEnum`\<\{ `image/avif`: `"image/avif"`; `image/jpeg`: `"image/jpeg"`; `image/png`: `"image/png"`; `image/webp`: `"image/webp"`; `video/mp4`: `"video/mp4"`; `video/quicktime`: `"video/quicktime"`; `video/webm`: `"video/webm"`; \}\>; `name`: `ZodString`; `objectName`: `ZodString`; \}, `$strip`\>\>\>; `capacity`: `ZodNullable`\<`ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>\>; `description`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `name`: `ZodOptional`\<`ZodString`\>; \}, \{ \}\>

Defined in: [src/graphql/inputs/MutationUpdateVenueInput.ts:10](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateVenueInput.ts#L10)
=======
> `const` **mutationUpdateVenueInputSchema**: `ZodEffects`\<`ZodObject`\<`Pick`\<\{ `capacity`: `ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `description`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `organizationId`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"description"` \| `"capacity"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `capacity?`: `number` \| `null`; `description?`: `string` \| `null`; `id`: `string`; `name?`: `string`; \}, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `capacity?`: `number` \| `null`; `description?`: `string` \| `null`; `id`: `string`; `name?`: `string`; \}\>, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `capacity?`: `number` \| `null`; `description?`: `string` \| `null`; `id`: `string`; `name?`: `string`; \}, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `capacity?`: `number` \| `null`; `description?`: `string` \| `null`; `id`: `string`; `name?`: `string`; \}\>

Defined in: [src/graphql/inputs/MutationUpdateVenueInput.ts:6](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateVenueInput.ts#L6)
>>>>>>> upstream
