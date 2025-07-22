// @ts-nocheck
import {useEffect, useState} from "react";

import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {loadStripe} from "@stripe/stripe-js";
import "./payment.css";
import {useLocation, useNavigate} from "react-router-dom";
import {FormCheck, FormInput, FormLabel, FormSwitch} from "../../base-components/Form";
import {useAppSelector} from "../../stores/hooks/redux-hooks";
import {authSelector} from "../../stores/features/auth/authSlice";

function Payment() {
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const {state} = useLocation();
    const navigate = useNavigate();
    const auth = useAppSelector(authSelector);
    useEffect(() => {
        console.log('state', state)
        if (state != null && state.plan) {
            setStripePromise(loadStripe(state.plan.publishableKey));
            setClientSecret(state.plan.client_secret);
        } else {
            navigate('/login');
        }
    }, []);


    return (
        <>
            <div className="grid grid-cols-12  mt-5 ">
                <div className="col-span-6 intro-y lg:col-span-6 mr-3" style={{backgroundColor: 'white'}}>
                    {clientSecret && stripePromise && (
                        <Elements stripe={stripePromise} options={{clientSecret}}>
                            <CheckoutForm plan={state.plan}/>
                        </Elements>
                    )}
                </div>
                <div className="intro-y box col-span-6 intro-y lg:col-span-6 ml-3">
                    <div className="p-5 mt-8">
                        <div className="mt-3">
                            <FormLabel htmlFor="vertical-form-2">Company Name</FormLabel>
                            <FormInput
                                id="vertical-form-2"
                                type="text"
                                placeholder="Company Name"
                                value={auth?.userInfo?.companyName}
                            />
                        </div>
                        <div className="mt-3">
                            <FormLabel htmlFor="vertical-form-2">Email</FormLabel>
                            <FormInput
                                id="vertical-form-2"
                                type="text"
                                placeholder="Email"
                                value={auth?.userInfo?.email}
                            />
                        </div>
                        <div className="mt-3">
                            <FormLabel htmlFor="vertical-form-2">Address</FormLabel>
                            <FormInput
                                id="vertical-form-2"
                                type="text"
                                placeholder="Address"
                                value={auth?.userInfo?.address}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;
