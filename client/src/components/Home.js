import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import downLineImage from '../imgs/down-line.png';
import BlazeSignsLogo from '../imgs/Blaze-Signs-Logo1.png';
import { toast, ToastContainer } from 'react-toastify';

import 'tailwindcss/tailwind.css';
import axios from 'axios';
import Url from '../config/api';

function Home() {
  // eslint-disable-next-line
  const [brochureError, setBrochureError] = useState(null);

  const [contactDetails, setContactDetails] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    contactNumber: '',
    emailAddress: '',
    message: '',
    file: '',
  });
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;

   
    if (name === 'contactNumber' || name === 'postalCode') {
      const numericValue = value.replace(/\D/g, ''); 
      setContactDetails({ ...contactDetails, [name]: numericValue });
      setErrors({ ...errors, [name]: '' }); 
    } else {
      setContactDetails({ ...contactDetails, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      'companyName',
      'firstName',
      'lastName',
      'address',
      'city',
      'province',
      'postalCode',
      'contactNumber',
      'emailAddress',
      'message',
    ];

    requiredFields.forEach((field) => {
      if (!contactDetails[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (!/^\d{10}$/.test(contactDetails.contactNumber)) {
      newErrors.contactNumber = 'Invalid contact number';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.emailAddress)) {
      newErrors.emailAddress = 'Invalid email address';
    }

    if (!/^\d{6}$/.test(contactDetails.postalCode)) {
      newErrors.postalCode = 'Invalid postal code';
    }
    if (!contactDetails.file) {
      newErrors.file = 'Please choose a file';
    } else {
     
      const maxSize = 2 * 1024 * 1024;
      if (contactDetails.file.size > maxSize) {
        newErrors.file = 'File size exceeds the limit of 2MB';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setContactDetails({ ...contactDetails, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
    
      return;
    }
    try {
      const formData = new FormData();
      for (const key in contactDetails) {
        formData.append(key, contactDetails[key]);
      }

      const response = await axios.post(`${Url}/contact/contacts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Contact submitted successfully:', response.data);

      setContactDetails({
        companyName: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        contactNumber: '',
        emailAddress: '',
        message: '',
        file: '',
      });

      document.getElementById('contactForm').reset();

      toast.success('Thank you for contacting us. We will get back to you soon!', {
        className: 'custom-toast',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error submitting contact:', error);

      toast.error('Error submitting contact. Please try again later.', {
        className: 'custom-toast',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleViewBrochure = async () => {
    try {
      const response = await axios.get(`${Url}/contact/pdf`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing brochure:', error.message);
      setBrochureError('Error viewing brochure. Please try again later.');
    }
  };

  const handleDownloadBrochure = async () => {
    try {
      const response = await axios.get(`${Url}/contact/download-brochure`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Blaze Signs - Company Profile.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading brochure:', error.message);
      setBrochureError('Error downloading brochure. Please try again later.');
    }
  };

  return (
    <div className="App">
      <div className="outer">
        <div className="container-fluid">
          <div className="row top-navi">
            <div className="col-md-5">
              <div className="logo">
                <img src={BlazeSignsLogo} alt="Blaze Signs Logo" />
              </div>
            </div>
            <div className="col-md-7">
              <div className="logo-right-st">
                <h5>
                  <b>
                    We are currently working on our website.
                    <br />
                    But, we are here to provide you with our products and services.
                  </b>
                </h5>
                <div className="dw-line">
                  <img src={downLineImage} alt="Divider Line" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row second-section">
            <div className="col-md-3">
              <div className="information-lk">
                <ul>
                  <li>
                    <span>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <span>sales@blazesigns.ca</span>
                  </li>
                  <li>
                    <span>
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <span>+1 604.441.8567</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <h3 className="contact-form-heading">Contact Us</h3>
              <form id="contactForm" className="contact-us" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="col-md-12">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.companyName}
                    </span>
                    <input
                      type="text"
                      id="cname"
                      name="companyName"
                      placeholder="Company Name"
                      value={contactDetails.companyName}
                      onChange={handleInputChange}
                    />
                    
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.firstName}
                    </span>
                    <input
                      type="text"
                      id="fname"
                      name="firstName"
                      placeholder="First Name"
                      value={contactDetails.firstName}
                      onChange={handleInputChange}
                    />
                    
                  </div>

                  <div className="form-group col-md-6">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.lastName}
                    </span>
                    <input
                      type="text"
                      id="lname"
                      name="lastName"
                      placeholder="Last Name"
                      value={contactDetails.lastName}
                      onChange={handleInputChange}
                    />
                    
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.address}
                    </span>
                    <input
                      type="text"
                      id=""
                      name="address"
                      placeholder="Address"
                      value={contactDetails.address}
                      onChange={handleInputChange}
                    />
                   
                  </div>

                  <div className="form-group col-md-6">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.city}
                    </span>
                    <input
                      type="text"
                      id="cit"
                      name="city"
                      placeholder="City"
                      value={contactDetails.city}
                      onChange={handleInputChange}
                    />
                    
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.province}
                    </span>
                    <input
                      type="text"
                      id=""
                      name="province"
                      placeholder="Province"
                      value={contactDetails.province}
                      onChange={handleInputChange}
                    />
                   
                  </div>

                  <div className="form-group col-md-6">
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.postalCode}
                    </span>
                    <input
                      type="tel"
                      id="pcode"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={contactDetails.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.contactNumber}
                    </span>
                    <input
                      type="tel"
                      id=""
                      name="contactNumber"
                      placeholder="Contact Number"
                      value={contactDetails.contactNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.emailAddress}
                    </span>
                    <input
                      type="text"
                      id="eadd"
                      name="emailAddress"
                      placeholder="Email Address"
                      value={contactDetails.emailAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-12">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.message}
                    </span>
                    <textarea
                      id="Message"
                      name="message"
                      placeholder="Message"
                      style={{ height: '100px' }}
                      value={contactDetails.message}
                      onChange={handleInputChange}
                    ></textarea>
                    
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-12">
                  <span className="error-message" style={{ color: 'red' }}>
                      {errors.file}
                    </span>
                    <input type="file" className="form-control-file form-file" id="exampleFormControlFile1" onChange={handleFileChange} />
                  </div>
                </div>
                <div className="submit-s">
                  <input type="submit" value="Submit" />
                </div>
              </form>
            </div>

            <div className="col-md-3 right-broch-div">
              <div className="view-broch">
                <div className="view-broch-inner">
                  <div className="logo1">
                    <img src={BlazeSignsLogo} alt="Blaze Signs Logo" />
                  </div>
                  <div>
                    <button className="vb-button" onClick={handleViewBrochure}>
                      View
                    </button>
                  </div>
                  <div className="vb-text"> Brochure </div>

                  <button className="db-btn" onClick={handleDownloadBrochure}>
                    Download Brochure
             </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer className="custom-toast-container" />

    </div>
  );
}

export default Home;
