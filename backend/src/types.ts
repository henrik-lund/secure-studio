import * as z from "zod"
import { userCredSchema, loginCredSchema } from "./validation/userSchema"

export type UserCredentials = z.infer<typeof userCredSchema>
export type LoginCredentials = z.infer<typeof loginCredSchema>
export type UserInfo = Omit<UserCredentials, "password">

export type TokenResponse = {
	jwt: string
}

export type JwtPayload = {
	userId: string
}