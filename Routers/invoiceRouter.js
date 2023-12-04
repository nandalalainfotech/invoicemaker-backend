import express from "express";
import expressAsyncHandler from "express-async-handler";
import fs, { createReadStream } from "fs";
import Invoice from "../Models/invoiceModel.js";
import pdf from "dynamic-html-pdf";


const invoiceRouter = express.Router();

invoiceRouter.post("/invoicedetail", async (request, response) => {
  const invoice = new Invoice(request.body);

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
invoiceRouter.put("/updateInvoice/:id", expressAsyncHandler(async (req, res) => {
  const invoiceUpdateId = req.params.id;
  const invoiceupdate = await Invoice.findById(invoiceUpdateId);
  if (invoiceupdate) {
    invoiceupdate.clientName = req.body.clientName;
    invoiceupdate.clientAddress = req.body.clientAddress;
    invoiceupdate.clientEmail = req.body.clientEmail;
    invoiceupdate.clientNo = req.body.clientNo;
    invoiceupdate.invoiceNo = req.body.invoiceNo;
    invoiceupdate.changeCurrency = req.body.changeCurrency;
    invoiceupdate.createdDate = req.body.createdDate;
    invoiceupdate.Duedate = req.body.Duedate;
    invoiceupdate.test = req.body.test;
    invoiceupdate.Tax = req.body.Tax;
    invoiceupdate.Discount = req.body.Discount;
    invoiceupdate.shipping = req.body.shipping;
    invoiceupdate.Balance = req.body.Balance;
    invoiceupdate.Amount = req.body.Amount;
    invoiceupdate.Total = req.body.Total;
    invoiceupdate.subtotal = req.body.subtotal;
    invoiceupdate.Email = req.body.Email;
    invoiceupdate.MobileNo = req.body.MobileNo;
    invoiceupdate.Company = req.body.Company;
    invoiceupdate.CompanyName = req.body.CompanyName;
    const updateinvoice = await invoiceupdate.save();
    res.send({ message: "Updated", orderdetail: updateinvoice });
  } else {
    res.status(404).send({ message: "Orderdetail Detail Not Found" });
  }
})
);


invoiceRouter.get(
  "/downloaduser/:id",
  expressAsyncHandler(async (req, response) => {
    let datas = [];
    var usersDetails = await Invoice.find({ _id: req.params.id });
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
      target: "blank",
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
  '/downloadALLPDF', expressAsyncHandler(async (req, res) => {

    let datas = [];
    var usersDetails = await Invoice.find();
    var lastIndex = usersDetails.length - 1;
    var lastObject = usersDetails[lastIndex];
    datas.push(lastObject);
    var html = fs.readFileSync(`pdf.html`, "utf8");
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };
    let data = lastObject;
    let objects = {
      clientname: data.clientName,
      companyName: data.CompanyName,
      mobileNo: data.MobileNo,
      client: data.clientName,
      clientemail: data.clientEmail,
      clientaddress: data.clientAddress,
      clientNumber: data.clientNo,
      invoicenumber: data.invoiceNo,
      changecurrency: data.changeCurrency,
      createdate: data.createdDate,
      duedate: data.Duedate,
      tax: data.Tax,
      discount: data.Discount,
      Shipping: data.shipping,
      balance: data.Balance,
      amount: data.Amount,
      total: data.Total,
      subTotal: data.subtotal,
      email: data.Email,
      companyAddress: data.Company,
    }
    console.log("objects------->", objects)

    console.log("data------->", data)
    var document = {
      type: "file", // 'file' or 'buffer'
      target: "blank",
      template: html,
      context: {
        object: objects,
        invoice: data,
        invoiceProducts: data.test,
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
          res.writeHead(200, {
            "Content-Disposition": "attachment;filename=" + "purchasSlips.pdf",
            "Content-Type": "application/pdf",
          });
          filestream.pipe(res);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  })
)



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

invoiceRouter.get("/editInvoice/:id", expressAsyncHandler(async (req, res) => {
  const invoiceDetailId = req.params.id;
  const invoiceId = await Invoice.findById({ _id: invoiceDetailId });
  if (invoiceId) {
    res.send(invoiceId);
  } else {
    res.status(404).send({ message: "Invoice Detail Not Found" });
  }
})
);

export default invoiceRouter;