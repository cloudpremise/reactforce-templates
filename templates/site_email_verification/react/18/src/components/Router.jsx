import React from 'react'
import { Route, Routes, useNavigate } from "react-router-dom";
import Popover from '@salesforce/design-system-react/components/popover';
import GlobalHeaderProfile from '@salesforce/design-system-react/components/global-header/profile';
import GlobalNavigationBar from '@salesforce/design-system-react/components/global-navigation-bar'; 
import GlobalNavigationBarRegion from '@salesforce/design-system-react/components/global-navigation-bar/region';
import GlobalHeader from './Header';
import { getSessionId } from "../ApexAdapter";
import Button from './Button';

import Home from "../pages/Home";
import Landing from "../pages/Landing";
import LoginWithLink from "../pages/LoginWithLink";

/* eslint-disable max-len */
/* eslint-disable react/prop-types */

// Profile content is currently the contents of a generic `Popover` with markup copied from https://www.lightningdesignsystem.com/components/global-header/. This allows content to have tab stops and focus trapping. If you need a more specific/explicit `GlobalHeaderProfile` content, please create an issue.
const HeaderProfileCustomContent = (props) => (
	<div id="header-profile-custom-popover-content">
		<div className="slds-m-around_medium">
			<div className="slds-tile slds-tile_board slds-m-horizontal_small">
				<div className="slds-tile__detail">
					<p className="slds-truncate">
						<a href={props.basename}>
							Exit
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
);
HeaderProfileCustomContent.displayName = 'HeaderProfileCustomContent';

const HeaderProfileCustomMenuButton = (props) => (
	<Button {...props}
        iconName="rows"
        iconVariant="border"
        className="slds-m-left_small slds-custom-menu-button"
    />
);
HeaderProfileCustomMenuButton.displayName = 'HeaderProfileCustomMenuButton';

const CustomNavigationBarRegion = (props) => (
	<Button {...props}
        iconName="close"
        iconVariant="global-header"
    />
);
CustomNavigationBarRegion.displayName = 'SLDSGlobalNavigationBarRegion';

const CustomNavigationBarPopover = (props) => (
	<div
        {...props}
        className='slds-navigation-popover'
    ></div>
);
CustomNavigationBarPopover.displayName = 'SLDSGlobalNavigationBarRegion';

const Header = (props) => {
    const url = props.page.replace(props.basename, "");
    const [state, setState] = React.useState({
        openMenu: false,
        activeUrl: url
    });
    const { basename, page } = props;
    let cdn = "";
    if(window.inlineApexAdaptor && window.inlineApexAdaptor.landingResources){
        cdn = window.inlineApexAdaptor.landingResources;
    }
    const logoUrl = cdn+"/assets/img/logo.png";
    const sessionId = getSessionId();
    function onMenuToggle(status = null){
        setState({
            ...state,
            openMenu: status
        });
    }
    function onLogoClick(){
        onUrlChange(null, (sessionId.length > 0 ? '/home' : '/'));
    }
    const navigate = useNavigate();
    function onUrlChange(event, url = ''){
        if(event){
            url = event.currentTarget.getAttribute("url");
        }
        url = url.replace(props.basename, "");
        setState({
            ...state,
            activeUrl: url
        });
        navigate(url);
        window.history.replaceState(null, document.title, props.basename+url+window.location.search);
        onMenuToggle(false);
    }

    return (
        <GlobalHeader
            logoSrc={logoUrl}
            onLogoClick={() => onLogoClick()}
            onSkipToContent={() => {
                console.log('>>> Skip to Content Clicked');
            }}
            onSkipToNav={() => {
                console.log('>>> Skip to Nav Clicked');
            }}
            navigation={
                <NavigationBar
                    basename={basename}
                    page={page}
                    onMenuToggle={onMenuToggle}
                    className={state.openMenu ? 'slds-open-menu' : ''}
                    onUrlChange={onUrlChange}
                    activeUrl={state.activeUrl}
                />
            }
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
            <HeaderProfileCustomMenuButton
                onClick={() => onMenuToggle(true)}
            />
        </GlobalHeader>
    )
};

const NavigationBar = (props) => {
    const sessionId = getSessionId();

    return (
        <GlobalNavigationBar
            className={"slds-custom-primary-navigation "+props.className}
        >
            {
                sessionId.length > 0 ?
                    <GlobalNavigationBarRegion region="secondary" navigation>
                        <li className={'slds-context-bar__item '+(props.activeUrl === "/home" ? "slds-is-active" : "")}>
                            <span url="/home" onClick={(event) => props.onUrlChange(event)} className="slds-context-bar__label-action">
                                <span className='slds-truncate' title='Home'>Home</span>
                            </span>
                        </li>
                    </GlobalNavigationBarRegion>
                :
                    <GlobalNavigationBarRegion region="secondary" navigation>
                        <li className={'slds-context-bar__item'}>
                            <span url={props.basename+"/login-link"} onClick={(event) => props.onUrlChange(event)} className="slds-context-bar__label-action">
                                <span className='slds-truncate' title='Login With Link'>Login With Link</span>
                            </span>
                        </li>
                    </GlobalNavigationBarRegion>
            }
            <CustomNavigationBarRegion
                region="secondary"
                onClick={() => props.onMenuToggle(false)}
                className="slds-custom-navigation-close"
            />
            <CustomNavigationBarPopover onClick={() => props.onMenuToggle(false)} region="secondary" />
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
                    {/* <NavigationBar basename={basename} page={page} /> */}
                </div>
                <div id="global_wrapper">
                    <div id="global_content" style={{paddingTop: "15px", paddingBottom: "15px"}} data-testid="content">
                        <Routes>
                            <Route path="/" element={<Landing history={history} basename={basename} page={page} />} />
                            <Route path="/landing" element={<Landing history={history} basename={basename} page={page} />} />
                            <Route path="/home" element={<Home history={history} basename={basename} page={page} />} />
                            <Route path="/login-link" element={<LoginWithLink history={history} basename={basename} page={page} />} />                            
                        </Routes>
                    </div>
                </div>
            </>
        )
    }
}

export default RouterComponent;
