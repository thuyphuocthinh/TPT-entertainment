import { Router } from "express";
import * as controller from "../../controllers/admin/users.controller";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();

router.get("/", requestMiddleware.getReq("users"), controller.index);
router.get(
  "/updateStatus/:id/:status",
  requestMiddleware.patchReq("accounts"),
  controller.updateStatus
);

// router.patch(
//   "/changeMulti",
//   requestMiddleware.patchReq("accounts"),
//   controller.changeMulti
// );

export const userRoutes: Router = router;
