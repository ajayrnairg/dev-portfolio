import Layout from "../components/Layout";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Transition from "../components/Transition";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <Theme appearance="dark" accentColor='#2DD4BF' radius="large">
      <Layout>
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
