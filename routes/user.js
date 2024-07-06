const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();
const {validationControllerUserPost, validationControllerUserPut} = require("../middleware/validations/validationControllerUser");
const {authenticateJwt, authorizeRole} = require("../middleware/authentication");

router.post("/registro",[authenticateJwt, authorizeRole(["admin"]), validationControllerUserPost], UserController.save);
router.get("/buscar", [authenticateJwt, authorizeRole(["admin"])], UserController.allFind);
router.get("/buscarId/:id",[authenticateJwt, authorizeRole(["admin"])], UserController.findId);
router.put("/actualizarId/:id",[authenticateJwt, authorizeRole(["admin", "user"]), validationControllerUserPut], UserController.updateId);
router.delete("/eliminarId/:id",[authenticateJwt, authorizeRole(["admin", "user"])], UserController.deleteId);

module.exports = router;
