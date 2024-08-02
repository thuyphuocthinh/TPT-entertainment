import { Router } from "express";
import * as controller from "../../controllers/admin/auth.controller";

const router: Router = Router();

router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/logout", controller.logout);

export const authRoutes: Router = router;
