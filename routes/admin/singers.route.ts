import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/singers.controller";
import * as uploadCloud from "../../middlewares/admin/upload.middleware";

const router: Router = Router();
const upload = multer();

router.get("/", controller.index);
router.get("/updateStatus/:id/:status", controller.updateStatus);
router.patch("/changeMulti", controller.changeMulti);
router.get("/delete/:id", controller.deleteItem);
router.get("/create", controller.getCreate);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.postCreate
);

router.get("/edit/:id", controller.getEdit);
router.patch(
  "/edit/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  controller.patchEdit
);
router.get("/detail/:id", controller.getDetail);

export const singersRoutes: Router = router;
