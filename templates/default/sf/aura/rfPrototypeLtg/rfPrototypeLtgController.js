({
    doInit : function(component, event, helper) {
        var containerSrc = $A.get('$Resource.rfPrototypeLtg')+'/index.html';
        var data = {
            'resources': $A.get('$Resource.M2_SharedAssets'),
            'landingResources': $A.get('$Resource.rfPrototypeLtg'),
            'bundleDomain': component.get("v.bundleDomain"),
            'advancedConfiguration': component.get("v.advancedConfiguration"),
            'userInterfacePreview': component.get("v.userInterfacePreview"),
            'recordId': component.get("v.recordId"),
            'page': component.get("v.page"),
            'hidePageHeader': component.get("v.hidePageHeader"),
            'hideNavigationTabs': component.get("v.hideNavigationTabs"),
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
        var action = component.get("c.callInternalApi");
        action.setParams(payload.params);
        action.setCallback(this, function(response){
            container.message({ //Send message to react app with data and callback id so that actual callback function is triggered.
                data: response.getReturnValue(),
                callbackId: callbackId
            });
        });
        $A.enqueueAction(action);
    },
    
    handleError: function(component, error, helper) {
        var e = error;
        console.log(e);
    }
})
