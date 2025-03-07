import '../styles/globals.css'; // ✅ Ensure this line exists
import '../styles/Home.module.css'; // ✅ Ensure component styles are imported


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
