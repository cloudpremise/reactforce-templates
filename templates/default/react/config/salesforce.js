const path = require('path');
const fs = require('fs-extra');
let paths = null;
try{
    paths = require('../config/paths');
}catch(e){
    paths = require("react-scripts/config/paths");
}

function copySFResources(){
    const staticResourceName = process.env.REACT_APP_STATIC_RESOURCE_PATH;
    const salesforceDefault = process.env.REACT_APP_SF_REPO_PATH+"force-app/main/default";
    const salesforcePath = path.relative(process.cwd(), path.join(salesforceDefault+"/staticresources/"+staticResourceName));
    // const salesforcePagePath = path.relative(process.cwd(), path.join(salesforceDefault+"/pages/"+paths.sfPublicName));

    // let sfPageContents = fs.readFileSync(salesforcePagePath, "utf8");
    // sfPageContents = sfPageContents.replace(/REACT_APP_BUNDLE_ID/g, () => {return process.env.REACT_APP_BUNDLE_ID;});
    // fs.writeFileSync(salesforcePagePath, sfPageContents);

    // if (fs.existsSync(salesforcePagePath)){
    //   fs.unlinkSync(salesforcePagePath);
    // }
    if (!fs.existsSync(salesforcePath)){
      fs.mkdirSync(salesforcePath);
    }
    fs.emptyDirSync(salesforcePath);
    fs.copySync(paths.appBuild, salesforcePath, {
      dereference: true,
      filter: file => file !== paths.appHtml,
    });
    // fs.copyFileSync(sfPublicPage, salesforcePagePath);
    // if (fs.existsSync(sfPublicPage)){
    //   fs.unlinkSync(sfPublicPage);
    // }
    console.log("Build files copied to salesforce configured package.");
    console.log("");
}

function processMainAppJs(){
    const appMainJs = path.relative(process.cwd(), path.join("./public/app.main.js"));
    const appMainJsTarget = path.relative(process.cwd(), path.join("./public/assets/js/app.main.js"));
    let appMainJsContents = fs.readFileSync(appMainJs, "utf8");
    for(var envName in process.env){
      const envReplaceRegex = "process.env."+envName;
      const envValue = process.env[envName];
      appMainJsContents = appMainJsContents.replace(envReplaceRegex, () => {return envValue});
    }
    fs.writeFileSync(appMainJsTarget, appMainJsContents);
}

module.exports.copySFResources = copySFResources;
module.exports.processMainAppJs = processMainAppJs;