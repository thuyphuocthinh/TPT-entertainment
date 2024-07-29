import { Router } from "express";
import * as controller from "../../controllers/admin/songs.controller";
const router: Router = Router();

router.get("/", controller.index);
router.get("/updateStatus/:id/:status", controller.updateStatus);

export const songsRoutes: Router = router;
