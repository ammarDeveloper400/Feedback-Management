import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect,
    FormLabel,
    FormSwitch,
    InputGroup, } from "../../base-components/Form";
import TomSelect from "../../base-components/TomSelect";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu, Tab } from "../../base-components/Headless";
import {post, postFormData} from "../../stores/service/api";
import {toastMessage} from "../../utils/helper";
import {useAppDispatch, useAppSelector} from "../../stores/hooks/redux-hooks";
import {loginUser, authSelector, verifyEmail, clearUsedState, clearAllStates, setUserData} from "../../stores/features/auth/authSlice";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useFormik } from "formik";
import {urls} from "../../utils/baseurl";
import validation from "./validation";
import TextFormInput from "../../components/TextFormInput";
import Style1 from "../../assets/images/1.png";
import Style2 from "../../assets/images/2.png";
import Style3 from "../../assets/images/3.png";
import Style4 from "../../assets/images/4.png";
import Style5 from "../../assets/images/5.png";
import ReportLineChart from "../../components/ReportLineChart";
import { Tab as HeadlessTab } from "@headlessui/react";
import Progress from "../../base-components/Progress";
import clsx from "clsx";

const ratingstyles = [
  "Yellow Star", "Emojis Face", "Solid Colors"
];

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const params = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authSelector);
  const [hosts, setHosts] = useState<any | null>([]);
  const [hostid, setHostID] = useState("");
  const [rstyle, setRStyle] = useState("");
  const [logo, setLogo] = useState('media/no-img.png')
  const [countries, setCountries] = useState(1);
  const [active, setActive] = useState(true)
  const final_image = urls.image;
  

  const [question, setQuestion] = useState("");
  const [rating3, setRating3] = useState("Sorry that you had a terrible experience, please tell us what happened");
  const [rating4, setRating4] = useState("Is there anything we can do to improve your service?");
  const [rating5, setRating5] = useState("Awesome – What made this a positive experience?");
  const [social, setSocial] = useState(false);
  const [googlereview, setGoogleReview] = useState(false);
  const [promotions, setPromotions] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const [facebookurl, setFacebookUrl] = useState("");
  const [instaurl, setInstaUrl] = useState("");
  const [whatsappurl, setWhatsappUrl] = useState("");
  const [twitterurl, setTwitterUrl] = useState("");
  const [googlereviewurl, setGoogleReviewURL] = useState("");
  const [promotionurl, setPromotionURL] = useState("");
  const [newsltterurl, setNewsLetterURL] = useState("");
  const [editid, setEditID] = useState(0)

  useEffect(() => {
    //   setData();
      if (state != null && state?.id != 0) {
        setData()
      }
  }, [auth])
  const setData = async () => {
    const body_data = {};
    const res = await post(JSON.stringify(body_data), 'users/view-hosts');
    if(res.action == "success"){
      setHosts(res.data)
    } else {
        toastMessage(res.data, 'f');
    }
  }

const do_submit_polls = async () => {
  if(hostid== ""){
    toastMessage('Please select Host.', 'f');
    return;
  }
  if(rstyle== ""){
    toastMessage('Please select Rating Style.', 'f');
    return;
  }
  if(question== ""){
    toastMessage('Please Enter Poll Question.', 'f');
    return;
  }
  if(rating3== ""){
    toastMessage('Please Enter 3-Star Rating Text.', 'f');
    return;
  }
  if(rating4== ""){
    toastMessage('Please Enter 4-Star Rating Text.', 'f');
    return;
  }
  if(rating5== ""){
    toastMessage('Please Enter 5-Star Rating Text.', 'f');
    return;
  }
  if(social){
    if(facebookurl == "" && instaurl == "" && whatsappurl == "" && twitterurl == ""){
      toastMessage('Please enter atleast one social media link to display.', 'f');
      return;
    }
  }
  if(googlereview){
    if(googlereviewurl == ""){
      toastMessage('Please enter Google Review URL.', 'f');
      return;
    }
  }
  if(promotions){
    if(promotionurl == ""){
      toastMessage('Please enter Promotion URL.', 'f');
      return;
    }
  }
  if(newsletter){
    if(newsltterurl == ""){
      toastMessage('Please enter Newsletter URL.', 'f');
      return;
    }
  }
    const values = {
      hostid:hostid,
      rstyle:rstyle,
      question:question,
      rating3:rating3,
      rating4:rating4,
      rating5:rating5,
      status:active?1:0,
      social:social?1:0,
      googlereview:googlereview?1:0,
      promotions:promotions?1:0,
      newsletter:newsletter?1:0,
      facebookurl:facebookurl,
      instaurl:instaurl,
      whatsappurl:whatsappurl,
      twitterurl:twitterurl,
      googlereviewurl:googlereviewurl,
      promotionurl:promotionurl,
      newsltterurl:newsltterurl,
      editid:editid
    }
    // console.log(values)
    // return;
    const final_value_to_send =JSON.stringify(values);
    const res = await post(final_value_to_send, state != null && state.id != 0?'user/update-poll':'user/add-poll');
    if(res.action == "success"){
        toastMessage('New Poll added successfully!', 's');
        navigate('/polls')
    } else {
        toastMessage(res.data, 'f');
    }
}

