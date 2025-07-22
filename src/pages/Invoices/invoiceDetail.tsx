// @ts-nocheck
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import {useEffect, useState, useRef} from "react";
import {CSDTFDS} from "../../utils/helper";
import {useLocation, useNavigate} from "react-router-dom";
import ReactToPrint from 'react-to-print';
function Main() {
    const [invoice,setInvoice] = useState( {});
    const {state} = useLocation();
    const navigate = useNavigate();
    const componentRef = useRef();
    useEffect(() => {
        if (state != null && state.invoice) {
            console.log('state.invoice',state.invoice)
            setInvoice(state.invoice)
        } else {
            navigate('/invoices');
        }
    }, []);
    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium"></h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <ReactToPrint
                        trigger={() => <Button variant="primary" className="mr-2 shadow-md">Print</Button>}
                        content={() => componentRef.current}
                    />

                </div>
            </div>
            {/* BEGIN: Invoice */}
            <div ref={componentRef} className="mt-5 overflow-hidden intro-y box">
                <div className="text-center border-b border-slate-200/60 dark:border-darkmode-400 sm:text-left">
                    <div className="px-5 py-10 sm:px-20 sm:py-20" style={{paddingTop:'2rem',paddingBottom:'3rem'}}>
                        <div className="text-3xl font-semibold text-primary">INVOICE</div>
                        <div className="mt-2">
                            Receipt <span className="font-medium">#URI{invoice?.invoice_number}</span>
                        </div>
                        <div className="mt-1">{CSDTFDS(invoice.date,'MMMM DD, YYYY')}</div>
                    </div>
                    <div className="flex flex-col px-5 pb-10 lg:flex-row sm:px-20 sm:pb-20">
                        <div>
                            <div className="text-base text-slate-500">Client Details</div>
                            <div className="mt-2 text-lg font-medium text-primary">
                                {invoice?.companyName}
                            </div>
                            <div className="mt-1"> {invoice?.email}</div>
                            <div className="mt-1">
                                {invoice?.address}
                            </div>
                        </div>
                        <div className="mt-10 lg:text-right lg:mt-0 lg:ml-auto">
                            <div className="text-base text-slate-500">Payment to</div>
                            <div className="mt-2 text-lg font-medium text-primary">
                                Urizon-Feedback
                            </div>
                            <div className="mt-1">billing@urizonfeedback.com</div>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-10 sm:px-16 sm:py-20" style={{paddingTop:'2rem'}}>
                    <div className="overflow-x-auto">
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th className="border-b-2 dark:border-darkmode-400 whitespace-nowrap">
                                        PLAN NAME
                                    </Table.Th>
                                    <Table.Th className="text-right border-b-2 dark:border-darkmode-400 whitespace-nowrap">
                                        QTY
                                    </Table.Th>
                                    <Table.Th className="text-right border-b-2 dark:border-darkmode-400 whitespace-nowrap">
                                        PRICE
                                    </Table.Th>
                                    <Table.Th className="text-right border-b-2 dark:border-darkmode-400 whitespace-nowrap">
                                        SUBTOTAL
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td className="border-b dark:border-darkmode-400">
                                        <div className="font-medium whitespace-nowrap">
                                            {invoice?.name}
                                        </div>
                                        <div className="text-slate-500 text-sm mt-0.5 whitespace-nowrap">
                                            Regular License
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="w-32 text-right border-b dark:border-darkmode-400">
                                        1
                                    </Table.Td>
                                    <Table.Td className="w-32 text-right border-b dark:border-darkmode-400">
                                        ${invoice?.amount/100}
                                    </Table.Td>
                                    <Table.Td className="w-32 font-medium text-right border-b dark:border-darkmode-400">
                                        ${invoice?.amount/100}
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </div>
                </div>
                <div className="flex flex-col-reverse px-5 pb-10 sm:px-20 sm:pb-20 sm:flex-row" style={{paddingTop:'0rem',paddingBottom:'3rem'}}>
                    <div className="text-center sm:text-right sm:ml-auto">
                        <div className="text-base text-slate-500">Total Amount</div>
                        <div className="mt-2 text-xl font-medium text-primary">
                            ${invoice?.amount/100}
                        </div>
                        <div className="mt-1">Taxes included</div>
                    </div>
                </div>
            </div>
            {/* END: Invoice */}
        </>
    );
}

export default Main;
