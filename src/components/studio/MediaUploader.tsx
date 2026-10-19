"use client";

import React, { useState, useRef } from "react";

interface MediaUploaderProps {
  publicId: string;
  fileType: "photo" | "audio" | "video";
  label?: string;
  accept?: string;
  maxSizeMb?: number;
  onUploaded: (media: { id: string; url: string; originalFilename: string }) => void;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  publicId,
  fileType,
  label = "Upload file",
  accept,
  maxSizeMb,
  onUploaded,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveMaxMb =
    maxSizeMb ?? (fileType === "photo" ? 5 : fileType === "audio" ? 10 : 25);

  const defaultAccept =
    fileType === "photo"
      ? "image/jpeg,image/png,image/webp"
      : fileType === "audio"
      ? "audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/webm"
      : "video/mp4,video/webm,video/quicktime";

  const handleFile = async (file: File) => {
    setError(null);

    const maxBytes = effectiveMaxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size exceeds limit (${effectiveMaxMb} MB).`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);

      const res = await fetch(`/api/experiences/${encodeURIComponent(publicId)}/media`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed. Please check file format.");
        setIsUploading(false);
        return;
      }

      setIsUploading(false);
      if (data.media) {
        onUploaded(data.media);
      }
    } catch {
      setError("Network error during upload. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || defaultAccept}
          data-testid={`media-upload-input-${fileType}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
        <button
          type="button"
          disabled={isUploading}
          data-testid={`upload-btn-${fileType}`}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-xs font-ui text-white/90 hover:text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <span>
            {fileType === "photo" ? "📸" : fileType === "audio" ? "🎙️" : "🎞️"}
          </span>
          <span>{isUploading ? "Uploading..." : label}</span>
        </button>
        <span className="text-[10px] text-white/40 font-ui">
          Max {effectiveMaxMb} MB
        </span>
      </div>
      {error && (
        <p
          data-testid={`upload-error-${fileType}`}
          className="text-[11px] text-rose-300 font-ui"
        >
          {error}
        </p>
      )}
    </div>
  );
};
