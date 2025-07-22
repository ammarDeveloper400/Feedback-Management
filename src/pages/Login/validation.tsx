import React from "react";
import * as yup from "yup";

const validation = yup
    .object({
        email: yup.string().email('Please enter valid email').required('Email is Required Field'),
        password: yup.string().required('Password is Required Field'),
    })
    .required();
export default validation;
