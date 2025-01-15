import React from 'react';
import InvoiceField from './InvoiceField';
import { DollarSign, SquareX } from 'lucide-react';
import { products } from '../config';

const InvoiceItem = ({ id, name, qty, price, onDeleteItem, onEdtiItem }) => {
  const deleteItemHandler = () => {
    onDeleteItem(id);
  };

  

  const handleProductChange = (event) => {
    onEdtiItem({
      target: {
        id: id,
        name: 'name',
        value: event.target.value,
      },
    });
  };


  return (
    <tr>
      <td className=" min-w-[200px] md:min-w-[350px]">
      <select
          value={name}
          onChange={handleProductChange}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          {/* <option value="" disabled>
            Select a product
          </option> */}
          {products.map((product) => (
            <option key={product.index} value={product.product}>
              {product.product}
            </option>
          ))}
        </select>
      </td>
      <td className="min-w-[65px] md:min-w-[80px]">
        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            type: 'number',
            min: '0',
            name: 'qty',
            placeholder: "0.00",
            id: id,
            value: qty,
          }}
        />
      </td>
      <td className="relative min-w-[100px] md:min-w-[150px]">
      <DollarSign className='absolute items-center text-xl text-gray-500 mt-2 ml-3 w-5' />
        <InvoiceField
          onEditItem={(event) => onEdtiItem(event)}
          cellData={{
            className: 'text-right',
            type: 'number',
            min: '0',
            placeholder: "0.00",
            name: 'price',
            id: id,
            value: price,
          }}
        />
      </td>
      <td className="flex items-center justify-center">
        <button
          className="rounded-md bg-red-500 p-2 text-white shadow-sm transition-colors duration-200 hover:bg-red-600"
          onClick={deleteItemHandler}
        >
          <SquareX />
        </button>
      </td>
    </tr>
  );
};

export default InvoiceItem;
