import React from 'react';
import './App.css';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import { MemoryRouter } from "react-router-dom";
import { prepareInlineAdapter } from "./ApexAdapter";
import RouterComponent from './components/Router';
import { createBrowserHistory } from "history";
prepareInlineAdapter();

declare const window: Window & typeof globalThis & {
    inlineApexAdaptor: any
}

const history = createBrowserHistory();

function App() {
    function getBaseUrl(){
        if(process.env.NODE_ENV === "test"){
            return "";
        }
        if(typeof(window.inlineApexAdaptor.baseUrl) === 'string' && window.inlineApexAdaptor.baseUrl !== "null"){
            return window.inlineApexAdaptor.baseUrl;
        }
        return "";
    }
    function getSFResourcesPath(){
        if(typeof(window.inlineApexAdaptor) === "undefined" || typeof(window.inlineApexAdaptor.resources) === "undefined"){
            return null;
        }
        return window.inlineApexAdaptor.resources;
    }
    function getCurrentPage(){
        let page = window.location.pathname;
        if(typeof(window.inlineApexAdaptor.page) === 'string' && window.inlineApexAdaptor.page !== "null"){
            page = getBaseUrl()+"/"+window.inlineApexAdaptor.page;
        }
        if(window.inlineApexAdaptor.hasOwnProperty("rte")){
            let returnUrl = window.inlineApexAdaptor.rte;
            returnUrl = returnUrl.replace("System.PageReference[", "");
            returnUrl = returnUrl.replace("]", "");
            returnUrl = returnUrl.split("?")[0];
            returnUrl = returnUrl.replace(/^\/+/g, ''); //Remove leading slash
            if(returnUrl.length > 0){
                page = getBaseUrl()+"/"+returnUrl;
            }
        }
        return page;
    }
    const page = getCurrentPage();
    return (
        <IconSettings iconPath={getSFResourcesPath()+"/assets/icons"} >
            <MemoryRouter initialEntries={[page]} basename={getBaseUrl()}>
                <div className="slds-scope slds-is-relative App" >
                    <div className="main-container" id="global_wrapper">
                        <RouterComponent history={history} basename={getBaseUrl()} page={page} />
                    </div>
                </div>
            </MemoryRouter>
        </IconSettings>
    );
}

export default App;

