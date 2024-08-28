import {LoadZipContent, GetFirstTxtFileContent} from '@/utils/ZipManager';
import { ParseWhatsAppMessages, WhatsAppMessages } from '@/utils/WhatsAppMessage';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface MyDropzoneProps {
  onMessagesParsed: (messages: WhatsAppMessages[]) => void;
}

export default function MyDropzone({ onMessagesParsed }: MyDropzoneProps) {
  const [acceptedFileName, setAcceptedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileContent = useCallback((fileText: string) => {
    const messages = ParseWhatsAppMessages(fileText);
    onMessagesParsed(messages);
    setIsProcessing(false);
  }, [onMessagesParsed]);

  const handleZipFile = useCallback(async (binaryStr: ArrayBuffer) => {
    setIsProcessing(true);
    const zipFiles = await LoadZipContent(binaryStr);
    const fileText = await GetFirstTxtFileContent(zipFiles);
    if (fileText) {
      handleFileContent(fileText);
    } else {
      console.log("No .txt file found in the zip");
      setIsProcessing(false);
    }
  }, [handleFileContent]);

  const handleTextFile = useCallback((binaryStr: ArrayBuffer, fileName: string) => {
    setIsProcessing(true);
    const fileText = new TextDecoder().decode(new Uint8Array(binaryStr));
    handleFileContent(fileText);
    setAcceptedFileName(fileName);
  }, [handleFileContent]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsProcessing(true);
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
          setIsProcessing(false);
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
      className="border-4 border-dashed grow border-secondary rounded-xl p-4 hover:bg-secondary hover:border-gray-500 hover:border-solid hover:cursor-pointer text-center"
    >
      <input {...getInputProps()} />
      {isDragReject && (
        <p className="text-red-500">The file will be rejected</p>
      )}
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Processing file...</p>
        </div>
      ) : (
        <>
          {!acceptedFileName && <DropzoneInstructions />}
          {acceptedFileName && (
            <div className="mt-4">
              <p className="text-blue-500">Accepted File: {acceptedFileName}</p>
            </div>
          )}
        </>
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