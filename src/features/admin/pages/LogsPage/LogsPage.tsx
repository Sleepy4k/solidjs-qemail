import { Component, createSignal, onMount, For, Show, createResource } from 'solid-js';
import gsap from 'gsap';
import { adminService } from '../../services/admin.service';
import type { AdminLog, LogSortField, SortDir, LogActorType, LogStatus } from '../../types/admin.types';
import { Button } from '../../../../shared/components/ui/Button';
import { Card } from '../../../../shared/components/ui/Card';
import { Input } from '../../../../shared/components/ui/Input';
import { Alert } from '../../../../shared/components/ui/Alert';
import { SkeletonTable } from '../../../../shared/components/Skeleton';
import { debounce } from '../../../../shared/utils/debounce.util';

/* ─── badge configs ───────────────────────────────────────── */
const STATUS_BADGE: Record<AdminLog['status'], { cls: string; dot: string; label: string }> = {
  success: { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', label: 'Success' },
  failure: { cls: 'bg-red-50 text-red-700 border border-red-200',             dot: 'bg-red-500',     label: 'Failure' },
};

const ACTOR_BADGE: Record<AdminLog['actor_type'], { cls: string; label: string }> = {
  user:   { cls: 'bg-blue-50 text-blue-700 border border-blue-200',      label: 'User'   },
  admin:  { cls: 'bg-violet-50 text-violet-700 border border-violet-200', label: 'Admin'  },
  system: { cls: 'bg-slate-100 text-slate-600 border border-slate-200',  label: 'System' },
};

const actionColor = (action: string): string => {
  if (action.startsWith('email'))  return 'bg-sky-50 text-sky-700';
  if (action.startsWith('admin'))  return 'bg-violet-50 text-violet-700';
  if (action.startsWith('domain')) return 'bg-amber-50 text-amber-700';
  if (action.startsWith('auth'))   return 'bg-rose-50 text-rose-700';
  return 'bg-gray-100 text-gray-700';
};

/* ─── small badges ────────────────────────────────────────── */
const StatusBadge: Component<{ status: AdminLog['status'] }> = (p) => {
  const s = STATUS_BADGE[p.status];
  return (
    <span class={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      <span class={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
};

const ActorBadge: Component<{ type: AdminLog['actor_type'] }> = (p) => {
  const a = ACTOR_BADGE[p.type];
  return (
    <span class={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${a.cls}`}>
      {a.label}
    </span>
  );
};

const ActionPill: Component<{ action: string }> = (p) => (
  <code class={`px-2 py-0.5 rounded text-xs font-mono font-medium ${actionColor(p.action)}`}>
    {p.action}
  </code>
);

/*
 * Detail panel — data not shown in the main row:
 *   full actor_label, resource, actor_id (if any), error (if any)
 */
const LogDetail: Component<{ log: AdminLog }> = (p) => (
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 px-4 py-4 bg-gray-50 border-t border-dashed border-gray-200 text-xs">
    <div class="sm:col-span-2 space-y-0.5">
      <p class="text-gray-400 font-medium uppercase tracking-wide text-[10px]">Full actor label</p>
      <p class="text-gray-700 font-mono break-all">{p.log.actor_label}</p>
    </div>

    <Show when={p.log.resource_type}>
      <div class="space-y-0.5">
        <p class="text-gray-400 font-medium uppercase tracking-wide text-[10px]">Resource</p>
        <div class="flex items-center gap-1.5">
          <span class="text-gray-700 font-semibold">{p.log.resource_type}</span>
          <Show when={p.log.resource_id}>
            <span class="text-gray-400 font-mono">#{p.log.resource_id}</span>
          </Show>
        </div>
      </div>
    </Show>

    <Show when={p.log.actor_id}>
      <div class="space-y-0.5">
        <p class="text-gray-400 font-medium uppercase tracking-wide text-[10px]">Actor ID</p>
        <p class="text-gray-700 font-mono">{p.log.actor_id}</p>
      </div>
    </Show>

    <Show when={p.log.error}>
      <div class="sm:col-span-2 space-y-0.5">
        <p class="text-gray-400 font-medium uppercase tracking-wide text-[10px]">Error</p>
        <div class="flex items-start gap-1.5 p-2.5 bg-red-50 border border-red-100 rounded-lg">
          <svg class="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-600 leading-snug break-all">{p.log.error}</p>
        </div>
      </div>
    </Show>

    {/* Fallback when nothing extra exists */}
    <Show when={!p.log.resource_type && !p.log.actor_id && !p.log.error}>
      <p class="sm:col-span-2 text-gray-400 italic text-xs">No additional details</p>
    </Show>
  </div>
);

/* ─── main page ───────────────────────────────────────────── */
const LogsPage: Component = () => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const [inputValue, setInputValue] = createSignal('');
  const [searchQuery, setSearchQuery] = createSignal('');
  const [actorType, setActorType] = createSignal<LogActorType | ''>('');
  const [statusFilter, setStatusFilter] = createSignal<LogStatus | ''>('');
  const [sortBy, setSortBy] = createSignal<LogSortField>('created_at');
  const [sortDir, setSortDir] = createSignal<SortDir>('desc');
  const [expandedIds, setExpandedIds] = createSignal<Set<number>>(new Set());
  const [error, setError] = createSignal('');

  let headerRef: HTMLDivElement | undefined;

  const [logs, { refetch }] = createResource(
    () => ({
      page: currentPage(),
      search: searchQuery(),
      actor_type: actorType(),
      status: statusFilter(),
      sort_by: sortBy(),
      sort_dir: sortDir(),
    }),
    async (params) => {
      setExpandedIds(new Set());
      try {
        setError('');
        return await adminService.getLogs({
          page: params.page,
          limit: 10,
          search: params.search || undefined,
          actor_type: params.actor_type || undefined,
          status: params.status || undefined,
          sort_by: params.sort_by,
          sort_dir: params.sort_dir,
        });
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load logs');
        return undefined;
      }
    }
  );

  onMount(() => {
    if (headerRef) {
      gsap.fromTo(headerRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  });

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 400);

  const handleSearchInput = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const resetFilters = () => {
    setInputValue('');
    setSearchQuery('');
    setActorType('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const handleSort = (field: LogSortField) => {
    if (sortBy() === field) {
      setSortDir(sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isExpanded = (id: number) => expandedIds().has(id);
  const hasActiveFilters = () => !!(inputValue() || actorType() || statusFilter());

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  /* sortable th */
  const SortTh: Component<{ field: LogSortField; label: string; class?: string }> = (p) => (
    <th
      class={`px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none group ${p.class ?? ''}`}
      onClick={() => handleSort(p.field)}
    >
      <span class="inline-flex items-center gap-1 group-hover:text-gray-800 transition-colors">
        {p.label}
        <span class="transition-colors text-gray-300 group-hover:text-gray-500">
          {sortBy() !== p.field
            ? <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
            : sortDir() === 'asc'
              ? <svg class="w-3 h-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
              : <svg class="w-3 h-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          }
        </span>
      </span>
    </th>
  );

  const selectBase =
    'text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors';

  const EmptyState = () => (
    <div class="flex flex-col items-center justify-center py-16 gap-2 text-center px-4">
      <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-sm font-medium text-gray-500">
        {hasActiveFilters() ? 'No logs matched your filters' : 'No logs found'}
      </p>
    </div>
  );

  /* Expand toggle button (shared) */
  const ExpandToggle: Component<{ id: number }> = (p) => (
    <span class={`inline-flex items-center gap-0.5 text-xs font-medium transition-colors ${
      isExpanded(p.id) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
    }`}>
      {isExpanded(p.id) ? 'Hide' : 'Show'}
      <svg
        class={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded(p.id) ? 'rotate-180' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  );

  return (
    <div class="space-y-5">
      {/* Header */}
      <div ref={headerRef} class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 class="text-xl sm:text-3xl font-bold text-gray-900">System Logs</h1>
          <p class="mt-1 text-xs sm:text-sm text-gray-500">
            Audit trail of all actor actions across the platform
          </p>
        </div>
        <Show when={logs()}>
          <span class="self-start sm:self-auto px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
            {logs()!.meta.total.toLocaleString()} total entries
          </span>
        </Show>
      </div>

      <Show when={error()}>
        <Alert type="error" message={error()} onClose={() => setError('')} />
      </Show>

      {/* Filter bar */}
      <Card padding="md">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                placeholder="Search actor, action, resource, IP..."
                value={inputValue()}
                onInput={handleSearchInput}
                class="pl-9"
              />
            </div>
            <select
              class={selectBase}
              value={actorType()}
              onChange={(e) => { setActorType((e.target as HTMLSelectElement).value as LogActorType | ''); setCurrentPage(1); }}
            >
              <option value="">All actors</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="system">System</option>
            </select>
            <select
              class={selectBase}
              value={statusFilter()}
              onChange={(e) => { setStatusFilter((e.target as HTMLSelectElement).value as LogStatus | ''); setCurrentPage(1); }}
            >
              <option value="">All statuses</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </div>

          <Show when={hasActiveFilters()}>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-gray-400 font-medium">Active:</span>
              <Show when={searchQuery()}>
                <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-full text-xs font-medium">
                  "{searchQuery()}"
                  <button onClick={() => { setInputValue(''); setSearchQuery(''); setCurrentPage(1); }} class="hover:text-primary-900 ml-0.5 leading-none">×</button>
                </span>
              </Show>
              <Show when={actorType()}>
                <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-medium">
                  Actor: {actorType()}
                  <button onClick={() => { setActorType(''); setCurrentPage(1); }} class="hover:text-violet-900 ml-0.5 leading-none">×</button>
                </span>
              </Show>
              <Show when={statusFilter()}>
                <span class={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  statusFilter() === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  Status: {statusFilter()}
                  <button onClick={() => { setStatusFilter(''); setCurrentPage(1); }} class="ml-0.5 leading-none">×</button>
                </span>
              </Show>
              <button onClick={resetFilters} class="ml-1 text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors">
                Clear all
              </button>
            </div>
          </Show>
        </div>
      </Card>

      {/* Log table / cards */}
      <Card padding="none">
        <Show when={!logs.loading} fallback={<div class="p-4"><SkeletonTable rows={10} columns={6} /></div>}>

          {/* ── Desktop table (lg+) ── */}
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <SortTh field="created_at" label="Time"        class="pl-4 w-36" />
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                    Type
                  </th>
                  <SortTh field="actor_label" label="Actor" />
                  <SortTh field="action"      label="Action" />
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                    IP
                  </th>
                  <SortTh field="status" label="Status" class="w-28" />
                  <th class="px-3 py-3 pr-4 w-16" />
                </tr>
              </thead>
              <tbody>
                <For each={logs()?.data} fallback={
                  <tr><td colspan="7"><EmptyState /></td></tr>
                }>
                  {(log) => (
                    <>
                      <tr
                        class={`group border-b transition-colors cursor-pointer
                          ${isExpanded(log.id)
                            ? 'bg-primary-50/40 border-primary-100'
                            : log.status === 'failure'
                              ? 'bg-red-50/20 border-gray-100 hover:bg-red-50/40'
                              : 'border-gray-100 hover:bg-gray-50/80'
                          }`}
                        onClick={() => toggleExpand(log.id)}
                      >
                        {/* Time */}
                        <td class="px-3 pl-4 py-3 align-middle">
                          <div class="text-xs font-medium text-gray-700 whitespace-nowrap">{formatDate(log.created_at)}</div>
                          <div class="text-xs text-gray-400 whitespace-nowrap tabular-nums">{formatTime(log.created_at)}</div>
                        </td>
                        {/* Actor Type */}
                        <td class="px-3 py-3 align-middle">
                          <ActorBadge type={log.actor_type} />
                        </td>
                        {/* Actor Label */}
                        <td class="px-3 py-3 align-middle">
                          <span class="text-xs text-gray-600 font-mono truncate max-w-[160px] block" title={log.actor_label}>
                            {log.actor_label}
                          </span>
                        </td>
                        {/* Action */}
                        <td class="px-3 py-3 align-middle">
                          <ActionPill action={log.action} />
                        </td>
                        {/* IP */}
                        <td class="px-3 py-3 align-middle">
                          <span class="text-xs text-gray-500 font-mono whitespace-nowrap">{log.ip_address}</span>
                        </td>
                        {/* Status */}
                        <td class="px-3 py-3 align-middle">
                          <StatusBadge status={log.status} />
                        </td>
                        {/* Toggle */}
                        <td class="px-3 py-3 pr-4 align-middle text-right">
                          <ExpandToggle id={log.id} />
                        </td>
                      </tr>

                      <Show when={isExpanded(log.id)}>
                        <tr class="border-b border-primary-100">
                          <td colspan="7" class="p-0">
                            <LogDetail log={log} />
                          </td>
                        </tr>
                      </Show>
                    </>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          {/* ── Mobile / tablet cards (< lg) ── */}
          <div class="lg:hidden">
            {/* Sort strip */}
            <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2 overflow-x-auto">
              <span class="text-xs text-gray-400 font-medium shrink-0">Sort:</span>
              {(['created_at', 'action', 'actor_label', 'status'] as LogSortField[]).map((field) => (
                <button
                  onClick={() => handleSort(field)}
                  class={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    sortBy() === field
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {field === 'created_at' ? 'Time' : field === 'actor_label' ? 'Actor' : field.charAt(0).toUpperCase() + field.slice(1)}
                  <Show when={sortBy() === field}>
                    <span>{sortDir() === 'asc' ? '↑' : '↓'}</span>
                  </Show>
                </button>
              ))}
            </div>

            <For each={logs()?.data} fallback={<EmptyState />}>
              {(log) => (
                <div class={`border-b border-gray-100 ${log.status === 'failure' ? 'bg-red-50/30' : ''}`}>
                  <div
                    class="px-4 py-3.5 flex items-start gap-3 cursor-pointer active:bg-gray-50"
                    onClick={() => toggleExpand(log.id)}
                  >
                    <div class="flex-1 min-w-0 space-y-2">
                      {/* Row 1 — time + status */}
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-xs text-gray-400 tabular-nums">
                          {formatDate(log.created_at)} · {formatTime(log.created_at)}
                        </span>
                        <StatusBadge status={log.status} />
                      </div>
                      {/* Row 2 — actor type badge */}
                      <div>
                        <ActorBadge type={log.actor_type} />
                      </div>
                      {/* Row 3 — actor label */}
                      <div class="min-w-0">
                        <span class="text-xs text-gray-600 font-mono truncate block">{log.actor_label}</span>
                      </div>
                      {/* Row 4 — action */}
                      <div>
                        <ActionPill action={log.action} />
                      </div>
                      {/* Row 5 — IP */}
                      <div class="flex items-center gap-3 flex-wrap">
                        <span class="text-xs text-gray-400 font-mono">{log.ip_address}</span>
                      </div>
                    </div>
                    {/* Chevron */}
                    <svg
                      class={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-200 ${isExpanded(log.id) ? 'rotate-180 text-primary-600' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <Show when={isExpanded(log.id)}>
                    <LogDetail log={log} />
                  </Show>
                </div>
              )}
            </For>
          </div>

          {/* Pagination */}
          <Show when={logs()}>
            {(data) => (
              <div class="px-4 sm:px-5 py-3.5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50">
                <p class="text-xs text-gray-500">
                  Page{' '}
                  <span class="font-semibold text-gray-700">{data().meta.page}</span>
                  {' '}of{' '}
                  <span class="font-semibold text-gray-700">{data().meta.pages}</span>
                  {' '}—{' '}
                  <span class="font-semibold text-gray-700">{data().meta.total.toLocaleString()}</span> entries
                </p>
                <div class="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { setCurrentPage(currentPage() - 1); refetch(); }}
                    disabled={currentPage() === 1}
                  >
                    ← Prev
                  </Button>
                  <span class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 min-w-[2rem] text-center">
                    {data().meta.page}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { setCurrentPage(currentPage() + 1); refetch(); }}
                    disabled={currentPage() >= data().meta.pages}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </Show>
        </Show>
      </Card>
    </div>
  );
};

export default LogsPage;
