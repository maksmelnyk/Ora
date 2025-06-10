import React from "react";
import { FilePreview } from "./FilePreview";
import { cn } from "../../utils";
import FormError from "./FormError";
import Label from "../ui/Label";

export interface FileUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "type"
  > {
  onChange: (files: FileList | null) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  label?: string;
  maxSize?: number;
  error?: string;
  hint?: string;
  showPreview?: boolean;
  containerClassName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  name,
  onChange,
  inputRef,
  label,
  accept,
  multiple = false,
  maxSize,
  error,
  required = false,
  hint,
  className,
  disabled = false,
  showPreview = true,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const inputRefToUse = inputRef ?? React.useRef<HTMLInputElement>(null);

  const updateFilesAndNotify = React.useCallback(
    (updatedFiles: File[]) => {
      setFiles(updatedFiles);
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      onChange(dataTransfer.files.length > 0 ? dataTransfer.files : null);
    },
    [onChange]
  );

  const handleFiles = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      let newFilesToAdd: File[] = [];
      let tempError: string | null = null;

      Array.from(fileList).forEach((file) => {
        if (maxSize && file.size > maxSize * 1024 * 1024) {
          tempError = `File "${file.name}" exceeds the maximum size of ${maxSize}MB.`;
          return;
        }
        newFilesToAdd.push(file);
      });

      if (tempError) {
        setInternalError(tempError);
        return;
      } else {
        setInternalError(null);
      }

      const updatedFiles = multiple
        ? [...files, ...newFilesToAdd]
        : newFilesToAdd;
      updateFilesAndNotify(updatedFiles);
    },
    [files, multiple, maxSize, updateFilesAndNotify]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    handleFiles(e.target.files);
    if (onChange) {
      onChange(e.target.files);
    }

    if (inputRef && typeof inputRef !== "function" && "current" in inputRef) {
      inputRef.current!.value = "";
    } else if (typeof inputRef === "function") {
      inputRef(null);
    }
  };

  const handleDrag = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave" || e.type === "drop") {
        setDragActive(false);
      }
    },
    [disabled]
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const removeFile = React.useCallback(
    (index: number) => {
      if (disabled) return;
      const newFiles = [...files];
      newFiles.splice(index, 1);
      updateFilesAndNotify(newFiles);
    },
    [files, disabled, updateFilesAndNotify]
  );

  const triggerInputClick = () => {
    if (!disabled) {
      if ("current" in inputRefToUse) {
        inputRefToUse.current?.click();
      }
    }
  };

  const displayError = error || internalError;

  return (
    <div className={cn(className)}>
      {label && (
        <Label htmlFor={id} required={required} className="mb-2">
          {label}
        </Label>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center ora-transition",
          disabled
            ? "bg-ora-gray-50 cursor-not-allowed opacity-60"
            : "cursor-pointer",
          dragActive
            ? "border-ora-highlight bg-ora-highlight/5"
            : displayError
            ? "border-ora-error bg-ora-error/5"
            : "border-ora-gray-200 hover:border-ora-gray-300 hover:bg-ora-gray-50/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={
          displayError ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        aria-live="polite"
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            triggerInputClick();
          }
        }}
      >
        <input
          ref={inputRefToUse}
          id={id}
          type="file"
          name={name}
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          required={required}
          className="sr-only"
          disabled={disabled}
          aria-invalid={!!displayError}
          aria-describedby={
            displayError ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />

        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-12 h-12 rounded-full bg-ora-gray-100 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-ora-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="ora-subheading text-base text-ora-navy mb-2">
            {multiple
              ? "Drag & drop files or click to upload"
              : "Drag & drop a file or click to upload"}
          </p>
          <p className="ora-body text-sm text-ora-gray mb-1">
            {accept ? `Accepted formats: ${accept}` : "Any file type"}
          </p>
          {maxSize && (
            <p className="ora-body text-sm text-ora-gray">
              Max size: {maxSize}MB per file
            </p>
          )}
        </div>
      </div>

      {hint && !displayError && (
        <p id={`${id}-hint`} className="mt-2 text-sm ora-body text-ora-gray">
          {hint}
        </p>
      )}

      {displayError && <FormError id={`${id}-error`} error={displayError} />}

      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-3" aria-live="polite" aria-atomic="true">
          {files.map((file, index) => (
            <FilePreview
              key={`${file.name}-${file.lastModified}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
