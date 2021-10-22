# Snooty Mockup

Mock up sites quickly from a JSON manifest file.

## Install Dependencies & Build

```shell
npm install
npm run build
```

## Manifest Format

A manifest file is a JSON file that shows pages and sections to build for the
site. The root object is a `Page`.

```json
{
  "title": "The Title of the Page",
  "children": [
    // Child pages if the page is a 'section'
  ],
}
```

A page can be represented by either a `Page` object (as above) or with just a
string. A string is interpreted as the title of a leaf page.

## Run the App

The following command takes the manifest.json file and creates the rST/toctrees
at path/to/site/source.

```shell
node path/to/snooty-mockup/build/main.js \
  generate path/to/manifest.json \
  -o path/to/site/source
```

