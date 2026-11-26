# 1. Overview

PDFSolid Conversion SDK is a high-performance library designed for extracting and transforming the data within your PDF files, such as text, images, tables, links, and annotations, into various file formats. Our Conversion SDK retains the original document layout and the properties of the file data, ensuring a seamless document conversion experience.

Effortlessly integrate the PDFSolid Conversion SDK into your projects in just a few steps, and enable the following file format conversions:

- Convert PDF to Word (.docx)
- Convert PDF to Excel (.xlsx)
- Convert PDF to PowerPoint (.pptx)
- Convert PDF to HTML (.html)
- Convert PDF to CSV (.csv)
- Convert PDF to Image (.png, .jpg, .jpeg,.jpeg2000, .bmp, .tiff, .tga, .gif, .webp)
- Convert PDF to Plain Text (.txt)
- Convert PDF to Rich Text Format (.rtf)
- Convert PDF to Searchable PDF (.pdf)
- Convert PDF to OFD (.ofd)
- Convert PDF to Structured Data (.json)
- Convert PDF to Markdown (.md)
- Convert Word to PDF (.pdf)

Harness the power of PDFSolid Conversion SDK and take your document processing to the next level with intelligent tools designed for accuracy and efficiency. To enhance your format conversion results, PDFSolid Conversion SDK offers AI-powered document tools with the following capabilities:

- Optical Character Recognition (OCR)
- Layout Analysis
- Table Recognition


## 1.1 Why PDFSolid Conversion SDK

- Mature Technology

  With years of technology accumulation, we have established a complete mechanism of product iteration to offer a continuous guarantee for product competitiveness.

- Complete PDF and Format Conversion Functionalities

  Our comprehensive features can meet diverse needs and are easy for our customers to use without training costs.

- High-quality Service

  professional service and technical support to quickly respond to users' feedback through onsite service or remote support like telephone, email, etc.

- Independent Intellectual

  Property Rights
  Our technology is independent and compliant with ISO, helping enterprises conduct international business without considering copyright risks.


## 1.2 PDFSolid Conversion SDK

The PDFSolid Conversion SDK is designed to facilitate the effortless conversion of PDF files into various other formats, all while preserving the original layout and formatting of the documents. In this guide, we will explore the PDFSolid Conversion SDK and demonstrate how to utilize it within your Node.js projects.

## 1.3 License & Trial

The PDFSolid Conversion SDK is a commercial SDK that requires a license to grant developers the right to develop and distribute their applications. In development mode, each license is only valid for one device ID. PDFSolid Conversion SDK provides flexible licensing models, please contact [our marketing team](mailto:support@pdfsolid.com) for more information. However, even if you have a license, it is prohibited to distribute any documents, sample code, or source code of the PDFSolid Conversion SDK to any third parties.

