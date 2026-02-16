[API Docs](/)

***

# Variable: updateEventVolunteerInputSchema

<<<<<<< HEAD
> `const` **updateEventVolunteerInputSchema**: `ZodObject`\<\{ `assignments`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `hasAccepted`: `ZodOptional`\<`ZodBoolean`\>; `isPublic`: `ZodOptional`\<`ZodBoolean`\>; \}, `$strip`\>
=======
> `const` **updateEventVolunteerInputSchema**: `ZodObject`\<\{ `assignments`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `hasAccepted`: `ZodOptional`\<`ZodBoolean`\>; `isPublic`: `ZodOptional`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `assignments?`: `string`[]; `hasAccepted?`: `boolean`; `isPublic?`: `boolean`; \}, \{ `assignments?`: `string`[]; `hasAccepted?`: `boolean`; `isPublic?`: `boolean`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/UpdateEventVolunteerInput.ts:8](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/UpdateEventVolunteerInput.ts#L8)

Zod schema for UpdateEventVolunteerInput validation.
Based on the old Talawa API UpdateEventVolunteerInput structure.
