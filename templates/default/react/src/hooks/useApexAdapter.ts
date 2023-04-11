import React from "react";
import apexAdapter from "../ApexAdapter";

const namespace: any = process.env.REACT_APP_SFDC_NAMESPACE;
const useApexAdapter = (params: any, justData = false, callBack: Function = () => {}) => {
    const [state, setState] = React.useState({
        loading: false,
        callApi: true,
        response: null
    });
    let [data, setData] = React.useState<any>({
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
        apexAdapter(method, route, {}, params, headers, (result: any, event: any) =>{
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
    function setAdapterState(newState: any){
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

function translateNamespace(data: any){
    let newData: any = {};
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

export { useApexAdapter, translateNamespace };

export default useApexAdapter;