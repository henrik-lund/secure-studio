import { useState, useEffect } from "react"
import type { ReactElement, FormEvent } from "react"
import { getUserIdFromToken, getUser, updateUser, deleteUser, UnauthorizedError } from "../api"
import type { UserInfo, LoginCredentials } from "../types"

type Props = {
	token: string
	onSignout: () => void
}

function Profile({ token, onSignout }: Props): ReactElement {
	const userId: string = getUserIdFromToken(token)

	const [user, setUser] = useState<UserInfo | null>(null)
	const [username, setUsername] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [message, setMessage] = useState<string>("")
	const [error, setError] = useState<string>("")

	// Hämta den inloggade användaren när sidan visas
	useEffect(() => {
		async function load(): Promise<void> {
			try {
				const info: UserInfo = await getUser(userId, token)
				setUser(info)
				setUsername(info.username)
			} catch (err) {
				if (err instanceof UnauthorizedError) {
					onSignout()
				} else {
					setError(err instanceof Error ? err.message : "Okänt fel")
				}
			}
		}
		load()
	}, [userId, token, onSignout])

	function handleError(err: unknown): void {
		if (err instanceof UnauthorizedError) {
			onSignout()
		} else {
			setError(err instanceof Error ? err.message : "Okänt fel")
		}
	}

	async function handleSave(e: FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault()
		setMessage("")
		setError("")

		const credentials: LoginCredentials = { username: username.trim(), password }

		try {
			const updated: UserInfo = await updateUser(userId, credentials, token)
			setUser(updated)
			setPassword("")
			setMessage("Uppgifterna är sparade")
		} catch (err) {
			handleError(err)
		}
	}

	async function handleDelete(): Promise<void> {
		if (!window.confirm("Vill du verkligen ta bort ditt konto?")) {
			return
		}
		try {
			await deleteUser(userId, token)
			onSignout()
		} catch (err) {
			handleError(err)
		}
	}

	if (user === null) {
		return (
			<section>
				<p>{error || "Laddar..."}</p>
				{error && <button onClick={onSignout}>Logga ut</button>}
			</section>
		)
	}

	return (
		<section>
			<h2>Din profil</h2>
			<p>Användar-id: {user.id}</p>
			<p>Användarnamn: {user.username}</p>

			<form onSubmit={handleSave}>
				<h3>Ändra uppgifter</h3>

				<label>
					Användarnamn
					<input value={username} onChange={e => setUsername(e.target.value)} />
				</label>

				<label>
					Nytt lösenord
					<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</label>

				<button type="submit">Spara</button>
			</form>

			{message && <p>{message}</p>}
			{error && <p>{error}</p>}

			<button onClick={onSignout}>Logga ut</button>
			<button onClick={handleDelete}>Ta bort mitt konto</button>
		</section>
	)
}

export default Profile