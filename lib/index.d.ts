/** How the PDF bookmarks (the outline shown in a reader's navigation panel) are generated when converting a Word document to PDF. */
export enum WordPdfBookmarkMode {
  /** Do not generate bookmarks. */
  None = 0,
  /** One bookmark per heading (a paragraph with an outline level), nested by level. */
  Headings = 1,
  /** One bookmark per Word bookmark, named after it. */
  WordBookmarks = 2,
}

/** Conversion options. Word to PDF reads only pageRanges and wordPdfBookmarkMode; the other options do not apply to it. */
export interface ConvertOptions {
  enableAiLayout?: boolean;
  enableAiTableRecognition?: boolean;
  tableRecognitionAccuracy?: TableRecognitionAccuracy;
  containImage?: boolean;
  containPageBackgroundImage?: boolean;
  jsonContainTable?: boolean;
  containAnnotation?: boolean;
  excelAllContent?: boolean;
  excelCsvFormat?: boolean;
  enableOcr?: boolean;
  enableDocumentOrientationClassification?: boolean;
  enableDocumentDewarp?: boolean;
  /** Size the output page from an image input's own resolution, matched to the nearest standard paper. */
  enableAutoPageSize?: boolean;
  /** Output page width in points for image input; set with customPageHeight to choose the page outright. */
  customPageWidth?: number;
  /** Output page height in points for image input. */
  customPageHeight?: number;
  transparentText?: boolean;
  txtTableFormat?: boolean;
  imagePathEnhance?: boolean;
  formulaToImage?: boolean;
  autoCreateFolder?: boolean;
  outputDocumentPerPage?: boolean;
  imageScaling?: number;
  pageLayoutMode?: number;
  excelWorksheetOption?: number;
  htmlOption?: number;
  ocrOption?: number;
  imageColorMode?: number;
  imageType?: number;
  fontName?: string;
  pageRanges?: string;
  languages?: number[];
  /** How the PDF bookmarks are generated. Only takes effect for Word to PDF. Defaults to WordPdfBookmarkMode.None. */
  wordPdfBookmarkMode?: WordPdfBookmarkMode;
}

export interface ConvertCallback {
  onProgress?: (currentPage: number, totalPage: number) => void;
  isCancelled?: () => boolean;
  /** Supply each AI trigger together with its result getter. All callbacks are synchronous. */
  onOcr?: (imagePath: string) => boolean;
  /** SDK-compatible OCR JSON, or null on failure. */
  onOcrResult?: () => string | null;
  onLayout?: (imagePath: string) => boolean;
  /** SDK-compatible layout JSON, or null on failure. */
  onLayoutResult?: () => string | null;
  onTable?: (imagePath: string) => boolean;
  /** SDK-compatible table JSON, or null on failure. */
  onTableResult?: () => string | null;
}

export const resourcePath: string;
export const vendorPath: string;
export function normalizeResourcePath(resourcePath?: string): string;
export function licenseVerify(license: string, deviceId?: string, appId?: string): number;
export function initialize(resourcePath?: string): void;
export function setLogger(enableInfo: boolean, enableWarning: boolean): void;
export function setDocumentAIModel(modelPath: string, gpuId?: number): number;
export enum TableRecognitionAccuracy {
  HIGH_ACCURACY = 0,
  BALANCED = 1,
}
export function getPageCount(filePath: string, password?: string): number;
export function getRemainingPageQuota(): number;
/** Type of the currently verified license. */
export enum LicenseType {
  UNKNOWN = 0,
  TRIAL = 1,
  FORMAL = 2,
}
/** Returns the type of the currently verified license without verifying again or consuming quota. */
export function getLicenseType(): LicenseType;
export function getVersion(): string;
export function release(): void;
export function releaseDocumentAIModel(): void;
export function setDocumentAIModelCount(layoutModelCount: number, tableModelCount: number): void;
/** Converts a Word document to PDF. */
export function startWordToPdf(filePath: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToWord(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToRtf(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToExcel(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToPpt(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToHtml(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToImage(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToSearchablePDF(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToTxt(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToJson(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToMarkdown(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
export function startPDFToOfd(filePath: string, password: string, outputPath: string, options?: ConvertOptions, callback?: ConvertCallback): number;
