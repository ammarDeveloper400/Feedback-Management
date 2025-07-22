import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import Progress from "../../base-components/Progress";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import {useEffect, useState} from "react";
import {useNavigate, createSearchParams} from "react-router-dom";
import {get, post} from "../../stores/service/api";
import {useAppDispatch, useAppSelector} from "../../stores/hooks/redux-hooks";
import {plansSelector, getPlans} from "../../stores/features/plans/plansSlice";
import {toastMessage} from "../../utils/helper";
import {authSelector, setUserData} from "../../stores/features/auth/authSlice";
import { Dialog, Menu } from "../../base-components/Headless";
import { FormInput, FormSelect,
    FormLabel,
    FormSwitch,
    InputGroup, } from "../../base-components/Form";
import {urls} from "../../utils/baseurl";
import clsx from "clsx";
import TomSelect from "../../base-components/TomSelect";

function Main() {
  const navigate = useNavigate();
  const auth = useAppSelector(authSelector);
  const [userslist, setUsersList] = useState([]);
  const [totalusers, setTotalUsers] = useState<any | null>([]);
  const dispatch = useAppDispatch();
  const [userrole, setUserRole] = useState(0);
  const [admin, setAdmin] =  useState(false)

  const [address, setAddress] = useState<any | null>('');
  const [companyName, setCompanyName] = useState<any | null>(null);
  const [email, setEmail] = useState<any | null>(null);
  const [password, setPassword] = useState<any | null>(null);
  const [phone, setPhone] = useState<any | null>('')
  const [userName, setUserName] = useState<any | null>(null);

  const [edit, setEdit] =  useState(false)
  const final_image = urls.image;
  const [infoModalPreview, setInfoModalPreview] = useState(false)
  const [searchtext, setSearchText] = useState<any | null>(null)
  const [filtered, setFiltered] = useState<any | null>(null)
  const [editID, setEditID] = useState<any | null>(0)
  const [hostid, setHostID] = useState<any | null>(-1)
  

  useEffect(() => {
      let userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
          let parsed = JSON.parse(userInfo);
          setUserRole(parsed?.role);
          if(parsed?.role == 0){
            navigate("/");
            return
          }
          setData();
      }
  }, [])
  const setData = async (role_:any = 0) => {
    const body_data = {hid:0, role: role_};
    const res = await post(JSON.stringify(body_data), 'users/all-users');
    if(res.action == "success"){
      console.log(res?.data.data);
      setUsersList(res?.data.data);
      setTotalUsers(res?.data.user_total)
      setFiltered(res?.data.data)
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const blockUser = async (id: any, type:any) => {
    const body_data = {id: id, type:type};
    const res = await post(JSON.stringify(body_data), 'user/block_user');
    // @ts-ignore
    if(res.action == "success"){
      setData()
      toastMessage(type==1?'Account Unblocked Successfully!':'Account blocked successfully!', 's');
    } else {
        toastMessage(res.data, 'f');
    }
  }
  const do_delete_user_popup = async (id:any) => {
   var x =  window.confirm('Are you sure you want to delete this user?');
   if(x){
      delete_user(id)
   }
  }
  const delete_user = async (id: any) => {
    const body_data = {id: id};
    const res = await post(JSON.stringify(body_data), 'user/delete_users');
    // @ts-ignore
    if(res.action == "success"){
      setData()
      toastMessage('Account deleted successfully!', 's');
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const do_save_user = async () => {
    const body_data = {address:address, companyName:companyName, email:email, password:password, phone:phone, userName:userName, role:admin?1:0, eid:!edit?0:1, editID:editID };
    // const body_data = {companyName:companyName, email:email, password:password, userName:userName, admin:admin?1:0};
    // console.log(body_data);
    // return 
    const res = await post(JSON.stringify(body_data), !edit?'auth/register':'auth/update_user');
    // @ts-ignore
    if(res.action == "success"){
      setInfoModalPreview(false)
      do_clear()
      setData()
      toastMessage(!edit?'New user created successfully!':'User information updated successfully!', 's');
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const do_clear = async () => {
    setUserName(null)
    setEmail(null)
    setPassword(null)
    setCompanyName(null)
    setAdmin(false)
    setEdit(false)
  }

  const edit_user_data = async (val:any) => {
    setUserName(val.username)
    setEmail(val.email)
    setCompanyName(val.name)
    setAdmin(val.role)
    setEditID(val.id)
    setEdit(true)
    setInfoModalPreview(true)
  }

  const HandleSearch = async (val:any) => {
    setSearchText(val);
    let q = val;
    if (userslist) {
        if (q){
            
            let results = userslist.filter((item) => {
              // @ts-ignore
                return item.name !== null && item.name.toLowerCase().includes(q.toLowerCase());
            })
            setUsersList(results)
        }else{
          setUsersList(filtered)
        }
    }
  }

  const do_filter = async (val:any) => {
    setHostID(val)
    let q = val;
    if (userslist) {
        if (q==1){
            let results = userslist.filter((item) => {
              // @ts-ignore
              return item.status === 1;
            })
            setUsersList(results)
        }
       else if (q==0){
          let results = userslist.filter((item) => {
            // @ts-ignore
            return item.status === 0;
          })
          setUsersList(results)
        }
        else{
          setUsersList(filtered)
        }
    }
  }

  return (
    <>
       <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Users"
                        className="w-[28px] h-[28px] text-primary"
                      />
                     
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                     {totalusers.total}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Users
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="UserCheck"
                        className="w-[28px] h-[28px] text-success"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {totalusers.active}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Active Users
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="UserX"
                        className="w-[28px] h-[28px] text-danger"
                      />
                     
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {totalusers.block}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Block Users
                    </div>
                  </div>
                </div>
              </div>
            
            </div>
      <h2 className="mt-10 text-lg font-medium intro-y">Users Management</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md" 
            onClick={()=>{
              do_clear();
              setInfoModalPreview(true)
            }}
          >
            Add New User
          </Button>
          
          <div className="hidden mx-auto md:block text-slate-500">
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 flex">
            <div className="w-[160px] mr-4">
            <TomSelect
                value={hostid}
                name={"filter"}
                //@ts-ignore
                onChange={(vv) => 
                  {
                    do_filter(vv)
                  }
                } 
                options={{placeholder: "Filter"}} 
                className="w-full bg-white "
              >
                  <option value={-1}>All</option>
                  <option value={1}>Active Users</option>
                  <option value={0}>Block Users</option>
              </TomSelect>
            </div>
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                defaultValue={searchtext}
                onChange={(e)=>HandleSearch(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Users Layout */}
        {userslist.map((v:any, i:any) => (
          <div key={i} className="col-span-12 intro-y md:col-span-6">
            <div className="box">
              <div className="flex flex-col items-center p-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                  <img
                    alt=""
                    className="rounded-full"
                    src={final_image+v.logo}
                  />
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                  <a className="font-medium">
                    {v.name}
                  </a>
                  <div className="text-slate-500 text-xs mt-0.5">
                    Username: {v.username}
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    Email: {v.email}
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    Status: {v.status_text}
                  </div>
                </div>
                <div className="flex mt-3 -ml-2 lg:ml-0 lg:justify-end lg:mt-0">
                  {
                    v.allow_del == 1 &&
                  <>
                  {
                    v.status == 0 ?
                    <Button title="Click to Unblock" variant="danger" className="px-2 py-1 mr-2" onClick={()=>blockUser(v.id, 1)}>
                      Blocked
                    </Button>
                    :
                    <Button variant="primary" className="px-2 py-1 mr-2" onClick={()=>blockUser(v.id, 0)}>
                    Block User
                  </Button>
                  }
                  </>
                }
                 
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center p-5 lg:flex-nowrap">
                <div className="w-full mb-4 mr-auto lg:w-1/2 lg:mb-0">
                  <div className="flex text-xs text-slate-500">
                    <div>Role: {v.role_text}</div>
                  </div>
                </div>
                <Button variant="primary" className="px-2 py-1 mr-2" onClick={()=>edit_user_data(v)}>
                  Edit
                </Button>
                {
                  v.allow_del == 1 &&
                  <Button variant="secondary" className="px-2 py-1" onClick={()=>do_delete_user_popup(v.id)}>
                    Delete Account
                  </Button>
                }
              </div>
            </div>
          </div>
        ))}
        {/* END: Users Layout */}

          
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
                                           {!edit?"ADD NEW":"UPDATE"} USER
                                        </h2>
                                    </Dialog.Title>
                                    <div className="p-5">
                                        <div className="text-slate-500">
                                            <div className="overflow-y-auto pt-0 mycustomlabel">
                                                <div>
                                                    <FormLabel htmlFor="crud-form-1">Company Name</FormLabel>
                                                    <FormInput
                                                    id="crud-form-1"
                                                    type="text"
                                                    className="w-full"
                                                    placeholder=""
                                                    value={companyName}
                                                    onChange={(e)=>setCompanyName(e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid-cols-2 gap-5 sm:grid mt-5">
                                                    <div className={""}>
                                                        <FormLabel htmlFor="crud-form-2">UserName</FormLabel>
                                                        <FormInput
                                                            id="crud-form-2"
                                                            type="text"
                                                            className="w-full"
                                                            placeholder=""
                                                            value={userName}
                                                            onChange={(e)=>setUserName(e.target.value)}
                                                        />
                                                        </div>
                                                        <div className={""}>
                                                        <FormLabel htmlFor="crud-form-3">Email</FormLabel>
                                                        <FormInput
                                                            id="crud-form-3"
                                                            type="email"
                                                            className="w-full"
                                                            placeholder=""
                                                            value={email}
                                                            onChange={(e)=>setEmail(e.target.value)}
                                                        />
                                                        </div>
                                                </div>
                                                {
                                                  !edit &&
                                                  <div className="grid-cols-2 gap-5 sm:grid mt-5">
                                                      <div className={""}>
                                                          <FormLabel htmlFor="crud-form-4">Password</FormLabel>
                                                          <FormInput
                                                              id="crud-form-4"
                                                              type="password"
                                                              className="w-full"
                                                              placeholder=""
                                                              value={password}
                                                              onChange={(e)=>setPassword(e.target.value)}
                                                          />
                                                          </div>
                                                          
                                                  </div>
                                                 }
                                                <div className="mt-4">
                                                    <FormLabel className="">
                                                      is Admin? 
                                                      <FormSwitch className="mt-2">
                                                        <FormSwitch.Input 
                                                          type="checkbox" 
                                                          onChange={(e)=>setAdmin(!admin)} 
                                                          checked={admin}
                                                        />
                                                      </FormSwitch>
                                                    </FormLabel>
                                                    
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 pb-5 flex justify-between">
                                        <Button type="button" variant="outline-secondary" onClick={() => {
                                            setInfoModalPreview(false);
                                            do_clear()
                                          
                                        }} className="w-24 mr-1">
                                            Close
                                        </Button>
                                        <Button type="button" variant="primary" onClick={() => {
                                            do_save_user();
                                        }} className="w-24 mr-1">
                                            Save
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Dialog>
                </>


      </div>
    </>
  );
}

export default Main;
