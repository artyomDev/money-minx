import React from 'react';
import { Helmet } from 'react-helmet';

import env from 'app/app.env';
import { createForum } from '@peerboard/core';

import CommunityLayout from './community.layout';

const boardID = env.PEERBOARD_BOARD_ID as number;
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

        {this.state.error && this.state.error}
        {this.state.loading && 'Loading...'}
        <div ref={this.containerRef}/>

      </div>
      </CommunityLayout>
    );
  }
}
