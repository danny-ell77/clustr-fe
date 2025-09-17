import { defineNuxtModule, createResolver, extendPages } from "@nuxt/kit";
import { addModulePages } from "../../lib/addModulePages";

export interface ModuleOptions {
  features: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "property",
    configKey: "property",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    features: ["listings", "maintenance", "tenants"],
  },

  setup(options: any, nuxt: any) {
    const resolver = createResolver(import.meta.url);

    addModulePages("property", resolver, extendPages);

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.property = {
      features: options.features,
    };
  },
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    property?: ModuleOptions;
  }
  interface NuxtOptions {
    property?: ModuleOptions;
  }
}
