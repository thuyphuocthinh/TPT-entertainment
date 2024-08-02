import { Router } from "express";
import * as controller from "../../controllers/admin/permissions.controller";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();

router.get("/", requestMiddleware.getReq("permissions"), controller.index);
router.patch("/edit", requestMiddleware.patchReq("permissions"), controller.patchEdit);

export const permissionsRoutes: Router = router;
