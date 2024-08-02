import { Request, Response } from "express";
import Roles from "../../models/roles.model";
import Accounts from "../../models/accounts.model";
import md5 from "md5";
import { search } from "../../helpers/search.helper";
import { Pagination } from "../../interfaces/system.interface";
import { pagination } from "../../helpers/pagination.helper";
import { systemConfig } from "../../config/system.config";
import { generateRandomString } from "../../helpers/generator.helper";

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
    const countRecords = await Accounts.countDocuments({ deleted: false });
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

    const accounts = await Accounts.find(find)
      .sort(sortObj)
      .limit(objPagination.limit)
      .skip(objPagination.skip);

    for (const account of accounts) {
      const role = await Roles.findOne({ _id: account.roleId, deleted: false });
      account["infoRole"] = role;
    }

    res.render("admin/pages/accounts/index", {
      pageTitle: "Quản lí tài khoản admin",
      accounts,
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
    await Accounts.updateOne(
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

export const changeMulti = async (req: Request, res: Response) => {
  try {
    const updateObj: { changeMulti: string; ids: string } = JSON.parse(
      req.body.updateInfo
    );

    const typeChange: string = updateObj.changeMulti;
    const ids: string[] = updateObj.ids.split("-");
    enum CHANGE_MULTI {
      DELETE_ALL = "deleteAll",
      CHANGE_STATUS = "changeStatus",
    }

    switch (typeChange) {
      case CHANGE_MULTI.DELETE_ALL: {
        ids.forEach(async (id) => {
          await Accounts.updateOne(
            {
              _id: id,
              deleted: false,
            },
            {
              deleted: true,
            }
          );
        });
        req.flash("success", "Cập nhật thành công");
        break;
      }
      case CHANGE_MULTI.CHANGE_STATUS: {
        ids.forEach(async (id) => {
          const account = await Accounts.findOne({ _id: id, deleted: false });
          const statusChange =
            account.status === "active" ? "inactive" : "active";
          await Accounts.updateOne(
            { _id: id, deleted: false },
            {
              status: statusChange,
            }
          );
        });
        req.flash("success", "Cập nhật thành công");
        break;
      }
      default:
        req.flash("error", "Lỗi cập nhật");
        break;
    }

    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Accounts.updateOne({ _id: id, deleted: false }, { deleted: true });
    req.flash("success", "Xóa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

export const getCreate = async (req: Request, res: Response) => {
  try {
    const roles = await Roles.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
      pageTitle: "Thêm tài khoản",
      roles,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postCreate = async (req: Request, res: Response) => {
  try {
    const checkEmail = await Accounts.findOne({ email: req.body.email });
    if (checkEmail) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }

    const dataAccount = {
      email: req.body.email,
      password: md5(req.body.password),
      status: req.body.status,
      token: generateRandomString(30),
      roleId: req.body.roleId,
    };

    const record = new Accounts(dataAccount);
    await record.save();
    req.flash("success", "Thêm tài khoản mới thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.log(error);
  }
};

export const getEdit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const account = await Accounts.findOne({
      _id: id,
      deleted: false,
      status: "active",
    });
    const roles = await Roles.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
      pageTitle: `Chỉnh sửa tài khoản`,
      account,
      roles,
    });
  } catch (error) {
    console.log(error);
  }
};

export const patchEdit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const dataAccount = {
      email: req.body.email,
      status: req.body.status,
      roleId: req.body.roleId,
    };
    if (req.body.password) {
      dataAccount["password"] = md5(req.body.password);
    }

    await Accounts.updateOne(
      {
        _id: id,
      },
      dataAccount
    );

    req.flash("success", "Chỉnh sửa thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.log(error);
  }
};
