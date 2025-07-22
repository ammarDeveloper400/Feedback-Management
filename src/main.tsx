import ScrollToTop from "./base-components/ScrollToTop";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useRef, useEffect } from "react";

// const [userrole, setUserRole] = useState(0);
// let userInfo = localStorage.getItem('userInfo');
// if (userInfo) {
//     let parsed = JSON.parse(userInfo);
//     setUserRole(parsed?.role);
// }
// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//     <BrowserRouter>
//         {userrole == 1 ? <style>{`.overflow-x-hidden li:last-child { display:none}`}</style>:null}
//         <Provider store={store}>
//             <Router/>
//             <ToastContainer/>
//         </Provider>
//         <ScrollToTop/>
//     </BrowserRouter>
// );

function App() {
  const [userRole, setUserRole] = useState(0);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUserRole(parsed?.role);
    }
  }, [userRole]);

  return (
    <BrowserRouter>
      {userRole == 0 ? (
        <style>{`.overflow-x-hidden li:last-child { display:none !important}`}</style>
      ) : null}
      <Provider store={store}>
        <Router />
        <ToastContainer />
      </Provider>
      <ScrollToTop />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);

