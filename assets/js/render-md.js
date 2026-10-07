(function () {
  const DOC_INDEX = [
    { id: "readme", file: "README.md", label: "Index GDD" },
    { id: "01-vision", file: "01-vision.md", label: "01 — Vision" },
    { id: "02-loop-de-partie", file: "02-loop-de-partie.md", label: "02 — Loop de partie" },
    { id: "03-monde-et-build", file: "03-monde-et-build.md", label: "03 — Monde & build" },
    { id: "04-monstres", file: "04-monstres.md", label: "04 — Monstres" },
    { id: "05-systemes", file: "05-systemes.md", label: "05 — Systèmes" },
    { id: "06-monetisation", file: "06-monetisation.md", label: "06 — Monétisation" },
    { id: "07-events", file: "07-events.md", label: "07 — Events" },
    { id: "08-ouvertes-et-roadmap", file: "08-ouvertes-et-roadmap.md", label: "08 — Ouvertes & roadmap" },
    { id: "09-technique", file: "09-technique.md", label: "09 — Technique" },
  ];

  function gddBaseUrl() {
    return new URL("gdd/", window.location.href);
  }

  function currentDocId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("doc") || "readme";
  }

  function renderNav(activeId) {
    const nav = document.getElementById("gdd-nav");
    if (!nav) return;
    nav.innerHTML = DOC_INDEX.map((doc) => {
      const href = `gdd.html?doc=${encodeURIComponent(doc.id)}`;
      const active = doc.id === activeId ? " active" : "";
      return `<li><a class="${active.trim()}" href="${href}">${doc.label}</a></li>`;
    }).join("");
  }

  function rewriteMarkdownLinks(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    container.querySelectorAll("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
        return;
      }
      const match = href.match(/^(?:\.\/)?([a-z0-9-]+)\.md([#].*)?$/i);
      if (match) {
        const id = match[1] === "README" ? "readme" : match[1];
        const hash = match[2] || "";
        anchor.setAttribute("href", `gdd.html?doc=${encodeURIComponent(id)}${hash}`);
      }
    });
    return container.innerHTML;
  }

  async function loadDoc(docId) {
    const target = document.getElementById("md-content");
    if (!target) return;

    const entry = DOC_INDEX.find((d) => d.id === docId) || DOC_INDEX[0];
    renderNav(entry.id);
    document.title = `${entry.label} — The Mansion`;

    target.innerHTML = '<p class="md-loading">Chargement…</p>';

    try {
      const url = new URL(entry.file, gddBaseUrl());
      const response = await fetch(url.href);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const markdown = await response.text();
      if (typeof marked === "undefined") {
        throw new Error("marked.js indisponible");
      }
      marked.setOptions({ gfm: true, breaks: false });
      const html = rewriteMarkdownLinks(marked.parse(markdown));
      target.innerHTML = html;
    } catch (error) {
      target.innerHTML = `<p class="md-error">Impossible de charger <code>${entry.file}</code>. ${error.message}. Sur GitHub Pages, vérifie que le fichier est bien déployé. En local, sers le dossier via un serveur HTTP (pas file://).</p>`;
    }
  }

  function init() {
    loadDoc(currentDocId());
  }

  window.TMRenderMd = { DOC_INDEX, loadDoc, init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
