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
import { Dialog, Menu } from "../../base-components/Headless";
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
// const ratingstyles = [
//   {"id":1, "type":"Yellow Star"},
//   {"id":2, "type":"Emojis Face"},
//   {"id":3, "type":"Solid Colors"}
// ];
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
  const [hosts, setHosts] = useState([]);
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
  const [otherlinks, setOtherLinks] = useState(false);
  const [googlereview, setGoogleReview] = useState(false);
  const [promotions, setPromotions] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const [facebookurl, setFacebookUrl] = useState("");
  const [linkedin, setLinkedIn] = useState("");
  const [instaurl, setInstaUrl] = useState("");
  const [whatsappurl, setWhatsappUrl] = useState("");
  const [twitterurl, setTwitterUrl] = useState("");
  const [tiktokurl, setTikTokUrl] = useState("");
  const [youtubeurl, setYouTubeUrl] = useState("");
  const [googlereviewurl, setGoogleReviewURL] = useState("");
  const [promotionurl, setPromotionURL] = useState("");
  const [newsltterurl, setNewsLetterURL] = useState("");
  const [editid, setEditID] = useState(0)
  const [userHosts, setUserHosts] = useState<any | null>([])
  const [loading, setLoading] = useState(true);

  const [yelp, setYelp] = useState("");
  const [bbb, setBBB] = useState("");
  const [bing, setBing] = useState("");
  const [tripadvisor, setTripAdvisor] = useState("");
  const [angie, setAngie] = useState("");
  const [opentable, setOpenTable] = useState("");
  const [trustpilot, setTrustPilot] = useState("");
  const [polltitle, setPollTitle] = useState("");

  useEffect(() => {

    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        let parsed = JSON.parse(userInfo);
        if(parsed.plan == 0){
          // toastMessage('Your have not purchased any membership yet!', 'f');
          navigate('/polls')
        } else {
          setData();
          setPolls();
        }
    } 
      // setData();
      if (state != null && state?.id != 0) {
        const row = state?.data; 
        console.table(row)
        setPollTitle(row?.title)
        setEditID(row?.id)
        setHostID(row?.hostid)
        setQuestion(row?.question)
        setRStyle(row?.rstyle)
        setRating3(row?.rating3)
        setRating4(row?.rating4)
        setRating5(row?.rating5)
        setActive(row?.status==1?true:false)

        setSocial(row?.social==1?true:false)
        setGoogleReview(row?.googlereview==1?true:false)
        setPromotions(row?.promotions==1?true:false)
        setNewsletter(row?.newsletter==1?true:false)
        
        setFacebookUrl(row?.facebookurl)
        setLinkedIn(row?.linkedin)
        setInstaUrl(row?.instaurl)
        setWhatsappUrl(row?.whatsappurl)
        setTwitterUrl(row?.twitterurl)
        setTikTokUrl(row?.tiktokurl)
        setYouTubeUrl(row?.youtubeurl)
        setGoogleReviewURL(row?.googlereviewurl)
        setPromotionURL(row?.promotionurl)
        setNewsLetterURL(row?.newsltterurl)
        setOtherLinks(row?.otherlinks==1?true:false)

        setYelp(row?.yelp)
        setBBB(row?.bbb)
        setBing(row?.bing)
        setTripAdvisor(row?.tripadvisor)
        setAngie(row?.angie)
        setOpenTable(row?.opentable)
        setTrustPilot(row?.trustpilot)

      }
  }, [auth])
  const setData = async () => {
    const body_data = {role:0};
    const res = await post(JSON.stringify(body_data), 'users/all-hosts');
    if(res.action == "success"){
      setHosts(res?.data.data_)
      // setUserHosts(res?.data.user_host);
      setLoading(false)
      
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const setPolls = async () => {
    const body_data = {hid:0, role:0};
    const res = await post(JSON.stringify(body_data), 'users/all-polls');
    if(res.action == "success"){
      // setHosts(res?.data.data_)
      setUserHosts(res?.data.user_host);
      setLoading(false)
      
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
  if(polltitle== ""){
    toastMessage('Please Enter Title.', 'f');
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
    if(facebookurl == "" && instaurl == "" && whatsappurl == "" && twitterurl == "" && tiktokurl == "" && youtubeurl == "" && linkedin == ""){
      toastMessage('Please enter atleast one social media link to display.', 'f');
      return;
    }
  }
  if(otherlinks){
    if(yelp == "" && bbb == "" && bing == "" && tripadvisor == "" && angie == "" && opentable == "" && trustpilot == ""){
      toastMessage('Please enter atleast one Other link(s) to display.', 'f');
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
      polltitle:polltitle,
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
      linkedin:linkedin,
      instaurl:instaurl,
      whatsappurl:whatsappurl,
      twitterurl:twitterurl,
      tiktokurl:tiktokurl,
      youtubeurl: youtubeurl,
      otherlinks:otherlinks?1:0,
      yelp: yelp,
      bbb: bbb,
      bing: bing,
      tripadvisor: tripadvisor,
      angie: angie,
      opentable: opentable,
      trustpilot: trustpilot,

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
        toastMessage(state != null && state.id != 0?'Poll updated successfully!':'New Poll added successfully!', 's');
        navigate('/polls')
    } else {
        toastMessage(res.data, 'f');
    }
}

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

  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">ADD NEW POLL</h2>
      </div>
      {
        ((userHosts.user_hosts >= userHosts.total_hosts) && (state == null) && !loading) ?
        <div className="p-5 intro-y box mt-20">
            <div className="p-5 text-center">
            <Lucide
              icon="AlertTriangle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="text-slate-500 mt-7" style={{color:"red"}}>
              You've reached the limit of adding Polls, <br/>
              Upgrade to "Premium Plan" to create unlimited Polls.
            </div>

            <div className="text-center">
            <Button
              variant="primary"
              onClick={() => {
                navigate("/subscription-plans")
              }}
              className="mt-5"
            >
              Upgrade Membership
            </Button>
            
          </div>
          </div>
        </div>
        :
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y lg:col-span-12">
          {/* BEGIN: Form Layout */}
         
          <div className="p-5 intro-y box">
            <div className="grid-cols-2 gap-5 sm:grid">
                <div className={""}>
                    <label className={"pb-2 text-sm"}>Host</label>
                      <TomSelect
                          value={hostid}
                          name={"name"}
                          //@ts-ignore
                          onChange={(vv) => setHostID(vv)} 
                          options={{placeholder: "Host Name"}} 
                          className="w-full"
                        >
                          {hosts.map((v:any, i:any) => (
                            <option value={v.id}>{v.name}</option>
                          ))}
                        </TomSelect>
                </div>
                <div className="">
                  <label className={"pb-2 text-sm"}>Rating Style</label>
                  <div>
                    <FormSelect 
                        value={rstyle || 0} 
                        name={"style"} 
                        //@ts-ignore
                        onChange={(e) => setRStyle(e.target.value)} 
                        className="w-full"
                      >
                        <option value="">--Select Rating Style--</option>
                        {ratingstyles.map((v:any, i:any) => (
                          <option value={v}>{v}</option>
                        ))}
                      </FormSelect>
                      </div>
                </div>
            </div>
            {
              rstyle != "" &&
                      <div className="mt-5">
                      <label className={"pb-2 text-sm"}>Rating Preview</label>
                        <>
                        {
                          (rstyle == "Yellow Star") && 
                          <div className="flex gap-3">
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                             <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                              <span style={{fontSize:"11px"}}>Worst</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                             <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                              <span style={{fontSize:"11px"}}>Poor</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                             <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                              <span style={{fontSize:"11px"}}>Average</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                             <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                              <span style={{fontSize:"11px"}}>Good</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                             <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                              <span style={{fontSize:"11px"}}>Excellent</span>
                            </div>
                            
                            {/* <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} />
                            <Lucide icon="Star" className="w-8 h-8 mr-2 2xl" style={{ fill: 'gold', color:"gold" }} /> */}
                          </div>
                        }
                        {
                          (rstyle == "Emojis Face") && 
                          <div className="flex emojis_icons gap-3">
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <img src={Style1} className="w-12 h-12" />
                              <span style={{fontSize:"11px"}}>Worst</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <img src={Style2} className="w-12 h-12" />
                              <span style={{fontSize:"11px"}}>Poor</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <img src={Style3} className="w-12 h-12" />
                              <span style={{fontSize:"11px"}}>Average</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <img src={Style4} className="w-12 h-12" />
                              <span style={{fontSize:"11px"}}>Good</span>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <img src={Style5} className="w-12 h-12" />
                              <span style={{fontSize:"11px"}}>Excellent</span>
                            </div>
                            {/* <img src={Style2} className="w-12 h-12" />
                            <img src={Style3} className="w-12 h-12" />
                            <img src={Style4} className="w-12 h-12" />
                            <img src={Style5} className="w-12 h-12" /> */}
                          </div>
                        }
                        {
                          (rstyle == "Solid Colors") && 
                          <div className="flex">
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'red', color:"red" }} />
                              <span style={{fontSize:"11px"}}>Worst</span>
                            </div>

                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: '#f66d6d', color:"#f66d6d" }} />
                              <span style={{fontSize:"11px"}}>Poor</span>
                            </div>

                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'orange', color:"orange" }} />
                              <span style={{fontSize:"11px"}}>Average</span>
                            </div>

                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: '#6acc68', color:"#6acc68" }} />
                              <span style={{fontSize:"11px"}}>Good</span>
                            </div>

                            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                              <Lucide icon="Circle" className="w-8 h-8 mr-2 2xl" style={{ fill: 'green', color:"green" }} />
                              <span style={{fontSize:"11px"}}>Excellent</span>
                            </div>
                            
                            
                           
                            
                            
                          </div>
                        }
                        </>
                      </div>
            }
              <div className="grid-cols-2 gap-5 sm:grid mt-5">
              <div className={""}>
                  <FormLabel htmlFor="crud-form-1">Title</FormLabel>
                  <FormInput
                    id="crud-form-1"
                    type="text"
                    className="w-full"
                    placeholder="Title"
                    value={polltitle || undefined}
                    onChange={(e)=>setPollTitle(e.target.value)}
                  />
                </div>
                <div className={""}>
                  <FormLabel htmlFor="crud-form-1">Poll Question</FormLabel>
                  <FormInput
                    id="crud-form-1"
                    type="text"
                    className="w-full"
                    placeholder="Poll Question"
                    value={question || undefined}
                    onChange={(e)=>setQuestion(e.target.value)}
                  />
                </div>
              </div>


            <div className="mt-5">
              <hr />
            </div>
              <div className={"mt-5"}>
                <FormLabel htmlFor="crud-form-1">Message If 1 or 2-star Rating received</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  className="w-full"
                  placeholder=""
                  value={rating3}
                  onChange={(e)=>setRating3(e.target.value)}
                />
              </div>

              <div className={"mt-5"}>
                <FormLabel htmlFor="crud-form-1">Message If 3 or 4-star Rating received</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  className="w-full"
                  placeholder=""
                  value={rating4}
                  onChange={(e)=>setRating4(e.target.value)}
                />
              </div>

              <div className={"mt-5"}>
                <FormLabel htmlFor="crud-form-1">Message If 5-star Rating received</FormLabel>
                <FormInput
                  id="crud-form-1"
                  type="text"
                  className="w-full"
                  placeholder=""
                  value={rating5}
                  onChange={(e)=>setRating5(e.target.value)}
                />
              </div>

            <div className="mt-3">
              <label>Active Status</label>
              <FormSwitch className="mt-2">
                <FormSwitch.Input type="checkbox" checked={active}  onChange={()=>setActive(!active)} />
              </FormSwitch>
            </div>
          </div>
          {/* END: Form Layout */}

          {/* BEGIN: Form Layout */}
         
          <div className="flex items-center mt-8 intro-y">
          <h2 className="mr-auto text-lg font-medium">INFORMATION TO DISPLAY AFTER REVIEW SUBMITTED</h2>
        </div>
          <div className="p-5 intro-y box mt-5">
            <div className="mt-3">
              <label className="flex item-center gap-5">
                <div>
                <FormSwitch className="mt-2">
                  <FormSwitch.Input type="checkbox" checked={social}  onChange={()=>setSocial(!social)} />
                </FormSwitch>
                </div>
              <div style={{marginTop:"10px"}}>Social Media Links</div>
              </label>
            </div>
           
            {
              social &&
                  <div className="mt-5">
                    
                      <div className="grid-cols-2 gap-5 sm:grid">
                        <div>
                          <label>FaceBook URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={facebookurl}
                              onChange={(e)=>setFacebookUrl(e.target.value)}
                            />
                        </div>
                        <div>
                          <label>LinkedIn URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={linkedin}
                              onChange={(e)=>setLinkedIn(e.target.value)}
                            />
                        </div>
                        <div>
                          <label>Instagram URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={instaurl}
                              onChange={(e)=>setInstaUrl(e.target.value)}
                            />
                        </div>
                        <div>
                          <label>WhatsApp URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={whatsappurl}
                              onChange={(e)=>setWhatsappUrl(e.target.value)}
                            />
                        </div>
                        <div>
                          <label>X URL (Formerly Twitter)</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={twitterurl}
                              onChange={(e)=>setTwitterUrl(e.target.value)}
                            />
                        </div>

                        <div>
                          <label>TikTok URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={tiktokurl}
                              onChange={(e)=>setTikTokUrl(e.target.value)}
                            />
                        </div>

                        <div>
                          <label>Youtube URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={youtubeurl}
                              onChange={(e)=>setYouTubeUrl(e.target.value)}
                            />
                        </div>
                       
                      </div>
                  </div>
            }
            

            <div className="mt-3">
              <label className="flex item-center gap-5">
                <div>
                <FormSwitch className="mt-2">
                  <FormSwitch.Input type="checkbox" checked={otherlinks}  onChange={()=>setOtherLinks(!otherlinks)} />
                </FormSwitch>
                </div>
              <div style={{marginTop:"10px"}}>Other Links</div>
              </label>
            </div>
           
            {
              otherlinks &&
                  <div className="mt-5">
                    
                      <div className="grid-cols-2 gap-5 sm:grid">
                        <div>
                          <label>Yelp</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={yelp}
                              onChange={(e)=>setYelp(e.target.value)}
                            />
                        </div>
                        <div>
                          <label>BBB</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={bbb}
                              onChange={(e)=>setBBB(e.target.value)}
                            />
                        </div>
                        <div>
                          <label>Bing Reviews</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={bing}
                              onChange={(e)=>setBing(e.target.value)}
                            />
                        </div>
                        <div>
                          <label>TripAdvisor</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={tripadvisor}
                              onChange={(e)=>setTripAdvisor(e.target.value)}
                            />
                        </div>

                        <div>
                          <label>Angi's List</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={angie}
                              onChange={(e)=>setAngie(e.target.value)}
                            />
                        </div>

                        <div>
                          <label>OpenTable</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={opentable}
                              onChange={(e)=>setOpenTable(e.target.value)}
                            />
                        </div>

                        <div>
                          <label>TrustPilot</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={trustpilot}
                              onChange={(e)=>setTrustPilot(e.target.value)}
                            />
                        </div>
                       
                      </div>
                  </div>
            }

            <div className="mt-3">
              <label className="flex item-center gap-5">
                <div>
                <FormSwitch className="mt-2">
                  <FormSwitch.Input type="checkbox" checked={googlereview}  onChange={()=>setGoogleReview(!googlereview)} />
                </FormSwitch>
                </div>
              <div style={{marginTop:"10px"}}>Google Review</div>
              </label>
            </div>

            {
              googlereview &&
                  <div className="mt-5">
                        <div>
                          <label>Google Review URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={googlereviewurl}
                              onChange={(e)=>setGoogleReviewURL(e.target.value)}
                            />
                        </div>
                  </div>
            }


            <div className="mt-3">
              <label className="flex item-center gap-5">
                <div>
                <FormSwitch className="mt-2">
                  <FormSwitch.Input type="checkbox" checked={promotions}  onChange={()=>setPromotions(!promotions)} />
                </FormSwitch>
                </div>
              <div style={{marginTop:"10px"}}>Promotion Link</div>
              </label>
            </div>

            {
              promotions &&
                  <div className="mt-5">
                        <div>
                          <label>Promotion URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={promotionurl}
                              onChange={(e)=>setPromotionURL(e.target.value)}
                            />
                        </div>
                  </div>
            }

            <div className="mt-3">
              <label className="flex item-center gap-5">
                <div>
                <FormSwitch className="mt-2">
                  <FormSwitch.Input type="checkbox" checked={newsletter}  onChange={()=>setNewsletter(!newsletter)} />
                </FormSwitch>
                </div>
              <div style={{marginTop:"10px"}}>Newsltter</div>
              </label>
            </div>

            {
              newsletter &&
                  <div className="mt-5">
                        <div>
                          <label>Newsletter URL</label>
                          <FormInput
                              id="crud-form-1"
                              type="text"
                              className="w-full"
                              placeholder=""
                              value={newsltterurl}
                              onChange={(e)=>setNewsLetterURL(e.target.value)}
                            />
                        </div>
                  </div>
            }
            

              <div className="mt-5 text-right">
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="w-24 mr-1"
                  onClick={()=> navigate(-1)}
                >
                  Cancel
                </Button>
                <Button variant="primary" className="w-24"  onClick={()=>do_submit_polls()}  >
                  Save
                </Button>
                
              </div>
          </div>
          {/* END: Form Layout */}
        </div>
      </div>
}
    </>
  );
}

export default Main;
