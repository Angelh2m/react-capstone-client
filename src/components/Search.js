import React from 'react';
import { Link } from 'react-router-dom';
// import TextTruncate from 'react-text-truncate';
// import { fetchPosts } from '../actions/fetchPosts';
import { connect } from 'react-redux';
// import { API_BASE_URL } from '../config';

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 3,
            inCategories: [],
            inTags: []
        }
    }



    fetchSearchTerm() {
        let location = this.props.location.pathname.split('/');

        this.setState({
            location: location[location.length - 1]
        })

        fetch(`http://localhost:4000/search/${this.state.location}`)
            .then(res => {
                return res.json()
            })
            .then(posts => {
                console.log("FETCHED", posts);

                this.setState({
                    inCategories: [...posts.category],
                    inTags: [...posts.tags],
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentWillReceiveProps(props) {
        console.warn('UPDAte now', props);
        setTimeout(() => {

            this.fetchSearchTerm()
        }, 0);

    }

    componentDidMount() {
        this.fetchSearchTerm()
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
            <div >
                <h2>Blog posts results: {this.state.location}</h2>

                {
                    this.state.inTags.map((el, i) => (
                        <div className="results-grid">
                            <div key={i}>
                                <Link to={`/${el.category}/${el.seoUrl}`}>
                                    <img className="img-thumbnail" src={el.image} alt={el.title} />
                                    <h2>{el.title}</h2>
                                </Link>
                            </div>
                        </div>
                    ))
                }

                {
                    this.state.inCategories.map((el, i) => (
                        <div className="results-grid">
                            <div key={i}>
                                <Link to={`/${el.category}/${el.seoUrl}`}>
                                    <img className="img-thumbnail" src={el.image} alt={el.title} />
                                    <h2>{el.title}</h2>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>

        )
    }
};

export const mapStateToProps = state => ({
    posts: state.postData,
    loading: state.postData.loading,
    error: state.postData.error
});

export default connect(mapStateToProps)(Search);