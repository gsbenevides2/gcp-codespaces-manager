import { cors } from "@elysiajs/cors";
import serverTiming from "@elysiajs/server-timing";
import swagger from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia } from "elysia";
import api from "./backend/api";
import { isDevelopmentMode } from "./utils/isProductionMode";

const port = Bun.env.PORT || 3000;

// eslint-disable-next-line unused-imports/no-unused-vars
const app = new Elysia()
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
	.use(cors())
	.use(
		serverTiming({
			enabled: isDevelopmentMode(),
		}),
	)
	.use(
		swagger({
			documentation: {
				info: {
					title: "E-Financeira",
					version: "1.0.0",
					description: "E-Financeira - Gestão Financeira",
				},
				tags: [
					{
						name: "Auth",
						description: "Auth endpoints",
					},
					{
						name: "Accounts",
						description: "Get accounts informations",
					},
					{
						name: "Categories",
						description: "Get categories informations",
					},
					{
						name: "Month References",
						description: "Get month references informations",
					},
					{
						name: "Transactions",
						description: "Get transactions informations",
					},
					{
						name: "Coolify",
						description: "Coolify endpoints",
					},
				],
			},
		}),
	)
	.use(api)
	.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`Server is running on http://localhost:${port}`);
	});

export type App = typeof app;
