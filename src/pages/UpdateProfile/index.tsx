// @ts-nocheck
import {useEffect, useState} from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import {
    FormInput,
    FormLabel,
    FormSelect,
    FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import TomSelect from "../../base-components/TomSelect";
import {Menu} from "../../base-components/Headless";
import UpdateConpanyProfile from "./update-company-info";
import UpdatePassword from "./update-password";
import {useAppSelector} from "../../stores/hooks/redux-hooks";
import {authSelector, clearUsedState} from "../../stores/features/auth/authSlice";
import {toastMessage} from "../../utils/helper";
import {urls} from "../../utils/baseurl";

function UpdateCompanyInfo() {
    const auth = useAppSelector(authSelector);
    const [select, setSelect] = useState("1");
    const [tab, setTab] = useState(1);
    const final_image = urls.image;
    const changeTab = (tab:number) => {
        setTab(tab);
    }

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Update Profile</h2>
            </div>
            <div className="grid grid-cols-12 gap-6">
                {/* BEGIN: Profile Menu */}
                <div className="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
                    <div className="mt-5 intro-y box">
                        <div className="relative flex items-center p-5">
                            <div className="w-12 h-12 image-fit">
                                <img
                                    alt={auth?.userInfo?.companyName}
                                    className="rounded-full"
                                    src={final_image+auth?.userInfo?.logo}
                                />
                            </div>
                            <div className="ml-4 mr-auto">
                                <div className="text-base font-medium">
                                    {auth?.userInfo?.companyName}
                                </div>
                                <div className="text-slate-500">{auth?.userInfo?.userName}</div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">

                            <a onClick={() => changeTab(1)}
                               className={'flex items-center' + (tab == 1 ? ' font-medium text-primary' : '')}
                               style={{cursor: 'pointer'}}>
                                <Lucide icon="Activity" className="w-4 h-4 mr-2"/> Company
                                Information
                            </a>

                            <a onClick={() => changeTab(2)}
                               className={'flex items-center mt-5' + (tab == 2 ? ' font-medium text-primary' : '')}
                               style={{cursor: 'pointer'}}>
                                <Lucide icon="Lock" className="w-4 h-4 mr-2"/> Change Password
                            </a>

                        </div>
                        <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">

                        </div>
                    </div>
                </div>
                {/* END: Profile Menu */}
                <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
                    {
                        (tab==1)? <UpdateConpanyProfile/>:<UpdatePassword/>
                    }
                </div>
            </div>
        </>
    );
}

export default UpdateCompanyInfo;
