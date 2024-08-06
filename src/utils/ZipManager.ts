import JSZip from 'jszip';

class ZipManager {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  async loadZipContent(binaryStr: ArrayBuffer): Promise<JSZip.JSZipObject[]> {
    const zipContent = await this.zip.loadAsync(binaryStr);
    return Object.values(zipContent.files);
  }

  async getFirstTxtFileContent(files: JSZip.JSZipObject[]): Promise<string | null> {
    const firstTxtFile = files.find((zipFile) => zipFile.name.endsWith('.txt'));
    if (firstTxtFile) {
      return await firstTxtFile.async('text');
    }
    return null;
  }
}

export default ZipManager;
