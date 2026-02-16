[API Docs](/)

***

# Variable: volunteerMembershipInputSchema

<<<<<<< HEAD
> `const` **volunteerMembershipInputSchema**: `ZodObject`\<\{ `event`: `ZodString`; `group`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `recurringEventInstanceId`: `ZodOptional`\<`ZodString`\>; `scope`: `ZodOptional`\<`ZodEnum`\<\{ `ENTIRE_SERIES`: `"ENTIRE_SERIES"`; `THIS_INSTANCE_ONLY`: `"THIS_INSTANCE_ONLY"`; \}\>\>; `status`: `ZodEnum`\<\{ `accepted`: `"accepted"`; `invited`: `"invited"`; `rejected`: `"rejected"`; `requested`: `"requested"`; \}\>; `userId`: `ZodString`; \}, `$strip`\>
=======
> `const` **volunteerMembershipInputSchema**: `ZodObject`\<\{ `event`: `ZodString`; `group`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `recurringEventInstanceId`: `ZodOptional`\<`ZodString`\>; `scope`: `ZodOptional`\<`ZodEnum`\<\[`"ENTIRE_SERIES"`, `"THIS_INSTANCE_ONLY"`\]\>\>; `status`: `ZodEnum`\<\[`"invited"`, `"requested"`, `"accepted"`, `"rejected"`\]\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `event`: `string`; `group?`: `string` \| `null`; `recurringEventInstanceId?`: `string`; `scope?`: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`; `status`: `"rejected"` \| `"invited"` \| `"requested"` \| `"accepted"`; `userId`: `string`; \}, \{ `event`: `string`; `group?`: `string` \| `null`; `recurringEventInstanceId?`: `string`; `scope?`: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`; `status`: `"rejected"` \| `"invited"` \| `"requested"` \| `"accepted"`; `userId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/VolunteerMembershipInput.ts:19](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/VolunteerMembershipInput.ts#L19)

Zod schema for VolunteerMembershipInput validation.
Based on the old Talawa API VolunteerMembershipInput structure.
