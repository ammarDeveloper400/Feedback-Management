import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import {post, postFormData} from "../../stores/service/api";
import {toastMessage} from "../../utils/helper";
import {useAppDispatch, useAppSelector} from "../../stores/hooks/redux-hooks";
import {loginUser, authSelector, verifyEmail, clearUsedState, clearAllStates, setUserData} from "../../stores/features/auth/authSlice";
import {useNavigate, useParams} from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import {urls} from "../../utils/baseurl";
import clsx from "clsx";
import Table from "../../base-components/Table";

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [infoModalPreview, setInfoModalPreview] = useState(false)
  const [popupalert, setPopupAlert] = useState(false)
  const deleteButtonRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authSelector);
  const [hosts, setHosts] = useState([]);
  const [delid, setDelID] = useState(0);
  const final_image = urls.image;
  const [reqInfo, setReqInfo] = useState<any | null>([])
  const [userHosts, setUserHosts] = useState<any | null>([])
  const [showplan, setShowPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userrole, setUserRole] = useState(0);
  const [searchtext, setSearchText] = useState<any | null>(null)
  const [filtered, setFiltered] = useState<any | null>(null)

  useEffect(() => {
        
        let userInfo = localStorage.getItem('userInfo');
        // console.log('userInfo',userInfo)
        if (userInfo) {
            let parsed = JSON.parse(userInfo);
            setUserRole(parsed?.role);
            if(parsed.plan == 0 && parsed.role == 0){
              setShowPlan(true);
              setLoading(false)
            } else {
              setShowPlan(false);
              setData(parsed?.role);
            }
        } else {
          
        }
      
  }, [])
  const setData = async (role_:any = 0) => {
    const body_data = {role: role_};
    const res = await post(JSON.stringify(body_data), 'users/all-hosts');
    if(res.action == "success"){
      setHosts(res?.data.data_)
      setFiltered(res?.data.data_)
      setUserHosts(res?.data.user_host);
      setLoading(false)
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const do_delete_poll = async () => {
    const body_data = {del:delid};
    const res = await post(JSON.stringify(body_data), 'users/delete-hosts');
    if(res.action == "success"){
      toastMessage('Host information Delete Successfully!', 's');
      setDeleteConfirmationModal(false);
      setDelID(0)
      setData()
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const HandleSearch = async (val:any) => {
    setSearchText(val);
    let q = val;
    if (hosts) {
        if (q){
            let results = filtered.filter((item:any) => {
              // @ts-ignore
                return item.name !== null && item.name.toLowerCase().includes(q.toLowerCase());
            })
            setHosts(results)
        }else{
          setHosts(filtered)
        }
    }
  }

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">{userrole==1?"ALL":"MY"} HOSTS</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          
          <div className="hidden mr-auto md:block text-slate-500">
            {/* Showing 1 to 10 of 150 entries */}
            <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
              <div className="relative w-56 text-slate-500">
                <FormInput
                  type="text"
                  className="w-56 pr-10 !box"
                  placeholder="Search..."
                  value={searchtext}
                  onChange={(e)=>HandleSearch(e.target.value)}
                />
                <Lucide
                  icon="Search"
                  className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                />
              </div>
            </div>
          </div>
          {
            (!showplan && userrole == 0) &&
              <Button variant="primary" className="shadow-md"
                onClick={()=> 
                    {
                      if(userHosts.user_hosts >= userHosts.total_hosts){
                        setPopupAlert(true)
                      } else {
                        navigate("/new/host")
                      }
                    }
                  }
              >
                <Lucide icon="Plus" className="w-4 h-4" /> New Host
              </Button>
          }
          
        </div>
        {/* BEGIN: Users Layout */}
        
        {
            (showplan && !loading) &&

               <div className="p-5 intro-y box  col-span-12">
                  <div className="p-5 text-center">
                  <Lucide
                    icon="AlertTriangle"
                    className="w-16 h-16 mx-auto mt-3 text-danger"
                  />
                  <div className="text-slate-500 mt-7" style={{color:"red"}}>
                    You've not purchased any plan yet! <br/>
                  </div>

                  <div className="text-center">
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate("/subscription-plans")
                    }}
                    className="mt-5"
                  >
                    Purchase Membership
                  </Button>
                  
                </div>
                </div>
              </div>
        }

        {
          (hosts.length == 0 && !showplan && !loading) &&
          <>
            <div className="col-span-12 bg-white p-7 text-center">
              <span style={{color:"red"}}>No Host found!</span>
            </div>
          </>
        }
       
        {hosts.map((v:any, i:any) => (
          <div
            key={i}
            className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
          >
            <div className="box">
              <div className="p-0">
                <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                  <img
                    alt={v?.name}
                    className="rounded-md"
                    src={final_image+v?.logo}
                  />
                  <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                    <a className="block text-base font-medium">
                      {v?.name}
                    </a>
                  </div>
                </div>
                <div className="p-5 mt-0 text-slate-600 dark:text-slate-500">
                  <div className="flex items-center">
                    <Lucide icon="Target" className="w-4 h-4 mr-2" /> 
                    <span style={{width:"100px"}}>Polls:</span> {v.polls}
                  </div>
                  <div className="flex items-center mt-2">
                    <Lucide icon="Layers" className="w-4 h-4 mr-2" /> <span style={{width:"100px"}}>Feedback:</span>  0
                  </div>
                  <div className="flex items-center mt-2">
                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />{" "}
                    <span style={{width:"100px"}}>Status:</span>
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": v.status==1 },
                        { "text-danger": v.status==0 },
                      ])}
                    >
                      {v.status==1 ? " Active" : " Inactive"}
                    </div>
                    {/* {v?.status==1 ? "Active" : "Inactive"} */}
                  </div> 

                  <div className="flex items-center mt-2">
                    <Lucide icon="User" className="w-4 h-4 mr-2" />{" "}
                    <span style={{width:"100px"}}>Company:</span>
                    <div>
                      {v.user_name}
                    </div>
                  </div> 

                  <div className="flex items-center mt-2">
                    <Lucide icon="Eye" className="w-4 h-4 mr-2" /> <span style={{width:"100px"}}>Stats:</span>  
                    <a onClick={()=>navigate("/", {state: {hID:v.id, nhost:v.name}})} style={{color:"blue", cursor:"pointer"}}>
                      View
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-5 border-t lg:justify-between border-slate-200/60 dark:border-darkmode-400">
                <a className="flex items-center mr-auto text-primary" style={{cursor:"pointer"}} onClick={()=>{
                  setReqInfo(v)
                  setInfoModalPreview(true)
                }}>
                  <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                </a>
              {
                userrole == 0 &&
                <>
                  <a className="flex items-center mr-3 font-normal" href="javascript:;" onClick={()=>navigate('/new/host', {state: {id :v?.id, data:v}})}>
                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Edit
                  </a>
                  <a
                    className="flex items-center text-danger font-normal"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setDelID(v.id)
                      setDeleteConfirmationModal(true);
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </a>
                </>
                }
              </div>
            </div>
          </div>
        ))}
        {/* END: Users Layout */}
        {/* BEGIN: Pagination */}
        {/* <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>1</Pagination.Link>
            <Pagination.Link active>2</Pagination.Link>
            <Pagination.Link>3</Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
        </div> */}
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete this Host? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
              onClick={()=>do_delete_poll()}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}



      {/* POPUP VIEW OF DATA */}

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
                                HOST INFORMATION
                            </h2>
                        </Dialog.Title>
                        <div className="p-5">
                            <div className="text-slate-500">
                            <div className="overflow-y-auto pt-0 mycustomlabel">
                                <Table className="custom_tabke">
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">Host Name</Table.Th>
                                            <Table.Td>{reqInfo.name}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">Email</Table.Th>
                                            <Table.Td>{reqInfo.email}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">Phone</Table.Th>
                                            <Table.Td>{reqInfo.phone}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">Address</Table.Th>
                                            <Table.Td>{reqInfo.address}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">City</Table.Th>
                                            <Table.Td>{reqInfo.city}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">ZipCode</Table.Th>
                                            <Table.Td>{reqInfo.zipcode}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">Country</Table.Th>
                                            <Table.Td>{reqInfo.country}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">Website URL</Table.Th>
                                            <Table.Td>{reqInfo.web_url}</Table.Td>
                                        </Table.Tr>
                                        
                                       
                                        <Table.Tr>
                                            <Table.Th className="bg-black/[0.06]">Logo</Table.Th>
                                            <Table.Td>
                                              <img src={final_image+reqInfo.logo} style={{width:"100px"}} />
                                            </Table.Td>
                                        </Table.Tr>

                                    </Table.Tbody>
                                </Table>
                                {/*{reqInfo}*/}
                                </div>
                            </div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <Button type="button" variant="outline-secondary" onClick={() => {
                                setInfoModalPreview(false);
                            }} className="w-24 mr-1">
                                Close
                            </Button>
                        </div>
                    </Dialog.Panel>
                </Dialog>

            </>

            <>
       <Dialog staticBackdrop open={popupalert}
                        onClose={() => {
                            setPopupAlert(false);
                        }}
                        size={"lg"}
                >
          <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="AlertTriangle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="text-slate-500 mt-7" style={{color:"red"}}>
              You've reached the limit of adding Host, <br/>
              Upgrade to "Premium Plan" to create unlimited hosts.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                setPopupAlert(false);
              }}
              className="w-24 mr-1"
            >
              Close
            </Button>
            
          </div>
        </Dialog.Panel>
                </Dialog>

            </>

    </>
  );
}

export default Main;
