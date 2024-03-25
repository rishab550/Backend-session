import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt  from "jsonwebtoken";

const generateAccessAndRefereshToken = async(userId) => 
{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})


    return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Refresh and Access Token")
  }
}


const registerUser = asyncHandler(async (req, res) => {

   const {username, email, fullname, password} = req.body
   console.log("email: " ,email);

if ([fullname, email, username, password].some((field) => {
  return field?.trim() === ""
})) {
  throw new ApiError(400, "All fields are required")
}

const existedUser = await User.findOne({
  $or: [{ username }, { email }]
})

if (existedUser) {
  throw new ApiError(409, "User Already Exists")
}


const avatarLocalPath = req.files?.avatar[0]?.path;


let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  coverImageLocalPath = req.files.coverImage[0].path
}

if (!avatarLocalPath) {
  throw new ApiError(400, "Avatar is Required")
}
  

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar) {
  throw new ApiError(400, "Avatar File is required")
}

const user = await User.create(
  {
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  }
)

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)

if (!createdUser) {
  throw new ApiError(500, "Something went wrong while register a user")
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User Registered Successfully")
)

})


const loginUser = asyncHandler(async (req, res) =>{
 

  const {email, username, password} = req.body
  console.log(email);

  if (!(username || email)) {
      throw new ApiError(400, "username or email is required")
  }


  const user = await User.findOne({
      $or: [{username}, {email}]
  })

  if (!user) {
      throw new ApiError(404, "User does not exist")
  }

 const isPasswordValid = await user.isPasswordCorrect(password)

 if (!isPasswordValid) {
  throw new ApiError(401, "Invalid user credentials")
  }

 const {accessToken, refreshToken} = await generateAccessAndRefereshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
      httpOnly: true,
      secure: true
  }

  console.log(accessToken);
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

})


const logoutUser = asyncHandler(async(req, res) => {
  
 await User.findByIdAndUpdate(
    req.user._id,{
      $unset: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})


const refreshAccessToken = asyncHandler(async(req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorised request")
  }

 try {
   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
   const user = await User.findById(decodedToken?._id)
 
   if (!user) {
     throw new ApiError(401, "Invalid Refresh Token")
   }
 
   if (incomingRefreshToken !== user?.refreshToken) {
     throw new ApiError(401, "Refresh Token is Expired or used")
   }
 
   const options = {
     httpOnly: true,
     secure: true
   }
 
 const {accessToken, newRefreshToken} = generateAccessAndRefereshToken(user._id)
 
 return res
 .status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", newRefreshToken, options)
 .json(
   new ApiResponse(
     200,
     {accessToken, refreshToken: newRefreshToken}, "Access Token refreshed Successfully"
   )
 )
 } catch (error) {
  throw new ApiError(401, error?.message || "Invalid Refresh Request")
 }
})

export default registerUser;
export {loginUser, logoutUser, refreshAccessToken}
