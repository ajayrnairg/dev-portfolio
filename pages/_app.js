import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Transition from "../components/Transition";
import GlobalLoading from "../components/GlobalLoading";
import loadingService from "../services/loadingService";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const isLoading = isApiLoading || isRouteLoading;

  useEffect(() => {
    const unsubscribe = loadingService.subscribe(setIsApiLoading);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleRouteStart = () => setIsRouteLoading(true);
    const handleRouteEnd = () => setIsRouteLoading(false);

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteEnd);
    router.events.on("routeChangeError", handleRouteEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteEnd);
      router.events.off("routeChangeError", handleRouteEnd);
    };
  }, [router.events]);

  return (
    <Theme appearance="dark" accentColor='#2DD4BF' radius="large">
      <Layout>
        <GlobalLoading isLoading={isLoading} />
        <AnimatePresence mode="wait">
          <motion.div key={router.route} className="h-full">
            <Transition />
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </Layout>
    </Theme>
  );
}

export default MyApp;
