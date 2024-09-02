import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/massageSchema.js";

export const sendMessage = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const { senderName, subject, message } = req.body;

  if (!senderName || !subject || !message) {
    return next(new ErrorHandler("Please fill in all fields", 400));
  }

  const newMessage = await Message.create({ senderName, subject, message });
  res.status(200).json({ 
    success: true, 
    message: "Message Sent", 
    data: newMessage });
});

export const getAllMessages = catchAsyncError(async(req, res, next) =>{
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
    });
})

export const deleteMessage = catchAsyncError(async(req, res, next) => {
  const {id} = req.params;
  const message = await Message.findById(id);

  if(!message){
    return next(new ErrorHandler("Message not found", 404));
  }
  await message.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message deleted",
  });
});