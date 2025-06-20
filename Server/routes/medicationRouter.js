const Router = require("express")
const router = new Router()
const medicationController = require("../controllers/medicationController")

router.get("/", medicationController.getMedication)

module.exports = router