import type { Resolver } from "@nuxt/kit";
import { fs, path } from "./node-utils";

/**
 * Registers all .vue files in the given module's pages directory as Nuxt pages.
 * @param moduleName The name of the module (used for route prefix and page name)
 * @param resolver The Nuxt resolver instance
 * @param extendPages The Nuxt extendPages function
 */
export function useAddModulePages(
  moduleName: string,
  resolver: Resolver,
  extendPages: (cb: (pages: any[]) => void) => void
) {
  extendPages((pages) => {
    const pagesDir = resolver.resolve("./pages");
    const { resolve } = resolver;

    function addPagesRecursively(dir: string, basePath: string = "") {
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);
        items.forEach((item: string) => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            // Handle directories
            addPagesRecursively(fullPath, `${basePath}/${item}`);
          } else if (item.endsWith(".vue")) {
            // Handle .vue files
            const name = item.replace(/\.vue$/, "");
            const routePath =
              name === "index"
                ? basePath
                : name.startsWith("[") && name.endsWith("]")
                ? `${basePath}/:${name.slice(1, -1)}` // Convert [id].vue to /:id
                : `${basePath}/${name}`;

            pages.push({
              name: `${moduleName}${basePath.replace(/\//g, "-")}-${name}`,
              path: `/${moduleName}${routePath}`,
              file: fullPath,
            });
          }
        });
      }
    }

    addPagesRecursively(pagesDir);
  });
}
