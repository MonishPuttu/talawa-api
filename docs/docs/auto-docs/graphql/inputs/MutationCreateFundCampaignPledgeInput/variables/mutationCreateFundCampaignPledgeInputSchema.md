[API Docs](/)

***

# Variable: mutationCreateFundCampaignPledgeInputSchema

<<<<<<< HEAD
> `const` **mutationCreateFundCampaignPledgeInputSchema**: `ZodObject`\<\{ `amount`: `ZodNumber`; `campaignId`: `ZodUUID`; `note`: `ZodNullable`\<`ZodOptional`\<`ZodNullable`\<`ZodString`\>\>\>; `pledgerId`: `ZodUUID`; \}, \{ \}\>
=======
> `const` **mutationCreateFundCampaignPledgeInputSchema**: `ZodObject`\<`Pick`\<\{ `amount`: `ZodNumber`; `campaignId`: `ZodString`; `createdAt`: `ZodOptional`\<`ZodDate`\>; `creatorId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodOptional`\<`ZodString`\>; `note`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `pledgerId`: `ZodString`; `updatedAt`: `ZodOptional`\<`ZodNullable`\<`ZodDate`\>\>; `updaterId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; \}, `"note"` \| `"amount"` \| `"campaignId"` \| `"pledgerId"`\>, `"strip"`, `ZodTypeAny`, \{ `amount`: `number`; `campaignId`: `string`; `note?`: `string` \| `null`; `pledgerId`: `string`; \}, \{ `amount`: `number`; `campaignId`: `string`; `note?`: `string` \| `null`; `pledgerId`: `string`; \}\>
>>>>>>> upstream

Defined in: [src/graphql/inputs/MutationCreateFundCampaignPledgeInput.ts:5](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/inputs/MutationCreateFundCampaignPledgeInput.ts#L5)
