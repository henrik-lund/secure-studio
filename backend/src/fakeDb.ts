import { randomUUID } from "crypto"
import { users } from "./data/users"
import type { LoginCredentials, UserCredentials } from "./types"

export function getUser(input: LoginCredentials): UserCredentials | undefined {
	return users.find(u => u.username === input.username && u.password === input.password)
}

// Används av /api/register senare, returnerar id för den nya användaren
export function createUser(creds: LoginCredentials): string {
	const user: UserCredentials = { id: randomUUID(), ...creds }
	users.push(user)
	return user.id
}