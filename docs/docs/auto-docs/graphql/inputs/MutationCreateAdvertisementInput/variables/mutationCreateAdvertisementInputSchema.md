[API Docs](/)

***

# Variable: mutationCreateAdvertisementInputSchema

<<<<<<< HEAD
> `const` **mutationCreateAdvertisementInputSchema**: `ZodObject`\<\{ `attachments`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `fileHash`: `ZodString`; `mimeType`: `ZodEnum`\<\{ `image/avif`: `"image/avif"`; `image/jpeg`: `"image/jpeg"`; `image/png`: `"image/png"`; `image/webp`: `"image/webp"`; `video/mp4`: `"video/mp4"`; `video/quicktime`: `"video/quicktime"`; `video/webm`: `"video/webm"`; \}\>; `name`: `ZodString`; `objectName`: `ZodString`; \}, `$strip`\>\>\>; `description`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `endAt`: `ZodDate`; `name`: `ZodString`; `organizationId`: `ZodUUID`; `startAt`: `ZodDate`; `type`: `ZodString`; \}, \{ \}\>

Defined in: [src/graphql/inputs/MutationCreateAdvertisementInput.ts:10](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateAdvertisementInput.ts#L10)
=======
> `const` **mutationCreateAdvertisementInputSchema**: `ZodEffects`\<`ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `description`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `endAt`: `ZodDate`; `id`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `organizationId`: `ZodString`; `startAt`: `ZodDate`; `type`: `ZodEnum`\<\[`"banner"`, `"menu"`, `"pop_up"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"name"` \| `"description"` \| `"type"` \| `"organizationId"` \| `"endAt"` \| `"startAt"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `description?`: `string` \| `null`; `endAt`: `Date`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `type`: `"banner"` \| `"menu"` \| `"pop_up"`; \}, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `description?`: `string` \| `null`; `endAt`: `Date`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `type`: `"banner"` \| `"menu"` \| `"pop_up"`; \}\>, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `description?`: `string` \| `null`; `endAt`: `Date`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `type`: `"banner"` \| `"menu"` \| `"pop_up"`; \}, \{ `attachments?`: `Promise`\<`FileUpload`\>[]; `description?`: `string` \| `null`; `endAt`: `Date`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `type`: `"banner"` \| `"menu"` \| `"pop_up"`; \}\>

Defined in: [src/graphql/inputs/MutationCreateAdvertisementInput.ts:7](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateAdvertisementInput.ts#L7)
>>>>>>> upstream
