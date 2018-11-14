import React from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { loadAuthToken } from '../local-storage';
import { API_BASE_URL } from '../config';

import { ContentState, EditorState, RichUtils, convertToRaw } from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { getListFromS3 } from '../services/GetListFromS3';
import { deleteListFromS3 } from '../services/GetListFromS3';
import { addToListS3 } from '../services/GetListFromS3';


export class EditPostForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty(),
            body: '',
            bucket: '',
            images: [
            ],
        }

        this.htmlBody = React.createRef();
        this.imageUpload = React.createRef();
        this.handleImageSubmision = this.handleImageSubmision.bind(this)
        this.removeImage = this.removeImage.bind(this)

        /* *
        *  HANDLE PREVIOUS BODY CONTENT
        */
        let editorState;
        const processedHTML = DraftPasteProcessor.processHTML(this.props.post.body);
        const contentState = ContentState.createFromBlockArray(processedHTML);
        editorState = EditorState.createWithContent(contentState);
        editorState = EditorState.moveFocusToEnd(editorState);

        this.state = {
            ...this.state,
            editorState: editorState
        };

        /* *
        *  Get LIST FROM S3
        */
        console.log('Bucket', this.props.post.bucket);

        Promise.all([getListFromS3(this.props.post.bucket)]).then((values) => {

            this.setState({
                ...this.state,
                images: [...values[0]]
            });
            console.log(this.state.images);
        });

    }

    removeImage(e) {
        let index = e.target.id;
        let imagePath = this.state.images[index].split('/');

        Promise.all([deleteListFromS3(imagePath[0], imagePath[1])]).then((values) => {
            this.setState({
                images: this.state.images.filter((el, i) => i !== Number(index))
            })
            console.warn('RMOVED', this.state.images);
        });
    }

    componentDidMount() {

        this.props.initialize({
            title: this.props.post.title,
            image: this.props.post.image,
            body: this.props.post.body,
            seoUrl: this.props.post.seoUrl,
            tags: this.props.post.tags,
            bucket: this.props.post.bucket,
            published: this.props.post.published,
        });

        this.setState({
            ...this.state,
            bucket: this.props.post.bucket
        })
    }

    handleImageSubmision(e) {

        Promise.all([addToListS3(this.props.post.bucket, this.imageUpload.current.files[0])]).then((data) => {
            console.log(data);

            const file = [`${data[0].imageUrl.key}`];
            this.setState({
                images: [...this.state.images, ...file]
            })
            console.log('Warn UPLOAD ', this.state.images);
        });

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSubmit(values) {
        const token = loadAuthToken();

        values = {
            ...values,
            body: this.htmlBody.current.defaultValue,
        }

        return fetch(`${API_BASE_URL}/posts/post/${this.props.post.slug}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })
            .then(() => console.log('Submitted with values', values))
            .catch(error => console.log(error));
    }

    reset() {
        this.props.dispatch(reset('EditPostForm'));
    }


    render() {

        const { editorState } = this.state;
        let successMessage;

        if (this.props.submitSucceeded) {
            successMessage = (
                <div className="message message-success">
                    Post successfully updated.
                </div>
            );
        }



        return (
            <div>

                <div>
                    {this.state.images.map((el, i) => (
                        <div key={i} className="images-available">
                            <span onClick={this.removeImage} id={i} > X </span>
                            <img className="image-thumbnail" src={`https://s3.amazonaws.com/livingwithannah/${el}`} alt="el.img" />
                        </div>
                    ))}
                </div>
                <br />

                <div>
                    <h3>Image Upload</h3>
                    <form onSubmit={this.handleImageSubmision}>
                        <div className="flex">
                            <input onChange={this.handleImageSubmision}
                                ref={this.imageUpload}
                                id="image" name="image" type="file" />
                        </div>
                    </form>

                </div>
                <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
                    {successMessage}
                    <div>
                        <label>Title</label>
                        <div>
                            <Field
                                name="title"
                                component="input"
                                type="text"
                            />
                        </div>
                    </div>


                    <div>
                        <label>seoUrl</label>
                        <div>
                            <Field
                                name="seoUrl"
                                component="input"
                                type="text"
                            />
                        </div>
                    </div>
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
                    <div>
                        <label>Published</label>
                        <div className="published">
                            <Field
                                name="published"
                                component="input"
                                checked={this.props.published}
                                type="checkbox"
                            />
                        </div>
                    </div>
                    <div>
                        <label>Main image</label>
                        <div >
                            <Field
                                name="image"
                                component="input"
                                type="text"
                            />
                        </div>
                        <br />
                    </div>
                    <div>
                        <label>Tags</label>
                        <div>
                            <Field
                                name="tags"
                                component="input"
                                type="text"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => this.reset()}>
                            Undo Changes
                    </button>
                    </div>
                </form>
            </div>
        )
    }
}


export default reduxForm({
    form: 'EditPostForm', // a unique identifier for this form
})(EditPostForm);

