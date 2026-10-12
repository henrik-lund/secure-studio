import { Router } from "express"
import * as z from "zod"
import { users } from "../data/users"
import { createUser } from "../fakeDb"
import { createJwt } from "../token"
import type { LoginCredentials, TokenResponse } from "../types"
import { loginCredSchema } from "../validation/userSchema"

const router = Router()

// POST /api/register - skapar en ny användare och loggar in den
router.post<{}, void | TokenResponse, LoginCredentials>("/", (req, res) => {
	const parsed = z.safeParse(loginCredSchema, req.body)
	if (!parsed.success) {
		res.sendStatus(400)
		return
	}

	const input: LoginCredentials = parsed.data

	const taken: boolean = users.some(u => u.username === input.username)
	if (taken) {
		res.sendStatus(409)  // Conflict: användarnamnet är upptaget
		return
	}

	const id: string = createUser(input)
	res.status(201).send({ jwt: createJwt(id) })
})

export default router