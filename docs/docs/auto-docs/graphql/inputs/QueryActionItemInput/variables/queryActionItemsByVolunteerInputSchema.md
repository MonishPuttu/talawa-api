[API Docs](/)

***

# Variable: queryActionItemsByVolunteerInputSchema

<<<<<<< HEAD
> `const` **queryActionItemsByVolunteerInputSchema**: `ZodObject`\<\{ `organizationId`: `ZodOptional`\<`ZodUUID`\>; `volunteerId`: `ZodNullable`\<`ZodUUID`\>; \}, `$strip`\>
=======
> `const` **queryActionItemsByVolunteerInputSchema**: `ZodObject`\<\{ `organizationId`: `ZodOptional`\<`ZodString`\>; `volunteerId`: `ZodNullable`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `organizationId?`: `string`; `volunteerId`: `string` \| `null`; \}, \{ `organizationId?`: `string`; `volunteerId`: `string` \| `null`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/QueryActionItemInput.ts:32](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/QueryActionItemInput.ts#L32)

Defines the Zod validation schema for querying ActionItems by volunteerId.
