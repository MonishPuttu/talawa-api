[API Docs](/)

***

# Variable: mutationUpdateAdvertisementInputSchema

<<<<<<< HEAD
> `const` **mutationUpdateAdvertisementInputSchema**: `ZodObject`\<\{ `description`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `endAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `id`: `ZodUUID`; `name`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `startAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `type`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, \{ \}\>
=======
> `const` **mutationUpdateAdvertisementInputSchema**: `ZodEffects`\<`ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `description`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `endAt`: `ZodDate`; `id`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `organizationId`: `ZodString`; `startAt`: `ZodDate`; `type`: `ZodEnum`\<\[`"banner"`, `"menu"`, `"pop_up"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"description"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `description?`: `string` \| `null`; `endAt?`: `Date`; `id`: `string`; `name?`: `string`; `startAt?`: `Date`; `type?`: `"banner"` \| `"menu"` \| `"pop_up"`; \}, \{ `description?`: `string` \| `null`; `endAt?`: `Date`; `id`: `string`; `name?`: `string`; `startAt?`: `Date`; `type?`: `"banner"` \| `"menu"` \| `"pop_up"`; \}\>, \{ `description?`: `string` \| `null`; `endAt?`: `Date`; `id`: `string`; `name?`: `string`; `startAt?`: `Date`; `type?`: `"banner"` \| `"menu"` \| `"pop_up"`; \}, \{ `description?`: `string` \| `null`; `endAt?`: `Date`; `id`: `string`; `name?`: `string`; `startAt?`: `Date`; `type?`: `"banner"` \| `"menu"` \| `"pop_up"`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationUpdateAdvertisementInput.ts:7](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateAdvertisementInput.ts#L7)
