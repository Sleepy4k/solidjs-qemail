import { Component, For, Show } from "solid-js";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const alwaysShow = new Set<number>();
  alwaysShow.add(1);
  alwaysShow.add(total);
  alwaysShow.add(Math.max(1, current - 1));
  alwaysShow.add(current);
  alwaysShow.add(Math.min(total, current + 1));

  const sorted = Array.from(alwaysShow).sort((a, b) => a - b);
  const result: (number | "...")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 2) {
      result.push("...");
    } else if (i > 0 && sorted[i] - sorted[i - 1] === 2) {
      result.push(sorted[i] - 1);
    }
    result.push(sorted[i]);
  }

  return result;
}

const Pagination: Component<PaginationProps> = (props) => {
  const pages = () => getPageNumbers(props.currentPage, props.totalPages);

  const start = () =>
    Math.min((props.currentPage - 1) * props.pageSize + 1, props.total);
  const end = () => Math.min(props.currentPage * props.pageSize, props.total);

  return (
    <div class="px-4 sm:px-5 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p class="text-xs text-gray-500">
        <span class="font-semibold text-gray-700">
          {start().toLocaleString()}–{end().toLocaleString()}
        </span>{" "}
        of{" "}
        <span class="font-semibold text-gray-700">
          {props.total.toLocaleString()}
        </span>{" "}
        entries
      </p>

      <div class="flex items-center gap-1">
        <button
          onClick={() => props.onPageChange(props.currentPage - 1)}
          disabled={props.currentPage === 1}
          class="h-8 px-2.5 flex items-center gap-1 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          {"< Prev"}
        </button>

        <For each={pages()}>
          {(page) => (
            <Show
              when={page !== "..."}
              fallback={
                <span class="w-8 h-8 flex items-center justify-center text-xs text-gray-400 select-none">
                  …
                </span>
              }
            >
              <button
                onClick={() => props.onPageChange(page as number)}
                class={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium border transition-colors ${
                  page === props.currentPage
                    ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            </Show>
          )}
        </For>

        <button
          onClick={() => props.onPageChange(props.currentPage + 1)}
          disabled={props.currentPage >= props.totalPages}
          class="h-8 px-2.5 flex items-center gap-1 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          {"Next >"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
