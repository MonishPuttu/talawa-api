[API Docs](/)

***

# Variable: mutationCreatePostInputSchema

<<<<<<< HEAD
> `const` **mutationCreatePostInputSchema**: `ZodPipe`\<`ZodObject`\<\{ `attachment`: `ZodOptional`\<`ZodAny`\>; `body`: `ZodOptional`\<`ZodString`\>; `caption`: `ZodString`; `isPinned`: `ZodOptional`\<`ZodBoolean`\>; `organizationId`: `ZodUUID`; \}, \{ \}\>, `ZodTransform`\<\{ `attachment`: `FileUpload` & `object` \| `null` \| `undefined`; `body?`: `string`; `caption`: `string`; `isPinned?`: `boolean`; `organizationId`: `string`; \}, \{ `attachment?`: `any`; `body?`: `string`; `caption`: `string`; `isPinned?`: `boolean`; `organizationId`: `string`; \}\>\>

Defined in: [src/graphql/inputs/MutationCreatePostInput.ts:12](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreatePostInput.ts#L12)
=======
> `const` **mutationCreatePostInputSchema**: `ZodObject`\<`Pick`\<\{ `caption`: `ZodString`; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodString`; `id`: `ZodOptional`\<`ZodString`\>; `organizationId`: `ZodString`; `pinnedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"organizationId"` \| `"caption"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `attachments?`: `object`[]; `caption`: `string`; `isPinned?`: `boolean`; `organizationId`: `string`; \}, \{ `attachments?`: `object`[]; `caption`: `string`; `isPinned?`: `boolean`; `organizationId`: `string`; \}\>

Defined in: [src/graphql/inputs/MutationCreatePostInput.ts:49](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreatePostInput.ts#L49)
>>>>>>> upstream
