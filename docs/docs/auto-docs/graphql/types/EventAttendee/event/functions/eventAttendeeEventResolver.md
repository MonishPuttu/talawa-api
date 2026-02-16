[API Docs](/)

***

# Function: eventAttendeeEventResolver()

<<<<<<< HEAD
> **eventAttendeeEventResolver**(`parent`, `_args`, `ctx`): `Promise`\<[`Event`](../../../Event/Event/type-aliases/Event.md) \| `null`\>

Defined in: [src/graphql/types/EventAttendee/event.ts:20](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/EventAttendee/event.ts#L20)

Resolves the event that an event attendee is associated with.
=======
> **eventAttendeeEventResolver**(`parent`, `_args`, `ctx`): `Promise`\<\{ `allDay`: `boolean`; `attachments`: `never`[]; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \} \| `null`\>

Defined in: [src/graphql/types/EventAttendee/event.ts:10](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/EventAttendee/event.ts#L10)
>>>>>>> upstream

## Parameters

### parent

<<<<<<< HEAD
The parent EventAttendee object containing the eventId or recurringEventInstanceId.

=======
>>>>>>> upstream
#### checkinTime

`Date` \| `null`

#### checkoutTime

`Date` \| `null`

#### createdAt

`Date`

#### eventId

`string` \| `null`

#### feedbackSubmitted

`boolean`

#### id

`string`

#### isCheckedIn

`boolean`

#### isCheckedOut

`boolean`

#### isInvited

`boolean`

#### isRegistered

`boolean`

#### recurringEventInstanceId

`string` \| `null`

#### updatedAt

`Date` \| `null`

#### userId

`string`

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

`Promise`\<[`Event`](../../../Event/Event/type-aliases/Event.md) \| `null`\>

The event the attendee is associated with.

## Throws

TalawaGraphQLError with code "unauthenticated" if user is not authenticated.

## Throws

TalawaGraphQLError with code "unexpected" if event is not found (indicates data corruption).
=======
## Returns

`Promise`\<\{ `allDay`: `boolean`; `attachments`: `never`[]; `createdAt`: `Date`; `creatorId`: `string` \| `null`; `description`: `string` \| `null`; `endAt`: `Date`; `id`: `string`; `isPublic`: `boolean`; `isRecurringEventTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string` \| `null`; `name`: `string`; `organizationId`: `string`; `startAt`: `Date`; `updatedAt`: `Date` \| `null`; `updaterId`: `string` \| `null`; \} \| `null`\>
>>>>>>> upstream
