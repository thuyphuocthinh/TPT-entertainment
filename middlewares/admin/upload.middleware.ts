import { NextFunction, Request, Response } from "express";
import { uploadToCloudinary } from "../../helpers/uploadToCloudinary.helper";

export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req["file"]) {
      const result = await uploadToCloudinary(req["file"].buffer);
      req.body[req["file"].fieldname] = result;
    }
  } catch (error) {
    console.log(error);
  }
  next();
};

export const uploadFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  for (const key in req["files"]) {
    req.body[key] = [];
    const array = req["files"][key];
    for (const item of array) {
      try {
        const result = await uploadToCloudinary(item.buffer);
        req.body[key].push(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  next();
};
