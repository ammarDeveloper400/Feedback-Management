import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/logo.png";
import illustrationUrl from "../../assets/images/illustration.svg";
import Button from "../../base-components/Button";
import {useNavigate,useParams} from "react-router-dom";
import clsx from "clsx";
import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import validation from './validation'
import {useAppDispatch, useAppSelector} from "../../stores/hooks/redux-hooks";
import {authSelector, clearAllStates, resetPassword} from "../../stores/features/auth/authSlice";
import 'react-toastify/dist/ReactToastify.css';
import TextInput from '../../components/TextInput/index'
import LoadingIcon from "../../base-components/LoadingIcon";
import {toastMessage} from "../../utils/helper";

function Main() {
    let {token} = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const auth = useAppSelector(authSelector);
    useEffect(() => {
        if (auth.isSuccess) {
            dispatch(clearAllStates())
            navigate('/login')
            toastMessage('Your password has been reset successfully', 's');
        }
        if (auth.isLoggedIn) {
            navigate('/update-profile')
        }
    }, [auth]);

    const goTo = (screen:string) => {
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
            dispatch(resetPassword({...formData, token: token?.split('=_=').join('.')}));
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
                        {/* BEGIN: Register Info */}
                        <div className="flex-col hidden min-h-screen xl:flex">
                            <a href="" className="flex items-center pt-5 -intro-x">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-6"
                                    src={logoUrl}
                                />
                                <span className="ml-3 text-lg text-white font-bold"> Urizon Feedback </span>
                            </a>
                            <div className="my-auto">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
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
                        {/* END: Register Info */}
                        {/* BEGIN: Register Form */}
                        <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                            <div
                                className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Reset Password
                                </h2>
                                <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
                                    A few more clicks to sign in to your account. Manage all your
                                    e-commerce accounts in one place
                                </div>
                                <form className="validate-form" onSubmit={onSubmit}>
                                    <div className="mt-8 intro-x">
                                        <TextInput register={register} errors={errors} name={'password'} type={'password'} placeholder={'New Password'}/>
                                        <br/>
                                        <TextInput register={register} errors={errors} name={'confirmPassword'} type={'password'} placeholder={'New Confirm Password'}/>
                                    </div>
                                    <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                        <Button
                                            disabled={auth.isLoading}
                                            variant="primary"
                                            type={'submit'}
                                            className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                                        >
                                            Submit
                                            {auth.isLoading && (<LoadingIcon icon="three-dots" color="white"
                                                                      className="w-4 h-4 ml-2"/>)}
                                        </Button>
                                        <Button
                                            onClick={()=>goTo('login')}
                                            variant="outline-secondary"
                                            className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                                        >
                                            Sign in
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* END: Register Form */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
