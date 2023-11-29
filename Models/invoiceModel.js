import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    clientName: { type: String, required: false },
    clientAddress: { type: String, required: false },
    clientEmail: { type: String, required: false },
    clientNo: { type: String, required: false },
    invoiceNo: { type: String, required: false },
    changeCurrency: { type: String, required: false },
    createdDate: { type: String, required: false },
    Duedate: { type: String, required: false },
    test: [],
    Tax: { type: String, required: false },
    Discount: { type: String, required: false },
    shipping: { type: String, required: false },
    Balance: { type: String, required: false },
    Amount: { type: String, required: false },
    Total: { type: String, required: false },
    subtotal: { type: String, required: false },
    Email: { type: String, required: false },
    MobileNo: { type: String, required: false },
    Company: { type: String, required: false },
    CompanyName: { type: String, required: false },
    userid: { type: String, required: false },
});

const Invoice = mongoose.model("invoice", InvoiceSchema);

export default Invoice;