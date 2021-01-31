import React from 'react';
import { Helmet } from 'react-helmet';

import env from 'app/app.env';
import { createForum } from '@peerboard/core';

import CommunityLayout from './community.layout';

const boardID = 1504465751;
const pathPrefix = '/community';

export default class Community extends React.Component {

  containerRef = React.createRef<HTMLDivElement>();

  state = {
    error: null,
    loading: true,
  };


  async createPeerBoard() {
    const options = {
      prefix: pathPrefix,
      minHeight: window.innerHeight,
      hideMenu: false,

      onTitleChanged: (title:string) =>
        window.document.title = title,

      onReady: () => this.setState({
        loading: false,
      }),

      onFail: () => {
        this.setState({
          error: 'Failed to load forum...',
        })
      },
    };

    createForum(boardID, this.containerRef.current as HTMLElement, options);
  }

  componentDidMount() {
    this.createPeerBoard().catch(err => {
      this.setState({
        error: err.message,
      })
    });
  }

  render() {
    // @ts-ignore
    // @ts-ignore
    return (
      <CommunityLayout>
        <div>
        <Helmet>
          <title>Community | Money Minx</title>
          <meta property='og:description' content='Discussions on personal investing, stocks, ETFs, crowdfunding and more. Join other investors and grow your wealth through knowledge.' />
        </Helmet>
        {/*<header className={`ui inverted menu ${this.state.lastScrollY > 99 ? 'blue' : ''}`}>
          <div className="ui container">
            <div className="header-container">
              <div className="logo-container">
                <a href="/">
                  <img className="logo" src={require('../Assets/images/logo.svg')} alt="money minx logo"/>
                </a>
                <span className="badge-coming-soon">Coming Soon!</span>
              </div>
              <div className="btn-signup-container">
                <a className="ui primary button btn-signup" href="/#signup-today">
                  Get Notified
                </a>
              </div>
            </div>
          </div>
        </header>*/}

        {this.state.error && this.state.error}
        {this.state.loading && 'Loading...'}
        <div ref={this.containerRef}/>

      </div>
      </CommunityLayout>
    );
  }
}
