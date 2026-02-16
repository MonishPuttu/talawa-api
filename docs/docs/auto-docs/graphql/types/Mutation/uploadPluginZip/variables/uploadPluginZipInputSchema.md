[API Docs](/)

***

# Variable: uploadPluginZipInputSchema

<<<<<<< HEAD
> `const` **uploadPluginZipInputSchema**: `ZodObject`\<\{ `activate`: `ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\>; `pluginZip`: `ZodCustom`\<`Promise`\<`FileUpload`\>, `Promise`\<`FileUpload`\>\>; \}, `$strip`\>
=======
> `const` **uploadPluginZipInputSchema**: `ZodObject`\<\{ `activate`: `ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\>; `pluginZip`: `ZodType`\<`Promise`\<`FileUpload`\>, `ZodTypeDef`, `Promise`\<`FileUpload`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `activate`: `boolean`; `pluginZip`: `Promise`\<`FileUpload`\>; \}, \{ `activate?`: `boolean`; `pluginZip`: `Promise`\<`FileUpload`\>; \}\>
>>>>>>> upstream

Defined in: [src/graphql/types/Mutation/uploadPluginZip.ts:9](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Mutation/uploadPluginZip.ts#L9)
