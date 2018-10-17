import * as actionTypes from './actionTypes';
import axios from '../../axios';
import qs from 'qs';
import {config} from '../../shared/config'
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};
export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
};
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000);
    }
}
// export const  auth = (email,password,isSignup)=>{
//     return dispatch =>{
//         dispatch(authStart());
//         const authData={
//             email:email,
//             password:password,
//             returnSecureToken:true
//         };
//         let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyB5NMRWfJxGAofVnN8pgjJSanD4vufA4F8';
//         if(!isSignup){
//             url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyB5NMRWfJxGAofVnN8pgjJSanD4vufA4F8';
//         };
//         axios.post(url,authData)
//             .then(response=>{
//                 const expirationDate = new Date(new Date().getTime()+response.data.expiresIn*1000);
//                 localStorage.setItem('token',response.data.idToken);
//                 localStorage.setItem('expirationDate',expirationDate);
//                 localStorage.setItem('userId',response.data.localId);
//                 dispatch(authSuccess(response.data.idToken,response.data.localId));
//                 dispatch(checkAuthTimeout(response.data.expiresIn));
//             })
//             .catch(err=>{
//                 //console.log(err);
//                 dispatch(authFail(err.response.data.error))
//             })
//     }
// };
export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            username: email,
            password: password,
            returnSecureToken: true
        };
        let url = '';
        if (isSignup) {
            url = '/signup';
            axios.post(url, qs.stringify(authData),{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
                .then(response => {
                    dispatch(authSignUpSuccess());
                    console.log(response);
                })
                .catch(err => {
                    dispatch(authSignUpFail());
                    console.log(err);
                })
        }
        else {
            url = '/token';
            authData.client_id = config.client.clientId;
            authData.client_secret = config.client.clientSecret;
            authData.grant_type = 'password';
            axios.post(url, authData)
                .then(response => {
                    console.log(response);
                    const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                    localStorage.setItem('token', response.data.idToken);
                    localStorage.setItem('expirationDate', expirationDate);
                    localStorage.setItem('userId', response.data.localId);
                    dispatch(authSuccess(response.data.idToken, response.data.localId));
                    dispatch(checkAuthTimeout(response.data.expiresIn));
                })
                .catch(err => {
                    //console.log(err);
                    dispatch(authFail(err.response.data.error))
                })
        }

    }
};
export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }

        }
    }
};
export const authSignUpSuccess = ()=>{
    return{
        type:actionTypes.AUTH_SIGNUP_SUCCESS
    }
}
export const authSignUpFail = ()=>{
    return{
        type:actionTypes.AUTH_SIGNUP_FAIL
    }
}
