import * as Path from "path";
import { promises as fs } from "fs";
import { Page } from "./loadManifest";

const titleToUriSegment = ({ title }: { title: string }): string => {
  return title
    .replace(/&/g, "and") // ampersands become "and"
    .replace(/[^A-z0-9]/g, "-") // non-alphanumeric characters become dashes
    .replace(/-+/g, "-") // multiple dashes become one dash
    .replace(/^-+/, "") // trim starting dashes
    .replace(/-+$/, "") // trim trailing dashes
    .toLowerCase();
};

const pageFromPageOrTitle = (pageOrTitle: Page | string): Page =>
  typeof pageOrTitle === "string"
    ? {
        children: [],
        title: pageOrTitle,
      }
    : pageOrTitle;

/**
  Builds the page and its children by creating the directory structure and
  writing the page as a file.
 */
export const buildPages = async ({
  basePath,
  subPath = "/",
  page: pageOrTitle,
}: {
  basePath: string;
  subPath?: string;
  page: Page | string;
}): Promise<void> => {
  const directoryPath = Path.join(basePath, subPath);
  await fs.mkdir(directoryPath, { recursive: true });

  // As a shortcut, a leaf page can be specified with just a title string.
  const page = pageFromPageOrTitle(pageOrTitle);

  const isRoot = subPath === "/";
  const pageUriSegment = titleToUriSegment(page);
  const pagePath = isRoot ? subPath : Path.join(subPath, pageUriSegment);
  const tocTree = `.. toctree::
   :titlesonly:
   :hidden:

${page.children
  .map((subpageOrTitle) => {
    const subpage = pageFromPageOrTitle(subpageOrTitle);
    return `   ${subpage.title} <${Path.join(
      pagePath,
      titleToUriSegment(subpage)
    )}>`;
  })
  .join("\n")}`;
  const headingDecorator = new Array(page.title.length).fill("=").join("");
  const text = `${headingDecorator}
${page.title}
${headingDecorator}

${page.children.length === 0 ? "" : tocTree}

`;
  await fs.writeFile(
    Path.join(basePath, isRoot ? "index.txt" : `${pagePath}.txt`),
    text,
    "utf8"
  );
  await Promise.all(
    page.children.map((subpage) =>
      buildPages({
        basePath,
        subPath: isRoot ? "." : pagePath,
        page: subpage,
      })
    )
  );
};
