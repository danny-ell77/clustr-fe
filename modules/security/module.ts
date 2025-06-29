import {
  defineNuxtModule,
  createResolver,
  extendPages,
} from "@nuxt/kit";
import { useAddModulePages } from '../../lib/useAddModulePages';

export interface ModuleOptions {
  features: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "security",
    configKey: "security",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    features: ["users", "roles", "logs"],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    useAddModulePages('security', resolver, extendPages);

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.security = {
      features: options.features,
    };
  },
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    security?: ModuleOptions;
  }
}
