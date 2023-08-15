/*global inlineApexAdaptor */
import LCC from "lightning-container";

let ApexAdapter = (method, route, data, params, headers, callback) => {
    let config = { 
        buffer: true, 
        escape: false, 
        timeout: 30000
    }
    try{

        inlineApexAdaptor.Visualforce.remoting.Manager.invokeAction(inlineApexAdaptor.callInternalApi,
                                                                    method,
                                                                    route,
                                                                    JSON.stringify(data),
                                                                    JSON.stringify(params) || "",
                                                                    JSON.stringify(headers) || "",
                                                                    (result, event) =>{
                                                                        callback(result, event);
                                                                    },
                                                                    config);        
    } catch (e) {
        console.log('e:',e);
    }
};
const getParam = (name) => {
    return decodeURI(
        (RegExp(name+"=(.+?)(&|$)").exec(window.location.search)||['',null])[1]
    );
};
const prepareInlineAdapter = () => {
    let callbacks = {};
    var sessionId = LCC.getRESTAPISessionKey();
    if(typeof(window.inlineApexAdaptor) !== 'undefined' && (!sessionId || sessionId === "null" || sessionId.length <= 0)){
        return null;
    }

    window.inlineApexAdaptor = {
        'Visualforce': {
            'remoting': {
                'Manager': {
                    'invokeAction': function(remoteAction, method, route, data, params, headers, callback){
                        const callbackId = Math.random().toString(36).substr(2, 9); //Generate random identity for callback function avoid any conflict with multiple calls.
                        callbacks[callbackId] = callback; //Register callback with callback id so that we know which callback function to call when we receive response from controller.
                        let remoteActionArray = remoteAction.split(".");
                        let action = remoteAction;
                        if(remoteActionArray.length > 1){
                            action = remoteActionArray[1];
                        }
                        LCC.sendMessage({ //Send message to controller to call action.
                            action: action,
                            params: {
                                method: method,
                                requestURI: route,
                                requestEntityStr: data,
                                params: params,
                                headers: headers,
                            },
                            callbackId: callbackId
                        });
                    }
                }
            }
        },
        'callInternalApi': 'c.callInternalApi',
        'callSampleInternalApi': 'c.callSampleInternalApi',
        'resources': decodeURIComponent(getParam("resources")), //For app icons hosted in static resources.
        'landingResources': decodeURIComponent(getParam("landingResources")), //For app assets other than icons.
        'page': getParam("page"), //Page received through lightning container url.
        'sessionId': sessionId,
        'bundleDomain': getParam("bundleDomain"),
    };

    console.log("Inline Apex Adapter", window.inlineApexAdaptor);

    LCC.addMessageHandler((response) => { //Listen for messages received from controller and call appropriate callback function registered during initial call.
        const data = response.data;
        const callbackId = response.callbackId;
        callbacks[callbackId](data);
        delete callbacks[callbackId];
    });
};

const getSessionId = () => {
    var sessionId = LCC.getRESTAPISessionKey();
    if(typeof(window.inlineApexAdaptor) !== 'undefined'){
        return window.inlineApexAdaptor.sessionId;
    }
    return sessionId;
};

let SampleApexAdapter = (method, route, data, params, headers, callback) => {
    let config = { 
        buffer: true, 
        escape: false, 
        timeout: 30000
    }
    try{

        inlineApexAdaptor.Visualforce.remoting.Manager.invokeAction(inlineApexAdaptor.callSampleInternalApi,
                                                                    method,
                                                                    route,
                                                                    JSON.stringify(data),
                                                                    JSON.stringify(params) || "",
                                                                    JSON.stringify(headers) || "",
                                                                    (result, event) =>{
                                                                        callback(result, event);
                                                                    },
                                                                    config);        
    } catch (e) {
        console.log('e:',e);
    }
};

export { ApexAdapter, prepareInlineAdapter, getSessionId, SampleApexAdapter };

export default ApexAdapter;