(function(){
    var reactBundleId = ".reactforce1";
    if(window.inlineApexAdaptor.hasOwnProperty("bundleId") && window.inlineApexAdaptor.bundleId.length > 0){
        var bundleId = window.inlineApexAdaptor.bundleId;
        var bundleNumber = bundleId.replace(/^\D+/g, '');
        var reactBundleNumber = reactBundleId.replace(/^\D+/g, '');
        if(bundleNumber > reactBundleNumber){
            reactBundleId = bundleId;
        }
    }
    var bundleConfig = {
        domain: window.inlineApexAdaptor.landingResources,
        entryPoint: reactBundleId
    };
    loadAssets(bundleConfig);

    function loadAssets(bundleConfig){
        var domain = bundleConfig.domain;
        if(window.inlineApexAdaptor.bundleDomain.length > 0){
            domain = window.inlineApexAdaptor.bundleDomain;
        }
        var reactforceEntryPoint = localStorage.getItem("reactforce_entrypoint");
        localStorage.setItem("reactforce_entrypoint", bundleConfig.entryPoint);
        var cssUrl = domain+"/static/css/main"+bundleConfig.entryPoint+".css";
        var chunkJs = domain+"/static/js/main.chunk"+bundleConfig.entryPoint+".js";
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