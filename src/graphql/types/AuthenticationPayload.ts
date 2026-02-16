import { builder } from "~/src/graphql/builder";
<<<<<<< HEAD
import type { User as UserType } from "./User/User";
import { User } from "./User/User";

export type AuthenticationPayload = {
	authenticationToken: string;
	refreshToken: string;
=======
import { User } from "./User/User";
import type { User as UserType } from "./User/User";

export type AuthenticationPayload = {
	authenticationToken: string;
>>>>>>> upstream
	user: UserType;
};

export const AuthenticationPayload = builder
	.objectRef<AuthenticationPayload>("AuthenticationPayload")
	.implement({
		description: "",
		fields: (t) => ({
			authenticationToken: t.exposeString("authenticationToken", {
				description:
<<<<<<< HEAD
					"This is the short-lived access token using which a user can authenticate API requests.",
			}),
			refreshToken: t.exposeString("refreshToken", {
				description:
					"This is the long-lived refresh token used to obtain new access tokens without re-authentication.",
=======
					"This is the authentication token using which a user can sign in to talawa.",
>>>>>>> upstream
			}),
			user: t.expose("user", {
				description: "",
				type: User,
			}),
		}),
	});
