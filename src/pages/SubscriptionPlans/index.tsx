// @ts-nocheck
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import {useAppDispatch, useAppSelector} from "../../stores/hooks/redux-hooks";
import {plansSelector, getPlans} from "../../stores/features/plans/plansSlice";
import {useEffect, useState} from "react";
import {useNavigate, createSearchParams} from "react-router-dom";
import {get, post} from "../../stores/service/api";
import {toastMessage} from "../../utils/helper";
import {authSelector, setUserData} from "../../stores/features/auth/authSlice";
import { Dialog, Menu } from "../../base-components/Headless";
import { FormInput, FormSelect,
    FormLabel,
    FormSwitch,
    InputGroup, } from "../../base-components/Form";
import { Description } from "@headlessui/react/dist/components/description/description";

function Main() {
    const navigate = useNavigate();
    const auth = useAppSelector(authSelector);
    const [plans, setPlans] = useState([]);
    const dispatch = useAppDispatch();
    const [userrole, setUserRole] = useState(0);
    const [infoModalPreview, setInfoModalPreview] = useState(false)
    const [title, setTitle] = useState<any | null>(null)
    const [hosts, setHosts] = useState<any | null>(null)
    const [polls, setPolls] = useState<any | null>(null)
    const [feedback, setFeedback] = useState<any | null>(null)
    const [description, setDescription] = useState<any | null>(null)
    const [price, setPrice] = useState<any | null>(null)
    const [editid, setEditID] = useState<any | null>(null)

    useEffect(() => {
        let userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            let parsed = JSON.parse(userInfo);
            setUserRole(parsed?.role);
            setData();
        }
    }, [])
    const setData = async () => {
        const res = await get('allplans/');
        if(res.action == "success"){
            setPlans(res.data)
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
    }
    const purchasePacakge = async (item: any) => {
        if (item.price<1){
            const body_data = {amount: 0, planId: item.id};
            const res = await post(JSON.stringify(body_data), 'payments/successful-free-entry');
            if(res.action == "success"){
                dispatch(setUserData({...res.data}))
                toastMessage('Your free subscription plan has been activated successfully.', 's');
            } else {
                toastMessage(res.data, 'f');
            }
            return;
        }

        const body_data = {amount: item.price, planId: item.id};
        const res = await post(JSON.stringify(body_data), 'payments/create-payment-intent');
        // @ts-ignore
        if(res.action == "success"){
            const {client_secret, publishableKey} = res.data;
            navigate('/purchase-plan', {state: {plan: {...item, client_secret, publishableKey}}})
        } else {
            toastMessage(res.data, 'f');
        }
        // if ("code" in res)
        //     toastMessage(res.data, 'f');
        // else {
        //     const {clientSecret, publishableKey} = res;
        //     navigate('/purchase-plan', {state: {plan: {...item, clientSecret, publishableKey}}})
        // }
    }
    const cancelPacakge = async (item: any) => {
        const body_data = {cancel: 1};
        const res = await post(JSON.stringify(body_data), 'payments/cancel-payment-plan');
        // @ts-ignore
        if(res.action == "success"){
            dispatch(setUserData({...res.data}))
           toastMessage('Your Plan has been cancelled please contact support.', 's');
        } else {
            toastMessage(res.data, 'f');
        }
    }

    const do_save_plans = async () => {
        const body_data = {editid: editid, title:title, hosts:hosts, polls:polls, feedback:feedback, price, description:description};
        console.log(body_data);
        if(title == ""  || hosts == "" || polls == "" || description == "" || feedback == ""){
            toastMessage('Please enter all information!', 'f');
            return;
        }
        // const body_data = {editid: editid, title:title, hosts:hosts, polls:polls, feedback:feedback, price, description};
        const res = await post(JSON.stringify(body_data), 'payments/update-plan');
        // @ts-ignore
        if(res.action == "success"){
            setInfoModalPreview(false)
            setData();
            toastMessage('Your Plan information has been updated successfully!', 's');
        } else {
            toastMessage(res.data, 'f');
        }
    }

    const edit_plan = async (v: any) => {
        setEditID(v.id)
        setTitle(v.name)
        setHosts(v.hosts)
        setPolls(v.polls)
        setFeedback(v.feedbacks)
        setPrice(v.price)
        setDescription(v.description)
        setInfoModalPreview(true)
    }
    return (
        <>
            { (auth?.userInfo?.plan!= 0)&&<>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Your Subscribed Plan</h2>
            </div>
            <div className="flex flex-col mt-5 intro-y box lg:flex-row">
                {
                    plans.map((item, index) => {
                        if(item.id == auth?.userInfo?.plan)
                        return <div key={index}
                                    className="flex-1 p-5 py-16 border-t border-b intro-y lg:border-b-0 lg:border-t-0 lg:border-l lg:border-r border-slate-200/60 dark:border-darkmode-400">
                            <Lucide
                                icon="CreditCard"
                                className="block w-12 h-12 mx-auto text-primary"
                            />
                            <div className="mt-10 text-xl font-medium text-center">
                                {item.name}
                            </div>
                            <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                                {item.polls} Poll{item.polls==1?"":"s"} <span className="mx-1">•</span> {item.feedbacks==-1?"Unlimited":item.feedbacks} feedback{item.feedbacks==1?"":""}{" "}
                                <span className="mx-1">•</span> {item.hosts} Host{item.hosts==1?"":"s"}
                            </div>
                            <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                                {item.description}
                            </div>
                            <div className="flex justify-center">
                                <div className="relative mx-auto mt-8 text-5xl font-semibold">
                                    <span className="absolute top-0 left-0 -ml-4 text-2xl">$</span> {item.price}<small style={{fontSize: '20px'}}>/mo</small>
                                </div>
                            </div>
                            {
                                userrole == 0 && 
                                <Button
                                    variant="danger"
                                    rounded
                                    type="button"
                                    className="block px-4 py-3 mx-auto mt-8"
                                    onClick={() => cancelPacakge(item)}
                                >
                                    CANCEL
                                </Button>
                            }
                        </div>

                    })
                }

            </div>
            </>
            }
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Subscription Plans</h2>
            </div>
            {/* BEGIN: Pricing Layout */}
            <div className="flex flex-col mt-5 intro-y box lg:flex-row">
                {
                    plans.map((item, index) => {
                        if(item.id != auth?.userInfo?.plan)
                        return <div key={index}
                                    className="flex-1 p-5 py-16 border-t border-b intro-y lg:border-b-0 lg:border-t-0 lg:border-l lg:border-r border-slate-200/60 dark:border-darkmode-400">
                            <Lucide
                                icon="CreditCard"
                                className="block w-12 h-12 mx-auto text-primary"
                            />
                            <div className="mt-10 text-xl font-medium text-center">
                                {item.name}
                            </div>
                            <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                                {item.polls} Poll{item.polls==1?"":"s"} <span className="mx-1">•</span> {item.feedbacks==-1?"Unlimited":item.feedbacks} feedback{item.feedbacks==1?"":""}{" "}
                                <span className="mx-1">•</span> {item.hosts} Host{item.hosts==1?"":"s"}
                            </div>
                            <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                               {item.description}
                            </div>
                            <div className="flex justify-center">
                                <div className="relative mx-auto mt-8 text-5xl font-semibold">
                                    <span className="absolute top-0 left-0 -ml-4 text-2xl">$</span> {item.price}<small style={{fontSize: '20px'}}>/mo</small>
                                </div>
                            </div>
                            {
                                userrole == 0 && 
                                <Button
                                    variant="primary"
                                    rounded
                                    type="button"
                                    className="block px-4 py-3 mx-auto mt-8"
                                    onClick={() => purchasePacakge(item)}
                                >
                                    PURCHASE NOW
                                </Button>
                            }
                            {
                                userrole == 1 && 
                                <Button
                                    variant="primary"
                                    rounded
                                    type="button"
                                    className="block px-4 py-3 mx-auto mt-8"
                                    onClick={() => edit_plan(item)}
                                >
                                    EDIT PLAN
                                </Button>
                            }
                        </div>

                    })
                }

            </div>

            { userrole == 1 &&
            <>
                <Dialog staticBackdrop open={infoModalPreview}
                                    onClose={() => {
                                        setInfoModalPreview(false);
                                    }}
                                    size={"lg"}
                            >
                                <Dialog.Panel>
                                    <Dialog.Title>
                                        <h2 className="mr-auto text-base font-medium">
                                            UPDATE PLAN INFORMATION
                                        </h2>
                                    </Dialog.Title>
                                    <div className="p-5">
                                        <div className="text-slate-500">
                                            <div className="overflow-y-auto pt-0 mycustomlabel">
                                                <div>
                                                    <FormLabel htmlFor="crud-form-1">Title</FormLabel>
                                                    <FormInput
                                                    id="crud-form-1"
                                                    type="text"
                                                    className="w-full"
                                                    placeholder=""
                                                    value={title}
                                                    onChange={(e)=>setTitle(e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid-cols-2 gap-5 sm:grid mt-5">
                                                    <div className={""}>
                                                        <FormLabel htmlFor="crud-form-1">Hosts</FormLabel>
                                                        <FormInput
                                                            id="crud-form-1"
                                                            type="number"
                                                            min={0}
                                                            className="w-full"
                                                            placeholder=""
                                                            value={hosts}
                                                            onChange={(e)=>setHosts(e.target.value)}
                                                        />
                                                        </div>
                                                        <div className={""}>
                                                        <FormLabel htmlFor="crud-form-1">Polls</FormLabel>
                                                        <FormInput
                                                            id="crud-form-1"
                                                            type="number"
                                                            min={0}
                                                            className="w-full"
                                                            placeholder=""
                                                            value={polls}
                                                            onChange={(e)=>setPolls(e.target.value)}
                                                        />
                                                        </div>
                                                </div>
                                                <div className="grid-cols-2 gap-5 sm:grid mt-5">
                                                    <div className={""}>
                                                        <FormLabel htmlFor="crud-form-1">Feedback <small>(User -1 for unlimited)</small></FormLabel>
                                                        <FormInput
                                                            id="crud-form-1"
                                                            type="number"
                                                            min={-1}
                                                            className="w-full"
                                                            placeholder=""
                                                            value={feedback}
                                                            onChange={(e)=>setFeedback(e.target.value)}
                                                        />
                                                        </div>
                                                        <div className={""}>
                                                        <FormLabel htmlFor="crud-form-1">Price</FormLabel>
                                                        <FormInput
                                                            id="crud-form-1"
                                                            type="number"
                                                            min={0}
                                                            className="w-full"
                                                            placeholder=""
                                                            value={price}
                                                            onChange={(e)=>setPrice(e.target.value)}
                                                        />
                                                        </div>
                                                </div>

                                                <div className="mt-4">
                                                    <FormLabel htmlFor="crud-form-1">Description</FormLabel>
                                                    <FormInput
                                                    id="crud-form-1"
                                                    type="text"
                                                    className="w-full"
                                                    placeholder=""
                                                    value={description}
                                                    onChange={(e)=>setDescription(e.target.value)}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 pb-5 flex justify-between">
                                        <Button type="button" variant="outline-secondary" onClick={() => {
                                            setInfoModalPreview(false);
                                        }} className="w-24 mr-1">
                                            Close
                                        </Button>
                                        <Button type="button" variant="primary" onClick={() => {
                                            do_save_plans();
                                        }} className="w-24 mr-1">
                                            Save
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Dialog>
                </>

            
            }

            {/* END: Pricing Layout */}
        </>
    );
}

export default Main;
