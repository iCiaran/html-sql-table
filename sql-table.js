import "./jswasm/sqlite3.mjs";

class SQL extends HTMLElement {
    constructor() {
        super();
    }

    static setupPromise = null;

    async connectedCallback() {
        if (!SQL.setupPromise) {
            SQL.setupPromise = window
                .sqlite3InitModule()
                .then((sqlite3) => (globalThis.sqlite3 = sqlite3));
        }

        await SQL.setupPromise;

        const dbPath = this.getAttribute("database");
        const query = this.getAttribute("query");

        const shadow = this.attachShadow({ mode: "open" });

        const style = document.createElement("style");
        style.textContent = `
            table {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                border-collapse: separate;
                border-spacing: 0;
                table-layout: fixed;
                font-family: system-ui, sans-serif;
                font-size: 16px;
                background: #fff;
                border: 2px solid #bbb;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }

            thead {
                background-color: #f0f2f5;
            }

            thead th {
                font-weight: bold;
                text-align: left;
                padding: 12px 16px;
                border-bottom: 2px solid #bbb;
                border-right: 1px solid #ddd;
            }

            thead th:last-child {
                border-right: none;
            }

            tbody td {
                padding: 12px 16px;
                border-bottom: 1px solid #ddd;
                border-right: 1px solid #eee;
            }

            tbody td:last-child {
                border-right: none;
            }

            tbody tr:last-child td {
                border-bottom: none;
            }

            tbody tr:hover {
                background-color: #f9f9f9;
            }

            table th,
            table td {
                word-break: break-word;
            }
`;

        shadow.appendChild(style);
        const table = document.createElement("table");
        shadow.appendChild(table);

        fetch(dbPath)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const p = sqlite3.wasm.allocFromTypedArray(buffer);
                const db = new sqlite3.oo1.DB();
                const rc = sqlite3.capi.sqlite3_deserialize(
                    db.pointer,
                    "main",
                    p,
                    buffer.byteLength,
                    buffer.byteLength,
                    sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE
                );
                db.checkRc(rc);
                return db;
            })
            .then((db) => {
                let columnNames = new Array();

                db.exec({
                    sql: query,
                    rowMode: "array",
                    callback: function (row) {
                        const tableRow = table.insertRow(-1);
                        row.forEach((cell, index) => {
                            tableRow.insertCell(index).innerHTML = cell;
                        });
                    },
                    columnNames: columnNames,
                });

                var header = table.createTHead();
                var headerRow = header.insertRow(0);
                columnNames.forEach((name, index) => {
                    const cell = headerRow.insertCell(index);
                    cell.innerHTML = name;
                    cell.outerHTML = `<th>${cell.innerHTML}</th>`;
                });
            });
    }
}

customElements.define("sql-table", SQL);
