import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import Button from "../../base-components/Button";
import {
    FormSwitch,
    FormLabel,
    FormInput,
    FormCheck,
    FormTextarea,
  } from "../../base-components/Form";
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
import {urls} from "../../utils/baseurl";
import Lucide from "../../base-components/Lucide";
import Style1 from "../../assets/images/1.png";
import Style2 from "../../assets/images/2.png";
import Style3 from "../../assets/images/3.png";
import Style4 from "../../assets/images/4.png";
import Style5 from "../../assets/images/5.png";
import facebook_url from "../../assets/rev_icons/fb_rev.svg";
import insta_url from "../../assets/rev_icons/ins_rev.svg";
import whatsapp_url from "../../assets/rev_icons/wp_rev.svg";
import twitter_url from "../../assets/rev_icons/x_rev.svg";
import tiktok_url from "../../assets/rev_icons/tik_rev.svg";
import youtube_url from "../../assets/rev_icons/you_rev.svg";
import yelp_url from "../../assets/rev_icons/yelp_rev.svg";
import bbb_url from "../../assets/rev_icons/bb_rev.svg";
import bing_url from "../../assets/rev_icons/bing.svg";
import trip_url from "../../assets/rev_icons/trip_rev.svg";
import linked_url from "../../assets/rev_icons/in_rev.svg";

// import review_url from "../../assets/review.png";
import review_url from "../../assets/rev_icons/goole_Rev.svg"
import TPilot from "../../assets/rev_icons/trust_rev.svg"
import ANGI from "../../assets/rev_icons/angi.svg"
import OTABLE from "../../assets/rev_icons/open_rev.svg"

import ArrowRight from "../../assets/arrow_button.svg";

import "./rating.css";
import { Dialog, Menu } from "../../base-components/Headless";

