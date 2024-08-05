import { Router } from "express";
import * as controller from "../../controllers/clients/search.controller";

const router: Router = Router();

router.get("/:type", controller.search);

export const searchRoutes: Router = router;
