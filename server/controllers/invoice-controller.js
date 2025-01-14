
const Invoice = require("../models/Invoice");




// add a new invoice
const addInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            formData,
            subtotal,
            taxRate,
            total,
            items
        } = req.body;
        const newInvoice = new Invoice({
            customerId:formData.id,
            invoice_no:formData.invoice_no,
            cashier: formData.cashier,
            customer:formData.customer,
            address: formData?.address,
            company: formData.company,
            email: formData.email,
            phone: formData.phone,
            trans_date: formData.trans_date,
            invoiceNumber,
            subtotal,
            taxRate,
            total,
            items
        });
        await newInvoice.save();
        res.status(201).json({
            success: true,
            data: newInvoice,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something is wrong!",
        });
    }
};

// get all invoices
const getAllInvoices = async (req, res) => {
    try {
        const listOfInvoices = await Invoice.find({});
        res.status(200).json({
            success: true,
            data: listOfInvoices,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something is wrong!",
        });
    }
};

const getInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);

        if (!invoice)
            return res.status(404).json({
                success: false,
                message: "The invoice is not found!",
            });

        return res.status(200).json({
            success: true,
            data: invoice,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something is wrong!"
        });
    }
}

// update invoices
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            name,
            description,
            category,
            price,
            salePrice,
        } = req.body;

        // one way
        const invoice = await Invoice.findByIdAndUpdate(
            { _id: id },
            {
                image,
                name,
                description,
                category,
                price,
                salePrice,
            }
        );
        if (!invoice)
            return res.status(404).json({
                success: false,
                message: "This Invoice is not found!",
            });

        res.status(200).json({
            success: true,
            data: invoice,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something is wrong!",
        });
    }
};

// delete Invoices
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByIdAndDelete({ _id: id });
        if (!invoice) return res.status(404).json({
            success: false,
            message: "the invoice not found!"
        })

        res.status(200).json({
            success: true,
            message: "The Invoice has been deleted successfully!",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something is wrong!",
        });
    }
};

module.exports = {
    addInvoice,
    getAllInvoices,
    updateInvoice,
    deleteInvoice,
    getInvoiceDetails
};