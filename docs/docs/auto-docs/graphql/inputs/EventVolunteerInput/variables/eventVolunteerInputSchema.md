[API Docs](/)

***

# Variable: eventVolunteerInputSchema

<<<<<<< HEAD
> `const` **eventVolunteerInputSchema**: `ZodObject`\<\{ `eventId`: `ZodUUID`; `groupId`: `ZodOptional`\<`ZodString`\>; `recurringEventInstanceId`: `ZodOptional`\<`ZodString`\>; `scope`: `ZodOptional`\<`ZodEnum`\<\{ `ENTIRE_SERIES`: `"ENTIRE_SERIES"`; `THIS_INSTANCE_ONLY`: `"THIS_INSTANCE_ONLY"`; \}\>\>; `userId`: `ZodUUID`; \}, `$strip`\>
=======
> `const` **eventVolunteerInputSchema**: `ZodObject`\<\{ `eventId`: `ZodString`; `groupId`: `ZodOptional`\<`ZodString`\>; `recurringEventInstanceId`: `ZodOptional`\<`ZodString`\>; `scope`: `ZodOptional`\<`ZodEnum`\<\[`"ENTIRE_SERIES"`, `"THIS_INSTANCE_ONLY"`\]\>\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `eventId`: `string`; `groupId?`: `string`; `recurringEventInstanceId?`: `string`; `scope?`: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`; `userId`: `string`; \}, \{ `eventId`: `string`; `groupId?`: `string`; `recurringEventInstanceId?`: `string`; `scope?`: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`; `userId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/EventVolunteerInput.ts:19](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/EventVolunteerInput.ts#L19)

Zod schema for EventVolunteerInput validation.
Based on the old Talawa API EventVolunteerInput structure.
