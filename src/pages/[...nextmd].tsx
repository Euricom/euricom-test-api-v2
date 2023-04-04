import NextMarkdown from "next-markdown";

const nextMd = NextMarkdown({ pathToContent: "./src/pages-md" });

export const getStaticPaths = nextMd.getStaticPaths;
export const getStaticProps = nextMd.getStaticProps;

export default function MarkdownPage({ html }: any) {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} className="prose m-5" />
  );
}
