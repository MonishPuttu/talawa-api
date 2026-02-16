import type { venuesTable } from "~/src/drizzle/tables/venues";
import { builder } from "~/src/graphql/builder";
import {
	VenueAttachment,
	type VenueAttachment as VenueAttachmentType,
} from "~/src/graphql/types/VenueAttachment/VenueAttachment";
<<<<<<< HEAD
import { escapeHTML } from "~/src/utilities/sanitizer";
=======
>>>>>>> upstream

export type Venue = typeof venuesTable.$inferSelect & {
	attachments: VenueAttachmentType[] | null;
};

export const Venue = builder.objectRef<Venue>("Venue");

Venue.implement({
	description:
		"Venues are physical locations associated to organizations where they conduct their events.",
	fields: (t) => ({
		capacity: t.exposeInt("capacity", {
			description: "Capacity of the venue.",
		}),
		attachments: t.expose("attachments", {
			description: "Array of attachments.",
			type: t.listRef(VenueAttachment),
		}),
<<<<<<< HEAD
		description: t.string({
			description: "Custom information about the venue.",
			nullable: true,
			resolve: (parent) =>
				parent.description != null ? escapeHTML(parent.description) : null,
=======
		description: t.exposeString("description", {
			description: "Custom information about the venue.",
>>>>>>> upstream
		}),
		id: t.exposeID("id", {
			description: "Global identifier of the venue.",
			nullable: false,
		}),
<<<<<<< HEAD
		name: t.string({
			description: "Name of the venue.",
			resolve: (parent) => escapeHTML(parent.name),
=======
		name: t.exposeString("name", {
			description: "Name of the venue.",
>>>>>>> upstream
		}),
	}),
});
