// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";


//--------------------------------- Imported These statements to connect Database using First Approach -------------------------//


import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env"
})


connectDB()


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

