[API Docs](/)

***

# Function: createTemplateLookupMap()

<<<<<<< HEAD
> **createTemplateLookupMap**(`templates`): `Map`\<`string`, [`EventTemplateWithAttachments`](../../types/type-aliases/EventTemplateWithAttachments.md)\>

Defined in: [src/services/eventGeneration/instanceResolver.ts:250](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/instanceResolver.ts#L250)
=======
> **createTemplateLookupMap**(`templates`): `Map`\<`string`, \{ `allDay`: `boolean`; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \}\>

Defined in: [src/services/eventGeneration/instanceResolver.ts:242](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/instanceResolver.ts#L242)
>>>>>>> upstream

Creates a lookup map for event templates to enable efficient batch processing.
The map is keyed by the event template ID.

## Parameters

### templates

<<<<<<< HEAD
[`EventTemplateWithAttachments`](../../types/type-aliases/EventTemplateWithAttachments.md)[]
=======
`object`[]
>>>>>>> upstream

An array of event templates.

## Returns

<<<<<<< HEAD
`Map`\<`string`, [`EventTemplateWithAttachments`](../../types/type-aliases/EventTemplateWithAttachments.md)\>

- A map of templates, keyed by their IDs.
=======
`Map`\<`string`, \{ `allDay`: `boolean`; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \}\>

A map of templates, keyed by their IDs.
>>>>>>> upstream
