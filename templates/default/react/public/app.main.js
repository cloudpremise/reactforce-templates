(function(){
    var apexAdapter = function(method, route, data, params, headers, callback){
        let config = { 
            buffer: true, 
            escape: false, 
            timeout: 30000
        }
        try{
            window.inlineApexAdaptor.Visualforce.remoting.Manager.invokeAction(window.inlineApexAdaptor.callInternalApi,
                                                                        method,
                                                                        route,
                                                                        JSON.stringify(data),
                                                                        JSON.stringify(params) || "",
                                                                        JSON.stringify(headers) || "",
                                                                        function(result, event){
                                                                            callback(result, event);
                                                                        },
                                                                        config);        
        } catch (e) {
            console.log('e:',e);
        }
    };

    var cdnUrl = "process.env.REACT_APP_CLOUDFRONT_IMAGES";
    var reactBundleId = "process.env.REACT_APP_BUNDLE_ID";
    var url = "process.env.REACT_APP_REACTFORCE_AWS_ENDPOINTpublic/settings";
    var awsBundleConfig = {
        VfReactPortal: {
            domain: cdnUrl+"/js/react/reactforce-m2-landing-react/build",
            entryPoint: reactBundleId
        },
        VfReactPortalDev: {
            domain: "https://localhost:3000",
            entryPoint: reactBundleId
        }
    };
    loadAssets(awsBundleConfig);

    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function(){
    //     if (this.readyState === 4 && this.status === 200) {
    //         var settings = JSON.parse(this.responseText);
    //         if(settings.config.hasOwnProperty("bundleConfig")){
    //             awsBundleConfig = settings.config.bundleConfig;
    //         }
    //         loadAssets(awsBundleConfig);

    //         if(settings.config.hasOwnProperty("bundleConfig")){
    //             var headers = {};
    //             var method = 'GET';
    //             var route = '/v1/sobject';
    //             var params = {
    //                 "sObjectTypeName": "ApplicationSettings__c"
    //             };
    //             apexAdapter(method, route, {}, params, headers, function(result, event){
    //                 let response = JSON.parse(result);
    //                 if(typeof(response) !== "object" || !response.hasOwnProperty("result")){
    //                     return;
    //                 }
    //                 var settings = response.result[0];
    //                 var orgBundleConfig = {
    //                     VfReactPortal: {
    //                         domain: "",
    //                         entryPoint: ""
    //                     },
    //                     VfReactPortalAWS: {
    //                         domain: "",
    //                         entryPoint: ""
    //                     }
    //                 }
    //                 if(settings.hasOwnProperty("BundleConfiguration__c") && typeof(settings.BundleConfiguration__c) === "string"){
    //                     try{
    //                         orgBundleConfig = JSON.parse(settings.BundleConfiguration__c);
    //                     }catch(e){ console.log(e); }
    //                 }

    //                 orgBundleConfig.VfReactPortal.domain = m2landingAWS.domain;
    //                 orgBundleConfig.VfReactPortal.entryPoint = m2landingAWS.entryPoint;

    //                 var data = {
    //                     sObject: {
    //                         attributes: {
    //                             type: "ApplicationSettings__c"
    //                         },
    //                         Id: settings.Id,
    //                         BundleConfiguration__c: JSON.stringify(orgBundleConfig)
    //                     }
    //                 };
    //                 var route = '/v1/sobject/'+settings.Id;
            
    //                 apexAdapter('PATCH', route, data, {}, headers, function(result, event){
                        
    //                 });
    //             });
    //         }
    //     }
    // };
    // xhr.open("GET", url, true);
    // xhr.send();

    function loadAssets(awsBundleConfig){
        var m2landingAWS = awsBundleConfig.VfReactPortal;
        var domain = m2landingAWS.domain;
        if(window.inlineApexAdaptor.advancedConfiguration === 'false' || window.inlineApexAdaptor.userInterfacePreview === 'false'){
            domain = window.inlineApexAdaptor.landingResources;
        }
        if(window.inlineApexAdaptor.bundleDomain.length > 0){
            domain = window.inlineApexAdaptor.bundleDomain;
        }
        var reactforceEntryPoint = localStorage.getItem("reactforce_entrypoint");
        localStorage.setItem("reactforce_entrypoint", m2landingAWS.entryPoint);
        var cssUrl = domain+"/static/css/main"+m2landingAWS.entryPoint+".css";
        var chunkJs = domain+"/static/js/main.chunk"+m2landingAWS.entryPoint+".js";
        var mainJs = domain+"/static/js/main.bundle"+m2landingAWS.entryPoint+".js";

        var cssElement = document.createElement("link");
        cssElement.setAttribute("href", cssUrl);
        cssElement.setAttribute("rel", "stylesheet");
        document.head.appendChild(cssElement);

        var chunkElement = document.createElement("script");
        chunkElement.setAttribute("type", "text/javascript");
        chunkElement.setAttribute("src", chunkJs);
        document.body.appendChild(chunkElement);

        var mainElement = document.createElement("script");
        mainElement.setAttribute("type", "text/javascript");
        mainElement.setAttribute("src", mainJs);
        mainElement.onload = function(){
            var mainLoader = document.getElementById("main-application-loader");
            if(mainLoader){
                mainLoader.remove();
            }
        };
        document.body.appendChild(mainElement);
        if(reactforceEntryPoint !== null && reactforceEntryPoint === m2landingAWS.entryPoint){
            return;
        }
        var updateExperience = document.getElementById("update-application-experience");
        if(updateExperience){
            updateExperience.style.display = "block";
        }
    }
})();