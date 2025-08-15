import { CodespacesService } from "../services/Codespaces";

export async function testStop() {
	await CodespacesService.stop();
}
