import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/songs.controller";
import * as uploadCloud from "../../middlewares/admin/upload.middleware";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();
const upload = multer();

router.get("/", requestMiddleware.getReq("songs"), controller.index);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.patchReq("songs"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("songs"),
  controller.changeMulti
);
router.get(
  "/delete/:id",
  requestMiddleware.deleteReq("songs"),
  controller.deleteItem
);
router.get("/create", requestMiddleware.postReq("songs"), controller.getCreate);
router.post(
  "/create",
  requestMiddleware.postReq("songs"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  controller.postCreate
);
router.get(
  "/edit/:id",
  requestMiddleware.patchReq("songs"),
  controller.getEdit
);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("songs"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  controller.patchEdit
);
router.get(
  "/detail/:id",
  requestMiddleware.getReq("songs"),
  controller.getDetail
);

export const songsRoutes: Router = router;
