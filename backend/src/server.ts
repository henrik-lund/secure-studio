// import
import express, { type Express } from "express"
import cors from "cors"
import path from "path"
import { logger } from "./middleware"
import signinRouter from "./routes/signin"
import registerRouter from "./routes/register"
import usersRouter from "./routes/users"

const app: Express = express()
const port: number = 3002

// middleware
app.use(logger)
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

// endpoints (resurser)
app.use("/api/signin", signinRouter)
app.use("/api/register", registerRouter)
app.use("/api/users", usersRouter)

// listen
app.listen(port, () => {
	console.log(`Server is listening on port ${port}.`)
})