function Main() {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const auth = useAppSelector(authSelector);
    const [flag, setflag] = useState(true);
    const [review, setReview] = useState<any | null>([]);
    const [already, setAlready] = useState<any | null>([]);
    const [loading, setLoading] = useState<any | null>(true);
    const final_image = urls.image;
    const [rating, setRating] = useState<any | null>(0);
    const [popup, setPopup] = useState<any | null>(false);
    const [popupsocial, setPopupSocial] = useState<any | null>(false)
    const [popdiv, setPopDiv] = useState<any | null>(0);
    const [comment, setComment] = useState<any | null>("");
    const [name, setName] = useState<any | null>("");
    const [email, setEmail] = useState<any | null>("");

    const path = window.location.pathname;
    const lastSlashIndex = path.lastIndexOf('/');
    const slugFromUrl = lastSlashIndex !== -1 ? path.substring(lastSlashIndex + 1) : '';
    // console.log(slugFromUrl);
    useEffect(() => {
        do_get_review(slugFromUrl)
    }, [slugFromUrl]);
    
    const do_get_review = async (val:any) => {
        setLoading(true);
        const body_data = {slug:val};
        const res = await post(JSON.stringify(body_data), 'review/get-reviews-data');
        if(res.action == "success"){
            setReview(res?.data.data_)
            setAlready(res?.data.user_host)
            setLoading(false);
        } else {
            if(res?.data == 199){
                toastMessage('Invalid URL or poll has been expired!', 'f');
                navigate("/")
            }else {
                toastMessage(res.data, 'f');
            }
            setLoading(false);
        }
    }

    const do_send_feedback = async () => {
        setLoading(true);
        setPopupSocial(false);
        const body_data = {name:name, email:email, comment:comment, rating:rating, hostid: review.hostid, pollid: review.id, poll_owner: review.uID};
        
        const res = await post(JSON.stringify(body_data), 'review/submit-rating-data');
        // console.log(res)
        if(res.action == "success"){
            // setReview(res?.data.data_)
            // setAlready(res?.data.user_host)

            if(popdiv == 5){
                setPopupSocial(true);
            }
            do_get_review(slugFromUrl);
            setPopDiv(0);
            setPopup(false)
            
            toastMessage('Your feedback has been submitted successfully!', 's');
            setLoading(false);
        } else {
            toastMessage(res.data, 'f');
            setLoading(false);
        }
    }

    const do_show_popup = async () => {
        if(rating == 5){
            setPopDiv(5)
        } else if(rating == 4 || rating == 3){
            setPopDiv(4)
        } else {
            setPopDiv(1)
        }
        setPopup(true)
    }



    return (
        <>
            <div>
                <style>{`body, html { background: #039CFD;} .container {height: 100vh}`}</style>
                <div className="container relative z-10 flex ">
                    <div className="xl:w-3/5 m-auto sm:w[100%] h-100">
                       <div className="bg-white py-16 text-center" style={{borderRadius:"15px", border: "10px solid #DCDCDC"}}>
                            {
                                loading && 
                                <div className="center flex inline-block justify-center">
                                    <LoadingIcon icon="three-dots" color="primary" className="w-8 h-8 ml-2"/>
                                </div>
                            }
                            {
                                already.already_done == 1 &&
                                <div className="">

                                        <div className="flex justify-center">
                                            <img className="rounded-full w-20 h-20" src={final_image+already.host_logo} />
                                        </div>
                                       {/* <div className="text-xl font-bold">
                                            {already.host_name}
                                        </div>
                                   */}

                                    <div className="p-10 pt-0 mt-10">
                                    <div className="font-bold text-lg uppercase mb-5">
                                        Thank your very much!
                                    </div>

                                    <div className="">
                                        We appreciate your feedback.
                                    </div>


                                    
                                    </div>

                                    <a href="https://urizonfeedback.com" target="_blank" className="mt-10 text-primary" style={{fontSize:"12px"}}>
                                        Powered by Urizon Feedback
                                    </a>
                                </div>
                            }
                            {
                                (!loading && already.length != 0 && already.already_done == 0) &&
                                <div>
                                    <div className="text-center">
                                        <div className="flex justify-center">
                                            <img className="rounded-full w-20 h-20" src={final_image+already.host_logo} />
                                        </div>
                                        <div className="text-xl font-bold mt-5" style={{fontSize:"30px", color:"#039CFD", fontFamily: "DM Sans",}}>
                                            {already.host_name}
                                        </div>

                                        {/* <div className="">
                                            <h4 className="mt-4" style={{fontSize: "25px", fontWeight: "700", fontFamily: "DM Sans"}}>Please leave us a feedback</h4>
                                            <p className="mt-3" style={{fontFamily: "DM Sans", fontSize:"16px"}}>Your input is valuable in helping us better understand your <br /> needs and tailor our services accordingly.</p>
                                        </div> */}
                                    </div>
                                    <div className="text-center mt-8">
                                        <div className="text-md font-bold mb-5" style={{fontFamily: "DM Sans", fontSize:"18px"}}>
                                            {review.question}
                                        </div>
            
                                        {
                                            (review?.rstyle == "Yellow Star") && 
                                            <div className="flex emojis_icons gap-3 m-auto justify-center">
                                                <div onClick={()=>setRating(1)}   className={rating==1?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                                                <span style={{fontSize:"18px"}}>Worst</span>
                                                </div>
                                                <div onClick={()=>setRating(2)}   className={rating==2?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                                                <span style={{fontSize:"18px"}}>Poor</span>
                                                </div>
                                                <div onClick={()=>setRating(3)}   className={rating==3?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                                                <span style={{fontSize:"18px"}}>Average</span>
                                                </div>
                                                <div onClick={()=>setRating(4)}   className={rating==4?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                                                <span style={{fontSize:"18px"}}>Good</span>
                                                </div>
                                                <div onClick={()=>setRating(5)}   className={rating==5?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                                                <span style={{fontSize:"18px"}}>Excellent</span>
                                                </div>
                                            </div>
                                        }
                                        {
                                            (review?.rstyle == "Emojis Face") && 
                                            <div className="flex emojis_icons gap-3 m-auto justify-center">
                                                <div onClick={()=>setRating(1)} className={rating==1?"style_rating":"style_rating_hover"}>
                                                <img src={Style1} className="w-10 h-10 2xl" />
                                                <span style={{fontSize:"18px"}}>Worst</span>
                                                </div>
                                                <div onClick={()=>setRating(2)}   className={rating==2?"style_rating":"style_rating_hover"}>
                                                <img src={Style2} className="w-10 h-10 2xl" />
                                                <span style={{fontSize:"18px"}}>Poor</span>
                                                </div>
                                                <div onClick={()=>setRating(3)}   className={rating==3?"style_rating":"style_rating_hover"}>
                                                <img src={Style3} className="w-10 h-10 2xl" />
                                                <span style={{fontSize:"18px"}}>Average</span>
                                                </div>
                                                <div onClick={()=>setRating(4)}   className={rating==4?"style_rating":"style_rating_hover"}>
                                                <img src={Style4} className="w-10 h-10 2xl" />
                                                <span style={{fontSize:"18px"}}>Good</span>
                                                </div>
                                                <div onClick={()=>setRating(5)}   className={rating==5?"style_rating":"style_rating_hover"}>
                                                <img src={Style5} className="w-10 h-10 2xl" />
                                                <span style={{fontSize:"18px"}}>Excellent</span>
                                                </div>
                                            </div>
                                        }
                                        {
                                            (review?.rstyle  == "Solid Colors") && 
                                            <div className="flex emojis_icons gap-3 m-auto justify-center">
                                                <div  onClick={()=>setRating(1)}   className={rating==1?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'red', color:"red" }} />
                                                <span style={{fontSize:"18px"}}>Worst</span>
                                                </div>

                                                <div  onClick={()=>setRating(2)}   className={rating==2?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: '#f66d6d', color:"#f66d6d" }} />
                                                <span style={{fontSize:"18px"}}>Poor</span>
                                                </div>

                                                <div  onClick={()=>setRating(3)}   className={rating==3?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'orange', color:"orange" }} />
                                                <span style={{fontSize:"18px"}}>Average</span>
                                                </div>

                                                <div  onClick={()=>setRating(4)}   className={rating==4?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: '#6acc68', color:"#6acc68" }} />
                                                <span style={{fontSize:"18px"}}>Good</span>
                                                </div>

                                                <div  onClick={()=>setRating(5)}   className={rating==5?"style_rating":"style_rating_hover"}>
                                                <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'green', color:"green" }} />
                                                <span style={{fontSize:"18px"}}>Excellent</span>
                                                </div>
                                            </div>
                                        }
                                        <div className="mt-5 flex justify-center">
                                            <Button
                                                disabled={rating==0}
                                                variant="primary"
                                                type={'submit'}
                                                className="w-1/4 py-3 align-top  flex gap-2 justify-center align-center hover_submmm"
                                                style={{fontSize:"21px", borderRadius:"15px", fontFamily: "DM Sans"}}

                                                onClick={()=>do_show_popup()}
                                            >
                                                    Submit
                                                {loading && (<LoadingIcon icon="three-dots" color="white"
                                                                                    className="w-4 h-4 ml-2"/>)}
                                                    <img src={ArrowRight} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            }
                       </div>
                    </div>
                </div>
            </div>

            <>
       <Dialog staticBackdrop open={popup}
                        onClose={() => {
                            setPopup(false);
                        }}
                        size={"xl"}
                >
                    <Dialog.Panel>
                        <Dialog.Title>
                            <h2 className="mr-auto text-base font-medium">
                                {/* ADDITIONAL INFORMATION */}
                            </h2>
                            <div onClick={() => {
                                setPopup(false);
                            }} className="" style={{cursor:"pointer"}}>
                                <Lucide icon="X" className="w-6 h-6" style={{fontWeight:"bold"}} />
                            </div>
                        </Dialog.Title>
                        <div className="px-12 py-4 custom_padd_mobile">
                            <div className="text-slate-500">
                                {
                                    (popdiv == 1 || popdiv == 4) &&
                                    <div>
                                        <div className="overflow-y-auto pt-0 mycustomlabel">
                                            <div className="title_question">
                                                {popdiv==1?review?.rating3:review?.rating4}
                                            </div>
                                            <div className="mt-3">
                                                <label className="mb-3">(Optional)</label>
                                                <FormTextarea
                                                 rows={5}
                                                    value={comment}
                                                    onChange={(e)=>setComment(e.target.value)}
                                                    id="validation-form-6"
                                                    name="comment"
                                                    placeholder="Description"
                                                    className="new_input_style"
                                                    >
                                                </FormTextarea>
                                            </div>
                                        </div>

                                        {/* <div className="">
                                        <h2 className="mr-auto mt-3 mb-2 text-base font-medium">
                                            Optional
                                        </h2>
                                        </div> */}

                                        <div className="overflow-y-auto mycustomlabel">
                                            {/* <div className="title_question">
                                                Name
                                            </div> */}
                                            <div className="mt-3 flex gap-5">
                                                <div className="w-1/2">
                                                    <label className="mb-3">(Optional)</label>
                                                    <FormInput
                                                        id="crud-form-1"
                                                        type="text"
                                                        className="w-full new_input_style h-11"
                                                        placeholder="Name"
                                                        value={name}
                                                        onChange={(e)=>setName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="mb-3">(Optional)</label>
                                                    <FormInput
                                                        id="crud-form-1"
                                                        type="text"
                                                        className="w-full new_input_style h-11"
                                                        placeholder="Email Address"
                                                        value={email}
                                                        onChange={(e)=>setEmail(e.target.value)}
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="overflow-y-auto pt-3 mycustomlabel">
                                            <div className="title_question">
                                                Email Address
                                            </div>
                                            <div className="mt-3">
                                            <FormInput
                                                id="crud-form-1"
                                                type="text"
                                                className="w-full new_input_style"
                                                placeholder="Email Address"
                                                value={email}
                                                onChange={(e)=>setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div> */}

                                        <div className="mt-10 mb-10  flex justify-center">
                                            <Button
                                                disabled={loading}
                                                variant="primary"
                                                type={'submit'}
                                                // className="w-full px-4 py-3 align-top "
                                                className="w-1/4 py-3 align-top  flex gap-2 justify-center align-center hover_submmm"
                                                style={{fontSize:"21px", borderRadius:"15px", fontFamily: "DM Sans"}}
                                                onClick={()=>do_send_feedback()}
                                            >
                                                    Send
                                                {loading ? (<LoadingIcon icon="three-dots" color="white"
                                                                                    className="w-4 h-4 ml-2"/>)
                                                                                    :
                                                                                    <img src={ArrowRight} />
                                                                }
                                                
                                            </Button>
                                        </div>
                                    </div>
                                }

                                {
                                    (popdiv == 5) &&
                                    <div>
                                        <div className="overflow-y-auto pt-0 mycustomlabel review_url">
                                            <div className="title_question">
                                                {review?.rating5}
                                            </div>
                                            <div className="mt-3">
                                                <label className="mb-3">(Optional)</label>
                                                <FormTextarea
                                                rows={5}
                                                    value={comment || undefined}
                                                    onChange={(e)=>setComment(e.target.value)}
                                                    id="validation-form-6"
                                                    name="comment"
                                                    className="new_input_style"
                                                    placeholder="Description"
                                                    >
                                                </FormTextarea>
                                            </div>


                                            {/* <div className="overflow-y-auto mycustomlabel">
                                           
                                            <div className="mt-3 flex gap-5">
                                            <FormInput
                                                id="crud-form-1"
                                                type="text"
                                                className="w-full new_input_style h-11"
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e)=>setName(e.target.value)}
                                                />

                                            <FormInput
                                                id="crud-form-1"
                                                type="text"
                                                className="w-full new_input_style h-11"
                                                placeholder="Email Address"
                                                value={email}
                                                onChange={(e)=>setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div> */}

                                        </div>
                                        <div className="mt-10 mb-10  flex justify-center">
                                            <Button
                                                disabled={loading}
                                                variant="primary"
                                                type={'submit'}
                                                // className="w-full px-4 py-4 align-top "
                                                className="w-1/4 py-3 align-top  flex gap-2 justify-center align-center hover_submmm"
                                                style={{fontSize:"21px", borderRadius:"15px", fontFamily: "DM Sans"}}
                                                onClick={()=>do_send_feedback()}
                                            >
                                                    Send
                                                    {loading ? (<LoadingIcon icon="three-dots" color="white"
                                                                                    className="w-4 h-4 ml-2"/>)
                                                                                    :
                                                                                    <img src={ArrowRight} />
                                                                }
                                            </Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                       
                    </Dialog.Panel>
                </Dialog>



                {/* NEW DIALOG FOR 5 STAR DATA÷ */}

                <Dialog staticBackdrop open={popupsocial}
                        onClose={() => {
                            setPopupSocial(false);
                        }}
                        size={"xl"}
                >
                    <Dialog.Panel>
                        <Dialog.Title>
                            <h2 className="mr-auto text-base font-medium">
                                {/* ADDITIONAL INFORMATION */}
                            </h2>
                            <div onClick={() => {
                                setPopupSocial(false);
                            }} className="" style={{cursor:"pointer"}}>
                                <Lucide icon="X" className="w-6 h-6" />
                            </div>
                        </Dialog.Title>
                        <div className="px-11 py-10">
                            <div className="text-slate-500">

                            <div className="mt-0  text-center title_question pop_til_qs_mob">
                                                We are glad that you had a positive Experience.
                                            </div>

                                            {
                                                review?.social == 1 &&
                                                <div className="mt-5 border_dashed_feedback">
                                                    <p className="mb-4 title_question" style={{fontSize:"20px", marginBottom:"20px"}}>
                                                        {/* Please connect with us */}
                                                        {/* Follow us here */}
                                                        Please follow us
                                                    </p>
                                                    <div className="flex align-center items-center gap-8 justify-center custom_mobile_image_recorinze_fb flex-wrap">
                                                        {
                                                            review?.facebookurl != "" &&
                                                            <a href={review?.facebookurl} target="_blank">
                                                                <img src={facebook_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.linkedin != "" &&
                                                            <a href={review?.linkedin} target="_blank">
                                                                {/* <Lucide icon="Linkedin" /> */}
                                                                <img src={linked_url}  />
                                                            </a>
                                                        }
                                                        {
                                                            review?.instaurl != "" &&
                                                            <a href={review?.instaurl} target="_blank">
                                                                <img src={insta_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.twitterurl != "" &&
                                                            <a href={review?.twitterurl} target="_blank">
                                                                <img src={whatsapp_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.twitterurl != "" &&
                                                            <a href={review?.twitterurl} target="_blank">
                                                                <img src={twitter_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.tiktokurl != "" &&
                                                            <a href={review?.tiktokurl} target="_blank">
                                                                <img src={tiktok_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.youtubeurl != "" &&
                                                            <a href={review?.youtubeurl} target="_blank">
                                                                <img src={youtube_url}  />
                                                                </a>
                                                        }
                                                    </div>
                                                </div>
                                            }

                                            {
                                                review?.otherlink == 1 &&
                                                <div className="mt-5 border_dashed_feedback">
                                                   <p className="mb-4 title_question" style={{fontSize:"20px"}}>
                                                        {/* Follow us on Social Media */}
                                                        {/* Please connect with us */}
                                                        Recognize us on
                                                    </p>
                                                    <div className="flex align-center items-center gap-7 flex-wrap	custom_mobile_image_recorinze">
                                                        
                                                        {
                                                            review?.yelp != "" &&
                                                            <a href={review?.yelp} target="_blank">
                                                                <img src={yelp_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.bbb != "" &&
                                                            <a href={review?.bbb} target="_blank">
                                                                <img src={bbb_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.bing != "" &&
                                                            <a href={review?.bing} target="_blank">
                                                                <img src={bing_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.tripadvisor != "" &&
                                                            <a href={review?.tripadvisor} target="_blank">
                                                                <img src={trip_url}  />
                                                                </a>
                                                        }
                                                        {
                                                            review?.trustpilot != "" &&
                                                            <a href={review?.trustpilot} target="_blank">
                                                                <img src={TPilot} />
                                                           </a>
                                                        }
                                                        {
                                                            review?.angie != "" &&
                                                            <a href={review?.angie} target="_blank">
                                                                <img src={ANGI} />
                                                            </a>
                                                        }
                                                        {
                                                            review?.opentable != "" &&
                                                            <a href={review?.opentable} target="_blank">
                                                                <img src={OTABLE} />
                                                            </a>
                                                        }
                                                    </div>
                                                </div>
                                            }

                                            {
                                                review?.googlereview == 1 &&
                                                <div className="border_dashed_feedback m-auto mt-5 w-10/12">
                                                    <p className="mb-4 title_question" style={{fontSize:"20px"}}>
                                                    {/* Please leave us a review on Google, this means alot to us */}
                                                    {/* Leave us a review on Google this means alot to us */}
                                                    Please leave us a review on Google, this means a lot to us.
                                                    </p>
                                                    <div className="flex align-center items-center gap-4 justify-center">
                                                        
                                                        {
                                                            review?.googlereviewurl != "" &&
                                                            <a href={review?.googlereviewurl} target="_blank">
                                                                <img src={review_url}  />
                                                                </a>
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            }



                                            {
                                                review?.promotions == 1 &&
                                                <div className="align-center flex item_center justify-center mt-5 text-center gap-3 show_column_fl_mobile">
                                                    <p className="mb-0 title_question"  style={{fontSize:"18px"}}>
                                                    Any Other Link or reward:
                                                    </p>
                                                    <div className="flex align-center items-center gap-4" >
                                                        
                                                        {
                                                            review?.promotionurl != "" &&
                                                            <a href={review?.promotionurl} target="_blank" style={{textDecoration:"underline",  color: "#407BFF", fontSize:"18px", marginBottom:"0px"}} className="title_question">
                                                                Please check out this special offer 
                                                            </a>
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            }

                                            {
                                                review?.newsletter == 1 &&
                                                <div className="align-center flex item_center justify-center mt-5 text-center gap-3 show_column_fl_mobile">
                                                    <p className="mb-4 title_question" style={{fontSize:"18px"}}>
                                                    Newsletter
                                                    </p>
                                                    <div className="flex align-center items-center gap-4">
                                                        
                                                        {
                                                            review?.newsltterurl != "" &&
                                                            <a href={review?.newsltterurl} target="_blank" style={{textDecoration:"underline", color: "#407BFF", fontSize:"18px"}} className="title_question">
                                                               Please signup for our newsletter.
                                                            </a>
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            }

                            </div>
                        </div>
                       
                    </Dialog.Panel>
                </Dialog>

            </>



    </>

    );
}

export default Main;
