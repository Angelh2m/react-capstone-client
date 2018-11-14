import React from 'react';
import { reduxForm, Field, SubmissionError, focus } from 'redux-form';
import Input from './input';
import { required, nonEmpty } from '../validators';
import { API_BASE_URL } from '../config';
import { loadAuthToken } from '../local-storage';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export class PostForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            body: '',

        }
        this.htmlBody = React.createRef();
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });

    };

    onSubmit(values) {

        const payload = {
            ...values,
            body: this.htmlBody.current.defaultValue,
            seoUrl: values.seoUrl.replace(/[\W]+/g, '-'),
            category: values.category.replace(/[\W]+/g, '-')
        }

        console.log(payload);


        const token = loadAuthToken();
        fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    if (
                        res.headers.has('content-type') &&
                        res.headers
                            .get('content-type')
                            .startsWith('application/json')
                    ) {
                        // It's a nice JSON error returned by us, so decode it
                        return res.json().then(err => Promise.reject(err));
                    }
                    // Otherwise it is a les informative error returned by express
                    return Promise.reject({
                        code: res.status,
                        message: res.statusText
                    });
                }
                return;
            })
            .then(() => console.log('Submitted with values', values))
            .catch(err => {
                const { reason, message, location } = err;
                if (reason === 'ValidationError') {
                    //convert validationErrors into SubmissionErrors for Redux Form
                    return Promise.reject(
                        new SubmissionError({
                            [location]: message
                        })
                    );
                }
                // return Promise.reject(
                //     new SubmissionError({
                //         _error: 'Error submitting message'
                //     })
                // )
            });
    }



    render() {
        let successMessage;
        if (this.props.submitSucceeded) {
            successMessage = (
                <div className="message message-success">
                    Post successfully created.
                </div>
            );
        }

        let errorMessage;
        if (this.props.error) {
            errorMessage = (
                <div className="message message-error">{this.props.error}</div>
            );
        }

        const { editorState } = this.state;

        return (
            <div>
                <form
                    onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
                >
                    <h2>MAKE NEW BLOG POST</h2>
                    {successMessage}
                    {errorMessage}
                    <Field
                        name="title"
                        type="text"
                        component={Input}
                        label="Title"
                        validate={[required, nonEmpty]}
                    />
                    <Field
                        name="category"
                        element="textarea"
                        component={Input}
                        label="Category"
                        validate={[required, nonEmpty]}
                    />
                    <Field
                        name="seoUrl"
                        element="seoUrl"
                        component={Input}
                        label="seoUrl"
                        validate={[required, nonEmpty]}
                    />
                    <Field
                        name="metaDescription"
                        element="metaDescription"
                        component={Input}
                        label="metaDescription"
                        validate={[required, nonEmpty]}
                    />

                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />
                    <textarea
                        disabled
                        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                        ref={this.htmlBody}
                    />

                    <button
                        type="submit"
                        disabled={this.props.pristine || this.props.submitting}>
                        Make Post
                </button>
                </form>
            </div>
        )
    }
}


export default reduxForm({
    form: 'post',
    onSubmitFail: (errors, dispatch) =>
        dispatch(focus('post', Object.keys(errors)[0]))
})(PostForm);
