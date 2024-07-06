const express = require("express");
const router = express.Router();
const TrackController = require("../controllers/tracksController");
const {uploadMiddleware} = require("../middleware/handleStorage");
const {validationControllerTrackPost, validationControllerTrackPutId,validationControllerTrackDeleteId} = require("../middleware/validations/validationControllerTrack");
const {authenticateJwt, authorizeRole} = require("../middleware/authentication");

router.post("/registro",[authenticateJwt, authorizeRole(["admin"]), uploadMiddleware, validationControllerTrackPost],TrackController.save);
router.get("/buscar",[authenticateJwt, authorizeRole(["user", "admin"])],TrackController.allFind);
router.get("/buscarId/:id",[authenticateJwt, authorizeRole(["user", "admin"])],TrackController.findId);
router.put("/actualizarId/:id",[authenticateJwt, authorizeRole(["admin"]), uploadMiddleware, validationControllerTrackPutId], TrackController.updateId);
router.delete("/eliminarId/:id",[authenticateJwt, authorizeRole(["admin"]), validationControllerTrackDeleteId],TrackController.deleteId);

module.exports = router;