import { z } from "zod";
import { builder } from "~/src/graphql/builder";
<<<<<<< HEAD
import { uuid } from "~/src/graphql/validators/core";

export const acceptMembershipRequestInputSchema = z.object({
	membershipRequestId: uuid,
=======

export const acceptMembershipRequestInputSchema = z.object({
	membershipRequestId: z
		.string()
		.uuid("Membership request ID must be a valid UUID"),
>>>>>>> upstream
});

export const MutationAcceptMembershipRequestInput = builder.inputType(
	"MutationAcceptMembershipRequestInput",
	{
		fields: (t) => ({
			membershipRequestId: t.field({
				type: "ID",
				required: true,
				description: "ID of the membership request to accept",
			}),
		}),
	},
);
