[API Docs](/)

***

# Variable: drizzleClient()

> `const` **drizzleClient**: (`fastify`) => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/fastifyPlugins/drizzleClient.ts:28](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/fastifyPlugins/drizzleClient.ts#L28)
=======
Defined in: [src/fastifyPlugins/drizzleClient.ts:22](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/fastifyPlugins/drizzleClient.ts#L22)
>>>>>>> upstream

Integrates a drizzle client instance on a namespace `drizzleClient` on the global fastify instance.

## Parameters

### fastify

`FastifyInstance`\<`RawServerDefault`, `IncomingMessage`, `ServerResponse`\<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\>

## Returns

`Promise`\<`void`\>

## Example

<<<<<<< HEAD
```typescript
=======
```ts
>>>>>>> upstream
import drizzleClientPlugin from "~/src/plugins/drizzleClient";

fastify.register(drizzleClientPlugin, {});
const user = await fastify.drizzleClient.query.usersTable.findFirst();
```
