import { Router } from "express";
import * as controller from "../../controllers/admin/accounts.controller";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();

router.get("/", requestMiddleware.getReq("accounts"), controller.index);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.patchReq("accounts"),
  controller.updateStatus
);
router.patch(
  "/changeMulti",
  requestMiddleware.patchReq("accounts"),
  controller.changeMulti
);
router.get(
  "/delete/:id",
  requestMiddleware.deleteReq("accounts"),
  controller.deleteItem
);
router.get(
  "/create",
  requestMiddleware.postReq("accounts"),
  controller.getCreate
);
router.post(
  "/create",
  requestMiddleware.postReq("accounts"),
  controller.postCreate
);
router.get(
  "/edit/:id",
  requestMiddleware.patchReq("accounts"),
  controller.getEdit
);
router.patch(
  "/edit/:id",
  requestMiddleware.patchReq("accounts"),
  controller.patchEdit
);

export const accountsRoutes: Router = router;
