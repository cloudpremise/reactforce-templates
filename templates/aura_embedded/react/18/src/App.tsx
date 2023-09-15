import React from 'react';
import './App.css';
import { prepareInlineAdapter } from "./ApexAdapter";
prepareInlineAdapter();

declare const window: Window & typeof globalThis & {
    inlineApexAdaptor: any
}

function App() {
    return (
        <div className="App">
            <div className="slds-p-horizontal_medium">
                <div className="slds-text-heading_small slds-m-bottom_medium">
                    <h2 className="slds-text-heading_large slds-m-bottom_medium">Congratulations</h2>
                    <p>This is your new Page {window.inlineApexAdaptor.recordId}</p>
                </div>
            </div>
        </div>
    );
}

export default App;

