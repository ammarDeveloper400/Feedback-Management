import _, { over } from "lodash";
import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Litepicker from "../../base-components/Litepicker";
import ReportDonutChart from "../../components/ReportDonutChart";
import ReportLineChart from "../../components/ReportLineChart";
import ReportPieChart from "../../components/ReportPieChart";
import ReportDonutChart1 from "../../components/ReportDonutChart1";
import SimpleLineChart1 from "../../components/SimpleLineChart1";
import LeafletMap from "../../components/LeafletMap";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import {useAppDispatch, useAppSelector} from "../../stores/hooks/redux-hooks";
import {loginUser, authSelector, verifyEmail, clearUsedState, clearAllStates} from "../../stores/features/auth/authSlice";
import {toastMessage} from "../../utils/helper";
import LoadingIcon from "../../base-components/LoadingIcon";
import {post, postFormData} from "../../stores/service/api";
import {urls} from "../../utils/baseurl";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import TomSelect from "../../base-components/TomSelect";
import "./../Login/rating.css";
import { saveAs } from 'file-saver';


function Main() {
  // const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(authSelector);
  const [salesReportFilter, setSalesReportFilter] = useState<string>();
  const importantNotesRef = useRef<TinySliderElement>();
  const [loading, setLoading] = useState<any | null>(true);
  const final_image = urls.image;
  const [top, setTop] = useState<any | null>([])
  const [startrating, setStarRating] = useState<any | null>([])
  const [dataslider, setdataSlider] = useState<any | null>([]);
  const [hosts, setHosts] = useState<any | null>([]);
  const [hostid, setHostID] = useState<any | null>(-1);

  const [pollsdata, setPollsData] = useState<any | null>([]);
  const [pollid, setPollID] = useState<any | null>(-1);
  const [tablehost, setTableHost] = useState<any | null>([]);
  const [overall, setOverall] = useState<any | null>(-1);
  const params = useLocation();
  const [namehost, setNameHost] = useState<any | null>(null);
  const [linechartbottom, setLineChartBottom] = useState<any | null>([])
  const [datachart, setDataChart] = useState<any | null>([])
  const [userplan, setUserPlan] = useState<any | null>(false);
  const [suggestions, setSuggestions] = useState<any | null>([])
  const [userrole, setUserRole] = useState(0);

  const [userstats, setUserStats] = useState<any | null>([]);
  const [userbottom, setUserBottom] = useState<any | null>([])

  const [earningstats, setEarningStats] = useState<any | null>([]);
  const [earningbottom, setEarningBottom] = useState<any | null>([])

  const [totaluserscount, setTotalusercount] = useState<any | null>(0);
  const [totalearnings, setTotalEarnings] = useState<any | null>(0);

  const [btnloading, setBtnLoading] = useState<any | null>(false);

  

  useEffect(() => {

    let userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            let parsed = JSON.parse(userInfo);
            setUserRole(parsed?.role);
            if(parsed.plan != 0 && parsed?.role == 0){
              setUserPlan(true);

              if (params.state?.hID) {
                setHostsData(parsed?.role, 0)
                setHostID(params?.state?.hID)
                setNameHost(params?.state.nhost)
                do_get_review(params.state?.hID)
                polls_data(params.state?.hID)
              } else {
                // if(hosts.length > 0){
                  setHostsData(parsed?.role, 1)
                  setHostID(-1)
                  setNameHost(null)
                  polls_data(hostid, parsed?.role)
                // }
              }
            } else {
              if(parsed?.role == 1){
                setUserPlan(true);
                
                if (params.state?.hID) {
                  setHostsData(parsed?.role, 0)
                  setHostID(params?.state?.hID)
                  setNameHost(params?.state.nhost)
                  do_get_review(params.state?.hID)
                  polls_data(params.state?.hID, parsed?.role)
                } else {
                  setHostsData(parsed?.role, 1)
                  setHostID(-1)
                  setNameHost(null)
                  polls_data(hostid, parsed?.role)
                }
              } else {
                setUserPlan(false);
              }
            }
        } 
    
}, [params]);

