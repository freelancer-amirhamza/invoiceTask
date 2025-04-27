import React, { Fragment,  useMemo,  } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { headerColumns } from '../config';
import { useTable } from 'react-table';
import { CSVLink } from 'react-csv';
const date = new Date();
  const today = date.toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
  
const InvoiceModalForList = ({
  isOpen,
  setIsOpen,
  invoiceDetails = { items: [] }
}) => {
  console.log(invoiceDetails, "it's ok")
  // add invoice to server side
  function closeModal() {
    setIsOpen(false);
  }

  // Csv handler
const initialData = useMemo(() => {
    // Map items to the desired row format
    const itemRows = invoiceDetails?.items?.map((item) => ({
      invoice_no: invoiceDetails?.invoice_no,
      customer: invoiceDetails?.customer,
      email: invoiceDetails?.email,
      company: invoiceDetails?.company,
      address: invoiceDetails?.address,
      phone: invoiceDetails?.phone,
      id: invoiceDetails?.customerId,
      taxRate: invoiceDetails?.taxRate,
      discountRate: invoiceDetails?.discountRate,
      product: item.name,
      quantity: item.qty,
      subtotal: invoiceDetails?.subtotal,
      total: invoiceDetails?.total,
    })) || [];
  
    return itemRows;
  }, [invoiceDetails]);
  
  
  
  const data = useMemo(() => initialData, [initialData]);
  const columns = useMemo(() => headerColumns, []);
  
  const { rows } = useTable({ columns, data });

  const csvData = [
    columns.map(col => col.Header),
    ...rows.map(row => columns.map(col => row.values[col.accessor] )),
  ]


// PDF handler
  const SaveAsPDFHandler = () => {
    const dom = document.getElementById('print');
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = 'annoymous';
        img.src = dataUrl;
        img.onload = () => {
          // Initialize the PDF.
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [5.5, 8.5],
          });

          // Define reused data
          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Calculate the number of pages.
          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          // Define pageHeight separately so it can be trimmed on the final page.
          let pageHeight = pdf.internal.pageSize.getHeight();

          // Create a one-page canvas to split up the full image.
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            // Display the page.
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = 'white';
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            // Add the page to the PDF.
            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }
          // Output / Save
          pdf.save('invoice.pdf');
        };
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
              <div className="p-8 md:px-16 md:pt-16 md:pb-8 " id="print">
                <div className="flex w-full">
                <h1 className="text-center w-full justify-start flex md:text-sm text-xs mt-2  font-semibold text-gray-600">
                  Current Data: {today}
                </h1>
                <h1 className="text-center w-full  flex justify-center text-2xl font-bold text-gray-900">
                  INVOICE
                </h1>
                <h1 className="text-center w-full  flex justify-end md:text-sm text-xs mt-2 font-semibold text-gray-600">
                  Transport Date: {invoiceDetails?.trans_date}
                </h1>
                </div>
                {/*  */}
                <div className="mt-6 border-dotted border-2 md:p-12 rounded-md p-8">
                  <div className="mb-4 grid grid-cols-2">
                    <div className="flex flex-col py-2">
                    <label className="font-bold">Customer Name:</label>
                    <span className="font-semibold " >{invoiceDetails?.customer}</span>
                    </div>
                    <div className="flex flex-col py-2 ">
                    <label className="font-bold">Invoice No:</label>
                    <span className="font-semibold " >{invoiceDetails?.invoice_no}</span>
                    </div>
                    <div className="flex flex-col py-2 ">
                    <label className="font-bold">Email:</label>
                    <span className="font-semibold " >{invoiceDetails?.email}</span>
                    </div>
                    <div className="flex flex-col py-2 ">
                    <label className="font-bold">Phone:</label>
                    <span className="font-semibold " >{invoiceDetails?.phone}</span>
                    </div>
                    <div className="flex flex-col py-2 ">
                    <label className="font-bold">Address:</label>
                    <span className="font-semibold " >{invoiceDetails?.address}</span>
                    </div>
                    <div className="flex flex-col py-2 ">
                    <label className="font-bold">Company Name:</label>
                    <span className="font-semibold " >{invoiceDetails?.company}</span>
                    </div>
                    
                    
                  </div>

                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-y border-black/10 text-sm md:text-base">
                        <th>ITEM</th>
                        <th className="text-center">QTY</th>
                        <th className="text-right">PRICE</th>
                        <th className="text-right">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceDetails?.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="w-full">{item.name}</td>
                          <td className="min-w-[50px] text-center">
                            {item.qty}
                          </td>
                          <td className="min-w-[80px] text-right">
                            ${Number(item.price).toFixed(2)}
                          </td>
                          <td className="min-w-[90px] text-right">
                            ${Number(item.price * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex flex-col items-end space-y-2">
                    <div className="flex w-full justify-between border-t border-black/10 pt-2">
                      <span className="font-bold">Subtotal:</span>
                     <span>${invoiceDetails.subtotal || "N/A"}</span>
                    </div>
                    <div className="flex w-full justify-between">
                      <span className="font-bold">Discount:</span>
                      <span>${invoiceDetails.discountRate || "N/A"}</span>
                    </div>
                    <div className="flex w-full justify-between">
                      <span className="font-bold">Tax:</span>
                      <span>${invoiceDetails.taxRate || "N/A"}</span>
                    </div>
                    <div className="flex w-full justify-between border-t border-black/10 py-2">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">
                        $
                        {invoiceDetails.total ||  "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 px-4 pb-6">
                <button
                  className="flex w-full items-center justify-center space-x-1 rounded-md border border-orange-500 py-2 text-sm text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white"
                  onClick={SaveAsPDFHandler}
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download</span>
                </button>

                <CSVLink 
                data={csvData} 
                filename='invoiceCsv.csv'
                className="flex w-full items-center justify-center space-x-1 rounded-md border border-green-500 py-2 text-sm text-green-500 shadow-sm hover:bg-green-500 hover:text-white"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download CSV</span>
                </CSVLink>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModalForList;
