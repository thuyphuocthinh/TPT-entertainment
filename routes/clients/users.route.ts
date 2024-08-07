import { Router } from "express";
import * as controller from "../../controllers/clients/users.controller";

const router: Router = Router();

router.get("/profile", controller.profile);
router.patch("/profile", controller.updateProfile);
router.get("/updatePassword", controller.getUpdatePassword);
router.patch("/updatePassword", controller.updatePassword);
router.get("/favouriteSongs", controller.favouriteSongs);

export const usersRoutes: Router = router;
