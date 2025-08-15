import { CodespacesService } from "../services/Codespaces";

export async function testStart() {
	await CodespacesService.start().catch(async (error) => {
		console.error(await error.response.text());
	});
}
