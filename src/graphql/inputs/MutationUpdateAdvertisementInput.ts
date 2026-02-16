<<<<<<< HEAD
import { z } from "zod";
=======
import type { z } from "zod";
>>>>>>> upstream
import { advertisementsTableInsertSchema } from "~/src/drizzle/tables/advertisements";
import { builder } from "~/src/graphql/builder";
import { AdvertisementType } from "~/src/graphql/enums/AdvertisementType";
import { isNotNullish } from "~/src/utilities/isNotNullish";

export const mutationUpdateAdvertisementInputSchema =
	advertisementsTableInsertSchema
<<<<<<< HEAD
		.pick({})
		.extend({
			description: z.string().trim().min(1).max(2048).nullable().optional(),
			endAt: advertisementsTableInsertSchema.shape.endAt.nullable().optional(),
			id: advertisementsTableInsertSchema.shape.id.unwrap(),
			name: z.string().trim().min(1).max(256).nullable().optional(),
			startAt: advertisementsTableInsertSchema.shape.startAt
				.nullable()
				.optional(),
			type: advertisementsTableInsertSchema.shape.type.nullable().optional(),
=======
		.pick({
			description: true,
		})
		.extend({
			endAt: advertisementsTableInsertSchema.shape.endAt.optional(),
			id: advertisementsTableInsertSchema.shape.id.unwrap(),
			name: advertisementsTableInsertSchema.shape.name.optional(),
			startAt: advertisementsTableInsertSchema.shape.startAt.optional(),
			type: advertisementsTableInsertSchema.shape.type.optional(),
>>>>>>> upstream
		})
		.superRefine(({ id, ...remainingArg }, ctx) => {
			if (!Object.values(remainingArg).some((value) => value !== undefined)) {
				ctx.addIssue({
					code: "custom",
					message: "At least one optional argument must be provided.",
				});
			}

			if (
				isNotNullish(remainingArg.endAt) &&
				isNotNullish(remainingArg.startAt) &&
				remainingArg.endAt <= remainingArg.startAt
			) {
				ctx.addIssue({
					code: "custom",
					message: `Must be greater than the value: ${remainingArg.startAt.toISOString()}.`,
					path: ["endAt"],
				});
			}
		});

export const MutationUpdateAdvertisementInput = builder
	.inputRef<z.infer<typeof mutationUpdateAdvertisementInputSchema>>(
		"MutationUpdateAdvertisementInput",
	)
	.implement({
		description: "",
		fields: (t) => ({
			description: t.string({
				description: "Custom information about the advertisement.",
<<<<<<< HEAD
				required: false,
			}),
			endAt: t.field({
				description: "Date time at which the advertised event ends.",
				required: false,
				type: "DateTime",
			}),
			id: t.id({
				description: "ID of the advertisement to update.",
=======
			}),
			endAt: t.field({
				description: "Date time at which the advertised event ends.",
				type: "DateTime",
			}),
			id: t.id({
				description: "Global identifier of the associated organization.",
>>>>>>> upstream
				required: true,
			}),
			name: t.string({
				description: "Name of the advertisement.",
<<<<<<< HEAD
				required: false,
			}),
			startAt: t.field({
				description: "Date time at which the advertised event starts.",
				required: false,
=======
			}),
			startAt: t.field({
				description: "Date time at which the advertised event starts.",
>>>>>>> upstream
				type: "DateTime",
			}),
			type: t.field({
				description: "Type of the advertisement.",
<<<<<<< HEAD
				required: false,
=======
>>>>>>> upstream
				type: AdvertisementType,
			}),
		}),
	});
