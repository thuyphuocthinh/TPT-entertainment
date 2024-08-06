import { Router } from "express";
import * as controller from "../../controllers/clients/songs.controller";
// middleware
import * as authMiddlewares from "../../middlewares/clients/authMiddleware.middleware";

const router: Router = Router();

router.get("/", controller.index);
router.get("/detail/:slug", controller.detail);
router.patch(
  "/like/:typeLike/:id",
  authMiddlewares.requireAuth,
  controller.updateLike
);
router.patch(
  "/favourite/:typeFavourite/:id",
  authMiddlewares.requireAuth,
  controller.updateFavourite
);
router.patch("/listen/:id", controller.updateListen);

export const songsRoutes: Router = router;
