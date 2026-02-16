[API Docs](/)

***

# Variable: agendaFoldersTableRelations

<<<<<<< HEAD
> `const` **agendaFoldersTableRelations**: `Relations`\<`"agenda_folders"`, \{ `agendaItemsWhereFolder`: `Many`\<`"agenda_items"`\>; `creator`: `One`\<`"users"`, `false`\>; `event`: `One`\<`"events"`, `true`\>; `organization`: `One`\<`"organizations"`, `true`\>; `updater`: `One`\<`"users"`, `false`\>; \}\>

Defined in: [src/drizzle/tables/agendaFolders.ts:106](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/drizzle/tables/agendaFolders.ts#L106)
=======
> `const` **agendaFoldersTableRelations**: `Relations`\<`"agenda_folders"`, \{ `agendaFoldersWhereParentFolder`: `Many`\<`"agenda_folders"`\>; `agendaItemsWhereFolder`: `Many`\<`"agenda_items"`\>; `creator`: `One`\<`"users"`, `false`\>; `event`: `One`\<`"events"`, `true`\>; `parentFolder`: `One`\<`"agenda_folders"`, `false`\>; `updater`: `One`\<`"users"`, `false`\>; \}\>

Defined in: [src/drizzle/tables/agendaFolders.ts:99](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/drizzle/tables/agendaFolders.ts#L99)
>>>>>>> upstream
