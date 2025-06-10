import { Request, Response } from "express";

export const expireCookieTest = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("Expiring Cookie for Testing...");

  return res
    .status(401)
    .clearCookie("authToken", {
      httpOnly: true,
      sameSite: "strict",
    })
    .json({ message: "Cookie Expired" });
};
