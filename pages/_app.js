/* eslint-disable react/no-danger */
import App, { Container } from 'next/app';
import Router from 'next/router';
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import Head from 'next/head';
import {
  faAngleRight,
  faTrashAlt,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/fontawesome-free-brands';
import { library } from '@fortawesome/fontawesome-svg-core';
import theme from '../theme';
import * as gtag from '../lib/gtag';

library.add(faAngleRight, faTrashAlt, faGithub, faEnvelope);

const GlobalStyle = createGlobalStyle`  
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
    font-family: 'Montserrat' !important;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    input, p, h1, h2, h3, h4, h5, h6 {
      color: ${theme.font};
    }
  }
  html,
  body,
  div#__next {
    height: 100%;
  }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    Router.events.on('routeChangeComplete', url => gtag.pageview(url));
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <>
            <Head>
              <title>Sign Me In</title>
              <link
                rel="shortcut icon"
                type="image/x-icon"
                href="images/favicon.ico"
              />
              <link
                href="https://fonts.googleapis.com/css?family=Montserrat:400,500&display=swap"
                rel="stylesheet"
              />
              {/* Global Site Tag (gtag.js) - Google Analytics */}
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}');
          `,
                }}
              />
            </Head>
            <GlobalStyle />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </Container>
    );
  }
}
