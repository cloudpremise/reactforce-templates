import React from "react";
import PropTypes from "prop-types";
import Modal from '@salesforce/design-system-react/components/modal'; 
import Button from '@salesforce/design-system-react/components/button';
import stateReducer from "../../hooks/stateReducer";
import Input from '../Input';
import Spinner from '@salesforce/design-system-react/components/spinner';
import Api from "../../Api";
import Textarea from '@salesforce/design-system-react/components/textarea';
import Confirmation from  "./Confirmation";
import { getParam } from "../../ApexAdapter";

const CaseModal = (props) => {
    let defaultState = {
        Id: "",
        Subject: "",
        Description: "",
        Comment: "",
        IsClosed: false,
        modifiedFields: {},
        error: true,
        errorMessage: null,
        loading: false,
        deleteModal: false,
        hasModifiedFields: false,
        verifiedEntity: props.verifiedEntity,
        comments: [],
        loadComments: true,
        loadingComments: false,
        item: null,
        closeModal: false
    };
    if(props.item !== null){
        defaultState = {
            ...defaultState,
            ...props.item,
            item: props.item
        };
    }
    const [state, setState] = React.useReducer(stateReducer, defaultState);
    React.useEffect(() => {
        if(!state.loadComments || state.Id.length <= 0){
            return;
        }
        getCaseComments();
    });
    function getCaseComments(){
        const { Id, Comment, loading } = state;
        if(loading){
            return;
        }
        const key = localStorage.getItem("secure_link_key");
        const secureLink  = getParam("secureLink");
        const requestData = {
            CommentBody: Comment,
        };
        let headers = {
            SECURE_KEY: key,
            SECURE_LINK: secureLink
        };
        let method = 'GET';
        let route = '/v1/public_case_access/'+Id+'/comments';

        Api.apexAdapter({}, route, method, requestData, headers).then((response) => {
            const result = response.result;
            setState({
                type: "update",
                state: {
                    loadComments: false,
                    loadingComments: false,
                    errorMessage: null,
                    comments: result
                }
            });
        }).catch(err => {
            setState({
                type: "update",
                state: {
                    loadComments: false,
                    loadingComments: false,
                    errorMessage: null
                }
            });
        });

        setState({
            type: "update",
            state: {
                loadComments: false,
                loadingComments: true,
                errorMessage: null
            }
        });
    }
    function handleChange(event, name){
        const value = event.target.value;
        setState({
            type: "update",
            state: {
                [name]: value,
                hasModifiedFields: true
            }
        });
    }
    function onSuccess(){
        const { Id, Subject, Description } = state;
        const key = localStorage.getItem("secure_link_key");
        const secureLink  = getParam("secureLink");
        const requestData = {
            Subject: Subject,
            Description: Description
        };
        let headers = {
            SECURE_KEY: key,
            SECURE_LINK: secureLink
        };
        let method = 'POST';
        let route = '/v1/public_case_access';
        if(Id !== null && Id.length > 0){
            method = 'POST';
        }

        Api.apexAdapter({}, route, method, requestData, headers).then((response) => {
            const result = response.result;
            props.onSuccess(result);
        }).catch(err => {
            console.log(err);
        });

        setState({type: "update", state: {
            loading: true,
        }});
    }
    function isFormValid(){
        const { Subject } = state;
        if(Subject.length > 0){
            return true;
        }
        return false;
    }
    function getHeading(){
        const { verifiedEntity, Id } = state;
        let heading = "You will be creating this case as "+verifiedEntity.firstName+" "+verifiedEntity.lastName+" with Id: "+verifiedEntity.id;
        if(Id !== null && Id.length > 0){
            heading = "You will be modifying this case as "+verifiedEntity.firstName+" "+verifiedEntity.lastName+" with Id: "+Id;
        }
        return heading;
    }
    function onAddComment(){
        const { Id, Comment, loading } = state;
        if(loading){
            return;
        }
        const key = localStorage.getItem("secure_link_key");
        const secureLink  = getParam("secureLink");
        const requestData = {
            CommentBody: Comment,
        };
        let headers = {
            SECURE_KEY: key,
            SECURE_LINK: secureLink
        };
        let method = 'POST';
        let route = '/v1/public_case_access/'+Id+'/comments';
        Api.apexAdapter({}, route, method, requestData, headers).then((response) => {
            const result = response.result;
            const comments = [result].concat(state.comments);
            setState({
                type: "update",
                state: {
                    loading: false,
                    comments: comments,
                    Comment: ""
                }
            })
        }).catch(err => {
            console.log(err);
        });

        setState({type: "update", state: {
            loading: true,
        }});
    }
    function renderComments(){
        const { loadingComments, comments } = state;
        if(loadingComments || !Array.isArray(comments)){
            return;
        }
        return (
            <ul class="slds-has-block-links_space slds-m-top_small">
                {
                    comments.map(comment => {
                        return (
                            <li className="slds-p-around_x-small" key={comment.Id}>
                                {comment.CommentBody}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    function onCloseCase(){
        const { Id, loading } = state;
        if(loading){
            return;
        }
        const key = localStorage.getItem("secure_link_key");
        const secureLink  = getParam("secureLink");
        const requestData = {};
        let headers = {
            SECURE_KEY: key,
            SECURE_LINK: secureLink
        };
        let method = 'PATCH';
        let route = '/v1/public_case_access/'+Id+'/close';
        Api.apexAdapter({}, route, method, requestData, headers).then((response) => {
            const result = response.result;
            setState({
                type: "update",
                state: {
                    loading: false,
                    ...result,
                    item: result
                }
            });
        }).catch(err => {
            console.log(err);
        });

        setState({type: "update", state: {
            loading: true,
            closeModal: false
        }});
    }
    function onConfirmationModal(status = false){
        setState({
            type: "update",
            state: {
                closeModal: status
            }
        });
    }
    return (
        <Modal
            isOpen={props.open}
            portalClassName="slds-scope"
            footer={[
                state.loading ?
                    <div key="spinner" className="slds-is-relative" style={{height: "45px"}}>
                        <Spinner
                            size="medium"
                            variant="brand"
                            assistiveText={{ label: 'Saving Case...' }}
                        />
                    </div>
                :
                    <>
                        {
                            state.error && state.errorMessage !== null ?
                                <p key="error" className="slds-m-bottom_small">{state.errorMessage}</p>
                            :
                            null
                        }
                        <Button key="cancel" label="Cancel" onClick={() => props.onCancel(state.item)} />
                        {
                            state.Id.length > 0 ?
                                <Button key="closeCase" disabled={state.IsClosed} label="Close this Case" onClick={() => onConfirmationModal(true)} />
                            :
                            null
                        }
                        {
                            state.Id <= 0 ?
                                <Button key="save" label="Submit & Close" variant="brand" disabled={!isFormValid()} onClick={onSuccess} />
                            :
                            null
                        }
                    </>
            ]}
            onRequestClose={() => props.onCancel(state.item)}
            heading={getHeading()}
        >
            <div className="slds-p-around_medium">
                <Input
                    label="Subject"
                    onChange={(event) => handleChange(event, "Subject")}
                    className="slds-m-bottom_x-small"
                    value={state.Subject}
                    required={true}
                    disabled={(state.Id.length > 0)}
                />
                <Textarea
                    label="Description"
                    onChange={(event) => handleChange(event, "Description")}
                    className="slds-m-bottom_x-small"
                    value={state.Description}
                    disabled={(state.Id.length > 0)}
                />
                {
                    state.IsClosed ?
                        <Input
                            label="Status"
                            className="slds-m-bottom_x-small"
                            value={"Closed"}
                            disabled={(state.Id.length > 0)}
                        />
                    :
                    null
                }
                {
                    state.IsClosed === false && state.Id.length > 0 ?
                        <>
                            <Input
                                label="Enter Comment"
                                onChange={(event) => handleChange(event, "Comment")}
                                className="slds-m-bottom_x-small"
                                value={state.Comment}
                            />

                            <div>
                                <Button key="addComment" disabled={state.IsClosed} label="Add Comment" variant="brand" onClick={onAddComment} />
                            </div>
                        </>
                    :
                    null
                }
                {
                    state.loadingComments ?
                        <div key="spinner" className="slds-is-relative slds-m-top_x-large" style={{height: "45px"}}>
                            <Spinner
                                size="medium"
                                variant="brand"
                                assistiveText={{ label: 'Loading Comments...' }}
                                hasContainer={false}
                                isInline
                            />
                        </div>
                    :
                        renderComments()
                }
                {
                    state.closeModal ?
                        <Confirmation
                            open={state.closeModal}
                            item={state.caseRow}
                            onCancel={() => onConfirmationModal(false)}
                            onSuccess={onCloseCase}
                            message={"Are you sure you want to close this case?"}
                            saving={state.saving}
                            errorMessage={state.errorMessage}
                        />
                    :
                    null
                }
            </div>
        </Modal>
    )
};

CaseModal.defaultProps = {
    item: null
}
CaseModal.propTypes = {
    classes: PropTypes.object,
    onCancel: PropTypes.func,
    onSuccess: PropTypes.func,
    onDelete: PropTypes.func,
    open: PropTypes.bool,
    item: PropTypes.object,
    verifiedEntity: PropTypes.object
};

export default CaseModal;