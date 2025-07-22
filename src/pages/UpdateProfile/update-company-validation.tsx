import React from "react";
import * as yup from "yup";
const phoneValidation= /^\d+$/;
const validation = yup
    .object({
        address: yup.string().required('Address is Required Field'),
        userName: yup.string().required('Address is Required Field'),
        companyName: yup.string().required('Address is Required Field'),
        phone: yup.string().required('Phone is Required Field').matches(phoneValidation, 'Please enter valid phone'),
        email: yup.string().required('Email is Required Field'),
    })
    .required();
export default validation;
