import React from "react";
import Card from '@salesforce/design-system-react/components/card';
import Input from '@salesforce/design-system-react/components/input';
import Button from '@salesforce/design-system-react/components/button';
import Api from "../Api";
import Spinner from '@salesforce/design-system-react/components/spinner';
import stateReducer from "../hooks/stateReducer";
import { useNavigate } from "react-router-dom";
import { getParam } from "../ApexAdapter";


const LoginWithLink = (props) => {
    const secureLink = getParam("secureLink");
    let heading = "Enter Your Email Address to Continue";
    let loadingLinkInfo = false;
    let footer = "Unauthenticated Screen";
    if(typeof(secureLink) === "string" && secureLink.length > 0 && secureLink !== "null"){
        heading = "Please wait while we verify your secure link";
        loadingLinkInfo = true;
        footer = "Authenticated Screen";
    }
    const [state, setState] = React.useReducer(stateReducer, {
        email: "",
        loading: loadingLinkInfo,
        errorMessage: null,
        heading: heading,
        loadLink: loadingLinkInfo,
        loadingLinkInfo: loadingLinkInfo,
        footer: footer,
        verifiedEntity: null,
        checkEmail: false,
        searchText: "",
        sortColumn: 'Id',
        sortColumnDirection: {
			Id: 'desc',
		},
        items: [],
        selection: [],
        redirect: false
    });

    const navigate = useNavigate();
    React.useEffect(() => {
        if(state.redirect){
            return navigate("/home", { replace: true });
        }
        if(!state.loadLink){
            return;
        }
        loadSecureLink();
    });

    function handleChange(e, name){
        setState({
            type: "update",
            state: {
                [name]: e.target.value,
            }
        });
    }
    function onSubmit(e){
        e.preventDefault();
        const requestData = {
            email: state.email,
            ipAddress: "127.0.0.1",
            returnUrl: window.location.origin+props.basename
        };
        let headers = {};
        let method = 'POST';
        let route = '/v1/idp/email_verification/generateemaillink';

        Api.apexAdapter({}, route, method, requestData, headers).then((response) => {
            const result = response.result;
            const key = result.key;
            if(typeof(key) === "string" && key.length > 0){
                localStorage.setItem("secure_link_key", key);
            }
            setState({
                type: "update",
                state: {
                    loading: false,
                    loadingLinkInfo: false,
                    errorMessage: null,
                    heading: result.message,
                    checkEmail: true
                }
            });
        }).catch(err => {
            setState({
                type: "update",
                state: {
                    checkEmail: false,
                    loading: false,
                    loadingLinkInfo: false,
                    heading: "Unable to generate link. Please try again.",
                    footer: "Failed Screen",
                    errorMessage: err.message,
                }
            });
        });

        setState({
            type: "update",
            state: {
                checkEmail: false,
                loading: true,
                errorMessage: null
            }
        });
    }
    function loadSecureLink(){
        const key = localStorage.getItem("secure_link_key");
        const requestData = {
            secureLink: secureLink,
            key: key,
            ipAddress: "127.0.0.1",
        };
        let headers = {};
        let method = 'POST';
        let route = '/v1/idp/email_verification/verifyemaillink';

        Api.apexAdapter({}, route, method, requestData, headers).then((response) => {
            const result = response.result;
            if(typeof(result) === "object" && result.hasOwnProperty("verifiedEntity")){
                const verifiedEntity = result.verifiedEntity;
                localStorage.setItem("verified_entity", JSON.stringify(verifiedEntity));
                let heading = "You are recognized as "+verifiedEntity.firstName+" "+verifiedEntity.lastName+" with Id: "+verifiedEntity.id;
                setState({
                    type: "update",
                    state: {
                        loading: false,
                        loadingLinkInfo: false,
                        errorMessage: null,
                        heading: heading,
                        verifiedEntity: verifiedEntity,
                        email: verifiedEntity.email,
                        footer: "Case Management Screen",
                        redirect: true
                    }
                });
            }else{
                setState({
                    type: "update",
                    state: {
                        loading: false,
                        loadingLinkInfo: false,
                        heading: "Your Link is Not Valid. Try Again",
                        footer: "Failed Screen",
                        errorMessage: result.message,
                    }
                });
            }
        }).catch(err => {
            setState({
                type: "update",
                state: {
                    loading: false,
                    loadingLinkInfo: false,
                    heading: "Your Link is Not Valid. Try Again",
                    footer: "Failed Screen",
                    errorMessage: err.message,
                }
            });
        });

        setState({
            type: "update",
            state: {
                loading: false,
                loadLink: false,
                errorMessage: null
            }
        });
    }
    return (
        <div className="slds-m-around_medium">
            <div className="slds-grid slds-wrap slds-grid_align-center">
                <form className={"slds-size_4-of-"+(state.verifiedEntity !== null ? "6" : "12")}>
                    <Card
                        heading={state.heading}
                        footer={(state.loadingLinkInfo ? null : state.footer)}
                    >
                        <div className="slds-p-around_medium">
                            {
                                (state.verifiedEntity !== null && !state.loading) ?
                                    null
                                :
                                (state.loadingLinkInfo || state.loading) ?
                                    <div key="spinner" className="slds-is-relative slds-m-top_large" style={{height: "45px"}}>
                                        <Spinner
                                            assistiveText={{ label: "Loading ..." }}
                                            hasContainer={false}
                                            size="large"
                                            variant="brand"
                                            isInline
                                        />
                                    </div>
                                :
                                <>
                                    <Input
                                        name="email"
                                        type="email"
                                        label={"Enter Your Email"}
                                        value={state.email}
                                        onChange={(e) => handleChange(e, "email")}
                                    />
                                    {
                                        state.errorMessage !== null ?
                                            <p className="slds-m-top_medium slds-text-color_destructive">{state.errorMessage}</p>
                                        :
                                            null
                                    }
                                    {
                                        state.verifiedEntity === null ?
                                            state.loading ?
                                                <div key="spinner" className="slds-is-relative slds-m-top_large" style={{height: "45px"}}>
                                                    <Spinner
                                                        assistiveText={{ label: "Loading ..." }}
                                                        hasContainer={false}
                                                        size="large"
                                                        variant="brand"
                                                        isInline
                                                    />
                                                </div>
                                            :
                                            state.checkEmail === false ?
                                                <Button
                                                    className="slds-m-top_medium"
                                                    label="Generate Secure One Time LInk"
                                                    variant="brand"
                                                    onClick={(e) => onSubmit(e)}
                                                />
                                            :
                                            null
                                        :
                                        null
                                    }
                                </>
                            }
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    )
};

export default LoginWithLink;