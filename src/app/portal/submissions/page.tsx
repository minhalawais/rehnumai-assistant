"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { copy, useLocale } from "@/components/locale";
import { apiGet, type CaseSummary, localizedStage, shortDate } from "@/lib/client-api";

const pageSize = 15;
export default function SubmissionsPage() {
  const { language } = useLocale();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CaseSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (query.trim()) params.set("q", query.trim());
      if (stage) params.set("stage", stage);
      setLoading(true); setError("");
      apiGet<CaseSummary[]>(`/api/cases?${params}`).then(result => { setRows(result.data); setTotal(Number(result.meta?.total ?? 0)); }).catch((cause: Error) => setError(cause.message)).finally(() => setLoading(false));
    }, query ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [query, stage, page]);

  const hasFilters = Boolean(query.trim() || stage);
  const singlePage = !loading && !error && total > 0 && total <= pageSize;
  const countSummary = error ? undefined : loading
    ? copy(language, "Loading form count…", "فارموں کی تعداد لوڈ ہو رہی ہے…")
    : hasFilters
      ? copy(language, `${total} matching ${total === 1 ? "form" : "forms"}`, `منتخب شرائط کے مطابق ${total} فارم`)
      : copy(language, `${total} submitted ${total === 1 ? "form" : "forms"}`, `کل ${total} جمع شدہ فارم`);

  return <AppShell title={copy(language, "Submitted forms", "جمع شدہ فارم")} subtitle={countSummary}><section className="cases-panel cases-panel--list panel"><div className="cases-toolbar flex flex-wrap gap-3 border-b border-[var(--line)] p-4 sm:p-4">
    <label className="cases-search relative min-w-[220px] flex-1"><span className="sr-only">{copy(language, "Search submissions", "جمع شدہ فارم تلاش کریں")}</span><Search size={18} aria-hidden className="cases-search__icon absolute start-3 top-1/2 -translate-y-1/2 text-[var(--ink-500)]" /><input className="field" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder={copy(language, "Search name or reference", "نام یا حوالہ تلاش کریں")} /></label>
    <label className="cases-filter min-w-[180px]"><span className="sr-only">{copy(language, "Filter migration stage", "ہجرت کا مرحلہ منتخب کریں")}</span><select className="field" value={stage} onChange={event => { setStage(event.target.value); setPage(1); }}><option value="">{copy(language, "All stages", "تمام مراحل")}</option>{["exploring", "preparing", "offer_received", "pre_departure", "overseas", "returned"].map(value => <option key={value} value={value}>{localizedStage(value, language)}</option>)}</select></label>
  </div>
    {error ? <div role="alert" className="p-8 text-sm text-[var(--red-700)]">{error} <button className="ms-2 underline" onClick={() => window.location.reload()}>{copy(language, "Retry", "دوبارہ کوشش")}</button></div> : loading ? <div role="status" className="p-8 text-sm text-[var(--ink-700)]">{copy(language, "Loading submissions…", "جمع شدہ فارم لوڈ ہو رہے ہیں…")}</div> : rows.length ? <><div className="hidden overflow-x-auto md:block"><table className="data-table data-table--cases"><thead><tr><th>{copy(language, "Name / reference", "نام / حوالہ")}</th><th>{copy(language, "Migration stage", "ہجرت کا مرحلہ")}</th><th className="data-table__submitted">{copy(language, "Submitted", "جمع ہونے کی تاریخ")}</th></tr></thead><tbody>{rows.map(row => { const href = `/portal/submissions/${row.caseReference}`; const name = row.applicantSummary?.displayName ?? "—"; return <tr key={row.caseReference} className="cases-table-row"><td><Link href={href} className="cases-row-link font-semibold text-[var(--navy-950)]"><span className="sr-only">{copy(language, "View submission", "جمع شدہ فارم دیکھیں")}: </span>{name}</Link><div className="mt-1 font-mono text-xs text-[var(--ink-500)]" dir="ltr">{row.caseReference}</div></td><td>{localizedStage(row.migrationSummary?.stage, language)}<div className="mt-1 text-xs text-[var(--ink-700)]">{row.migrationSummary?.destinationCountry || "—"}</div></td><td className="data-table__submitted" dir="auto">{shortDate(row.submittedAt, language)}</td></tr>; })}</tbody></table></div><div className="cases-mobile-list divide-y divide-[var(--line)] md:hidden">{rows.map(row => <Link key={row.caseReference} href={`/portal/submissions/${row.caseReference}`} className="block p-5"><div className="font-semibold text-[var(--navy-950)]">{row.applicantSummary?.displayName ?? "—"}</div><div className="mt-1 font-mono text-xs text-[var(--ink-500)]" dir="ltr">{row.caseReference}</div><div className="mt-2 text-xs text-[var(--ink-700)]">{localizedStage(row.migrationSummary?.stage, language)}{row.migrationSummary?.destinationCountry ? ` · ${row.migrationSummary.destinationCountry}` : ""} · <span dir="auto">{shortDate(row.submittedAt, language)}</span></div></Link>)}</div></> : <div className="p-10 text-center"><p className="font-semibold">{copy(language, "No submitted forms found", "کوئی جمع شدہ فارم نہیں ملا")}</p>{(query || stage) && <button className="btn-quiet mt-3" onClick={() => { setQuery(""); setStage(""); }}>{copy(language, "Clear filters", "شرائط صاف کریں")}</button>}</div>}
    {!error && !loading && total > 0 && <div className={`cases-panel__pager flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-700)] sm:px-5${singlePage ? " cases-panel__pager--single" : ""}`}><div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5"><span>{`${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)}`} {copy(language, "of", "از")} {total}</span>{singlePage && <span className="hidden text-xs text-[var(--ink-500)] sm:inline">{copy(language, "All on this page", "سب اسی صفحے پر")}</span>}</div>{!singlePage && <div className="flex gap-2"><button className="btn-secondary" disabled={page === 1} onClick={() => setPage(value => value - 1)}>{copy(language, "Previous", "پچھلا")}</button><button className="btn-secondary" disabled={page * pageSize >= total} onClick={() => setPage(value => value + 1)}>{copy(language, "Next", "اگلا")}</button></div>}</div>}
  </section></AppShell>;
}
