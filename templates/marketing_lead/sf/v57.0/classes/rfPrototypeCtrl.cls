global without sharing class rfPrototypeCtrl {
    public SObject sObj {get;set;}
    public Id sObjId {get;set;}

    public Boolean developmentMode {get;set;}
    public String bundleDomain {get;set;}
    public String bundleId {get;set;}
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
        this.checkBundleId();
    }
    public rfPrototypeCtrl(){
        System.debug('rfPrototypeCtrl()');
        bundleDomain = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleDomain')) ? ApexPages.currentPage().getParameters().get('bundleDomain') : bundleDomain;
        sessionId = rfPrototypeCtrl.getSessionId();
        this.checkBundleId();
    }

    private void checkBundleId(){
        bundleId = '.reactforce1';
        bundleId = String.isNotBlank(ApexPages.currentPage().getParameters().get('bundleId')) ? ApexPages.currentPage().getParameters().get('bundleId') : bundleId;
        System.debug('bundleId:'+bundleId);
    }

    public PageReference rerenderPage() {
        System.debug('hello from controllerMethod');
        System.debug('ApexPages.currentPage():'+Apexpages.currentPage());

        Pagereference newLink = new PageReference('/apex/rfPrototypeVf');
        newLink.setRedirect(true);
        return newLink;
    }

    public static void logControllerInfo(){
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
            throw new rfPrototypeCtrlException('API is not installed');
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

    @RemoteAction
    @AuraEnabled
    global Static ProcessingResult createLead(String firstName, String lastName, String email, String company){
        System.debug('createLead()');

        ProcessingResult resultObj = new ProcessingResult();
        resultObj.isSuccess = false;
        try {
            Lead lead = new Lead();
            lead.FirstName = firstName;
            lead.LastName = lastName;
            lead.Email = email;
            lead.Company = company;
            insert lead;

            resultObj.isSuccess = true;
            resultObj.result = 'Success';
    	} catch(Exception e){
    		resultObj.result = 'Error - '+e.getMessage();
    	}
        return resultObj;
    }
    
    global class ProcessingResult {
    	public Boolean isSuccess {get;set;}
    	public String result {get;set;}
        public string email {get;set;}
        public string startURL {get;set;}
        public string userId {get;set;}
        public string identifier {get;set;}
        // public PageReference pageReference {get;set;}
    }

    public class rfPrototypeCtrlException extends Exception{}
}