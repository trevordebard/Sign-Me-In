import App, { Container } from 'next/app';
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import Head from 'next/head';
import { faAngleRight, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import theme from '../theme';

library.add(faAngleRight, faTrashAlt);
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
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <Head>
              <title>Sign Me In</title>
              <link href="/static/fonts.css" rel="stylesheet" />
            </Head>
            <GlobalStyle />
            <Component {...pageProps} />
          </React.Fragment>
        </ThemeProvider>
      </Container>
    );
  }
}
