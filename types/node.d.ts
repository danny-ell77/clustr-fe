declare namespace NodeJS {
  interface Process {
    server: boolean;
    client: boolean;
    env: ProcessEnv;
  }
  interface ProcessEnv {
    NODE_ENV: string;
    [key: string]: string | undefined;
  }
}

declare const process: NodeJS.Process;

// For ESM
declare module "node:fs" {
  export * from "fs";
}

declare module "node:path" {
  export * from "path";
}

// For require in modules
declare function require(id: string): any;

// For import.meta
interface ImportMeta {
  url: string;
}
