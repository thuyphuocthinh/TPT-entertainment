import { Router } from "express";
import * as controller from "../../controllers/clients/singers.controller";
// middleware

const router: Router = Router();

router.get("/", controller.index);

export const singersRoutes: Router = router;
