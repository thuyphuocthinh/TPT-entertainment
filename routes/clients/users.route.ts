import { Router } from "express";
import * as controller from "../../controllers/clients/users.controller";

const router: Router = Router();

router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/register", controller.getRegister);
router.post("/register", controller.postRegister);
router.get("/logout", controller.logout);

export const usersRoutes: Router = router;
