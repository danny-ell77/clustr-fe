import { defineNuxtModule, createResolver, extendPages } from "@nuxt/kit";
import { useAddModulePages } from "../../lib/useAddModulePages";

export interface ModuleOptions {
  features: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "accounting",
    configKey: "accounting",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    features: ["invoices", "payments", "reports"],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    useAddModulePages("accounting", resolver, extendPages);

    nuxt.options.runtimeConfig.public.accounting = {
      features: options.features,
    };
  },
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    accounting?: ModuleOptions;
  }
  interface NuxtOptions {
    accounting?: ModuleOptions;
  }
}
