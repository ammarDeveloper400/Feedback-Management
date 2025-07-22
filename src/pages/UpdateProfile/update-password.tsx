// @ts-nocheck
import React, {useEffect, useState} from "react";

import Button from "../../base-components/Button";
import {useAppDispatch} from "../../stores/hooks";
import {
    authSelector,
    clearUsedState,
    updatePassword
} from "../../stores/features/auth/authSlice";
import {useAppSelector} from "../../stores/hooks/redux-hooks";
import {toastMessage} from "../../utils/helper";
import TextFormInput from "../../components/TextFormInput";
import validation from "./update-password-validation";
import {useFormik} from "formik";
import LoadingIcon from "../../base-components/LoadingIcon";
import {post, postFormData} from "../../stores/service/api";

function Main() {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(authSelector);
    useEffect(() => {
        if (auth.isSuccess) {
            toastMessage('Password has been updated successfully', 's');
            formik.setFieldValue('password', '');
            formik.setFieldValue('confirmPassword','');
            // @ts-ignore
            dispatch(clearUsedState())
        }

    }, [auth]);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validation,
        onSubmit: async (values) => {
            const {password} = values;
            // dispatch(updatePassword({password}));
            const body = JSON.stringify(values);
            // console.log(body)
            const res =  await post(body, 'users/update-password');
            // @ts-ignore
            if(res.action == "success"){
                toastMessage('Password has been updated successfully', 's');
                formik.setFieldValue('password', '');
                formik.setFieldValue('confirmPassword','');
                // @ts-ignore
                dispatch(clearUsedState())
            }
            else{
                toastMessage(res.data, 'f');
                return;
            }
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    return (
        <>
            <div className="intro-y box lg:mt-5">
                <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 className="mr-auto text-base font-medium">
                        Update Password
                    </h2>
                </div>
                <div className="p-5">
                    <div className="flex flex-col xl:flex-row">
                        <div className="flex-1 mt-6 xl:mt-0">
                            <div className="grid grid-cols-12 gap-x-5">
                                <div className="col-span-12 xl:col-span-6">

                                    <TextFormInput disabled={false} formik={formik} type={'password'} name={'password'}
                                                   placeholder={'Password'}/>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <TextFormInput disabled={false} formik={formik} type={'password'}
                                                   name={'confirmPassword'} placeholder={'Confirm Password'}/>
                                </div>
                            </div>
                            <br/>
                            <Button disabled={auth.isLoading} variant="primary" onClick={formik.handleSubmit}
                                    type="submit" className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                                Update
                                {auth.isLoading && (<LoadingIcon icon="three-dots" color="white"
                                                                 className="w-4 h-4 ml-2"/>)}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
