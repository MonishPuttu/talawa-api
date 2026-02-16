import { relations, sql } from "drizzle-orm";
import {
<<<<<<< HEAD
	boolean,
	index,
	integer,
=======
	type AnyPgColumn,
	boolean,
	index,
>>>>>>> upstream
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { uuidv7 } from "uuidv7";
import { agendaItemsTable } from "./agendaItems";
import { eventsTable } from "./events";
<<<<<<< HEAD
import { organizationsTable } from "./organizations";
=======
>>>>>>> upstream
import { usersTable } from "./users";

/**
 * Drizzle orm postgres table definition for agenda folders.
 */
export const agendaFoldersTable = pgTable(
	"agenda_folders",
	{
		/**
		 * Date time at the time the agenda folder was created.
		 */
		createdAt: timestamp("created_at", {
			mode: "date",
			precision: 3,
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
		/**
		 * Foreign key reference to the id of the user who created the agenda folder.
		 */
		creatorId: uuid("creator_id").references(() => usersTable.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),
		/**
<<<<<<< HEAD
		 * Description about the agenda folder.
		 */
		description: text("description"),
		/**
=======
>>>>>>> upstream
		 * Foreign key reference to the id of the event the agenda folder is associated to.
		 */
		eventId: uuid("event_id")
			.notNull()
			.references(() => eventsTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		/**
		 * Primary unique identifier of the agenda folder.
		 */
		id: uuid("id").primaryKey().$default(uuidv7),
		/**
<<<<<<< HEAD
		 * Boolean to tell if the agenda folder is default or not.
		 */
		isDefaultFolder: boolean("is_default_folder").notNull().default(false),
=======
		 * Boolean to tell if the agenda folder is meant to be a folder for agenda items or a parent folder for other agenda folders.
		 */
		isAgendaItemFolder: boolean("is_agenda_item_folder").notNull(),
>>>>>>> upstream
		/**
		 * Name of the agenda folder.
		 */
		name: text("name", {}).notNull(),
		/**
<<<<<<< HEAD
		 * Many to one relationship from `agenda_folders` table to `organizations` table.
		 */
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organizationsTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		/**
		 * Sequence of the agenda folder.
		 */
		sequence: integer("sequence"),
=======
		 * Foreign key reference to the id of the agenda folder the agenda folder is contained within.
		 */
		parentFolderId: uuid("parent_folder_id").references(
			(): AnyPgColumn => agendaFoldersTable.id,
			{
				onDelete: "cascade",
				onUpdate: "cascade",
			},
		),
>>>>>>> upstream
		/**
		 * Date time at the time the agenda folder was last updated.
		 */
		updatedAt: timestamp("updated_at", {
			mode: "date",
			precision: 3,
			withTimezone: true,
		})
			.$defaultFn(() => sql`${null}`)
			.$onUpdate(() => new Date()),
		/**
		 * Foreign key reference to the id of the user who last updated the agenda folder.
		 */
		updaterId: uuid("updater_id").references(() => usersTable.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),
	},
	(self) => [
		index().on(self.createdAt),
		index().on(self.creatorId),
		index().on(self.eventId),
<<<<<<< HEAD
		index().on(self.name),
		index().on(self.organizationId),
=======
		index().on(self.isAgendaItemFolder),
		index().on(self.name),
		index().on(self.parentFolderId),
>>>>>>> upstream
	],
);

export const agendaFoldersTableRelations = relations(
	agendaFoldersTable,
	({ many, one }) => ({
		/**
		 * One to many relationship from `agenda_folders` table to `agenda_items` table.
		 */
		agendaItemsWhereFolder: many(agendaItemsTable, {
			relationName: "agenda_items.folder_id:agenda_folders.id",
		}),
		/**
<<<<<<< HEAD
=======
		 * One to many relationship from `agenda_folders` table to `agenda_folders` table.
		 */
		agendaFoldersWhereParentFolder: many(agendaFoldersTable, {
			relationName: "agenda_folders.id:agenda_folders.parent_folder_id",
		}),
		/**
>>>>>>> upstream
		 * Many to one relationship from `agenda_folders` table to `users` table.
		 */
		creator: one(usersTable, {
			fields: [agendaFoldersTable.creatorId],
			references: [usersTable.id],
			relationName: "agenda_folders.creator_id:users.id",
		}),
		/**
		 * Many to one relationship from `agenda_folders` table to `events` table.
		 */
		event: one(eventsTable, {
			fields: [agendaFoldersTable.eventId],
			references: [eventsTable.id],
			relationName: "agenda_folders.event_id:events.id",
		}),
<<<<<<< HEAD
		organization: one(organizationsTable, {
			fields: [agendaFoldersTable.organizationId],
			references: [organizationsTable.id],
			relationName: "agenda_folders.organization_id:organizations.id",
=======
		/**
		 * Many to one relationship from `agenda_folders` table to `agenda_folders` table.
		 */
		parentFolder: one(agendaFoldersTable, {
			fields: [agendaFoldersTable.parentFolderId],
			references: [agendaFoldersTable.id],
			relationName: "agenda_folders.id:agenda_folders.parent_folder_id",
>>>>>>> upstream
		}),
		/**
		 * Many to one relationship from `agenda_folders` table to `users` table.
		 */
		updater: one(usersTable, {
			fields: [agendaFoldersTable.updaterId],
			references: [usersTable.id],
			relationName: "agenda_folders.updater_id:users.id",
		}),
	}),
);

export const agendaFoldersTableInsertSchema = createInsertSchema(
	agendaFoldersTable,
	{
<<<<<<< HEAD
		description: (schema) => schema.min(1).max(2048).optional(),
		name: (schema) => schema.min(1).max(256),
		sequence: (schema) => schema.int().min(1).optional(),
=======
		name: (schema) => schema.min(1).max(256),
>>>>>>> upstream
	},
);
