const command = process.argv[2];

import { commands } from "./commands";

function executeCommand(command: string) {
	console.log("Welcome to the GCP Codespaces Manager");
	console.log("Executing command:", command);
	const commandObject = commands[command as keyof typeof commands];
	if (!commandObject) {
		console.log("Invalid command");
		return;
	}
	commandObject.action();
}

executeCommand(command);
