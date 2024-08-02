import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/topics.controller";
import * as uploadCloud from "../../middlewares/admin/upload.middleware";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();
const upload = multer();

router.get("/", requestMiddleware.getReq("topics"), controller.index);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.patchReq("topics"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("topics"),
  controller.changeMulti
);
router.get(
  "/delete/:id",
  requestMiddleware.deleteReq("topics"),
  controller.deleteItem
);
router.get(
  "/create",
  requestMiddleware.postReq("topics"),
  controller.getCreate
);
router.post(
  "/create",
  requestMiddleware.postReq("topics"),
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.postCreate
);

router.get(
  "/edit/:id",
  requestMiddleware.patchReq("topics"),
  controller.getEdit
);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("topics"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  controller.patchEdit
);
router.get(
  "/detail/:id",
  requestMiddleware.getReq("topics"),
  controller.getDetail
);

export const topicsRoutes: Router = router;
