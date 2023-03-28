public with sharing class rfPrototypeLtgCtrl {
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
        // bundleDomain = 'https://37ba-2400-adc5-10c-ac00-58d9-25f6-9d6d-aa90.ngrok.io';

        // if(Mogli_ApplicationSettings.getInstance().isAdvancedConfiguration() && Mogli_ApplicationSettings.getInstance().isUserInterfacePreview()){

        //     BundleConfiguration m2Config = (BundleConfiguration) JSON.deserialize(Mogli_ApplicationSettings.getInstance().bundleConfiguration(), BundleConfiguration.class);
        //     System.debug('m2Config:'+m2Config);
            
        //     developmentMode = ApexPages.currentPage().getParameters().get('devMode') == '1' ? true : false;
        //     bundleDomain = ApexPages.currentPage().getParameters().get('bundleDomain');
        //     bundleName = ApexPages.currentPage().getParameters().get('bundleName');

        //     if(String.isBlank(bundleDomain)){
        //         bundleDomain = 'https://assets-main.mogli.technology/js/react/mogli-m2-landing-react/build';
        //     } else {
        //         bundleDomain = m2Config.M2_Landing.domain;
        //         bundleName = m2Config.M2_Landing.entryPoint;
        //     }
        //     System.debug('bundleDomain:'+bundleDomain);
        //     System.debug('bundleName:'+bundleName);

        //     System.debug('what?:'+m2Config);
        //     sessionId = rfPrototypeLtgCtrl.getSessionId();
        //     if(developmentMode){
        //         logControllerInfo();
        //         System.debug('this:'+this);
        //     }
        // }
    }
    public rfPrototypeLtgCtrl(){
        System.debug('rfPrototypeLtgCtrl()');
        // developmentMode = ApexPages.currentPage().getParameters().get('devMode') == '1' ? true : false;
        bundleDomain = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleDomain')) ? ApexPages.currentPage().getParameters().get('bundleDomain') : bundleDomain;
        sessionId = rfPrototypeLtgCtrl.getSessionId();
        // bundleDomain = 'https://37ba-2400-adc5-10c-ac00-58d9-25f6-9d6d-aa90.ngrok.io';
        
        // if(Mogli_ApplicationSettings.getInstance().isAdvancedConfiguration() && Mogli_ApplicationSettings.getInstance().isUserInterfacePreview()){


            // if(String.isNotBlank(Mogli_ApplicationSettings.getInstance().bundleConfiguration())){
            //     bundleConfig = Mogli_ApplicationSettings.getInstance().bundleConfiguration();
            //     BundleConfiguration m2Config = (BundleConfiguration) JSON.deserialize(bundleConfig, BundleConfiguration.class);
            //     System.debug('m2Config:'+m2Config);
            //     bundleConfiguration = String.valueOf(m2Config.M2_Landing);
            //     System.debug('bundleConfiguration from settings:'+bundleConfiguration);
            //     bundleDomain = m2Config.M2_Landing.domain;
            //     entryPoint = m2Config.M2_Landing.entryPoint;
            //     System.debug('settings for bundleDomain:'+bundleDomain);
            //     System.debug('settings for entryPoint:'+entryPoint);
            // }
            // advancedConfiguration = Mogli_ApplicationSettings.getInstance().isAdvancedConfiguration();
            // userInterfacePreview = Mogli_ApplicationSettings.getInstance().isUserInterfacePreview();
            //entryPoint = String.isNotBlank(ApexPages.currentPage().getParameters().get('entryPoint')) ? ApexPages.currentPage().getParameters().get('entryPoint') : entryPoint;
            // System.debug('param for developmentMode:'+developmentMode);
            // System.debug('param for bundleDomain:'+bundleDomain);
            //System.debug('param for entryPoint:'+entryPoint);


            //if(String.isBlank(bundleDomain)){
              //  bundleDomain = 'https://assets-main.mogli.technology/js/react/mogli-m2-landing-react/buildHARDCODE';
            //} //else {
                //bundleDomain = m2Config.M2_Landing.domain;
                //bundleName = m2Config.M2_Landing.domain;

                //bundleName = '123';//m2Config.M2_Landing.domain;  ?why is this returning null to the vf page!!!
            //}
            // System.debug('bundleDomain:'+bundleDomain);
            // System.debug('bundleConfiguration:'+bundleConfiguration);
            //System.debug('entryPoint:'+entryPoint);
            
            // if(developmentMode){
            //     logControllerInfo();
            //     System.debug('this:'+this);
            // }            
        // }
    }

    public PageReference rerenderPage() {
        //This can be called from reactforce - but doesn't seem to trigger the rerender
        //However if needing to call server side logic, this is a good use case
        //check the code in PRIV_SCRUOverride to see the implementation
        //it is based upon having an action function on the hosting vfpage

        System.debug('hello from controllerMethod');
        System.debug('ApexPages.currentPage():'+Apexpages.currentPage());
        //return null;

        Pagereference newLink = new PageReference('/apex/vfReactPortalLanding');
        newLink.setRedirect(true);
        return newLink;
        //return new PageReference('/apex/');
    }

    public static void logControllerInfo(){
        System.debug('rfPrototypeLtgCtrl()');
        System.debug('M2_PackageUtil.isRunningInNamespace():'+M2_PackageUtil.isRunningInNamespace());
        System.debug('M2_PackageUtil.isRunningInManagedPackage():'+M2_PackageUtil.isRunningInManagedPackage());
        System.debug('M2_PackageUtil.getPackageNamespace():'+M2_PackageUtil.getPackageNamespace());
        System.debug('UserInfo.getUserId:'+UserInfo.getUserId());
        System.debug('UserInfo.getProfileId:'+UserInfo.getProfileId());
    }

    @RemoteAction
    public static String callInternalApi(String method, String requestURI, String requestEntityStr, String params, String headers) {
        System.debug('rfPrototypeLtgCtrl.callInternalApi()');
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