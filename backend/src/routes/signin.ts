import { Router } from "express"
import * as z from "zod"
import { getUser } from "../fakeDb"
import { createJwt } from "../token"
import type { LoginCredentials, UserCredentials, TokenResponse } from "../types"
import { loginCredSchema } from "../validation/userSchema"

const router = Router()

// POST /api/signin
router.post<{}, void | TokenResponse, LoginCredentials>("/", (req, res) => {
	const parsed = z.safeParse(loginCredSchema, req.body)
	if (!parsed.success) {
		res.sendStatus(400)
		return
	}

	const input: LoginCredentials = parsed.data
	const maybeUser: UserCredentials | undefined = getUser(input)

	if (!maybeUser) {
		res.sendStatus(401)
		return
	}

	res.status(200).send({ jwt: createJwt(maybeUser.id) })
})

export default router