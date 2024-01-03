import React, { useState , useEffect,useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import downLineImage from '../imgs/down-line.png';
import BlazeSignsLogo from '../imgs/Blaze-Signs-Logo1.png';
import { toast, ToastContainer } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import Url from '../config/api';
import emailjs from '@emailjs/browser';

function Home() {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_i0x1u2k', 'template_7sfb3c6', form.current, 'fJk_kHwzx9KV2ZHC5')
      .then((result) => {
          console.log(result.text);
         
      }, (error) => {
          console.log(error.text);
      });
  };
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
  
    let formattedValue = value;
  
    if (name === 'contactNumber') {
     
      const isBackspace = e.nativeEvent.inputType === 'deleteContentBackward';
      formattedValue = formatPhoneNumber(value, isBackspace);
    } else if (name === 'postalCode') {
      formattedValue = formatPostalCode(value);
    }
  
    setContactDetails({ ...contactDetails, [name]: formattedValue });
    setErrors({ ...errors, [name]: '' });
  };

  const formatPhoneNumber = (input, isBackspace) => {
    let cleanedInput = input.replace(/\D/g, '');
  
    if (isBackspace) {
      return cleanedInput.substring(0, cleanedInput.length - 1);
    }
  
    if (!cleanedInput.startsWith('1')) {
      cleanedInput = `1${cleanedInput}`;
    }

    const match = cleanedInput.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})$/);
  
    if (match) {
      if (match[1] && !match[2]) {
        return `+${match[1]}`;
      } else if (match[1] && match[2] && !match[3]) {
        return `+${match[1]} (${match[2]}`;
      } else if (match[1] && match[2] && match[3] && !match[4]) {
        return `+${match[1]} (${match[2]}) ${match[3]}`;
      } else if (match[1] && match[2] && match[3] && match[4]) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4].substring(0, 4)}`;
      }
    }
  
    return input.substring(0, 17);
  };
  
  
  
  

  const formatPostalCode = (input) => {
    const cleanedInput = input.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
    return cleanedInput.replace(/^([a-zA-Z]\d[a-zA-Z])?(\d[a-zA-Z]\d)$/, '$1 $2').toUpperCase();
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

    
if (!/^\+\d{1,2}\s?\(\d{3}\)\s?\d{3}(-\d{4})?$/.test(contactDetails.contactNumber)) {
  newErrors.contactNumber = 'Invalid contact number';
}


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.emailAddress)) {
      newErrors.emailAddress = 'Invalid email address';
    }

    if (!/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(contactDetails.postalCode)) {
      newErrors.postalCode = 'Invalid postal code, Use ANA NAN format.';
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
    setLoading(true);
    document.querySelector('.loading-container').style.display = 'block';


    if (!validateForm()) {
      setLoading(false);
      document.querySelector('.loading-container').style.display = 'none';
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
     

      toast.error('Error submitting contact. Please try again later.', {
        className: 'custom-toast',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false); 
      document.querySelector('.loading-container').style.display = 'none';
    }
  };
  useEffect(() => {
    const loadPdfData = async () => {
      try {
        const response = await axios.get(`${Url}/contact/pdf`, {
          responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (error) {
        console.error('Error loading PDF data:', error.message);
      }
    };

    loadPdfData();
  }, []);

  const handleViewBrochure = () => {
    if (pdfBlobUrl) {
      const newWindow = window.open(pdfBlobUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
       
        console.warn('Please enable popups to view the document.');
      }
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
            <div className="ccol-xs-12 col-sm-5 col-md-5">
              <div className="logo">
                <img src={BlazeSignsLogo} alt="Blaze Signs Logo" />
              </div>
            </div>
            <div className="col-xs-12 col-sm-5 col-md-7">
              <div className="logo-right-st">
                <h5>
                 
                    We are currently working on our website.
                    <br />
                    But, we are here to provide you with our products and services.
                 
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
            <div className="col-xs-12 col-sm-3 col-md-3">
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

            <div className="col-xs-12 col-sm-6 col-md-6">
              <h3 className="contact-form-heading">Contact Us</h3>
              <form id="contactForm" className="contact-us" onSubmit={(e) => { handleSubmit(e); sendEmail(e); }} ref={form} >
              <div className="loading-container" style={{ display: 'none' }}>
                  <CircularProgress className="loader" />
                </div>
                <div className="form-row">
                  <div className="col-md-12">
                 
                    <input
                      type="text"
                      id="cname"
                      name="companyName"
                      placeholder="Company Name"
                      value={contactDetails.companyName}
                      onChange={handleInputChange}
                      
                    />
                     <span className="error-message" style={{ color: 'red' }}>
                      {errors.companyName}
                    </span>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                 
                    <input
                      type="text"
                      id="fname"
                      name="firstName"
                      placeholder="First Name"
                      value={contactDetails.firstName}
                      onChange={handleInputChange}
                    />
                     <span className="error-message" style={{ color: 'red' }}>
                      {errors.firstName}
                    </span>
                  </div>

                  <div className="form-group col-md-6">
                  
                    <input
                      type="text"
                      id="lname"
                      name="lastName"
                      placeholder="Last Name"
                      value={contactDetails.lastName}
                      onChange={handleInputChange}
                    />
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.lastName}
                    </span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                  
                    <input
                      type="text"
                      id=""
                      name="address"
                      placeholder="Address"
                      value={contactDetails.address}
                      onChange={handleInputChange}
                    />
                   <span className="error-message" style={{ color: 'red' }}>
                      {errors.address}
                    </span>
                  </div>

                  <div className="form-group col-md-6">
                  
                    <input
                      type="text"
                      id="cit"
                      name="city"
                      placeholder="City"
                      value={contactDetails.city}
                      onChange={handleInputChange}
                    />
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.city}
                    </span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                  
                    <input
                      type="text"
                      id=""
                      name="province"
                      placeholder="Province"
                      value={contactDetails.province}
                      onChange={handleInputChange}
                    />
                   <span className="error-message" style={{ color: 'red' }}>
                      {errors.province}
                    </span>
                  </div>

                  <div className="form-group col-md-6">
                   
                    <input
                      type="text"
                      id="pcode"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={contactDetails.postalCode}
                      onChange={handleInputChange}
                    />
                     <span className="error-message" style={{ color: 'red' }}>
                      {errors.postalCode}
                    </span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                   
                    <input
                      type="tel"
                      id=""
                      name="contactNumber"
                      placeholder="Contact Number"
                      value={contactDetails.contactNumber}
                      onChange={handleInputChange}
                    />
                     <span className="error-message" style={{ color: 'red' }}>
                      {errors.contactNumber}
                    </span>
                  </div>

                  <div className="form-group col-md-6">
                    
                    <input
                      type="text"
                      id="eadd"
                      name="emailAddress"
                      placeholder="Email Address"
                      value={contactDetails.emailAddress}
                      onChange={handleInputChange}
                    />
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.emailAddress}
                    </span>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-12">
                  
                    <textarea
                      id="Message"
                      name="message"
                      placeholder="Message"
                      style={{ height: '100px' }}
                      value={contactDetails.message}
                      onChange={handleInputChange}
                    ></textarea>
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.message}
                    </span>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-12">
                  
                    <input type="file" className="form-control-file form-file" id="exampleFormControlFile1" onChange={handleFileChange} />
                    <span className="error-message" style={{ color: 'red' }}>
                      {errors.file}
                    </span>
                  </div>
                </div>
                <div className="submit-s">
                  <input type="submit" value="Submit" />
                </div>
              </form>
            </div>

            <div className="col-xs-12 col-sm-3 col-md-3">
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
