import { defineNuxtModule, createResolver, extendPages } from "@nuxt/kit";
import { addModulePages } from "../../lib/addModulePages";

export interface ModuleOptions {
  features: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "shift",
    configKey: "shift",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    features: ["scheduling", "logging", "tasks"],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    addModulePages("shift", resolver, extendPages);
    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.shift = {
      features: options.features,
    };
  },
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    shift?: ModuleOptions;
  }
  interface NuxtOptions {
    shift?: ModuleOptions;
  }
}
