import { useState } from "react"
import type { ReactElement, FormEvent } from "react"
import { signin, register } from "../api"
import type { LoginCredentials } from "../types"

type Props = {
	onLogin: (token: string) => void
}

function Login({ onLogin }: Props): ReactElement {
	const [username, setUsername] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [mode, setMode] = useState<"signin" | "register">("signin")
	const [error, setError] = useState<string>("")

	async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault()
		setError("")

		const credentials: LoginCredentials = { username: username.trim(), password }

		try {
			const token: string = mode === "signin"
				? await signin(credentials)
				: await register(credentials)
			onLogin(token)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Okänt fel")
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>{mode === "signin" ? "Logga in" : "Skapa konto"}</h2>

			<label>
				Användarnamn
				<input value={username} onChange={e => setUsername(e.target.value)} />
			</label>

			<label>
				Lösenord
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
			</label>

			<button type="submit">{mode === "signin" ? "Logga in" : "Registrera"}</button>

			<button type="button" onClick={() => setMode(mode === "signin" ? "register" : "signin")}>
				{mode === "signin" ? "Skapa nytt konto" : "Jag har redan ett konto"}
			</button>

			{error && <p>{error}</p>}
		</form>
	)
}

export default Login