const path = require("path");
const fs = require("fs");

function platformVendorDir() {
  if (process.platform === "win32") {
    return "windows-x86_64";
  }
  if (process.platform === "linux") {
    return "linux-x86_64";
  }
  throw new Error(`Unsupported platform: ${process.platform}`);
}

function firstExistingPath(paths) {
  return paths.find((candidate) => fs.existsSync(candidate)) || paths[0];
}

const vendorPath = firstExistingPath([
  process.platform === "win32" ? path.join(__dirname, platformVendorDir()) : __dirname,
  __dirname,
]);
const addonPath = firstExistingPath([
  path.join(__dirname, "..", "build", "Release", "conversion_node.node"),
  path.join(__dirname, "conversion_node.node"),
]);
const resourcePath = firstExistingPath([
  path.join(__dirname, "..", "resource"),
]);

function findNativeSdkLibraryName() {
  if (process.env.CONVERSION_NODE_NATIVE_SDK_FILE) {
    return process.env.CONVERSION_NODE_NATIVE_SDK_FILE;
  }
  if (process.env.CONVERSION_NODE_NATIVE_SDK_NAME) {
    if (process.platform === "win32") {
      return `${process.env.CONVERSION_NODE_NATIVE_SDK_NAME}.dll`;
    }
    return `lib${process.env.CONVERSION_NODE_NATIVE_SDK_NAME}.so`;
  }

  const defaultName = process.platform === "win32" ? "pdfsolidconversionsdk.dll" : "libpdfsolidconversionsdk.so";
  if (fs.existsSync(path.join(vendorPath, defaultName))) {
    return defaultName;
  }

  if (!fs.existsSync(vendorPath)) {
    return defaultName;
  }

  const nativeSdkPattern = process.platform === "win32"
    ? /^[A-Za-z0-9_]+conversionsdk\.dll$/i
    : /^lib[A-Za-z0-9_]+conversionsdk\.so$/;
  const matches = fs.readdirSync(vendorPath)
    .filter((name) => nativeSdkPattern.test(name))
    .sort();
  return matches[0] || defaultName;
}

function requiredVendorFiles() {
  if (process.platform === "win32") {
    return [
      findNativeSdkLibraryName(),
      "DocumentAI.dll",
      "onnxruntime.dll",
      "onnxruntime_providers_shared.dll",
      "opencv_world4100.dll",
    ];
  }
  return [
    findNativeSdkLibraryName(),
    "libDocumentAI.so.4.3.0",
    "libonnxruntime.so.1",
    "libopencv_world.so.410",
  ];
}

function assertRuntimeFiles() {
  if (!fs.existsSync(addonPath)) {
    throw new Error(
      `Conversion Node addon not found: ${addonPath}. Run npm run build or use a release package that includes lib/conversion_node.node.`,
    );
  }

  if (!fs.existsSync(vendorPath)) {
    throw new Error(`Conversion vendor directory not found: ${vendorPath}`);
  }

  const missingFiles = requiredVendorFiles()
    .map((name) => path.join(vendorPath, name))
    .filter((filePath) => !fs.existsSync(filePath));

  if (missingFiles.length > 0) {
    throw new Error(`Conversion runtime libraries are missing:\n${missingFiles.join("\n")}`);
  }
}

assertRuntimeFiles();

if (process.platform === "win32") {
  process.env.PATH = `${vendorPath}${path.delimiter}${process.env.PATH || ""}`;
}

let native;
try {
  native = require(addonPath);
} catch (error) {
  throw new Error(
    `Failed to load Conversion Node addon from ${addonPath}. Vendor path: ${vendorPath}. Original error: ${error.message}`,
  );
}

function normalizeResourcePath(customResourcePath = process.env.CONVERSION_RESOURCE_PATH || "") {
  const resolvedResourcePath = String(customResourcePath || "");
  if (resolvedResourcePath.length === 0) {
    return "";
  }

  const absoluteResourcePath = path.resolve(resolvedResourcePath);
  const fontsPath = path.join(absoluteResourcePath, "fonts");
  if (!fs.existsSync(fontsPath) || !fs.statSync(fontsPath).isDirectory()) {
    throw new Error(`SDK resource fonts directory not found: ${fontsPath}`);
  }
  return absoluteResourcePath;
}

function initialize(customResourcePath) {
  return native.initialize(normalizeResourcePath(customResourcePath));
}

// Mirrors CWordPdfBookmarkMode; the TypeScript declaration exports the enum.
const WordPdfBookmarkMode = Object.freeze({
  None: 0,
  Headings: 1,
  WordBookmarks: 2,
});

module.exports = {
  ...native,
  initialize,
  normalizeResourcePath,
  resourcePath,
  vendorPath,
  WordPdfBookmarkMode,
};
