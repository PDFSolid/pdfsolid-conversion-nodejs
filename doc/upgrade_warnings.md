# PDFSolid Conversion SDK for Node.js 1.3.0 Upgrade Warnings

When upgrading from 1.2.0, update the Node.js declarations and the bundled
DocumentAI model together. The 1.3.0 default table profile is balanced; the
1.2.0 default was high accuracy.

`ConvertOptions.tableRecognitionAccuracy` accepts `TableRecognitionAccuracy.BALANCED`
(`1`) or `HIGH_ACCURACY` (`0`). The latter requires `table_legacy.model` to be
loaded with `setDocumentAIModel()`; if it is not loaded, the conversion still
succeeds, but tables are recognized with the rule-based method instead, so the
result differs from the high-accuracy result. To preserve 1.2.0 table
behavior, load the extension model and set `HIGH_ACCURACY` explicitly.

The new `getLicenseType()` API returns `LicenseType.UNKNOWN`, `TRIAL`, or
`FORMAL` (`0`, `1`, `2`) for the license already verified by the process. It
does not reverify the license or consume page quota.

The 1.3.0 declarations also include `ConvertOptions.wordPdfBookmarkMode` and
`WordPdfBookmarkMode` for `startWordToPdf()`.

## Migration from earlier 1.3 development builds

`DocumentAITableModelProfile` was renamed to `TableRecognitionAccuracy`; the numeric values remain `HIGH_ACCURACY = 0` and `BALANCED = 1`.

The global `setDocumentAIModelProfile()` API was removed. Set `tableRecognitionAccuracy` on each conversion options object instead. Loading a model does not select the profile for a task.

The `tableModelProfile` field from earlier 1.3 development builds was renamed to `tableRecognitionAccuracy`. The old field name is no longer supported.

`WordToPdfOptions` was removed. Word to PDF now uses the shared `ConvertOptions`; replace `bookmarkMode` with `wordPdfBookmarkMode`. Only `pageRanges` and `wordPdfBookmarkMode` take effect; all other options are ignored. Defaults output every page with no bookmarks. Word to PDF was introduced in 1.3.0.

## Model loading and runtime libraries

Upgrade the language wrapper, native library, and addon/bridge/shim together. Deploy the 1.3.0 `documentai.model`; the old file lacks balanced-profile resources. `setDocumentAIModel()` merges packages incrementally and preserves already loaded capabilities if another package fails. Configure or reload models only when all conversion calls have returned; changes during conversion or release return code `60`.

## Image input

Image-to-image conversion does not run OCR or layout analysis; multi-page TIFF input is processed frame by frame, with page ranges selecting frames. With OCR disabled, image-to-TXT and image-to-CSV return `95` (`UNSUPPORTED_FEATURE`); enable `enableOcr` for these outputs. Other image-capable output formats retain the complete source image without recognized text when OCR is disabled.

`enableAutoPageSize` (default `false`) selects the nearest standard page size from image resolution. `customPageWidth` and `customPageHeight` (default `0`) set dimensions in points (1/72 inch). Setting both takes precedence over automatic sizing and fits the image proportionally without cropping. These options apply only to image input.

Word to PDF may return `95` for unsupported features while still producing output. Check the output file; the Node.js wrapper does not expose the C/C++ diagnostics buffer.

## Linux Delivery ZIP

The delivery is `PDFSolid_Conversion_linux_node_1_3_0.zip`. Replace the binding, native libraries and model together, preserving the relative `doc/include/lib/resource/samples` layout. No npm, gem or Composer installation is required in this delivery.

The Linux core uses system fonts. Initialization and model loading are separate steps; do not pass the model directory as the initialization resource path. The bundled license has an expiration date. Validate the Word, Excel and PPT examples with:

```bash
node samples/demo/demo.js --suite office
```

## Custom AI callbacks

The binding supports `onOcr/onOcrResult`, `onLayout/onLayoutResult`, `onTable/onTableResult` callback pairs. Triggers receive an image path and synchronously return a boolean; getters return JSON following the C/C++ schema. Callback exceptions are rethrown after native conversion returns.
