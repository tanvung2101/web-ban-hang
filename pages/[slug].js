import dynamic from 'next/dynamic'
import configPageApis from "@/apis/configPageApis";
import pageData, { pages } from "@/apis/pagesApi";
import Loading from "@/components/Loading";
const Title = dynamic(() => import('./../components/Title'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})
const SEO = dynamic(() => import('./../components/SEO/index'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

import { useRouter } from "next/router";
import React from "react";

const Pages = ({ data }) => {
  const router = useRouter();
  const pageShow = pageData.getPageBySlug(router.query.slug);
  console.log(data);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageShow]);
  return (
    <>
      <SEO title={pageShow?.display} description={data[0]?.content.replace(/(<([^>]+)>)/gi, "")}></SEO>
      {data.length > 0 ? <>
        <div className="bg-light-pink py-5">
          <Title className="uppercase">{pageShow.display}</Title>
        </div>
        <div className="px-24 my-10 text-base max-lg:px-10 max-sm:px-4">
          <div className="pages__content__text leading-8 font-sans" dangerouslySetInnerHTML={{ __html: data[0].content }}></div>
        </div>
      </> :
        <Loading></Loading>}
    </>
  );
};

export async function getStaticPaths() {
  const paths = pages.map((page) => {
    return {
      params: {
        slug: page.pageSlug,
        content: page.content,
      },
    };
  });
  // console.log(paths)
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const pageShow = pageData.getPageBySlug(slug);
  const data = await configPageApis.getListConfigPageContent({
    pageCode: pageShow.content,
  });
  return {
    props: { data: data.data },
  };
}

export default Pages;
