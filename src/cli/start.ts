import { CloudRunService } from "../services/CloudRun";

export async function start() {
	await CloudRunService.start();
}
