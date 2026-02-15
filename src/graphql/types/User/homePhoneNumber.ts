import envConfig from "~/src/utilities/graphqLimits";
import { TalawaGraphQLError } from "~/src/utilities/TalawaGraphQLError";
import type { GraphQLContext } from "../../context";
import { User } from "./User";

/**
 * Resolver for the homePhoneNumber field of the User type.
 *
 * @param parent - The user object for which the home phone number is being resolved.
 * @param _args - No arguments are expected for this resolver, so this is an empty object.
 * @param ctx - The GraphQL context, which includes information about the current client.
 * @returns The home phone number of the user if the requester is authorized, otherwise throws an error.
 */
export const homePhoneNumberResolver = async (
	parent: User,
	_args: Record<string, never>,
	ctx: GraphQLContext,
) => {
	if (!ctx.currentClient.isAuthenticated) {
		throw new TalawaGraphQLError({
			extensions: {
				code: "unauthenticated",
			},
		});
	}

	const currentUserId = ctx.currentClient.user.id;

	const currentUser = await ctx.drizzleClient.query.usersTable.findFirst({
		columns: {
			role: true,
		},
		where: (fields, operators) => operators.eq(fields.id, currentUserId),
	});

	if (currentUser === undefined) {
		throw new TalawaGraphQLError({
			extensions: {
				code: "unauthenticated",
			},
		});
	}

	if (
		currentUser.role !== "administrator" &&
		parent.id !== currentUserId
	) {
		throw new TalawaGraphQLError({
			extensions: {
				code: "unauthorized_action",
			},
		});
	}

	return parent.homePhoneNumber;
};

User.implement({
	fields: (t) => ({
		homePhoneNumber: t.field({
			description:
				"The phone number to use to communicate with the user at their home.",
			complexity: envConfig.API_GRAPHQL_SCALAR_RESOLVER_FIELD_COST,
			resolve: homePhoneNumberResolver,
			type: "PhoneNumber",
		}),
	}),
});
