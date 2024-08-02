import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/singers.controller";
import * as uploadCloud from "../../middlewares/admin/upload.middleware";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();
const upload = multer();

router.get("/", requestMiddleware.getReq("singers"), controller.index);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.patchReq("singers"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("singers"),
  controller.changeMulti
);
router.get(
  "/delete/:id",
  requestMiddleware.deleteReq("singers"),
  controller.deleteItem
);
router.get(
  "/create",
  requestMiddleware.postReq("singers"),
  controller.getCreate
);
router.post(
  "/create",
  requestMiddleware.postReq("singers"),
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.postCreate
);

router.get(
  "/edit/:id",
  requestMiddleware.patchReq("singers"),
  controller.getEdit
);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("singers"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  controller.patchEdit
);
router.get(
  "/detail/:id",
  requestMiddleware.getReq("singers"),
  controller.getDetail
);

export const singersRoutes: Router = router;
