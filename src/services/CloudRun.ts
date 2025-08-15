import run from "@google-cloud/run";
import { GoogleAuth } from "./GoogleAuth";

const PROJECT_ID = await GoogleAuth.getProjectId();

export class CloudRunService {
	private static client = new run.JobsClient({
		fallback: GoogleAuth.defaultFallback,
		scopes: GoogleAuth.defaultScopes,
	});

	private static PROJECT_ID = PROJECT_ID;
	private static START_JOB_NAME = "gcp-codespaces-manager-start";
	private static STOP_JOB_NAME = "gcp-codespaces-manager-stop";
	private static REGION = "us-central1";

	static makeJobName(jobName: string) {
		return `projects/${CloudRunService.PROJECT_ID}/locations/${CloudRunService.REGION}/jobs/${jobName}`;
	}

	static async start() {
		console.log("Starting job");
		await CloudRunService.client.runJob({
			name: CloudRunService.makeJobName(CloudRunService.START_JOB_NAME),
		});
		console.log("Requested job, waiting for it to start");
	}

	static async stop() {
		console.log("Stopping job");
		await CloudRunService.client.runJob({
			name: CloudRunService.makeJobName(CloudRunService.STOP_JOB_NAME),
		});
		console.log("Requested job, waiting for it to stop");
	}
}
