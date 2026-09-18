#!/usr/bin/env node
/*
 * Linux x86_64 sample for PdfSolid Conversion SDK for Node.js.
 *
 * Usage:
 *   node samples/demo/demo.js
 *   node samples/demo/demo.js --output samples/output_files
 *   node samples/demo/demo.js --output /tmp/out /path/to/input.pdf
 *   node samples/demo/demo.js --output /tmp/out --threads 2 input1.pdf input2.pdf
 *
 * Defaults:
 *   - License: samples/license.xml, or PDFSOLID_LICENSE / PDFSOLID_LICENSE_KEY.
 *   - Model: resource/models/documentai.model from this release package.
 *   - Runtime: lib/.
 *   - No input PDFs: convert samples/input_files with the C demo style conversion suite.
 */

const { fork } = require("child_process");
const fs = require("fs");
const path = require("path");

const EXPECTED_PLATFORM = "linux";
const PLATFORM_NAME = "Linux x86_64";
const SAMPLE_COMMAND = "node samples/demo/demo.js";
const RELEASE_ROOT = path.resolve(__dirname, "../..");
const sdk = require(path.join(RELEASE_ROOT, "lib/index.js"));

const SUCCESS = 0;
// These defaults are resolved from this sample file, so running the script from
// any working directory still uses the release package's own sample assets.
const DEFAULT_LICENSE_PATH = path.resolve(__dirname, "../license.xml");
const DEFAULT_MODEL_PATH = path.join(RELEASE_ROOT, "resource/models/documentai.model");
const DEFAULT_INPUT_DIR = path.resolve(__dirname, "../input_files");
const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, "../output_files");

const OCRLanguage = Object.freeze({
  CHINESE: 1,
  ENGLISH: 3,
});

const PageLayoutMode = Object.freeze({
  BOX: 0,
  FLOW: 1,
});

const OCROption = Object.freeze({
  ALL: 3,
});

const ImageColorMode = Object.freeze({
  COLOR: 0,
});

const ImageType = Object.freeze({
  JPG: 0,
});

const ExcelWorksheetOption = Object.freeze({
  FOR_TABLE: 0,
});

const HtmlOption = Object.freeze({
  SINGLE_PAGE: 0,
});

function defaultLicenseOptions() {
  // Environment variables make CI and local license testing possible without
  // editing this sample file.
  return {
    license:
      process.env.PDFSOLID_LICENSE ||
      process.env.PDFSOLID_LICENSE_KEY ||
      DEFAULT_LICENSE_PATH,
    deviceId: process.env.PDFSOLID_DEVICE_ID || "",
    appId:
      process.env.PDFSOLID_APP_ID ||
      process.env.PDFSOLID_LICENSE_PACKAGE ||
      "com.pdfsolid.conversion.demo",
    resource: process.env.PDFSOLID_RESOURCE_PATH || "",
  };
}

function defaultModelPath() {
  return process.env.PDFSOLID_MODEL_PATH || DEFAULT_MODEL_PATH;
}

function optionValue(argv, index, optionName) {
  const value = argv[index + 1];
  if (value === undefined) {
    throw new Error(`${optionName} requires a value`);
  }
  return value;
}

function isLicenseFilePath(license) {
  if (!license || typeof license !== "string") {
    return false;
  }
  return license.toLowerCase().endsWith(".xml") || fs.existsSync(path.resolve(license));
}

function normalizeLicenseValue(license) {
  const value = String(license || "");
  if (value.length === 0) {
    throw new Error("License is required. Pass --license or set PDFSOLID_LICENSE.");
  }
  if (isLicenseFilePath(value)) {
    const resolved = path.resolve(value);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      throw new Error(`License file not found: ${resolved}`);
    }
    return resolved;
  }
  return value;
}

