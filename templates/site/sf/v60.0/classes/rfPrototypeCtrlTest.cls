@isTest
private with sharing class rfPrototypeCtrlTest {
    
    @isTest
    private static void testGetSessionId() {
        Test.StartTest();
        String result = rfPrototypeCtrl.getSessionId();
        Test.StopTest();
        System.assertNotEquals(null, result, 'Result should not be empty.');
    }
    
    @isTest
    private static void testrfPrototypeCtrl() {
        List<Account> accounts = createAccount();
        Test.StartTest();
        PageReference pageRef = Page.rfPrototypeVF;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('bundleDomain', String.valueOf(accounts[0].Id));
        ApexPages.StandardController sc = new ApexPages.StandardController(accounts[0]);
        rfPrototypeCtrl instance = new rfPrototypeCtrl(sc);
        instance.developmentMode = false;
        instance.userInterfacePreview = false;
        instance.advancedConfiguration = false;
        Test.StopTest();
        System.assertEquals(String.valueOf(accounts[0].Id), instance.bundleDomain, 'Result should be same.');
    }
    
    @isTest
    private static void testRerenderPage() {
        Test.StartTest();
        rfPrototypeCtrl instance = new rfPrototypeCtrl();
        PageReference result = instance.rerenderPage();
        Test.StopTest();
        System.assertEquals(true, result.getRedirect(), 'The page should be redirected.');
    }
    
    @isTest
    private static void testCallSampleInternalApi() {
        Test.StartTest();
        List<Account> accounts = createAccount();
        String params = '{"sobjecttypename":"Account", "Id":"'+accounts[0].Id+'"}';
        String headers = '{"Content-Type":"application/json;charset=UTF-8"}';
        String result = rfPrototypeCtrl.callSampleInternalApi('GET', '/v1/sobject/Account/', 'requestEntityStr', params, headers);
        Test.StopTest();
        System.assertEquals('{"response": "Learn about Reactforce here.", "result": []}', result, 'Result should be same.');
    }
    
    private static List<Account> createAccount() {
        List<Account> accounts = new List<Account>();
        accounts.add(new Account(Name = 'Test Account'));
        insert accounts;
        return accounts;
    }
}