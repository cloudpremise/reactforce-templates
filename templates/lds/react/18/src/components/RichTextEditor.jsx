import React from "react";
import InlineIcon from "./Icons/InlineIcon";

const RichTextEditor = (props) => {
    return (
        <div class="demo-only" style={{minHeight: "18px"}}>
            <div class="slds-form-element">
                {
                    props.label !== null ?
                        <label className="slds-form-element__label">
                            {props.label}
                        </label>
                    :
                        null
                }
                <div class="slds-form-element__control">
                    <div class="slds-rich-text-editor slds-grid slds-grid_vertical slds-nowrap">
                        <div class="slds-rich-text-editor__textarea slds-grid">
                            <div aria-label={props.placeholder} contenteditable="true" class="slds-rich-text-area__content slds-text-color_weak slds-grow">{props.placeholder}</div>
                        </div>
                        <div role="toolbar" class="slds-rich-text-editor__toolbar slds-shrink-none slds-rich-text-editor__toolbar_bottom">
                            <ul aria-label="Format text" class="slds-button-group-list">
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="0">
                                        <InlineIcon
                                            name="bold"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="italic"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="underline"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="strikethrough"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="remove_formatting"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                            </ul>
                            <ul aria-label="Format body" class="slds-button-group-list">
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="richtextbulletedlist"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="richtextnumberedlist"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                            </ul>
                            <ul aria-label="Format body" class="slds-button-group-list">
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="image"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="link"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="emoji"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                                <li>
                                    <button class="slds-button slds-button_icon slds-button_icon-border-filled" tabindex="-1">
                                        <InlineIcon
                                            name="adduser"
                                            category="utility"
                                            size="xx-small"
                                            justIcon
                                        />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

RichTextEditor.defaultProps = {
    label: null,
    placeholder: ""
}

export default RichTextEditor;