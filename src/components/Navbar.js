import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { clearAuth } from '../actions/auth';
import { clearAuthToken } from '../local-storage';
import { connect } from 'react-redux';


export class Navbar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            searchTerm: '',
            isNavActive: false,
            isSearchActive: false
        }
        this.searching = this.searching.bind(this)
        this.erase = this.erase.bind(this)
        this.toggle = this.toggle.bind(this)
        this.toggleSearch = this.toggleSearch.bind(this)
        this.submitSearch = this.submitSearch.bind(this)
    }

    toggle(e) {
        this.setState({
            isNavActive: !this.state.isNavActive
        })
    }

    toggleSearch() {

        this.setState({
            isSearchActive: !this.state.isSearchActive
        })

        if (this.state.searchTerm.length >= 2) {
            this.erase();
            this.setState({
                isNavActive: !this.state.isNavActive
            })
        }
    }

    logOut() {
        clearAuthToken();
        this.props.dispatch(clearAuth());
    }


    searching(e) {
        this.setState({
            ...this.state.searchTerm,
            searchTerm: e.target.value
        })


    }
    submitSearch(e) {
        if (e.keyCode === 13) {
            this.props.history.push(`/search/${this.state.searchTerm}`);
            this.erase()
            this.setState({
                isNavActive: !this.state.isNavActive,
                isSearchActive: !this.state.isSearchActive
            })
        }

    }

    erase() {
        this.setState({
            ...this.state.searchTerm,
            searchTerm: ''
        })
    }


    render() {
        return (
            <div>
                <i onClick={this.toggle}>
                    <svg className="burger--button" aria-hidden="true" data-prefix="far" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z" ></path></svg>
                </i>
                <nav className={this.state.isNavActive ? 'active' : ''}>
                    {

                        <ul >
                            <div className="nav-flex " onClick={this.toggle}>
                                <li><Link to="/about-me-page">About Me</Link></li>
                                {
                                    this.props.loggedIn ?
                                        (<li><a onClick={() => this.logOut()}>Log out</a></li>)
                                        :
                                        (<React.Fragment>
                                            <li><Link to="/registration-page">Sign up</Link></li>
                                            <li><Link to="/login">Login</Link></li>
                                        </React.Fragment>)
                                }
                                <li><Link to="/posts">All Posts</Link></li>
                                {this.props.loggedIn ? <li><Link to="/post-form">Make new post</Link></li> : null}

                            </div>
                            <li className="search-bar">


                                <Link to={`/search/${this.state.searchTerm}`} >
                                    <i onClick={() => { this.toggleSearch() }}>
                                        <svg aria-hidden="true" data-prefix="far" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z" ></path></svg>
                                    </i>
                                </Link>
                                {
                                    <input className={this.state.isSearchActive ? 'active' : ''} placeholder="Search..." onChange={this.searching} onKeyDown={this.submitSearch} value={this.state.searchTerm} type="text" />
                                }
                            </li>
                        </ul>
                    }

                </nav>
            </div>

        )
    }
};

const mapStateToProps = state => ({
    loggedIn: state.auth.currentUser !== null
});

export default withRouter(connect(mapStateToProps)(Navbar));