function parseLicenseOptions(argv) {
  const licenseOptions = defaultLicenseOptions();
  const restArgs = [];
  let appIdSpecified = Boolean(
    process.env.PDFSOLID_APP_ID ||
      process.env.PDFSOLID_LICENSE_PACKAGE,
  );

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--license") {
      licenseOptions.license = optionValue(argv, index, arg);
      index += 1;
    } else if (arg.startsWith("--license=")) {
      licenseOptions.license = arg.slice("--license=".length);
    } else if (arg === "--device-id") {
      licenseOptions.deviceId = optionValue(argv, index, arg);
      index += 1;
    } else if (arg.startsWith("--device-id=")) {
      licenseOptions.deviceId = arg.slice("--device-id=".length);
    } else if (arg === "--app-id") {
      licenseOptions.appId = optionValue(argv, index, arg);
      appIdSpecified = true;
      index += 1;
    } else if (arg.startsWith("--app-id=")) {
      licenseOptions.appId = arg.slice("--app-id=".length);
      appIdSpecified = true;
    } else if (arg === "--resource") {
      licenseOptions.resource = optionValue(argv, index, arg);
      index += 1;
    } else if (arg.startsWith("--resource=")) {
      licenseOptions.resource = arg.slice("--resource=".length);
    } else {
      restArgs.push(arg);
    }
  }

  // License XML files already contain package binding information, so keep the
  // app id empty unless the caller explicitly supplied one.
  if (!appIdSpecified && isLicenseFilePath(licenseOptions.license)) {
    licenseOptions.appId = "";
  }
  licenseOptions.license = normalizeLicenseValue(licenseOptions.license);

  return { licenseOptions, restArgs };
}

function ensureInputPdf(inputPath) {
  const resolved = path.resolve(inputPath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    throw new Error(`Input PDF not found: ${resolved}`);
  }
  return resolved;
}

function ensureOutputDir(outputDir) {
  const resolved = path.resolve(outputDir);
  fs.mkdirSync(resolved, { recursive: true });
  return resolved;
}

function ensureSampleInput(fileName) {
  return ensureInputPdf(path.join(DEFAULT_INPUT_DIR, fileName));
}

function wordOutputPath(inputPdf, outputDir) {
  const basename = path.basename(inputPdf, path.extname(inputPdf));
  return path.join(outputDir, `${basename}.docx`);
}

function defaultWordOptions() {
  // Match CPDF_CONVERT_OPTION_DEFAULT from the C SDK sample. Individual calls
  // override only the fields that the C sample changes before conversion.
  return {
    enableAiLayout: true,
    enableAiTableRecognition: true,
    containImage: true,
    containPageBackgroundImage: true,
    jsonContainTable: true,
    containAnnotation: true,
    excelAllContent: false,
    excelCsvFormat: false,
    enableOcr: false,
    transparentText: true,
    txtTableFormat: true,
    imagePathEnhance: false,
    formulaToImage: true,
    autoCreateFolder: true,
    outputDocumentPerPage: false,
    imageScaling: 4.0,
    pageLayoutMode: PageLayoutMode.FLOW,
    excelWorksheetOption: ExcelWorksheetOption.FOR_TABLE,
    htmlOption: HtmlOption.SINGLE_PAGE,
    ocrOption: OCROption.ALL,
    imageColorMode: ImageColorMode.COLOR,
    imageType: ImageType.JPG,
    fontName: "",
    pageRanges: "",
    languages: [OCRLanguage.CHINESE],
  };
}

function printUsage() {
  console.error(`Usage: ${SAMPLE_COMMAND} [options] [input1.pdf] [input2.pdf ...]

Options:
  --license KEY        License string or license XML file path. Defaults to PDFSOLID_LICENSE or samples/license.xml
  --device-id ID       Device ID. Defaults to PDFSOLID_DEVICE_ID
  --app-id ID          Application ID. Defaults to PDFSOLID_APP_ID
  --resource PATH      SDK resource directory. Defaults to PDFSOLID_RESOURCE_PATH
  -o, --output DIR     Output directory. Defaults to samples/output_files
  -m, --model PATH     DocumentAI model path. Defaults to PDFSOLID_MODEL_PATH or the packaged model
  -t, --threads N      Worker process count. Default: 5
  -h, --help           Show help

Examples:
  ${SAMPLE_COMMAND}

  ${SAMPLE_COMMAND} \
    --output samples/output_files

  ${SAMPLE_COMMAND} \
    --output /tmp/pdfsolid_node_demo_out \\
    /path/to/input.pdf

  ${SAMPLE_COMMAND} \
    --output /tmp/pdfsolid_node_demo_out \
    --threads 2 \\
    samples/input_files/word.pdf \
    samples/input_files/excel.pdf`);
}

