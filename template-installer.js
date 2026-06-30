import * as fs from "fs";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_REGISTRY_PATH = path.join(
  __dirname,
  "content",
  "templates",
  "registry.json"
);

let templateRegistryCache;

function loadTemplateRegistry() {
  if (!templateRegistryCache) {
    templateRegistryCache = JSON.parse(
      fs.readFileSync(TEMPLATE_REGISTRY_PATH, "utf8")
    );
  }

  return templateRegistryCache;
}

function getDefaultProjectTemplateName() {
  return (
    process.env.STEACC_PROJECT_TEMPLATE ||
    loadTemplateRegistry().defaultTemplate
  );
}

function renderTemplateString(text, templateContext) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(templateContext, key)) {
      return String(templateContext[key]);
    }

    return match;
  });
}

function writeTemplateFile(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content);
}

function installProjectTemplate(
  templateName,
  projectDir,
  templateContext = {}
) {
  const registry = loadTemplateRegistry();
  const template = registry.templates?.[templateName];

  if (!template) {
    console.error(
      `Error: Unknown project template '${templateName}'. Available templates: ${Object.keys(
        registry.templates || {}
      ).join(", ")}`
    );
    process.exit(1);
  }

  const manifestPath = path.resolve(
    path.dirname(TEMPLATE_REGISTRY_PATH),
    template.manifest
  );
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const manifestDir = path.dirname(manifestPath);

  for (const action of manifest.actions || []) {
    const targetPath = path.join(
      projectDir,
      renderTemplateString(action.target, templateContext)
    );

    switch (action.type) {
      case "mkdir":
        fs.mkdirSync(targetPath, { recursive: true });
        break;
      case "write":
        writeTemplateFile(
          targetPath,
          renderTemplateString(action.content || "", templateContext)
        );
        break;
      case "copy": {
        const sourcePath = path.resolve(manifestDir, action.source);
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(sourcePath, targetPath);
        break;
      }
      default:
        console.error(
          `Error: Unknown template action '${action.type}' in ${template.manifest}`
        );
        process.exit(1);
    }
  }
}

export { getDefaultProjectTemplateName, installProjectTemplate };
