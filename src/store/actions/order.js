import * as actionTypes from './actionTypes';
import axios from '../../axios';
export const purchaseBurgerSuccess = (id,orderData)=>{
    return {
        type:actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId:id,
        orderData: orderData
    }
};

export const purchaseBurgerFail = (error)=>{
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error:error
    }
};
export const purchaseBurger = (orderData,token)=>{
    return dispatch =>{

        // axios.post( '/orders.json?auth='+token, orderData )
        axios.post('/orders',orderData)
            .then( response => {
                dispatch(purchaseBurgerSuccess(response.data.name,orderData));
            } )
            .catch( error => {
                dispatch(purchaseBurgerFail(error));
            } );
    }
}
export const purchaseBurgerStart = (orderData)=>{
    return{
        type:actionTypes.PURCHASE_BURGER_START
    }
};

export const purchaseInit = ()=>{
    return{
        type:actionTypes.PURCHASE_INIT
    }
};

export const fetchOrderSuccess = (orders)=>{
    return{
        type:actionTypes.FETCH_ORDERS_SUCCESS,
        orders:orders
    }
};
export const fetchOrderFail = (error)=>{
    return{
        type:actionTypes.FETCH_ORDERS_FAIL,
        error:error
    }
};
export const fetchOrderStart = ()=>{
    return{
        type:actionTypes.FETCH_ORDERS_START
    }
};

export const fetchOrders = (token,userId)=>{
    return (dispatch)=>{
        dispatch(fetchOrderStart());
        const queryParams = '?auth='+token+'&orderBy="userId"&equalTo="'+ userId +'"';
        // axios.get('/orders.json'+queryParams)
        axios.get('http://192.168.42.177:3400/api/orders?userId='+userId,{
            headers:{Authorization:"Bearer " + token}
        })
            .then(res => {
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                }
                dispatch(fetchOrderSuccess(fetchedOrders));
            })
            .catch(err => {
                dispatch(fetchOrderFail(err));
            });
    }
}