import { useState } from "react";
import { X, Layers, ArrowLeftRight, CheckCircle2, Download } from "lucide-react";
import { AttachmentVersion } from "@/lib/delivery.functions";

export default function AttachmentCompareModal({
  attachments,
  onClose,
}: {
  attachments: AttachmentVersion[];
  onClose: () => void;
}) {
  const sorted = [...attachments].sort((a, b) => a.version - b.version);

  const [v1Index, setV1Index] = useState(0);
  const [v2Index, setV2Index] = useState(Math.max(0, sorted.length - 1));
  const [sliderPos, setSliderPos] = useState(50); // Split slider percentage

  const file1 = sorted[v1Index] || sorted[0];
  const file2 = sorted[v2Index] || sorted[sorted.length - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ef4d23]/20 text-[#ef4d23] rounded-xl">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Attachment Diff & Version Comparator</h3>
              <p className="text-xs text-neutral-400">
                Compare revisions side-by-side to review design changes before client approval.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Version Selectors Bar */}
        <div className="p-4 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-700">Left Version:</span>
            <select
              value={v1Index}
              onChange={(e) => setV1Index(Number(e.target.value))}
              className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 font-bold"
            >
              {sorted.map((att, idx) => (
                <option key={att.id} value={idx}>
                  v{att.version} - {att.filename}
                </option>
              ))}
            </select>
          </div>

          <span className="text-neutral-400 font-bold">VS</span>

          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-700">Right Version:</span>
            <select
              value={v2Index}
              onChange={(e) => setV2Index(Number(e.target.value))}
              className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 font-bold text-[#ef4d23]"
            >
              {sorted.map((att, idx) => (
                <option key={att.id} value={idx}>
                  v{att.version} - {att.filename}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-900 text-white">
          {/* Left Version (v1) */}
          <div className="space-y-3 bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
            <div className="flex items-center justify-between text-xs border-b border-neutral-700 pb-2">
              <span className="font-bold bg-neutral-700 text-white px-2.5 py-0.5 rounded-lg">
                v{file1.version} ({file1.filename})
              </span>
              <span className="text-neutral-400">{(file1.file_size_bytes / 1024 / 1024).toFixed(1)} MB</span>
            </div>

            <div className="aspect-video bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-700 relative">
              <img
                src={file1.file_url}
                alt={`v${file1.version}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="text-[11px] text-neutral-400">Uploaded by {file1.uploaded_by_name}</p>
          </div>

          {/* Right Version (v2) */}
          <div className="space-y-3 bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
            <div className="flex items-center justify-between text-xs border-b border-neutral-700 pb-2">
              <span className="font-bold bg-[#ef4d23] text-white px-2.5 py-0.5 rounded-lg">
                v{file2.version} ({file2.filename})
              </span>
              <span className="text-neutral-400">{(file2.file_size_bytes / 1024 / 1024).toFixed(1)} MB</span>
            </div>

            <div className="aspect-video bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-700 relative">
              <img
                src={file2.file_url}
                alt={`v${file2.version}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="text-[11px] text-neutral-400">Uploaded by {file2.uploaded_by_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
