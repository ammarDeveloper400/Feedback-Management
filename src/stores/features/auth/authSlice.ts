import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit"
import {RootState} from "../../store";
import {post, postFormData} from "../../service/api";
import {toastMessage} from '../../../utils/helper'

const initialState = {
    "isLoading": false,
    "isError": false,
    "isSuccess": false,
    "isVerifySuccess": false,
    "isVerifySuccessCalled": false,
    "error": '',
    userInfo: null,
    userTokens: null,
    isLoggedIn: false,
}

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: object, thunkAPI) => {
        const body = JSON.stringify(data);
        const res = await post(body, 'auth/register');
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
        // if ("code" in res)
        //     return thunkAPI.rejectWithValue(res.message)
        // else
        //     return res;
    }
)
export const loginUser = createAsyncThunk(
    "auth/login",
    async (data: object, thunkAPI) => {
        const body = JSON.stringify(data);
        const res = await post(body, 'auth/login');
        // console.log(res);
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
        // if(res.action == "error"){
        //     return thunkAPI.rejectWithValue(res.message)
        // }
        // else
            // return res;
    }
)
export const forgetPassword = createAsyncThunk(
    "auth/forgot-password",
    async (data: object, thunkAPI) => {
        const body = JSON.stringify(data);
        const res = await post(body, 'auth/forgot-password');
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
    }
)
export const resetPassword = createAsyncThunk(
    "auth/reset-password",
    async (data: object, thunkAPI) => {
        const body = JSON.stringify(data);
        // console.log(body)
        const res = await post(body, 'auth/reset-password');
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
    }
)
export const verifyEmail = createAsyncThunk(
    "auth/verify-registration-email",
    async (data: object, thunkAPI) => {
        const body = JSON.stringify(data);
        const res = await post(body, 'auth/verify-registration-email');
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
    }
)
export const updateCompanyLogo = createAsyncThunk(
    "users/update-company-logo",
    async (data: any, thunkAPI) => {
        console.log('data', data.get("logo"));
        const res = await postFormData(data, 'users/update-company-logo');
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
    }
)

export const updateCompanyProfile = createAsyncThunk(
    "users/update-company-profile",
    async (data: any, thunkAPI) => {
        const body = JSON.stringify(data);
        const res = await post(body, 'users/update-company-profile');
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
    }
)
export const updatePassword = createAsyncThunk(
    "users/update-password",
    async (data: any, thunkAPI) => {
        const body = JSON.stringify(data);
        const res = await post(body, 'users/update-password');
        // @ts-ignore
        if(res.action == "success"){
            return res;
        }
        else{
            toastMessage(res.data, 'f');
            return;
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            if(action.payload != null){
                state.isLoading = false;
                state.isSuccess = true;
            } else {
                state.isLoading = false;
                // @ts-ignore
                // toastMessage(action.payload, 'f');
                state.isError = true;
                // @ts-ignore
                state.error = action.payload;
            }
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            state.isError = true;
            // @ts-ignore
            state.error = action.payload;
        }).addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            console.log("BILAL COMES HERE");
            console.log(action)
            if(action.payload != null){
                state.isLoading = false;
                state.isSuccess = true;
                // console.log(action.payload.data);
                // return
                localStorage.setItem('userInfo', JSON.stringify(action.payload.data));
                localStorage.setItem('userTokens', JSON.stringify(action.payload.data.token));
                state.userInfo = action.payload.data;
                state.userTokens = action.payload.data.token;
            } else {
                state.isLoading = false;
                state.isError = true;
                // @ts-ignore
                // toastMessage(action.payload, 'f');
                // @ts-ignore
                state.error = action.payload;
            }
            
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            // @ts-ignore
            state.error = action.payload;
        }).addCase(forgetPassword.pending, (state) => {
            state.isLoading = true;
        }).addCase(forgetPassword.fulfilled, (state, action) => {
            if(action.payload != null){
                state.isLoading = false;
                state.isSuccess = true;
            } else {
                state.isLoading = false;
                state.isError = true;
                // @ts-ignore
                // toastMessage(action.payload, 'f');
                // @ts-ignore
                state.error = action.payload;
            }
        }).addCase(forgetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            // @ts-ignore
            state.error = action.payload;
        }).addCase(resetPassword.pending, (state) => {
            state.isLoading = true;
        }).addCase(resetPassword.fulfilled, (state, action) => {
            if(action.payload != null){
                state.isLoading = false;
                state.isSuccess = true;
            } else {
                state.isLoading = false;
                state.isError = true;
                // @ts-ignore
                // toastMessage(action.payload, 'f');
                // @ts-ignore
                state.error = action.payload;
            }
        }).addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            // @ts-ignore
            state.error = action.payload;
        }).addCase(verifyEmail.pending, (state) => {
            state.isLoading = true;
            state.isVerifySuccessCalled = true;
        }).addCase(verifyEmail.fulfilled, (state, action) => {
            console.log(action)
            if(action.payload.action != 'error'){
                state.isLoading = false;
                state.isVerifySuccess = true;
                state.isVerifySuccessCalled = true;
            } else {
                state.isVerifySuccessCalled = false;
                state.isLoading = false;
                state.isError = true;
                toastMessage(action.payload.data, 'f');
                // @ts-ignore
                // toastMessage(action.payload, 'f');
                // @ts-ignore
                state.error = action.payload;
            }
        }).addCase(verifyEmail.rejected, (state, action) => {
            state.isVerifySuccessCalled = true;
            state.isLoading = false;
            state.isError = true;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            // @ts-ignore
            state.error = action.payload;
        }).addCase(updateCompanyLogo.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateCompanyLogo.fulfilled, (state, action) => {
            if(action.payload.action != 'error'){
                state.isLoading = false;
                state.isSuccess = true;
                
                localStorage.setItem('userInfo', JSON.stringify(action.payload.data));
                state.userInfo = action.payload.data;
            } else {
                state.isLoading = false;
                state.isError = true;
                // @ts-ignore
                toastMessage(action.payload.data, 'f');
                // @ts-ignore
                state.error = action.payload;
            }
        }).addCase(updateCompanyLogo.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            // @ts-ignore
            state.error = action.payload;
        }).addCase(updateCompanyProfile.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateCompanyProfile.fulfilled, (state, action) => {
            if(action.payload.action != 'error'){
                state.isLoading = false;
                state.isSuccess = true;
                localStorage.setItem('userInfo', JSON.stringify(action.payload.data));
                state.userInfo = action.payload.data;
            }else {
                state.isLoading = false;
                state.isError = true;
                // @ts-ignore
                toastMessage(action.payload.data, 'f');
                // @ts-ignore
                state.error = action.payload;
            }
        }).addCase(updateCompanyProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            // @ts-ignore
            state.error = action.payload;
        }).addCase(updatePassword.pending, (state) => {
            state.isLoading = true;
        }).addCase(updatePassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
        }).addCase(updatePassword.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            // @ts-ignore
            state.error = action.payload;
        })

    },
    reducers: {
        clearAllStates: () => initialState,
        clearUsedState: (state, action) => {
            return {...initialState, userInfo: state.userInfo,isLoggedIn: state.isLoggedIn}
        },
        setUserData: (state, action) => {
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
            return {...initialState, userInfo: action.payload, isLoggedIn: true}
        },
        logout: () => {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userTokens');
            return initialState;
        },
    }
})
export const authSelector = (state: RootState) => state.authReducer;
export const {clearAllStates, clearUsedState, setUserData, logout} = authSlice.actions
export default authSlice.reducer;




