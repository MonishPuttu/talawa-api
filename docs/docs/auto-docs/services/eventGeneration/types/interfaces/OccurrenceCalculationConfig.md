[API Docs](/)

***

# Interface: OccurrenceCalculationConfig

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:34](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L34)
=======
Defined in: [src/services/eventGeneration/types.ts:33](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L33)
>>>>>>> upstream

Configuration for occurrence calculation

## Properties

### baseEvent

> **baseEvent**: `object`

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:36](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L36)
=======
Defined in: [src/services/eventGeneration/types.ts:35](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L35)
>>>>>>> upstream

#### allDay

> **allDay**: `boolean`

#### createdAt

> **createdAt**: `Date`

#### creatorId

> **creatorId**: `string` \| `null`

#### description

> **description**: `string` \| `null`

#### endAt

> **endAt**: `Date`

#### id

> **id**: `string`

<<<<<<< HEAD
#### isInviteOnly

> **isInviteOnly**: `boolean`

=======
>>>>>>> upstream
#### isPublic

> **isPublic**: `boolean`

#### isRecurringEventTemplate

> **isRecurringEventTemplate**: `boolean`

#### isRegisterable

> **isRegisterable**: `boolean`

#### location

> **location**: `string` \| `null`

#### name

> **name**: `string`

#### organizationId

> **organizationId**: `string`

#### startAt

> **startAt**: `Date`

#### updatedAt

> **updatedAt**: `Date` \| `null`

#### updaterId

> **updaterId**: `string` \| `null`

***

### exceptions

> **exceptions**: `object`[]

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:39](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L39)
=======
Defined in: [src/services/eventGeneration/types.ts:38](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L38)
>>>>>>> upstream

#### createdAt

> **createdAt**: `Date`

#### creatorId

<<<<<<< HEAD
> **creatorId**: `string` \| `null`
=======
> **creatorId**: `string`
>>>>>>> upstream

#### exceptionData

> **exceptionData**: `unknown`

#### id

> **id**: `string`

#### organizationId

> **organizationId**: `string`

#### recurringEventInstanceId

> **recurringEventInstanceId**: `string`

#### updatedAt

> **updatedAt**: `Date` \| `null`

#### updaterId

> **updaterId**: `string` \| `null`

***

### recurrenceRule

> **recurrenceRule**: `object`

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:35](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L35)
=======
Defined in: [src/services/eventGeneration/types.ts:34](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L34)
>>>>>>> upstream

#### baseRecurringEventId

> **baseRecurringEventId**: `string`

#### byDay

> **byDay**: `string`[] \| `null`

#### byMonth

> **byMonth**: `number`[] \| `null`

#### byMonthDay

> **byMonthDay**: `number`[] \| `null`

#### count

> **count**: `number` \| `null`

#### createdAt

> **createdAt**: `Date`

#### creatorId

> **creatorId**: `string`

#### frequency

> **frequency**: `"DAILY"` \| `"WEEKLY"` \| `"MONTHLY"` \| `"YEARLY"`

#### id

> **id**: `string`

#### interval

> **interval**: `number`

#### latestInstanceDate

> **latestInstanceDate**: `Date`

#### organizationId

> **organizationId**: `string`

#### originalSeriesId

> **originalSeriesId**: `string` \| `null`

#### recurrenceEndDate

> **recurrenceEndDate**: `Date` \| `null`

#### recurrenceRuleString

> **recurrenceRuleString**: `string`

#### recurrenceStartDate

> **recurrenceStartDate**: `Date`

#### updatedAt

> **updatedAt**: `Date` \| `null`

#### updaterId

> **updaterId**: `string` \| `null`

***

### windowEnd

> **windowEnd**: `Date`

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:38](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L38)
=======
Defined in: [src/services/eventGeneration/types.ts:37](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L37)
>>>>>>> upstream

***

### windowStart

> **windowStart**: `Date`

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:37](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L37)
=======
Defined in: [src/services/eventGeneration/types.ts:36](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L36)
>>>>>>> upstream
