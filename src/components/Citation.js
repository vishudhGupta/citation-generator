import React, { useState } from 'react';
import './chat.css'
import { jsPDF } from 'jspdf';

function Citation() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    date: '',
    courtName: '',
    courtCity: '',
    courtState: '',
    citation: '',
    response: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCitation = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/engines/davinci-002/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify({
          prompt: `Your Name: ${formData.name}\nYour Address: ${formData.address}\nCity: ${formData.city}\nState: ${formData.state}\nZip Code: ${formData.zipCode}\nPhone Number: ${formData.phone}\nEmail Address: ${formData.email}\n\nDate: ${formData.date}\n\nThe Judicial Magistrate,\n${formData.courtName}\n${formData.courtCity}, ${formData.courtState}\n\nSubject: ${formData.citation}\n\nSir/Madam,\n\nI, ${formData.name}, residing at ${formData.address}, hereby submit this plaint before this Hon'ble Court for the initiation of legal proceedings against [Name of the Accused] under Section ${formData.citation} of the Indian Penal Code (IPC).\n`,
          temperature: 0.7,
          max_tokens: 500,
          stop: '\n',
        }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!data || !data.choices || data.choices.length === 0) {
        console.error('Invalid response format:', data);
        return;
      }

      const generatedResponse = data.choices[0].text.trim();

      const formattedResponse = ` 
          ${formData.name}
          ${formData.address}
          ${formData.city},  ${formData.state},${formData.zipCode}
          ${formData.phone}
          ${formData.email}
          
          ${formData.date}
          
          The Judicial Magistrate,
          ${formData.courtName}
          ${formData.courtCity}
          ${formData.courtState}
          
          Subject: Filing of Plaint under Section 441 of the Indian Penal Code for ${formData.citation}
          
          Sir/Madam,
          
          ${generatedResponse}`;


      setFormData({ ...formData, response: formattedResponse });
    } catch (error) {
      console.error('Error generating citation:', error);
    }
  };


  const downloadResponse = () => {
    // Create a new PDF document
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Define margins and padding
    const margin = 10;
    const padding = 5;
    const maxWidth = pdf.internal.pageSize.width - (margin * 2);

    // Split the response text into lines
    const lines = pdf.splitTextToSize(formData.response, maxWidth - (padding * 2));

    // Calculate the total height needed for the text
    const lineHeight = 5; // Adjust line height as needed
    const totalHeight = lines.length * lineHeight;

    // Check if the content exceeds the available space on the current page
    const availableHeight = pdf.internal.pageSize.height - (margin * 2);
    const nextPageRequired = totalHeight > availableHeight;

    // Add the response text to the PDF document
    if (nextPageRequired) {
      pdf.addPage();
    }
    pdf.text(lines, margin + padding, margin + padding);

    // Save the PDF document as a blob
    const pdfBlob = pdf.output('blob');

    // Create a blob URL for the PDF
    const url = URL.createObjectURL(pdfBlob);

    // Create a link element and trigger a click event to download the PDF
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_response.pdf';
    link.click();

    // Cleanup: Revoke the blob URL after downloading
    URL.revokeObjectURL(url);
  };


  return (


    <>
      {/* 
   
    
      <input className='input-container'id='name' type="text" name="name" placeholder="Your Name.." onChange={handleChange} />
     
      <input className='input-container'id='address' type="text" name="address" placeholder="Your Address.." onChange={handleChange} />
      <input className='input-container' type="text" name="city" placeholder="City.." onChange={handleChange} />
      <input className='input-container' type="text" name="state" placeholder="State.." onChange={handleChange} />
      <input className='input-container' type="text" name="zipCode" placeholder="Pin Code.." onChange={handleChange} />
      <input className='input-container' type="text" name="phone" placeholder="Phone Number.." onChange={handleChange} />
      <input className='input-container' type="email" name="email" placeholder="Email Address.." onChange={handleChange} />
      <input className='input-container' type="date" name="date" onChange={handleChange} />
      <input className='input-container' type="text" name="courtName" placeholder="Name of the Court.." onChange={handleChange} />
      <input className='input-container' type="text" name="courtCity" placeholder="City of the Court.." onChange={handleChange} />
      <input className='input-container' type="text" name="courtState" placeholder="State of the Court.." onChange={handleChange} />
      <textarea className='input-container' type="text" name="citation" placeholder="Citation.." onChange={handleChange} />
      </form>
      <div className="buttons">
      <button className='submit-btn' onClick={generateCitation}>Generate Citation</button>
      
     
      {formData.response && (
        <button className='submit-btn' onClick={downloadResponse}>Download Response</button>
      )}

</div>
      <div className='result'>
      <p> <h1>Generated Response</h1>
        {formData.response}</p>
      </div> */}



      {/* new design */}

      <div className="container">
        <header>Citation Generator</header>

        <form action="#">
          <div className="form first">
            <div className="details personal">
              <span className="title">Personal Details</span>

              <div className="fields">

                <div className="input-field">
                  <label htmlFor="">Full Name</label>
                  <input type="text" placeholder='Enter your Name' name="name" required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="">House no.</label>
                  <input type="text" placeholder='Enter House no.' name='address' required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="">City</label>
                  <input type="text" placeholder='Enter your City' name="city" required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="">State</label>
                  <input type="text" placeholder='Enter your State' name="state" required onChange={handleChange} />
                </div>
                <div className="input-field">
                  <label htmlFor="">Pin code</label>
                  <input type="text" placeholder='Enter your Pin code' name="zipCode" required onChange={handleChange} />
                </div>
                <div className="input-field">
                  <label htmlFor="">Email</label>
                  <input type="email" placeholder='Enter your Email' name="email" required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="">Mobile Number</label>
                  <input type="mobile" placeholder='Enter Mobile number' name='phone' required onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="details court">
              <span className="title">Court Details</span>

              <div className="fields">

                <div className="input-field">
                  <label htmlFor="">Date of Filling</label>
                  <input type="date" placeholder='Enter Date' name="date" required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="">Court Name</label>
                  <input type="text" placeholder='Enter Name of Court' name="courtName"  required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="">City of Court</label>
                  <input type="text" placeholder='Enter City of Court' name='courtCity' required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="">State of Court</label>
                  <input type="text" placeholder='Enter State of Court' name='courtState' required onChange={handleChange} />
                </div>
                <div className="input-field">
                  <label htmlFor="">Citation</label>
                  <input type="text" placeholder='Enter Citation' name="citation" required onChange={handleChange} />
                </div>
                <span></span>
              </div>


            </div>
            <div className="btns">
              <button className="submit">
                <span className="generate-btn" onClick={generateCitation}>Generate Citation -{'>'}</span>

              </button>
              {formData.response && (
                <button className="submit">
                  <span className='submit-btn' onClick={downloadResponse}>Download Response -{'>'}</span>
                </button>
              )}
              
            </div>
           
          </div>
        </form>
      </div>




    </>
  )
}

export default Citation