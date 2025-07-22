import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import {useEffect, useState} from "react";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const userRole = localStorage.getItem('userInfo');
if(userRole) {
  let parsed = JSON.parse(userRole);
  var isAdmin = parsed?.role;
}
else {
  isAdmin = 0;
}

const final_admin = isAdmin;

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: ""
    },
    {
      icon: "Activity",
      title: "Update profile",
      pathname: "profile"
    },
    {
      icon: "Box",
      title: "Hosts",
      pathname: "hosts"
    },
    {
      icon: "Star",
      title: "Polls",
      pathname: "polls"
    },
    {
      icon: "CreditCard",
      title: "Subscription Plans",
      pathname: "subscription-plans"
    },
    {
      icon: "Video",
      title: "How to use this app",
      pathname: "https://www.youtube.com"
    },
    {
      icon: "Zap",
      title: "Invoices",
      pathname: "invoices"
    },
    {
      icon: "User", 
      title: "Manage Users", 
      pathname: "users"
    }
    
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
