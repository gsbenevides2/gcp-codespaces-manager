import { Elysia } from "elysia";
import { AuthService, InvalidCredentialsError } from "./services/AuthService";

const api = new Elysia({
	prefix: "/api",
}).onBeforeHandle(async ({ headers, status }) => {
	const token = headers?.authorization?.split(" ")[1];
	if (!token) {
		return status(401, {
			error: "Unauthorized",
		});
	}
	const decoded = await AuthService.verify(token);
	if (!decoded || decoded instanceof InvalidCredentialsError) {
		return status(401, {
			error: "Unauthorized",
		});
	}
});

export default api;
