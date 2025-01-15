import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './pages/invoice-list';

function App() {

  const pathname = window.location.pathname;

  if (pathname === '/invoice-list') {
    return <InvoiceList />;
  }
  //  else if (pathname === '/') {
  //   return <App />;
  // }
  //  else {
  //   return <NotFound />;
  // }
  return ( 
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <InvoiceForm /> 
      </div>
    </div>
  );
}

export default App;
