import * as z from 'zod'

export const userCredSchema = z.object({
	id: z.string(),
	username: z.string().trim().min(3 , {message: "Användarnamn måste vara minst 3 tecken långt."}),
	password: z.string().min(8, {message: "Lösenordet måste vara minst 8 tecken långt."})
})
export type UserCredentials = z.infer<typeof userCredSchema>

export const loginCredSchema = userCredSchema.omit({ id: true })
export type LoginCredentials = z.infer<typeof loginCredSchema>
