import { Router } from "express";
import registerUser, {     changeCurrentPassword, 
  getCurrentUser, 
  getUserChannelProfile, 
  getWatchHistory, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  updateAccountDetails, 
  updateUserAvatar, 
  updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateThumbnail, uploadVideo } from "../controllers/video.controller.js";



const router = Router()

router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1
  },
  {
    name: "coverImage",
    maxCount: 1
  }
]),registerUser)


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/watch-history").get(verifyJWT, getWatchHistory)

router.route("/upload-video").post(upload.fields([
  {
    name: "videoFile",
    maxCount: 1
  },
  {
    name: "thumbnail",
    maxCount: 1
  }
]),uploadVideo)

router.route("/update-thumbnail").patch(verifyJWT, upload.single("thumbnail"), updateThumbnail)

export default router;