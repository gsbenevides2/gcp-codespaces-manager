import { Elysia } from "elysia";
import { CodespacesService } from "../../services/Codespaces";

const CodespacesController = new Elysia({
	prefix: "/codespaces",
})
	.post(
		"/start",
		async () => {
			try {
				await CodespacesService.start();
				return {
					success: true,
				};
			} catch (error) {
				console.error(error);
				return {
					success: false,
				};
			}
		},
		{
			detail: {
				description: "Start a codespaces",
			},
			security: [{ bearerAuth: [] }],
		},
	)
	.post(
		"/stop",
		async () => {
			try {
				await CodespacesService.stop();
				return {
					success: true,
				};
			} catch (error) {
				console.error(error);
				return {
					success: false,
				};
			}
		},
		{
			detail: {
				description: "Stop a codespaces",
			},
			security: [{ bearerAuth: [] }],
		},
	);

export default CodespacesController;
