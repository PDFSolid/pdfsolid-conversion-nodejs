# PDFSolid Conversion SDK for Node.js

A high-performance Node.js SDK for extracting and transforming PDF content — text, images, tables, links, and annotations — into various file formats while preserving the original document layout.

## Features

### Format Conversion

- **PDF to Word** (.docx)
- **PDF to Excel** (.xlsx)
- **PDF to PowerPoint** (.pptx)
- **PDF to HTML** (.html)
- **PDF to CSV** (.csv)
- **PDF to Image** (.png, .jpg, .jpeg, .jpeg2000, .bmp, .tiff, .tga, .gif, .webp)
- **PDF to Plain Text** (.txt)
- **PDF to Rich Text Format** (.rtf)
- **PDF to Searchable PDF** (.pdf)
- **PDF to OFD** (.ofd)
- **PDF to Structured Data** (.json)
- **PDF to Markdown** (.md)

### AI-Powered Document Tools

- **Optical Character Recognition (OCR)** — supports 16+ languages including Chinese, English, Japanese, Korean, Arabic, and more.
- **Layout Analysis** — AI-based document structure detection for improved conversion quality.
- **Table Recognition** — reconstructs table structure including merged cells and borderless tables.

## System Requirements

| Platform | Requirements | Runtime |
| -------- | ------------ | ------- |
| Linux | Linux x64 | Node.js 16 or later |

The Node.js SDK uses a Node-API native addon — no `ffi-napi` or other runtime FFI packages required.

## Quick Start

### 1. Install

```shell
npm install pdfsolid-conversion-nodejs
```

### 2. Obtain a License

Contact our sales team at [sales@pdfsolid.com](mailto:sales@pdfsolid.com) to get a free 30-day trial license or a commercial license.

### 3. Basic Usage

```js
const sdk = require("pdfsolid-conversion-nodejs");

// Verify license
const code = sdk.licenseVerify("YOUR_LICENSE_KEY", "DEVICE_ID", "com.example.app");
if (code !== 0) {
  throw new Error(`license verification failed: ${code}`);
}

// Initialize SDK
sdk.initialize();

// Load AI model (required for OCR, Layout Analysis, Table Recognition)
sdk.setDocumentAIModel("path/to/documentai.model", -1);

// Convert PDF to Word
const result = sdk.startPDFToWord("input.pdf", "", "output.docx", {});
console.log(`conversion result: ${result}`);

// Release resources
sdk.releaseDocumentAIModel();
sdk.release();
```

## Conversion Examples

### PDF to Word

```js
const options = {
  pageLayoutMode: 1,  // 0 = Box, 1 = Flow
  containImage: true,
  containAnnotation: true
};

sdk.startPDFToWord("input.pdf", "", "output.docx", options);
```

### PDF to Excel

```js
const options = {
  excelWorksheetOption: 0  // 0 = per table, 1 = per page, 2 = per document
};

sdk.startPDFToExcel("input.pdf", "", "output.xlsx", options);
```

### PDF to PowerPoint

```js
sdk.startPDFToPpt("input.pdf", "", "output.pptx", {});
```

### PDF to HTML

```js
const options = {
  htmlOption: 0  // 0 = single page, 1 = single with bookmark, 2 = multi page, 3 = multi with bookmark
};

sdk.startPDFToHtml("input.pdf", "", "output.html", options);
```

### PDF to CSV

```js
const options = {
  excelCsvFormat: true,
  autoCreateFolder: true
};

sdk.startPDFToExcel("input.pdf", "", "output.csv", options);
```

### PDF to Image

```js
const options = {
  imageType: 3,       // 0=JPG, 1=JPEG, 2=JPEG2000, 3=PNG, 4=BMP, 5=TIFF, 6=TGA, 7=GIF, 8=WEBP
  imageColorMode: 0,  // 0=Color, 1=Gray, 2=Binary
  imageScaling: 1.0
};

sdk.startPDFToImage("input.pdf", "", "output/", options);
```