function parseArgs(argv) {
  const parsed = parseLicenseOptions(argv);
  const options = { licenseOptions: parsed.licenseOptions, model: defaultModelPath(), output: DEFAULT_OUTPUT_DIR, threads: 5, inputs: [] };
  for (let index = 0; index < parsed.restArgs.length; index += 1) {
    const arg = parsed.restArgs[index];
    if (arg === "-h" || arg === "--help") {
      options.help = true;
    } else if (arg === "-o" || arg === "--output") {
      index += 1;
      options.output = parsed.restArgs[index] || "";
    } else if (arg === "-m" || arg === "--model") {
      index += 1;
      options.model = parsed.restArgs[index] || "";
    } else if (arg === "-t" || arg === "--threads") {
      index += 1;
      options.threads = Number.parseInt(parsed.restArgs[index] || "5", 10);
    } else {
      options.inputs.push(arg);
    }
  }
  return options;
}

function createCallback(label) {
  return {
    onProgress(current, total) {
      console.log(`[${label}] progress: ${current}/${total}`);
    },
    isCancelled() {
      return false;
    },
  };
}

function runConversion(label, convert, inputPdf, outputPath, options) {
  const result = convert(inputPdf, "", outputPath, options, createCallback(label));
  console.log(`${label}: result=${result}, output=${outputPath}`);
  if (result !== SUCCESS) {
    throw new Error(`${label} failed with result=${result}`);
  }
}

function runConversionSuite(options) {
  // No input arguments means "run the full demo suite". This mirrors the C
  // release sample and covers each public conversion entry point once.
  const outputDir = ensureOutputDir(options.output);
  const wordPdf = ensureSampleInput("word.pdf");
  const excelPdf = ensureSampleInput("excel.pdf");
  const powerpointPdf = ensureSampleInput("powerpoint.pdf");

  const licenseCode = sdk.licenseVerify(
    options.licenseOptions.license,
    options.licenseOptions.deviceId,
    options.licenseOptions.appId,
  );
  console.log(`licenseVerify => ${licenseCode}`);
  if (licenseCode !== SUCCESS) {
    process.exit(1);
  }

  try {
    sdk.initialize(options.licenseOptions.resource);
    sdk.setLogger(false, true);
    console.log(`version => ${sdk.getVersion()}`);

    if (options.model) {
      const modelCode = sdk.setDocumentAIModel(options.model, -1);
      console.log(`setDocumentAIModel => ${modelCode}`);
    }

    const baseOptions = defaultWordOptions();
    const boxLayoutOptions = {
      ...baseOptions,
      pageLayoutMode: PageLayoutMode.BOX,
    };
    // Use the PDF that best matches each target format: Word-style content for
    // text-heavy exports, table content for Excel/CSV, and slides for PPT.
    runConversion("pdf to word", sdk.startPDFToWord, wordPdf, path.join(outputDir, "word.docx"), baseOptions);
    runConversion("pdf to excel", sdk.startPDFToExcel, excelPdf, path.join(outputDir, "excel.xlsx"), baseOptions);
    runConversion("pdf to ppt", sdk.startPDFToPpt, powerpointPdf, path.join(outputDir, "powerpoint.pptx"), baseOptions);

    runConversion("pdf to csv", sdk.startPDFToExcel, excelPdf, outputDir, {
      ...baseOptions,
      excelCsvFormat: true,
    });

    // The C sample switches page_layout_mode to Box before HTML and keeps that
    // value for the following conversions.
    runConversion("pdf to html", sdk.startPDFToHtml, wordPdf, path.join(outputDir, "html.html"), boxLayoutOptions);
    runConversion("pdf to rtf", sdk.startPDFToRtf, wordPdf, path.join(outputDir, "rtf.rtf"), boxLayoutOptions);
    runConversion("pdf to image", sdk.startPDFToImage, wordPdf, outputDir, boxLayoutOptions);
    runConversion("pdf to txt", sdk.startPDFToTxt, wordPdf, path.join(outputDir, "txt.txt"), boxLayoutOptions);
    runConversion("pdf to json", sdk.startPDFToJson, wordPdf, path.join(outputDir, "json.json"), boxLayoutOptions);
    runConversion("pdf to markdown", sdk.startPDFToMarkdown, wordPdf, path.join(outputDir, "markdown.md"), boxLayoutOptions);
    runConversion("pdf to searchable pdf", sdk.startPDFToSearchablePDF, wordPdf, path.join(outputDir, "pdf.pdf"), {
      ...boxLayoutOptions,
      enableOcr: true,
      transparentText: true,
      languages: [OCRLanguage.ENGLISH],
    });
    runConversion("pdf to ofd", sdk.startPDFToOfd, wordPdf, path.join(outputDir, "pdf.ofd"), {
      ...boxLayoutOptions,
      enableOcr: true,
      transparentText: true,
      languages: [OCRLanguage.ENGLISH],
    });

    console.log("all conversion tasks finished");
  } finally {
    sdk.releaseDocumentAIModel();
    sdk.release();
  }
}

