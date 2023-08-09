import React from "react";
import Tabs from '@salesforce/design-system-react/components/tabs'; 
import TabsPanel from '@salesforce/design-system-react/components/tabs/panel';
import Card from '@salesforce/design-system-react/components/card';
import Icon from '@salesforce/design-system-react/components/icon';
import Button from './Button';
import Dropdown from '../components/MenuDropdown';
import DropdownTrigger from '../components/MenuDropdown/ButtonTrigger';
import DataTable from './DataTable';
import DataTableColumn from '@salesforce/design-system-react/components/data-table/column';
import DataTableRowActions from './DataTable/RowActions';
import Input from '@salesforce/design-system-react/components/input';
import Combobox from '@salesforce/design-system-react/components/combobox';
import InlineIcon from "./Icons/InlineIcon";
import ExpandableSection from '@salesforce/design-system-react/components/expandable-section';
import RichTextEditor from "./RichTextEditor";
import Textarea from '@salesforce/design-system-react/components/textarea';

const Details = (props) => {
    const fileUploadRef = React.createRef();
    const sampleItems = [
        {
            id: '1',
            name: 'Test Campaign',
            date: null,
            type: 'Conference',
            status: 'Status'
        },
        {
            id: '2',
            name: 'Test Campaign2',
            date: null,
            type: 'Conference',
            status: 'Status'
        },
        {
            id: '3',
            name: 'Test Campaign3',
            date: null,
            type: 'Conference',
            status: 'Status'
        },
    ];
    const values = {
        phone: "+1293843848732",
        homePhone: "+1293123384323",
        salutation: "Mr.",
        firstName: "Test",
        lastName: "User",
        mobile: "+1293843848733",
        otherPhone: "",
        title: "Test Contact Title",
        birthdate: "",
        fax: "",
        email: "email@example.com",
        salutationSelection: [{
            "id": "Mr.",
            "label": "Mr."
        }]
    }
    const [state, setState] = React.useState({
        items: sampleItems,
        editMode: false,
        ...values,
        defaultValues: values,
        modifiedFields: {

        }
    });
    function handleRowAction(item, action){
		console.log(item, action);
	}
    function onEdit(status = true){
        let newState = {
            editMode: status
        };
        if(!status){
            newState = {
                ...newState,
                ...state.settings,
                modifiedFields: {}
            };
        }
        setState({
            ...state,
            ...newState
        });
    }
    function isModifiedField(name){
        return (state.modifiedFields.hasOwnProperty(name) && state.modifiedFields[name]);
    }
    function handleChange(event, name){
        if(!state.editMode){
            return;
        }
        const value = event.target.value;
        setState({
            [name]: event.target.value,
            modifiedFields: {
                ...state.modifiedFields,
                [name]: (value !== state.defaultValues[name])
            }
        });
    }
    function handleSelectChange(data, name, fieldName){
        if(!state.editMode){
            return;
        }
        let selection = data.selection;
        if(selection.length > 0 && selection[0].hasOwnProperty("type") && (selection[0].type === "header" || selection[0].type === "footer")){
            if(selection[0].type === "header"){
                if(state.gatewayInputValue.length > 0 ){
                    console.log("onShowAllItems");
                }else{
                    console.log("onRecentItem");
                }
            }else{
                console.log("onAddItem");
            }
            selection = [];
            return;
        }
        let value = "";
        if(selection.length > 0){
            value = selection[0].id;
        }
        setState({
            ...state,
            [name+"InputValue"]: '',
            [name]: selection,
            [fieldName]: value,
            modifiedFields: {
                ...state.modifiedFields,
                [fieldName]: (value !== state.defaultValues[fieldName])
            }
        });
    }
    function onRenderMenuItem(props){
        const {assistiveText, selected, option} = props;
        return (
            <span
                className={"slds-truncate "+(option.disabled ? "slds-disabled-text" : "")}
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
    function getSalutations(){
        const options = [
            {
                id: "--None--",
                label: "--None--"
            },
            {
                id: "Mr.",
                label: "Mr."
            },
            {
                id: "Ms.",
                label: "Ms."
            },
            {
                id: "Mrs.",
                label: "Mrs."
            },
            {
                id: "Dr.",
                label: "Dr."
            },
            {
                id: "Prof.",
                label: "Prof."
            }
        ];
        return options;
    }
    return (
        <div className="slds-p-vertical_large slds-p-around_medium">
            <Card
                className="slds-card-details-header"
                header={(
                    <div class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__figure">
                            <InlineIcon category="standard" name="account" size="medium" />
                        </div>
                        <div class="slds-media__body">
                            <h2>Contact</h2>
                            <h1 className="slds-is-relative" style={{fontSize: "1.125rem", fontWeight: "bold"}}>
                                Test User
                                <Button
                                    iconCategory="utility"
                                    iconName="hierarchy"
                                    iconVariant="border"
                                    iconSize="x-small"
                                    className="card-hierarchy-icon slds-m-left_small"
                                />
                            </h1>
                        </div>
                    </div>
                )}
                headerActions={[
                    <Button
                        label="Follow"
                        key="follow"
                    />,
                    <Button
                        label="Edit"
                        key="edit"
                    />,
                    <Button
                        label="New Case"
                        key="newcase"
                    />,
                    <Button
                        label="New Note"
                        className={"dropdown-more-button-adjacent"}
                        key="newnote"
                    />,
                    <Dropdown
                        align="right"
                        id="page-header-dropdown-object-home-content-right"
                        key="dropdown"
                        options={[
                            { label: 'Delete', value: 'A0' },
                            { label: 'View Contact Hierarchy', value: 'B0' },
                            { label: 'Clone', value: 'C0' },
                            { label: 'Change Owner', value: 'D0' },
                            { label: 'View Customer User', value: 'E0' },
                            { label: 'Disable Customer User', value: 'F0' },
                            { label: 'Check for New Data', value: 'G0' },
                            { label: 'Printable View', value: 'H0' },
                        ]}
                    >
                        <DropdownTrigger
                            triggerClassName={"dropdown-more-button"}
                        >
                            <Button
                                assistiveText={{ icon: 'More' }}
                                iconCategory="utility"
                                iconName="down"
                                iconVariant="border"
                            />
                        </DropdownTrigger>
                    </Dropdown>
                ]}
            >
                <div className="slds-p-around_medium object-card-details">
                    <ul>
                        <li>
                            <p>Title</p>
                            <p>Test Contact Title</p>
                        </li>
                        <li>
                            <p>Account Name</p>
                            <p>
                                <a href="/">customer accounts</a>
                            </p>
                        </li>
                        <li>
                            <p>Phone</p>
                            <p>
                                <a href="tel:+1293843848732">+1293843848732</a>
                            </p>
                        </li>
                        <li>
                            <p>Email</p>
                            <p>
                                <a href="mailto:email@example.com">email@example.com</a>
                            </p>
                        </li>
                        <li>
                            <p>Contact Owner</p>
                            <p>
                                <a href="/">User User</a>
                            </p>
                        </li>
                    </ul>
                </div>
            </Card>
            <div className="slds-p-around_medium slds-m-top_medium">
                <div className="slds-grid slds-gutters">
                    <div className="slds-col slds-size_4-of-6 card-border">
                        <Tabs id="tabs-details-default">
                            <TabsPanel label="Related">
                                <Card
                                    className="slds-card-details-header card-border"
                                    heading="Duplicates (0)"
                                    icon={<InlineIcon category="standard" name="merge" size="small" />}
                                >
                                </Card>
                                <Card
                                    className="slds-card-details-header card-border"
                                    heading="Opportunities (0)"
                                    icon={<InlineIcon category="standard" name="opportunity" size="small" />}
                                    headerActions={[
                                        <Button
                                            label="New"
                                            key="newopportunity"
                                        />
                                    ]}
                                >
                                </Card>
                                <Card
                                    className="slds-card-details-header card-border"
                                    heading="Cases (0)"
                                    icon={<InlineIcon category="standard" name="case" size="small" />}
                                    headerActions={[
                                        <Button
                                            label="New"
                                            key="newcase"
                                        />
                                    ]}
                                >
                                </Card>
                                <Card
                                    className="slds-card-details-header slds-camaign-history-card card-border"
                                    heading="Campaign History (3)"
                                    icon={<InlineIcon category="standard" name="campaign" size="small" />}
                                    headerActions={[
                                        <Button
                                            label="Add to Campaign"
                                            key="newcampain"
                                        />
                                    ]}
                                >
                                    <DataTable items={state.items} id="campaigns-table">
                                        <DataTableColumn
                                            label="Campaign Name"
                                            property="name"
                                            truncate
                                        />
                                        <DataTableColumn
                                            label="Start Date"
                                            property="date"
                                            truncate
                                        />
                                        <DataTableColumn
                                            label="Type"
                                            property="type"
                                            truncate
                                        />
                                        <DataTableColumn
                                            label="Status"
                                            property="status"
                                            truncate
                                        />
                                        <DataTableRowActions
                                            options={[
                                                {
                                                    id: 0,
                                                    label: 'Edit',
                                                    value: '1',
                                                },
                                                {
                                                    id: 1,
                                                    label: 'Delete',
                                                    value: '2',
                                                }
                                            ]}
                                            menuPosition="overflowBoundaryElement"
                                            onAction={handleRowAction}
                                            dropdown={<Dropdown showButtonIcon />}
                                        />
                                    </DataTable>
                                </Card>
                                <Card
                                    className="slds-card-details-header card-border"
                                    heading="Notes & Attachments (0)"
                                    icon={<InlineIcon category="standard" name="file" size="small" />}
                                    headerActions={[
                                        <Button
                                            label="Upload Files"
                                            key="upload"
                                            onClick={() => {fileUploadRef.current.click()}}
                                        />
                                    ]}
                                >
                                    <div className="slds-form-element">
                                        <div className="slds-form-element__control">
                                            <div className="slds-file-selector slds-file-selector_images">
                                            <div className="slds-file-selector__dropzone">
                                                <input ref={fileUploadRef} type="file" className="slds-file-selector__input slds-assistive-text" accept="image/png" id="file-upload-attachments" aria-labelledby="file-selector-primary-label-105 file-selector-secondary-label106" />
                                                <label className="slds-file-selector__body" htmlFor="file-upload-attachments">
                                                    <span className="slds-file-selector__button slds-button slds-button_neutral">
                                                        <Icon
                                                            className="slds-button__icon slds-button__icon_left"
                                                            category="utility"
                                                            name="upload"
                                                            size="xx-small"
                                                            colorVariant="base"
                                                            style={{fill: "#0176d3"}}
                                                        />Upload Image
                                                    </span>
                                                    <span className="slds-file-selector__text slds-medium-show">or Drop Image</span>
                                                </label>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsPanel>
                            <TabsPanel label="Details">
                                <Card
                                    heading={null}
                                    className={"slds-form-card slds-form-card-no-header"}
                                    footer={
                                        state.editMode ?
                                            <div className="slds-p-top_xx-small slds-p-bottom_xx-small">
                                                <Button
                                                    label="Cancel"
                                                    variant="neutral"
                                                    onClick={() => onEdit(false)}
                                                />
                                                <Button
                                                    label="Save"
                                                    variant="brand"
                                                />
                                            </div>
                                        :
                                        null
                                    }
                                >
                                    <div className="slds-p-around_medium slds-p-bottom_none">
                                        <div className={"slds-grid slds-gutters slds-wrap slds-m-bottom_medium "+(state.editMode ? '' : 'readonly_mode')}>
                                            <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2" onDoubleClick={() => onEdit()}>
                                                <div className="slds-form-element slds-m-bottom_x-small">
                                                    <label className="slds-form-element__label" htmlFor="settings-owner">Owner</label>
                                                    <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_right">
                                                        <div className="slds-input" id="settings-owner" readOnly>
                                                            <span className="record-avatar-container slds-avatar slds-avatar_x-small slds-avatar--circle icon slds-m-right_xx-small slds-avatar_profile-image-small"></span>
                                                            {
                                                                state.editMode ?
                                                                    "User User"
                                                                :
                                                                <a href="/">User User</a>
                                                            }
                                                        </div>
                                                        {
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="change_owner"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    state.editMode === false ?
                                                        <Input 
                                                            label="Salutation"
                                                            onChange={(event) => handleChange(event, "salutation")}
                                                            className="slds-m-bottom_x-small"
                                                            value={state.salutation}
                                                            readOnly={(state.editMode === false)}
                                                            iconRight={
                                                                (
                                                                    state.editMode === false ?
                                                                        <InlineIcon
                                                                            name="edit"
                                                                            category="utility"
                                                                            size="xx-small"
                                                                            color="grey"
                                                                            className="slds-input__icon slds-input__icon_right"
                                                                            iconClassName="slds-icon-text-default"
                                                                            onClick={() => onEdit()}
                                                                        />
                                                                    :
                                                                    null
                                                                )
                                                            }
                                                        />
                                                    :
                                                        <Combobox
                                                            events={{
                                                                onSelect: (event, data) => handleSelectChange(data, "salutationSelection", "salutation")
                                                            }}
                                                            labels={{
                                                                label: "Salutation",
                                                                placeholderReadOnly: ""
                                                            }}
                                                            options={getSalutations()}
                                                            onRenderMenuItem={onRenderMenuItem}
                                                            selection={state.salutationSelection}
                                                            variant="readonly"
                                                            classNameContainer={"customize-combobox slds-m-bottom_x-small"+(isModifiedField("salutation") ? ' modified_field' : '')}
                                                            readOnly={(state.editMode === false)}
                                                            required={true}
                                                            errorText={((state.salutation.length <= 0 && state.editMode) ?  'Complete this field.' : null)}
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
                                                }
                                                <Input 
                                                    label="First Name"
                                                    onChange={(event) => handleChange(event, "firstName")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("firstName") ? ' modified_field' : '')}
                                                    value={state.firstName}
                                                    readOnly={(state.editMode === false)}
                                                    required={true}
                                                    errorText={((state.firstName.length <= 0 && state.editMode) ?  'Complete this field.' : null)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Last Name"
                                                    onChange={(event) => handleChange(event, "lastName")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("lastName") ? ' modified_field' : '')}
                                                    value={state.lastName}
                                                    readOnly={(state.editMode === false)}
                                                    required={true}
                                                    errorText={((state.lastName.length <= 0 && state.editMode) ?  'Complete this field.' : null)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Title"
                                                    onChange={(event) => handleChange(event, "title")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("title") ? ' modified_field' : '')}
                                                    value={state.title}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Birthdate"
                                                    onChange={(event) => handleChange(event, "birthdate")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("birthdate") ? ' modified_field' : '')}
                                                    value={state.birthdate}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2" onDoubleClick={() => onEdit()}>
                                                <Input 
                                                    label="Phone"
                                                    onChange={(event) => handleChange(event, "phone")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("phone") ? ' modified_field' : '')}
                                                    value={state.phone}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Home Phone"
                                                    onChange={(event) => handleChange(event, "homePhone")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("homePhone") ? ' modified_field' : '')}
                                                    value={state.homePhone}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Mobile"
                                                    onChange={(event) => handleChange(event, "mobile")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("mobile") ? ' modified_field' : '')}
                                                    value={state.mobile}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Other Phone"
                                                    onChange={(event) => handleChange(event, "otherPhone")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("otherPhone") ? ' modified_field' : '')}
                                                    value={state.otherPhone}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Fax"
                                                    onChange={(event) => handleChange(event, "fax")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("fax") ? ' modified_field' : '')}
                                                    value={state.fax}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                                <Input 
                                                    label="Email"
                                                    onChange={(event) => handleChange(event, "email")}
                                                    className={"slds-m-bottom_x-small"+(isModifiedField("email") ? ' modified_field' : '')}
                                                    value={state.email}
                                                    readOnly={(state.editMode === false)}
                                                    iconRight={
                                                        (
                                                            state.editMode === false ?
                                                                <InlineIcon
                                                                    name="edit"
                                                                    category="utility"
                                                                    size="xx-small"
                                                                    color="grey"
                                                                    className="slds-input__icon slds-input__icon_right"
                                                                    iconClassName="slds-icon-text-default"
                                                                    onClick={() => onEdit()}
                                                                />
                                                            :
                                                                null
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                
                            </TabsPanel>
                            <TabsPanel label="News">
                                <ExpandableSection
                                    id="twitter-expandable-section"
                                    title="Twitter"
                                >
                                    <div className="slds-grid slds-gutters slds-grid_align-spread">
                                        <div className="slds-col slds-size_4-of-6">
                                            <p>Learn More Using Twitter</p>
                                            <p>Sign in to link a Twitter profile, find people in common, and quickly access recent tweets.</p>
                                        </div>
                                        <div className="slds-col slds-size_2-of-6" style={{width: "auto"}}>
                                            <Button>
                                                <img src="/img/social/twitter_mini_logo.png" alt="twitter" />
                                                Sign in with Twitter
                                            </Button>
                                        </div>
                                    </div>
                                    
                                </ExpandableSection>
                            </TabsPanel>
                        </Tabs>
                    </div>
                    <div className="slds-col slds-size_2-of-6">
                        <div className="card-border slds-m-left_x-small slds-p-around_small">
                            <Tabs id="tabs-details-right">
                                <TabsPanel label="Activity">
                                    <div>
                                        <Button
                                            className={"dropdown-more-button-adjacent"}
                                        >
                                            <InlineIcon category="standard" name="task" />
                                        </Button>
                                        <Dropdown
                                            align="right"
                                            options={[]}
                                        >
                                            <DropdownTrigger
                                                triggerClassName={"dropdown-more-button"}
                                            >
                                                <Button
                                                    assistiveText={{ icon: 'More' }}
                                                    iconCategory="utility"
                                                    iconName="down"
                                                    iconVariant="border"
                                                    disabled
                                                />
                                            </DropdownTrigger>
                                        </Dropdown>
                                        <Button
                                            className={"dropdown-more-button-adjacent slds-m-left_xx-small"}
                                        >
                                            <InlineIcon category="standard" name="event" />
                                        </Button>
                                        <Dropdown
                                            align="right"
                                            options={[]}
                                        >
                                            <DropdownTrigger
                                                triggerClassName={"dropdown-more-button"}
                                            >
                                                <Button
                                                    assistiveText={{ icon: 'More' }}
                                                    iconCategory="utility"
                                                    iconName="down"
                                                    iconVariant="border"
                                                    disabled
                                                />
                                            </DropdownTrigger>
                                        </Dropdown>
                                        <Button
                                            className={"dropdown-more-button-adjacent slds-m-left_xx-small"}
                                        >
                                            <InlineIcon category="standard" name="log_a_call" />
                                        </Button>
                                        <Dropdown
                                            align="right"
                                            options={[
                                                { label: 'Option1', value: 'A0' }
                                            ]}
                                        >
                                            <DropdownTrigger
                                                triggerClassName={"dropdown-more-button"}
                                            >
                                                <Button
                                                    assistiveText={{ icon: 'More' }}
                                                    iconCategory="utility"
                                                    iconName="down"
                                                    iconVariant="border"
                                                />
                                            </DropdownTrigger>
                                        </Dropdown>
                                        <Button
                                            className={"dropdown-more-button-adjacent slds-m-left_xx-small"}
                                        >
                                            <InlineIcon category="standard" name="email" />
                                        </Button>
                                        <Dropdown
                                            align="right"
                                            options={[
                                                { label: 'Option1', value: 'A0' }
                                            ]}
                                        >
                                            <DropdownTrigger
                                                triggerClassName={"dropdown-more-button"}
                                            >
                                                <Button
                                                    assistiveText={{ icon: 'More' }}
                                                    iconCategory="utility"
                                                    iconName="down"
                                                    iconVariant="border"
                                                />
                                            </DropdownTrigger>
                                        </Dropdown>
                                    </div>
                                    <div className="slds-text-align_right slds-m-top_small">
                                        Filters: All time • All activities • All types
                                        <Dropdown
                                            align="right"
                                            options={[
                                                { label: 'Option1', value: 'A0' }
                                            ]}
                                        >
                                            <DropdownTrigger
                                                triggerClassName={"slds-m-left_small"}
                                            >
                                                <Button
                                                    assistiveText={{ icon: 'More' }}
                                                    iconCategory="utility"
                                                    iconName="settings"
                                                    iconVariant="border"
                                                />
                                            </DropdownTrigger>
                                        </Dropdown>
                                    </div>
                                    <div className="slds-text-align_right">
                                        <a href="/" className="slds-button">Refresh</a> • 
                                        <a href="/" className="slds-button">Expand All</a> • 
                                        <a href="/" className="slds-button">View All</a>
                                    </div>
                                    <ExpandableSection
                                        id="upcoming-overdue-expandable-section"
                                        title="Upcoming & Overdue"
                                    >
                                        <p className="slds-text-align_center">No activities to show.</p>
                                        <p className="slds-text-align_center">Get started by sending an email, scheduling a task, and more.</p>
                                    </ExpandableSection>
                                    <p className="slds-border_top slds-m-top_medium slds-p-top_medium">No past activity. Past meetings and tasks marked as done show up here.</p>
                                </TabsPanel>
                                <TabsPanel label="Chatter">
                                    <Tabs variant="scoped" id="tabs-chatter">
                                        <TabsPanel label="Post">
                                            <RichTextEditor placeholder="Share an update..." />
                                            <p className="slds-text-align_right">To link to a record, enter / then start typing the record name.</p>
                                            <div>
                                                <strong className="slds-m-right_xx-small">To</strong>
                                                <Dropdown
                                                    align="left"
                                                    buttonVariant="icon"
                                                    iconName="down"
                                                    iconPosition="right"
                                                    checkmark
                                                    label="CloudPremise Only"
                                                    width="xx-small"
                                                    options={[
                                                        { label: 'CloudPremise Only', value: 'A0' },
                                                        { label: 'All with access', value: 'B0' }
                                                    ]}
                                                />
                                            </div>
                                            <div className="slds-display_flex slds-justify_content-space-between slds-align_items-center slds-m-top_small">
                                                <InlineIcon
                                                    name="attach"
                                                    category="utility"
                                                    justIcon
                                                    iconPosition="left"
                                                    size="xx-small"
                                                />
                                                <Button variant="brand">Share</Button>
                                            </div>
                                        </TabsPanel>
                                        <TabsPanel label="Poll">
                                            <Textarea label="Question" placeholder="What would you like to ask?" />
                                            <Input
                                                label="Choice 1"
                                            />
                                            <Input
                                                label="Choice 2"
                                            />
                                            <div className="slds-m-top_small">
                                                <strong className="slds-m-right_xx-small">To</strong>
                                                <Dropdown
                                                    align="left"
                                                    buttonVariant="icon"
                                                    iconName="down"
                                                    iconPosition="right"
                                                    checkmark
                                                    label="CloudPremise Only"
                                                    width="xx-small"
                                                    options={[
                                                        { label: 'CloudPremise Only', value: 'A0' },
                                                        { label: 'All with access', value: 'B0' }
                                                    ]}
                                                />
                                            </div>
                                            <div className="slds-display_flex slds-justify_content-space-between slds-m-top_medium">
                                                <Button
                                                    iconCategory="utility"
                                                    iconName="add"
                                                    variant="brand"
                                                    iconClassName="slds-m-right_x-small"
                                                >
                                                    Add new choice
                                                </Button>
                                                <Button
                                                    variant="brand"
                                                    disabled
                                                >
                                                    Ask
                                                </Button>
                                            </div>
                                        </TabsPanel>
                                        <TabsPanel label="Question">
                                            <Textarea
                                                label="Question (Enter up to 255 characters)"
                                                placeholder="What would you like to know?"
                                            />
                                            <RichTextEditor
                                                label="Details"
                                                placeholder="If you have more to say, add details here..."
                                            />
                                            <p className="slds-text-align_right">To link to a record, enter / then start typing the record name.</p>
                                            <div>
                                                <strong className="slds-m-right_xx-small">To</strong>
                                                <Dropdown
                                                    align="left"
                                                    buttonVariant="icon"
                                                    iconName="down"
                                                    iconPosition="right"
                                                    checkmark
                                                    label="CloudPremise Only"
                                                    width="xx-small"
                                                    options={[
                                                        { label: 'CloudPremise Only', value: 'A0' },
                                                        { label: 'All with access', value: 'B0' }
                                                    ]}
                                                />
                                            </div>
                                            <div className="slds-display_flex slds-justify_content-space-between slds-align_items-center slds-m-top_small">
                                                <InlineIcon
                                                    name="attach"
                                                    category="utility"
                                                    justIcon
                                                    iconPosition="left"
                                                    size="xx-small"
                                                />
                                                <Button variant="brand">Ask</Button>
                                            </div>
                                        </TabsPanel>
                                    </Tabs>
                                    <div className="slds-display_flex slds-justify_content-space-between slds-m-top_medium">
                                        <Dropdown
                                            align="left"
                                            buttonVariant="icon"
                                            iconCategory="utility"
                                            iconName="sort"
                                            iconPosition="left"
                                            iconVariant="more"
                                            checkmark
                                            width="x-small"
                                            options={[
                                                { label: 'Latest Posts', value: 'A0' },
                                                { label: 'Most Recent Activity', value: 'B0' }
                                            ]}
                                        />
                                        <div className="slds-display_inline-flex">
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
                                                placeholder="Search this field..."
                                            />
                                            <Button
                                                variant="icon"
                                                iconCategory="utility"
                                                iconName="refresh"
                                                iconVariant="border"
                                                className="slds-m-left_small"
                                            />
                                        </div>
                                    </div>
                                    <img className="slds-m-top_large" src="/img/chatter/OpenRoad.svg" alt="" />
                                    <h3 className="slds-text-align_center slds-text-heading_medium slds-m-top_large">Collaborate here!</h3>
                                    <p className="slds-text-align_center slds-m-top_small slds-m-bottom_medium">Here's where you start talking with your colleagues about this record.</p>
                                </TabsPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Details;