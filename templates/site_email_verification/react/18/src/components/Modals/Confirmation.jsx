import React from "react";
import PropTypes from "prop-types";
import Modal from '@salesforce/design-system-react/components/modal'; 
import Button from '@salesforce/design-system-react/components/button';
import Spinner from '@salesforce/design-system-react/components/spinner';


const Confirmation = (props) => {
    let footer = null;
    if(!props.saving){
        footer = [
            <Button label="Cancel" onClick={props.onCancel} />,
            <Button label="Yes" variant="brand" onClick={props.onSuccess} />
        ];
    }
    function onRequestClose(){
        if(props.saving){
            return;
        }
        props.onCancel();
    }
    return (
        <Modal
            isOpen={props.open}
            footer={footer}
            onRequestClose={onRequestClose}
            portalClassName="slds-scope"
        >
            {
                props.errorMessage !== null ?
                    <div class="slds-notify slds-notify_alert slds-theme_error" role="alert">
                        {props.errorMessage}
                    </div>
                :
                null
            }
            {
                props.saving ?
                    <div className="slds-is-relative" style={{height: "150px"}}>
                        <Spinner
                            size="large"
                            variant="brand"
                            hasContainer={false}
                            assistiveText={{ label: 'Loading...' }}
                        />
                    </div>
                :
                    <p className="slds-p-around_medium slds-text-heading_small">{props.message}</p>
            }
        </Modal>
    )
};

Confirmation.defaultProps = {
    item: null,
    message: "Are you sure you want to delete?"
}
Confirmation.propTypes = {
    classes: PropTypes.object,
    onCancel: PropTypes.func,
    onSuccess: PropTypes.func,
    open: PropTypes.bool,
    item: PropTypes.object,
    message: PropTypes.string
};

export default Confirmation;