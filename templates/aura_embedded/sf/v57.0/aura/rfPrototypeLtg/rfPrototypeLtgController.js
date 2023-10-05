({
    doInit : function(component, event, helper) {
        setTimeout(function(){
            var containerSrc = $A.get('$Resource.rfPrototypeLtg')+'/index.html';
            var data = {
                'resources': $A.get('$Resource.ReactforceAssets'),
                'landingResources': $A.get('$Resource.rfPrototypeLtg'),
                'chunkResources': $A.get('$Resource.rfPrototypeLtgChunk'),
                'cssResources': $A.get('$Resource.rfPrototypeLtgCss'),
                'bundleDomain': component.get("v.bundleDomain"),
                'recordId': component.get("v.recordId"),
                'recordType': 'Account',
            };
            var str = [];
            for (var p in data){
                if (data.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
                }
            }
            containerSrc += "?"+str.join("&");
            $A.createComponent(
                "lightning:container",
                {
                    "aura:id": "ReactApp",
                    "src": containerSrc,
                    "onmessage": component.getReference("c.handleMessage"),
                    "onerror": component.getReference("c.handleError"),
                    "style": "{height: "+component.get("v.containerHeight")+"px}"
                },
                function(newContainer, status, errorMessage){
                    //Add the new button to the body array
                    if (status === "SUCCESS") {
                        var body = component.get("v.body");
                        body.push(newContainer);
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.")
                        // Show offline error
                    }
                    else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                        // Show error message
                    }
                }
            );
        }, 10);
	},
    afterScriptsLoaded: function(component, event, helper){
        console.log("Script Loaded");
    },
    handleRender: function(component, event, helper){

    },
    handleMessage: function(component, message, helper) {
        var container = component.find("ReactApp");
        var payload = message.getParams().payload;
        var data = JSON.parse(JSON.stringify(payload));
        if(data.hasOwnProperty("type") && data.type === "resize"){
            component.set("v.containerHeight", data.size.height);
            return;
        }
        var callbackId = payload.callbackId;
        var actionName = "callInternalApi";
        if(payload.hasOwnProperty("action")){
            actionName = payload.action;
        }
        var action = component.get("c."+actionName);
        action.setParams(payload.params);
        action.setCallback(this, function(response){
            var state = response.getState();
            var data = response.getReturnValue();
            if (state === "ERROR") {
                var errors = response.getError();
                var error = "Unknown error";
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        error = errors[0].message;
                    }
                }
                try{
                    // Parse if error in in json otherwise consider it as string
                    JSON.parse(error);
                    data = error;
                }catch(e){
                    data = '{"message": "'+error+'", "statusCode": 500'+'}';
                }
                
            }
            container.message({ //Send message to react app with data and callback id so that actual callback function is triggered.
                data: data,
                callbackId: callbackId
            });
        });
        $A.enqueueAction(action);
        // Force the queue to execute the actions immediately
        window.setTimeout(
            $A.getCallback(function() {
                component.set("v.visible", true);
            }), 10
        );
    },
    
    handleError: function(component, error, helper) {
        var e = error;
        console.log(e);
    }
})
