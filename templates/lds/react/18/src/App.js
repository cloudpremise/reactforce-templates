import React from "react";
import './App.css';

import Input from './components/Input';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import InlineIcon from "./components/Icons/InlineIcon";
import comboboxFilterAndLimit from '@salesforce/design-system-react/components/combobox/filter';
import Combobox from '@salesforce/design-system-react/components/combobox';
import Datepicker from './components/DatePicker.jsx';
import Timepicker from './components/TimePicker';
import Button from './components/Button';
import Radio from '@salesforce/design-system-react/components/radio'; 
import Checkbox from '@salesforce/design-system-react/components/checkbox';
import Tooltip from './components/Tooltip';
import Textarea from '@salesforce/design-system-react/components/textarea'; 
import Icon from '@salesforce/design-system-react/components/icon';

import GlobalNavigationBar from '@salesforce/design-system-react/components/global-navigation-bar'; 
import GlobalNavigationBarRegion from '@salesforce/design-system-react/components/global-navigation-bar/region';
import GlobalNavigationBarDropdown from './components/GlobalNavigationBar/Dropdown';
import GlobalNavigationBarLink from '@salesforce/design-system-react/components/global-navigation-bar/link';
import AppLauncher from '@salesforce/design-system-react/components/app-launcher';
import Table from "./components/Table";
import Details from "./components/Details";

import { useSampleAdapter } from "./hooks/useApexAdapter";
import { prepareInlineAdapter } from "./ApexAdapter";
prepareInlineAdapter();

const HeaderProfileCustomMenuButton = (props) => (
	<Button {...props}
        iconName="rows"
        iconVariant="border"
        className="slds-m-left_small slds-custom-menu-button"
    />
);
HeaderProfileCustomMenuButton.displayName = 'SLDSGlobalNavigationBarRegion';

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

