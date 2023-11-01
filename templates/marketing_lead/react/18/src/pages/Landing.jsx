import React from "react";
import { getSessionId } from "../ApexAdapter";
import { useNavigate } from "react-router-dom";
import Card from '@salesforce/design-system-react/components/card';
import Input from '@salesforce/design-system-react/components/input';
import Button from '@salesforce/design-system-react/components/button';
import { leadAdapter } from "../ApexAdapter";

const Landing = (props) => {
    const [state, setState] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        isSuccess: false,
        loading: false,
        errorMessage: null
    });
    const navigate = useNavigate();
    React.useEffect(() => {
        const sessionId = getSessionId();
        if(typeof(sessionId) === "string" && sessionId.length > 0){
            return navigate("/home", { replace: true });
        }
    });
    function handleChange(e, name){
        setState({
            ...state,
            [name]: e.target.value,
        });
    }
    function onSubmit(e){
        e.preventDefault();
        const { firstName, lastName, email, company } = state;
        leadAdapter(firstName, lastName, email, company, (data) => {
            if(typeof(data) === "object" && data.hasOwnProperty("isSuccess") && data.isSuccess){
                setState({
                    ...state,
                    loading: false,
                    isSuccess: true,
                    firstName: "",
                    lastName: "",
                    email: "",
                    company: ""
                });
            }else{
                let message = 'Unable to create lead.';
                if(typeof(data) === "object" && data.hasOwnProperty("result")){
                    message = data.result;
                }
                setState({
                    ...state,
                    loading: false,
                    errorMessage: message
                });
            }
        });
        setState({
            ...state,
            loading: true,
            errorMessage: null
        });
    }
    return (
        <div className="slds-m-around_medium">
            <div className="slds-grid slds-wrap slds-grid_align-center">
                <form className="slds-size_1-of-1 slds-small-size_8-of-12 slds-medium-size_1-of-3">
                    <Card heading="Capture Lead">
                        <div className="slds-p-around_medium">
                            {
                                state.isSuccess ?
                                    <p>We have received your information and you will hear from us soon!</p>
                                :
                                <>
                                    <Input
                                        name="firstName"
                                        type="firstName"
                                        label={"First Name"}
                                        value={state.firstName}
                                        onChange={(e) => handleChange(e, "firstName")}
                                    />
                                    <Input
                                        name="lastName"
                                        type="lastName"
                                        label={"Last Name"}
                                        value={state.lastName}
                                        onChange={(e) => handleChange(e, "lastName")}
                                    />
                                    <Input
                                        name="email"
                                        type="email"
                                        label={"Email"}
                                        value={state.email}
                                        onChange={(e) => handleChange(e, "email")}
                                    />
                                    <Input
                                        name="company"
                                        type="company"
                                        label={"Company"}
                                        value={state.company}
                                        onChange={(e) => handleChange(e, "company")}
                                    />
                                    {
                                        state.errorMessage !== null ?
                                            <p className="slds-m-top_medium slds-text-color_destructive">{state.errorMessage}</p>
                                        :
                                            null
                                    }
                                    <Button
                                        className="slds-m-top_medium"
                                        label="Save"
                                        variant="brand"
                                        onClick={(e) => onSubmit(e)}
                                    />
                                </>
                            }
                            
                        </div>
                    </Card>
                </form>
            </div>
            
        </div>
    )
}

export default Landing;