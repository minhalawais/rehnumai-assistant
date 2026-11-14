function GreenCheck() {
  return (
    <span className="guide__pack-green" aria-hidden>
      ✓
    </span>
  );
}

function DepartBox() {
  return (
    <span className="guide__pack-depart-box" aria-hidden>
      <span className="guide__pack-depart-tick">✓</span>
    </span>
  );
}

export function GuidePackingChecklist({
  leftTitle,
  rightTitle,
  left,
  right,
}: {
  leftTitle: string;
  rightTitle: string;
  left: string[];
  right: string[];
}) {
  return (
    <div className="guide__checklist-table-wrap guide__packing-table-wrap" dir="ltr">
      <table className="guide__checklist-table guide__packing-table">
        <thead>
          <tr>
            <th className="guide__checklist-th guide__packing-th guide__packing-th--mine" scope="col">
              <span className="urdu" dir="rtl">
                {leftTitle}
              </span>
            </th>
            <th className="guide__checklist-th guide__packing-th guide__packing-th--depart" scope="col">
              <span className="urdu" dir="rtl">
                {rightTitle}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {left.map((item, index) => (
            <tr key={index}>
              <td className="guide__checklist-td guide__packing-td guide__packing-td--mine">
                <div className="guide__pack-mine-inner">
                  <span className="guide__pack-mine-text urdu" dir="rtl">
                    {item}
                  </span>
                  <GreenCheck />
                </div>
              </td>
              {index === 0 ? (
                <td className="guide__checklist-td guide__packing-td guide__packing-td--depart" rowSpan={left.length}>
                  <ul className="guide__pack-depart-list">
                    {right.map((line) => (
                      <li key={line} className="guide__pack-depart-item">
                        <span className="guide__pack-depart-text urdu" dir="rtl">
                          {line}
                        </span>
                        <DepartBox />
                      </li>
                    ))}
                  </ul>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