const setHostsData = async (role_:any = 0, get_data:any) => {
  const body_data = {role: role_};
  const res = await post(JSON.stringify(body_data), 'users/all-hosts');
  if(res.action == "success"){
    setHosts(res?.data.data_)
    if(res?.data.data_ .length > 0){
      if(get_data == 1) {
        do_get_review(hostid)
      }
      polls_data(hostid, role_)
    }
    setLoading(false)
  } else {
      toastMessage(res.data, 'f');
  }
}
const polls_data = async (hid:any, role_:any = 0) => {
  const body_data = {hid:hid, role: role_};
  const res = await post(JSON.stringify(body_data), 'users/all-polls');
  if(res.action == "success"){
    setPollsData(res?.data.data_)
    setLoading(false)
  } else {
      toastMessage(res.data, 'f');
  }
}
const do_get_review = async (val:any, monthly:any=-1, poll_:any=-1) => {
    setdataSlider([])
    setTotalusercount(0)
    setTotalEarnings(0)
    setLineChartBottom([])
    setUserStats([])
    setUserBottom([])
    setEarningStats([])
    setTableHost([])
    setEarningBottom([])
    setSuggestions([])
    setLoading(true);
    const body_data = {vid:val, monthly:monthly, pollID:poll_==""?-1:poll_};
    // console.log(body_data)
    const res = await post(JSON.stringify(body_data), 'dashboard');
    if(res.action == "success"){
      // console.log(res)
        setTotalusercount(res?.data.total_users)
        setTotalEarnings(res?.data.total_earnings)
        setTop(res?.data.top_array);
        setdataSlider(res?.data.star_ratin)
        setTableHost(res?.data.total_list)
        setLineChartBottom(res?.data.bottom_list)
        setDataChart(res?.data.overalldata)
        setSuggestions(res?.data.feedbacks_data)
        setUserStats(res?.data.userstats)
        setUserBottom(res?.data.userbottom)
        setEarningStats(res?.data.earningstats)
        setEarningBottom(res?.data.earningbottom)
        setLoading(false);
    } else {
        toastMessage(res.data, 'f');
        setLoading(false);
    }
}

const do_update_monthly = async (val:any) => {
    setOverall(val);
    do_get_review(hostid, val, pollid)
}

const do_check_host_data = async (val:any) => {
    if(val == -1){
      do_get_review(val, overall, -1)
      polls_data(val, userrole)
    }
    else {
      do_get_review(val)
      polls_data(val, userrole)
    } 
}

const createCSV = async () => {
  setLoading(true);
  const body_data = {csv: 1};
  
  const res = await post(JSON.stringify(body_data), 'createcsvdata');
  if(res.action == "success"){
      const csvContent = convertToCSV(res?.data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'urizone_feedbacks.csv');
      setLoading(false);
  } else {
      toastMessage(res.data, 'f');
      setLoading(false);
  }
}

