import React from "react";
import { getSessionId } from "../ApexAdapter";
import { useSampleAdapter } from "../hooks/useApexAdapter";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const [loading, state] = useSampleAdapter({});
    const navigate = useNavigate();
    React.useEffect(() => {
        const sessionId = getSessionId();
        if(typeof(sessionId) === "string" && sessionId.length <= 0){
            return navigate("/landing", { replace: true });
        }
    });
    
    return (
        <div className="slds-p-horizontal_medium">
            <div className="slds-text-heading_small slds-m-bottom_medium">
                Home page for authenticated users.
            </div>
            <p className="slds-m-top_medium">
                {
                    loading === false && state !== null && state.hasOwnProperty("response") && state.response !== null ?
                        <a href="https://cloudpremise.gitbook.io/reactforce/" rel="noreferrer" target="_blank" className="slds-text-heading_small slds-text-color_destructive">
                            {state.response}
                        </a>
                    :
                        null
                }
            </p>
        </div>
    )
}

export default Home;