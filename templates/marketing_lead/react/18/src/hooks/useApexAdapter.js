import React from "react";
import {ApexAdapter, SampleApexAdapter} from "../ApexAdapter";

const namespace = process.env.REACT_APP_SFDC_NAMESPACE;
const useApexAdapter = (params, justData = false, callBack = null) => {
    const [state, setState] = React.useState({
        loading: false,
        callApi: true,
        RF_LIMIT: 10,
        RF_OFFSET: 0,
        hasMore: false
    });
    let [data, setData] = React.useState(null);
    function getData(){
        let headers = {};
        let method = 'GET';
        let route = '/v1/sobject';
        setAdapterState({
            loading: true,
            callApi: false
        });
        params['RF_OFFSET'] = state.RF_OFFSET;
        if(!params.hasOwnProperty("RF_LIMIT")){
            params['RF_LIMIT'] = state.RF_LIMIT;
        }
        ApexAdapter(method, route, {}, params, headers, (result, event) =>{
            let response = JSON.parse(result);
            if(typeof(response) !== "object" || !response.hasOwnProperty("result")){
                response = {result: []};
            }

            let hasMore = true;
			const newData = translateNamespace(response.result);
            if(newData.length <= 0 || newData.length <= state.RF_LIMIT){
                hasMore = false;
            }
            if(data !== null){
                data = data.concat(newData);
            }else{
                data = newData;
            }
            
            const newState = {
                loading: false,
                callApi: false,
                RF_OFFSET: state.RF_OFFSET,
                hasMore: hasMore
            };
            setAdapterState(newState);
            setData(data);
            if(callBack !== null){
                callBack(data);
            }
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
const useSampleAdapter = (params, justData = false, callBack = null) => {
    const [state, setState] = React.useState({
        loading: false,
        callApi: true,
    });
    let [data, setData] = React.useState({
        response: null
    });
    function getData(){
        let headers = {};
        let method = 'GET';
        let route = '/v1/sobject';
        setAdapterState({
            loading: true,
            callApi: false
        });
        SampleApexAdapter(method, route, {}, params, headers, (result, event) =>{
            let data = JSON.parse(result);
            
            const newState = {
                loading: false,
                callApi: false,
            };
            setAdapterState(newState);
            setData(data);
            if(callBack !== null){
                callBack(data);
            }
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

export { useApexAdapter, translateNamespace, useSampleAdapter };

export default useApexAdapter;