import {useRoutes, Router, Route, useNavigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import SimpleMenu from "../layouts/SimpleMenu";
import TopMenu from "../layouts/TopMenu";
import DashboardOverview1 from "../pages/Dashboard";
import DashboardOverview2 from "../pages/DashboardOverview2";
import DashboardOverview3 from "../pages/DashboardOverview3";
import DashboardOverview4 from "../pages/DashboardOverview4";
import Categories from "../pages/Categories";
import AddProduct from "../pages/AddProduct";
import ProductList from "../pages/ProductList";

import TransactionList from "../pages/TransactionList";
import TransactionDetail from "../pages/TransactionDetail";
import SellerList from "../pages/SellerList";
import SellerDetail from "../pages/SellerDetail";
import Reviews from "../pages/Reviews";
import Inbox from "../pages/Inbox";
import FileManager from "../pages/FileManager";
import PointOfSale from "../pages/PointOfSale";
import Chat from "../pages/Chat";
import Post from "../pages/Post";
import Calendar from "../pages/Calendar";
import CrudDataList from "../pages/CrudDataList";
import CrudForm from "../pages/CrudForm";

import UsersLayout2 from "../pages/UsersLayout2";
import UsersLayout3 from "../pages/UsersLayout3";
import ProfileOverview1 from "../pages/ProfileOverview1";
import ProfileOverview2 from "../pages/ProfileOverview2";
import ProfileOverview3 from "../pages/ProfileOverview3";
import WizardLayout1 from "../pages/WizardLayout1";
import WizardLayout2 from "../pages/WizardLayout2";
import WizardLayout3 from "../pages/WizardLayout3";
import BlogLayout1 from "../pages/BlogLayout1";
import BlogLayout2 from "../pages/BlogLayout2";
import BlogLayout3 from "../pages/BlogLayout3";
import PricingLayout2 from "../pages/PricingLayout2";
import InvoiceLayout1 from "../pages/InvoiceLayout1";
import InvoiceLayout2 from "../pages/InvoiceLayout2";
import FaqLayout1 from "../pages/FaqLayout1";
import FaqLayout2 from "../pages/FaqLayout2";
import FaqLayout3 from "../pages/FaqLayout3";
import ErrorPage from "../pages/ErrorPage";
import ChangePassword from "../pages/ChangePassword";
import RegularTable from "../pages/RegularTable";
import Tabulator from "../pages/Tabulator";
import Modal from "../pages/Modal";
import Slideover from "../pages/Slideover";
import Notification from "../pages/Notification";
import Tab from "../pages/Tab";
import Accordion from "../pages/Accordion";
import Button from "../pages/Button";
import Alert from "../pages/Alert";
import ProgressBar from "../pages/ProgressBar";
import Tooltip from "../pages/Tooltip";
import Dropdown from "../pages/Dropdown";
import Typography from "../pages/Typography";
import Icon from "../pages/Icon";
import LoadingIcon from "../pages/LoadingIcon";
import RegularForm from "../pages/RegularForm";
import Datepicker from "../pages/Datepicker";
import TomSelect from "../pages/TomSelect";
import FileUpload from "../pages/FileUpload";
import WysiwygEditor from "../pages/WysiwygEditor";
import Validation from "../pages/Validation";
import Chart from "../pages/Chart";
import Slider from "../pages/Slider";
import ImageZoom from "../pages/ImageZoom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import UpdateProfile from "../pages/UpdateProfile";
import {useAppDispatch} from "../stores/hooks";
import {setUserData, logout} from "../stores/features/auth/authSlice";
import SubscriptionPlans from "../pages/SubscriptionPlans";
import Payment from "../pages/SubscriptionPlans/payment";
import Invoices from "../pages/Invoices/index";
import InvoiceView from "../pages/Invoices/invoiceDetail";
import SideMenu from "../layouts/SideMenu";
import Hosts from "../pages/Hosts";
import ViewHost from "../pages/Hosts/ViewHost";
import AddHost from "../pages/Hosts/AddHost";
import Polls from "../pages/Polls";
import AddPoll from "../pages/Polls/AddPoll";
import ViewPoll from "../pages/Polls/ViewPoll";
import AddReview from "../pages/Login/AddReview";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";

function Index() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const locaiton = useLocation();
    const [pathNames, setPathNames] = useState(['register','login','reset-password','forget-password']);
    useEffect(() => {
        let locationParam = locaiton.pathname.split('/');
        let userInfo = localStorage.getItem('userInfo');
        // console.log('userInfo',userInfo)
        if (userInfo) {
            let parsed = JSON.parse(userInfo);
            dispatch(setUserData(parsed))
        } else {
            dispatch(logout())
            if(locationParam[1] == "review"){}else {
                if (!pathNames.includes(locationParam[1]))
                navigate('/login')
            }
            
        }
    }, [])
    const routes = [
        {path: "/login/:token?", element: <Login/>,},
        {path: "/register", element: <Register/>,},
        {path: "/forget-password", element: <ForgetPassword/>,},
        {path: "/reset-password/:token", element: <ResetPassword/>,},
        {path: "/review/:slug", element: <AddReview />},
        {
            path: "/",
            element: <SideMenu/>,
            children: [
                {path: "/", element: <Dashboard/>,},
                {path: "/profile", element: <UpdateProfile/>,},
                {path: "/update-profile", element: <UpdateProfile/>,},
                {path: "/subscription-plans", element: <SubscriptionPlans/>},
                {path: "/purchase-plan", element: <Payment/>},
                {path: "/invoices", element: <Invoices/>},
                {path: "/invoice-view", element: <InvoiceView/>},
                {path: "/hosts", element: <Hosts />},
                {path: "/new/host", element: <AddHost />},
                {path: "/polls", element: <Polls />},
                {path: "/new/poll", element: <AddPoll />},
                {path: "/view/poll", element: <ViewPoll />},
                {path: "/view/host/info", element: <ViewHost />},
                {path: "/users", element: <Users />},
                
            ]
        },
    ]
    return useRoutes(routes);
}



