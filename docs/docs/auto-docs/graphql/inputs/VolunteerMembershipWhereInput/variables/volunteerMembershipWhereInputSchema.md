[API Docs](/)

***

# Variable: volunteerMembershipWhereInputSchema

<<<<<<< HEAD
> `const` **volunteerMembershipWhereInputSchema**: `ZodObject`\<\{ `eventId`: `ZodOptional`\<`ZodString`\>; `eventTitle`: `ZodOptional`\<`ZodString`\>; `filter`: `ZodOptional`\<`ZodEnum`\<\{ `group`: `"group"`; `individual`: `"individual"`; \}\>\>; `groupId`: `ZodOptional`\<`ZodString`\>; `status`: `ZodOptional`\<`ZodEnum`\<\{ `accepted`: `"accepted"`; `invited`: `"invited"`; `rejected`: `"rejected"`; `requested`: `"requested"`; \}\>\>; `userId`: `ZodOptional`\<`ZodString`\>; `userName`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>
=======
> `const` **volunteerMembershipWhereInputSchema**: `ZodObject`\<\{ `eventId`: `ZodOptional`\<`ZodString`\>; `eventTitle`: `ZodOptional`\<`ZodString`\>; `filter`: `ZodOptional`\<`ZodEnum`\<\[`"group"`, `"individual"`\]\>\>; `groupId`: `ZodOptional`\<`ZodString`\>; `status`: `ZodOptional`\<`ZodEnum`\<\[`"invited"`, `"requested"`, `"accepted"`, `"rejected"`\]\>\>; `userId`: `ZodOptional`\<`ZodString`\>; `userName`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `eventId?`: `string`; `eventTitle?`: `string`; `filter?`: `"group"` \| `"individual"`; `groupId?`: `string`; `status?`: `"rejected"` \| `"invited"` \| `"requested"` \| `"accepted"`; `userId?`: `string`; `userName?`: `string`; \}, \{ `eventId?`: `string`; `eventTitle?`: `string`; `filter?`: `"group"` \| `"individual"`; `groupId?`: `string`; `status?`: `"rejected"` \| `"invited"` \| `"requested"` \| `"accepted"`; `userId?`: `string`; `userName?`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/VolunteerMembershipWhereInput.ts:10](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/VolunteerMembershipWhereInput.ts#L10)

Zod schema for VolunteerMembershipWhereInput validation.
Based on the old Talawa API VolunteerMembershipWhereInput structure.
