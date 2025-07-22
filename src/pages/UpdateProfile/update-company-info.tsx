// @ts-nocheck
import React, {useEffect, useState} from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import {
    FormInput,
    FormLabel,
    FormSelect,
    FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import TomSelect from "../../base-components/TomSelect";
import {useAppDispatch} from "../../stores/hooks";
import {
    authSelector,
    clearUsedState,
    updateCompanyLogo,
    updateCompanyProfile
} from "../../stores/features/auth/authSlice";
import {useAppSelector} from "../../stores/hooks/redux-hooks";
import {toastMessage} from "../../utils/helper";
import TextFormInput from "../../components/TextFormInput";
import validation from "./update-company-validation";
import { useFormik } from "formik";
import LoadingIcon from "../../base-components/LoadingIcon";
import {urls} from "../../utils/baseurl";

function Main() {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(authSelector);
    const final_image = urls.image;

    let token = localStorage.getItem('userTokens');
    const parsed_token = JSON.parse(token);

    useEffect(() => {
        if (auth.isSuccess) {
            toastMessage('Profile has been updated successfully', 's');
            // @ts-ignore
            dispatch(clearUsedState())
        }
        formik.setFieldValue('address', auth?.userInfo?.address);
        formik.setFieldValue('phone', auth?.userInfo?.phone);
        formik.setFieldValue('email', auth?.userInfo?.email);
        formik.setFieldValue('userName', auth?.userInfo?.userName);
        formik.setFieldValue('companyName', auth?.userInfo?.companyName);
    }, [auth]);

    const onCompanyLogoChangeHandler = (event: any) => {
        const formdata = new FormData();
        formdata.append("logo", event.target.files[0]);
        formdata.append("token", parsed_token);

        // console.log(for)
        dispatch(updateCompanyLogo(formdata));
    }

    const formik = useFormik({
        initialValues: {
            address: '',
            phone: '',
            email: '',
            userName: '',
            companyName: ''
        },
        validationSchema: validation,
        onSubmit: (values) => {
            const {address,phone, ...formData} = values;
            dispatch(updateCompanyProfile({address,phone}));
        },
        validateOnChange: false,
        validateOnBlur: true,
    });

    return (
        <>
            <div className="intro-y box lg:mt-5">
                <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 className="mr-auto text-base font-medium">
                        Company Information
                    </h2>
                </div>
                <div className="p-5">
                    <div className="flex flex-col xl:flex-row">
                        <div className="flex-1 mt-6 xl:mt-0">
                            <div className="grid grid-cols-12 gap-x-5">
                                <div className="col-span-12 2xl:col-span-6">
                                    <TextFormInput  disabled={true} formik={formik} type={'email'} name={'email'} placeholder={'Email'}/>
                                    <TextFormInput  disabled={true} formik={formik} type={'text'} name={'userName'} placeholder={'User Name'}/>
                                    <TextFormInput  disabled={true} formik={formik} type={'text'} name={'companyName'} placeholder={'Company Name'}/>
                                    <TextFormInput  disabled={false} formik={formik} type={'text'} name={'address'} placeholder={'Local Address'}/>
                                    <TextFormInput  disabled={false} formik={formik} type={'text'} name={'phone'} placeholder={'Phone Number'}/>
                                </div>
                            </div>
                            <br/>
                            <Button disabled={auth.isLoading} variant="primary" onClick={formik.handleSubmit}  type="submit" className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                                Update
                                {auth.isLoading && (<LoadingIcon icon="three-dots" color="white"
                                                                 className="w-4 h-4 ml-2"/>)}
                            </Button>
                        </div>

                        <div className="mx-auto w-52 xl:mr-0 xl:ml-6">
                            <div
                                className="p-5 border-2 border-dashed rounded-md shadow-sm border-slate-200/60 dark:border-darkmode-400">
                                <div className="relative h-40 mx-auto cursor-pointer image-fit zoom-in">
                                    <img
                                        style={{objectFit:'contain !important'}}
                                        className="rounded-md"
                                        alt={auth?.userInfo?.companyName}
                                        src={final_image+auth?.userInfo?.logo}
                                    />
                                </div>
                                <div className="relative mx-auto mt-5 cursor-pointer">
                                    <Button
                                        variant="primary"
                                        type="button"
                                        className="w-full"
                                    >
                                        Change Photo
                                    </Button>
                                    <FormInput  accept={'image/png, image/jpeg, image/jpg'} onChange={onCompanyLogoChangeHandler} type="file"
                                               className="absolute top-0 left-0 w-full h-full opacity-0"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
