import swagger from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import api from "./backend/api";

const port = Bun.env.PORT || 3000;

// eslint-disable-next-line unused-imports/no-unused-vars
const app = new Elysia({
	serve: {
		idleTimeout: 255, // 255 seconds
	},
})
	.use(
		logger({
			logIP: true,
			writer: {
				write(msg: string) {
					// eslint-disable-next-line no-console
					console.log(msg);
				},
			},
		}),
	)
	.use(
		swagger({
			documentation: {
				info: {
					title: "GCP Codespaces Manager",
					version: "1.0.0",
					description: "GCP Codespaces Manager API",
				},
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
						},
					},
				},
			},
		}),
	)
	.use(api)
	.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`Server is running on http://localhost:${port}`);
	});

export type App = typeof app;
