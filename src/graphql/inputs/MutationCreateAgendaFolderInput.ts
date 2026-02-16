import type { z } from "zod";
import { agendaFoldersTableInsertSchema } from "~/src/drizzle/tables/agendaFolders";
import { builder } from "~/src/graphql/builder";

export const mutationCreateAgendaFolderInputSchema =
	agendaFoldersTableInsertSchema.pick({
		eventId: true,
<<<<<<< HEAD
		name: true,
		organizationId: true,
		description: true,
		sequence: true,
=======
		isAgendaItemFolder: true,
		name: true,
		parentFolderId: true,
>>>>>>> upstream
	});

export const MutationCreateAgendaFolderInput = builder
	.inputRef<z.infer<typeof mutationCreateAgendaFolderInputSchema>>(
		"MutationCreateAgendaFolderInput",
	)
	.implement({
<<<<<<< HEAD
		description: "Input type for creating a new agenda folder.",
		fields: (t) => ({
			description: t.string({
				description: "Description of Agenda Folder",
			}),
=======
		description: "",
		fields: (t) => ({
>>>>>>> upstream
			eventId: t.id({
				description:
					"Global identifier of the event the agenda folder is associated to.",
				required: true,
			}),
<<<<<<< HEAD
=======
			isAgendaItemFolder: t.boolean({
				description:
					"Boolean to tell if the agenda folder is meant to be a folder for agenda items or a parent folder for other agenda folders.",
				required: true,
			}),
>>>>>>> upstream
			name: t.string({
				description: "Name of the agenda folder.",
				required: true,
			}),
<<<<<<< HEAD
			organizationId: t.id({
				description: "ID of the organization this folder belongs to.",
				required: true,
			}),
			sequence: t.int({
				description: "Sequence of the Agenda Folder.",
=======
			parentFolderId: t.id({
				description:
					"Global identifier of the agenda folder the agenda folder is contained within.",
>>>>>>> upstream
			}),
		}),
	});
