[API Docs](/)

***

# Variable: mutationCreateFundInputSchema

<<<<<<< HEAD
> `const` **mutationCreateFundInputSchema**: `ZodObject`\<\{ `isArchived`: `ZodOptional`\<`ZodBoolean`\>; `isDefault`: `ZodOptional`\<`ZodBoolean`\>; `isTaxDeductible`: `ZodBoolean`; `name`: `ZodString`; `organizationId`: `ZodString`; `referenceNumber`: `ZodNullable`\<`ZodOptional`\<`ZodNullable`\<`ZodString`\>\>\>; \}, \{ \}\>
=======
> `const` **mutationCreateFundInputSchema**: `ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `isTaxDeductible`: `ZodBoolean`; `name`: `ZodString`; `organizationId`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"name"` \| `"organizationId"` \| `"isTaxDeductible"`\>, `"strip"`, `ZodTypeAny`, \{ `isTaxDeductible`: `boolean`; `name`: `string`; `organizationId`: `string`; \}, \{ `isTaxDeductible`: `boolean`; `name`: `string`; `organizationId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationCreateFundInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateFundInput.ts#L5)
