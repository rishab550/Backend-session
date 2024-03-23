// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";



//--------------------------------- Imported These statements to connect Database using First Approach -------------------------//




import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env"
})


connectDB()
.then(() => {
  app.on("error", (error) => {
     console.log("Error: ", error);
  })
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Sever is Running at Port ${process.env.PORT}`)
  })
})
.catch((error) => {
  console.error("MongoDB Connection Error: ", error);
})


                                             // ----First Approach to Connect DB --------//



// import express from "express";
// const app = express()

//   (async () => {
//     try {
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//       app.on("error", (error) => {console.log("Error:", error); throw error})
//       app.listen(process.env.Port, () => {
//         console.log( `App is listening on Port ${process.env}` )
//       })
//     } catch (error) {
//       console.error("Error:", error)
//       throw error
//     }
//   })()


                                             // ----First Approach to Connect DB --------//

