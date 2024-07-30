import { Router } from "express";
import * as controller from "../../controllers/admin/songs.controller";
const router: Router = Router();

router.get("/", controller.index);
router.get("/updateStatus/:id/:status", controller.updateStatus);
router.patch("/changeMulti", controller.changeMulti);

export const songsRoutes: Router = router;
