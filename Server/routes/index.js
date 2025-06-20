const Router = require("express")
const router = new Router()
const medicationRouter = require("./medicationRouter")

router.use("/medication", medicationRouter)

module.exports = router