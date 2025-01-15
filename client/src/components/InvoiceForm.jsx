import React, { useState } from 'react';
import { uid } from 'uid';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import incrementString from '../helpers/incrementString';
import { initialData } from '../config';

const date = new Date();
const today = date.toLocaleDateString('en-GB', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});

const initialFormData = {
  invoice_no: "",
    customer: "",
    cashier: "",
    address: "",
    company: "",
    email: "",
    phone: "",
    trans_date: "",
    due_date: "",
}




const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(1);


  

  // State to store the selected item's data
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    const selectedItem = initialData.find(
      (item) => item.customer === value || item.id === value
    );

    // If found, populate form data; otherwise, reset
    if (selectedItem) {
      setFormData({
        id: selectedItem.id,
        invoice_no: selectedItem.invoice_no,
        customer: selectedItem.customer,
        address: selectedItem.address,
        company: selectedItem.company,
        email: selectedItem.email,
        phone: selectedItem.phone,
        trans_date: selectedItem.trans_date,
        due_date: selectedItem.due_date,
      });
    } else {
      setFormData(initialFormData);
    }
    console.log(formData)
  };





  const [items, setItems] = useState([
    {
      id: uid(6),
      name: '',
      qty: "",
      price: '',
    },
  ]);

  const reviewInvoiceHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const addNextInvoiceHandler = () => {
    setInvoiceNumber((prevNumber) => incrementString(prevNumber));
    setItems([
      {
        id: uid(6),
        name: '',
        qty: "",
        price: '',
      },
    ]);
  };

  const addItemHandler = () => {
    const id = uid(6);
    setItems((prevItem) => [
      ...prevItem,
      {
        id: id,
        name: '',
        qty: "",
        price: '',
      },
    ]);
  };

  const deleteItemHandler = (id) => {
    setItems((prevItem) => prevItem.filter((item) => item.id !== id));
  };

  const edtiItemHandler = (event) => {
    const editedItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };

    const newItems = items.map((items) => {
      for (const key in items) {
        if (key === editedItem.name && items.id === editedItem.id) {
          items[key] = editedItem.value;
        }
      }
      return items;
    });

    setItems(newItems);
  };

  const subtotal = items.reduce((prev, curr) => {
    if (curr.name.trim().length > 0)
      return prev + Number(curr.price * Math.floor(curr.qty));
    else return prev;
  }, 0);
  const taxRate = (tax * subtotal) / 100;
  const discountRate = (discount * subtotal) / 100;
  const total = subtotal - discountRate + taxRate;

  const invoiceList = ()=>{
    window.location.href = "/invoice-list"
  }

  return (
    <form
      className="relative flex flex-col px-2 md:flex-row"
      onSubmit={reviewInvoiceHandler}
    >
      <div className="my-6 flex-1 space-y-2  rounded-md bg-white p-4 shadow-sm sm:space-y-4 md:p-6">
        <div className="flex flex-col justify-between space-y-2 border-b border-gray-900/10 pb-4 md:flex-row md:items-center md:space-y-0">
          <div className="flex space-x-2">
            <span className="font-bold">Current Date: </span>
            <span>{today}</span>
          </div>
          <div className="flex items-center space-x-2">

            <label className="font-bold" htmlFor="invoiceNumber">
              Invoice Number:
            </label>
            <input
              className="max-w-[130px]"
              type="text"
              name="invoice_no"
              id="invoice_no"
              value={today + invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
            />
          </div>
        </div>
        <h1 className="text-center text-lg font-bold">INVOICE</h1>
        <div className="grid grid-cols-2 gap-2 pt-4 pb-8">


          <div className="">
            <label
              htmlFor="cashierName"
              className="text-sm font-bold sm:text-base"
            >
              Customer Name or ID:
            </label>
            <input
              required
              className="flex-1"
              type="text"
              name="cashierName"
              id="searchInput"
          placeholder="Type customer name or ID"
          onChange={handleInputChange}
            />

            <label
              htmlFor="cashierName"
              className="text-sm font-bold sm:text-base"
            >
              Customer
            </label>
            <input
              required
              className="flex-1"
              placeholder="Customer name"
              type="text"
              name="customerName"
              id="customerName"
              value={formData.customer}
            />

            <label
              htmlFor="companyName"
              className="text-sm font-bold sm:text-base"
            >
              Company:
            </label>
            <input
              required
              className="flex-1"
              placeholder="Company name"
              type="text"
              name="company"
              id="company"
              value={formData.company}
            />
          </div>

          <div className=" col-start-2">
            <label
              htmlFor="email"
              className=" row-start-1 text-sm font-bold sm:text-base"
            >
              Email:
            </label>
            <input
              required
              className="flex-1"
              placeholder="Email"
              type="text"
              name="email"
              id="email"
              value={formData.email}
              
            />

            <label
              htmlFor="phone"
              className=" row-start-1 text-sm font-bold sm:text-base"
            >
              Phone:
            </label>
            <input
              required
              className="flex-1"
              placeholder="Phone"
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
            />

            <label
              htmlFor="address"
              className=" row-start-1 text-sm font-bold sm:text-base"
            >
              Address:
            </label>
            <input
              required
              className="flex-1"
              placeholder="Address"
              type="text"
              name="address"
              id="address"
              value={formData.address}
            />
          </div>

        </div>
        <table className="w-full p-4 text-left">
          <thead>
            <tr className="border-b border-gray-900/10 text-sm md:text-base">
              <th>Product</th>
              <th>QTY</th>
              <th className="text-center">PRICE</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <InvoiceItem
                key={item.id}
                id={item.id}
                name={item.name}
                qty={item.qty}
                price={item.price}
                onDeleteItem={deleteItemHandler}
                onEdtiItem={edtiItemHandler}
              />
            ))}
          </tbody>
        </table>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
          type="button"
          onClick={addItemHandler}
        >
          Add Item
        </button>
        <div className="flex flex-col items-end space-y-2 pt-6">
          <div className="flex w-full justify-between md:w-1/2">
            <span className="font-bold">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex w-full justify-between md:w-1/2">
            <span className="font-bold">Discount:</span>
            <span>
              ({discount || '0'}%)${discountRate.toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between md:w-1/2">
            <span className="font-bold">Tax:</span>
            <span>
              ({tax || '0'}%)${taxRate.toFixed(2)}
            </span>
          </div>
          <div className="flex w-full justify-between border-t border-gray-900/10 pt-2 md:w-1/2">
            <span className="font-bold">Total:</span>
            <span className="font-bold">
              ${total % 1 === 0 ? total : total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="basis-1/4 bg-transparent">
        <div className="sticky top-0 z-10 space-y-4 divide-y divide-gray-900/10 pb-8 md:pt-6 md:pl-4">
          <button
            className="w-full items-center justify-center gap-2 font-bold  flex flex-row-reverse rounded-md bg-blue-500 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
            type="submit"
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
            <span>Preview or Save </span>
          </button>

          <button
            className="w-full rounded-md bg-green-500 py-2 text-sm text-white shadow-sm hover:bg-green-600"
            type="submit"
            onClick={invoiceList}
          >
            View All Invoices
          </button>

          <InvoiceModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            invoiceInfo={{
              invoiceNumber,
              formData,
              subtotal,
              taxRate,
              discountRate,
              total,
            }}
            items={items}
            onAddNextInvoice={addNextInvoiceHandler}
          />
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-bold md:text-base" htmlFor="tax">
                Tax rate:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-r-none bg-white shadow-sm"
                  type="number"
                  name="tax"
                  id="tax"
                  min="0"
                  step="0.01"
                  placeholder="0.0"
                  value={tax}
                  onChange={(event) => setTax(event.target.value)}
                />
                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                  %
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-bold md:text-base"
                htmlFor="discount"
              >
                Discount rate:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-r-none bg-white shadow-sm"
                  type="number"
                  name="discount"
                  id="discount"
                  min="0"
                  step="0.01"
                  placeholder="0.0"
                  value={discount}
                  onChange={(event) => setDiscount(event.target.value)}
                />
                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
