import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewApplication = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("Software Application Icon / SVG Required", 400)
    );
  }

  const { svg } = req.files;
  const { name } = req.body;
  if (!name) {
    return next(new ErrorHandler("Software Application Name Required", 400));
  }

  const cloudinaryRespons = await cloudinary.uploader.upload(svg.tempFilePath, {
    folder: "PORTFOLIO_SOFTWARE_APPLICATIONS",
  });
  if (!cloudinaryRespons || cloudinaryRespons.error) {
    console.error(
      "Cloudinary Error",
      cloudinaryRespons.error || "Unknown Cloudinary Error"
    );
  }

  const softwareApplication = await SoftwareApplication.create({
    name,
    svg: {
      public_id: cloudinaryRespons.public_id,
      url: cloudinaryRespons.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Software Application Added Successfully",
    softwareApplication,
  });
});
export const deleteApplication = catchAsyncError(async (req, res, next) => {
  const {id} = req.params;
  const softwareApplication = await SoftwareApplication.findById(id);
  if (!softwareApplication) {
    return next(new ErrorHandler("Software Application Not Found", 404));
    }
    const softwareApplicationSvgId = softwareApplication.svg.public_id;
    await cloudinary.uploader.destroy(softwareApplicationSvgId);
    await softwareApplication.deleteOne();
    res.status(200).json({
      success: true,
      message: "Software Application Deleted Successfully",
    });
});
export const getAllApplication = catchAsyncError(async (req, res, next) => {
  const softwareApplication = await SoftwareApplication.find();
  res.status(200).json({
    success: true,
    softwareApplication,
  });
});
