const asyncHandler = (requestHandler) => {
   (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
   }
}


export default asyncHandler;



// const asyncHandler = (fn) => async(error, req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// };