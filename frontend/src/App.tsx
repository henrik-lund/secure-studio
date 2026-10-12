import { useState, useCallback } from "react"
import type { ReactElement } from "react"
import Login from "./components/Login"
import Profile from "./components/Profile"

const TOKEN_KEY: string = "jwt"

function App(): ReactElement {
	const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))

	function handleLogin(newToken: string): void {
		localStorage.setItem(TOKEN_KEY, newToken)
		setToken(newToken)
	}

	const handleSignout = useCallback((): void => {
	localStorage.removeItem(TOKEN_KEY)
	setToken(null)
}, [])

	return (
		<main>
			<h1>Secure Studio</h1>
			{token === null
				? <Login onLogin={handleLogin} />
				: <Profile token={token} onSignout={handleSignout} />}
		</main>
	)
}

export default App