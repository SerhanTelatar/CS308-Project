const express = require("express")
const app = express()
const cors = require("cors")

const loginPage = require("./router/loginPage")
const homePage = require("./router/homePage")
const usersPage = require("./router/usersPage")
const registerPage = require("./router/registerPage")
const dotenv = require("dotenv")

const port = process.env.PORT || 4200
dotenv.config()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))

app.use("/login", loginPage)

app.use("/home", homePage)

app.use("/users", usersPage)

app.use('/register', registerPage)

app.listen(port, ()=>{
    console.log("Server is runnig on", port)
})