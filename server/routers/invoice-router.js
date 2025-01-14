const express = require("express");
const { 
    addInvoice,
    getAllInvoices,
    updateInvoice,getInvoiceDetails,
    deleteInvoice,} = require("../controllers/invoice-controller");
const router = express.Router();

router.post("/add", addInvoice )
router.put("/update/:id", updateInvoice )
router.delete("/delete/:id", deleteInvoice )
router.get("/get", getAllInvoices )
router.get("/details/:id", getInvoiceDetails )


module.exports = router