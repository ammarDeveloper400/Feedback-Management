import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit"
import {RootState} from "../../store";
import {post, postFormData, get} from "../../service/api";
import {toastMessage} from '../../../utils/helper'

const initialState = {
    "isLoading": false,
    "isError": false,
    "isSuccess": false,
    "error": '',
    subscriptionPlans:[]
}

export const getPlans = createAsyncThunk(
    "plans",
    async (data: object, thunkAPI) => {
        const res = await get( 'plans/');
        if ("code" in res)
            return thunkAPI.rejectWithValue(res.message)
        else
            return res;
    }
)

const plansSlice = createSlice({
    name: 'plans',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getPlans.pending, (state) => {
            console.log('pending')
            state.isLoading = true;
        }).addCase(getPlans.fulfilled, (state, action) => {
            console.log('action',action)
            state.isLoading = false;
            state.isSuccess = true;
            state.subscriptionPlans = action.payload.plans;
        }).addCase(getPlans.rejected, (state, action) => {
            console.log('rejected',action)
            state.isLoading = false;
            // @ts-ignore
            toastMessage(action.payload, 'f');
            state.isError = true;
            // @ts-ignore
            state.error = action.payload;
        });
    },
    reducers: {
        clearAllStates: () => initialState,
    }
})
export const plansSelector = (state: RootState) => state.plansReducer;
export const {clearAllStates} = plansSlice.actions
export default plansSlice.reducer;




