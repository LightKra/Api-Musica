const express = require("express");
const router = express.Router();
const Auth = require("../controllers/authController");
const {validationControllerUserPost} = require("../middleware/validations/validationControllerUser");
const {validationControllerAuthPost} = require("../utils/../middleware/validations/validationControllerAuth");

router.post("/registro", validationControllerUserPost, Auth.userRegister);
router.post("/sesion", validationControllerAuthPost, Auth.userLogin);

module.exports = router;