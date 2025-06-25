import hljs from './vendor/highlight.js/core.min.js';
import sql from './vendor/highlight.js/sql.min.js';
import xml from './vendor/highlight.js/xml.min.js';

import sheet from './vendor/highlight.js/github-dark.min.css' with { type: 'css' };
document.adoptedStyleSheets = [sheet];

hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', xml);

const placeholder = "__PLACEHOLDER__";
document.querySelectorAll("sql-table").forEach((el) => {
    const previousSibling = el.previousElementSibling;
    if (
        previousSibling &&
        previousSibling.className === "example-placeholder"
    ) {
        const query = el.getAttribute("query");
        const highlightedQuery = hljs.highlight(query, {
            language: "sql",
        }).value;

        const textElement = el.outerHTML.replace(
            `query="${query}"`,
            placeholder
        );
        const highlightedElement = hljs.highlight(textElement, {
            language: "html",
        }).value;

        const quote = '<span class="hljs-string">&quot;</span>';
        const codeElement = document.createElement("code");
        codeElement.innerHTML = highlightedElement.replace(
            `<span class="hljs-attr">${placeholder}</span>`,
            `<span class="hljs-attr">query</span>=${quote}${highlightedQuery}${quote}`
        );
        previousSibling.appendChild(codeElement);
        previousSibling.removeAttribute("class");
    }
});
