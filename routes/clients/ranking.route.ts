import { Router } from "express";
import * as controller from "../../controllers/clients/ranking.controller";

const router: Router = Router();

router.get("/", controller.index);

export const rankingRoutes: Router = router;
