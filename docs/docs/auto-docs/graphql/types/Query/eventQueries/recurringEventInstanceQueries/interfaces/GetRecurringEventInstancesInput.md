[API Docs](/)

***

# Interface: GetRecurringEventInstancesInput

<<<<<<< HEAD
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:18](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L18)

Defines the input parameters for querying recurring event instances.
=======
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:17](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L17)

## Description

Defines the input parameters for querying recurring event event instances.
>>>>>>> upstream

## Properties

### endDate

> **endDate**: `Date`

<<<<<<< HEAD
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:21](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L21)

***

### excludeInstanceIds?

> `optional` **excludeInstanceIds**: `string`[]

Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:38](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L38)

Optional array of instance IDs to exclude from the results.
Useful for filtering out specific instances that should not be returned,
such as instances that have already been processed or displayed.
=======
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:20](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L20)
>>>>>>> upstream

***

### includeCancelled?

> `optional` **includeCancelled**: `boolean`

<<<<<<< HEAD
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:22](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L22)
=======
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:21](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L21)
>>>>>>> upstream

***

### limit?

> `optional` **limit**: `number`

<<<<<<< HEAD
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:27](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L27)

Optional maximum number of instances to return (defaults to 1000).
Must be a positive integer.

***

### offset?

> `optional` **offset**: `number`

Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:32](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L32)

Optional number of instances to skip (defaults to 0).
Must be a non-negative integer.
=======
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:25](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L25)

#### Description

An optional limit on the number of instances to return.
>>>>>>> upstream

***

### organizationId

> **organizationId**: `string`

<<<<<<< HEAD
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:19](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L19)
=======
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:18](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L18)
>>>>>>> upstream

***

### startDate

> **startDate**: `Date`

<<<<<<< HEAD
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:20](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L20)
=======
Defined in: [src/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts:19](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/types/Query/eventQueries/recurringEventInstanceQueries.ts#L19)
>>>>>>> upstream
