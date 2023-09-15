/***************************************************************************** 
Copyright 2022 CloudPremise LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


global with sharing class rfPrototypeCtrl {
    public SObject sObj {get;set;}
    public Id sObjId {get;set;}

    public Boolean developmentMode {get;set;}
    public String bundleDomain {get;set;}
    public String sessionId {get;set;}
    public Boolean userInterfacePreview {get;set;}
    public Boolean advancedConfiguration {get;set;}

    //@AuraEnabled(Cacheable = true)
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }

    public rfPrototypeCtrl(ApexPages.StandardController stdController){
        System.debug('rfPrototypeCtrl(ApexPages.StandardController)');
        this.sobj = stdController.getRecord();
        this.sObjId = stdController.getId();
        bundleDomain = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleDomain')) ? ApexPages.currentPage().getParameters().get('bundleDomain') : bundleDomain;

            
        System.debug('bundleDomain:'+bundleDomain);
        sessionId = rfPrototypeCtrl.getSessionId();

    }
    public rfPrototypeCtrl(){
        System.debug('rfPrototypeCtrl()');
        bundleDomain = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleDomain')) ? ApexPages.currentPage().getParameters().get('bundleDomain') : bundleDomain;

    }

    public PageReference rerenderPage() {

        System.debug('hello from controllerMethod');
        System.debug('ApexPages.currentPage():'+Apexpages.currentPage());

        Pagereference newLink = new PageReference('/apex/rfPrototypeLtg');
        newLink.setRedirect(true);
        return newLink;
    }

    public static void logControllerInfo(){
        System.debug('rfPrototypeCtrl()');
        System.debug('UserInfo.getUserId:'+UserInfo.getUserId());
        System.debug('UserInfo.getProfileId:'+UserInfo.getProfileId());
    }

    @RemoteAction
    @AuraEnabled
    public static String callInternalApi(String method, String requestURI, String requestEntityStr, String params, String headers) {
        System.debug('ApiInternalEntryCtrl.callInternalApi(method, requestURI, requestEntityStr, params, headers)');
        
        Map<String,String> paramMap = new Map<String,String>();
        paramMap = (Map<String,String>) JSON.deserialize(params, Map<String,String>.Class);
        System.debug('paramMap:'+paramMap);

        Map<String,String> headerMap = new Map<String,String>();
        headerMap = (Map<String,String>) JSON.deserialize(headers, Map<String,String>.Class);
        System.debug('headerMap:'+headerMap);

        /* This code may not exist in the backend.  It needs to be dynamically constructed*/

        Callable handlerClass = null;
        try{
            Type internalHandlerType = Type.forName('ApiInternalEntry.CallableEntryPoint');
            System.debug('internalHandlerType:'+internalHandlerType);

            handlerClass = (Callable) internalHandlerType.newInstance();
            System.debug('handlerClass:'+handlerClass);

        } catch (Exception e){
            throw new CustomException(CustomException.ERROR_TYPE.SERVER_ERROR, String.valueOf(PackageUtil.getPackageNamespace() + ' API is not installed').removeStart(' '));
        }

        Map<String, Object> args = new Map<String, Object>();
        args.put('httpMethod', method);
        args.put('requestUri', requestURI);
        args.put('requestEntityStr', requestEntityStr);
        args.put('params',paramMap);
        args.put('headers',headerMap);

        return JSON.serialize(handlerClass.call('invoke', args));
    }

    @RemoteAction
    @AuraEnabled
    public static String callSampleInternalApi(String method, String requestURI, String requestEntityStr, String params, String headers) {
        System.debug('sfPrototypeAllCtrl.callInternalApi()');
        System.debug('method:'+method);
        System.debug('requestURI:'+requestURI);
        System.debug('requestEntityStr:'+requestEntityStr);
        System.debug('params:'+params);
        System.debug('headers:'+headers);

        String response = '{"response": "Learn about Reactforce here.", "result": []}';
        system.debug('callInternalApi response:'+response);
        return response;
    }
}