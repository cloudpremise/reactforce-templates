import React from 'react'
import { Route, Routes, useNavigate } from "react-router-dom";
import Popover from '@salesforce/design-system-react/components/popover';
import GlobalHeaderProfile from '@salesforce/design-system-react/components/global-header/profile';
import GlobalNavigationBar from '@salesforce/design-system-react/components/global-navigation-bar'; 
import GlobalNavigationBarRegion from '@salesforce/design-system-react/components/global-navigation-bar/region';
import GlobalHeader from './Header';
import { getSessionId } from "../ApexAdapter";

import Landing from "../pages/Landing";
import Home from "../pages/Home";

/* eslint-disable max-len */
/* eslint-disable react/prop-types */

// Profile content is currently the contents of a generic `Popover` with markup copied from https://www.lightningdesignsystem.com/components/global-header/. This allows content to have tab stops and focus trapping. If you need a more specific/explicit `GlobalHeaderProfile` content, please create an issue.
const HeaderProfileCustomContent = (props) => (
	<div id="header-profile-custom-popover-content">
		<div className="slds-m-around_medium">
			<div className="slds-tile slds-tile_board slds-m-horizontal_small">
				<div className="slds-tile__detail">
					<p className="slds-truncate">
						<a href={props.basename+"/secur/logout.jsp"}>
							Log Out
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
);
HeaderProfileCustomContent.displayName = 'HeaderProfileCustomContent';

const Header = (props) => {
    const { basename, page } = props;
    let cdn = "";
    if(window.inlineApexAdaptor && window.inlineApexAdaptor.landingResources){
        cdn = window.inlineApexAdaptor.landingResources;
    }
    const logoUrl = cdn+"/assets/img/logo.png";
    const sessionId = getSessionId();
    return (
        <GlobalHeader
            logoSrc={logoUrl}
            onSkipToContent={() => {
                console.log('>>> Skip to Content Clicked');
            }}
            onSkipToNav={() => {
                console.log('>>> Skip to Nav Clicked');
            }}
            navigation={<NavigationBar basename={basename} page={page} />}
        >
            {
                sessionId.length > 0 ?
                    <GlobalHeaderProfile
                        popover={
                            <Popover
                                body={<HeaderProfileCustomContent basename={basename} />}
                                id="header-profile-popover-id"
                            />
                        }
                        // userName="Art Vandelay"
                    />
                :
                null
            }
        </GlobalHeader>
    )
};

const NavigationBar = (props) => {
    const url = props.page.replace(props.basename, "");
    const [state, setState] = React.useState({
        activeUrl: url
    });
    const navigate = useNavigate();
    function onUrlChange(event){
        let url = event.currentTarget.getAttribute("url");
        url = url.replace(props.basename, "");
        setState({activeUrl: url});
        navigate(url);
        window.history.replaceState(null, document.title, props.basename+url+window.location.search);
    }

    return (
        <GlobalNavigationBar>
            <GlobalNavigationBarRegion region="secondary" navigation>
                <li className={'slds-context-bar__item '+(state.activeUrl === "/" ? "slds-is-active" : "")}>
                    <span url="/" onClick={(event) => onUrlChange(event)} className="slds-context-bar__label-action">
                        <span className='slds-truncate' title='Home'>Home</span>
                    </span>
                </li>
            </GlobalNavigationBarRegion>
        </GlobalNavigationBar>
    )
};
NavigationBar.displayName = "SLDSGlobalHeaderSearch";

const RouterComponent = class extends React.Component {
    render() {
        const { history, basename, page } = this.props;
        const sessionId = getSessionId();
        return (
            <>
                <div className={sessionId.length === 0 ? 'non-logged-in' : ''}>
                    <Header basename={basename} page={page} />
                </div>
                <div id="global_wrapper">
                    <div id="global_content" style={{paddingTop: "15px", paddingBottom: "15px"}} data-testid="content">
                        <Routes>
                            <Route path="/" element={<Landing history={history} basename={basename} page={page} />} />
                            <Route path="/landing" element={<Landing history={history} basename={basename} page={page} />} />
                            <Route path="/home" element={<Home history={history} basename={basename} page={page} />} />
                        </Routes>
                    </div>
                </div>
            </>
        )
    }
}

export default RouterComponent;
