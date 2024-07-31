import { Router } from "express";
import * as controller from "../../controllers/admin/roles.controller";

const router: Router = Router();

router.get("/", controller.index);
router.get("/updateStatus/:id/:status", controller.updateStatus);
router.patch("/changeMulti", controller.changeMulti);
router.get("/delete/:id", controller.deleteItem);
router.get("/create", controller.getCreate);
router.post("/create", controller.postCreate);
router.get("/edit/:id", controller.getEdit);
router.patch("/edit/:id", controller.patchEdit);

export const rolesRoutes: Router = router;