function runWorker() {
  // Worker mode is used only when explicit input PDFs are provided. Each worker
  // initializes the native SDK in its own process and converts one PDF to Word.
  const workerId = process.env.PDFSOLID_NODE_DEMO_WORKER_ID || "1";
  const inputPdf = ensureInputPdf(process.argv[2]);
  const outputFile = process.argv[3];
  const modelPath = process.argv[4] || "";
  const parsedArgs = parseLicenseOptions([]);

  const licenseCode = sdk.licenseVerify(
    parsedArgs.licenseOptions.license,
    parsedArgs.licenseOptions.deviceId,
    parsedArgs.licenseOptions.appId,
  );
  console.log(`[Worker-${workerId}] licenseVerify => ${licenseCode}`);
  if (licenseCode !== SUCCESS) {
    process.exit(1);
  }

  try {
    sdk.initialize(parsedArgs.licenseOptions.resource);
    sdk.setLogger(false, true);
    console.log(`[Worker-${workerId}] version => ${sdk.getVersion()}`);

    if (modelPath) {
      const modelCode = sdk.setDocumentAIModel(modelPath, -1);
      console.log(`[Worker-${workerId}] setDocumentAIModel => ${modelCode}`);
    }

    const result = sdk.startPDFToWord(inputPdf, "", outputFile, defaultWordOptions(), {
      onProgress(current, total) {
        console.log(`[Worker-${workerId}] progress: ${current}/${total}`);
      },
      isCancelled() {
        return false;
      },
    });

    console.log(`[Worker-${workerId}] finished: result=${result}, output=${outputFile}`);
    process.exitCode = result === SUCCESS ? 0 : 1;
  } finally {
    sdk.releaseDocumentAIModel();
    sdk.release();
  }
}

function runMain() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    printUsage();
    process.exit(2);
  }
  if (options.help) {
    printUsage();
    return;
  }
  if (!options.output) {
    printUsage();
    process.exit(2);
  }

  if (options.inputs.length === 0) {
    try {
      runConversionSuite(options);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
    return;
  }

  let inputFiles;
  let outputDir;
  try {
    inputFiles = options.inputs.map(ensureInputPdf);
    outputDir = ensureOutputDir(options.output);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }

  // Explicit input files use a small worker pool so callers can verify parallel
  // conversion without sharing native SDK state between processes.
  const workerCount = Math.max(1, Math.min(options.threads || 1, inputFiles.length));
  const tasks = inputFiles.map((inputPdf, index) => ({
    id: index + 1,
    inputPdf,
    outputFile: wordOutputPath(inputPdf, outputDir),
  }));

  let active = 0;
  let failed = false;
  let nextWorkerId = 1;

  function launchNext(resolve) {
    while (active < workerCount && tasks.length > 0) {
      const task = tasks.shift();
      const workerId = nextWorkerId;
      nextWorkerId += 1;
      active += 1;
      console.log(`[Worker-${workerId}] start: ${task.inputPdf}`);

      const child = fork(__filename, [task.inputPdf, task.outputFile, options.model], {
        env: Object.assign({}, process.env, {
          PDFSOLID_NODE_DEMO_WORKER: "1",
          PDFSOLID_NODE_DEMO_WORKER_ID: String(workerId),
          PDFSOLID_LICENSE: options.licenseOptions.license,
          PDFSOLID_DEVICE_ID: options.licenseOptions.deviceId,
          PDFSOLID_APP_ID: options.licenseOptions.appId,
          PDFSOLID_RESOURCE_PATH: options.licenseOptions.resource,
        }),
        stdio: "inherit",
      });

      child.on("exit", (code) => {
        active -= 1;
        if (code !== 0) {
          failed = true;
        }
        if (tasks.length === 0 && active === 0) {
          resolve();
        } else {
          launchNext(resolve);
        }
      });
    }
  }

  new Promise((resolve) => launchNext(resolve)).then(() => {
    console.log("all conversion tasks finished");
    process.exitCode = failed ? 1 : 0;
  });
}

if (process.env.PDFSOLID_NODE_DEMO_WORKER === "1") {
  runWorker();
} else {
  if (process.platform !== EXPECTED_PLATFORM) {
    console.error(`This sample is for ${PLATFORM_NAME}. Current Node.js platform is ${process.platform}.`);
    process.exit(2);
  }
  runMain();
}
