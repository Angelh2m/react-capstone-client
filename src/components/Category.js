import React from 'react';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import { fetchPosts } from '../actions/fetchPosts';
import { connect } from 'react-redux';

export class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 3
        }

        console.log('SEARCH BY CATEGORY');


    }
    componentDidMount() {
        const category = this.props.location.pathname.split('/')[1];
        console.warn(category);

        this.props.dispatch(fetchPosts(this.state.limit, category));
        this.setState({
            limit: this.state.limit + 3
        })
    }

    seeMorePosts(e) {
        e.preventDefault();
        this.props.dispatch(fetchPosts(this.state.limit))
        this.setState({
            limit: this.state.limit + 3
        })
    }

    render() {
        if (this.props.loading) {
            return (
                <div id="loading-section">
                    <p>Loading posts...</p>
                    <div className="loader"></div>
                </div>
            )
        } else if (this.props.error) {
            return <div>Error! {this.props.error}</div>
        }

        return (
            <div>
                {
                    this.props.posts.posts.map((post, i) => (
                        <section id="posts-section" key={i}>
                            <h2 id="posts-h2">{post.title}</h2>
                            <img className="blog-post-pic" src={post.image} alt="blog-post-pic" />
                            <TextTruncate
                                line={7}
                                truncateText="…"
                                text={post.body}
                            />
                            <Link to={`/${post.category}/${post.slug}`}><button>Read more...</button></Link>
                        </section>
                    ))
                }
                <button onClick={(e) => this.seeMorePosts(e)}>See more posts →</button>
            </div>
        )
    }
};

export const mapStateToProps = state => ({
    posts: state.postData,
    loading: state.postData.loading,
    error: state.postData.error
});

export default connect(mapStateToProps)(Category);