[API Docs](/)

***

# Variable: routes()

> `const` **routes**: (`fastify`) => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/routes/index.ts:16](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/routes/index.ts#L16)
=======
Defined in: [src/routes/index.ts:14](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/routes/index.ts#L14)
>>>>>>> upstream

This fastify plugin function contains all talawa api routes within it.

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
import routes from "./routes/index";
fastify.register(routes, {});
```