function App() {
    const dropdownCollection = [
        {
            label: 'Menu Item One',
            value: '1',
            iconCategory: 'utility',
            iconName: 'table',
            href: 'http://www.google.com',
        },
        {
            label: 'Menu Item Two',
            value: '2',
            iconCategory: 'utility',
            iconName: 'kanban',
            href: 'http://www.google.com',
        },
        {
            label: 'Menu Item Three',
            value: '3',
            iconCategory: 'utility',
            iconName: 'side_list',
            href: 'http://www.google.com',
        },
    ];
    const accounts = [
        {
            id: '1',
            label: 'Acme',
            subTitle: 'Account • San Francisco',
            type: 'account',
        },
        {
            id: '2',
            label: 'Salesforce.com, Inc.',
            subTitle: 'Account • San Francisco',
            type: 'account',
        },
        {
            id: '3',
            label: "Paddy's Pub",
            subTitle: 'Account • Boston, MA',
            type: 'account',
        },
        {
            id: '4',
            label: 'Tyrell Corp',
            subTitle: 'Account • San Francisco, CA',
            type: 'account',
        }
    ];
    const accountsWithIcon = accounts.map((elem) => ({
        ...elem,
        ...{
            icon: (
                <InlineIcon
                    assistiveText={{ label: 'Account' }}
                    category="standard"
                    name={elem.type}
                />
            ),
        },
    }));
    const [loading, apexState] = useSampleAdapter({});
    const [state, setState] = React.useState({
        inputValue: '',
		selection: [accountsWithIcon[0], accountsWithIcon[1]],
        value: '',
        singleSelection: [],
        openMenu: false        
    });
    function getSFResourcesPath(){
        return (window.hasOwnProperty('inlineApexAdaptor') ? window.inlineApexAdaptor.resources+'/': '');
    }
    function handleChange(event, data) {
		setState({
            ...state,
            value: data.date
        });
	}
    function onMenuToggle(status = false){
        setState({
            ...state,
            openMenu: status
        });
    }
    function onRenderMenuItem(props){
        const {assistiveText, selected, option} = props;
        return (
            <span
                className={'slds-truncate '+ option.disabled ? '' : 'slds-disabled-text'}
                title={option.label}
            >
                {
                    selected ?
                        <Icon
                            assistiveText={{ label: option.label }}
                            category="utility"
                            icon={require("@salesforce/design-system-react/icons/utility/check").default}
                            name='check'
                            size="x-small"
                            className={"slds-listbox__icon-selected slds-listbox__icon-selected-custom slds-m-right_xx-small"}
                        />
                    :
                    null
                }
                {selected ? (
                    <span className="slds-assistive-text">
                        {assistiveText.optionSelectedInMenu}
                    </span>
                ) : null}{' '}
                {option.type === 'deselect' ? (
                    <em>{option.label}</em>
                ) : (
                    option.label
                )}
            </span>
        )
    }
    return (
        <IconSettings iconPath={getSFResourcesPath()+"assets/icons"}>
            <GlobalNavigationBar className={(state.openMenu ? 'slds-open-menu' : '')}>
                <GlobalNavigationBarRegion region="primary">
                    <AppLauncher
                        id="app-launcher-trigger"
                        triggerName="App Name"
                        modalHeaderButton={<Button label="App Exchange" />}
                    >
                        App Launcer Items
                    </AppLauncher>
                </GlobalNavigationBarRegion>
                <GlobalNavigationBarRegion region="secondary" navigation className={"slds-custom-primary-navigation "+(state.openMenu ? 'slds-open-menu' : '')}>
                    <GlobalNavigationBarLink label="Home" id="home-link" />
                    <GlobalNavigationBarDropdown
                        assistiveText={{ icon: 'Open menu item submenu' }}
                        id="primaryDropdown"
                        label="Menu Item"
                        options={dropdownCollection}
                    />
                    <GlobalNavigationBarLink label="Menu Item" />
                    <GlobalNavigationBarLink label="Menu Item" />
                    <GlobalNavigationBarLink label="Menu Item" />
                    <CustomNavigationBarRegion
                        region="secondary"
                        onClick={() => onMenuToggle(false)}
                        className="slds-custom-navigation-close"
                    />
                </GlobalNavigationBarRegion>
                <CustomNavigationBarPopover onClick={() => onMenuToggle(false)} region="secondary" />
                <HeaderProfileCustomMenuButton onClick={() => onMenuToggle(true)} region="secondary" />
            </GlobalNavigationBar>
            <div className="App">
                <div className="slds-p-around_medium slds-size_1-of-1">
                    <h1 className="slds-text-title_caps slds-p-vertical_large slds-p-top_none">
                        Inputs
                    </h1>
                    <div className="slds-grid slds-gutters slds-wrap">
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4">
                            <Input
                                label="Input Label"
                            />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4">
                            <Input
                                iconLeft={
                                    <InlineIcon
                                        assistiveText={{
                                            icon: 'Search',
                                        }}
                                        name="search"
                                        category="utility"
                                        inputIcon
                                        iconPosition="left"
                                    />
                                }
                                label="Input with Tooltip and Left Icon"
                                fieldLevelHelpTooltip={
                                    <Tooltip
                                        id="field-level-help-tooltip"
                                        align="top left"
                                        content="Some helpful information"
                                    />
                                }
                            />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4">
                            <Input
                                label="Input with Error Message"
                                required
                                errorText="Error Message"
                            />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4 slds-m-top_large">
                            <Radio id="radioId1" name="sampleRadio" labels={{ label: 'Radio Label' }} />
                            <Radio id="radioId2" name="sampleRadio" labels={{ label: 'Radio Label2' }} />
                        </div>
                    </div>
                    <div className="slds-grid slds-gutters slds-wrap">
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4">
                            <Combobox
                                labels={{
                                    label: 'Multiple Select',
                                    placeholder: 'Select',
                                }}
                                multiple
                                options={comboboxFilterAndLimit({
                                    inputValue: state.inputValue,
                                    limit: 10,
                                    options: accountsWithIcon,
                                    selection: state.selection
                                })}
                                selection={state.selection}
                                value={state.inputValue}
                                input={{
                                    props: {
                                        iconRight: (
                                            <InlineIcon
                                                category="utility"
                                                name="down"
                                                iconPosition="right"
                                                size="x-small"
                                                color="grey"
                                                inputIcon
                                                combobox
                                            />
                                        )
                                    }
                                }}
                                events={{
                                    onChange: (event, { value }) => {
                                        setState({
                                            ...state,
                                            inputValue: value
                                        });
                                    },
                                    onRequestRemoveSelectedOption: (event, data) => {
                                        setState({
                                            ...state,
                                            inputValue: '',
                                            selection: data.selection,
                                        });
                                    },
                                    onSubmit: (event, { value }) => {
                                        setState({
                                            inputValue: '',
                                            selection: [
                                                ...state.selection,
                                                {
                                                    label: value,
                                                    icon: (
                                                        <InlineIcon
                                                            assistiveText={{ label: 'Account' }}
                                                            category="standard"
                                                            name="account"
                                                        />
                                                    ),
                                                },
                                            ],
                                        });
                                    },
                                    onSelect: (event, data) => {
                                        setState({
                                            ...state,
                                            inputValue: '',
                                            selection: data.selection,
                                        });
                                    },
                                }}
                            />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4 datepicker">
                            <Datepicker
                                labels={{
                                    label: 'Date',
                                }}
                                onChange={(event, data) => {
                                    handleChange(event, data);
                                }}
                                value={state.value}
                            />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4 datepicker">
                            <Timepicker
                                label="Time"
                                stepInMinutes={30}
                                onDateChange={(date, inputStr) => {
                                    console.log('onDateChange ', date, ' inputStr: ', inputStr);
                                }}
                            />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4 slds-m-top_large">
                            <Checkbox
                                assistiveText={{
                                    label: 'Default',
                                }}
                                id="checkbox-example"
                                labels={{
                                    label: 'Default',
                                }}
                            />
                        </div>
                    </div>
                    <div className="slds-grid slds-gutters slds-wrap">
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4 slds-m-top_large">
                            <Textarea id="unique-id-1" label="Textarea Label" />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4 slds-m-top_large">
                            <Input id="counter-input-1" label="Counter" variant="counter" />
                        </div>
                        <div className="slds-col slds-size_1-of-1 slds-small-size_1-of-2 slds-medium-size_1-of-4 slds-m-top_large">
                        <Combobox
                            id="combobox-readonly-single"
                            events={{
                                onSelect: (event, data) => {
                                    setState({
                                        ...state,
                                        inputValue: '',
                                        singleSelection: data.selection,
                                    });
                                },
                            }}
                            labels={{
                                label: 'Single Select',
                            }}
                            options={accounts}
                            selection={state.singleSelection}
                            onRenderMenuItem={onRenderMenuItem}
                            classNameContainer={"customize-combobox"}
                            value={state.inputValue}
                            variant="readonly"
                            input={{
                                props: {
                                    iconRight: (
                                        <InlineIcon
                                            category="utility"
                                            name="down"
                                            iconPosition="right"
                                            size="x-small"
                                            color="grey"
                                            inputIcon
                                            combobox
                                        />
                                    )
                                }
                            }}
                        />
                        </div>
                    </div>
                    <h1 className="slds-text-title_caps slds-p-vertical_large">
                        Icons
                    </h1>
                    <div className="slds-grid slds-gutters">
                        <div className="slds-col_padded">
                            <InlineIcon
                                assistiveText={{ label: 'Account' }}
                                category="standard"
                                name="account"
                                size="small"
                            />
                        </div>
                        <div className="slds-col_padded">
                            <InlineIcon
                                assistiveText={{ label: 'Account' }}
                                category="utility"
                                name="announcement"
                                size="small"
                            />
                        </div>
                        <div className="slds-col_padded">
                            <InlineIcon
                                assistiveText={{ label: 'Account' }}
                                category="action"
                                name="description"
                                size="small"
                            />
                        </div>
                        <div className="slds-col_padded">
                            <InlineIcon
                                assistiveText={{ label: 'Account' }}
                                category="doctype"
                                name="xml"
                                size="small"
                            />
                        </div>
                        <div className="slds-col_padded">
                            <InlineIcon
                                assistiveText={{ label: 'Account' }}
                                category="custom"
                                name="custom5"
                                size="small"
                            />
                        </div>
                    </div>
                    <h1 className="slds-text-title_caps slds-p-vertical_large">
                        Buttons
                    </h1>
                    <div className="slds-x-small-buttons_horizontal">
                        <Button label="Brand" variant="brand" />
                        <Button
                            disabled
                            label="Disabled"
                            onClick={() => {
                                console.log('Disabled Button Clicked');
                            }}
                            variant="brand"
                        />
                        <Button label="Destructive" variant="destructive" />
                        <Button label="Outline Brand" variant="outline-brand" />
                        <Button
                            iconCategory="utility"
                            iconName="download"
                            iconPosition="left"
                            label="Neutral Icon"
                        />
                    </div>
                </div>
                <p className='slds-p-horizontal_medium api-response'>
                    {
                        loading === false && apexState.message !== null ?
                            <a href="https://cloudpremise.gitbook.io/reactforce/" rel="noreferrer" target="_blank" className="slds-text-heading_small slds-text-color_destructive">
                                {apexState.message}
                            </a>
                        :
                            null
                    }
                </p>
                <br />
                <Table />
                <Details />
            </div>
        </IconSettings>
    );
}

export default App;
