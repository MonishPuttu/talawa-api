[API Docs](/)

***

# Variable: mutationCreateVenueInputSchema

<<<<<<< HEAD
> `const` **mutationCreateVenueInputSchema**: `ZodObject`\<\{ `attachments`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `fileHash`: `ZodString`; `mimeType`: `ZodEnum`\<\{ `image/avif`: `"image/avif"`; `image/jpeg`: `"image/jpeg"`; `image/png`: `"image/png"`; `image/webp`: `"image/webp"`; `video/mp4`: `"video/mp4"`; `video/quicktime`: `"video/quicktime"`; `video/webm`: `"video/webm"`; \}\>; `name`: `ZodString`; `objectName`: `ZodString`; \}, `$strip`\>\>\>; `capacity`: `ZodNullable`\<`ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>\>; `description`: `ZodNullable`\<`ZodOptional`\<`ZodNullable`\<`ZodString`\>\>\>; `name`: `ZodString`; `organizationId`: `ZodString`; \}, \{ \}\>

Defined in: [src/graphql/inputs/MutationCreateVenueInput.ts:9](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateVenueInput.ts#L9)
=======
> `const` **mutationCreateVenueInputSchema**: `ZodObject`\<`Pick`\<\{ `capacity`: `ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `description`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `organizationId`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"name"` \| `"description"` \| `"organizationId"` \| `"capacity"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `capacity?`: `number` \| `null`; `description?`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; \}, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `capacity?`: `number` \| `null`; `description?`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; \}\>

Defined in: [src/graphql/inputs/MutationCreateVenueInput.ts:6](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateVenueInput.ts#L6)
>>>>>>> upstream
