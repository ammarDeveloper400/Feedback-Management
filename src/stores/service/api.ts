import axios from './axios'
import {toastMessage} from "../../utils/helper";

export const post = async (data: any, endpoint: any) => {
    // @ts-ignore
    let  token = '';
    let userTokens = localStorage.getItem('userTokens');
    if(userTokens){
        let parsed = JSON.parse(userTokens);
        token = parsed;
        
        const jsonObject = JSON.parse(data);
        jsonObject.token = token;
        const dataabc = JSON.stringify(jsonObject);
        data = dataabc
    }
    // console.log("SUBSCRIPT")
    // console.log(data);

    try {
        const requestBody = {
            url: endpoint,
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },

        };
        // console.log('requestBody ', requestBody);
        const result = await axios(requestBody);
        // console.log('result', result.data);
        return result.data;

    } catch (error) {
        return toastMessage('Something went wrong while connecting with server!', 'f');
        // @ts-ignore
        console.log('error', error.response.data);
        // @ts-ignore
        return error.response.data;
    }
};
export const postFormData = async (data: any, endpoint: any) => {
    let token = localStorage.getItem('userTokens');
    // @ts-ignore
    let parsed = JSON.parse(token);
    // console.log('parsedparsedparsedparsed', parsed);
    try {
        const requestBody = {
            url: endpoint,
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + parsed,
            },
        };
        console.log('requestBody ', requestBody);
        const result = await axios(requestBody);
        console.log('result', result.data);
        return result.data;

    } catch (error) {
        // @ts-ignore
        // console.log('error', error.response.data);
        return toastMessage('Something went wrong while connecting with server!', 'f');
        // @ts-ignore
        // return error.response.data;
    }
};
export const get = async (endpoint: any) => {
    // @ts-ignore
    let  token = '';
    let userTokens = localStorage.getItem('userTokens');
    if(userTokens){
        let parsed = JSON.parse(userTokens);
        // token = parsed.access.token;
        token = parsed;
    }

    try {
        const requestBody = {
            url: endpoint,
            method: 'get',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },

        };
        // console.log('requestBody ', requestBody);
        const result = await axios(requestBody);
        // console.log('result', result.data);
        return result.data;

    } catch (error) {
        // @ts-ignore
        // console.log('error', error.response.data);
        return toastMessage('Something went wrong while connecting with server!', 'f');
        // @ts-ignore
        // return error.response.data;
    }
};
