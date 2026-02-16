<<<<<<< HEAD
import { z } from "zod";
import { venuesTableInsertSchema } from "~/src/drizzle/tables/venues";
import { builder } from "~/src/graphql/builder";
import {
	FileMetadataInput,
	fileMetadataInputSchema,
} from "./FileMetadataInput";
=======
import type { FileUpload } from "graphql-upload-minimal";
import { z } from "zod";
import { venuesTableInsertSchema } from "~/src/drizzle/tables/venues";
import { builder } from "~/src/graphql/builder";
>>>>>>> upstream

export const mutationCreateVenueInputSchema = venuesTableInsertSchema
	.pick({
		capacity: true,
		description: true,
		name: true,
		organizationId: true,
	})
	.extend({
<<<<<<< HEAD
		attachments: z.array(fileMetadataInputSchema).min(1).max(20).optional(),
=======
		attachments: z
			.custom<Promise<FileUpload>>()
			.array()
			.min(1)
			.max(20)
			.optional(),
>>>>>>> upstream
	});

export const MutationCreateVenueInput = builder
	.inputRef<z.infer<typeof mutationCreateVenueInputSchema>>(
		"MutationCreateVenueInput",
	)
	.implement({
		description: "",
		fields: (t) => ({
			capacity: t.int({
				description: "Capacity of the venue.",
			}),
			attachments: t.field({
<<<<<<< HEAD
				description:
					"File metadata for attachments uploaded via MinIO presigned URLs.",
				required: false,
				type: [FileMetadataInput],
=======
				description: "Attachments of the venue.",
				type: t.listRef("Upload", { required: true }),
				// Keep the list optional...
				required: false,
>>>>>>> upstream
			}),
			description: t.string({
				description: "Custom information about the venue.",
			}),
			name: t.string({
				description: "Name of the venue.",
				required: true,
			}),
			organizationId: t.id({
				description: "Global identifier of the associated organization.",
				required: true,
			}),
		}),
	});
