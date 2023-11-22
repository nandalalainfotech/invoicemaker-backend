import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    companyName: { type: String, required: false },
    billingAddress: { type: String, required: false },
    companyEmail: { type: String, required: false },
    companyMobile: { type: String, required: false },
    clientName: { type: String, required: false },
    clientAddress: { type: String, required: false },
    clientEmail: { type: String, required: false },
    clientMobileNo: { type: String, required: false },
    invoiceNo: { type: String, required: false },
    createdDate: { type: String, required: false },
    dueDate: { type: String, required: false },
    products: [],
    subTotal: { type: String, required: false },
    userid: { type: String, required: false },

});

const Invoice = mongoose.model("invoice", InvoiceSchema);

export default Invoice;