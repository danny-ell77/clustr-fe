// This file provides a safe way to import Node.js modules in both ESM and CommonJS environments
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export const fs = require("fs");
export const path = require("path");
