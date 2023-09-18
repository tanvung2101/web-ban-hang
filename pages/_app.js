import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// const HeaderUser = dynamic(() => import('./../components/HeaderUser'), { ssr: true })
// const Footer = dynamic(() => import('./../components/Footer'), { ssr: true })
import "@/styles/globals.css";
import '@/styles/promotions.css'
import "react-toastify/dist/ReactToastify.css";
import { Provider, } from "react-redux";
import { store } from "@/store";
// import { STORAGE_KEY } from "@/constants/storage-key";
// import { setToken } from "@/redux/accountSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { appWithTranslation } from 'next-i18next';
import Init from "@/components/init";
import HeaderUser from "@/components/HeaderUser";
import { Footer } from "@/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


let persistor = persistStore(store);
const queryClient = new QueryClient();
function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <HeaderUser />
            <Init>
              <Component {...pageProps} />
            </Init>
            <Footer />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </>
  );
}


export default appWithTranslation(App)