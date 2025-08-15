import { CloudRunService } from "../services/CloudRun";

export async function stop() {
	await CloudRunService.stop();
}
