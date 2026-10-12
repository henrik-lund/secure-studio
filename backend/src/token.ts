import { sign } from "jsonwebtoken"
import { SECRET } from "./middleware"
import type { JwtPayload } from "./types"

export function createJwt(userId: string): string {
	const payload: JwtPayload = { userId }
	return sign(payload, SECRET, { expiresIn: "8h" })
}