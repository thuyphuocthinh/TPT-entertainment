import { Router } from "express";
import multer from "multer";
import * as controller from "../../controllers/admin/songs.controller";
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
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  controller.postCreate
);

export const songsRoutes: Router = router;
