[API Docs](/)

***

# Variable: mutationDeleteOrganizationMembershipInputSchema

<<<<<<< HEAD
> `const` **mutationDeleteOrganizationMembershipInputSchema**: `ZodObject`\<\{ `memberId`: `ZodString`; `organizationId`: `ZodString`; \}, \{ \}\>
=======
> `const` **mutationDeleteOrganizationMembershipInputSchema**: `ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `memberId`: `ZodString`; `organizationId`: `ZodString`; `role`: `ZodEnum`\<\[`"administrator"`, `"regular"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"organizationId"` \| `"memberId"`\>, `"strip"`, `ZodTypeAny`, \{ `memberId`: `string`; `organizationId`: `string`; \}, \{ `memberId`: `string`; `organizationId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationDeleteOrganizationMembershipInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationDeleteOrganizationMembershipInput.ts#L5)
