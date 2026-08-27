"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { UploadSimple, Image as ImageIcon, Trash, Link as LinkIcon, Sparkle } from "@phosphor-icons/react";

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (val: string) => void;
}

export function ImageUploadDropzone({ value, onChange }: ImageUploadDropzoneProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Hanya file gambar (PNG, JPG, JPEG, WEBP) yang diperbolehkan.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-3 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[var(--color-ink)]">
          Banner Gambar Event (Foto Sampul)
        </label>
        <div className="flex items-center gap-1 bg-[var(--color-surface)] p-0.5 rounded-lg border border-[var(--color-hairline)]">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              activeTab === "file"
                ? "bg-[var(--color-navy)] text-white shadow-2xs"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              activeTab === "url"
                ? "bg-[var(--color-navy)] text-white shadow-2xs"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            Input URL
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="text-xs text-[#991b1b] bg-[#fee2e2] p-2.5 rounded-lg font-medium">
          {uploadError}
        </div>
      )}

      {/* Live Preview If Image Exists */}
      {value ? (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-surface)] group shadow-2xs">
          <img
            src={value}
            alt="Preview Banner Event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary h-9 px-3 text-xs font-bold bg-white text-[var(--color-ink)] inline-flex items-center gap-1.5 rounded-xl shadow-xs"
            >
              <UploadSimple size={15} weight="bold" />
              <span>Ganti Foto</span>
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="btn-secondary h-9 px-3 text-xs font-bold bg-white text-[#d30a28] hover:bg-red-50 inline-flex items-center gap-1.5 rounded-xl shadow-xs"
            >
              <Trash size={15} />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      ) : activeTab === "file" ? (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
            dragOver
              ? "border-[var(--color-primary)] bg-[var(--color-surface)]"
              : "border-[var(--color-hairline)] hover:border-[var(--color-primary)] bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)]"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white text-[var(--color-primary)] flex items-center justify-center mb-3 shadow-2xs border border-[var(--color-hairline)]">
            <UploadSimple size={22} weight="bold" />
          </div>
          <span className="text-sm font-bold text-[var(--color-ink)] mb-1">
            Klik untuk memilih foto atau seret gambar ke sini
          </span>
          <span className="text-xs text-[var(--color-muted)]">
            Format PNG, JPG, JPEG, atau WEBP (Maksimal 5 MB)
          </span>
        </div>
      ) : (
        /* Direct URL Input */
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] flex items-center pointer-events-none">
            <LinkIcon size={18} />
          </div>
          <input
            type="url"
            className="input with-icon-left text-sm h-11"
            style={{ paddingLeft: 44 }}
            placeholder="https://images.unsplash.com/photo-..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
