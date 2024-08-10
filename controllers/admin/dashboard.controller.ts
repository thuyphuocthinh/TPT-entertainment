import { Request, Response } from "express";
import Songs from "../../models/songs.model";
import Topics from "../../models/topics.model";
import Singers from "../../models/singers.model";
import Accounts from "../../models/accounts.model";
import Users from "../../models/users.model";

export const index = async (req: Request, res: Response) => {
  try {
    const statistic = {
      songs: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      topics: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      singers: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      accounts: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      users: {
        total: 0,
        active: 0,
        inactive: 0,
      },
    };
    // songs
    statistic.songs.total = await Songs.countDocuments({ deleted: false });
    statistic.songs.active = await Songs.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.songs.inactive = await Songs.countDocuments({
      deleted: false,
      status: "inactive",
    });

    // topics
    statistic.topics.total = await Topics.countDocuments({ deleted: false });
    statistic.topics.active = await Topics.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.topics.inactive = await Topics.countDocuments({
      deleted: false,
      status: "inactive",
    });

    // singers
    statistic.singers.total = await Singers.countDocuments({ deleted: false });
    statistic.singers.active = await Singers.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.singers.inactive = await Singers.countDocuments({
      deleted: false,
      status: "inactive",
    });

    // accounts
    statistic.accounts.total = await Accounts.countDocuments({
      deleted: false,
    });
    statistic.accounts.active = await Accounts.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.accounts.inactive = await Accounts.countDocuments({
      deleted: false,
      status: "inactive",
    });

    // users
    statistic.users.total = await Users.countDocuments({ deleted: false });
    statistic.users.active = await Users.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.users.inactive = await Users.countDocuments({
      deleted: false,
      status: "inactive",
    });

    res.render("admin/pages/dashboard/index", {
      pageTitle: "Dashboard",
      statistic,
    });
  } catch (error) {
    console.log(error);
  }
};
