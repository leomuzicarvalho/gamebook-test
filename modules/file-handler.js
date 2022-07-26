import { writeFileSync, readFileSync } from "fs";
import { load } from "cheerio";

export const getCheerioFromFile = (file) => {
  const txt = readFileSync(file, "utf-8", (err, data) =>
    err ? console.error(err) : data
  );

  if (txt) return load(txt);
};

export const exportData = (fileName, jsonContent) => {
  writeFileSync(fileName, jsonContent);
};
