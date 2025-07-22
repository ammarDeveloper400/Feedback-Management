import React from "react";
import * as yup from "yup";
const phoneValidation= /^\d+$/;
const validation = yup
    .object({
        name: yup.string().required('Host Name is Required Field'),
        email: yup.string().email('Please enter valid email').required('Email is Required Field'),
        phone: yup.string().required('Phone is Required Field').matches(phoneValidation, 'Please enter valid phone'),
        city: yup.string().required('City is Required Field'),
        zip: yup.string().required('Zip Code is Required Field'),
        address: yup.string().required('Address is Required Field'),
        country: yup.string().required('Country is Required Field'),
    })
    .required();
export default validation;
