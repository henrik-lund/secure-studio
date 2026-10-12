// import type { RequestHandler } from "express";
// import jwt from "jsonwebtoken"
// import { unknown } from "zod";
// const { verify, JsonWebTokenError, TokenExpiredError } = jwt

// export function formatTimeStamp(date: Date = new Date ()): string {
// 	const pad = (n: number) => String(n).padStart(2, '0')
// 	const yyyy = date.getFullYear()
// 	const mm = pad(date.getMonth() + 1)
// 	const dd = pad(date.getDate())
// 	const hh = pad(date.getHours())
// 	const min = pad(date.getMinutes())
// 	const ss = pad(date.getSeconds())
// 	return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
// }

// export const logger: RequestHandler = (req, res, next) => {
// 	const maybeAuth: string | undefined = req.headers.authorization

// 	if (!maybeAuth) {
// 		console.log(`inloggningsmiddleware: auth finns inte.`)
// 		res.sendStatus(401)
// 		return
// 	}

// 	const token = maybeAuth.substring(7)

// 	try{
// 		const verifiedToken = verify(token, process.env.SECRET!)
// 		next()
// 	} catch(error: unknown){
// 		if (error instanceof TokenExpiredError) {
// 			console.log("Token har gått ut.")
// 			res.sendStatus(401)
// 			return
// 		} else if ( error instanceof JsonWebTokenError) {
// 			console.log ( "Felaktig token!")
// 			res.sendStatus(401)
// 			return
// 		}
// 		const message = (error instanceof Error) ? error.message: String(error)
// 		console.log ( "Okänt fel!", message)
// 		res.sendStatus(500)
// 	}
// }
import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"
const { verify, JsonWebTokenError, TokenExpiredError } = jwt

// OBS! I ett riktigt projekt ska hemligheten ligga i .env, inte i koden
export const SECRET: string = "hemlig-nyckel-for-skolprojektet"

export function formatTimeStamp(date: Date = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, '0')
	const yyyy = date.getFullYear()
	const mm = pad(date.getMonth() + 1)
	const dd = pad(date.getDate())
	const hh = pad(date.getHours())
	const min = pad(date.getMinutes())
	const ss = pad(date.getSeconds())
	return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}

export const logger: RequestHandler = (req, res, next) => {
	console.log(`[${formatTimeStamp()}] ${req.method} ${req.originalUrl}`)
	next()
}

export const requireAuth: RequestHandler = (req, res, next) => {
	const maybeAuth: string | undefined = req.headers.authorization

	if (!maybeAuth || !maybeAuth.startsWith("Bearer ")) {
		console.log("requireAuth: auth saknas eller har fel format.")
		res.sendStatus(401)
		return
	}

	const token: string = maybeAuth.substring(7)

	try {
		verify(token, SECRET)
		next()
	} catch (error: unknown) {
		if (error instanceof TokenExpiredError) {
			console.log("Token har gått ut.")
			res.sendStatus(401)
			return
		} else if (error instanceof JsonWebTokenError) {
			console.log("Felaktig token!")
			res.sendStatus(401)
			return
		}
		const message = (error instanceof Error) ? error.message : String(error)
		console.log("Okänt fel!", message)
		res.sendStatus(500)
	}
}