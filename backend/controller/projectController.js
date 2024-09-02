import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewProject = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload a file", 400));
  }
  const { projectBanner } = req.files;
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
  } = req.body;

  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !technologies ||
    !stack ||
    !deployed
  ) {
    return next(new ErrorHandler("Please provide all the detiles", 400));
  }
  const cloudinaryRespons = await cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    { folder: "PROJECT_BANNER" }
  );
  if (!cloudinaryRespons || cloudinaryRespons.error) {
    console.error(
      "Cloudinary Error",
      cloudinaryRespons.error || "Unknown Cloudinary Error"
    );

    return next(
      new ErrorHandler("Failed to upload projectBanner to cloudinary", 500)
    );
  }

  const project = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
    projectBanner: {
      public_id: cloudinaryRespons.public_id,
      url: cloudinaryRespons.secure_url,
    },
  });
  return res.status(201).json({
    success: true,
    message: "New Project Added",
    project,
  });
});

export const updateProject = catchAsyncError(async (req, res, next) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    gitRepoLink: req.body.gitRepoLink,
    projectLink: req.body.projectLink,
    technologies: req.body.technologies,
    stack: req.body.stack,
    deployed: req.body.deployed,
  };
  if (req.files && req.files.projectBanner) {
    const projectBanner = req.files.projectBanner;
    const project = await Project.findById(req.params.id);
    const projectBannerId = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectBannerId);
    const cloudinaryRespons = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "PROJECT_BANNER" }
    );
    newUserdata.projectBanner = {
      public_id: cloudinaryRespons.public_id,
      url: cloudinaryRespons.secure_url,
    };
  }
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    newProjectData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Project Updated",
    project,
  });
});

export const deleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project Deleted",
  });
});
export const getAllProject = catchAsyncError(async (req, res, next) => {
  const projects = await Project.find();
  res.status(200).json({
    success: true,
    projects,
  });
});
export const getSingleProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 400));
  }
  res.status(200).json({
    success: true,
    project,
  });
});
