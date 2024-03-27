import { Video } from "../models/video.models.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


const uploadVideo = asyncHandler(async(req, res) => {

  const {title, description} = req.body

  if ([title, description].some((field) => {
    return field?.trim() === ""
  })) {
    throw new ApiError(400, "All Fields are required")
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;


  if (!videoLocalPath) {
    throw new ApiError(400, "video is missing")
  }

  const thumbnailLocalPath= req.files?.thumbnail[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is missing")
  }

  const video = await uploadOnCloudinary(videoLocalPath)

  if (!video) {
    throw new ApiError(400, "video File is required")
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail File is required")
  }


  const user = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title, 
    description

  })

 return res
 .status(200)
 .json(
  new ApiResponse(200, user, "Video File Uploaded Successfully")
 )
})


const updateThumbnail = asyncHandler(async(req, res) => {

  const thumbnailLocalPath = req.file?.path

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Updated thumbnail is missing")
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

  if (!thumbnail) {
    throw new ApiError(400, "Error while updating Thumbnail")
  }

  const user = await Video.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        thumbnail: thumbnail.url
      }
    },
    {new: true}
  )

  return res
  .status(200)
  .json(new ApiResponse
    (200,
    user,
    "Thumbnail Updated Successfully"
    ))
})
export {uploadVideo, updateThumbnail}