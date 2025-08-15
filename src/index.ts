const command = process.argv[2];

import { commands } from "./commands";

function executeCommand(command: string) {
	const commandObject = commands[command as keyof typeof commands];
	if (!commandObject) {
		console.log("Invalid command");
		return;
	}
	commandObject.action();
}

executeCommand(command);
