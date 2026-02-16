[API Docs](/)

***

# Variable: mutationUpdateOrganizationMembershipInputSchema

<<<<<<< HEAD
> `const` **mutationUpdateOrganizationMembershipInputSchema**: `ZodObject`\<\{ `memberId`: `ZodString`; `organizationId`: `ZodString`; `role`: `ZodOptional`\<`ZodString`\>; \}, \{ \}\>
=======
> `const` **mutationUpdateOrganizationMembershipInputSchema**: `ZodEffects`\<`ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `memberId`: `ZodString`; `organizationId`: `ZodString`; `role`: `ZodEnum`\<\[`"administrator"`, `"regular"`\]\>; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"organizationId"` \| `"memberId"`\> & `object`, `"strip"`, `ZodTypeAny`, \{ `memberId`: `string`; `organizationId`: `string`; `role?`: `"administrator"` \| `"regular"`; \}, \{ `memberId`: `string`; `organizationId`: `string`; `role?`: `"administrator"` \| `"regular"`; \}\>, \{ `memberId`: `string`; `organizationId`: `string`; `role?`: `"administrator"` \| `"regular"`; \}, \{ `memberId`: `string`; `organizationId`: `string`; `role?`: `"administrator"` \| `"regular"`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationUpdateOrganizationMembershipInput.ts:6](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationUpdateOrganizationMembershipInput.ts#L6)
