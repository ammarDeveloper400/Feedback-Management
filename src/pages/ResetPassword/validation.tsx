import React from "react";
import * as yup from "yup";

const validation = yup
    .object({
        password: yup.string().required('Password is Required Field'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
    })
    .required();
export default validation;
