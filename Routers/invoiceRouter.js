import express from "express";
import invoiceModel from "../Models/invoiceModel.js";



const invoiceRouter = express.Router();

invoiceRouter.post("/", async (request, response) => {

    console.log("req----->", request);
    const invoice = new invoiceModel(request.body);
  
    try {
      await invoice.save();
      response.send(invoice);
    } catch (error) {
      response.status(500).send(error);
    }
});

export default invoiceRouter;