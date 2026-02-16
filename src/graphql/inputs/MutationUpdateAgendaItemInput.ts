<<<<<<< HEAD
import { z } from "zod";
import {
	AGENDA_ITEM_DESCRIPTION_MAX_LENGTH,
	AGENDA_ITEM_NAME_MAX_LENGTH,
	AGENDA_ITEM_NOTES_MAX_LENGTH,
	agendaItemsTableInsertSchema,
} from "~/src/drizzle/tables/agendaItems";
import { builder } from "~/src/graphql/builder";
import { sanitizedStringSchema } from "~/src/utilities/sanitizer";
import {
	FileMetadataInput,
	fileMetadataInputSchema,
} from "./FileMetadataInput";

export const MutationUpdateAgendaItemInputSchema = agendaItemsTableInsertSchema
	.pick({
		duration: true,
		key: true,
	})
	.partial()
	.extend({
		attachments: z.array(fileMetadataInputSchema).max(10).optional(),
		description: sanitizedStringSchema
			.min(1)
			.max(AGENDA_ITEM_DESCRIPTION_MAX_LENGTH)
			.optional(),
		notes: sanitizedStringSchema
			.min(1)
			.max(AGENDA_ITEM_NOTES_MAX_LENGTH)
			.nullable()
			.optional(),
		categoryId: agendaItemsTableInsertSchema.shape.categoryId.optional(),
		folderId: agendaItemsTableInsertSchema.shape.folderId.optional(),
		id: agendaItemsTableInsertSchema.shape.id.unwrap(),
		name: sanitizedStringSchema
			.min(1)
			.max(AGENDA_ITEM_NAME_MAX_LENGTH)
			.optional(),
		url: z
			.array(z.object({ url: z.string().url() }))
			.max(5)
			.optional(),
=======
import type { z } from "zod";
import { agendaItemsTableInsertSchema } from "~/src/drizzle/tables/agendaItems";
import { builder } from "~/src/graphql/builder";

export const MutationUpdateAgendaItemInputSchema = agendaItemsTableInsertSchema
	.pick({
		description: true,
		duration: true,
		key: true,
	})
	.extend({
		folderId: agendaItemsTableInsertSchema.shape.folderId.optional(),
		id: agendaItemsTableInsertSchema.shape.id.unwrap(),
		name: agendaItemsTableInsertSchema.shape.name.optional(),
>>>>>>> upstream
	})
	.refine(
		({ id, ...remainingArg }) =>
			Object.values(remainingArg).some((value) => value !== undefined),
		{
			message: "At least one optional argument must be provided.",
		},
	);

<<<<<<< HEAD
const UpdateAgendaItemUrlInput = builder.inputType("UpdateAgendaItemUrlInput", {
	description: "URL associated with an agenda item",
	fields: (t) => ({
		url: t.string({
			description: "URL of the agenda item",
			required: true,
		}),
	}),
});

=======
>>>>>>> upstream
export const MutationUpdateAgendaItemInput = builder
	.inputRef<z.infer<typeof MutationUpdateAgendaItemInputSchema>>(
		"MutationUpdateAgendaItemInput",
	)
	.implement({
		description: "",
		fields: (t) => ({
<<<<<<< HEAD
			attachments: t.field({
				description:
					"File metadata for attachments uploaded via MinIO presigned URLs.",
				required: false,
				type: [FileMetadataInput],
			}),
			description: t.string({
				description: "Custom information about the agenda item.",
				required: false,
			}),
			duration: t.string({
				description: "Duration of the agenda item.",
				required: false,
			}),
			categoryId: t.id({
				description: "Global identifier of the associated agenda category.",
				required: false,
			}),
			folderId: t.id({
				description: "Global identifier of the associated agenda folder.",
				required: false,
=======
			description: t.string({
				description: "Custom information about the agenda item.",
			}),
			duration: t.string({
				description: "Duration of the agenda item.",
			}),
			folderId: t.id({
				description: "Global identifier of the associated agenda folder.",
>>>>>>> upstream
			}),
			id: t.id({
				description: "Global identifier of the agenda item.",
				required: true,
			}),
			key: t.string({
				description: `Key of the agenda item if it's of a "song" type. More information at [this](https://en.wikipedia.org/wiki/Key_(music)) link.`,
<<<<<<< HEAD
				required: false,
			}),
			name: t.string({
				description: "Name of the agenda item.",
				required: false,
			}),
			notes: t.string({
				description: "Notes of the agenda item.",
				required: false,
			}),
			url: t.field({
				type: [UpdateAgendaItemUrlInput],
				required: false,
=======
			}),
			name: t.string({
				description: "Name of the agenda item.",
>>>>>>> upstream
			}),
		}),
	});
