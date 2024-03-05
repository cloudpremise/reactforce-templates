import { LightningElement, track, api } from 'lwc';
import rfPrototype from '@salesforce/resourceUrl/rfPrototype';
import resources from "@salesforce/resourceUrl/ReactforceAssets";
import callInternalApi from '@salesforce/apex/rfPrototypeCtrl.callInternalApi';
import callSampleInternalApi from '@salesforce/apex/rfPrototypeCtrl.callSampleInternalApi';
import getSessionId from '@salesforce/apex/rfPrototypeCtrl.getSessionId';

export default class Reactforce extends LightningElement {
    @track reactAppUrl;
    @track channel;
    @track iframe;
    @track sessionId;
    @api bundleDomain;
    @api page;

    async connectedCallback() {
        try{
            this.sessionId = await getSessionId();
            let domain = '';
            if(typeof(this.page) === "undefined" || this.page.length <= 0){
                this.page = "home";
            }
            var queryString = '?'+'lwc=1&chunkResources='+rfPrototype+'&cssResources='+rfPrototype+'&page='+this.page+'&domain='+domain;
            // Load the React app URL from the Static Resource
            if(typeof(this.bundleDomain) === "string" && this.bundleDomain.length > 0){
                this.reactAppUrl = this.bundleDomain + "/" + queryString;
            }else{
                this.reactAppUrl = rfPrototype + '/index.html' + queryString + '&landingResources='+rfPrototype + '&resources='+resources;
            }

            this.channel = new MessageChannel();
            this.channel.port1.onmessage = this.handleMessage.bind(this);
        }catch(e){ console.log("error", e.message); }
    }

    handleIframeLoad(evt){
        if(typeof(this.channel) === "undefined" || typeof(this.channel.port2) === "undefined"){
            return;
        }
        var payload = {
            action: "containerSystemMessage",
            sessionId: this.sessionId,
            params: [{
                name: "establishMessageChannel",
                value: "1"
            }]
        }
        this.iframe = evt.target;
        this.iframe.contentWindow.postMessage(JSON.stringify(payload), "*", [this.channel.port2]);        
    }

    handleMessage(evt){
        var eventData = JSON.parse(evt.data);
        var args = eventData.arguments;
        var payload = args.payload;
        if(payload.hasOwnProperty("action") && payload.action === "resize"){
            console.log("v.containerHeight", payload.size.height);
            return;
        }
        var callbackId = payload.callbackId;
        var actionName = "callInternalApi";
        if(payload.hasOwnProperty("action")){
            actionName = payload.action;
        }
        
        try{
            var port1 = this.channel.port1;
            var method = this.findMethod(actionName);
            method(payload.params).then((result) => {
                port1.postMessage(JSON.stringify({ //Send message to react app with data and callback id so that actual callback function is triggered.
                    action: "containerUserMessage",
                    params: [{
                        data: result,
                        callbackId: callbackId
                    }]
                }));
            }).catch(err => {
                console.log("Catch Error", err);
            });
        }catch(e){ 
            console.log("error", e.message); 
        }
    }

    findMethod(actionName){
        var method = callInternalApi;
        switch(actionName){
            case 'callSampleInternalApi':
                method = callSampleInternalApi;
                break;
            case 'login':
                method = login;
                break;
            case 'registerUser':
                method = registerUser;
                break;
            default:
                break;
        }
        return method;
    }
}