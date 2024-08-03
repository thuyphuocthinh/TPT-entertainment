import { Router } from "express";
import * as controller from "../../controllers/clients/homepage.controller";

const router: Router = Router();

router.get("/", controller.index);

export const homepageRoutes: Router = router;
