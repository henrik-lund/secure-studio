import type { LoginCredentials, TokenResponse, JwtPayload, UserInfo } from "./types"

const BASE_URL: string = "http://localhost:3002"

export class UnauthorizedError extends Error {
	constructor() {
		super("Sessionen har gått ut, logga in igen")
	}
}

async function postCredentials(path: string, credentials: LoginCredentials): Promise<string> {
	const response: Response = await fetch(`${BASE_URL}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials)
	})

	if (response.status === 401) {
		throw new Error("Fel användarnamn eller lösenord")
	}
	if (response.status === 409) {
		throw new Error("Användarnamnet är upptaget")
	}
	if (response.status === 400) {
		throw new Error("Ogiltiga uppgifter: användarnamn minst 3 tecken, lösenord minst 6")
	}
	if (!response.ok) {
		throw new Error(`Något gick fel (status ${response.status})`)
	}

	const data: TokenResponse = await response.json()
	return data.jwt
}

export function signin(credentials: LoginCredentials): Promise<string> {
	return postCredentials("/api/signin", credentials)
}

export function register(credentials: LoginCredentials): Promise<string> {
	return postCredentials("/api/register", credentials)
}

// Plockar ut userId ur token, så frontend vet vem som är inloggad
export function getUserIdFromToken(token: string): string {
	const payload: string = token.split(".")[1]
	const base64: string = payload.replace(/-/g, "+").replace(/_/g, "/")
	const data: JwtPayload = JSON.parse(atob(base64))
	return data.userId
}

// Skickar en request med token i Authorization-headern
async function authRequest(path: string, token: string, method: string, body?: LoginCredentials): Promise<Response> {
	const response: Response = await fetch(`${BASE_URL}${path}`, {
		method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body: body ? JSON.stringify(body) : undefined
	})

	if (response.status === 401) {
		throw new UnauthorizedError()
	}
	return response
}

export async function getUser(id: string, token: string): Promise<UserInfo> {
	const response: Response = await authRequest(`/api/users/${id}`, token, "GET")
	if (!response.ok) {
		throw new Error(`Kunde inte hämta användaren (status ${response.status})`)
	}
	return await response.json()
}

export async function updateUser(id: string, credentials: LoginCredentials, token: string): Promise<UserInfo> {
	const response: Response = await authRequest(`/api/users/${id}`, token, "PUT", credentials)
	if (response.status === 409) {
		throw new Error("Användarnamnet är upptaget")
	}
	if (response.status === 400) {
		throw new Error("Ogiltiga uppgifter: användarnamn minst 3 tecken, lösenord minst 6")
	}
	if (!response.ok) {
		throw new Error(`Kunde inte spara (status ${response.status})`)
	}
	return await response.json()
}

export async function deleteUser(id: string, token: string): Promise<void> {
	const response: Response = await authRequest(`/api/users/${id}`, token, "DELETE")
	if (!response.ok) {
		throw new Error(`Kunde inte ta bort kontot (status ${response.status})`)
	}
}