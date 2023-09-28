(function(){
    var reactBundleId = "process.env.REACT_APP_BUNDLE_ID";
    var splitStaticResources = 'splitStaticResourcesFlag';
    var staticResourceName = "CustomerPortal";
    // if(window.inlineApexAdaptor.hasOwnProperty("bundleId") && window.inlineApexAdaptor.bundleId.length > 0){
    //     var bundleId = window.inlineApexAdaptor.bundleId;
    //     var bundleNumber = bundleId.replace(/^\D+/g, '');
    //     var reactBundleNumber = reactBundleId.replace(/^\D+/g, '');
    //     if(bundleNumber > reactBundleNumber){
    //         reactBundleId = bundleId;
    //     }
    // }
    var bundleConfig = {};
    var urlPathName = window.location.pathname;
    if(typeof(window.inlineApexAdaptor) === "object"){
        bundleConfig = {
            domain: window.inlineApexAdaptor.landingResources,
            chunkDomain: window.inlineApexAdaptor.chunkResources,
            cssDomain: window.inlineApexAdaptor.cssResources,
            assetsDomain: window.inlineApexAdaptor.resources,
            entryPoint: reactBundleId
        };
    }else{
        var resourcePath = urlPathName.replace("/lcc/","");
        var resourceId = resourcePath.replace("/"+staticResourceName+"/index.html", "");
        if(splitStaticResources === 'true'){
            bundleConfig = {
                domain: "/resource/"+resourceId+"/"+staticResourceName,
                chunkDomain: "/resource/"+resourceId+"/"+staticResourceName+"Chunk",
                cssDomain: "/resource/"+resourceId+"/"+staticResourceName+"Css",
                assetsDomain: "/resource/"+resourceId+"/ReactforceAssets",
                entryPoint: reactBundleId
            };
        }else{
            bundleConfig = {
                domain: "/resource/"+resourceId+"/"+staticResourceName,
                chunkDomain: "/resource/"+resourceId+"/"+staticResourceName,
                cssDomain: "/resource/"+resourceId+"/"+staticResourceName,
                assetsDomain: "/resource/"+resourceId+"/ReactforceAssets",
                entryPoint: reactBundleId
            };
        }
    }
    loadAssets(bundleConfig, splitStaticResources);

    function loadAssets(bundleConfig, splitStaticResources){
        var domain = bundleConfig.domain;
        var chunkDomain = bundleConfig.chunkDomain;
        var cssDomain = bundleConfig.cssDomain;
        var assetsDomain = bundleConfig.assetsDomain;
        if(typeof(window.inlineApexAdaptor) !== "undefined" && window.inlineApexAdaptor.bundleDomain.length > 0){
            domain = window.inlineApexAdaptor.bundleDomain;
            chunkDomain = window.inlineApexAdaptor.bundleDomain;
            cssDomain = window.inlineApexAdaptor.bundleDomain;
        }
        var reactforceEntryPoint = localStorage.getItem("reactforce_entrypoint");
        localStorage.setItem("reactforce_entrypoint", bundleConfig.entryPoint);
        var ldsCssUrl = assetsDomain+"/styles/salesforce-lightning-design-system.min.css";
        var cssUrl = cssDomain+"/static/css/main"+bundleConfig.entryPoint+".css";
        var chunkJs = chunkDomain+"/static/js/main.chunk"+bundleConfig.entryPoint+".js";
        if(splitStaticResources === 'true'){
            cssUrl = cssDomain+"/main"+bundleConfig.entryPoint+".css";
            chunkJs = chunkDomain+"/js/main.chunk"+bundleConfig.entryPoint+".js";
        }
        var mainJs = domain+"/static/js/main.bundle"+bundleConfig.entryPoint+".js";

        var ldsCssElement = document.createElement("link");
        ldsCssElement.setAttribute("href", ldsCssUrl);
        ldsCssElement.setAttribute("rel", "stylesheet");
        document.head.appendChild(ldsCssElement);

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