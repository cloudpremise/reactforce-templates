public with sharing class rfPrototypeCtrl {
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
    }
    public rfPrototypeCtrl(){
        System.debug('rfPrototypeCtrl()');
        bundleDomain = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleDomain')) ? ApexPages.currentPage().getParameters().get('bundleDomain') : bundleDomain;
        sessionId = rfPrototypeCtrl.getSessionId();
    }

    public PageReference rerenderPage() {
        //This can be called from reactforce - but doesn't seem to trigger the rerender
        //However if needing to call server side logic, this is a good use case
        //check the code in PRIV_SCRUOverride to see the implementation
        //it is based upon having an action function on the hosting vfpage

        System.debug('hello from controllerMethod');
        System.debug('ApexPages.currentPage():'+Apexpages.currentPage());
        //return null;

        Pagereference newLink = new PageReference('/apex/rfPrototypeVf');
        newLink.setRedirect(true);
        return newLink;
        //return new PageReference('/apex/');
    }

    public static void logControllerInfo(){
        //System.debug('rfPrototypeCtrl()');
        // System.debug('M2_PackageUtil.isRunningInNamespace():'+M2_PackageUtil.isRunningInNamespace());
        // System.debug('M2_PackageUtil.isRunningInManagedPackage():'+M2_PackageUtil.isRunningInManagedPackage());
        // System.debug('M2_PackageUtil.getPackageNamespace():'+M2_PackageUtil.getPackageNamespace());
        System.debug('UserInfo.getUserId:'+UserInfo.getUserId());
        System.debug('UserInfo.getProfileId:'+UserInfo.getProfileId());
    }

    @RemoteAction
    public static String callInternalApi(String method, String requestURI, String requestEntityStr, String params, String headers) {
        System.debug('rfPrototypeCtrl.callInternalApi()');
        System.debug('method:'+method);
        System.debug('requestURI:'+requestURI);
        System.debug('requestEntityStr:'+requestEntityStr);
        System.debug('params:'+params);
        System.debug('headers:'+headers);

        String response = '{"response": "Learn about Reactforce here."}';
        system.debug('callInternalApi response:'+response);
        return response;
    }
}