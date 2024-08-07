import { Request, Response } from "express";
import Singers from "../../models/singers.model";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";

export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      title?: RegExp;
      status?: string;
    }

    let find: Find = {
      deleted: false,
      status: "active",
    };
    // pagination
    const countRecords = await Singers.countDocuments({
      deleted: false,
      status: "active",
    });
    let currentPage: number = 1;
    if (req.query.page) {
      currentPage = Number(req.query.page);
    }
    let objPagination: Pagination = {
      currentPage: currentPage,
      totalPages: 0,
      skip: 0,
      limit: 4,
    };
    objPagination = pagination(objPagination, countRecords);
    const singers = await Singers.find(find);
    console.log(singers);
    res.render("clients/pages/singers/index", {
      pageTitle: "Ca sĩ",
      singers,
      pagination: objPagination,
    });
  } catch (error) {
    console.log(error);
  }
};
