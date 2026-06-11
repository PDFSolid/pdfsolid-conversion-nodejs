export interface ConvertOptions {
  enableAiLayout?: boolean;
  enableAiTableRecognition?: boolean;
  containImage?: boolean;
  containPageBackgroundImage?: boolean;
  jsonContainTable?: boolean;
  containAnnotation?: boolean;
  excelAllContent?: boolean;
  excelCsvFormat?: boolean;
  enableOcr?: boolean;
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
}

export interface ConvertCallback {
  onProgress?: (currentPage: number, totalPage: number) => void;
  isCancelled?: () => boolean;
}

export const resourcePath: string;
export const vendorPath: string;
export function normalizeResourcePath(resourcePath?: string): string;
export function licenseVerify(license: string, deviceId?: string, appId?: string): number;
export function initialize(resourcePath?: string): void;
export function setLogger(enableInfo: boolean, enableWarning: boolean): void;
export function setDocumentAIModel(modelPath: string, gpuId?: number): number;
export function getPageCount(filePath: string, password?: string): number;
export function getRemainingPageQuota(): number;
export function getVersion(): string;
export function release(): void;
export function releaseDocumentAIModel(): void;
export function setDocumentAIModelCount(layoutModelCount: number, tableModelCount: number): void;
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