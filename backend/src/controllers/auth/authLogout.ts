import { Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  console.log("Successfully Logged Out");
  return res
    .clearCookie("authToken", {
      httpOnly: true,
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Successfully Logged Out" });
};
