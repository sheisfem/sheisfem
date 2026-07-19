import { type FilterPillar, pillarLabels } from "../lib/blogIndex";

const list = document.getElementById("entryList");

if (list) {
  const pageSize = 6;
  const state: { query: string; pillar: FilterPillar; sort: "new" | "old"; shown: number } = {
    query: "",
    pillar: "all",
    sort: "new",
    shown: pageSize,
  };
  const entries = Array.from(list.querySelectorAll<HTMLElement>("[data-entry]"));
  const originalOrder = entries.slice();
  const controls = {
    filters: document.getElementById("filters"),
    search: document.getElementById("searchInput") as HTMLInputElement | null,
    searchWrap: document.getElementById("searchWrap"),
    searchClear: document.getElementById("searchClear"),
    sortBtn: document.getElementById("sortBtn"),
    sortLabel: document.getElementById("sortLabel"),
    empty: document.getElementById("emptyState"),
    emptyReset: document.getElementById("emptyReset"),
    findCount: document.getElementById("findCount"),
    countNum: document.getElementById("fcNum"),
    countLabel: document.getElementById("fcLabel"),
    reset: document.getElementById("fcReset"),
    loadWrap: document.getElementById("loadWrap"),
    loadCount: document.getElementById("loadCount"),
    loadBtn: document.getElementById("loadBtn"),
    loadLabel: document.querySelector("#loadBtn .lm-label"),
    findBand: document.getElementById("findBand"),
  };

  const escapeHtml = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char] ?? char
    );

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlight = (value: string) => {
    const safe = escapeHtml(value);
    const query = state.query.trim();
    if (!query) {
      return safe;
    }
    return safe.replace(
      new RegExp(`(${escapeRegExp(escapeHtml(query))})`, "gi"),
      '<mark class="hl">$1</mark>'
    );
  };

  const paintEntryText = (entry: HTMLElement) => {
    const title = entry.querySelector<HTMLElement>("[data-title-target]");
    const excerpt = entry.querySelector<HTMLElement>("[data-excerpt-target]");
    if (title) {
      title.innerHTML = highlight(entry.dataset.title ?? "");
    }
    if (excerpt) {
      excerpt.innerHTML = highlight(entry.dataset.excerpt ?? "");
    }
  };

  const filteredEntries = () => {
    const query = state.query.trim().toLowerCase();
    return entries
      .filter((entry) => {
        const pillars = (entry.dataset.pillars ?? "").split(" ");
        const matchesPillar = state.pillar === "all" || pillars.includes(state.pillar);
        const matchesQuery = !query || (entry.dataset.search ?? "").includes(query);
        return matchesPillar && matchesQuery;
      })
      .sort((a, b) => {
        const order =
          state.sort === "new"
            ? (b.dataset.date ?? "").localeCompare(a.dataset.date ?? "")
            : (a.dataset.date ?? "").localeCompare(b.dataset.date ?? "");
        return order || originalOrder.indexOf(a) - originalOrder.indexOf(b);
      });
  };

  const updateStickyOffset = () => {
    const mast = document.querySelector<HTMLElement>(".mast");
    if (mast && controls.findBand) {
      controls.findBand.style.top = `${mast.offsetHeight - 1}px`;
    }
  };

  const render = () => {
    const filtered = filteredEntries();
    const isFiltered = state.pillar !== "all" || state.query.trim().length > 0;
    const visible = filtered.slice(0, state.shown);

    controls.filters?.querySelectorAll<HTMLElement>(".fchip").forEach((chip) => {
      chip.setAttribute("aria-pressed", chip.dataset.pillar === state.pillar ? "true" : "false");
    });
    controls.searchWrap?.classList.toggle("has-value", state.query.length > 0);
    controls.findCount?.classList.toggle("is-filtered", isFiltered);

    if (controls.countNum) {
      controls.countNum.textContent = String(filtered.length);
    }
    if (controls.countLabel) {
      if (isFiltered) {
        const parts = [];
        if (state.pillar !== "all") {
          parts.push(pillarLabels[state.pillar]);
        }
        if (state.query.trim()) {
          parts.push(`matching "${state.query.trim()}"`);
        }
        controls.countLabel.textContent = `${filtered.length === 1 ? "entry" : "entries"} ${parts.join(" · ")}`;
      } else {
        controls.countLabel.textContent = "field notes in the diary";
      }
    }

    list.replaceChildren(...visible);
    entries.forEach((entry) => {
      const pin = entry.querySelector<HTMLElement>("[data-pin]");
      if (pin) {
        pin.hidden = !(visible[0] === entry && !isFiltered && state.sort === "new");
      }
      paintEntryText(entry);
    });

    controls.empty?.classList.toggle("show", filtered.length === 0);
    const remaining = filtered.length - visible.length;
    if (controls.loadWrap) {
      controls.loadWrap.hidden = remaining <= 0;
    }
    if (remaining > 0 && controls.loadCount && controls.loadLabel) {
      controls.loadCount.textContent = `Showing ${visible.length} of ${filtered.length}`;
      controls.loadLabel.textContent = `Load ${Math.min(pageSize, remaining)} more`;
    }
  };

  const apply = () => {
    state.shown = pageSize;
    render();
  };

  let searchTimer: number;
  controls.search?.addEventListener("input", (event) => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.query = event.target instanceof HTMLInputElement ? event.target.value : "";
      apply();
    }, 90);
  });
  controls.searchClear?.addEventListener("click", () => {
    state.query = "";
    if (controls.search) {
      controls.search.value = "";
      controls.search.focus();
    }
    apply();
  });
  controls.filters?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest<HTMLElement>(".fchip");
    if (!button) {
      return;
    }
    const nextPillar = (button.dataset.pillar as FilterPillar | undefined) ?? "all";
    state.pillar = nextPillar !== "all" && state.pillar === nextPillar ? "all" : nextPillar;
    apply();
  });
  controls.sortBtn?.addEventListener("click", () => {
    state.sort = state.sort === "new" ? "old" : "new";
    if (controls.sortLabel) {
      controls.sortLabel.textContent = state.sort === "new" ? "Newest first" : "Oldest first";
    }
    apply();
  });
  controls.loadBtn?.addEventListener("click", () => {
    state.shown += pageSize;
    render();
  });

  const resetAll = () => {
    state.query = "";
    state.pillar = "all";
    state.sort = "new";
    if (controls.search) {
      controls.search.value = "";
      controls.search.focus();
    }
    if (controls.sortLabel) {
      controls.sortLabel.textContent = "Newest first";
    }
    apply();
  };
  controls.reset?.addEventListener("click", resetAll);
  controls.emptyReset?.addEventListener("click", resetAll);
  window.addEventListener("resize", updateStickyOffset);

  updateStickyOffset();
  render();
}
