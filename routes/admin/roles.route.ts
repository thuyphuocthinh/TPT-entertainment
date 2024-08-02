import { Router } from "express";
import * as controller from "../../controllers/admin/roles.controller";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();

router.get("/", requestMiddleware.getReq("roles"), controller.index);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.patchReq("roles"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("roles"),
  controller.changeMulti
);
router.get(
  "/delete/:id",
  requestMiddleware.deleteReq("roles"),
  controller.deleteItem
);
router.get("/create", requestMiddleware.postReq("roles"), controller.getCreate);
router.post(
  "/create",
  requestMiddleware.postReq("roles"),
  controller.postCreate
);
router.get(
  "/edit/:id",
  requestMiddleware.patchReq("roles"),
  controller.getEdit
);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("roles"),
  controller.patchEdit
);

export const rolesRoutes: Router = router;
