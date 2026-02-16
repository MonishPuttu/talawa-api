<<<<<<< HEAD
import type { z } from "zod";
import { communitiesTableInsertSchema } from "~/src/drizzle/tables/communities";
import { builder } from "~/src/graphql/builder";
import { url } from "~/src/graphql/validators/core";
import {
	FileMetadataInput,
	fileMetadataInputSchema,
} from "./FileMetadataInput";
=======
import type { FileUpload } from "graphql-upload-minimal";
import { z } from "zod";
import { communitiesTableInsertSchema } from "~/src/drizzle/tables/communities";
import { builder } from "~/src/graphql/builder";
>>>>>>> upstream

export const mutationUpdateCommunityInputSchema = communitiesTableInsertSchema
	.omit({
		createdAt: true,
		id: true,
		logoMimeType: true,
		logoName: true,
		name: true,
		updatedAt: true,
		updaterId: true,
	})
	.extend({
<<<<<<< HEAD
		facebookURL: url.nullable().optional(),
		githubURL: url.nullable().optional(),
		instagramURL: url.nullable().optional(),
		linkedinURL: url.nullable().optional(),
		logo: fileMetadataInputSchema.nullish(),
		name: communitiesTableInsertSchema.shape.name.trim().optional(),
		redditURL: url.nullable().optional(),
		slackURL: url.nullable().optional(),
		websiteURL: url.nullable().optional(),
		xURL: url.nullable().optional(),
		youtubeURL: url.nullable().optional(),
=======
		logo: z.custom<Promise<FileUpload>>().nullish(),
		name: communitiesTableInsertSchema.shape.name.optional(),
>>>>>>> upstream
	})
	.refine((arg) => Object.values(arg).some((value) => value !== undefined), {
		message: "At least one optional argument must be provided.",
	});

export const MutationUpdateCommunityInput = builder
	.inputRef<z.infer<typeof mutationUpdateCommunityInputSchema>>(
		"MutationUpdateCommunityInput",
	)
	.implement({
		description: "",
		fields: (t) => ({
			facebookURL: t.string({
				description: "URL to the facebook account of the community.",
<<<<<<< HEAD
				required: false,
			}),
			githubURL: t.string({
				description: "URL to the GitHub account of the community.",
				required: false,
=======
			}),
			githubURL: t.string({
				description: "URL to the gitGub account of the community.",
>>>>>>> upstream
			}),
			inactivityTimeoutDuration: t.int({
				description:
					"Duration in seconds it should take for inactive clients to get timed out of their authenticated session within client-side talawa applications.",
			}),
			instagramURL: t.string({
				description: "URL to the instagram account of the community.",
<<<<<<< HEAD
				required: false,
			}),
			linkedinURL: t.string({
				description: "URL to the linkedin account of the community.",
				required: false,
			}),
			logo: t.field({
				description: "Logo of the community.",
				required: false,
				type: FileMetadataInput,
			}),
			name: t.string({
				description: "Name of the community.",
				required: false,
			}),
			redditURL: t.string({
				description: "URL to the reddit account of the community.",
				required: false,
			}),
			slackURL: t.string({
				description: "URL to the slack account of the community.",
				required: false,
			}),
			websiteURL: t.string({
				description: "URL to the website of the community.",
				required: false,
			}),
			xURL: t.string({
				description: "URL to the x account of the community.",
				required: false,
			}),
			youtubeURL: t.string({
				description: "URL to the youtube account of the community.",
				required: false,
=======
			}),
			linkedinURL: t.string({
				description: "URL to the linkedin account of the community.",
			}),
			logo: t.field({
				description: "Mime type of the logo of the community.",
				type: "Upload",
			}),
			name: t.string({
				description: "Name of the community.",
			}),
			redditURL: t.string({
				description: "URL to the reddit account of the community.",
			}),
			slackURL: t.string({
				description: "URL to the slack account of the community.",
			}),
			websiteURL: t.string({
				description: "URL to the website of the community.",
			}),
			xURL: t.string({
				description: "URL to the x account of the community.",
			}),
			youtubeURL: t.string({
				description: "URL to the youtube account of the community.",
>>>>>>> upstream
			}),
		}),
	});
