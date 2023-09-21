import apexAdapter from "./ApexAdapter";
import { translateNamespace } from "./hooks/useApexAdapter";

const ApiHelper = {
    apiType: "standard",
    apexAdapter: function(params, route = '/v1/sobject', method = 'GET', data = {}, headers = {}){
        return new Promise(function(resolve, reject){
            apexAdapter(method, route, data, params, headers, (result, event) =>{
                let response = event;
                if(result !== null){
                    response = JSON.parse(result);
                }
                if(response.hasOwnProperty("statusCode")){
                    event = response;
                }
                if(event.statusCode !== 200 && event.statusCode !== 201){
                    try{
                        response = JSON.parse(event.message);
                    }catch(e){
                        if(event.hasOwnProperty("error")){
                            event['message'] = event.error;
                        }
                        response = {
                            message: event.message
                        }
                    }
                    return reject({
                        statusCode: event.statusCode,
                        ...response
                    });
                }
                if(typeof(response) !== "object" || !response.hasOwnProperty("result")){
                    response = {result: []};
                }
                response.result = translateNamespace(response.result);
                response.statusCode = event.statusCode;
                resolve(response);
            });
        });
    },
};

export default ApiHelper;