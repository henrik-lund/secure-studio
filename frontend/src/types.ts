export type LoginCredentials = {
	username: string
	password: string
}

export type TokenResponse = {
	jwt: string
}

export type JwtPayload = {
	userId: string
}

export type UserInfo = {
	id: string
	username: string
}