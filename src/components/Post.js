import React from 'react';
import { API_BASE_URL } from '../config';
import { Link, withRouter } from 'react-router-dom';
import { loadAuthToken } from '../local-storage';
import { connect } from 'react-redux';
import Input from './input';
import EditPostForm from './EditPost';
import { Helmet } from 'react-helmet';

export class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: [],
            tags: [],
            error: null,
            editing: false
        }
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(e) {
        e.preventDefault();
        const token = loadAuthToken();
        const slug = this.props.location.pathname.split('/')[3];


        return fetch(`${API_BASE_URL}/posts/post/${slug}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(data => {
                this.props.history.push('/posts');
            })
    }

    loadDisqus() {
        (function () { // DON'T EDIT BELOW THIS LINE
            var d = document,
                s = d.createElement('script');
            s.src = 'https://everycookandcranny.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    }

    componentDidMount() {
        this.loadDisqus();
        const category = this.props.location.pathname.split('/')[1];
        const slug = this.props.location.pathname.split('/')[2];
        console.log(category);


        return fetch(`${API_BASE_URL}/posts/post/${slug}`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error(res.error);
            })
            .then(data => {
                console.log(data);
                if (category !== data.category) {
                    throw new Error('Error');
                }
                this.setState({
                    post: data,
                    tags: data.tags
                });
            })
            .catch(error => {
                this.setState({
                    error: 'Blog post cannot be found'
                });
            }
            )
    }

    setEditing(editing) {
        this.setState({
            editing
        });
    }



    render() {
        const { post, tags, error, editing } = this.state;


        if (error) {
            return <div>{error}</div>;
        }

        if (!this.state.editing) {
            return (
                <section id="post">
                    <Helmet>
                        <meta name="description" content={post.metaDescription} />
                    </Helmet>
                    {
                        this.props.loggedIn ?
                            (<div id="edit-delete-container"><a href="#" onClick={() => this.setEditing(true)}>Edit</a><a href="#" onClick={this.handleDelete}>Delete</a></div>)
                            :
                            (null)
                    }
                    <h2>{post.title}</h2>
                    <img src={post.image} />
                    <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
                    <div id="flex-container-tags">
                        <h3>Tagged with: </h3>
                        <ul>
                            {tags.map((tag, i) => <li key={i}><Link to={`/tags/${tag}`}>{tag}</Link></li>)}
                        </ul>
                    </div>
                    <h4>COMMENTS:</h4>
                    <div id="disqus_thread"></div>
                </section>
            )
        }


        return (
            <EditPostForm {...this.state} />
        )
    }
};

const mapStateToProps = state => ({
    loggedIn: state.auth.currentUser !== null
});

export default withRouter(connect(mapStateToProps)(Post));
