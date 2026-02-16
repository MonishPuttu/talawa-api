[API Docs](/)

***

# Interface: ResolveInstanceInput

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:65](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L65)
=======
Defined in: [src/services/eventGeneration/types.ts:56](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L56)
>>>>>>> upstream

Input for resolving instance with inheritance

## Properties

### baseTemplate

<<<<<<< HEAD
> **baseTemplate**: [`EventTemplateWithAttachments`](../type-aliases/EventTemplateWithAttachments.md)

Defined in: [src/services/eventGeneration/types.ts:67](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L67)

***

### exception?

> `optional` **exception**: `object`

Defined in: [src/services/eventGeneration/types.ts:68](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L68)
=======
> **baseTemplate**: `object`

Defined in: [src/services/eventGeneration/types.ts:58](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L58)

#### allDay

> **allDay**: `boolean`
>>>>>>> upstream

#### createdAt

> **createdAt**: `Date`

#### creatorId

> **creatorId**: `string` \| `null`

<<<<<<< HEAD
=======
#### description

> **description**: `string` \| `null`

#### endAt

> **endAt**: `Date`

#### id

> **id**: `string`

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

### exception?

> `optional` **exception**: `object`

Defined in: [src/services/eventGeneration/types.ts:59](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L59)

#### createdAt

> **createdAt**: `Date`

#### creatorId

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

### generatedInstance

> **generatedInstance**: `object`

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/types.ts:66](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L66)
=======
Defined in: [src/services/eventGeneration/types.ts:57](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/types.ts#L57)
>>>>>>> upstream

#### actualEndTime

> **actualEndTime**: `Date`

#### actualStartTime

> **actualStartTime**: `Date`

#### baseRecurringEventId

> **baseRecurringEventId**: `string`

#### generatedAt

> **generatedAt**: `Date`

#### id

> **id**: `string`

#### isCancelled

> **isCancelled**: `boolean`

#### lastUpdatedAt

> **lastUpdatedAt**: `Date` \| `null`

#### organizationId

> **organizationId**: `string`

#### originalInstanceStartTime

> **originalInstanceStartTime**: `Date`

#### originalSeriesId

> **originalSeriesId**: `string`

#### recurrenceRuleId

> **recurrenceRuleId**: `string`

#### sequenceNumber

> **sequenceNumber**: `number`

#### totalCount

> **totalCount**: `number` \| `null`

#### version

> **version**: `string`
