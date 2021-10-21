import { readFile } from "jsonfile";

export type Page = {
  title: string;
  children: (Page | string)[];
};

// Quick and dirty validator that the json did indeed contain Pages.
const validatePage = (object: Record<string, unknown>): void => {
  if (typeof object !== "object") {
    throw new Error("not an object!");
  }
  if (typeof object.title !== "string") {
    throw new Error("missing string `title` property on object");
  }
  if (!Array.isArray(object.children)) {
    throw new Error(
      "missing array of string or Page `children` property on object"
    );
  }
  if (Object.keys(object).length !== 2) {
    throw new Error(
      `unknown properties added to object: ${Object.keys(object)
        .filter((key) => ["children", "title"].indexOf(key) === -1)
        .join(", ")}`
    );
  }
  object.children.forEach((subobject) => {
    if (typeof subobject === "string") {
      // ok
      return;
    }
    validatePage(subobject);
  });
};

export const loadManifest = async (jsonPath: string): Promise<Page> => {
  const manifest = (await readFile(jsonPath)) as Page;
  validatePage(manifest);
  return manifest;
};
