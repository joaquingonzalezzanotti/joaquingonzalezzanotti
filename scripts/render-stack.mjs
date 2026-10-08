import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(projectRoot, "assets/data/stack.json");
const startMarker = "<!-- STACK:START -->";
const endMarker = "<!-- STACK:END -->";

const stack = JSON.parse(await readFile(dataPath, "utf8"));
const contextIds = new Set(stack.contexts.map((context) => context.id));

if (contextIds.size !== stack.contexts.length) {
  throw new Error("Every stack context must have a unique id.");
}

for (const layer of stack.layers) {
  for (const technology of layer.technologies) {
    for (const context of technology.contexts) {
      if (!contextIds.has(context)) {
        throw new Error(`Unknown context \"${context}\" in ${technology.name}.`);
      }
    }
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStack(language, newline) {
  const section = stack.section;
  const lines = [
    '      <section id="stack" class="section stack-section">',
    '        <div class="container">',
    '          <div class="section-header">',
    `            <h2 class="section-title">${escapeHtml(section.title[language])}</h2>`,
    `            <p class="section-subtitle">${escapeHtml(section.subtitle[language])}</p>`,
    "          </div>",
    '          <div class="stack-stage">',
    '            <div class="stack-stage-header">',
    '              <div class="stack-stage-intro">',
    `                <p class="stack-eyebrow">${escapeHtml(section.eyebrow[language])}</p>`,
    `                <p class="stack-context-summary" data-stack-summary data-default-summary="${escapeHtml(section.defaultSummary[language])}" aria-live="polite">${escapeHtml(section.defaultSummary[language])}</p>`,
    "              </div>",
    `              <div class="stack-filters" role="group" aria-label="${escapeHtml(section.filterLabel[language])}">`,
  ];

  for (const context of stack.contexts) {
    lines.push(
      `                <button type="button" class="stack-filter" data-stack-filter="${escapeHtml(context.id)}" data-stack-summary="${escapeHtml(context.summary[language])}" aria-pressed="false">${escapeHtml(context.label)}</button>`,
    );
  }

  lines.push("              </div>", "            </div>", `            <div class="stack-map" style="--stack-layer-count: ${stack.layers.length}">`);

  stack.layers.forEach((layer, index) => {
    const layerContexts = [...new Set(layer.technologies.flatMap((technology) => technology.contexts))];
    lines.push(
      `              <article class="stack-layer" data-used="${escapeHtml(layerContexts.join(" "))}">`,
      '                <div class="stack-layer-heading">',
      `                  <span class="stack-layer-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>`,
      `                  <h3>${escapeHtml(layer.title[language])}</h3>`,
      "                </div>",
      '                <div class="stack-nodes">',
    );

    for (const technology of layer.technologies) {
      lines.push(
        `                  <div class="stack-node" data-used="${escapeHtml(technology.contexts.join(" "))}">`,
        `                    <span class="stack-node-mark" aria-hidden="true">${escapeHtml(technology.mark)}</span>`,
        `                    <span class="stack-node-name">${escapeHtml(technology.name)}</span>`,
        "                  </div>",
      );
    }

    lines.push("                </div>", "              </article>");
  });

  lines.push("            </div>", "          </div>", "        </div>", "      </section>");
  return lines.join(newline);
}

async function updatePage(relativePath, language) {
  const pagePath = resolve(projectRoot, relativePath);
  const source = await readFile(pagePath, "utf8");
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Missing or invalid stack markers in ${relativePath}.`);
  }

  const generated = `${startMarker}${newline}${renderStack(language, newline)}${newline}      ${endMarker}`;
  const updated = source.slice(0, start) + generated + source.slice(end + endMarker.length);
  await writeFile(pagePath, updated, "utf8");
  console.log(`Updated ${relativePath}`);
}

await updatePage("index.html", "es");
await updatePage("en/index.html", "en");
