import { commands } from "../commands";

export function help() {
	console.log("Help");
	console.log("Available commands:");
	for (const command of Object.keys(commands) as (keyof typeof commands)[]) {
		console.log(`- ${command}: ${commands[command].description}`);
	}
}