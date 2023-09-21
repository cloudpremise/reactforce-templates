import React from "react";
import { getSessionId } from "../ApexAdapter";
import { useNavigate } from "react-router-dom";

const Landing = (props) => {
    const navigate = useNavigate();
    React.useEffect(() => {
        const sessionId = getSessionId();
        if(typeof(sessionId) === "string" && sessionId.length > 0){
            return navigate("/home", { replace: true });
        }
    });
    return (
        <div className="slds-p-left_medium slds-text-heading_small">
            Landing page for unauthenticated users.
        </div>
    )
}

export default Landing;