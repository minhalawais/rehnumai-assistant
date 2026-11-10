"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { copy, useLocale } from "@/components/locale";
import { apiGet, type CaseSummary, shortDate } from "@/lib/client-api";
import { localizedMigrantCategory, migrantCategoryOptions } from "@/lib/intake-ui";

const pageSize = 15;
export default function SubmissionsPage() {
  const { language } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CaseSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
      setLoading(true); setError("");
      apiGet<CaseSummary[]>(`/api/cases?${params}`).then(result => { setRows(result.data); setTotal(Number(result.meta?.total ?? 0)); }).catch((cause: Error) => setError(cause.message)).finally(() => setLoading(false));
    }, query ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [query, category, page]);

  const hasFilters = Boolean(query.trim() || category);
  const singlePage = !loading && !error && total > 0 && total <= pageSize;
  const countSummary = error ? undefined : loading
    ? copy(language, "Loading form count…", "گنتی لوڈ ہو رہی ہے…")
    : hasFilters
      ? copy(language, `${total} matching ${total === 1 ? "form" : "forms"}`, `تلاش کے مطابق ${total} فارم`)
      : copy(language, `${total} submitted ${total === 1 ? "form" : "forms"}`, `کل ${total} فارم جمع ہوئے`);

  return <AppShell title={copy(language, "Submitted forms", "جمع شدہ فارمز")} subtitle={countSummary}><section className="cases-panel cases-panel--list panel"><div className="cases-toolbar flex flex-wrap gap-3 border-b border-[var(--line)] p-4 sm:p-4">
    <label className="cases-search relative min-w-[220px] flex-1"><span className="sr-only">{copy(language, "Search submissions", "فارم تلاش کریں")}</span><Search size={18} aria-hidden className="cases-search__icon absolute start-3 top-1/2 -translate-y-1/2 text-[var(--ink-500)]" /><input className="field" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder={copy(language, "Search name or reference", "نام یا حوالہ نمبر لکھیں")} /></label>
    <label className="cases-filter min-w-[180px]"><span className="sr-only">{copy(language, "Filter group", "گروپ منتخب کریں")}</span><select className="field" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}><option value="">{copy(language, "All groups", "تمام گروپ")}</option>{migrantCategoryOptions.map(([value, en, ur]) => <option key={value} value={value}>{copy(language, en, ur)}</option>)}</select></label>
  </div>
    {error ? <div role="alert" className="p-8 text-sm text-[var(--red-700)]">{error} <button className="ms-2 underline" onClick={() => window.location.reload()}>{copy(language, "Retry", "دوبارہ کوشش کریں")}</button></div> : loading ? <div role="status" className="p-8 text-sm text-[var(--ink-700)]">{copy(language, "Loading submissions…", "فارمز لوڈ ہو رہے ہیں…")}</div> : rows.length ? <><div className="hidden overflow-x-auto md:block"><table className="data-table data-table--cases"><thead><tr><th>{copy(language, "Name / reference", "نام / حوالہ")}</th><th>{copy(language, "Group", "گروپ")}</th><th className="data-table__submitted">{copy(language, "Submitted", "جمع کرنے کی تاریخ")}</th></tr></thead><tbody>{rows.map(row => { const href = `/portal/submissions/${row.caseReference}`; const name = row.applicantSummary?.displayName ?? "—"; return <tr key={row.caseReference} className="cases-table-row"><td><Link href={href} className="cases-row-link font-semibold text-[var(--navy-950)]"><span className="sr-only">{copy(language, "View submission", "فارم کھولیں")}: </span>{name}</Link><div className="mt-1 font-mono text-xs text-[var(--ink-500)]" dir="ltr">{row.caseReference}</div></td><td>{localizedMigrantCategory(row.migrationSummary?.category, language)}{row.migrationSummary?.destinationCountry ? <div className="mt-1 text-xs text-[var(--ink-700)]">{row.migrationSummary.destinationCountry}</div> : null}</td><td className="data-table__submitted" dir="auto">{shortDate(row.submittedAt, language)}</td></tr>; })}</tbody></table></div><div className="cases-mobile-list divide-y divide-[var(--line)] md:hidden">{rows.map(row => <Link key={row.caseReference} href={`/portal/submissions/${row.caseReference}`} className="block p-5"><div className="font-semibold text-[var(--navy-950)]">{row.applicantSummary?.displayName ?? "—"}</div><div className="mt-1 font-mono text-xs text-[var(--ink-500)]" dir="ltr">{row.caseReference}</div><div className="mt-2 text-xs text-[var(--ink-700)]">{localizedMigrantCategory(row.migrationSummary?.category, language)}{row.migrationSummary?.destinationCountry ? ` · ${row.migrationSummary.destinationCountry}` : ""} · <span dir="auto">{shortDate(row.submittedAt, language)}</span></div></Link>)}</div></> : <div className="p-10 text-center"><p className="font-semibold">{copy(language, "No submitted forms found", "کوئی فارم نہیں ملا")}</p>{(query || category) && <button className="btn-quiet mt-3" onClick={() => { setQuery(""); setCategory(""); }}>{copy(language, "Clear filters", "تلاش صاف کریں")}</button>}</div>}
    {!error && !loading && total > 0 && <div className={`cases-panel__pager flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-700)] sm:px-5${singlePage ? " cases-panel__pager--single" : ""}`}><div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5"><span>{`${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)}`} {copy(language, "of", "از")} {total}</span>{singlePage && <span className="hidden text-xs text-[var(--ink-500)] sm:inline">{copy(language, "All on this page", "سب ایک ہی صفحے پر")}</span>}</div>{!singlePage && <div className="flex gap-2"><button className="btn-secondary" disabled={page === 1} onClick={() => setPage(value => value - 1)}>{copy(language, "Previous", "پچھلا")}</button><button className="btn-secondary" disabled={page * pageSize >= total} onClick={() => setPage(value => value + 1)}>{copy(language, "Next", "اگلا")}</button></div>}</div>}
  </section></AppShell>;
}
