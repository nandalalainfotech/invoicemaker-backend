import express from "express";
import invoiceModel from "../Models/invoiceModel.js";
import Invoice from "../Models/invoiceModel.js";
import expressAsyncHandler from "express-async-handler";
import pdf from "dynamic-html-pdf";
import fs, { createReadStream } from "fs";

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
  const productId = req.params.id;
  const invoice = await Invoice.findById(productId);
  if (invoice) {
    const deletenewInvoice = await invoice.deleteOne();
    res.send({ message: "Attributed Deleted", deleteAtt: deletenewInvoice });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
}));

invoiceRouter.get(
  "/downloaduser/:id",
  expressAsyncHandler(async (req, response) => {
    let datas = [];
    var usersDetails = await Invoice.find({_id:req.params.id});
    var lastIndex = usersDetails.length - 1;
    var lastObject = usersDetails[lastIndex];
    datas.push(lastObject);

    var html = fs.readFileSync(`pdf.html`, "utf8");
    var options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
    };

    let data = lastObject;
   
    const products = data?.products;
  
    var document = {
      type: "file", // 'file' or 'buffer'
      target :"blank",
      template: html,
      context: {
        invoice: data,
        invoiceProducts: products,
      },
      path: "./output.pdf", // it is not required if type is buffer
    };



    if (data?.length === 0) {
      return null;
    }
    else {
      await pdf
        .create(document, options)
        .then((pathRes) => {
          const filestream = createReadStream(pathRes.filename);
          response.writeHead(200, {
            "Content-Disposition": "attachment;filename=" + "purchasSlips.pdf",
            "Content-Type": "application/pdf",
          });
          filestream.pipe(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  })
);

invoiceRouter.get(
  "/downloadALLPDF",
  expressAsyncHandler(async (req, response) => {
    let datas = [];
    var usersDetails = await Invoice.find();
    var lastIndex = usersDetails.length - 1;
    var lastObject = usersDetails[lastIndex];
    datas.push(lastObject);

    var html = fs.readFileSync(`pdf.html`, "utf8");
    var options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
    };

    let data = lastObject;
    const products = data?.products;
  
    var document = {
      type: "file", // 'file' or 'buffer'
      target :"blank",
      template: html,
      context: {
        invoice: data,
        invoiceProducts: products,
      },
      path: "./output.pdf", // it is not required if type is buffer
    };



    if (data?.length === 0) {
      return null;
    }
    else {
      await pdf
        .create(document, options)
        .then((pathRes) => {
          const filestream = createReadStream(pathRes.filename);
          response.writeHead(200, {
            "Content-Disposition": "attachment;filename=" + "purchasSlips.pdf",
            "Content-Type": "application/pdf",
          });
          filestream.pipe(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  })
);


export default invoiceRouter;