import { Router } from "express";
import * as controller from "../../controllers/clients/download.controller";

const router: Router = Router();

router.get("/:url", controller.download);

export const downloadRoutes: Router = router;
