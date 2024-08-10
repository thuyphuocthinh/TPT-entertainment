"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const search = (req) => {
    const objSearch = {
        keyword: req.query.search.toString(),
        regex: new RegExp(req.query.search.toString(), "i"),
    };
    return objSearch;
};
exports.search = search;
