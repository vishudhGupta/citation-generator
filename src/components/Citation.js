import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import './chat.css'

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
              temperature: 0,
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


          setFormData({ ...formData, response: formattedResponse  });
        } catch (error) {
          console.error('Error generating citation:', error);
        }
      };
    
      const downloadResponse = () => {
        const blob = new Blob([formData.response], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'generated_response.txt');
      };
    

  return (
    

    <>
    <div className="main">
    <h1>Citation Generator</h1>
    </div>
    <form className='form-container' action="">
      <input className='input-container' type="text" name="name" placeholder="Your Name" onChange={handleChange} />
      <input className='input-container' type="text" name="address" placeholder="Your Address" onChange={handleChange} />
      <input className='input-container' type="text" name="city" placeholder="City" onChange={handleChange} />
      <input className='input-container' type="text" name="state" placeholder="State" onChange={handleChange} />
      <input className='input-container' type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} />
      <input className='input-container' type="text" name="phone" placeholder="Phone Number" onChange={handleChange} />
      <input className='input-container' type="email" name="email" placeholder="Email Address" onChange={handleChange} />
      <input className='input-container' type="date" name="date" onChange={handleChange} />
      <input className='input-container' type="text" name="courtName" placeholder="Name of the Court" onChange={handleChange} />
      <input className='input-container' type="text" name="courtCity" placeholder="City of the Court" onChange={handleChange} />
      <input className='input-container' type="text" name="courtState" placeholder="State of the Court" onChange={handleChange} />
      <input className='input-container' type="text" name="citation" placeholder="Citation" onChange={handleChange} />
      </form>
      <div className="buttons">
      <button className='submit-btn' onClick={generateCitation}>Generate Citation</button>
      
     
      {formData.response && (
        <button className='submit-btn' onClick={downloadResponse}>Download Response</button>
      )}

</div>
      <div className='result'>
        <h1>Generated Response</h1>
        <p>{formData.response}</p>
      </div>
      
    </>
  )
}

export default Citation