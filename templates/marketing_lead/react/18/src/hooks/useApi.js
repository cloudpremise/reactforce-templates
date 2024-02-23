import React from "react";
import axios from "axios";

const namespace = process.env.REACT_APP_SFDC_NAMESPACE;
const useApi = (url, params, justData = false, callBack = null, callApi = true) => {
    const [state, setState] = React.useState({
        loading: false,
        callApi: callApi,
        RF_LIMIT: 10,
        RF_OFFSET: 0,
        hasMore: false,
        errors: null
    });
    let [data, setData] = React.useState(null);
    function getData(){
        let headers = {
            'Authorization': "Bearer "+window.inlineApexAdaptor.sessionId,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        let route = '/services/data/v60.0'+url;
        setAdapterState({
            loading: true,
            callApi: false,
            errors: null
        });
        params['RF_OFFSET'] = state.RF_OFFSET;
        if(!params.hasOwnProperty("RF_LIMIT")){
            params['RF_LIMIT'] = state.RF_LIMIT;
        }
        axios({
            url: route,
            method: "GET",
            headers: headers,
            // cancelToken: cancelTokenSource.token
        }).then(res => {
            const data = res.data;
            const newState = {
                loading: false,
                callApi: false,
                RF_OFFSET: state.RF_OFFSET,
                hasMore: false,
                errors: null
            };
            setAdapterState(newState);
            setData(data);
            if(callBack !== null){
                callBack(data);
            }
        }).catch(err => {
            setAdapterState({
                loading: false,
                callApi: false,
                RF_OFFSET: state.RF_OFFSET,
                hasMore: false,
                errors: err.response.data
            });
        });
    }

    React.useEffect(() => {
        if(!state.callApi){
            return;
        }
        getData();
    });

    if(justData){
        return [data];
    }
    function setAdapterState(newState){
        newState = {
            ...state,
            ...newState
        };
        setState(newState);
    }
    if(callBack !== null){
        return [ state.loading, state, setAdapterState ];
    }
    return [ state.loading, data, state, setAdapterState ];
}

function translateNamespace(data){
    let newData = {};
    if(typeof(data) === "object"){
        if(Array.isArray(data)){
            newData = [];
            data.map((item) => {
                newData.push(translateNamespace(item));
                return null;
            });
        }else{
            newData = {};
            for(var key in data){
                const newKey = key.replace(namespace, "");
                newData[newKey] = translateNamespace(data[key]);
            }
        }
        return newData;
    }    
    return data;
}

export { useApi, translateNamespace };

export default useApi;