[API Docs](/)

***

# Variable: sendMembershipRequestInputSchema

<<<<<<< HEAD
> `const` **sendMembershipRequestInputSchema**: `ZodObject`\<\{ `organizationId`: `ZodUUID`; \}, \{ \}\>
=======
> `const` **sendMembershipRequestInputSchema**: `ZodObject`\<`Pick`\<\{ `createdAt`: `ZodOptional`\<`ZodDate`\>; `membershipRequestId`: `ZodOptional`\<`ZodString`\>; `organizationId`: `ZodString`; `status`: `ZodOptional`\<`ZodEnum`\<\[`"pending"`, `"approved"`, `"rejected"`\]\>\>; `userId`: `ZodString`; \}, `"organizationId"`\>, `"strip"`, `ZodTypeAny`, \{ `organizationId`: `string`; \}, \{ `organizationId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationSendMembershipRequestInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationSendMembershipRequestInput.ts#L5)
