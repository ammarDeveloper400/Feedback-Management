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

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const params = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authSelector);
  const [hosts, setHosts] = useState([]);
  const [logo, setLogo] = useState('media/no-img.png')
  const [countries, setCountries] = useState(1);
  const [active, setActive] = useState(true)
  const final_image = urls.image;
  const [popupalert, setPopupAlert] = useState(false)
  const [userHosts, setUserHosts] = useState<any | null>([])
  const [showplan, setShowPlan] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      
      if (state != null && state?.id != 0) {
        const row = state?.data; 
        formik.setFieldValue('name', row?.name);
        formik.setFieldValue('address', row?.address);
        formik.setFieldValue('phone', row?.phone);
        formik.setFieldValue('email', row?.email);
        formik.setFieldValue('zip', row?.zipcode);
        formik.setFieldValue('country', row?.country);
        formik.setFieldValue('city', row?.city);
        formik.setFieldValue('url', row?.web_url);
        setActive(row?.status==1?true:false)
        setLogo(row?.logo)
      } else {
        let userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            let parsed = JSON.parse(userInfo);
            if(parsed.plan == 0){
              setShowPlan(true);
              // toastMessage('Your have not purchased any membership yet!', 'f');
              navigate('/hosts')
            } else {
              setShowPlan(false);
              setData();
            }
        } 
        // setData();
      }
  }, [auth])
  const setData = async () => {
    const body_data = {role:0};
    const res = await post(JSON.stringify(body_data), 'users/all-hosts');
    if(res.action == "success"){
      // setHosts(res?.data.data_)
      setUserHosts(res?.data.user_host);
      setLoading(false)
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const formik = useFormik({
    initialValues: {
        address: '',
        phone: '',
        email: '',
        name: '',
        city: '',
        zip: '',
        logo: '',
        url: '',
        country:''
    },
    validationSchema: validation,
    onSubmit: (values) => {
        const formDataWithStatus = {
            ...values,
            status: active?1:0
          };
        // const {...formData} = values;
        // console.log(formDataWithStatus)
        // return
        submit_host(formDataWithStatus);
    },
    validateOnChange: false,
    validateOnBlur: true,
});

const submit_host = async (val:any) => {
    // let abcv = val;
    let  abcv = {
      ...val,
      logo: logo
    };
    if(state != null && state.id != 0){
        abcv = {
            ...val,
            editid: state.id,
            logo: logo
          };
    } 
    // console.log(abcv)
    // return;
    const final_value_to_send =JSON.stringify(abcv);
    // const payment_data = {
    //     id: paymentIntent.id,
    //     amount: paymentIntent.amount,
    //     planId: props.plan.id
    // };
    const res = await post(final_value_to_send, state != null && state.id != 0?'user/update-host':'user/add-host');
    if(res.action == "success"){
        toastMessage(state != null && state.id != 0?'Host updated successfully!':'New host added successfully!', 's');
        navigate('/hosts')
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
        <h2 className="mr-auto text-lg font-medium">ADD NEW HOST</h2>
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
              You've reached the limit of adding Host, <br/>
              Upgrade to "Premium Plan" to create unlimited hosts.
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
            <div>
              <TextFormInput
                name={'name'}
                type="text"
                formik={formik}
                className="w-full"
                placeholder="Host(Business Name)"
              />
            </div>
            <div className="mt-3">
              
              <TextFormInput
                name={'address'}
                type="text"
                formik={formik}
                className="w-full"
                placeholder="Address"
              />
            </div>
            <div className="mt-0">
              <div className="grid-cols-3 gap-5 sm:grid">
                  <TextFormInput
                    name={'city'}
                    type="text"
                    formik={formik}
                    placeholder="City"
                    aria-describedby="input-group-3"
                  />
                <TextFormInput
                    name={'zip'}
                    type="text"
                    formik={formik}
                    placeholder="Zip Code"
                    aria-describedby="input-group-3"
                  />
                    <TextFormInput
                        name={'country'}
                        type="text"
                        formik={formik}
                        placeholder="Country"
                        aria-describedby="input-group-3"
                    />
              </div>
            </div>

            <div className="mt-0">
              <div className="grid-cols-2 gap-5 sm:grid">
                  <TextFormInput
                    name={'phone'}
                    type="text"
                    formik={formik}
                    placeholder="Phone Number"
                    aria-describedby="input-group-3"
                  />
                <TextFormInput
                    name={'email'}
                    type="text"
                    formik={formik}
                    placeholder="Email Address"
                    aria-describedby="input-group-3"
                  />
              </div>
            </div>

            <div className="mt-3">
                <TextFormInput
                    name={'url'}
                    type="url"
                    formik={formik}
                    placeholder="Website URL"
                    aria-describedby="input-group-3"
                  />
            </div>

            <div className="mt-3">
              <label>Active Status</label>
              <FormSwitch className="mt-2">
                <FormSwitch.Input type="checkbox" checked={active}  onChange={()=>setActive(!active)} />
              </FormSwitch>
            </div>

            
            <div className="mt-10">
                <div className="mx-auto w-52 xl:mr-0 xl:ml-0">
                        <div className="relative h-40 mx-auto cursor-pointer image-fit zoom-in">
                            <img
                                style={{ objectFit:'contain'}}
                                className="rounded-md"
                                src={final_image+logo}
                            />
                        </div>
                        <div className="relative mx-auto mt-5 cursor-pointer">
                            <Button
                                variant="primary"
                                type="button"
                                className="w-full"
                            >
                                Upload Logo
                            </Button>
                            <FormInput  accept={'image/png, image/jpeg, image/jpg'} onChange={onCompanyLogoChangeHandler} type="file"
                                        className="absolute top-0 left-0 w-full h-full opacity-0"/>
                        </div>
                </div>
            </div>


            
            

            <div className="mt-5 text-right">
              <Button
                type="button"
                variant="outline-secondary"
                className="w-24 mr-1"
                onClick={()=> navigate(-1)}
              >
                Cancel
              </Button>
              {//@ts-ignore
              <Button type="submit" variant="primary" className="w-24"  onClick={formik.handleSubmit}  >
                Save
              </Button>
              }
              
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
