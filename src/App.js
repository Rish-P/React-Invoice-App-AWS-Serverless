import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from 'reactstrap'
import axios from 'axios'
import uuid from 'uuid'

function App() {

  let [vendor, setVendor] = useState("");
  let [amount, setAmount] = useState("");
  let [invoice, setInvoice] = useState("");
  let [date, setDate] = useState("");
  let [entryAdded, setEntry] = useState(false) //this is for re-rendering the page
  const [invoices, setInvoices] = useState([])
  useEffect(
    () => {
      async function getData() {
        await axios.get('https://xr2a6sbj25.execute-api.ap-south-1.amazonaws.com/dev/invoices')
          .then(res => {
            setInvoices(res['data']['Items'])
            console.log(res['data']['Count'])
          })
          .catch(err => console.log(err))
      }
      getData()
    }, [entryAdded])
  const removeEntry = async (id) => {
    const config = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    await fetch('https://xr2a6sbj25.execute-api.ap-south-1.amazonaws.com/dev/delete/?' + new URLSearchParams({ id: id }), config)
      .then(res => {
        const tempVal = entryAdded;
        setEntry(!tempVal);
        console.log(res)
      })
      .catch(err => console.log(err))

  }
  const createInvoiceEntry = async () => {
    const requestBody = {
      id: uuid.v1(),
      vendor: vendor,
      amount: amount,
      invoice_no: invoice,
      date: date
    }
    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    };
    fetch('https://xr2a6sbj25.execute-api.ap-south-1.amazonaws.com/dev/putInvoices', config)
      .then(res => {
        console.log('SUCCESS', res)
        const tempVal = entryAdded;
        setVendor("")
        setAmount("")
        setInvoice("")
        setDate("")
        setEntry(!tempVal)
      })
      .catch(err => console.log('ERROR-->', err))

  }
  return (
    <div className="container">
      <h3>Invoice Table</h3>
      <div>
        <table border="1" cellPadding="2">
          <thead>
            <tr>
              <th>Number</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Invoice No.</th>
              <th>Date</th>
              <th colSpan="4">Actions</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(item => {
              return (
                <tr key={item.id} className="invoiceRow">
                  <td>{(invoices.indexOf(item)) + 1}</td>
                  <td>{item.vendor}</td>
                  <td>{item.amount}</td>
                  <td>{item.invoice_no}</td>
                  <td>{item.date}</td>
                  <td>
                    <Button color="success" onClick={() => { removeEntry(item.id) }}>Accept</Button>
                  </td>
                  <td>
                    <Button color="danger" onClick={() => { removeEntry(item.id) }}>Reject</Button>
                  </td>
                  <td>
                    <Button color="primary" onClick={() => { removeEntry(item.id) }}>50%</Button>
                  </td>
                  <td>
                    <Button color="info" onClick={() => { removeEntry(item.id) }}>??</Button>
                  </td>
                  <td>
                    <Button color="warning" onClick={() => { removeEntry(item.id) }}>Upload</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <h3>Add a new entry below</h3>
        <div style={{ marginTop: '10px' }}>
          <label>Vendor:</label>
          <input value={vendor} className="inputField"
            onChange={(e) => { setVendor(e.target.value) }} />
          <br style={{ marginTop: '10px' }} />
          <label>Amount:</label>
          <input value={amount} className="inputField"
            onChange={(e) => { setAmount(e.target.value) }} />
          <br style={{ marginTop: '10px' }} />
          <label>Invoice No:</label>
          <input value={invoice} className="inputField"
            onChange={(e) => { setInvoice(e.target.value) }} />
          <br style={{ marginTop: '10px' }} />
          <label>Date:</label>
          <input value={date} className="inputField"
            onChange={(e) => { setDate(e.target.value) }} />
          <br />
          <Button color="primary"
            onClick={(e) => {
              e.preventDefault()
              createInvoiceEntry();
            }}>Add entry</Button>
        </div>
      </div>

    </div>
  );
}

export default App;
