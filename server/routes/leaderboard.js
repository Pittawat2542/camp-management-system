const router = require("express").Router();

router.get("/", (req, res, next) => res.send("OK"));

module.exports = router;
