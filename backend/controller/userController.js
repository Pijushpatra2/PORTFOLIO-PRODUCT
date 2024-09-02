import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload a profile picture", 400));
  }

  const { avater } = req.files;
  // console.log("AVATER", avater);

  const cloudinaryResponsForAvater = await cloudinary.uploader.upload(
    avater.tempFilePath,
    { folder: "AVATER" }
  );
  if (!cloudinaryResponsForAvater || cloudinaryResponsForAvater.error) {
    console.error(
      "Cloudinary Error",
      cloudinaryResponsForAvater.error || "Unknown Cloudinary Error"
    );
  }
  //For Resume
  const { resume } = req.files;
  // console.log("RESUME", resume);
  const cloudinaryResponsForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "MY_RESUME" }
  );
  if (!cloudinaryResponsForResume || cloudinaryResponsForResume.error) {
    console.error(
      "Cloudinary Error",
      cloudinaryResponsForResume.error || "Unknown Cloudinary Error"
    );
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    linkedinURL,
    twitterURL,
  } = req.body;
  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    linkedinURL,
    twitterURL,
    avater: {
      public_id: cloudinaryResponsForAvater.public_id,
      url: cloudinaryResponsForAvater.secure_url,
    },
    resume: {
      public_id: cloudinaryResponsForResume.public_id,
      url: cloudinaryResponsForResume.secure_url,
    },
  });
  generateToken(user, "User Registered", 201, res);
});

//For Login

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide both email and password", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password"));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password"));
  }
  generateToken(user, "Logged In", 200, res);
});

// //For Logout

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now() - 1000),
      httpOnly: true,
    })
    .json({
      status: "true",
      message: "Logged Out",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: "true",
    user,
  });
});


// // For update anything in the profile

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserdata = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfolioURL: req.body.portfolioURL,
    githubURL: req.body.githubURL,
    linkedinURL: req.body.linkedinURL,
    twitterURL: req.body.twitterURL,
  };

  if (req.files && req.files.avater) {
    const avater = req.files.avater;
    const user = await User.findById(req.user.id);
    const profileImageId = user.avater.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const cloudinaryRespons = await cloudinary.uploader.upload(
      avater.tempFilePath,
      { folder: "AVATER" }
    );
    newUserdata.avater = {
      public_id: cloudinaryRespons.public_id,
      url: cloudinaryRespons.secure_url,
    };
  }

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user.id);
    const resumeId = user.resume.public_id;
    await cloudinary.uploader.destroy(resumeId);
    const cloudinaryRespons = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: "MY_RESUME" }
    );
    newUserdata.avater = {
      public_id: cloudinaryRespons.public_id,
      url: cloudinaryRespons.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// //For Update Password

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Find All Fields.", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password is incorrect.", 401));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Password does not match.", 400));
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// // For Portfolio

export const getUserForPortfolio = catchAsyncError(async (req, res, next) => {
  const id = "66c7989b683400dbcccd714d";
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});

// // For forgot password

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `You have requested a password reset for your account. Please click on the link
  below to reset your password: \n\n ${resetPasswordUrl} \n\n If you've not requested this, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Personal Portfolio Dashboard Recovery Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(new ErrorHandler(error.message, 500));
  }
});

// // Reset Password

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }
  if (!user) {
    return next(
      new ErrorHandler("Password & confirm password do not match", 400)
    );
  }
  user.password = req.body.password;
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  generateToken(user, "Reset Password Successfully", 200, res);
});
