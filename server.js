import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
// const invoiceRouter = require("./Routers/invoiceRouter")
import invoiceRouter from "./Routers/invoiceRouter.js"
import userRouter from "./Routers/userRouter.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/api/invoices", invoiceRouter);
app.use("/api/users", userRouter);

mongoose.connect('mongodb+srv://nandalala:Spartans!23@cluster0.ujwabrm.mongodb.net/tail_invoice?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});





app.listen(8005, () => {
  console.log(`Server is running on port 8005.`);
});