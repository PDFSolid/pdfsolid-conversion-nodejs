# PDFSolid Conversion SDK for Node.js

High-performance Node.js SDK for converting PDF to Word, Excel, PowerPoint, HTML, Image, TXT, RTF, CSV, JSON, Markdown, Searchable PDF, and OFD with AI-powered OCR, layout analysis, and table recognition.

## Features

- **PDF to Word** (.docx) — Flow and Box layout modes
- **PDF to Excel** (.xlsx) — per-table, per-page, or per-document worksheet options
- **PDF to PowerPoint** (.pptx)
- **PDF to HTML** (.html) — single/multi-page with optional bookmark navigation
- **PDF to CSV** (.csv)
- **PDF to Image** (.png, .jpg, .jpeg, .jpeg2000, .bmp, .tiff, .tga, .gif, .webp) — color/grayscale/binary, configurable scaling
- **PDF to Plain Text** (.txt) — optional table format preservation
- **PDF to RTF** (.rtf)
- **PDF to Searchable PDF** (.pdf) — OCR with transparent text layer
- **PDF to OFD** (.ofd) — OCR, page background preservation, transparent text layer
- **PDF to JSON** (.json) — structured data with table extraction
- **PDF to Markdown** (.md)

### AI-Powered Document Tools

- **OCR** — Optical Character Recognition for scanned documents and images
- **Layout Analysis** — AI-based document structure parsing
- **Table Recognition** — AI-based table structure reconstruction
- **Custom AI Models** — plug in your own OCR, layout, or table engine via callbacks (SDK v1.1.0+)

## Requirements

| Platform | System Requirements | Development Environment |
| -------- | ------------------- | ----------------------- |
| Linux | Linux x64 | Node.js 16+ |

## Quick Start

### 1. Get a License

Contact [sales@pdfsolid.com](mailto:sales@pdfsolid.com) for a 30-day free trial or commercial license.

### 2. Apply License and Initialize

```js
const sdk = require("pdfsolid-conversion-nodejs");

const code = sdk.licenseVerify("YOUR_LICENSE_KEY", "DEVICE_ID", "com.example.app");
if (code !== 0) {
  throw new Error(`license verification failed: ${code}`);
}

sdk.initialize();
```

### 3. Convert

```js
const result = sdk.startPDFToWord("input.pdf", "", "output.docx", {});
console.log(`conversion result: ${result}`);
```

### Release Resources

```js
sdk.releaseDocumentAIModel();
sdk.release();
```

## Conversion Examples

### PDF to Excel

```js
const options = {
  excelWorksheetOption: 0  // 0 = per table, 1 = per page, 2 = per document
};

sdk.startPDFToExcel("input.pdf", "", "output.xlsx", options);
```

### PDF to Image

```js
const options = {
  imageType: 3,       // 0=JPG, 1=JPEG, 2=JPEG2000, 3=PNG, 4=BMP, 5=TIFF, 6=TGA, 7=GIF, 8=WEBP
  imageScaling: 2.0
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

### PDF to JSON with Table Extraction

```js
const options = {
  jsonContainTable: true,
  enableAiLayout: true
};

sdk.startPDFToJson("input.pdf", "", "output.json", options);
```

### Custom AI Engine (SDK v1.1.0+)

```js
const callback = {
  onProgress(currentPage, totalPage) {},
  isCancelled() { return false; },
  onOcr(imagePath) { /* your OCR */ return true; },
  getOcrResult() { return ocrJson; },
  onLayout(imagePath) { /* your layout */ return true; },
  getLayoutResult() { return layoutJson; },
  onTable(imagePath) { /* your table */ return true; },
  getTableResult() { return tableJson; }
};

const options = {
  enableOcr: true,
  enableAiLayout: true
};

sdk.startPDFToWord("input.pdf", "", "output.docx", options, callback);
```

## Documentation

- [Developer Guide](doc/developer_guide_node.md)
- [API Reference](doc/api_reference_node.html)

## Contact

- Website: [https://www.pdfsolid.com](https://www.pdfsolid.com/)
- Sales: [sales@pdfsolid.com](mailto:sales@pdfsolid.com)
- Support: [support@pdfsolid.com](mailto:support@pdfsolid.com)
