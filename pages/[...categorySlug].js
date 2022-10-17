import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import {categoriesStructure} from "../categoryRouting/categoriesStructure";
import {translatedRoutes} from "../categoryRouting/translatedRoutes";

export default function Category({
  categoryKeysPath,
  alternateHrefs,
  childCategories,
}) {
  const { locale, query, asPath } = useRouter();

  let categoryRoot = Object.assign({}, categoriesStructure);
  categoryKeysPath.forEach((pathPart) => {
    categoryRoot = categoryRoot[pathPart];
  });

  return (
    <div>
      <Head>
        <title>Renter - {categoryKeysPath[categoryKeysPath.length - 1]}</title>
        <link rel="icon" href="/favicon.ico" />
        {alternateHrefs.map(({ locale, url }) => {
          return (
            <link key={locale} rel="alternate" hrefLang={locale} href={url} />
          );
        })}
      </Head>

      <div>
        Jezici:
        {alternateHrefs.map(({ locale, url }) => (
          <span key={locale} style={{ marginLeft: "10px" }}>
            <Link href={url} locale={locale}>
              {locale}
            </Link>
          </span>
        ))}
      </div>

      <div>
        Trenutna kategorija: {translatedRoutes[locale][query.categoryKey]}
      </div>

      <header>
        Podkategorije:
        {childCategories.map((childCategory) => {
          return (
            <Link
              href={{
                pathname: childCategory.url,
                query: { categoryKey: childCategory.categoryKey }
              }}
              key={childCategory.label}
            >
              {childCategory.label.replace("-", " ")}
            </Link>
          );
        })}
      </header>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, locale, locales, query } = context;

  const categoryKeysPath = query.categoryKey.split("-");

  const alternateHrefs = locales.map((loc) => {
    const translatedKeysPath = categoryKeysPath
      .map((categoryKey) => {
        return translatedRoutes[loc][categoryKey];
      })
      .join("/");
    return {
      locale: loc,
      url: `http://${req.headers.host}/${loc}/${translatedKeysPath}?categoryKey=${query.categoryKey}`,
    };
  });

  let childrenKeys = categoriesStructure;
  categoryKeysPath.forEach((categoryKey) => {
    childrenKeys = childrenKeys[categoryKey];
  });

  const translatedKeysPath = categoryKeysPath
    .map((categoryKey) => {
      return translatedRoutes[locale][categoryKey];
    })
    .join("/");

  const childCategories = Object.keys(childrenKeys).map((categoryKey) => {
    const label = translatedRoutes[locale][categoryKey];
    return {
      categoryKey: `${query.categoryKey}-${categoryKey}`,
      label,
      url: `http://${req.headers.host}/${locale}/${translatedKeysPath}/${label}`,
    };
  });

  return {
    props: {
      categoryKeysPath,
      alternateHrefs,
      childCategories,
    }, // will be passed to the page component as props
  };
}


// Static Generation pokusaj

// export default function Category(props) {
//   console.log("render", props);
//   return (
//     <div>
//       TEST
//     </div>
//   );
// }

// export async function getStaticPaths() {
//   console.log(123);
//   return { paths: ["/categories"], fallback: true }
// }

// export async function getStaticProps(props) {
//   console.log(props);
//   return {props};
// }