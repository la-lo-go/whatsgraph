import ZipManager from '@/utils/ZipManager';
import { ParseWhatsAppMessages, WhatsAppMessages } from '@/utils/WhatsAppMessage';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface MyDropzoneProps {
  onMessagesParsed: (messages: WhatsAppMessages[]) => void;
}

export default function MyDropzone({ onMessagesParsed }: MyDropzoneProps) {
  const [acceptedFileName, setAcceptedFileName] = useState<string | null>(null);

  const handleFileContent = useCallback((fileText: string) => {
    const messages = ParseWhatsAppMessages(fileText);
    onMessagesParsed(messages);
  }, [onMessagesParsed]);

  const handleZipFile = useCallback(async (binaryStr: ArrayBuffer) => {
    const zipManager = new ZipManager();
    const zipFiles = await zipManager.loadZipContent(binaryStr);
    const fileText = await zipManager.getFirstTxtFileContent(zipFiles);
    if (fileText) {
      handleFileContent(fileText);
    } else {
      console.log("No .txt file found in the zip");
    }
  }, [handleFileContent]);

  const handleTextFile = useCallback((binaryStr: ArrayBuffer, fileName: string) => {
    const fileText = new TextDecoder().decode(new Uint8Array(binaryStr));
    handleFileContent(fileText);
    setAcceptedFileName(fileName);
  }, [handleFileContent]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        console.info(`File Name: ${file.name}`);
        console.info(`File Type: ${file.type}`);
        const binaryStr = reader.result;
        if (file.type === "application/zip" || file.type === "application/x-zip-compressed") {
          await handleZipFile(binaryStr as ArrayBuffer);
        } else if (file.type === "text/plain") {
          handleTextFile(binaryStr as ArrayBuffer, file.name);
        } else {
          console.error("Unsupported file type");
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, [handleTextFile, handleZipFile]);

  const {
    getRootProps,
    getInputProps,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-400 rounded-lg p-4 hover:bg-gray-800 hover:cursor-pointer text-center"
    >
      <input {...getInputProps()} />
      {isDragReject && (
        <p className="text-red-500">The file will be rejected</p>
      )}
      {!acceptedFileName && <DropzoneInstructions />}
      {acceptedFileName && (
        <div className="mt-4">
          <p className="text-blue-500">Accepted File: {acceptedFileName}</p>
        </div>
      )}
    </div>
  );
}

function DropzoneInstructions() {
  return (
    <div className="text-center">
      <p className="text-gray-500 text-lg">
        Drag & drop a file here, or click to select a file
      </p>
      <p className="text-gray-400 text-sm mt-2">
        Only .zip and .txt files are accepted. Maximum one file.
      </p>
      <div className="mt-4">
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
    </div>
  );
}