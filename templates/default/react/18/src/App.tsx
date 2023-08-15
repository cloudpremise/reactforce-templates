import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useSampleAdapter } from "./hooks/useApexAdapter";
import { prepareInlineAdapter } from "./ApexAdapter";
prepareInlineAdapter();

declare const window: Window & typeof globalThis & {
    inlineApexAdaptor: any
}

function App() {
    const [loading, data] = useSampleAdapter({});
    function getBaseUrl(){
        if(process.env.NODE_ENV === "development"){
            return "";
        }
        return (window.hasOwnProperty('inlineApexAdaptor') ? window.inlineApexAdaptor.landingResources+'/': '');
    }
    return (
        <div className="App">
            <header className="App-header" style={{paddingTop: "100px"}}>
                <img style={{maxWidth: "400px"}} src={getBaseUrl()+logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <p className="slds-m-top_medium">
                    {
                        loading === false && data.response !== null ?
                            <a href="https://cloudpremise.gitbook.io/reactforce/" rel="noreferrer" target="_blank" className="slds-text-heading_small slds-text-color_destructive">
                                {data.response}
                            </a>
                        :
                            null
                    }
                </p>
            </header>
        </div>
    );
}

export default App;