If you do not have a License, please feel free to contact the [PDFSolid Conversion SDK Team](https://www.pdfsolid.com/) to obtain a License to try the PDFSolid Conversion SDK.

# 2. Get Started

## 2.1 Requirements

Before starting, make sure that you have already met the following prerequisites.

### 2.1.1 Get PDFSolid Conversion SDK License Key

PDFSolid Conversion SDK provides two types of license key: 30-day free trial license and commercial license.

#### How to Get Free Trial License

[Contact our sales team](https://www.pdfsolid.com/) and we will send you a 30-day free trial license for PDFSolid Conversion SDK.

#### How to Get Commercial License

PDFSolid Conversion SDK is a commercial SDK that requires a license for application release. Any documents, sample code, or source code distribution from the released package of PDFSolid Conversion SDK to any third party is prohibited.

To get a commercial license for PDFSolid Conversion SDK, feel free to [contact our sales team](https://www.pdfsolid.com/).

For Node.js Conversion SDK, commercial licenses are verified through the SDK license verification API. In development mode, a license is bound to the developer device ID.

### 2.1.2 Download Conversion SDK

[Contact us](https://www.pdfsolid.com/) to obtain the PDFSolid Conversion SDK for Node.js.

### 2.1.3 System Requirements

| Development Platform | System Requirements | Development Environment | Notice |
| --- | --- | --- | --- |
| Linux | Linux x64 | Node.js 16 or later | Samples have been tested on Ubuntu 20.04. |

The Node.js SDK does not require `ffi-napi` or other runtime FFI packages. It uses a Node-API addon packaged with the release bundle.

The release package already contains `lib/`, `resource/models/`, sample files, API reference, developer guide, legal information, and release notes. No `npm install` step is required when running the bundled demo from the release package.

## 2.2 SDK Package Structure

- `doc/`: developer guide, upgrade notes and HTML API reference.
- `include/`: native SDK headers.
- `lib/`: Linux x86_64 native libraries and the node binding runtime.
- `resource/models/documentai.model` and `resource/license/license.xml`: bundled model and sample license.
- `samples/demo/RunDemo.sh`, `samples/input_files/`, `samples/output_files/`: runnable example, inputs and results.

## 2.3 Apply the License Key

The SDK supports online and offline licenses. The bundled samples pass the path to `resource/license/license.xml` directly; there is no need to extract its `<key>` value. Online verification requires access to the license service. Offline verification uses the device/application binding in the license. Trial licenses expire; contact sales for a replacement when needed.

Place this code in an application script at the SDK package root. Supply device/application IDs as required by your license; the bundled XML can use the empty values shown here.

```js
const path = require('path');
const sdk = require('./lib/index.js');
const code = sdk.licenseVerify(path.join(__dirname, 'resource/license/license.xml'), '', '');
if (code !== 0) throw new Error(`License verification failed: ${code}`);
sdk.initialize();
```

## 2.4 How to Run a Demo

From the Linux package root, run:

```sh
bash samples/demo/RunDemo.sh
```

The demo reads `resource/license/license.xml` and `samples/input_files/word.docx`. In `samples/output_files/`, `word_to_pdf.pdf` uses the defaults (all pages, no bookmarks); `word_to_pdf_bookmarks.pdf` selects pages `1-2` and creates bookmarks from headings.

# 3. Conversion Guides

PDFSolid Conversion SDK allows developers to use a simple API to convert PDF to common file formats like Word, Excel, PPT, HTML, CSV, PNG, JPEG, RTF, TXT, Searchable PDF, OFD, JSON, and Markdown. It provides a wide range of customized conversion options, such as whether to include images or annotations in PDF documents, whether to enable OCR, whether to enable layout analysis, and more.

All Node.js conversion APIs follow the same basic signature:

```js
const result = sdk.startPDFToWord(
  inputFilePath,
  password,
  outputFilePath,
  options,
  callback
);
```

`password` can be an empty string when the input PDF is not encrypted. Each conversion method returns an SDK error code. `0` means the conversion succeeded.

## 3.1 Initialize Library Resources

Initialize the file and memory resources needed by the SDK after successful license verification. Load the required models before conversion using section 3.2; passing a resource path does not load a model. The current Linux core uses system fonts, and the delivery contains no `resource/fonts/` directory.

Leave the resource path unset when using the current delivery, as shown below.

```js
sdk.initialize();
```

Conversion calls are synchronous. Wait for all calls to return before releasing the SDK, unloading its libraries or reconfiguring models.

## 3.2 Set DocumentAI Model

The delivery includes `resource/models/documentai.model` for layout analysis, balanced table recognition and base OCR. No additional download is needed for the default AI configuration. After initialization, load this file and check the return code. A GPU argument of `-1` selects CPU execution.

```js
sdk.setDocumentAIModelCount(1, 1);
const code = sdk.setDocumentAIModel(require('path').join(__dirname, 'resource/models/documentai.model'), -1);
if (code !== 0) throw new Error(`Model load failed: ${code}`);
```

The two instance-count arguments configure the layout and table model counts, respectively.

### **Model Package Reference**

Download optional model packages from https://www.pdfsolid.com/

| File | Size | Capability and use |
| --- | --- | --- |
| `documentai.model` | About 230 MB | Bundled base package: layout analysis, balanced tables and base OCR. |
| `table_legacy.model` | About 270 MB | Table extension required for the high-accuracy `tableRecognitionAccuracy` setting. |
| `ocr_server.model` | About 139 MB | Enhanced OCR for Chinese, English, Japanese and other languages. |
| `document_process.model` | About 37 MB | Orientation classification and dewarping for `enableDocumentOrientationClassification` or `enableDocumentDewarp`. |

**Incremental Loading and Version Compatibility:**

Each `sdk.setDocumentAIModel` call adds the capabilities in one package to the capabilities already loaded; it does not replace them. Package order is unrestricted. A failed load preserves previously loaded capabilities; handle the returned error code. Base and extension packages must match the SDK version.

The 1.3.0 base package retains the filename `documentai.model` but adds balanced-profile resources. Upgrade the binding, native libraries and model together; do not reuse the 1.2.0 file. Selecting high-accuracy tables without loading its extension can still complete conversion, but uses rule-based table recognition. See [3.10 Table Recognition](#310-table-recognition).

`sdk.releaseDocumentAIModel()` releases all loaded packages; reload them before using AI features again. Reconfigure only after all synchronous conversions have returned. Reconfiguration during conversion or pending release returns code `60`.

**Troubleshooting:**

| Symptom | Check |
| --- | --- |
| Model loading returns a nonzero code | Path, file completeness and SDK/model version compatibility. |
| High-accuracy tables differ from expectations | Load `table_legacy.model` and set the high-accuracy option for the task. |
| OCR returns code `29` | The license must include OCR permission; a model does not grant permission. |

The optional OpenVINO acceleration package in the Windows C/C++ guide applies only to Intel CPUs on Windows x64. Use the supplied runtime for this Linux delivery; do not deploy that Windows package.

## 3.3 Get Conversion Progress

PDFSolid Conversion SDK obtains conversion progress through callback functions. The following example demonstrates how to get conversion progress while performing a PDF to Word task.

```js
const callback = {
  onProgress(currentPage, totalPage) {
    console.log(`progress: ${currentPage}/${totalPage}`);
  }
};
```

Pass the callback as the fifth conversion argument:

```js
const result = sdk.startPDFToWord(
  inputFilePath,
  "",
  outputFilePath,
  {},
  callback
);
```

## 3.4 Cancel Conversion Task

PDFSolid Conversion SDK supports interrupting an ongoing conversion task. Return `true` from `isCancelled()` to cancel the current task, or `false` to continue.

```js
let cancelRequested = false;

const callback = {
  isCancelled() {
    return cancelRequested;
  }
};
```

The current addon calls JavaScript callbacks synchronously from the conversion call thread. If the native SDK triggers callbacks from internal worker threads in the future, the addon must use `napi_threadsafe_function` instead of direct `napi_call_function()`.

## 3.5 Select Page Range for Conversion

PDFSolid Conversion SDK supports converting a specified page range. When an empty string is passed, all pages will be converted. If the page range exceeds one page, you can also choose to enable the `outputDocumentPerPage` option to output each PDF page as a separate file.

```js
const options = {
  pageRanges: "1-3,5,7-9",
  outputDocumentPerPage: false
};
```

## 3.6 Contain Image and Annotation Options

### **Overview**

In the process of converting PDF documents into various formats, PDFSolid Conversion SDK offers options to determine whether images are included in the generated document and whether annotations from the PDF file are retained.

In the Node.js SDK, use `containImage` and `containAnnotation` on the conversion options object.

### **Sample**

```js
const options = {
  containImage: true,
  containAnnotation: true,
  enableAiLayout: true,
  enableOcr: false
};

const result = sdk.startPDFToWord(inputFilePath, "", outputFilePath, options);
```

## 3.7 Page Layout Mode

In certain formats, the page layout mode plays a key role in the quality of the converted document. PDFSolid Conversion SDK supports two layout modes: Flow Layout and Box Layout.

- **Flow Layout:** Uses paragraph indentations, columns, and tab positions to adjust the content. This layout is suitable for editable documents.
- **Box Layout:** Places each element based on the original PDF coordinate system. This layout is suitable for documents requiring precise reproduction.

Page layout modes are commonly used for PDF to Word and PDF to HTML.

```js
const PageLayoutMode = {
  BOX: 0,
  FLOW: 1
};

const options = {
  pageLayoutMode: PageLayoutMode.FLOW
};

const result = sdk.startPDFToWord(inputFilePath, "", outputFilePath, options);
```

## 3.8 OCR

### **Overview**

OCR (Optical Character Recognition) is the process of converting images of typed, handwritten, or printed text into machine-encoded text.

OCR is commonly used for text recognition and extraction from scanned PDF files, photographs of documents, scene photos, invoices, receipts, and other image-based documents.

The following features support OCR:

- PDF to Word
- PDF to Excel
- PDF to PowerPoint
- PDF to HTML
- PDF to RTF
- PDF to TXT
- PDF to Searchable PDF
- PDF to OFD
- Extract PDF to JSON
- Extract PDF to Markdown

### **Set OCR Language**

Use `languages` to specify OCR languages. The value is an array of numeric OCR language constants.

```js
const OCRLanguage = {
  CHINESE: 1,
  ENGLISH: 3,
  AUTO: 16
};

const options = {
  enableOcr: true,
  languages: [OCRLanguage.ENGLISH, OCRLanguage.CHINESE]
};
```

### **OCR Options**

Use `ocrOption` to control OCR processing scope.

```js
const OCROption = {
  INVALID_CHARACTER: 0,
  SCAN_PAGE: 1,
  INVALID_CHARACTER_AND_SCAN_PAGE: 2,
  ALL: 3
};

options.ocrOption = OCROption.ALL;
```

### **Preserve Page Background**

When OCR is enabled, use `containPageBackgroundImage` to control whether page background images are preserved.

```js
options.containPageBackgroundImage = true;
```

### **Converting Images to Other Document Formats**

Image-to-image conversion accepts supported images and multi-page TIFF, performs no OCR/layout analysis, and uses page ranges to select frames. With OCR disabled, image-to-TXT or image-to-CSV returns `95` (`UNSUPPORTED_FEATURE`); enable `enableOcr` for those outputs.

`enableAutoPageSize` defaults to `false`; setting it to `true` matches the nearest standard page size from image resolution. `customPageWidth` and `customPageHeight` default to `0`. Set both in points (1/72 inch) to override automatic sizing; the image is scaled proportionally without cropping. These options affect image input only.

### **Sample**

```js
sdk.setDocumentAIModel("/path/to/documentai.model", -1);

const options = {
  enableOcr: true,
  languages: [3],
  ocrOption: 3
};

const result = sdk.startPDFToWord(inputFilePath, "", outputFilePath, options);
```

## 3.9 Layout Analysis

### **Overview**

Layout Analysis detects the layout structure of a PDF page and helps improve output quality for complex pages.

Use `enableAiLayout` to enable or disable AI layout analysis.

### **Sample**

```js
sdk.setDocumentAIModel("/path/to/documentai.model", -1);

const options = {
  enableAiLayout: true
};

const result = sdk.startPDFToWord(inputFilePath, "", outputFilePath, options);
```

## 3.10 Table Recognition

### **Overview**

Table Recognition detects table structures and helps preserve table layout in output documents and extracted data.

Use `enableAiTableRecognition` to enable table recognition.

`tableRecognitionAccuracy` selects the DocumentAI table model profile. The default is
`sdk.TableRecognitionAccuracy.BALANCED` (`1`). `HIGH_ACCURACY` (`0`) requires
the `table_legacy.model` extension package to be loaded with
`setDocumentAIModel()`. If it is not loaded, the conversion still succeeds, but
tables are recognized with the rule-based method instead, so the result differs
from the high-accuracy result.

### **Sample**

```js
sdk.setDocumentAIModel("/path/to/documentai.model", -1);

const options = {
  enableAiLayout: true,
  enableAiTableRecognition: true,
  tableRecognitionAccuracy: sdk.TableRecognitionAccuracy.BALANCED
};

const result = sdk.startPDFToExcel(inputFilePath, "", outputFilePath, options);
```

### **Table Model Profile**

Since 1.3.0, `setDocumentAIModel()` loads model packages incrementally. The base `documentai.model` supplies layout analysis, balanced table recognition, and basic OCR. Additional calls merge the capabilities in extension packages; a failed load preserves already loaded capabilities. Replace any 1.2.0 model with the 1.3.0 file even though the filename is unchanged. Extension packages are available from https://www.pdfsolid.com/

To keep the 1.2.0 high-accuracy table behavior, load the extension and select the profile for each task. This example assumes that license verification and SDK initialization have succeeded:

```js
for (const path of ["/path/documentai.model", "/path/table_legacy.model"]) {
  const code = sdk.setDocumentAIModel(path, -1);
  if (code !== 0) throw new Error(`model load failed: ${code}`);
}
const options = {
  enableAiLayout: true,
  enableAiTableRecognition: true,
  tableRecognitionAccuracy: sdk.TableRecognitionAccuracy.HIGH_ACCURACY
};
const result = sdk.startPDFToWord("input.pdf", "", "output.docx", options);
```

The profile affects Word, Excel/CSV, PowerPoint, HTML, RTF, TXT, JSON, and Markdown table recognition. Image, searchable PDF, OFD, and Word to PDF conversions do not use it. Configure models only after all synchronous conversion calls finish. Model changes while converting or releasing return code `60`; call release after the conversion calls return.

## 3.11 Use Custom AI Models via Callbacks

### **Overview**

Starting with **SDK v1.1.0**, PDFSolid Conversion SDK exposes a callback-based extension point that lets you plug in your own AI inference engine for OCR, Layout Analysis, and Table Recognition. Instead of relying on the built-in DocumentAI model loaded by `sdk.setDocumentAIModel`, you can:

- Run inference with any model or runtime you choose (e.g. your in-house engine, PaddleOCR, a cloud OCR API).
- Return the result to the SDK as a JSON string with a well-defined schema.

When the relevant callback pair is registered on `ConvertCallback`, the SDK skips its built-in model invocation for that capability and consumes your JSON output instead. If a pair is left as `null`, the SDK falls back to the built-in DocumentAI model (when available).

### **Callback Pairs**

Each AI capability uses **two callbacks**: a *trigger* (invoked by the SDK with the path to a page image saved as PNG in a temp directory) and a *result getter* (invoked by the SDK immediately afterwards to retrieve the JSON string).

| Capability         | Trigger callback | Result getter callback | Triggered when                                                                                  |
| ------------------ | ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| OCR                | `onOcr`            | `onOcrResult`       | `enableOcr = true`                                                                             |
| Layout Analysis    | `onLayout`         | `onLayoutResult`    | `enableAiLayout = true`                                                |
| Table Recognition  | `onTable`          | `onTableResult`     | `enableAiTableRecognition = true` **and** a table region is detected by layout analysis      |

Rules:

- The trigger receives a UTF-8 path to a PNG file. Return `true` if your inference succeeded, `false` to make the SDK ignore the result for that page.
- The getter returns a UTF-8 JSON string, or `null` on failure. The binding retains its native buffer until the next call to the same getter or the end of conversion.
- Both callbacks for a capability must be set together. Supplying only one callback raises an argument error.
- Coordinates in your JSON must be in the **pixel space of the image the trigger received** (top-left origin, X right, Y down).
- Confidence filtering: OCR spans with `confidence < 0.1` and layout objects with `confidence < 0.45` are discarded by the SDK.

### **Sample**

```js
let ocrJson = '', layoutJson = '', tableJson = '';
const callback = {
  onOcr: imagePath => { ocrJson = runMyOcrModel(imagePath); return ocrJson !== ''; },
  onOcrResult: () => ocrJson,
  onLayout: imagePath => { layoutJson = runMyLayoutModel(imagePath); return layoutJson !== ''; },
  onLayoutResult: () => layoutJson,
  onTable: imagePath => { tableJson = runMyTableModel(imagePath); return tableJson !== ''; },
  onTableResult: () => tableJson
};
const options = { enableOcr: true, enableAiLayout: true, enableAiTableRecognition: true };
const result = sdk.startPDFToWord('input.pdf', '', 'output.docx', options, callback);
```

You can register only the capabilities you want to override and leave the others as `null` to keep the built-in behaviour.

### **Thread Safety and Lifetime**

- Callbacks are invoked from the SDK conversion thread. Implement them in a thread-safe manner if your model engine is shared across calls.
- The PNG image at `image_path` lives in the SDK temp directory and may be deleted shortly after the trigger returns; copy or process it before returning.
- The binding owns the result buffers for the duration of the synchronous call. Callback exceptions request cancellation and are rethrown after the native conversion returns.

### **OCR Result JSON Schema**

Returned by `onOcrResult`. The SDK populates each `text_spans[].chars[]` either from `words[]` if provided, or by uniformly splitting the span rect.

```json
{
  "text_spans": [
    {
      "text": "Hello World",
      "confidence": 0.98,
      "rotation": 0.0,
      "rect":  { "left": 120, "top": 80, "right": 320, "bottom": 110 },
      "style": {
        "font_size":  18.0,
        "font_color": { "r": 0, "g": 0, "b": 0 }
      },
      "words": [
        { "text": "Hello", "rect": { "left": 120, "top": 80, "right": 200, "bottom": 110 } },
        { "text": "World", "rect": { "left": 210, "top": 80, "right": 320, "bottom": 110 } }
      ]
    }
  ]
}
```

| Field                | Type    | Required | Description                                                                 |
| -------------------- | ------- | -------- | --------------------------------------------------------------------------- |
| `text_spans`         | array   | Yes      | Recognized text spans on the page.                                          |
| `text`               | string  | Yes      | UTF-8 text content of the span.                                             |
| `confidence`         | number  | No       | 0.0 – 1.0. Spans below 0.1 are discarded.                                   |
| `rotation`           | number  | No       | Text rotation in degrees. Default 0.                                        |
| `rect`               | object  | Yes      | Bounding box in image pixels (`left`/`top`/`right`/`bottom`).               |
| `style.font_size`    | number  | No       | Estimated font size in pixels.                                              |
| `style.font_color`   | object  | No       | `{ r, g, b }` 0 – 255.                                                      |
| `words`              | array   | No       | Per-word boxes. If omitted, the SDK splits the span rect evenly. Strongly recommended for CJK + Latin mixed lines for correct glyph spacing. |

### **Layout Analysis Result JSON Schema**

Returned by `onLayoutResult`. Objects with `confidence < 0.45` are discarded.

```json
{
  "objects": [
    { "type": "title",     "confidence": 0.95, "rect": { "left": 60, "top": 50,  "right": 540, "bottom": 90  } },
    { "type": "paragraph", "confidence": 0.97, "rect": { "left": 60, "top": 100, "right": 540, "bottom": 220 } },
    { "type": "figure",    "confidence": 0.92, "rect": { "left": 80, "top": 240, "right": 520, "bottom": 460 } },
    { "type": "table",     "confidence": 0.93, "rect": { "left": 60, "top": 480, "right": 540, "bottom": 700 } }
  ]
}
```

Supported `type` values:

| Value            | Meaning                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| `paragraph`      | Body text paragraph                                                                  |
| `title`          | Heading                                                                              |
| `figure`         | Image or figure                                                                      |
| `figure_title`   | Figure caption header                                                                |
| `figure_caption` | Figure caption text                                                                  |
| `onTable`          | Table region. Whether the table is bordered or borderless is determined by the table recognition stage, not by the layout label. |
| `table_title`    | Table caption header                                                                 |
| `table_caption`  | Table caption text                                                                   |
| `ordered_list`   | Ordered list                                                                         |
| `unordered_list` | Unordered list                                                                       |
| `catalogue`      | Table of contents                                                                    |
| `formula`        | Math formula                                                                         |
| `code`           | Code block                                                                           |
| `algorithm`      | Algorithm block                                                                      |
| `header`         | Page header                                                                          |
| `footer`         | Page footer                                                                          |
| `page_number`    | Page number                                                                          |
| `reference`      | Reference or citation                                                                |

Objects with a `type` value that is not listed above are ignored. Use the values in this table as the canonical layout labels in your custom output.

### **Table Recognition Result JSON Schema**

Returned by `onTableResult` once per detected table region. Polygons use 8 integers `[x0, y0, x1, y1, x2, y2, x3, y3]` in the order top-left, top-right, bottom-right, bottom-left.

```json
{
  "type": "table_with_line",
  "position": [60, 480, 540, 480, 540, 700, 60, 700],
  "rows": 3,
  "cols": 2,
  "angle": 0.0,
  "height_of_rows": [40, 60, 60],
  "width_of_cols":  [200, 280],
  "table_cells": [
    {
      "start_row": 0, "end_row": 0,
      "start_col": 0, "end_col": 0,
      "cell_background_color_r": 240,
      "cell_background_color_g": 240,
      "cell_background_color_b": 240,
      "position": [60, 480, 260, 480, 260, 520, 60, 520]
    }
  ]
}
```

| Field                       | Type    | Description                                                                               |
| --------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `type`                      | string  | `table_with_line` for bordered tables; any other value is treated as a non-standard (borderless) table. |
| `position`                  | int[8]  | Table polygon in image pixels.                                                            |
| `rows` / `cols`             | int     | Row / column counts.                                                                      |
| `angle`                     | number  | Skew angle in degrees.                                                                    |
| `height_of_rows`            | int[]   | Per-row pixel heights (length = `rows`).                                                  |
| `width_of_cols`             | int[]   | Per-column pixel widths (length = `cols`).                                                |
| `table_cells[]`             | array   | One entry per merged cell.                                                                |
| `start_row` / `end_row`     | int     | Inclusive row span of the cell.                                                           |
| `start_col` / `end_col`     | int     | Inclusive column span of the cell.                                                        |
| `cell_background_color_*`   | int     | Cell background color components (0 – 255).                                               |
| `position`                  | int[8]  | Cell polygon in image pixels.                                                             |

### **Tip: Validate Your JSON**

If you need a reference output to compare against, run a conversion once with the built-in DocumentAI model — the SDK uses the same JSON shape internally, so your custom output should follow the same structure.

## 3.12 Output Font Option

### **Overview**

Some output formats support specifying a preferred output font. Use `fontName` in the conversion options object.

### **Supported Formats**

- PDF to Word
- PDF to Excel
- PDF to PowerPoint
- PDF to HTML
- PDF to RTF

### **Example**

```js
const options = {
  fontName: "Arial"
};
```

## 3.13 Convert PDF to Word

### **Overview**

Converting PDF to Word is an operation that converts the PDF format file into a editing Word format file. By converting PDF to Word, you can easily edit, modify, insert, or delete text and pictures, adjust layout and properties.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `enableAiLayout` | `true` | Uses AI layout analysis to recognize paragraphs, tables, images, headers and footers, and formulas; when off, rule-based layout analysis is used. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the structure of tables with the table model; when off, the table structure is rebuilt from the ruling lines. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `containImage` | `true` | Keeps the images and vector graphics (output as pictures) of the source; when off, they are not output. |
| `containPageBackgroundImage` | `true` | On pages recognized by OCR, places the page image with the recognized text erased as a background behind the text, instead of separate image crops. Only takes effect when `enableOcr` and `containImage` are on. |
| `containAnnotation` | `true` | Outputs the appearance of annotations as images. Only for PDF pages that are not recognized by OCR. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; the first language is also the language of the Word document. When no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `formulaToImage` | `true` | Outputs formulas as pictures; when off, as editable text. Only applies to formulas found by AI layout analysis (`enableAiLayout` on). |
| `fontName` | `""` | Uses the given font for all text, e.g. "Arial"; empty selects fonts automatically. Silently ignored if the font is neither embedded in the PDF nor installed on the system. |
| `pageLayoutMode` | `1` | `1`: content is laid out as flowing paragraphs; `0`: each region is placed in its own positioned frame. |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `enableAutoPageSize` | `false` | Image input only: sizes the page from the image resolution, matched to the nearest standard paper size; when off, one image pixel becomes one point. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: exact page width and height in points (1 pt = 1/72 inch); both must be greater than 0. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  pageLayoutMode: 1,
  containImage: true,
  pageRanges: "1"
};
const result = sdk.startPDFToWord("input.pdf", "", "output.docx", options);
```

### **Sample**

```js
const options = {
  formulaToImage: true,
  transparentText: true
};

const result = sdk.startPDFToWord(
  inputFilePath,
  "",
  outputFilePath,
  options
);
```

## 3.14 Convert PDF to Excel

### **Overview**

PDFSolid Conversion SDK supports converting PDF documents to Microsoft Excel format (.xlsx). By extracting, parsing, and importing data from PDF into Excel, users can further edit, analyze, or share Excel files. This feature helps increase productivity, reduce manual entry errors, and simplify complex document processing tasks.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `excelCsvFormat` | `false` | Must be off to output an .xlsx workbook; when on, CSV is output instead (see "PDF to CSV"). |
| `excelWorksheetOption` | `0` | `0`: one worksheet per table, tables only; `1`: one worksheet per page; `2`: all content on one worksheet. Image input without OCR always uses `1`. |
| `excelAllContent` | `false` | Also writes the content outside tables (text, images, headers and footers); when off, only tables are kept. Ignored with `0`. |
| `enableAiLayout` | `true` | Uses AI layout analysis to recognize paragraphs, tables, images, headers and footers, and formulas; when off, rule-based layout analysis is used. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the structure of tables with the table model; when off, the table structure is rebuilt from the ruling lines. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `containImage` | `true` | Keeps the images and vector graphics of the source. Only visible when content outside tables is written (`excelAllContent` on with `1` or `2`); tables-only output never contains images. |
| `containAnnotation` | `true` | Outputs the appearance of annotations as images. Only for PDF pages that are not recognized by OCR, and only visible when content outside tables is written. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `formulaToImage` | `true` | Outputs formulas as pictures; when off, as text. Only applies to formulas found by AI layout analysis, and only visible when content outside tables is written. |
| `fontName` | `""` | Uses the given font for all text, e.g. "Arial"; empty selects fonts automatically. Silently ignored if the font is neither embedded in the PDF nor installed on the system. |
| `outputDocumentPerPage` | `false` | Writes one workbook per page instead of one workbook. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `enableAutoPageSize` | `false` | Image input only: sizes the page from the image resolution, matched to the nearest standard paper size; when off, one image pixel becomes one point. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: exact page width and height in points (1 pt = 1/72 inch); both must be greater than 0. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  excelWorksheetOption: 2,
  excelAllContent: true,
  pageRanges: "1"
};
const result = sdk.startPDFToExcel("input.pdf", "", "output.xlsx", options);
```

### **Set the content options for Excel**

When converting PDF files to Excel files, the following options directly affect content written to the Excel file.

- `excelAllContent`: whether the converted XLSX file contains all content in the PDF.
- `excelCsvFormat`: whether to save table data in CSV format.
- `excelWorksheetOption`: worksheet layout option.

| Option | Value | Description |
| --- | --- | --- |
| `FOR_TABLE` | `0` | Create one sheet per table. |
| `FOR_PAGE` | `1` | Create one sheet per page. |
| `FOR_DOCUMENT` | `2` | Create one sheet for the entire document. |

### **Sample**

```js
const options = {
  excelWorksheetOption: 0
};

const result = sdk.startPDFToExcel(
  inputFilePath,
  "",
  outputFilePath,
  options
);
```

## 3.15 Convert PDF to PowerPoint

### **Overview**

PDFSolid Conversion SDK provides the function of converting PDF files to PowerPoint files and restoring the layout and format of the original document, which can meet the needs of users for the presentation and editing of document content in Microsoft PowerPoint.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `enableAiLayout` | `true` | Uses AI layout analysis to recognize paragraphs, tables, images, headers and footers, and formulas; when off, rule-based layout analysis is used. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the structure of tables with the table model; when off, the table structure is rebuilt from the ruling lines. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `containImage` | `true` | Keeps the images and vector graphics (output as pictures) of the source; when off, they are not output. |
| `containPageBackgroundImage` | `true` | On pages recognized by OCR, outputs the page image with the recognized text erased as a page-sized background, instead of separate image crops; headers and footers found by AI layout analysis are not output separately. Only takes effect when `enableOcr` and `containImage` are on. |
| `containAnnotation` | `true` | Outputs the appearance of annotations as images. Only for PDF pages that are not recognized by OCR. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `formulaToImage` | `true` | Outputs formulas as pictures; when off, as editable text. Only applies to formulas found by AI layout analysis (`enableAiLayout` on). |
| `fontName` | `""` | Uses the given font for all text, e.g. "Arial"; empty selects fonts automatically. Silently ignored if the font is neither embedded in the PDF nor installed on the system. |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `enableAutoPageSize` | `false` | Image input only: sizes the slide from the image resolution, matched to the nearest standard paper size; when off, one image pixel becomes one point. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: exact page width and height in points (1 pt = 1/72 inch); both must be greater than 0. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  containImage: true,
  pageRanges: "1"
};
const result = sdk.startPDFToPpt("input.pdf", "", "output.pptx", options);
```

### **Sample**

```js
const result = sdk.startPDFToPpt(inputFilePath, "", outputFilePath, {});
```

## 3.16 Convert PDF to HTML

### **Overview**

PDFSolid Conversion SDK provides the PDF to HTML function, which can convert PDF files to HTML files while maintaining the layout and format of the original document, allowing users to browse and view the document on Web.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `htmlOption` | `0` | `0`: one HTML file; `1`: one HTML file with an outline navigation; `2`: one HTML file per page; `3`: one HTML file per page with an outline navigation and previous/next links. The navigation is only generated when the PDF has an outline. |
| `pageLayoutMode` | `1` | `1`: flowing HTML; `0`: absolutely positioned blocks. |
| `enableAiLayout` | `true` | Uses AI layout analysis to recognize paragraphs, tables, images, headers and footers, and formulas; when off, rule-based layout analysis is used. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the structure of tables with the table model; when off, the table structure is rebuilt from the ruling lines. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `containImage` | `true` | Keeps the images and vector graphics of the source (written to the resource folder next to the HTML file); when off, they are not output. |
| `containPageBackgroundImage` | `true` | On pages recognized by OCR, outputs the page image with the recognized text erased as a page-sized background, instead of separate image crops; headers and footers found by AI layout analysis are not output separately. Only takes effect when `enableOcr` and `containImage` are on. |
| `containAnnotation` | `true` | Outputs the appearance of annotations as images. Only for PDF pages that are not recognized by OCR. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `formulaToImage` | `true` | Outputs formulas as pictures; when off, as editable text. Only applies to formulas found by AI layout analysis (`enableAiLayout` on). |
| `outputDocumentPerPage` | `false` | Runs a separate HTML conversion for each page. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `enableAutoPageSize` | `false` | Image input only: sizes the page from the image resolution, matched to the nearest standard paper size; when off, one image pixel becomes one point. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: exact page width and height in points (1 pt = 1/72 inch); both must be greater than 0. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  htmlOption: 0,
  pageRanges: "1"
};
const result = sdk.startPDFToHtml("input.pdf", "", "output.html", options);
```

### **HTML Options**

| Option | Value | Description |
| --- | --- | --- |
| `SINGLE_PAGE` | `0` | Convert the entire PDF into a single HTML file. |
| `SINGLE_PAGE_WITH_BOOKMARK` | `1` | Convert the PDF into a single HTML file with a bookmark navigation bar. |
| `MULTI_PAGE` | `2` | Convert the PDF into multiple HTML files, one file per page. |
| `MULTI_PAGE_WITH_BOOKMARK` | `3` | Convert the PDF into multiple HTML files with an outline page for navigation. |

### **Sample**

```js
const options = {
  htmlOption: 0
};

const result = sdk.startPDFToHtml(
  inputFilePath,
  "",
  outputFilePath,
  options
);
```

## 3.17 Convert PDF to CSV

### **Overview**

PDFSolid Conversion SDK supports converting PDF documents to CSV (Comma-Separated Values). Converting PDF to CSV is a common need, usually used to extract tabular or structured data from PDF documents and convert them into CSV files.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `excelCsvFormat` | `false` | Must be on to output CSV. Only tables are exported. |
| `excelWorksheetOption` | `0` | `0`: one CSV file per table; `1`: one CSV file per page; `2`: one CSV file with all tables, written to the output path. |
| `autoCreateFolder` | `true` | With `0` or `1`, when the output path is an existing folder, the CSV files are put in a new subfolder named after the input file; when off, they are written directly into that folder. If the output path is not an existing folder, a folder is created at that path. |
| `enableAiLayout` | `true` | Finds tables (including tables without borders) with AI layout analysis; when off, only tables with ruling lines are found. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the structure of tables with the table model; when off, the table structure is rebuilt from the ruling lines. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Required for image input; without it the conversion returns `95 (UNSUPPORTED_FEATURE)`. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `outputDocumentPerPage` | `false` | Runs a separate CSV export for each page; each export still follows `excelWorksheetOption`. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |

Example:

```js
const options = {
  excelCsvFormat: true,
  excelWorksheetOption: 2,
  pageRanges: "1"
};
const result = sdk.startPDFToExcel("input.pdf", "", "output.csv", options);
```

### **Sample**

```js
const options = {
  excelCsvFormat: true,
  autoCreateFolder: true
};

const result = sdk.startPDFToExcel(
  inputFilePath,
  "",
  outputFilePath,
  options
);
```

## 3.18 Convert PDF to Image

### **Overview**

PDFSolid Conversion SDK provides an API for converting PDF to images. Integrate PDFSolid Conversion SDK to your apps to convert PDF into images easily.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `imageType` | `0` | Output image format and file extension. For image input, transparency is kept only for PNG, TIFF, WEBP (and JPEG 2000 where supported) and 16-bit depth only for PNG, TIFF and JPEG 2000; other formats are flattened onto white and converted to 8-bit. |
| `imageColorMode` | `0` | `0` keeps the color; `1` converts to grayscale; `2` converts to black and white. |
| `imageScaling` | `4.0` | Pixel size = page size in points × scaling for PDF input, and source pixel size × scaling for image input (a value above 1 enlarges input images). Must be greater than 0. The long side is limited to an internal maximum. |
| `imagePathEnhance` | `false` | Darkens and strengthens vector lines and strokes. PDF input only. |
| `pageRanges` | `""` | Pages (or image frames) to export; empty exports every page. When one page is selected, the output path is used as the file name if it ends with the extension of the image format; when several pages are selected, the output path is used as a folder and numbered files are written into it. |

Example:

```js
const options = {
  imageType: 3,
  imageScaling: 2.0,
  pageRanges: "1"
};
const result = sdk.startPDFToImage("input.pdf", "", "output.png", options);
```

### **Sample**

```js
const ImageType = {
  JPG: 0,
  JPEG: 1,
  JPEG2000: 2,
  PNG: 3,
  BMP: 4,
  TIFF: 5,
  TGA: 6,
  GIF: 7,
  WEBP: 8
};

const options = {
  imageType: ImageType.PNG,
  imageColorMode: 0,
  imageScaling: 1.0
};

const result = sdk.startPDFToImage(
  inputFilePath,
  "",
  outputDirectory,
  options
);
```

## 3.19 Convert PDF to RTF

### **Overview**

RTF is a popular text format that can retain the format and style data of the text, and it is convenient for most text readers to read and write. Integrate PDFSolid Conversion SDK to convert PDF to RTF files now.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `enableAiLayout` | `true` | Uses AI layout analysis to recognize paragraphs, tables, images, headers and footers, and formulas; when off, rule-based layout analysis is used. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the structure of tables with the table model; when off, the table structure is rebuilt from the ruling lines. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `containImage` | `true` | Keeps the images and vector graphics (output as pictures) of the source; when off, they are not output. |
| `containPageBackgroundImage` | `true` | On pages recognized by OCR, outputs the page image with the recognized text erased as a page-sized background, instead of separate image crops; headers and footers found by AI layout analysis are not output separately. Only takes effect when `enableOcr` and `containImage` are on. |
| `containAnnotation` | `true` | Outputs the appearance of annotations as images. Only for PDF pages that are not recognized by OCR. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `formulaToImage` | `true` | Outputs formulas as pictures; when off, as editable text. Only applies to formulas found by AI layout analysis (`enableAiLayout` on). |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `enableAutoPageSize` | `false` | Image input only: sizes the page from the image resolution, matched to the nearest standard paper size; when off, one image pixel becomes one point. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: exact page width and height in points (1 pt = 1/72 inch); both must be greater than 0. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  containImage: true,
  pageRanges: "1"
};
const result = sdk.startPDFToRtf("input.pdf", "", "output.rtf", options);
```

### **Sample**

```js
const result = sdk.startPDFToRtf(inputFilePath, "", outputFilePath, {});
```

## 3.20 Convert PDF to TXT

### **Overview**

When you need to extract the text content in the PDF file, in order for data analysis, text mining, information retrieval, etc. Using PDFSolid Conversion SDK, you can easily extract the text in the PDF into the TXT file.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `txtTableFormat` | `true` | On: the cells of a table row are written on one line, separated by two spaces; off: each cell is written on its own line. Only matters when the document has tables. |
| `enableAiLayout` | `true` | Uses AI layout analysis for reading order, paragraphs, lists, headers and footers, and table detection; when off, rule-based paragraphs and ruling-line tables are used. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the cell structure of tables with the table model, which decides how table text is split and ordered. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Required for image input; without it the conversion returns `95 (UNSUPPORTED_FEATURE)`. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `containImage` | `true` | TXT never contains images. With `enableOcr` and `enableAiLayout` on, OCR text inside image regions found by AI layout analysis is dropped while this is on; turn it off to keep that text. |
| `formulaToImage` | `true` | When on, formulas found by AI layout analysis are left out of the TXT; turn it off to keep the formula text. Only applies with `enableAiLayout` on. |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. The files are named after the input file plus the page number and are written to the folder of the output path; the file name in the output path is not used. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |

Example:

```js
const options = {
  txtTableFormat: true,
  formulaToImage: false,
  pageRanges: "1"
};
const result = sdk.startPDFToTxt("input.pdf", "", "output.txt", options);
```

### **Sample**

```js
const options = {
  txtTableFormat: true
};

const result = sdk.startPDFToTxt(inputFilePath, "", outputFilePath, options);
```

## 3.21 Convert PDF to Searchable PDF

### **Overview**

To make a searchable PDF by adding invisible text to an image based PDF such as a scanned document using OCR.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `transparentText` | `true` | PDF input: on keeps the original pages and adds an invisible OCR text layer; off rebuilds the pages with visible text, and vector graphics are not kept in the rebuilt pages. Image input: the recognized text is invisible (on) or visible (off). |
| `enableOcr` | `false` | Adds the OCR text layer on the pages chosen by `ocrOption`. With `transparentText` on and OCR off, the output is just the selected source pages. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages (visible only when `transparentText` is off); `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; the first language also selects the fallback font of the text layer. When no language is given, English is used. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR; the page size follows the rotation. Only takes effect when `enableOcr` is on and the page is rebuilt (`transparentText` off, or image input). |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on and the page is rebuilt (`transparentText` off, or image input). |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `containImage` | `true` | Only when the page is rebuilt (`transparentText` off, or image input): keeps the source images on pages not recognized by OCR, and is required for `containPageBackgroundImage`. For image input without OCR, the image itself is drawn only when this is on. |
| `containPageBackgroundImage` | `true` | Only when the page is rebuilt and `containImage` is on. On OCR pages with `transparentText` off, draws the page image with the recognized text erased beneath the visible text (off: text only). For image input with `transparentText` on, keeps the source image beneath the invisible text (off: invisible text only). |
| `containAnnotation` | `true` | Draws the appearance of annotations as images on pages that are rebuilt (`transparentText` off) and not recognized by OCR. With `transparentText` on, the original pages keep their annotations unchanged. |
| `fontName` | `""` | Font of the OCR text layer; with `transparentText` off it is also the visible font of the rebuilt pages. If the font cannot be found, the OCR or system font is used. |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. The files are named after the input file plus the page number and are written to the folder of the output path; the file name in the output path is not used. |
| `enableAutoPageSize` | `false` | Image input only: sizes the page from the image resolution, matched to the nearest standard paper size; when off, one image pixel becomes one point. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: exact page width and height in points (1 pt = 1/72 inch); both must be greater than 0. The image is fitted inside with white padding. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  enableOcr: true,
  transparentText: true,
  containImage: true,
  containPageBackgroundImage: true,
  pageRanges: "1"
};
const result = sdk.startPDFToSearchablePDF("input.pdf", "", "output.pdf", options);
```

### **Sample**

```js
sdk.setDocumentAIModel("/path/to/documentai.model", -1);

const options = {
  enableOcr: true,
  languages: [3]
};

const result = sdk.startPDFToSearchablePDF(
  inputFilePath,
  "",
  outputFilePath,
  options
);
```

## 3.22 Convert PDF to OFD

### **Overview**

PDFSolid Conversion SDK supports converting PDF documents to OFD documents. Similar to searchable PDF, OFD conversion also supports OCR, page background preservation, and transparent text layers.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `enableOcr` | `false` | The text layer comes from OCR on the pages chosen by `ocrOption`; when off, it comes from the text of the PDF. Image input without OCR has no text layer. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters of the text layer on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Turns the page image upright before OCR; the page size follows the rotation. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `enableAiLayout` | `true` | Only changes how the invisible text of pages not recognized by OCR is grouped, and the header and footer detection; the visible page image is not affected. |
| `formulaToImage` | `true` | When on, the text of formulas found by AI layout analysis is removed from the invisible text layer (it can no longer be copied or searched); turn it off to keep it. The page image is unchanged. Only for pages not recognized by OCR, with `enableAiLayout` on. |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. The files are named after the input file plus the page number and are written to the folder of the output path; the file name in the output path is not used. |
| `enableAutoPageSize` | `false` | Image input only: sizes the page from the image resolution, matched to the nearest standard paper size; when off, one image pixel becomes one point. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: exact page width and height in points (1 pt = 1/72 inch); both must be greater than 0. The image is fitted inside with white padding. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  enableOcr: true,
  pageRanges: "1"
};
const result = sdk.startPDFToOfd("input.pdf", "", "output.ofd", options);
```

### **Sample**

```js
const result = sdk.startPDFToOfd(inputFilePath, "", outputFilePath, {});
```

## 3.23 Convert Word to PDF

[Word to PDF API reference](html/word_to_pdf.html).

### **Overview**

PDFSolid Conversion SDK supports converting Word documents to PDF files. During conversion you can choose to generate PDF bookmarks, output only specific pages. This function is provided by `sdk.startWordToPdf`. Its options are set through `ConvertOptions`, the same structure used for PDF conversion; only `wordPdfBookmarkMode` and `pageRanges` take effect for Word to PDF, and the other members are ignored.

`sdk.startWordToPdf(filePath, outputPath, options?, callback?): number`

### **Conversion Options**

Word to PDF uses only the following members of `ConvertOptions`:

| Field | Type | Default | Description |
|---|---|---|---|
| `wordPdfBookmarkMode` | `WordPdfBookmarkMode` | `sdk.WordPdfBookmarkMode.None` | How PDF bookmarks (the outline shown in a reader's navigation panel) are generated |
| `pageRanges` | `string` | empty | Pages to output, e.g. `"1-3,5,7-9"`; empty outputs every page |

Values of `WordPdfBookmarkMode`:

| Value | Description |
|---|---|
| `sdk.WordPdfBookmarkMode.None` | Do not generate bookmarks |
| `sdk.WordPdfBookmarkMode.Headings` | One bookmark per heading (a paragraph with an outline level), nested by level |
| `sdk.WordPdfBookmarkMode.WordBookmarks` | One bookmark per Word bookmark, named after it |

### **Return Values and Diagnostics**

- Documents containing features that may affect fidelity return `UNSUPPORTED_FEATURE` (95). The PDF is usually still produced; check the output file.
- If conversion itself fails, its actual error code takes precedence over 95.
- This binding does not expose the native diagnostics buffer.

### **Sample**

```js
const result = sdk.startWordToPdf("input.docx", "output.pdf", {
  wordPdfBookmarkMode: sdk.WordPdfBookmarkMode.Headings,
  pageRanges: "1-3,5,7-9"
});
```

## 3.24 Releasing Library Resources

### **Overview**

Releases the files and memory resources occupied by the PDFSolid Conversion SDK.

### **Notice**

- After calling `release()`, the SDK must be initialized again before another conversion task can run.
- When you only want to release resources occupied by the AI model, call `releaseDocumentAIModel()` instead of releasing all SDK resources.
- If a DocumentAI model was loaded, release it before or during SDK cleanup.

### **Sample**

```js
// Release AI model resources.
sdk.releaseDocumentAIModel();

// Release library resources.
sdk.release();
```

# 4 Data Extraction Guide

Unleash the power of data with PDFSolid Conversion SDK's data extraction APIs to detect, recognize, analyze, and extract PDF text, images, tables, and document structure.

## 4.1 Extract PDF To JSON

### **Overview**

Extract text, tables and images from PDF documents to Json file.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `jsonContainTable` | `true` | On: each table is output once as an HTML table with the row, column, span and text of every cell; off: the text of each cell is output as a separate text item of the page content. |
| `containImage` | `true` | On: the output is a .zip that holds the JSON, the page renderings and the image items; off: a plain .json without image items. With `enableOcr` and `enableAiLayout` on, it also drops the OCR text inside image regions found by AI layout analysis. |
| `enableAiLayout` | `true` | Gives the object types (title, list, table, header, footer, ...), the grouping, the reading order and the table detection. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the structure of tables with the table model; when off, the table structure is rebuilt from the ruling lines. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Without OCR, image input gives only an image item (if `containImage` is on) and no text. Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Turns the page image upright before OCR; the page width, height and coordinates follow the rotation. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `containAnnotation` | `true` | Outputs the appearance of annotations as image items. Only for PDF pages not recognized by OCR, and only when `containImage` is on. |
| `formulaToImage` | `true` | When on, formulas found by AI layout analysis become text items with empty text; turn it off to keep the formula text. Only applies with `enableAiLayout` on. |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. The files are named after the input file plus the page number and are written to the folder of the output path; the file name in the output path is not used. |
| `enableAutoPageSize` | `false` | Image input only: the page width, height and all positions use the page size from the image resolution, matched to the nearest standard paper size. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: the page width, height and all positions use this exact page size in points; both must be greater than 0. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  jsonContainTable: true,
  containImage: false,
  pageRanges: "1"
};
const result = sdk.startPDFToJson("input.pdf", "", "output.json", options);
```

### **Sample**

```js
const options = {
  jsonContainTable: true,
  enableAiLayout: true,
  enableAiTableRecognition: true
};

const result = sdk.startPDFToJson(
  inputFilePath,
  "",
  outputFilePath,
  options
);
```

## 4.2 Extract PDF To Markdown

### **Overview**

Extract text, tables and images from PDF documents to Markdown file.

### **Conversion Options**

This format uses only the following options of `ConvertOptions`; other options have no effect.

| Option | Default | Meaning |
| --- | --- | --- |
| `enableAiLayout` | `true` | Gives the titles, lists, captions, tables, images and the reading order. Headers and footers are always output as body text in Markdown. Ignored if the license does not include AI layout analysis. |
| `enableAiTableRecognition` | `true` | Recognizes the cell structure of tables with the table model; the tables are written as HTML tables. Only applies to tables found by AI layout analysis (`enableAiLayout` on). |
| `tableRecognitionAccuracy` | `1` | Table model: `sdk.TableRecognitionAccuracy.BALANCED` uses the base documentai.model, `sdk.TableRecognitionAccuracy.HIGH_ACCURACY` uses the table_legacy.model package. Only takes effect when AI table recognition runs with the built-in table model. If the model of the requested accuracy is not loaded, the conversion still succeeds and tables fall back to rule-based recognition. |
| `enableOcr` | `false` | Recognizes text with OCR on the pages chosen by `ocrOption`. Without OCR, image input gives only the page image (if `containImage` is on). Ignored if the license does not include OCR. |
| `ocrOption` | `3` | Which content OCR handles: `3` every page; `1` only image (scanned) pages; `0` re-recognizes unreadable characters on the other pages; `2` both. Only takes effect when `enableOcr` is on. |
| `languages` | `[]` | OCR recognition languages; when no language is given, English is used. Only takes effect when `enableOcr` is on. |
| `enableDocumentOrientationClassification` | `false` | Detects the page rotation and turns the page image upright before OCR. Only takes effect when `enableOcr` is on. |
| `enableDocumentDewarp` | `false` | Flattens curved or warped page photos before OCR. Only takes effect when `enableOcr` is on. |
| `pageRanges` | `""` | Pages to convert, e.g. "1-3,5,7-9"; empty converts every page. For multi-frame image input it selects the frames. |
| `containImage` | `true` | Writes the source images and vector graphics (as pictures) into the Markdown; when off, they are not output. With `enableOcr` and `enableAiLayout` on, image regions are cropped as pictures and the OCR text inside them is dropped. |
| `containAnnotation` | `true` | Writes the appearance of annotations as images, independently of `containImage`. Only for PDF pages not recognized by OCR. |
| `formulaToImage` | `true` | When on, formulas found by AI layout analysis are output as empty paragraphs, so the formula is lost; turn it off to keep the formula text. Only applies with `enableAiLayout` on. |
| `outputDocumentPerPage` | `false` | Writes one file per page instead of one document. The files are named after the input file plus the page number and are written to the folder of the output path; the file name in the output path is not used. |
| `enableAutoPageSize` | `false` | Image input only: the image width and height attributes (in points) follow the page size from the image resolution, matched to the nearest standard paper size. |
| `customPageWidth` / `customPageHeight` | `0.0` / `0.0` | Image input only: the image width and height attributes follow this exact page size in points; both must be greater than 0. Takes precedence over `enableAutoPageSize`. |

Example:

```js
const options = {
  containImage: true,
  formulaToImage: false,
  pageRanges: "1"
};
const result = sdk.startPDFToMarkdown("input.pdf", "", "output.md", options);
```

### **Sample**

```js
const options = {
  containImage: true,
  containAnnotation: true
};

const result = sdk.startPDFToMarkdown(
  inputFilePath,
  "",
  outputFilePath,
  options
);
```

# 5. Support

## 5.1 FAQ

- Does OCR work on x86 architecture?

  Currently, OCR only works on x64 architecture.

- Do Node.js conversion APIs block the event loop?

  Yes. The Node.js SDK uses synchronous conversion APIs. For server workloads, run conversions in worker threads or child processes to avoid blocking the main event loop.

- How should concurrent conversions be handled?

  The release sample `samples/demo/demo.js` uses child processes so each conversion worker has its own SDK initialization and native runtime state.

- Does the Node.js SDK expose custom AI callback hooks?

  The addon supports progress, cancellation, and custom OCR, layout, and table recognition callbacks.

- When should SDK resources be released?

  Always call `release()` after conversion work completes. If a DocumentAI model was loaded, call `releaseDocumentAIModel()` before or during cleanup.

## 5.2 Contact Us

Thanks for your interest in PDFSolid Conversion SDK, the easy-to-use and powerful development solution. If you encounter technical questions or bug issues when using PDFSolid Conversion SDK, please submit the problem report to the [PDFSolid Conversion SDK team](mailto:support@pdfsolid.com). More information as follows would help us to solve your problem:

- PDFSolid Conversion SDK product and version.
- Your operating system and Node.js version.
- Detailed descriptions of the problem.
- Any other related information, such as an error screenshot.

### **Contact Information**

- Home link: [https://www.pdfsolid.com/](https://www.pdfsolid.com/)
- Technical Support: https://www.pdfsolid.com/
- Email: [support@pdfsolid.com](mailto:support@pdfsolid.com)

Thanks,
The PDFSolid Conversion SDK Team
