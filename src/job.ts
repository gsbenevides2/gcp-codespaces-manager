import { CodespacesService } from "./backend/services/Codespaces";

const jobType = Bun.env.JOB_TYPE;

if (jobType === "codespaces-start") {
	await CodespacesService.start();
} else if (jobType === "codespaces-stop") {
	await CodespacesService.stop();
} else {
	console.error("Invalid job type");
}