export default Index;

// function Router() {
//   const routes = [
//     {
//       path: "/",
//       element: <SideMenu />,
//       children: [
//         {
//           path: "/",
//           element: <DashboardOverview4 />,
//         },
//         {
//           path: "dashboard-overview-2",
//           element: <DashboardOverview2 />,
//         },
//         {
//           path: "dashboard-overview-3",
//           element: <DashboardOverview3 />,
//         },
//         {
//           path: "dashboard-overview-4",
//           element: <DashboardOverview1 />,
//         },
//         {
//           path: "categories",
//           element: <Categories />,
//         },
//         {
//           path: "add-product",
//           element: <AddProduct />,
//         },
//         {
//           path: "product-list",
//           element: <ProductList />,
//         },
//         {
//           path: "product-grid",
//           element: <ProductGrid />,
//         },
//         {
//           path: "transaction-list",
//           element: <TransactionList />,
//         },
//         {
//           path: "transaction-detail",
//           element: <TransactionDetail />,
//         },
//         {
//           path: "seller-list",
//           element: <SellerList />,
//         },
//         {
//           path: "seller-detail",
//           element: <SellerDetail />,
//         },
//         {
//           path: "reviews",
//           element: <Reviews />,
//         },
//         {
//           path: "inbox",
//           element: <Inbox />,
//         },
//         {
//           path: "file-manager",
//           element: <FileManager />,
//         },
//         {
//           path: "point-of-sale",
//           element: <PointOfSale />,
//         },
//         {
//           path: "chat",
//           element: <Chat />,
//         },
//         {
//           path: "post",
//           element: <Post />,
//         },
//         {
//           path: "calendar",
//           element: <Calendar />,
//         },
//         {
//           path: "crud-data-list",
//           element: <CrudDataList />,
//         },
//         {
//           path: "crud-form",
//           element: <CrudForm />,
//         },
//         {
//           path: "users-layout-1",
//           element: <UsersLayout1 />,
//         },
//         {
//           path: "users-layout-2",
//           element: <UsersLayout2 />,
//         },
//         {
//           path: "users-layout-3",
//           element: <UsersLayout3 />,
//         },
//         {
//           path: "profile-overview-1",
//           element: <ProfileOverview1 />,
//         },
//         {
//           path: "profile-overview-2",
//           element: <ProfileOverview2 />,
//         },
//         {
//           path: "profile-overview-3",
//           element: <ProfileOverview3 />,
//         },
//         {
//           path: "wizard-layout-1",
//           element: <WizardLayout1 />,
//         },
//         {
//           path: "wizard-layout-2",
//           element: <WizardLayout2 />,
//         },
//         {
//           path: "wizard-layout-3",
//           element: <WizardLayout3 />,
//         },
//         {
//           path: "blog-layout-1",
//           element: <BlogLayout1 />,
//         },
//         {
//           path: "blog-layout-2",
//           element: <BlogLayout2 />,
//         },
//         {
//           path: "blog-layout-3",
//           element: <BlogLayout3 />,
//         },
//         {
//           path: "pricing-layout-1",
//           element: <PricingLayout1 />,
//         },
//         {
//           path: "pricing-layout-2",
//           element: <PricingLayout2 />,
//         },
//         {
//           path: "invoice-layout-1",
//           element: <InvoiceLayout1 />,
//         },
//         {
//           path: "invoice-layout-2",
//           element: <InvoiceLayout2 />,
//         },
//         {
//           path: "faq-layout-1",
//           element: <FaqLayout1 />,
//         },
//         {
//           path: "faq-layout-2",
//           element: <FaqLayout2 />,
//         },
//         {
//           path: "faq-layout-3",
//           element: <FaqLayout3 />,
//         },
//         {
//           path: "update-profile",
//           element: <UpdateProfile />,
//         },
//         {
//           path: "change-password",
//           element: <ChangePassword />,
//         },
//         {
//           path: "regular-table",
//           element: <RegularTable />,
//         },
//         {
//           path: "tabulator",
//           element: <Tabulator />,
//         },
//         {
//           path: "modal",
//           element: <Modal />,
//         },
//         {
//           path: "slideover",
//           element: <Slideover />,
//         },
//         {
//           path: "notification",
//           element: <Notification />,
//         },
//         {
//           path: "tab",
//           element: <Tab />,
//         },
//         {
//           path: "accordion",
//           element: <Accordion />,
//         },
//         {
//           path: "button",
//           element: <Button />,
//         },
//         {
//           path: "alert",
//           element: <Alert />,
//         },
//         {
//           path: "progress-bar",
//           element: <ProgressBar />,
//         },
//         {
//           path: "tooltip",
//           element: <Tooltip />,
//         },
//         {
//           path: "dropdown",
//           element: <Dropdown />,
//         },
//         {
//           path: "typography",
//           element: <Typography />,
//         },
//         {
//           path: "icon",
//           element: <Icon />,
//         },
//         {
//           path: "loading-icon",
//           element: <LoadingIcon />,
//         },
//         {
//           path: "regular-form",
//           element: <RegularForm />,
//         },
//         {
//           path: "datepicker",
//           element: <Datepicker />,
//         },
//         {
//           path: "tom-select",
//           element: <TomSelect />,
//         },
//         {
//           path: "file-upload",
//           element: <FileUpload />,
//         },
//         {
//           path: "wysiwyg-editor",
//           element: <WysiwygEditor />,
//         },
//         {
//           path: "validation",
//           element: <Validation />,
//         },
//         {
//           path: "chart",
//           element: <Chart />,
//         },
//         {
//           path: "slider",
//           element: <Slider />,
//         },
//         {
//           path: "image-zoom",
//           element: <ImageZoom />,
//         },
//       ],
//     },
//     {
//       path: "/simple-menu",
//       element: <SimpleMenu />,
//       children: [
//         {
//           path: "dashboard-overview-1",
//           element: <DashboardOverview1 />,
//         },
//         {
//           path: "dashboard-overview-2",
//           element: <DashboardOverview2 />,
//         },
//         {
//           path: "dashboard-overview-3",
//           element: <DashboardOverview3 />,
//         },
//         {
//           path: "dashboard-overview-4",
//           element: <DashboardOverview4 />,
//         },
//         {
//           path: "categories",
//           element: <Categories />,
//         },
//         {
//           path: "add-product",
//           element: <AddProduct />,
//         },
//         {
//           path: "product-list",
//           element: <ProductList />,
//         },
//         {
//           path: "product-grid",
//           element: <ProductGrid />,
//         },
//         {
//           path: "transaction-list",
//           element: <TransactionList />,
//         },
//         {
//           path: "transaction-detail",
//           element: <TransactionDetail />,
//         },
//         {
//           path: "seller-list",
//           element: <SellerList />,
//         },
//         {
//           path: "seller-detail",
//           element: <SellerDetail />,
//         },
//         {
//           path: "reviews",
//           element: <Reviews />,
//         },
//         {
//           path: "inbox",
//           element: <Inbox />,
//         },
//         {
//           path: "file-manager",
//           element: <FileManager />,
//         },
//         {
//           path: "point-of-sale",
//           element: <PointOfSale />,
//         },
//         {
//           path: "chat",
//           element: <Chat />,
//         },
//         {
//           path: "post",
//           element: <Post />,
//         },
//         {
//           path: "calendar",
//           element: <Calendar />,
//         },
//         {
//           path: "crud-data-list",
//           element: <CrudDataList />,
//         },
//         {
//           path: "crud-form",
//           element: <CrudForm />,
//         },
//         {
//           path: "users-layout-1",
//           element: <UsersLayout1 />,
//         },
//         {
//           path: "users-layout-2",
//           element: <UsersLayout2 />,
//         },
//         {
//           path: "users-layout-3",
//           element: <UsersLayout3 />,
//         },
//         {
//           path: "profile-overview-1",
//           element: <ProfileOverview1 />,
//         },
//         {
//           path: "profile-overview-2",
//           element: <ProfileOverview2 />,
//         },
//         {
//           path: "profile-overview-3",
//           element: <ProfileOverview3 />,
//         },
//         {
//           path: "wizard-layout-1",
//           element: <WizardLayout1 />,
//         },
//         {
//           path: "wizard-layout-2",
//           element: <WizardLayout2 />,
//         },
//         {
//           path: "wizard-layout-3",
//           element: <WizardLayout3 />,
//         },
//         {
//           path: "blog-layout-1",
//           element: <BlogLayout1 />,
//         },
//         {
//           path: "blog-layout-2",
//           element: <BlogLayout2 />,
//         },
//         {
//           path: "blog-layout-3",
//           element: <BlogLayout3 />,
//         },
//         {
//           path: "pricing-layout-1",
//           element: <PricingLayout1 />,
//         },
//         {
//           path: "pricing-layout-2",
//           element: <PricingLayout2 />,
//         },
//         {
//           path: "invoice-layout-1",
//           element: <InvoiceLayout1 />,
//         },
//         {
//           path: "invoice-layout-2",
//           element: <InvoiceLayout2 />,
//         },
//         {
//           path: "faq-layout-1",
//           element: <FaqLayout1 />,
//         },
//         {
//           path: "faq-layout-2",
//           element: <FaqLayout2 />,
//         },
//         {
//           path: "faq-layout-3",
//           element: <FaqLayout3 />,
//         },
//         {
//           path: "update-profile",
//           element: <UpdateProfile />,
//         },
//         {
//           path: "change-password",
//           element: <ChangePassword />,
//         },
//         {
//           path: "regular-table",
//           element: <RegularTable />,
//         },
//         {
//           path: "tabulator",
//           element: <Tabulator />,
//         },
//         {
//           path: "modal",
//           element: <Modal />,
//         },
//         {
//           path: "slideover",
//           element: <Slideover />,
//         },
//         {
//           path: "notification",
//           element: <Notification />,
//         },
//         {
//           path: "tab",
//           element: <Tab />,
//         },
//         {
//           path: "accordion",
//           element: <Accordion />,
//         },
//         {
//           path: "button",
//           element: <Button />,
//         },
//         {
//           path: "alert",
//           element: <Alert />,
//         },
//         {
//           path: "progress-bar",
//           element: <ProgressBar />,
//         },
//         {
//           path: "tooltip",
//           element: <Tooltip />,
//         },
//         {
//           path: "dropdown",
//           element: <Dropdown />,
//         },
//         {
//           path: "typography",
//           element: <Typography />,
//         },
//         {
//           path: "icon",
//           element: <Icon />,
//         },
//         {
//           path: "loading-icon",
//           element: <LoadingIcon />,
//         },
//         {
//           path: "regular-form",
//           element: <RegularForm />,
//         },
//         {
//           path: "datepicker",
//           element: <Datepicker />,
//         },
//         {
//           path: "tom-select",
//           element: <TomSelect />,
//         },
//         {
//           path: "file-upload",
//           element: <FileUpload />,
//         },
//         {
//           path: "wysiwyg-editor",
//           element: <WysiwygEditor />,
//         },
//         {
//           path: "validation",
//           element: <Validation />,
//         },
//         {
//           path: "chart",
//           element: <Chart />,
//         },
//         {
//           path: "slider",
//           element: <Slider />,
//         },
//         {
//           path: "image-zoom",
//           element: <ImageZoom />,
//         },
//       ],
//     },
//     {
//       path: "/top-menu",
//       element: <TopMenu />,
//       children: [
//         {
//           path: "dashboard-overview-1",
//           element: <DashboardOverview1 />,
//         },
//         {
//           path: "dashboard-overview-2",
//           element: <DashboardOverview2 />,
//         },
//         {
//           path: "dashboard-overview-3",
//           element: <DashboardOverview3 />,
//         },
//         {
//           path: "dashboard-overview-4",
//           element: <DashboardOverview4 />,
//         },
//         {
//           path: "categories",
//           element: <Categories />,
//         },
//         {
//           path: "add-product",
//           element: <AddProduct />,
//         },
//         {
//           path: "product-list",
//           element: <ProductList />,
//         },
//         {
//           path: "product-grid",
//           element: <ProductGrid />,
//         },
//         {
//           path: "transaction-list",
//           element: <TransactionList />,
//         },
//         {
//           path: "transaction-detail",
//           element: <TransactionDetail />,
//         },
//         {
//           path: "seller-list",
//           element: <SellerList />,
//         },
//         {
//           path: "seller-detail",
//           element: <SellerDetail />,
//         },
//         {
//           path: "reviews",
//           element: <Reviews />,
//         },
//         {
//           path: "inbox",
//           element: <Inbox />,
//         },
//         {
//           path: "file-manager",
//           element: <FileManager />,
//         },
//         {
//           path: "point-of-sale",
//           element: <PointOfSale />,
//         },
//         {
//           path: "chat",
//           element: <Chat />,
//         },
//         {
//           path: "post",
//           element: <Post />,
//         },
//         {
//           path: "calendar",
//           element: <Calendar />,
//         },
//         {
//           path: "crud-data-list",
//           element: <CrudDataList />,
//         },
//         {
//           path: "crud-form",
//           element: <CrudForm />,
//         },
//         {
//           path: "users-layout-1",
//           element: <UsersLayout1 />,
//         },
//         {
//           path: "users-layout-2",
//           element: <UsersLayout2 />,
//         },
//         {
//           path: "users-layout-3",
//           element: <UsersLayout3 />,
//         },
//         {
//           path: "profile-overview-1",
//           element: <ProfileOverview1 />,
//         },
//         {
//           path: "profile-overview-2",
//           element: <ProfileOverview2 />,
//         },
//         {
//           path: "profile-overview-3",
//           element: <ProfileOverview3 />,
//         },
//         {
//           path: "wizard-layout-1",
//           element: <WizardLayout1 />,
//         },
//         {
//           path: "wizard-layout-2",
//           element: <WizardLayout2 />,
//         },
//         {
//           path: "wizard-layout-3",
//           element: <WizardLayout3 />,
//         },
//         {
//           path: "blog-layout-1",
//           element: <BlogLayout1 />,
//         },
//         {
//           path: "blog-layout-2",
//           element: <BlogLayout2 />,
//         },
//         {
//           path: "blog-layout-3",
//           element: <BlogLayout3 />,
//         },
//         {
//           path: "pricing-layout-1",
//           element: <PricingLayout1 />,
//         },
//         {
//           path: "pricing-layout-2",
//           element: <PricingLayout2 />,
//         },
//         {
//           path: "invoice-layout-1",
//           element: <InvoiceLayout1 />,
//         },
//         {
//           path: "invoice-layout-2",
//           element: <InvoiceLayout2 />,
//         },
//         {
//           path: "faq-layout-1",
//           element: <FaqLayout1 />,
//         },
//         {
//           path: "faq-layout-2",
//           element: <FaqLayout2 />,
//         },
//         {
//           path: "faq-layout-3",
//           element: <FaqLayout3 />,
//         },
//         {
//           path: "update-profile",
//           element: <UpdateProfile />,
//         },
//         {
//           path: "change-password",
//           element: <ChangePassword />,
//         },
//         {
//           path: "regular-table",
//           element: <RegularTable />,
//         },
//         {
//           path: "tabulator",
//           element: <Tabulator />,
//         },
//         {
//           path: "modal",
//           element: <Modal />,
//         },
//         {
//           path: "slideover",
//           element: <Slideover />,
//         },
//         {
//           path: "notification",
//           element: <Notification />,
//         },
//         {
//           path: "tab",
//           element: <Tab />,
//         },
//         {
//           path: "accordion",
//           element: <Accordion />,
//         },
//         {
//           path: "button",
//           element: <Button />,
//         },
//         {
//           path: "alert",
//           element: <Alert />,
//         },
//         {
//           path: "progress-bar",
//           element: <ProgressBar />,
//         },
//         {
//           path: "tooltip",
//           element: <Tooltip />,
//         },
//         {
//           path: "dropdown",
//           element: <Dropdown />,
//         },
//         {
//           path: "typography",
//           element: <Typography />,
//         },
//         {
//           path: "icon",
//           element: <Icon />,
//         },
//         {
//           path: "loading-icon",
//           element: <LoadingIcon />,
//         },
//         {
//           path: "regular-form",
//           element: <RegularForm />,
//         },
//         {
//           path: "datepicker",
//           element: <Datepicker />,
//         },
//         {
//           path: "tom-select",
//           element: <TomSelect />,
//         },
//         {
//           path: "file-upload",
//           element: <FileUpload />,
//         },
//         {
//           path: "wysiwyg-editor",
//           element: <WysiwygEditor />,
//         },
//         {
//           path: "validation",
//           element: <Validation />,
//         },
//         {
//           path: "chart",
//           element: <Chart />,
//         },
//         {
//           path: "slider",
//           element: <Slider />,
//         },
//         {
//           path: "image-zoom",
//           element: <ImageZoom />,
//         },
//       ],
//     },
//     {
//       path: "/login",
//       element: <Login />,
//     },
//     {
//       path: "/register",
//       element: <Register />,
//     },
//     {
//       path: "/error-page",
//       element: <ErrorPage />,
//     },
//     {
//       path: "*",
//       element: <ErrorPage />,
//     },
//   ];
//
//   return useRoutes(routes);
// }
//
// export default Router;