### PDF to Searchable PDF (OCR)

```js
sdk.setDocumentAIModel("path/to/documentai.model", -1);

const options = {
  enableOcr: true,
  languages: [3],       // 3 = English
  transparentText: true
};

sdk.startPDFToSearchablePDF("scan.pdf", "", "output.pdf", options);
```

### PDF to OFD

```js
sdk.setDocumentAIModel("path/to/documentai.model", -1);

const options = {
  enableOcr: true,
  languages: [3],
  containPageBackgroundImage: true,
  transparentText: true
};

sdk.startPDFToOfd("input.pdf", "", "output.ofd", options);
```

### Extract PDF to JSON

```js
const options = {
  jsonContainTable: true,
  enableAiLayout: true,
  enableAiTableRecognition: true
};

sdk.startPDFToJson("input.pdf", "", "output.json", options);
```

### Extract PDF to Markdown

```js
const options = {
  containImage: true,
  containAnnotation: true
};

sdk.startPDFToMarkdown("input.pdf", "", "output.md", options);
```

## Progress and Cancellation

```js
let cancelRequested = false;

const callback = {
  onProgress(currentPage, totalPage) {
    console.log(`progress: ${currentPage}/${totalPage}`);
  },
  isCancelled() {
    return cancelRequested;
  }
};

sdk.startPDFToWord("input.pdf", "", "output.docx", {}, callback);
```

## Page Range Selection

```js
const options = {
  pageRanges: "1-3,5,7-9",
  outputDocumentPerPage: true
};
```

## OCR Configuration

```js
const OCRLanguage = {
  CHINESE: 1, CHINESE_TRA: 2, ENGLISH: 3, KOREAN: 4,
  JAPANESE: 5, LATIN: 6, DEVANAGARI: 7, CYRILLIC: 8,
  ARABIC: 9, TAMIL: 10, TELUGU: 11, KANNADA: 12,
  THAI: 13, GREEK: 14, ESLAV: 15, AUTO: 16
};

const OCROption = {
  INVALID_CHARACTER: 0,
  SCAN_PAGE: 1,
  INVALID_CHARACTER_AND_SCAN_PAGE: 2,
  ALL: 3
};

const options = {
  enableOcr: true,
  languages: [OCRLanguage.ENGLISH, OCRLanguage.CHINESE],
  ocrOption: OCROption.ALL,
  containPageBackgroundImage: true
};
```

## Page Layout Modes

| Mode | Value | Description |
| ---- | ----- | ----------- |
| Box Layout | `0` | Fixed positioning based on PDF coordinates. Best for contracts, design drafts, and academic papers. |
| Flow Layout | `1` | Flexible layout using paragraphs, columns, and tabs. Best for editable documents. |

## Handling Concurrent Conversions

The Node.js SDK uses synchronous conversion APIs. For server workloads, run conversions in worker threads or child processes to avoid blocking the main event loop:

```js
const { Worker } = require("worker_threads");

const worker = new Worker("./convert-worker.js", {
  workerData: { input: "input.pdf", output: "output.docx" }
});
```

## Documentation

- [Developer Guide](doc/developer_guide_node.md) — detailed integration guide with all conversion options.
- [API Reference](doc/api_reference_node.html) — complete API reference.

## License

PDFSolid Conversion SDK is a commercial SDK. A license is required for development and distribution.

- **Trial License**: Contact [sales@pdfsolid.com](mailto:sales@pdfsolid.com) for a free 30-day trial.
- **Commercial License**: Contact [sales@pdfsolid.com](mailto:sales@pdfsolid.com) for pricing and licensing options.

## Support

If you encounter any issues, please contact us with the following information:

- PDFSolid Conversion SDK product and version.
- Your operating system and Node.js version.
- Detailed descriptions of the problem.
- Any error screenshots or logs.

### Contact

- Website: [https://www.pdfsolid.com](https://www.pdfsolid.com/)
- Email: [support@pdfsolid.com](mailto:support@pdfsolid.com)
