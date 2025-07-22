import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/logo.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import {FormInput, FormCheck} from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../stores/hooks/redux-hooks";
import {loginUser, authSelector, verifyEmail, clearUsedState, clearAllStates} from "../../stores/features/auth/authSlice";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import validation from "./validation";
import {toastMessage} from "../../utils/helper";
import TextInput from "../../components/TextInput";
import LoadingIcon from "../../base-components/LoadingIcon";
import {post, postFormData} from "../../stores/service/api";

function Main() {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const auth = useAppSelector(authSelector);
    const [flag, setflag] = useState(true);

    useEffect(() => {
        if(params.token && !auth.isVerifySuccessCalled && flag){
            // console.log('1')
            setflag(false);
            dispatch(verifyEmail({token: params.token?.split('=_=').join('.')}))
        }
        if(params.token && auth.isVerifySuccess){
            // console.log(auth)
            // console.log('2')
            toastMessage('You account has been verified sucessfully', 's');
            dispatch(clearAllStates())
            navigate('/login')
        }
        if (auth.isSuccess) {
            // navigate('/')
            window.location.href = "/";
            // @ts-ignore
            dispatch(clearUsedState())
            toastMessage('You have been logged in sucessfully', 's');
        }
        if (auth.isLoggedIn) {
            navigate('/update-profile')
        }
    }, [auth]);
    const goTo = (screen: string) => {
        navigate(`/${screen}`)
    }
    const {
        register,
        trigger,
        getValues,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validation),
    });
    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await trigger();
        if (result) {
            const {confirmPassword, ...formData} = getValues();
            dispatch(loginUser(formData));
            // const body = JSON.stringify(formData);
            // const res = await post(body, 'auth/login');
            // // @ts-ignore
            // if(res.action == "success"){
            //     return res;
            // }
            // else{
            //     return toastMessage(res.data, 'f');
            // }
                
        }
    };

    return (
        <>
            <div
                className={clsx([
                    "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
                    "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
                    "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
                ])}
            >
                <DarkModeSwitcher/>
                <MainColorSwitcher/>
                <div className="container relative z-10 sm:px-10">
                    <div className="block grid-cols-2 gap-4 xl:grid">
                        {/* BEGIN: Login Info */}
                        <div className="flex-col hidden min-h-screen xl:flex">
                            <a href="" className="flex items-center pt-5 -intro-x">
                                <img
                                    alt="Urizon Feedback"
                                    className="w-6"
                                    src={logoUrl}
                                />
                                <span className="ml-3 text-lg text-white font-bold"> Urizon Feedback </span>
                            </a>
                            <div className="my-auto">
                                <img
                                    alt="Urizon Feedback"
                                    className="w-1/2 -mt-16 -intro-x"
                                    src={illustrationUrl}
                                />
                                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                                    Create your account in <br />just a few clicks
                                </div>
                                <div className="mt-5 text-md text-white -intro-x text-opacity-70 dark:text-slate-400">
                                    Smart Feedback - Reputation Mangement - Lead Generation
                                </div>
                            </div>
                        </div>
                        {/* END: Login Info */}
                        {/* BEGIN: Login Form */}
                        <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                            <div
                                className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Sign In
                                </h2>
                                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                                    A few more clicks to sign in to your account. Manage all your
                                    e-commerce accounts in one place
                                </div>
                                <form className="validate-form" onSubmit={onSubmit}>
                                    <div className="mt-8 intro-x">
                                        <TextInput register={register} errors={errors} name={'email'}
                                                   placeholder={'Email'}/>
                                        <br/>
                                        <TextInput register={register} errors={errors} name={'password'}
                                                   type={'password'} placeholder={'Password'}/>
                                    </div>
                                    <div
                                        className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                                        <div className="flex items-center mr-auto">
                                            <FormCheck.Input
                                                id="remember-me"
                                                type="checkbox"
                                                className="mr-2 border"
                                            />
                                            <label
                                                className="cursor-pointer select-none"
                                                htmlFor="remember-me"
                                            >
                                                Remember me
                                            </label>
                                        </div>
                                        <a style={{cursor:'pointer'}} onClick={()=>goTo('forget-password')}>Forgot Password?</a>
                                    </div>
                                    <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                        <Button
                                            disabled={auth.isLoading}
                                            variant="primary"
                                            type={'submit'}
                                            className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                                        >Login
                                            {auth.isLoading && (<LoadingIcon icon="three-dots" color="white"
                                                                             className="w-4 h-4 ml-2"/>)}
                                        </Button>
                                        <Button
                                            onClick={()=>goTo('register')}
                                            variant="outline-secondary"
                                            className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                                        >
                                            Register
                                        </Button>
                                    </div>
                                </form>
                                <div
                                    className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                                    By signin up, you agree to our{" "}
                                    <a className="text-primary dark:text-slate-200" href="">
                                        Terms and Conditions
                                    </a>{" "}
                                    &{" "}
                                    <a className="text-primary dark:text-slate-200" href="">
                                        Privacy Policy
                                    </a>
                                </div>
                            </div>

                        </div>
                        {/* END: Login Form */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
