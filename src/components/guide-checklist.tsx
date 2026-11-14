type Cols = { num: number; doc: number; yes: number; no: number };

function parseCols(head: string[]): Cols {
  const labels = head.map((cell) => cell.replace(/\n/g, " ").trim());
  const find = (pred: (label: string) => boolean) => labels.findIndex(pred);
  return {
    no: find((l) => l === "نہیں"),
    yes: find((l) => l === "ہاں"),
    doc: find((l) => l.includes("درکار")),
    num: find((l) => l === "نمبر"),
  };
}

/** Booklet column order (RTL): نمبر → دستاویز → ہاں → نہیں */
function bookletColumnOrder(cols: Cols): number[] {
  return [cols.num, cols.doc, cols.yes, cols.no];
}

export function GuideChecklist({ head, rows }: { head: string[]; rows: string[][] }) {
  const cols = parseCols(head);
  const order = bookletColumnOrder(cols);

  const thClass = (cellIndex: number) => {
    if (cellIndex === cols.num) return "guide__checklist-th guide__checklist-th--num";
    if (cellIndex === cols.doc) return "guide__checklist-th guide__checklist-th--doc";
    return "guide__checklist-th guide__checklist-th--tick";
  };

  const tdClass = (cellIndex: number) => {
    if (cellIndex === cols.num) return "guide__checklist-td guide__checklist-td--num";
    if (cellIndex === cols.doc) return "guide__checklist-td guide__checklist-td--doc urdu";
    return "guide__checklist-td guide__checklist-td--tick";
  };

  return (
    <section className="guide__checklist" aria-label="دستاویزات کی جانچ">
      <p className="guide__checklist-banner urdu">بیرون ملک روانگی</p>
      <div className="guide__checklist-table-wrap">
        <table className="guide__checklist-table">
          <thead>
            <tr>
              {order.map((cellIndex) => (
                <th key={cellIndex} scope="col" className={thClass(cellIndex)}>
                  <span className="urdu">{head[cellIndex]?.replace(/\n/g, " ").trim()}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {order.map((cellIndex) => {
                  if (cellIndex === cols.yes || cellIndex === cols.no) {
                    return (
                      <td key={cellIndex} className={tdClass(cellIndex)}>
                        <span className="guide__check-box" aria-hidden />
                      </td>
                    );
                  }
                  const text = row[cellIndex]?.trim() ?? "";
                  return (
                    <td
                      key={cellIndex}
                      className={tdClass(cellIndex)}
                      dir={cellIndex === cols.num ? "ltr" : undefined}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
