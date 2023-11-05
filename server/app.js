const express = require("express")
const app = express()

const loginPage = require("./router/loginPage")
const homePage = require("./router/homePage")
const usersPage = require("./router/usersPage")
const dotenv = require("dotenv")

const port = process.env.PORT || 4200
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use("/login", loginPage)

app.use("/home", homePage)

app.use("/users", usersPage)

app.listen(port, ()=>{
    console.log("Server is runnig on", port)
})