const handleEmailClick = async() => {
    const subject = 'Review Poll';
    const body = urls.web+hosts?.slug;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

const onCompanyLogoChangeHandler = async (event: any) => {
    const formdata = new FormData();
    formdata.append("logo", event.target.files[0]);
    const res = await postFormData(formdata, 'user/upload-picture');
    if(res.action == "success"){
        setLogo(res.data);
    } else {
        toastMessage(res.data, 'f');
    }
}

const handleCopyToClipboard = async () => {
    const textArea = document.createElement('textarea');
    textArea.value = urls.web+hosts?.slug;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toastMessage('Link copied successfully!', 's');
  };

  const handleDownload = async () => {
    const imageUrl = final_image+hosts?.qrcode; // Replace this with the actual image URL
    const fileName = 'poll_qr_code.jpg'; // The name of the downloaded file

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        //@ts-ignore
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading the image:', error);
      });
  };

return (
    
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">POLL INFORMATION</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        
        <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
          <div className="grid grid-cols-12 gap-6">
            {/* BEGIN: Daily Sales */}
            <div className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">Poll Details</h2>
              </div>
              <div className="p-5">
                <div className="relative flex items-center">
                  <div className="flex items-center w-12 h-12 image-fit">
                    <Lucide icon="Box" />
                  </div>
                  <div className=" mr-auto">
                    <a className="font-medium">
                      {hosts?.host_name} <small>(Host)</small>
                    </a>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <div className="flex items-center w-12 h-12 image-fit">
                    <Lucide icon="Star" />
                  </div>
                  <div className=" mr-auto">
                    <a className="font-medium">
                      {
                        hosts?.rstyle != "" &&
                      <div className="mt-0">
                        <>
                        {
                          (hosts?.rstyle == "Yellow Star") && 
                          <div className="flex">
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                          </div>
                        }
                        {
                          (hosts?.rstyle == "Emojis Face") && 
                          <div className="flex emojis_icons gap-2">
                            <img src={Style1} className="w-12 h-12" />
                            <img src={Style2} className="w-12 h-12" />
                            <img src={Style3} className="w-12 h-12" />
                            <img src={Style4} className="w-12 h-12" />
                            <img src={Style5} className="w-12 h-12" />
                          </div>
                        }
                        {
                          (hosts?.rstyle == "Solid Colors") && 
                          <div className="flex">
                            <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'red', color:"red" }} />
                            <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: '#f66d6d', color:"#f66d6d" }} />
                            <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'orange', color:"orange" }} />
                            <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: '#6acc68', color:"#6acc68" }} />
                            <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'green', color:"green" }} />
                          </div>
                        }
                        </>
                      </div>
            }
            
                    </a>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <div className="flex items-center w-12 h-12 image-fit">
                    <Lucide icon="Clipboard" />
                  </div>
                  <div className=" mr-auto">
                    <a className="font-medium">
                      {hosts?.question}
                    </a>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <div className="flex items-center w-12 h-12 image-fit">
                    <Lucide icon="CheckSquare" />
                  </div>
                  <div className=" mr-auto">
                    <a className="font-medium">
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": hosts?.status==1 },
                        { "text-danger": hosts?.status==0 },
                      ])}
                    >
                      {hosts?.status==1 ? "Active" : "Inactive"}
                    </div>
                    </a>
                  </div>
                </div>
                
                
              </div>
            </div>
            {/* END: Daily Sales */}
            
           
          
            {/* BEGIN: Top Products */}
            <Tab.Group className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">Rating Questions</h2>
              </div>
              <div className="p-5">
                <Tab.Panels className="mt-0">
                  <Tab.Panel>
                    <div className="flex flex-col items-center sm:flex-row">
                      <div className="mr-auto">
                        <a href="" className="font-medium">
                          3-Star Question
                        </a>
                        <div className="mt-1 text-slate-500">
                          {hosts?.rating3}
                        </div>
                      </div>
                      
                    </div>
                    <div className="flex flex-col items-center sm:flex-row mt-5">
                      <div className="mr-auto">
                        <a href="" className="font-medium">
                          4-Star Question
                        </a>
                        <div className="mt-1 text-slate-500">
                          {hosts?.rating4}
                        </div>
                      </div>
                      
                    </div>
                    <div className="flex flex-col items-center sm:flex-row mt-5">
                      <div className="mr-auto">
                        <a href="" className="font-medium">
                          5-Star Question
                        </a>
                        <div className="mt-1 text-slate-500">
                          {hosts?.rating5}
                        </div>
                      </div>
                      
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </div>
            </Tab.Group>
            {/* END: Top Products */}
            

            {/* SOCIAL MEDIA LINKS */}
            {hosts?.social == 1 && 
            <>
            <div className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">SOCIAL MEDIA LINKS</h2>
              </div>
              <div className="p-5">
              {hosts?.facebookurl != "" &&
                <div className="relative flex items-center">
                  <div className="flex items-center w-12 h-12 image-fit">
                    <Lucide icon="Facebook" />
                  </div>
                  <div className=" mr-auto">
                    <a href={hosts?.facebookurl} target="_blank" className="font-medium">
                      {hosts?.facebookurl}
                    </a>
                  </div>
                </div>
                }
                {hosts?.instaurl != "" &&
                <div className="relative flex items-center">
                  <div className="flex items-center w-12 h-12 image-fit">
                    <Lucide icon="Instagram" />
                  </div>
                  <div className=" mr-auto">
                    <a href={hosts?.instaurl} target="_blank" className="font-medium">
                      {hosts?.instaurl}
                    </a>
                  </div>
                </div>
                 }
                 {hosts?.instaurl != "" &&
                <div className="relative flex items-center">
                  <div className="flex items-center w-12 h-12 image-fit">
                    <Lucide icon="Clipboard" />
                  </div>
                  <div className=" mr-auto">
                    <a href={hosts?.whatsappurl} target="_blank" className="font-medium">
                      {hosts?.whatsappurl}
                    </a>
                  </div>
                </div>
                 }
                {hosts?.twitterurl != "" &&
                    <div className="relative flex items-center">
                    <div className="flex items-center w-12 h-12 image-fit">
                        <Lucide icon="Twitter" />
                    </div>
                    <div className=" mr-auto">
                        <a href={hosts?.twitterurl} target="_blank" className="font-medium">
                        {hosts?.twitterurl}
                        </a>
                    </div>
                    </div>
                }
                </div>
                </div>
                </>
            }

            {hosts?.googlereview == 1 && 
            <>
            <div className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">GOOGLE REVIEW LINK</h2>
              </div>
              <div className="p-5">
                <div className="relative flex items-center">
                  <div className=" mr-auto">
                    <a href={hosts?.googlereviewurl} target="_blank" className="font-medium">
                      {hosts?.googlereviewurl}
                    </a>
                  </div>
                </div>
                
                </div>
                </div>
                </>
            }
            {hosts?.promotions == 1 && 
            <>
            <div className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">PROMOTIONAL LINK</h2>
              </div>
              <div className="p-5">
                <div className="relative flex items-center">
                  <div className=" mr-auto">
                    <a  href={hosts?.promotionurl} target="_blank" className="font-medium">
                      {hosts?.promotionurl}
                    </a>
                  </div>
                </div>
                
                </div>
                </div>
                </>
            }
            {hosts?.newsletter == 1 && 
            <>
            <div className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">NEWSLETTER LINK</h2>
              </div>
              <div className="p-5">
                <div className="relative flex items-center">
                  <div className=" mr-auto">
                    <a href={hosts?.newsltterurl} target="_blank" className="font-medium">
                      {hosts?.newsltterurl}
                    </a>
                  </div>
                </div>
                
                </div>
                </div>
                </>
            }
          </div>
        </div>

        {/* BEGIN: Profile Menu */}
        <div className="flex flex-col-reverse col-span-12 lg:col-span-5 2xl:col-span-4 lg:block">
            
          <div className="mt-5 intro-y box lg:mt-0 text-center">
          <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto font-medium" style={{color:"#202020"}}>SCAN QR CODE</h2>
              </div>
            <img src={final_image+hosts?.qrcode}  style={{margin: 'auto'}} />

            <Button onClick={()=>handleDownload()} className="mb-7">
                Download QR Code
            </Button>
          </div>

          
          <div className="mt-5 intro-y ">
          <div className="col-span-12 intro-y box 2xl:col-span-6">
              <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto font-medium" style={{color:"#202020"}}>SHARE LINK</h2>
              </div>
              <div className="p-5" style={{position:"relative"}}>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  className="w-full"
                  placeholder="Poll Question"
                  value={urls.web+hosts?.slug || undefined}
                  readOnly
                />
                <Button onClick={()=>handleCopyToClipboard()} style={{position:"absolute", right:'20px', top:'20px', padding:"7px 10px", background:"#f0f0f0", cursor:"pointer"}}>
                    <Lucide icon="Copy" />
                </Button>
              </div>

              <div className="p-5 flex items-center gap-10" style={{position:"relative"}}>
                <p>Email</p>

                <Button onClick={()=>handleEmailClick()}>
                    <Lucide icon="Mail" />
                </Button>
              </div>
              
            </div>
          
          </div>
        </div>
        {/* END: Profile Menu */}
      </div>
    </>
  );
}

export default Main;