function convertToCSV(array: string[][]) {
  let csvContent: string = "";

  array.forEach(row => {
      let rowContent: string = row.map(cell => {
          // Check if a cell contains comma, double quotes, or newlines
          if (/[\s,"]/.test(cell)) {
              // If yes, escape it by surrounding with double quotes and double any double quotes inside
              return '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
      }).join(",");
      csvContent += rowContent + "\n";
  });

  return csvContent;
}





  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}

          <>

          
          <div className="col-span-12 mt-8">
        {
            params.state?.hID ? 
            <h2 className="text-lg font-medium   mt-8 uppercase col-span-12">
              {namehost} -::- statistics
            </h2>
            :
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                GENERAL REPORT
              </h2>
            </div> 
          }
           
            <div className="grid grid-cols-12 gap-6 mt-5">
              {
              !params.state?.hID &&
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
                          icon="Box"
                          className="w-[28px] h-[28px] text-primary"
                        />
                      
                      </div>
                      <div className="mt-6 text-3xl font-medium leading-8">
                        {top?.total_hosts?top?.total_hosts:0}
                      </div>
                      <div className="mt-1 text-base text-slate-500">
                        Hosts
                      </div>
                    </div>
                  </div>
                </div>
              }
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
                        icon="Box"
                        className="w-[28px] h-[28px] text-pending"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {top?.total_polls?top?.total_polls:0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Polls
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
                        icon="Star"
                        className="w-[28px] h-[28px] text-warning"
                      />
                     
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {top?.feedbacks?top?.feedbacks:0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Feedbacks
                    </div>
                  </div>
                </div>
              </div>
            
            </div>
          </div>
          </>
          {/* END: General Report */}
          {/* BEGIN: Sales Report */}
          
          
     
        </div>
      </div>
      
      {
        userrole == 1 &&
        <>
        {
        (userplan && hosts.length > 0) &&
          <>
            <div className="col-span-12 mt-5 flex items-center custom_flex_column" style={{justifyContent:"space-between"}}>
                <div className="flex items-center gap-2 custom_wrap_c" >
                  <Button className="primary" variant={overall==-1?"primary":"secondary"} onClick={()=>do_update_monthly(-1)}>
                    Overall
                  </Button>
                  <Button className="primary" variant={overall==1?"primary":"secondary"} onClick={()=>do_update_monthly(1)}>
                    Last Week
                  </Button>
                  <Button className="primary" variant={overall==2?"primary":"secondary"} onClick={()=>do_update_monthly(2)}>
                    Last Month
                  </Button>
                  <Button className="primary" variant={overall==3?"primary":"secondary"} onClick={()=>do_update_monthly(3)}>
                    Last 3 Month
                  </Button>
                  <Button className="primary" variant={overall==4?"primary":"secondary"} onClick={()=>do_update_monthly(4)}>
                    Last 6 Month
                  </Button>
                </div>
            </div>
          </>
        }

        {
        (userplan && hosts.length > 0 && userbottom.length > 0 && !params.state) &&
          <div className="col-span-12 mt-0 lg:col-span-12">

                <div className="grid grid-cols-12 gap-6 mb-10">
              
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
                            className="w-[28px] h-[28px] text-pending"
                          />
                        </div>
                        <div className="mt-6 text-3xl font-medium leading-8">
                        {totaluserscount}
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
                            icon="DollarSign"
                            className="w-[28px] h-[28px] text-warning"
                          />
                        
                        </div>
                        <div className="mt-6 text-3xl font-medium leading-8">
                          {totalearnings}
                        </div>
                        <div className="mt-1 text-base text-slate-500">
                          Total Earnings
                        </div>
                      </div>
                    </div>
                  </div>
                
                </div>
               
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                  <div className="items-center block h-10 intro-y sm:flex">
                    <h2 className="mr-5 text-lg font-medium">
                      USERS STATISTICS 
                    </h2>
                    
                  </div>


              


                {
                  userstats.length > 0 &&
                  (
                    <ReportLineChart legends={true} height={275} className="mt-6 -mb-6" lab={userbottom} dataarray={userstats} />
                  )
                }
              </div>
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                <div className="items-center block h-10 intro-y sm:flex">
                    <h2 className="mr-5 text-lg font-medium">
                      TOTAL EARNINGS 
                    </h2>
                    
                  </div>
                {
                  earningstats.length > 0 &&
                  (
                    <ReportLineChart legends={true} height={275} className="mt-6 -mb-6" lab={earningbottom} dataarray={earningstats} />
                  )
                }
              </div>
          </div>
        }
        </>
      }

      





      {/* IF ROLE IS 0 & NOT ADMIN */}


      {
        (userplan && hosts.length > 0) &&
              <div className="col-span-12 mt-5 flex items-center custom_flex_column" style={userrole == 1?{justifyContent:"flex-end"}:{justifyContent:"space-between"}}>
                {
                  userrole == 0 &&
                
                    <div className="flex items-center gap-2 custom_wrap_c" >
                      <Button className="primary" variant={overall==-1?"primary":"secondary"} onClick={()=>do_update_monthly(-1)}>
                        Overall
                      </Button>
                      <Button className="primary" variant={overall==1?"primary":"secondary"} onClick={()=>do_update_monthly(1)}>
                        Last Week
                      </Button>
                      <Button className="primary" variant={overall==2?"primary":"secondary"} onClick={()=>do_update_monthly(2)}>
                        Last Month
                      </Button>
                      <Button className="primary" variant={overall==3?"primary":"secondary"} onClick={()=>do_update_monthly(3)}>
                        Last 3 Month
                      </Button>
                      <Button className="primary" variant={overall==4?"primary":"secondary"} onClick={()=>do_update_monthly(4)}>
                        Last 6 Month
                      </Button>
                    </div>
                  }
                  <div className="flex items-center gap-3 w-1/3  custom_full_width"  style={{justifyContent:params.state?.hID ?"flex-end":"space-between"}}>
                    {
                    params.state?.hID ? null :
                      <div className="w-1/2 float-right">
                          <label>Filter (Hosts)</label>
                          <TomSelect
                            value={hostid}
                            name={"name"}
                            //@ts-ignore
                            onChange={(vv) => 
                              {
                                setHostID(vv)
                                // do_check_host_data(vv)
                                do_get_review(vv)
                                // console.log("BILALLLLl"+vv)
                                polls_data(vv, userrole)
                                
                              }
                            } 
                            options={{placeholder: "Host"}} 
                            className="w-full bg-white "
                          >
                            <option value={-1}>All</option>
                            {hosts.map((v:any, i:any) => (
                              <option value={v.id}>{v.name}</option>
                            ))}
                          </TomSelect>
                        </div>
                    }

                        <div className="w-1/2 float-right">
                          <label>Filter (Polls)</label>
                          <TomSelect
                            value={pollid}
                            name={"poll"}
                            //@ts-ignore
                            onChange={(vv) => 
                              {
                                setPollID(vv)
                                do_get_review(hostid, overall, vv)
                              }
                            } 
                            options={{placeholder: "Polls"}} 
                            className="w-full bg-white "
                          >
                            <option value={-1}>All</option>
                            {
                            hostid != -1 &&
                            pollsdata.map((v:any, i:any) => (
                              <option value={v.id}>{v.title}</option>
                            ))
                            
                            }
                          </TomSelect>
                        </div>
                    </div>
              </div>
       }
              <div className="col-span-12 mt-8 lg:col-span-7">
                
       {
         (userplan && hosts.length > 0) &&
                  <div className="items-center block h-10 intro-y sm:flex">
                    <h2 className="mr-5 text-lg font-medium truncate">
                      OVERALL REPORT
                    </h2>
                    
                  </div>
      }
      {
         (userplan && hosts.length > 0) &&
                  <div className="p-5 mt-12 intro-y box sm:mt-5">
                  
                    <div
                      className={clsx([
                        "relative",
                        "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                        "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                      ])}
                    >
                      {
                        linechartbottom.length > 0 &&
                    
                      <ReportLineChart legends={false} height={275} className="mt-6 -mb-6" lab={linechartbottom} dataarray={datachart} />
                    }
                    </div>
                  </div>
      }
                  </div>
                  {
         (userplan && hosts.length > 0) &&
                  <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-5">
                  <div className="flex items-center h-10 intro-y">
                    <h2 className="mr-5 text-lg font-medium truncate">
                      STAR RATING
                    </h2>
                  </div>
                  <div className="p-5 mt-5 intro-y box">
                    <div className="mt-3">
                      {dataslider.length != 0 &&
                          <ReportPieChart height={180} sliderdata={dataslider} />
                      }
                    </div>
                    <div className="mx-auto mt-8 w-52 sm:w-auto">
                      <div className="flex items-center">
                        <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                        <span className="truncate">5 stars</span>
                        <span className="ml-auto font-medium">{dataslider[2]}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                        <span className="truncate">4 stars</span>
                        <span className="ml-auto font-medium">{dataslider[1]}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                        <span className="truncate">1-3 stars</span>
                        <span className="ml-auto font-medium">{dataslider[0]}</span>
                      </div>
                    </div>
                  </div>
                  </div>
}
       
          {/* END: Weekly Top Seller */}

            

       {/* BEGIN: Data List */}
        {
        (tablehost.length > 0 && !params.state?.hID) &&
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible bg-white">
                  <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                         HOST NAME
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          POLLS
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          FEEDBACKS
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          5 Stars
                        </Table.Th>
                        <Table.Th className=" border-b-0 whitespace-nowrap">
                          4 Stars
                        </Table.Th>
                        <Table.Th className=" border-b-0 whitespace-nowrap">
                          3 Stars
                        </Table.Th>
                        <Table.Th className=" border-b-0 whitespace-nowrap">
                          2 Stars
                        </Table.Th>
                        <Table.Th className=" border-b-0 whitespace-nowrap">
                          1 Stars
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>

                      {tablehost.map((v:any, i:any) => (
                        
                        <Table.Tr key={i} className="intro-x">
                        
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {v.host_name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {v.polls}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {v.total_polls}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {v.start5}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {v.start4}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {v.start3}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {v.start2}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {v.start1}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
        }
        {/* END: Data List */}

        {/* BEGIN: Data List */}
        {suggestions.length > 0 &&
        <div className="col-span-12 ">
                <h2 className=" text-lg font-medium uppercase mb-5 flex justify-between">
                  <span>User Feedback & Suggestions</span>
                  <Button className="primary" disabled={loading} variant={overall==-1?"primary":"secondary"} onClick={()=>createCSV()}>
                    {loading?"Downloading....":"Download CSV"}
                  </Button>
                </h2>
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible bg-white">
                  
                  <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Host Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Poll Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Email
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Rating
                        </Table.Th>
                        <Table.Th className=" border-b-0 whitespace-nowrap">
                          Suggestion/Feedback
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>

                      {suggestions.map((v:any, i:any) => (
                        
                        <Table.Tr key={i} className="intro-x">
                        
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {v.host_name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {v.poll_name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {v.name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {v.email}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {v.rating} Star
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-[35%]">
                          {v.comment}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
                </div>
        }
        {/* END: Data List */}

    
    </div>
  );
}

export default Main;
