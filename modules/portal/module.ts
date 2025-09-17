import { defineNuxtModule, createResolver, extendPages } from "@nuxt/kit";
import { addModulePages } from "../../lib/addModulePages";

export interface ModuleOptions {
  features: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "portal",
    configKey: "portal",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    features: ["chat", "meetings", "announcements"],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    addModulePages("portal", resolver, extendPages);

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.portal = {
      features: options.features,
    };
  },
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    portal?: ModuleOptions;
  }
  interface NuxtOptions {
    portal?: ModuleOptions;
  }
}
