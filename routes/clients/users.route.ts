import { Router } from "express";
import * as controller from "../../controllers/clients/users.controller";

const router: Router = Router();

router.get("/profile", controller.profile);
router.patch("/profile", controller.updateProfile);
router.get("/updatePassword", controller.getUpdatePassword);
router.patch("/updatePassword", controller.updatePassword);
router.get("/favouriteSongs", controller.favouriteSongs);
router.get("/playlists", controller.getPlaylists);
router.get("/playlists/create", controller.getCreatePlaylists);
router.post("/playlists/create", controller.postCreatePlaylists);
router.get("/playlists/:slug", controller.detailPlaylist);
router.get("/playlists/:id", controller.deletePlaylist);
router.post("/playlists/add", controller.addSongToPlaylist);
router.get("/playlists/table/:slug", controller.getTablePlaylist);
router.get("/playlists/delete/:playlistId/:songId", controller.deleteSong);

export const usersRoutes: Router = router;
