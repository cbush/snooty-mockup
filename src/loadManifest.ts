import { loadJsonFile } from "load-json-file";

export type Page = {
  title: string;
  children: (Page | string)[];
};

export const loadManifest = async (jsonPath: string): Promise<Page> => {
  const manifest = await loadJsonFile<Page>(jsonPath);
  return manifest;
};
