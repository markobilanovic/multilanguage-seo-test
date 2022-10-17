import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import { useRouter } from "next/router";
import { categoriesStructure } from "../categoryRouting/categoriesStructure";
import { translatedRoutes } from "../categoryRouting/translatedRoutes";

export default function Home({ allPostsData }) {
  const { locale, locales, asPath } = useRouter();
  // const availableLocales = locales.filter(locale => locale !== activeLocale);

  return (
    <Layout home>
      <Head>
        <meta
          name="google-site-verification"
          content="VWj6la0Gw5ThLJRHFxnXwPmJZm-a39vJIX4h6bS0_Bc"
        />
        <title>{siteTitle}</title>
      </Head>

      {locales.map((loc) => (
        <Link href={asPath} locale={loc} key={loc}>
          {loc}
        </Link>
      ))}

      <header>
        {Object.keys(categoriesStructure).map((key) => {
          console.log(categoriesStructure, translatedRoutes);
          const linkName = translatedRoutes[locale][key];
          return (
            <Link
              href={{
                pathname: linkName,
                query: { categoryKey: key }, // the data
              }}
              key={key}
            >
              {linkName}
            </Link>
          );
        })}
      </header>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
