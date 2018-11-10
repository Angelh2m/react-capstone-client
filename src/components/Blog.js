import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import Posts from './Posts';
import Sidebar from './Sidebar';
import AboutMePage from './About-me-page';
import PostForm from './PostForm';
import RegistrationPage from './registration-page';
import Login from './login';
import Homepage from './homepage';
import Post from './Post';
import contactForm from './contact-form';
import TaggedPosts from './Tagged-posts';
import NoMatch from './NoMatch';
import { refreshAuthToken } from '../actions/auth';
import { Helmet } from 'react-helmet';


import {
    Route,
    Switch,
    withRouter
} from 'react-router-dom';


export class Blog extends Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            //Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            60 * 60 * 1000 //one hour
        );
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    render() {
        let location = this.props.location.pathname.split('/');
        return (
            <div className="app">
                <div>
                    <Helmet>
                        <title>Annah's blog | {location[location.length - 1].replace(/(-)/g, ' ')}</title>
                        <meta name="description" content="Annah's blog" />
                        <meta name="theme-color" content="" />
                    </Helmet>
                    {console.log()
                    }
                </div>
                <Navbar />
                <Header />
                <div className="flex-container">
                    <div className="flex-container__main" >
                        <Switch>
                            <Route exact path="/about-me-page" component={AboutMePage} />
                            <Route exact path="/post-form" component={PostForm} />
                            <Route exact path="/registration-page" component={RegistrationPage} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/posts" component={Posts} />
                            <Route exact path="/" component={Homepage} />
                            <Route exact path="/contact" component={contactForm} />
                            <Route exact path="/posts/post/:postSlug" component={Post} />
                            <Route exact path="/tags/:tag" component={TaggedPosts} />
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                    {this.props.location.pathname !== '/' && this.props.location.pathname !== '/about-me-page' ?
                        <div className="flex-container__sidebar">
                            <Sidebar />
                        </div>
                        : null
                    }
                </div>
                <Footer />
            </div>

        )
    }
}

const mapStateToProps = state => ({
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null
});

export default withRouter(connect(mapStateToProps)(Blog));
