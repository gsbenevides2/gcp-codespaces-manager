import { env } from "./cli/env";
import { help } from "./cli/help";
import { start } from "./cli/start";
import { stop } from "./cli/stop";
import { testStart } from "./cli/testStart";
import { testStop } from "./cli/testStop";

export const commands = {
	start: {
		description: "Start the server",
		action: start,
	},
	stop: {
		description: "Stop the server",
		action: stop,
	},
	env: {
		description: "Process the environment variables and run the job",
		action: env,
	},
	help: {
		description: "Show the help",
		action: help,
	},
	testStart: {
		description: "Test the start command",
		action: testStart,
	},
	testStop: {
		description: "Test the stop command",
		action: testStop,
	},
};
