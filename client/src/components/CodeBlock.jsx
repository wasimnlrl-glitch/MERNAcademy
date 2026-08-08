import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";

function resolveLang(lang) {
  const map = {
    js: "javascript",
    jsx: "jsx",
    json: "json",
    bash: "bash",
    shell: "bash",
    sh: "bash",
    text: "plaintext",
    plaintext: "plaintext",
    ts: "typescript",
    tsx: "jsx",
    html: "markup",
    css: "css",
  };
  return map[lang] || "plaintext";
}

export default function CodeBlock({ code, lang = "js", title, filename }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  const resolved = resolveLang(lang);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current, false);
    }
  }, [code, resolved]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="codeblock">
      {(title || filename) && (
        <figcaption className="codeblock__head">
          <span className="codeblock__dots" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span className="codeblock__title">{title || filename}</span>
          <span className="codeblock__lang">{resolved}</span>
        </figcaption>
      )}
      <div className="codeblock__body">
        <pre className="codeblock__pre">
          <code ref={ref} className={`language-${resolved}`}>
            {code}
          </code>
        </pre>
        <button className="codeblock__copy" onClick={copy} type="button">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </figure>
  );
}
