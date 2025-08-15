import compute from "@google-cloud/compute";
import Cloudflare from "cloudflare";
import { wait } from "../utils/wait";
import { GoogleAuth } from "./GoogleAuth";

const PROJECT_ID = await GoogleAuth.getProjectId();

export class CodespacesService {
	private static PROJECT_ID = PROJECT_ID;
	private static CLOUDFLARE_ZONE_ID = Bun.env.CLOUDFLARE_ZONE_ID ?? "";
	private static CLOUDFLARE_RECORD_ID = Bun.env.CLOUDFLARE_RECORD_ID ?? "";
	private static CLOUDFLARE_RECORD_NAME = Bun.env.CLOUDFLARE_RECORD_NAME ?? "";
	private static BR_SP_ZONE = "southamerica-east1-c";
	private static US_REGION = "us-central1";
	private static INSTANCE_NAME = "codespaces";
	private static STOPPED_STATUS = ["SUSPENDED", "TERMINATED"];
	private static MACHINE_TYPE =
		`https://www.googleapis.com/compute/v1/projects/${CodespacesService.PROJECT_ID}/zones/${CodespacesService.BR_SP_ZONE}/machineTypes/e2-standard-2`;
	private static DISK_SIZE = 20;
	private static DISK_TYPE =
		`https://www.googleapis.com/compute/v1/projects/${CodespacesService.PROJECT_ID}/zones/${CodespacesService.BR_SP_ZONE}/diskTypes/pd-ssd`;

	private static NETWORK =
		`https://www.googleapis.com/compute/v1/projects/${CodespacesService.PROJECT_ID}/global/networks/default`;

	private static instancesClient = new compute.InstancesClient({
		scopes: GoogleAuth.defaultScopes,
		fallback: GoogleAuth.defaultFallback,
	});

	private static imagesClient = new compute.ImagesClient({
		scopes: GoogleAuth.defaultScopes,
		fallback: GoogleAuth.defaultFallback,
	});

	private static cloudflare = new Cloudflare();

	static async start() {
		await CodespacesService.createInstance();
		await CodespacesService.waitInstanceToBeReady();
		await CodespacesService.deleteDiskImage();
		await CodespacesService.applyToCloudflare();
	}

	private static async getInstance() {
		const [instance] = await CodespacesService.instancesClient.get({
			project: CodespacesService.PROJECT_ID,
			zone: CodespacesService.BR_SP_ZONE,
			instance: CodespacesService.INSTANCE_NAME,
		});
		return instance;
	}

	private static async waitInstanceToBeStopped() {
		console.log("Waiting for instance to be stopped...");
		while (true) {
			try {
				const instance = await CodespacesService.getInstance();
				if (!instance.status) break;
				if (CodespacesService.STOPPED_STATUS.includes(instance.status)) {
					break;
				}
				await wait(1000);
			} catch (_) {}
		}
		console.log("Instance stopped");
	}

	private static async waitInstanceToBeReady() {
		console.log("Waiting for instance to be ready...");
		while (true) {
			const instance = await CodespacesService.getInstance();
			if (instance.status === "RUNNING") break;
			await wait(1000);
		}
		console.log("Instance ready");
	}

	private static async getDiskImage() {
		const [image] = await CodespacesService.imagesClient.get({
			project: CodespacesService.PROJECT_ID,
			image: CodespacesService.INSTANCE_NAME,
		});
		return image;
	}

	static async waitDiskImageToBeCreated() {
		console.log("Waiting for disk image to be created...");
		while (true) {
			const image = await CodespacesService.getDiskImage();
			if (image?.status === "READY") break;
			await wait(1000);
		}
		console.log("Disk image created");
	}

	private static async stopInstance() {
		console.log("Stopping instance...");
		await CodespacesService.instancesClient.stop({
			project: CodespacesService.PROJECT_ID,
			zone: CodespacesService.BR_SP_ZONE,
			instance: CodespacesService.INSTANCE_NAME,
		});
		await CodespacesService.waitInstanceToBeStopped();
	}

	private static async createDiskImage() {
		const instance = await CodespacesService.getInstance();
		const sourceDisk = instance.disks?.[0].source;
		console.log("Creating disk image sourceDisk", sourceDisk);
		await CodespacesService.imagesClient.insert({
			imageResource: {
				name: CodespacesService.INSTANCE_NAME,
				sourceDisk: sourceDisk,
				storageLocations: [CodespacesService.US_REGION],
			},
			project: CodespacesService.PROJECT_ID,
		});
		await CodespacesService.waitDiskImageToBeCreated();
	}

	private static async createInstance() {
		console.log("Creating instance...");
		const image = await CodespacesService.getDiskImage();
		await CodespacesService.instancesClient.insert({
			project: CodespacesService.PROJECT_ID,
			zone: CodespacesService.BR_SP_ZONE,
			instanceResource: {
				name: CodespacesService.INSTANCE_NAME,
				zone: CodespacesService.BR_SP_ZONE,
				machineType: CodespacesService.MACHINE_TYPE,
				disks: [
					{
						boot: true,
						diskSizeGb: CodespacesService.DISK_SIZE,
						type: "PERSISTENT",
						autoDelete: true,
						initializeParams: {
							sourceImage: image.selfLink,
							diskSizeGb: CodespacesService.DISK_SIZE,
							diskType: CodespacesService.DISK_TYPE,
							diskName: CodespacesService.INSTANCE_NAME,
						},
					},
				],
				networkInterfaces: [
					{
						network: CodespacesService.NETWORK,
						accessConfigs: [
							{
								networkTier: "PREMIUM",
								name: "External NAT",
							},
						],
					},
				],
			},
		});
		console.log("Instance created");
	}

	private static async deleteDiskImage() {
		console.log("Deleting disk image...");
		await CodespacesService.imagesClient.delete({
			project: CodespacesService.PROJECT_ID,
			image: CodespacesService.INSTANCE_NAME,
		});
		console.log("Disk image deleted");
	}

	private static async deleteInstance() {
		console.log("Deleting instance...");
		await CodespacesService.instancesClient.delete({
			project: CodespacesService.PROJECT_ID,
			zone: CodespacesService.BR_SP_ZONE,
			instance: CodespacesService.INSTANCE_NAME,
		});
		console.log("Instance deleted");
	}

	private static async applyToCloudflare() {
		console.log("Applying to Cloudflare...");
		const instance = await CodespacesService.getInstance();
		const ip = instance.networkInterfaces?.[0].accessConfigs?.[0].natIP;
		if (!ip) {
			console.error("IP not found");
			return;
		}
		console.log("IP", ip);
		await CodespacesService.cloudflare.dns.records.edit(
			CodespacesService.CLOUDFLARE_RECORD_ID,
			{
				zone_id: CodespacesService.CLOUDFLARE_ZONE_ID,
				type: "A",
				name: CodespacesService.CLOUDFLARE_RECORD_NAME,
				content: ip,
				ttl: 60,
				proxied: false,
			},
		);
		console.log("IP applied to Cloudflare");
	}

	static async stop() {
		await CodespacesService.stopInstance();
		await CodespacesService.createDiskImage();
		await CodespacesService.deleteInstance();
	}
}
