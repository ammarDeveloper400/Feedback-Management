// @ts-nocheck
import {useState} from "react";
import {useStripe, useElements, PaymentElement} from "@stripe/react-stripe-js";
import Button from "../../base-components/Button";
import {useNavigate} from "react-router-dom";
import {toastMessage} from "../../utils/helper";
import {post} from "../../stores/service/api";
import {setUserData} from "../../stores/features/auth/authSlice";
import {useAppDispatch} from "../../stores/hooks";

export default function CheckoutForm(props) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentSuccessEntry = async (paymentIntent: any) => {
        const payment_data = {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            planId: props.plan.id
        };
        const res = await post(JSON.stringify(payment_data), 'payments/successful-payment-entry');


        if(res.action == "success"){
            dispatch(setUserData({...res.data}))
            const body_data = {id: res?.data.payment_object};
            const res22 = await post(JSON.stringify(body_data), 'payments/get-specific-payment-history');
            if(res22.action == "success"){
                toastMessage('Payment is successfull', 's');
                navigate('/invoice-view', {state: {invoice: res22.data}})
            } else {
                toastMessage(res22.data, 'f');
            }
            
            
        } else {
            toastMessage('Some error occured', 'f');
        }

        // if ("code" in res)
        //     toastMessage('Payment is suceesfull but not able to kept record in our database. Please contact support.', 'f');
        // else {
        //     dispatch(setUserData({...res.paymentCreated.user}))
        //     toastMessage('Payment is successfull', 's');
        //     navigate('/invoice-view', {state: {invoice: {...res.paymentCreated}}})
        // }

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {error: submitError} = await elements.submit();
        if (submitError) {
            return;
        }
        setIsProcessing(true);
        const confirmPayment = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/completion`,
            },
            redirect: 'if_required'
        });
        console.log('type', confirmPayment);
        if (confirmPayment.paymentIntent) {
            paymentSuccessEntry(confirmPayment.paymentIntent);
        } else {
            navigate('/subscription-plans')
            toastMessage(confirmPayment.error.message, 'f');
        }
        setIsProcessing(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element"/>
            <Button disabled={isProcessing || !stripe || !elements} variant="primary" className="mt-5">
                {isProcessing ? "Processing ... " : "Pay now"}
            </Button>
        </form>
    );
}
