import express from "express";
import invoiceModel from "../Models/invoiceModel.js";
import Invoice from "../Models/invoiceModel.js";
import expressAsyncHandler from "express-async-handler";



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

invoiceRouter.get(
  '/getInvoicedetail',
  expressAsyncHandler(async (req, res) => {

    const invoices = await Invoice.find();
    if (invoices) {
      res.send(invoices);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

invoiceRouter.delete('/deleteInvoice/:id', expressAsyncHandler(async (req, res) => {
  console.log("req=======>", req.params.id);
  const productId = req.params.id;
  console.log("productId=======>", productId);
  const invoice = await Invoice.findById(productId);
  if (invoice) {
    const deletenewInvoice = await invoice.deleteOne();
    res.send({ message: "Attributed Deleted", deleteAtt: deletenewInvoice });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
}));

export default invoiceRouter;