(function(){
    var reactBundleId = "process.env.REACT_APP_BUNDLE_ID";
    var splitStaticResources = 'splitStaticResourcesFlag';
    // if(window.inlineApexAdaptor.hasOwnProperty("bundleId") && window.inlineApexAdaptor.bundleId.length > 0){
    //     var bundleId = window.inlineApexAdaptor.bundleId;
    //     var bundleNumber = bundleId.replace(/^\D+/g, '');
    //     var reactBundleNumber = reactBundleId.replace(/^\D+/g, '');
    //     if(bundleNumber > reactBundleNumber){
    //         reactBundleId = bundleId;
    //     }
    // }
    var bundleConfig = {};
    if(splitStaticResources === 'true'){
        var urlPathName = window.location.pathname;
        var staticResourceName = "CustomerPortal";
        if(urlPathName.indexOf("index.html") !== -1){
            var resourcePath = urlPathName.replace("/lcc/","");
            var resourceId = resourcePath.replace("/"+staticResourceName+"/index.html", "");
            bundleConfig = {
                domain: "/resource/"+resourceId+"/"+staticResourceName,
                chunkDomain: "/resource/"+resourceId+"/"+staticResourceName+"Chunk",
                cssDomain: "/resource/"+resourceId+"/"+staticResourceName+"Css",
                entryPoint: reactBundleId
            };
        }else{
            bundleConfig = {
                domain: window.inlineApexAdaptor.landingResources,
                chunkDomain: window.inlineApexAdaptor.chunkResources,
                cssDomain: window.inlineApexAdaptor.cssResources,
                entryPoint: reactBundleId
            };
        }
    }else{
        bundleConfig = {
            domain: window.inlineApexAdaptor.landingResources,
            chunkDomain: window.inlineApexAdaptor.landingResources,
            cssDomain: window.inlineApexAdaptor.landingResources,
            entryPoint: reactBundleId
        };
    }
    loadAssets(bundleConfig);

    function loadAssets(bundleConfig){
        var domain = bundleConfig.domain;
        var chunkDomain = bundleConfig.chunkDomain;
        var cssDomain = bundleConfig.cssDomain;
        if(typeof(window.window.inlineApexAdaptor) !== "undefined" && window.inlineApexAdaptor.bundleDomain.length > 0){
            domain = window.inlineApexAdaptor.bundleDomain;
            chunkDomain = window.inlineApexAdaptor.bundleDomain;
            cssDomain = window.inlineApexAdaptor.bundleDomain;
        }
        var reactforceEntryPoint = localStorage.getItem("reactforce_entrypoint");
        localStorage.setItem("reactforce_entrypoint", bundleConfig.entryPoint);
        var cssUrl = cssDomain+"/main"+bundleConfig.entryPoint+".css";
        var chunkJs = chunkDomain+"/js/main.chunk"+bundleConfig.entryPoint+".js";
        var mainJs = domain+"/static/js/main.bundle"+bundleConfig.entryPoint+".js";

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
        if(reactforceEntryPoint !== null && reactforceEntryPoint === bundleConfig.entryPoint){
            return;
        }
        var updateExperience = document.getElementById("update-application-experience");
        if(updateExperience){
            updateExperience.style.display = "block";
        }
    }
})();