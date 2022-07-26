import { getCheerioFromFile, exportData } from "./modules/file-handler.js";
import { buildActions, buildGroupsByCharacter } from "./modules/builder.js";

const processFile = (fileInputDir, fileOutputDir) => {
  const $ = getCheerioFromFile(fileInputDir);
  const trackGroup = buildGroupsByCharacter($);
  const builtGroups = buildActions($, trackGroup);

  exportData(fileOutputDir, JSON.stringify(builtGroups));
};

processFile("html-to-convert.txt", "./output/output.json");
