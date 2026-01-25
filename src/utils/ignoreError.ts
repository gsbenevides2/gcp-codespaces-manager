export function promiseIgnoreError<T>(promise: Promise<T>): Promise<T | null> {
	return promise.catch((error) => {
		console.error(error);
		return null;
	});
}