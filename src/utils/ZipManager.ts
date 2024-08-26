import {unzip, ZipEntry, setOptions} from 'unzipit';

setOptions({workerURL: 'http://localhost:3000/scripts/unzipit-worker.module.js'});

export async function LoadZipContent(binaryStr: ArrayBuffer) {
  console.log('Loading Zip content...');
  const zipContent = await unzip(binaryStr);
  console.info('Zip content:', zipContent);
  return Object.values(zipContent.entries);
}

export async function GetFirstTxtFileContent(files: ZipEntry[]): Promise<string | null> {
  const firstTxtFile = files.find((zipFile) => zipFile.name.endsWith('.txt'));
  if (firstTxtFile) {
    console.info('Found txt file in Zip:', firstTxtFile);
    return await firstTxtFile.text();
  }
  return null;
}