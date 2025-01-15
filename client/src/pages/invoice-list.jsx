import axios from 'axios';
import { ListCollapse,  Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InvoiceModalForList from '../components/InvoiceModalForList';

const InvoiceList = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([])
 const [open, setOpen] = useState(false);
  console.log("Invoice data", invoiceList);
  console.log("Invoice data", invoiceDetails);

  const getInvoicesList = async () => {
    try {
      const result = await axios.get("http://localhost:5000/invoice/get");
      setInvoiceList(result?.data?.data || []);
    } catch (error) {
      console.error(error);
      setInvoiceList([]);
    }
  };
  const getInvoiceDetails = async(id)=>{
    try {
      const response = await axios.get(`http://localhost:5000/invoice/details/${id}`)
      setInvoiceDetails(response?.data?.data || [])
      if(response.data.success){
        setOpen(true)
      }
    } catch (error) {
      console.log(error);
      setInvoiceDetails([])
    }
    
  }
  const deleteItemHandler = async(id) =>{
    const result = await axios.delete(`http://localhost:5000/invoice/delete/${id}`);
    if(result.data.success){
      window.location.reload()
    }
    
  }

  useEffect(() => {
    getInvoicesList();
  }, []);

  return (
    <div>
      <InvoiceModalForList
            isOpen={open}
            setIsOpen={setOpen}
            invoiceDetails={invoiceDetails}
          />
      <div className="w-full flex justify-center bg-gray-50">
        <div className="container mx-auto justify-center mt-16 w-full items-start">
        <div className=" flex">
        <button
            className="items-center justify-center gap-2 font-bold  w-24 px-2 h-10 flex flex-row-reverse rounded-md bg-gray-500  text-sm text-white shadow-sm hover:bg-gray-600"
            type="submit"
            onClick={()=> window.location.href = "/"}
          >
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
            <span>Back</span>
          </button>
          <h1 className="flex items-center w-full text-4xl uppercase font-bold mb-4 underline text-gray-700 justify-center">All Invoices</h1>
        </div>
          <div className="relative overflow-x-auto border-dashed p-3 border-2 sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-600">
              <thead className="text-xs text-gray-700 border uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 border text-center py-3">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 border text-center py-3">
                    Company Name
                  </th>
                  <th scope="col" className="px-6 border text-center py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 border text-center py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 border text-center py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceList.length > 0 ? (
                  invoiceList.map((invoice, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50"
                    >
                      <td className="px-6 border text-center py-4 font-medium text-gray-900 whitespace-nowrap">
                        {invoice.customer || "N/A"}
                      </td>
                      <td className="px-6 border text-center py-4">
                        {invoice.company || "N/A"}
                      </td>
                      <td className="px-6 border text-center py-4">
                        {invoice.items.length || 0}
                      </td>
                      <td className="px-6 border  py-4">
                        {invoice.total ? `$${invoice.total}` : "N/A"}
                      </td>
                      <td className="px-6 border py-4 flex justify-center gap-2 sm:gap-4 ">
                        <button
                          className="rounded-md  text-green-500 shadow-sm transition-colors duration-200 "
                          onClick={()=> (getInvoiceDetails(invoice?._id))}
                        >
                          <ListCollapse />
                        </button>
                        <button
                          className="rounded-md  text-red-500 shadow-sm transition-colors duration-200 "
                          onClick={()=> deleteItemHandler(invoice?._id)}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
