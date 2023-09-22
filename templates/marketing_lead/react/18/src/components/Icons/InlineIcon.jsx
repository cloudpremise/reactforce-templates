import React from "react";
import Icon from '@salesforce/design-system-react/components/icon';
import InputIcon from '@salesforce/design-system-react/components/icon/input-icon';

const InlineIcon = (props) => {
    const { category, name, inputIcon, combobox, size, color, iconClassName, iconPosition, onClick, className, justIcon, ...rest} = props;
    function renderInputIcon(){
        if(combobox){
            return (
                <InputIcon
                    className={'slds-icon_container slds-input__icon slds-input__icon_'+iconPosition}
                    color={color}
                    category={category}
                    icon={require("@salesforce/design-system-react/icons/"+category+"/"+name).default}
                    name={name}
                    size={size}
                    {...rest}
                />
            )
        }
        return (
            <InputIcon
                className={'slds-input__icon slds-icon-text-default slds-input__icon_'+iconPosition+"slds-icon slds-icon_"+size+" slds-icon_color_"+color+" "+iconClassName}
                color={color}
                category={category}
                icon={require("@salesforce/design-system-react/icons/"+category+"/"+name).default}
                name={name}
                size={size}
                {...rest}
            />
        )
    }
    if(justIcon){
        return (
            <Icon
                className={"slds-icon slds-icon_"+size+" slds-icon_color_"+color+" "+iconClassName}
                containerClassName={"slds-icon_container slds-icon-"+category+"-"+name+" "+className}
                color={color}
                category={category}
                icon={require("@salesforce/design-system-react/icons/"+category+"/"+name).default}
                name={name}
                size={size}
                {...rest}
            />
        )
    }
    return (
        inputIcon ?
            typeof(onClick) === "function" ?
                <button
                    className={"slds-button slds-button_icon slds-input__icon slds-input__icon_"+iconPosition}
                    onClick={onClick}
                >
                    <Icon
                        className={"slds-button__icon "+iconClassName}
                        color={color}
                        category={category}
                        icon={require("@salesforce/design-system-react/icons/"+category+"/"+name).default}
                        name={name}
                        size={size}
                        {...rest}
                    />
                </button>
            :
                renderInputIcon()
            
        :
            <span onClick={onClick}>
                <Icon
                    className={"slds-icon slds-icon_"+size+" slds-icon_color_"+color+" "+iconClassName}
                    containerClassName={"slds-icon_container slds-icon-"+category+"-"+name+" "+className}
                    color={color}
                    category={category}
                    icon={require("@salesforce/design-system-react/icons/"+category+"/"+name).default}
                    name={name}
                    size={size}
                    {...rest}
                />
            </span>
            
    )
};

InlineIcon.defaultProps = {
    className: "",
    color: "",
    size: "small",
    iconClassName: "",
    onClick: null,
    justIcon: false
};

export default InlineIcon;