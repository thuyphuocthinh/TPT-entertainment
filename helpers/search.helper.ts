import { Request } from "express";

export const search = (req: Request) => {
  const objSearch: {
    keyword: string;
    regex: RegExp;
  } = {
    keyword: req.query.search.toString(),
    regex: new RegExp(req.query.search.toString(), "i"),
  };
  return objSearch;
};
