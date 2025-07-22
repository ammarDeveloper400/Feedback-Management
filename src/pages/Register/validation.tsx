import React from "react";
import * as yup from "yup";
const phoneValidation= /^\d+$/;
const validation = yup
    .object({
        companyName: yup.string().required('Company Name is Required Field'),
        email: yup.string().email('Please enter valid email').required('Email is Required Field'),
        // password: yup.string().required('Password is Required Field'),
        password: yup.string().required('Password is Required Field').matches(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters with 1 number, 1 alphabet, 1 special character, and 1 uppercase letter'
        ),
        phone: yup.string().required('Phone is Required Field').matches(phoneValidation, 'Please enter valid phone'),
        userName: yup.string().required('User Name is Required Field'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
    })
    .required();
export default validation;
