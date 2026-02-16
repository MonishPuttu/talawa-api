[API Docs](/)

***

# Function: EventVolunteerEventResolver()

<<<<<<< HEAD
> **EventVolunteerEventResolver**(`parent`, `_args`, `ctx`): `Promise`\<\{ `allDay`: `boolean`; `attachments`: `never`[]; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isInviteOnly`: `boolean`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \}\>

Defined in: [src/graphql/types/EventVolunteer/event.ts:18](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/EventVolunteer/event.ts#L18)

Resolves the event that an event volunteer is associated with.
=======
> **EventVolunteerEventResolver**(`parent`, `_args`, `ctx`): `Promise`\<\{ `allDay`: `boolean`; `attachments`: `never`[]; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \}\>

Defined in: [src/graphql/types/EventVolunteer/event.ts:10](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/EventVolunteer/event.ts#L10)
>>>>>>> upstream

## Parameters

### parent

[`EventVolunteer`](../../EventVolunteer/type-aliases/EventVolunteer.md)

<<<<<<< HEAD
The parent EventVolunteer object containing the eventId.

=======
>>>>>>> upstream
### \_args

`Record`\<`string`, `never`\>

<<<<<<< HEAD
GraphQL arguments (unused).

=======
>>>>>>> upstream
### ctx

[`GraphQLContext`](../../../../context/type-aliases/GraphQLContext.md)

<<<<<<< HEAD
The GraphQL context containing dataloaders and logging utilities.

## Returns

`Promise`\<\{ `allDay`: `boolean`; `attachments`: `never`[]; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isInviteOnly`: `boolean`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \}\>

The event the volunteer is associated with.

## Throws

TalawaGraphQLError with code "unauthenticated" if user is not authenticated.

## Throws

TalawaGraphQLError with code "unexpected" if event is not found (indicates data corruption).
=======
## Returns

`Promise`\<\{ `allDay`: `boolean`; `attachments`: `never`[]; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \}\>
>>>>>>> upstream
