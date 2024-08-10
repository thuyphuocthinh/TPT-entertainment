import { Request, Response } from "express";
import { search } from "../../helpers/search.helper";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";
import Users from "../../models/users.model";

export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      title?: RegExp;
      status?: string;
    }

    let find: Find = {
      deleted: false,
    };

    // search
    if (req.query.search) {
      find.title = search(req).regex;
    }

    // sort criteria
    let sortBy: string = "";
    let sortObj: {} = { email: "desc" };
    const sortCriteria: { keyValue: string; title: string }[] = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp email giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp email tăng dần",
      },
      {
        keyValue: "fullName-desc",
        title: "Sắp xếp tên giàm dần dần",
      },
      {
        keyValue: "fullName-asc",
        title: "Sắp xếp tên tăng dần dần",
      },
    ];

    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toString();
      const sortValue = req.query.sortValue.toString();
      sortBy = sortKey + "-" + sortValue;
      sortObj[sortKey] = sortValue;
    }

    // filter
    let filter: string = "";
    const filterCriteria: { title: string; value: string }[] = [
      {
        title: "All",
        value: "",
      },
      {
        title: "Active",
        value: "active",
      },
      {
        title: "Inactive",
        value: "inactive",
      },
    ];

    if (req.query.status) {
      find.status = req.query.status.toString();
      filter = req.query.status.toString();
    }

    // pagination
    const countRecords = await Users.countDocuments({ deleted: false });
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

    const users = await Users.find(find)
      .sort(sortObj)
      .limit(objPagination.limit)
      .skip(objPagination.skip);

    res.render("admin/pages/users/index", {
      pageTitle: "Quản lí tài khoản user",
      users,
      keyword: req.query.search || "",
      sortCriteria,
      sortBy: sortBy,
      filterCriteria,
      filter,
      pagination: objPagination,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const statusChange: string = req.params.status;
    const id: string = req.params.id;
    await Users.updateOne(
      {
        _id: id,
      },
      {
        status: statusChange,
      }
    );
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
