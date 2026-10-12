import { Router } from "express"
import * as z from "zod"
import { users } from "../data/users"
import type { LoginCredentials, UserCredentials, UserInfo } from "../types"
import { loginCredSchema } from "../validation/userSchema"

const router = Router()

// GET /api/users - lista med användarnamn
router.get<{}, string[]>("/", (req, res) => {
	const usernames: string[] = users.map(u => u.username)
	res.status(200).send(usernames)
})

// GET /api/users/:id - info om en specifik användare
router.get<{ id: string }, UserInfo | void>("/:id", (req, res) => {
	const user: UserCredentials | undefined = users.find(u => u.id === req.params.id)
	if (!user) {
		res.sendStatus(404)
		return
	}
	res.status(200).send({ id: user.id, username: user.username })
})

// PUT /api/users/:id - ändra användarnamn och lösenord
router.put<{ id: string }, UserInfo | void, LoginCredentials>("/:id", (req, res) => {
	const user: UserCredentials | undefined = users.find(u => u.id === req.params.id)
	if (!user) {
		res.sendStatus(404)
		return
	}

	const parsed = z.safeParse(loginCredSchema, req.body)
	if (!parsed.success) {
		res.sendStatus(400)
		return
	}
	const input: LoginCredentials = parsed.data

	// Användarnamnet får inte redan tillhöra en annan användare
	const taken: boolean = users.some(u => u.id !== user.id && u.username === input.username)
	if (taken) {
		res.sendStatus(409)
		return
	}

	user.username = input.username
	user.password = input.password
	res.status(200).send({ id: user.id, username: user.username })
})

// DELETE /api/users/:id - ta bort användare
router.delete<{ id: string }>("/:id", (req, res) => {
	const index: number = users.findIndex(u => u.id === req.params.id)
	if (index === -1) {
		res.sendStatus(404)
		return
	}

	users.splice(index, 1)
	res.sendStatus(204)
})

export default router