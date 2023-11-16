import express from "express";
import invoiceModel from "../Models/invoiceModel.js";



const invoiceRouter = express.Router();

invoiceRouter.post("/invoicedetail", async (request, response) => {

  const invoice = new invoiceModel(request.body);

  try {
    await invoice.save();
    response.send(invoice);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default invoiceRouter;