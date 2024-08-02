import { Router } from "express";
import * as controller from "../../controllers/admin/dashboard.controller";
// middleware
import * as requestMiddleware from "../../middlewares/admin/request.middleware";

const router: Router = Router();

router.get("/", requestMiddleware.getReq("dashboard"), controller.index);

export const dashboardRoutes: Router = router;
