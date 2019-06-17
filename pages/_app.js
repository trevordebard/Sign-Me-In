import App, { Container } from 'next/app';
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import Head from 'next/head';

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
  }
`;
const theme = {
  primary: 'hsl(282, 44%, 47%)',
  primary_light: 'hsl(282, 46%, 60%)',
};

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
