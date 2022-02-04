const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const msgController = require("../controllers/msgController");



router.get("/", catchErrors(msgController.getMessage));
module.exports = router;