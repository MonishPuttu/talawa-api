<<<<<<< HEAD
import { z } from "zod";
import { postAttachmentMimeTypeEnum } from "~/src/drizzle/enums/postAttachmentMimeType";
import { agendaItemsTableInsertSchema } from "~/src/drizzle/tables/agendaItems";
import { builder } from "~/src/graphql/builder";
import { AgendaItemType } from "~/src/graphql/enums/AgendaItemType";
import { PostAttachmentMimeType } from "../enums/PostAttachmentMimeType";
=======
import type { z } from "zod";
import { agendaItemsTableInsertSchema } from "~/src/drizzle/tables/agendaItems";
import { builder } from "~/src/graphql/builder";
import { AgendaItemType } from "~/src/graphql/enums/AgendaItemType";
>>>>>>> upstream

export const mutationCreateAgendaItemInputSchema = agendaItemsTableInsertSchema
	.pick({
		description: true,
		duration: true,
<<<<<<< HEAD
		eventId: true,
		folderId: true,
		categoryId: true,
		notes: true,
		key: true,
		name: true,
		sequence: true,
		type: true,
	})
	.extend({
		folderId: z.string().uuid().optional(),
		categoryId: z.string().uuid().optional(),
		url: z
			.array(
				z.object({
					url: z.string().url(),
				}),
			)
			.max(10)
			.optional(),
		attachments: z
			.array(
				z.object({
					name: z.string().min(1),
					mimeType: z.enum(postAttachmentMimeTypeEnum.options),
					objectName: z.string().min(1),
					fileHash: z.string().min(1),
				}),
			)
			.max(10)
			.optional(),
	})
=======
		folderId: true,
		key: true,
		name: true,
		type: true,
	})
>>>>>>> upstream
	.superRefine((arg, ctx) => {
		if (arg.type === "note") {
			if (arg.duration !== undefined && arg.key !== undefined) {
				ctx.addIssue({
					code: "custom",
					message: `Cannot be provided for an agenda item of type "${arg.type}".`,
					path: ["duration"],
				});
				ctx.addIssue({
					code: "custom",
					message: `Cannot be provided for an agenda item of type "${arg.type}".`,
					path: ["key"],
				});
			} else if (arg.duration !== undefined) {
				ctx.addIssue({
					code: "custom",
					message: `Cannot be provided for an agenda item of type "${arg.type}".`,
					path: ["duration"],
				});
<<<<<<< HEAD
			} else if (arg.key !== undefined) {
=======
			} else {
>>>>>>> upstream
				ctx.addIssue({
					code: "custom",
					message: `Cannot be provided for an agenda item of type "${arg.type}".`,
					path: ["key"],
				});
			}
		}

		if (
			(arg.type === "general" || arg.type === "scripture") &&
			arg.key !== undefined
		) {
			ctx.addIssue({
				code: "custom",
				message: `Cannot be provided for an agenda item of type "${arg.type}".`,
				path: ["key"],
			});
		}
	});

<<<<<<< HEAD
const AgendaItemUrlInput = builder.inputType("AgendaItemUrlInput", {
	description: "URL associated with an agenda item",
	fields: (t) => ({
		url: t.string({
			description: "URL of the agenda item",
			required: true,
		}),
	}),
});

const AgendaItemAttachmentInput = builder.inputType(
	"AgendaItemAttachmentInput",
	{
		description: "Attachment data for an agenda item",
		fields: (t) => ({
			name: t.string({ required: true }),
			mimeType: t.field({
				required: true,
				type: PostAttachmentMimeType,
			}),
			objectName: t.string({ required: true }),
			fileHash: t.string({ required: true }),
		}),
	},
);

=======
>>>>>>> upstream
export const MutationCreateAgendaItemInput = builder
	.inputRef<z.infer<typeof mutationCreateAgendaItemInputSchema>>(
		"MutationCreateAgendaItemInput",
	)
	.implement({
<<<<<<< HEAD
		description: "Input type for creating a new agenda item.",
		fields: (t) => ({
			attachments: t.field({
				description: "Attachments for the agenda items.",
				required: false,
				type: [AgendaItemAttachmentInput],
			}),
			description: t.string({
				description: "Custom information about the agenda item.",
			}),
			categoryId: t.id({
				description: "Category id",
			}),
			duration: t.string({
				description: "Duration of the agenda item.",
			}),
			eventId: t.id({
				description:
					"Global identifier of the event the agenda item is associated to.",
				required: true,
			}),
			folderId: t.id({
				description:
					"Global identifier of the agenda folder the agenda item is associated to.",
=======
		description: "",
		fields: (t) => ({
			description: t.string({
				description: "Custom information about the agenda item.",
			}),
			duration: t.string({
				description: "Duration of the agenda item.",
			}),
			folderId: t.id({
				description:
					"Global identifier of the agenda folder the agenda item is associated to.",
				required: true,
>>>>>>> upstream
			}),
			key: t.string({
				description: `Key of the agenda item if it's of a "song" type. More information at [this](https://en.wikipedia.org/wiki/Key_(music)) link.`,
			}),
			name: t.string({
				description: "Name of the agenda item.",
				required: true,
			}),
<<<<<<< HEAD
			notes: t.string({
				description: "Notes for the agenda item",
				required: false,
			}),
			sequence: t.int({
				description: "Sequence of the AgendaItem.",
				required: true,
			}),
=======
>>>>>>> upstream
			type: t.field({
				description: "Type of the agenda item.",
				required: true,
				type: AgendaItemType,
			}),
<<<<<<< HEAD
			url: t.field({
				description: "URLs associated with the agenda item.",
				type: [AgendaItemUrlInput],
				required: false,
			}),
=======
>>>>>>> upstream
		}),
	});
