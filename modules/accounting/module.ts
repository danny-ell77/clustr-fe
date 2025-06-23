import {
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendPages,
} from "@nuxt/kit";
import { useAddModulePages } from "~/lib/useAddModulePages";

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

    addPlugin(resolver.resolve("./runtime/plugins/accounting"));

    useAddModulePages("accounting", resolver, extendPages)

    nuxt.options.runtimeConfig.public.portal = {
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
