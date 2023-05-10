const path = require('path');
const fs = require('fs-extra');
let paths = null;
try{
    paths = require('../config/paths');
}catch(e){
    paths = require("react-scripts/config/paths");
}

function copySFResources(){
    const bundleId = process.env.REACT_APP_VERSION_NUMBER;
    const staticResourceName = "CustomerPortal";
    const salesforceDefault = "../../force-app/main/default";
    // const vfPageName = "rfPrototypeVf.page";
    const salesforcePath = path.relative(process.cwd(), path.join(salesforceDefault+"/staticresources/"+staticResourceName));
    // const salesforcePagePath = path.relative(process.cwd(), path.join(salesforceDefault+"/pages/"+vfPageName));
    // const salesforcePageSamplePath = path.relative(process.cwd(), path.join("./public/visualForce.page"));
    
    // if (fs.existsSync(salesforcePagePath) && fs.existsSync(salesforcePageSamplePath)){
    //     let sfPageContents = fs.readFileSync(salesforcePageSamplePath, "utf8");
    //     sfPageContents = sfPageContents.replace(/REACT_APP_VERSION_NUMBER/g, () => {return process.env.REACT_APP_VERSION_NUMBER;});
    //     fs.writeFileSync(salesforcePagePath, sfPageContents);
    // }

    
    const appMainJs = path.relative(process.cwd(), path.join("./public/assets/js/app.main."+bundleId+".js"));;
    const appMainJsTarget = path.join(paths.appBuild, "assets/js/app.main."+bundleId+".js");
    if(fs.existsSync(appMainJs)){
        if(fs.existsSync(appMainJsTarget)){
            const appMainJsContents = fs.readFileSync(appMainJs, "utf8");
            fs.writeFileSync(appMainJsTarget, appMainJsContents);
        }else{
            fs.copyFileSync(appMainJs, appMainJsTarget);
        }
    }
    
    if (!fs.existsSync(salesforcePath)){
      fs.mkdirSync(salesforcePath);
    }
    fs.emptyDirSync(salesforcePath);
    fs.copySync(paths.appBuild, salesforcePath, {
      dereference: true,
      filter: file => file !== paths.appHtml,
    });
    console.log("Build files copied to salesforce configured package.");
    console.log("");
}

function processMainAppJs(){
    const bundleId = process.env.REACT_APP_VERSION_NUMBER;
    const appMainJs = path.relative(process.cwd(), path.join("./public/app.main.js"));
    const assetsJsPath = path.relative(process.cwd(), path.join("./public/assets/js"));;
    const appMainJsTarget = path.join(assetsJsPath, "/app.main."+bundleId+".js");
    let appMainJsContents = fs.readFileSync(appMainJs, "utf8");
    for(var envName in process.env){
      const envReplaceRegex = "process.env."+envName;
      const envValue = process.env[envName];
      appMainJsContents = appMainJsContents.replace(envReplaceRegex, () => {return envValue});
    }

    const files = fs.readdirSync(assetsJsPath).filter(fn => fn.startsWith('app.main'));
    files.map((file) => {
        const mainJsOldFile = path.join(assetsJsPath, "/"+file);
        fs.unlinkSync(mainJsOldFile);
        return null;
    });

    fs.writeFileSync(appMainJsTarget, appMainJsContents);
}

module.exports.copySFResources = copySFResources;
module.exports.processMainAppJs = processMainAppJs;