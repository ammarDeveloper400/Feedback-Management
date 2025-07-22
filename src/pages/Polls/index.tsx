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
import Table from "../../base-components/Table";
import clsx from "clsx";
import Tippy from "../../base-components/Tippy";

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [popupalert, setPopupAlert] = useState(false)
  const deleteButtonRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authSelector);
  const [hosts, setHosts] = useState([]);
  const final_image = urls.image;
  const [delid, setDelID] = useState(0);
  const [userHosts, setUserHosts] = useState<any | null>([])
  const [showplan, setShowPlan] = useState(false);
  const [userrole, setUserRole] = useState(0);
  const [filtered, setFiltered] = useState<any | null>(null)
  const [searchtext, setSearchText] = useState<any | null>(null)

  useEffect(() => {
       let userInfo = localStorage.getItem('userInfo');
        // console.log('userInfo',userInfo)
        if (userInfo) {
            let parsed = JSON.parse(userInfo);
            setUserRole(parsed?.role);
            if(parsed.plan == 0 && parsed.role == 0){
              setShowPlan(true);
            } else {
              setShowPlan(false);
              setData(parsed?.role);
            }
        } else {
          
        }
  }, [])
  const setData = async (role_:any = 0) => {
    const body_data = {hid:0, role: role_};
    const res = await post(JSON.stringify(body_data), 'users/all-polls');
    if(res.action == "success"){
      // setHosts(res.data)
      console.log(res?.data.data_);
      setHosts(res?.data.data_)
      setFiltered(res?.data.data_)
      setUserHosts(res?.data.user_host);
    } else {
        toastMessage(res.data, 'f');
    }
  }

  const do_delete_poll = async () => {
    const body_data = {del:delid};
    const res = await post(JSON.stringify(body_data), 'users/delete-polls');
    if(res.action == "success"){
      toastMessage('Poll information Delete Successfully!', 's');
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
                return item.title !== null && item.title.toLowerCase().includes(q.toLowerCase());
            })
            setHosts(results)
        }else{
          setHosts(filtered)
        }
    }
  }

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">{userrole==1?"ALL":"MY"} POLLS</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 justify-end sm:flex-nowrap">
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
                  <Button variant="primary" className="mr-2 shadow-md" 
                  
                  
                  onClick={()=>
                    {
                      if(userHosts.user_hosts >= userHosts.total_hosts){
                        setPopupAlert(true)
                      } else {
                        navigate("/new/poll")
                      }
                    }
                  }>
                    Add New Poll
                  </Button>
        }
        </div>
        
        {
            showplan &&

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

        {/* BEGIN: Data List */}
        {!showplan &&
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                  <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          HOST/POLL QUESTION
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Rating Style
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          URL
                        </Table.Th>
                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                          STATUS
                        </Table.Th>
                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                          ACTIONS
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                    {
                      hosts.length == 0 &&

                      <Table.Tr className="intro-x">
                        <Table.Td colSpan={5} className=" text-center first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]" style={{color:"red"}}>
                          No information found!
                        </Table.Td>
                      </Table.Tr>
                    }

                      {hosts.map((v:any, i:any) => (
                        
                        <Table.Tr key={i} className="intro-x">
                        
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <a className="font-medium whitespace-nowrap">
                              {v.host_name} <small>(Host)</small>
                            </a>
                            <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {v.title}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {v.rstyle}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <a
                              className="flex items-center mr-3 text-slate-500"
                              href="javascript:;" 
                              onClick={()=>
                                navigate("/"+v.slug)
                              }
                            >
                              <Lucide icon="ExternalLink" className="w-4 h-4 mr-2" />
                              {v.slug}
                            </a>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div
                              className={clsx([
                                "flex items-center justify-center",
                                { "text-success": v.status==1 },
                                { "text-danger": v.status==0 },
                              ])}
                            >
                              <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                              {v.status==1 ? "Active" : "Inactive"}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center justify-center">
                            <Button className="flex items-center" 
                              style={{cursor:"pointer", color:"green"}}
                                  onClick={()=>navigate('/view/poll', {state: {id :v?.id, data:v}})}>
                                <Lucide icon="Tv" className="w-4 h-4 mr-1" />
                                View
                              </Button>
                          {
                          userrole == 0 && 
                          <>
                              <Button className="flex items-center" 
                              style={{cursor:"pointer"}}
                                  onClick={()=>navigate('/new/poll', {state: {id :v?.id, data:v}})}>
                                <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                className="flex items-center text-danger font-normal"
                                onClick={(event:any) => {
                                  event.preventDefault();
                                  setDelID(v.id)
                                  setDeleteConfirmationModal(true);
                                }}
                              >
                                <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                              </Button>
                          </>
                          }
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
        }
        {/* END: Data List */}
        
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
              Do you really want to delete this Poll? <br />
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
              You've reached the limit of adding polls, <br/>
              Upgrade to "Premium Plan" to create unlimited polls.
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
