// @ts-nocheck
import Table from "../../base-components/Table";
import {useEffect, useState} from "react";
import {CSDTFDS} from "../../utils/helper";
import Lucide from "../../base-components/Lucide";
import {useNavigate} from "react-router-dom"
import {get, post} from "../../stores/service/api";
import {toastMessage} from "../../utils/helper";


function Main() {
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();
    const [userrole, setUserRole] = useState(0);

    useEffect(() => {
        let userInfo = localStorage.getItem('userInfo');
        // console.log('userInfo',userInfo)
        if (userInfo) {
            let parsed = JSON.parse(userInfo);
            setUserRole(parsed?.role);
            getData(parsed?.role);
        }
    }, [])

    const getData = async (role_:any = 0) => {
        const body_data = {amount: 0, role: role_};
        const res = await post(JSON.stringify(body_data), 'payments/payment-history');
        if(res.action == "success"){
            setInvoices(res.data)
        } else {
            toastMessage(res.data, 'f');
        }
        // const res = await post('payments/payment-history');
        // if ("code" in res)
        //     setInvoices([])
        // else
        //     setInvoices(res.invoices)
    }
    const viewInvoice = (invoice: any) => {
        navigate('/invoice-view', {state: {invoice:invoice}})
    }
    return (
        <>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="col-span-12 intro-y lg:col-span-12">
                    <div className="mt-5 intro-y box">

                        <div className="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60">
                            <h2 className="mr-auto text-base font-medium">
                                Invoices
                            </h2>
                        </div>
                        <div className="p-5">
                            <div className="overflow-x-auto">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="whitespace-nowrap">#</Table.Th>
                                            <Table.Th className="whitespace-nowrap">
                                                Plan Name
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap">
                                                Amount
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap">
                                                No of Polls
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap">
                                                No of Feedbacks
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap">
                                                No of Hosts
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap">
                                                Date
                                            </Table.Th>
                                            <Table.Th className="whitespace-nowrap">
                                                Actions
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {
                                            invoices.map((item, index) => {
                                                return (
                                                    <Table.Tr>
                                                        <Table.Td className="whitespace-nowrap">{index+1}</Table.Td>
                                                        <Table.Td className="whitespace-nowrap">
                                                            {item.name}
                                                        </Table.Td>
                                                        <Table.Td className="whitespace-nowrap">
                                                            ${item.amount / 100}
                                                        </Table.Td>
                                                        <Table.Td className="whitespace-nowrap">
                                                            {item.polls}
                                                        </Table.Td>
                                                        <Table.Td className="whitespace-nowrap">
                                                            {item.feedbacks==-1?"Unlimited":item.feedbacks}
                                                        </Table.Td>
                                                        <Table.Td className="whitespace-nowrap">
                                                            {item.hosts}
                                                        </Table.Td>
                                                        <Table.Td className="whitespace-nowrap">
                                                            {CSDTFDS(item.createdAt)}
                                                        </Table.Td>
                                                        <Table.Td className="whitespace-nowrap">
                                                            <div className="flex items-center mr-3" style={{cursor:"pointer"}}
                                                               onClick={() => viewInvoice(item)}>
                                                                <Lucide icon="Eye" className="w-4 h-4 mr-1"/>{" "}View
                                                            </div>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )
                                            })
                                        }
                                    </Table.Tbody>
                                </Table>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
