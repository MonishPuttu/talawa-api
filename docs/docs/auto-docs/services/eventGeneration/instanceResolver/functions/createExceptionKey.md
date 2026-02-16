[API Docs](/)

***

# Function: createExceptionKey()

> **createExceptionKey**(`recurringEventId`, `instanceStartTime`): `string`

<<<<<<< HEAD
Defined in: [src/services/eventGeneration/instanceResolver.ts:212](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/instanceResolver.ts#L212)
=======
Defined in: [src/services/eventGeneration/instanceResolver.ts:204](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/services/eventGeneration/instanceResolver.ts#L204)
>>>>>>> upstream

Creates a composite key for the exception lookup map.
This key is used to uniquely identify an exception based on the recurring event ID
and the original start time of the instance.

## Parameters

### recurringEventId

`string`

The ID of the recurring event.

### instanceStartTime

`Date`

The original start time of the instance.

## Returns

`string`

<<<<<<< HEAD
- A string representing the composite key.
=======
A string representing the composite key.
>>>>>>> upstream
