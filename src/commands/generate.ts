import { promises as fs, existsSync } from "fs";
import { Argv, CommandModule } from "yargs";
import { buildPages } from "../buildPages";
import { loadManifest } from "../loadManifest";

type GenerateArgs = {
  /**
    The path to generate the site in.
   */
  out: string;

  /**
    The path to the JSON manifest for the site.
   */
  jsonPath: string;
};

export async function generate({ jsonPath, out }: GenerateArgs): Promise<void> {
  // Confirm that we will not overwrite destination directory
  if (existsSync(out)) {
    throw new Error(`will not overwrite output path: ${out}`);
  }
  const manifest = await loadManifest(jsonPath);

  await buildPages({
    basePath: out,
    page: manifest,
  });
}

const commandModule: CommandModule<{ jsonPath: string }, GenerateArgs> = {
  command: "generate <jsonPath>",
  builder(argv): Argv<GenerateArgs> {
    return argv.option("out", {
      alias: "o",
      demandOption: true,
      describe: "where to generate the site",
      type: "string",
    });
  },
  handler: async (args) => {
    try {
      await generate(args);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  describe: "generate a site from the given JSON manifest file",
};

export default commandModule;
