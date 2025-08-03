export class InvalidCredentialsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidCredentialsError";
	}
}

export class AuthService {
	static token: string = Bun.env.AUTH_TOKEN ?? "";

	static async authenticate(token: string) {
		if (token !== AuthService.token) {
			return new InvalidCredentialsError("Invalid token");
		}
	}

	static async verify(token: string) {
		return AuthService.authenticate(token);
	}
}
