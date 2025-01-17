const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    customerId: Number,
    invoice_no: String,
    cashier: String,
    customer: String,
    address: String,
    company: String,
    email: String,
    phone: String,
    trans_date: String,
    subtotal:Number,
    taxRate:Number,
    discountRate:Number,
    total:Number,
    items:[]
}, { timestamps: true })

const Invoice = mongoose.model("invoice", invoiceSchema);

module.exports = Invoice;