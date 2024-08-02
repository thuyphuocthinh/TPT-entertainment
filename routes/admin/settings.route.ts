import { Router } from "express";
import * as controller from "../../controllers/admin/settings.controller";
import multer from "multer";
import * as uploadCloudinary from "../../middlewares/admin/upload.middleware";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";
const upload = multer();
const router: Router = Router();

router.get("/", requestMiddleware.getReq("settings"), controller.index);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("settings"),
  upload.single("image"),
  uploadCloudinary.uploadSingle,
  controller.patchEdit
);

export const settingsRoutes: Router = router;
