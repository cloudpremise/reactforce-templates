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


global with sharing class rfPrototypeLtgCtrl {
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

    public rfPrototypeLtgCtrl(ApexPages.StandardController stdController){
        System.debug('rfPrototypeLtgCtrl(ApexPages.StandardController)');
        this.sobj = stdController.getRecord();
        this.sObjId = stdController.getId();
        bundleDomain = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleDomain')) ? ApexPages.currentPage().getParameters().get('bundleDomain') : bundleDomain;

            
        System.debug('bundleDomain:'+bundleDomain);
        sessionId = rfPrototypeLtgCtrl.getSessionId();

    }
    public rfPrototypeLtgCtrl(){
        System.debug('rfPrototypeLtgCtrl()');
        bundleDomain = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleDomain')) ? ApexPages.currentPage().getParameters().get('bundleDomain') : bundleDomain;

    }

    public PageReference rerenderPage() {
        //This can be called from reactforce - but doesn't seem to trigger the rerender
        //However if needing to call server side logic, this is a good use case
        //check the code in PRIV_SCRUOverride to see the implementation
        //it is based upon having an action function on the hosting vfpage

        System.debug('hello from controllerMethod');
        System.debug('ApexPages.currentPage():'+Apexpages.currentPage());
        //return null;

        Pagereference newLink = new PageReference('/apex/rfPrototypeLtg');
        newLink.setRedirect(true);
        return newLink;
        //return new PageReference('/apex/');
    }

    public static void logControllerInfo(){
        System.debug('rfPrototypeLtgCtrl()');
        // System.debug('M2_PackageUtil.isRunningInNamespace():'+M2_PackageUtil.isRunningInNamespace());
        // System.debug('M2_PackageUtil.isRunningInManagedPackage():'+M2_PackageUtil.isRunningInManagedPackage());
        // System.debug('M2_PackageUtil.getPackageNamespace():'+M2_PackageUtil.getPackageNamespace());
        System.debug('UserInfo.getUserId:'+UserInfo.getUserId());
        System.debug('UserInfo.getProfileId:'+UserInfo.getProfileId());
    }

    @RemoteAction
    @AuraEnabled
    public static String callInternalApi(String method, String requestURI, String requestEntityStr, String params, String headers) {
        System.debug('rfPrototypeCtrl.callInternalApi()');
        System.debug('method:'+method);
        System.debug('requestURI:'+requestURI);
        System.debug('requestEntityStr:'+requestEntityStr);
        System.debug('params:'+params);
        System.debug('headers:'+headers);

        String response = '{"response": "Test Message"}';
        system.debug('callInternalApi response:'+response);
        return response;
    }
}