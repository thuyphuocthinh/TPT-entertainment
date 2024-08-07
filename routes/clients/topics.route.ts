import { Router } from "express";
import * as controller from "../../controllers/clients/topics.controller";

const router: Router = Router();
router.get("/", controller.index);
router.get("/:slug", controller.detail);

export const topicsRoutes: Router = router;
