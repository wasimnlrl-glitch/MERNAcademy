import { useMemo } from "react";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export default function Markdown({ children }) {
  const html = useMemo(() => marked.parse(children || ""), [children]);
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}
