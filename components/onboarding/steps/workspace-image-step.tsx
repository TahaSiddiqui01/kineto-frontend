"use client"

import { useCallback, useRef, useState } from "react"
import { workspaceService } from "@/services/workspace.service"
import { toast } from "sonner"

export interface WorkspaceImageValues {
    logoUrl: string | null
    logoFileId: string | null
}

interface WorkspaceImageStepProps {
    onNext: (values: WorkspaceImageValues) => void
    onSkip: () => void
}

export function WorkspaceImageStep({ onNext, onSkip }: WorkspaceImageStepProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const uploadedRef = useRef<WorkspaceImageValues>({ logoUrl: null, logoFileId: null })

    const handleFile = useCallback(async (file: File) => {
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
        if (!validTypes.includes(file.type)) {
            toast.error("Unsupported file type", { description: "Please use JPEG, PNG, WebP, or SVG." })
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large", { description: "Maximum size is 5 MB." })
            return
        }

        // Show local preview immediately
        setPreview(URL.createObjectURL(file))
        setUploading(true)

        try {
            const { data } = await workspaceService.uploadLogo(file)
            uploadedRef.current = { logoUrl: data.url, logoFileId: data.fileId }
            toast.success("Logo uploaded")
        } catch {
            toast.error("Upload failed", { description: "Please try again." })
            setPreview(null)
            uploadedRef.current = { logoUrl: null, logoFileId: null }
        } finally {
            setUploading(false)
        }
    }, [])

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
        },
        [handleFile]
    )

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Add a workspace logo</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Optional — you can add or change it later in settings.
                </p>
            </div>

            <div
                role="button"
                tabIndex={0}
                aria-label="Upload workspace logo"
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={[
                    "flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
                    isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100",
                ].join(" ")}
            >
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={preview}
                        alt="Workspace logo preview"
                        className="h-28 w-28 rounded-full object-cover"
                    />
                ) : (
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">
                            {uploading ? "Uploading…" : "Drag & drop or click to upload"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">PNG, JPG, WebP, SVG · max 5 MB</p>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                className="sr-only"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFile(file)
                }}
            />

            <div className="flex gap-3">
                <button
                    onClick={() => onNext(uploadedRef.current)}
                    disabled={uploading}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    Continue
                </button>
                <button
                    onClick={onSkip}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                    Skip
                </button>
            </div>
        </div>
    )
}
