import hljs from './vendor/highlight.js/core.min.js';
import sql from './vendor/highlight.js/sql.min.js';
import xml from './vendor/highlight.js/xml.min.js';


import('./vendor/highlight.js/github-dark.min.css', { with: { type: 'css' } })
    .then((exports) => {
        document.adoptedStyleSheets = [exports.default];
    }).catch((_) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './vendor/highlight.js/github-dark.min.css';
        document.head.appendChild(link);
    });


hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', xml);

function addExample(element, example) {
    const placeholder = "__PLACEHOLDER__";

    const query = element.getAttribute("query");
    const highlightedQuery = hljs.highlight(query, {
        language: "sql",
    }).value;

    const textElement = element.outerHTML.replace(
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
    example.appendChild(codeElement);
    example.removeAttribute("class");
}

document.querySelectorAll("sql-table, sql-value").forEach((el) => {
    if (
        el.previousElementSibling &&
        el.previousElementSibling.className === "example-placeholder"
    ) {
        addExample(el, el.previousElementSibling);
    } else if (
        el.parentElement.previousElementSibling &&
        el.parentElement.previousElementSibling.className === "example-placeholder"
    ) {
        addExample(el, el.parentElement.previousElementSibling)
    }
});
