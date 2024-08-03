import { Router } from "express";
import * as controller from "../../controllers/admin/interfaces.controller";
import multer from "multer";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";
import * as uploadCloudinary from "../../middlewares/admin/upload.middleware";
const upload = multer();

const router: Router = Router();

router.get(
  "/carousels",
  requestMiddleware.getReq("interfaces/carousels"),
  controller.index
);
router.get(
  "/carousels/create",
  requestMiddleware.postReq("interfaces/carousels"),
  controller.getCreate
);
router.post(
  "/carousels/create",
  requestMiddleware.postReq("interfaces/carousels"),
  upload.single("image"),
  uploadCloudinary.uploadSingle,
  controller.postCreate
);
router.get("/carousels/delete/:id", controller.deleteItem);

export const interfacesRoutes: Router = router;
