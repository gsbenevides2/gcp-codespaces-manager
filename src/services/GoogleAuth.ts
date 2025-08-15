import { GoogleAuth as GoogleAuthLib } from "google-auth-library";

export class GoogleAuth {
	static readonly defaultScopes = [
		"https://www.googleapis.com/auth/cloud-platform",
	];

	static readonly defaultFallback = "rest";

	private static instance = new GoogleAuthLib({
		scopes: GoogleAuth.defaultScopes,
	});

	static async getServiceAccountEmail() {
		const email = (await GoogleAuth.instance.getCredentials()).client_email;
		return email;
	}

	static async getProjectId() {
		const projectId = await GoogleAuth.instance.getProjectId();
		return projectId;
	}
}
