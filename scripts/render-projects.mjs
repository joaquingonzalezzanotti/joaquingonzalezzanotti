import { access, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(projectRoot, "assets/data/projects.json");
const startMarker = "<!-- PROJECTS:START -->";
const endMarker = "<!-- PROJECTS:END -->";
const data = JSON.parse(await readFile(dataPath, "utf8"));
const projectIds = new Set(data.projects.map((project) => project.id));

if (projectIds.size !== data.projects.length) {
  throw new Error("Every project must have a unique id.");
}

for (const project of data.projects) {
  const localImagePath = resolve(projectRoot, project.image.replace(/^\//, ""));
  await access(localImagePath);

  if (project.githubUrl && project.repositoryPrivate) {
    throw new Error(`${project.id} cannot have both a public GitHub URL and a private repository state.`);
  }

  if (!project.githubUrl && !project.repositoryPrivate) {
    throw new Error(`${project.id} must declare either a public GitHub URL or a private repository state.`);
  }

  if (project.primaryUrl && !project.primaryLabel) {
    throw new Error(`${project.id} is missing its primary link label.`);
  }

  if (project.githubUrl && !project.githubLabel) {
    throw new Error(`${project.id} is missing its GitHub link label.`);
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

function localized(value, language) {
  return typeof value === "string" ? value : value[language];
}

const githubIcon = '<svg class="github-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"></path><path d="M8 19c-3 .9-3-1.5-4-2"></path></svg>';
const arrowIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>';
const lockIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="11" x="5" y="11" rx="2" ry="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
const previousIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>';
const nextIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>';

function renderCard(project, language) {
  const title = localized(project.title, language);
  const positionClass = project.imagePosition === "center" ? " project-card-media-center" : "";
  const cardClasses = ["project-card-v2"];

  if (project.primaryUrl) cardClasses.push("project-card-linked");
  if (project.repositoryPrivate) cardClasses.push("project-card-private");

  const lines = [
    `              <article class="${cardClasses.join(" ")}">`,
  ];

  if (project.primaryUrl) {
    lines.push(`                <a href="${escapeHtml(project.primaryUrl)}" class="project-card-primary-link" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(project.primaryLabel[language])}"></a>`);
  }

  lines.push(
    `                <div class="project-card-media${positionClass}">`,
    `                  <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.alt[language])}" loading="lazy" decoding="async" width="800" height="450" />`,
    "                </div>",
    '                <div class="project-card-content">',
  );

  if (project.githubUrl) {
    lines.push(`                  <a href="${escapeHtml(project.githubUrl)}" class="project-github-link" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(project.githubLabel[language])}">${githubIcon}${arrowIcon}</a>`);
  } else if (project.repositoryPrivate) {
    lines.push(`                  <span class="project-repository-private" aria-label="${escapeHtml(data.section.privateRepositoryLabel[language])}" title="${escapeHtml(data.section.privateRepositoryLabel[language])}">${lockIcon}<span>${escapeHtml(data.section.privateRepositoryShortLabel[language])}</span></span>`);
  }

  lines.push(
    `                  <span class="project-card-badge">${escapeHtml(project.badge[language])}</span>`,
    `                  <h3 class="project-card-title">${escapeHtml(title)}</h3>`,
    `                  <p class="project-card-desc">${escapeHtml(project.description[language])}</p>`,
    '                  <div class="project-card-stack">',
  );

  for (const technology of project.stack) {
    lines.push(`                    <span class="chip">${escapeHtml(technology)}</span>`);
  }

  lines.push("                  </div>", "                </div>", "              </article>");
  return lines;
}

function renderProjects(language, newline) {
  const section = data.section;
  const initialStatus = section.statusDefaultTemplate[language].replace("{total}", String(data.projects.length));
  const lines = [
    '      <section id="projects" class="section projects-section">',
    '        <div class="container">',
    '          <div class="projects-heading-row">',
    '            <div class="section-header">',
    `              <h2 class="section-title">${escapeHtml(section.title[language])}</h2>`,
    `              <p class="section-subtitle">${escapeHtml(section.subtitle[language])}</p>`,
    "            </div>",
    '            <div class="projects-carousel-controls">',
    `              <span class="projects-carousel-status" data-carousel-status aria-live="polite">${escapeHtml(initialStatus)}</span>`,
    `              <button type="button" class="projects-carousel-button" data-carousel-previous aria-label="${escapeHtml(section.previousLabel[language])}">${previousIcon}</button>`,
    `              <button type="button" class="projects-carousel-button" data-carousel-next aria-label="${escapeHtml(section.nextLabel[language])}">${nextIcon}</button>`,
    "            </div>",
    "          </div>",
    `          <div class="projects-carousel" data-projects-carousel data-status-template="${escapeHtml(section.statusTemplate[language])}">`,
    `            <div class="projects-track" data-carousel-track tabindex="0" aria-label="${escapeHtml(section.carouselLabel[language])}">`,
  ];

  for (const project of data.projects) {
    lines.push(...renderCard(project, language));
  }

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
    throw new Error(`Missing or invalid project markers in ${relativePath}.`);
  }

  const generated = `${startMarker}${newline}${renderProjects(language, newline)}${newline}      ${endMarker}`;
  const updated = source.slice(0, start) + generated + source.slice(end + endMarker.length);
  await writeFile(pagePath, updated, "utf8");
  console.log(`Updated ${relativePath}`);
}

await updatePage("index.html", "es");
await updatePage("en/index.html", "en");
