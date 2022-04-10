import { Provider } from "react-redux";
import Layout from "../components/Layout";
import { wrapper, store } from "../redux/init";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Head>
          <title>Multi-Signature Wallet</title>
        </Head>
        <Component {...pageProps} />;
      </Layout>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
