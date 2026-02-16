[API Docs](/)

***

# Class: GraphQLSchemaManager

<<<<<<< HEAD
Defined in: [src/graphql/schemaManager.ts:16](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L16)
=======
Defined in: [src/graphql/schemaManager.ts:15](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L15)
>>>>>>> upstream

## Constructors

### Constructor

> **new GraphQLSchemaManager**(): `GraphQLSchemaManager`

#### Returns

`GraphQLSchemaManager`

## Methods

### buildInitialSchema()

> **buildInitialSchema**(): `Promise`\<`GraphQLSchema`\>

<<<<<<< HEAD
Defined in: [src/graphql/schemaManager.ts:42](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L42)
=======
Defined in: [src/graphql/schemaManager.ts:41](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L41)
>>>>>>> upstream

Build the initial schema

#### Returns

`Promise`\<`GraphQLSchema`\>

***

### getCurrentSchema()

> **getCurrentSchema**(): `GraphQLSchema` \| `null`

<<<<<<< HEAD
Defined in: [src/graphql/schemaManager.ts:266](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L266)
=======
Defined in: [src/graphql/schemaManager.ts:255](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L255)
>>>>>>> upstream

Get the current schema

#### Returns

`GraphQLSchema` \| `null`

***

### onSchemaUpdate()

> **onSchemaUpdate**(`callback`): `void`

<<<<<<< HEAD
Defined in: [src/graphql/schemaManager.ts:237](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L237)
=======
Defined in: [src/graphql/schemaManager.ts:226](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L226)
>>>>>>> upstream

Register a callback to be notified when the schema is updated

#### Parameters

##### callback

(`schema`) => `void`

#### Returns

`void`

***

### rebuildSchema()

> **rebuildSchema**(): `Promise`\<`GraphQLSchema`\>

<<<<<<< HEAD
Defined in: [src/graphql/schemaManager.ts:62](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L62)
=======
Defined in: [src/graphql/schemaManager.ts:61](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L61)
>>>>>>> upstream

Dynamically rebuild the GraphQL schema

#### Returns

`Promise`\<`GraphQLSchema`\>

***

### removeSchemaUpdateCallback()

> **removeSchemaUpdateCallback**(`callback`): `void`

<<<<<<< HEAD
Defined in: [src/graphql/schemaManager.ts:244](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L244)
=======
Defined in: [src/graphql/schemaManager.ts:233](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/graphql/schemaManager.ts#L233)
>>>>>>> upstream

Remove a schema update callback

#### Parameters

##### callback

(`schema`) => `void`

#### Returns

`void`
