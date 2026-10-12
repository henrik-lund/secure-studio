export function checkEnvFile(): void {
	if (!process.env.SECRET) {
		console.log ("Hittar inte SECRET i .env-filen!")
		process.exit(1)
	}
}