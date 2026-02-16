[API Docs](/)

***

# Variable: minioClient()

> `const` **minioClient**: (`fastify`) => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [src/fastifyPlugins/minioClient.ts:29](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/fastifyPlugins/minioClient.ts#L29)
=======
Defined in: [src/fastifyPlugins/minioClient.ts:27](https://github.com/PalisadoesFoundation/talawa-api/tree/mainsrc/fastifyPlugins/minioClient.ts#L27)
>>>>>>> upstream

Integrates the talawa minio bucket name and a minio client instance on the namespaces `minio.bucketName` and `minio.client` respectively on the global fastify instance.

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
import minioClientPlugin from "~src/plugins/minioClient";

fastify.register(minioClientPlugin, {});
const buckets = await fastify.minio.client.listBuckets();
```
