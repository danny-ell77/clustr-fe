import type { Resolver } from '@nuxt/kit';

/**
 * Registers all .vue files in the given module's pages directory as Nuxt pages.
 * @param moduleName The name of the module (used for route prefix and page name)
 * @param resolver The Nuxt resolver instance
 * @param extendPages The Nuxt extendPages function
 */
export function useAddModulePages(moduleName: string, resolver: Resolver, extendPages: (cb: (pages: any[]) => void) => void) {
    extendPages((pages) => {
        const pagesDir = resolver.resolve('./pages');
        const { resolve } = resolver;
        const fs = require('fs');

        if (fs.existsSync(pagesDir)) {
            const files = fs.readdirSync(pagesDir);
            files.forEach((file: string) => {
                if (file.endsWith('.vue')) {
                    const name = file.replace(/\.vue$/, '');
                    pages.push({
                        name: `${moduleName}-${name}`,
                        path: `/${moduleName}/${name === 'index' ? '' : name}`,
                        file: resolve(pagesDir, file),
                    });
                }
            });
        }
    });
}
