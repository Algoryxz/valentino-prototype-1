"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ManageExperienceSectionProps {
  publicId: string;
  initialStatus?: string;
  className?: string;
}

export const ManageExperienceSection: React.FC<ManageExperienceSectionProps> = ({
  publicId,
  initialStatus = "DRAFT",
  className = "",
}) => {
  const router = useRouter();
  const [status, setStatus] = useState<string>(initialStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleToggleStatus = async (targetStatus: "DISABLED" | "PUBLISHED") => {
    setIsUpdatingStatus(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/experiences/${publicId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ status: targetStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to update experience status.",
        });
        return;
      }

      setStatus(targetStatus);
      setStatusMessage({
        type: "success",
        text:
          targetStatus === "DISABLED"
            ? "Public link disabled. Recipients who visit will see that the experience is deactivated."
            : "Public link re-enabled. Recipients can now view your Valentine.",
      });
    } catch {
      setStatusMessage({
        type: "error",
        text: "A network error occurred while updating status. Please try again.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeletePermanently = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/experiences/${publicId}`, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-store",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete experience. Please try again.");
        setIsDeleting(false);
        return;
      }

      // Safe return to gallery after confirmed deletion
      window.location.href = "/templates";
    } catch {
      setDeleteError("A network error occurred during deletion. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div
      data-testid="manage-experience-section"
      className={`p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <svg
          className="w-4 h-4 text-rose-400 select-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
          />
        </svg>
        <div>
          <h4 className="text-xs font-serif font-medium text-white tracking-wide">
            Manage Experience & Access
          </h4>
          <p className="text-[11px] text-white/50 font-ui">
            Deactivate the public share link or permanently delete this Valentine and all uploaded media.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`p-3 rounded-xl text-xs font-ui ${
            statusMessage.type === "success"
              ? "bg-emerald-950/50 border border-emerald-500/30 text-emerald-200"
              : "bg-rose-950/60 border border-rose-500/30 text-rose-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="pt-1 flex flex-wrap gap-3 items-center justify-between">
        {/* Disable / Enable Controls */}
        {status === "PUBLISHED" ? (
          <button
            type="button"
            data-testid="disable-link-button"
            disabled={isUpdatingStatus}
            onClick={() => handleToggleStatus("DISABLED")}
            className="px-3.5 py-2 rounded-xl text-xs font-serif text-amber-200 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUpdatingStatus ? "Updating…" : "Disable Public Link"}
          </button>
        ) : status === "DISABLED" ? (
          <button
            type="button"
            data-testid="enable-link-button"
            disabled={isUpdatingStatus}
            onClick={() => handleToggleStatus("PUBLISHED")}
            className="px-3.5 py-2 rounded-xl text-xs font-serif text-emerald-200 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUpdatingStatus ? "Updating…" : "Re-enable Public Link"}
          </button>
        ) : (
          <span className="text-[11px] text-white/40 italic font-ui">
            Valentine is currently a draft. Public link will activate once published.
          </span>
        )}

        {/* Permanent Delete Trigger */}
        <button
          type="button"
          data-testid="delete-experience-button"
          onClick={() => {
            setDeleteError(null);
            setIsDeleteModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-serif text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 transition-colors cursor-pointer ml-auto"
        >
          Permanently Delete…
        </button>
      </div>

      {/* Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          data-testid="delete-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
        >
          <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#131118] border border-rose-500/30 space-y-5 text-left shadow-2xl shadow-black/90">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-300 text-xl">
              ⚠️
            </div>

            <div className="space-y-1.5">
              <h3 id="delete-dialog-title" className="text-lg font-serif font-medium text-white">
                Permanently Delete Valentine?
              </h3>
              <p className="text-xs text-white/70 font-ui leading-relaxed">
                This action is permanent and cannot be undone. All your inscribed messages, photos,
                soundtracks, recipient replies, and access tokens will be erased immediately.
              </p>
            </div>

            {deleteError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 font-ui"
              >
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                data-testid="cancel-delete-button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-serif text-white/80 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="confirm-delete-button"
                disabled={isDeleting}
                onClick={handleDeletePermanently}
                className="flex-1 py-2.5 rounded-xl text-xs font-serif text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-950/80 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Yes, Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
