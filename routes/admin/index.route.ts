import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { songsRoutes } from "./songs.route";
import { systemConfig } from "../../config/system.config";
import { topicsRoutes } from "./topics.route";
import { singersRoutes } from "./singers.route";
import { rolesRoutes } from "./roles.route";
import { accountsRoutes } from "./accounts.route";
import { authRoutes } from "./auth.route";
import { permissionsRoutes } from "./permissions.route";

// middlewares
import * as authMiddleware from "../../middlewares/admin/auth.middleware";
import { userRoutes } from "./users.route";
import { interfacesRoutes } from "./interfaces.route";
import { settingsRoutes } from "./settings.route";

const adminRoutes = (app: Express) => {
  app.use(
    `${systemConfig.prefixAdmin}/dashboard`,
    authMiddleware.requireAuth,
    dashboardRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/songs`,
    authMiddleware.requireAuth,
    songsRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/topics`,
    authMiddleware.requireAuth,
    topicsRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/singers`,
    authMiddleware.requireAuth,
    singersRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/roles`,
    authMiddleware.requireAuth,
    rolesRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/accounts`,
    authMiddleware.requireAuth,
    accountsRoutes
  );
  app.use(`${systemConfig.prefixAdmin}/auth`, authRoutes);
  app.use(
    `${systemConfig.prefixAdmin}/permissions`,
    authMiddleware.requireAuth,
    permissionsRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/users`,
    authMiddleware.requireAuth,
    userRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/interfaces`,
    authMiddleware.requireAuth,
    interfacesRoutes
  );
  app.use(
    `${systemConfig.prefixAdmin}/settings`,
    authMiddleware.requireAuth,
    settingsRoutes
  );
};

export default adminRoutes;
