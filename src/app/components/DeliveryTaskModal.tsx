import { useState } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  MessageSquare,
  History,
  Send,
  User,
  Paperclip,
  CheckSquare,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Lock
} from "lucide-react";

import {
  Deliverable,
  DeliveryStage,
  DELIVERY_STAGES,
  STAGE_LABELS,
  SEED_STAFF,
  AttachmentVersion,
  InternalComment,
  ClientPortalComment,
  ActivityLog,
  Subtask
} from "@/lib/delivery.functions";

export default function DeliveryTaskModal({
  deliverable,
  isOpen = true,
  onClose,
  onSave,
  onUpdate,
  onToggleSubtask,
}: {
  deliverable: Deliverable | null;
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (updated: Deliverable) => void;
  onUpdate?: (updated: Deliverable) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}) {
  if (!isOpen || !deliverable) return null;

  const [activeTab, setActiveTab] = useState<"details" | "internal_comments" | "client_comments" | "history">("details");

  // Local editable state
  const [newSubtaskLabel, setNewSubtaskLabel] = useState("");
  const [newInternalComment, setNewInternalComment] = useState("");
  const [newClientComment, setNewClientComment] = useState("");

  // Rejection/Revision modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [targetRejectStage, setTargetRejectStage] = useState<DeliveryStage>("internal_revision");

  // File upload state
  const [uploading, setUploading] = useState(false);

  // Check SLA breach
  const isOverdue =
    new Date(deliverable.due_date).getTime() < Date.now() &&
    deliverable.status !== "approved" &&
    deliverable.status !== "delivered" &&
    deliverable.status !== "archived";

  const handleStatusChange = (newStatus: DeliveryStage, note?: string) => {
    const actorName = "Alex Rivers";
    const actorRole = "Team Lead / Ops Manager";

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      deliverable_id: deliverable.id,
      actor_name: actorName,
      actor_role: actorRole,
      from_status: deliverable.status,
      to_status: newStatus,
      action_description: note
        ? `Status updated to ${STAGE_LABELS[newStatus]}: ${note}`
        : `Status updated to ${STAGE_LABELS[newStatus]}`,
      timestamp: new Date().toISOString(),
    };

    // FAIL CLOSED: Ready for client or Client review automatically makes client_visible = true
    const isClientStage = newStatus === "ready_for_client" || newStatus === "client_review" || newStatus === "approved" || newStatus === "delivered";

    const updated: Deliverable = {
      ...deliverable,
      status: newStatus,
      client_visible: isClientStage ? true : deliverable.client_visible,
      activity_logs: [newLog, ...deliverable.activity_logs],
      updated_at: new Date().toISOString(),
    };

    onUpdate?.(updated);
    onSave?.(updated);
  };

  const handleToggleSubtask = (subtask: Subtask) => {
    const updatedSubtasks = deliverable.subtasks.map((s) =>
      s.id === subtask.id ? { ...s, completed: !s.completed } : s
    );
    const updated = { ...deliverable, subtasks: updatedSubtasks };
    onUpdate?.(updated);
    onSave?.(updated);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskLabel.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      label: newSubtaskLabel.trim(),
      completed: false,
    };
    const updated = { ...deliverable, subtasks: [...deliverable.subtasks, newSub] };
    onUpdate?.(updated);
    onSave?.(updated);
    setNewSubtaskLabel("");
  };

  const handlePostInternalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalComment.trim()) return;
    const newComment: InternalComment = {
      id: `ic-${Date.now()}`,
      deliverable_id: deliverable.id,
      staff_id: "staff-1",
      staff_name: "Alex Rivers",
      staff_role: "Team Lead",
      content: newInternalComment.trim(),
      created_at: new Date().toISOString(),
    };
    const updated = {
      ...deliverable,
      internal_comments: [newComment, ...deliverable.internal_comments],
    };
    onUpdate?.(updated);
    onSave?.(updated);
    setNewInternalComment("");
  };

  const handlePostClientComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientComment.trim()) return;
    const newComment: ClientPortalComment = {
      id: `cc-${Date.now()}`,
      deliverable_id: deliverable.id,
      actor: "staff",
      author_name: "Sarah Chen (Account Manager)",
      content: newClientComment.trim(),
      created_at: new Date().toISOString(),
    };
    const updated = {
      ...deliverable,
      client_comments: [newComment, ...deliverable.client_comments],
    };
    onUpdate?.(updated);
    onSave?.(updated);
    setNewClientComment("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);

    const file = files[0];
    const nextVersionNumber = deliverable.attachments.length + 1;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const fType: "image" | "video" | "pdf" | "doc" =
      ext === "pdf" ? "pdf" : ext === "doc" || ext === "docx" ? "doc" : ext === "mp4" || ext === "mov" ? "video" : "image";

    setTimeout(() => {
      const newAtt: AttachmentVersion = {
        id: `att-${Date.now()}`,
        version: nextVersionNumber,
        filename: file.name,
        file_url: URL.createObjectURL(file),
        file_size_bytes: file.size,
        file_type: fType,
        uploaded_by_staff_id: "staff-1",
        uploaded_by_name: "Alex Rivers",
        created_at: new Date().toISOString(),
      };

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        deliverable_id: deliverable.id,
        actor_name: "Alex Rivers",
        actor_role: "Team Lead",
        from_status: deliverable.status,
        to_status: deliverable.status,
        action_description: `Uploaded attachment version v${nextVersionNumber}: ${file.name}`,
        timestamp: new Date().toISOString(),
      };

      const updated = {
        ...deliverable,
        attachments: [newAtt, ...deliverable.attachments],
        activity_logs: [newLog, ...deliverable.activity_logs],
      };
      onUpdate?.(updated);
      onSave?.(updated);
      setUploading(false);
    }, 600);
  };

  const confirmRejection = () => {
    if (!rejectReason.trim()) return;
    handleStatusChange(targetRejectStage, rejectReason.trim());
    setShowRejectModal(false);
    setRejectReason("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                {deliverable.type}
              </span>
              <span className="text-xs font-bold text-[#ef4d23]">{deliverable.client_name}</span>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                  <AlertTriangle className="h-3 w-3" /> SLA BREACH (OVERDUE)
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-neutral-900">{deliverable.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/60 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 10-Stage Pipeline Timeline */}
        <div className="p-4 bg-white border-b border-neutral-200 overflow-x-auto shrink-0">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            Status Pipeline Execution
          </p>
          <div className="flex items-center gap-1.5 min-w-max">
            {DELIVERY_STAGES.map((stg, idx) => {
              const currentIdx = DELIVERY_STAGES.indexOf(deliverable.status);
              const isCurrent = deliverable.status === stg;
              const isPast = idx < currentIdx;

              return (
                <div key={stg} className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(stg)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                      isCurrent
                        ? "bg-[#ef4d23] text-white shadow-sm ring-2 ring-[#ef4d23]/30"
                        : isPast
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    {isPast && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                    <span>{STAGE_LABELS[stg]}</span>
                  </button>
                  {idx < DELIVERY_STAGES.length - 1 && (
                    <span className="text-neutral-300 text-xs">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200 bg-neutral-50 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "details"
                ? "border-[#ef4d23] text-[#ef4d23]"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Overview & Attachments
          </button>
          <button
            onClick={() => setActiveTab("internal_comments")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "internal_comments"
                ? "border-[#ef4d23] text-[#ef4d23]"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Lock className="h-3.5 w-3.5" /> Internal Notes ({deliverable.internal_comments.length})
          </button>
          <button
            onClick={() => setActiveTab("client_comments")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "client_comments"
                ? "border-[#ef4d23] text-[#ef4d23]"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Client Portal Thread ({deliverable.client_comments.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "history"
                ? "border-[#ef4d23] text-[#ef4d23]"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <History className="h-3.5 w-3.5" /> Audit Trail ({deliverable.activity_logs.length})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: DETAILS, SUBTASKS, & ATTACHMENTS */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Details & Subtasks */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Brief / Description
                  </h4>
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 leading-relaxed">
                    {deliverable.brief_description || (deliverable as any).description || "No description provided."}
                  </p>
                </div>

                {/* Subtask Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <CheckSquare className="h-4 w-4 text-[#ef4d23]" /> Checklist Subtasks
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      {deliverable.subtasks.filter((s) => s.completed).length} / {deliverable.subtasks.length} completed
                    </span>
                  </div>

                  <div className="space-y-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                    {deliverable.subtasks.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white p-2 rounded-xl transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={s.completed}
                          onChange={() => handleToggleSubtask(s)}
                          className="rounded text-[#ef4d23] focus:ring-[#ef4d23]"
                        />
                        <span className={s.completed ? "line-through text-neutral-400" : "text-neutral-800 font-medium"}>
                          {s.label}
                        </span>
                      </label>
                    ))}

                    <form onSubmit={handleAddSubtask} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add new subtask item…"
                        value={newSubtaskLabel}
                        onChange={(e) => setNewSubtaskLabel(e.target.value)}
                        className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <button
                        type="submit"
                        className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-black"
                      >
                        Add
                      </button>
                    </form>
                  </div>
                </div>

                {/* Attachment Versioning (v1, v2, v3...) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <Paperclip className="h-4 w-4 text-[#ef4d23]" /> Versioned File Attachments
                    </h4>
                    <label className="cursor-pointer bg-[#ef4d23] text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-[#d9421b] transition-all inline-flex items-center gap-1">
                      <Upload className="h-3.5 w-3.5" /> Upload New Version
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {uploading && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" /> Uploading new attachment version…
                    </div>
                  )}

                  <div className="space-y-2">
                    {deliverable.attachments.length === 0 ? (
                      <div className="p-4 text-center border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-400">
                        No files uploaded yet. Upload v1 draft above.
                      </div>
                    ) : (
                      deliverable.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="bg-white p-3 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3 shadow-sm hover:border-neutral-300 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="bg-[#ef4d23]/10 text-[#ef4d23] font-bold text-xs px-2.5 py-1 rounded-lg">
                              v{att.version}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-neutral-900">{att.filename}</p>
                              <p className="text-[10px] text-neutral-400">
                                Uploaded by {att.uploaded_by_name} • {(att.file_size_bytes / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          </div>

                          <a
                            href={att.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Preview / Download <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Metadata & Approval Action Card */}
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                  <h4 className="font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                    Task Metadata
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Assigned To:</span>
                      <span className="font-semibold text-neutral-900">{deliverable.assigned_to_name}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-500">Priority:</span>
                      <span className="font-semibold uppercase tracking-wider text-red-600">
                        {deliverable.priority}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-500">Due Date:</span>
                      <span className="font-semibold">{deliverable.due_date}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-500">Publish Date:</span>
                      <span className="font-semibold">{deliverable.publish_date}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                      <span className="text-neutral-500">Client Visible:</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          deliverable.client_visible
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {deliverable.client_visible ? "VISIBLE TO CLIENT" : "INTERNAL ONLY"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approval Action Controls */}
                <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-neutral-900">Approval Workflow Actions</h4>

                  {deliverable.status === "in_progress" && (
                    <button
                      onClick={() => handleStatusChange("internal_review")}
                      className="w-full bg-[#ef4d23] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#d9421b] transition-all shadow-sm"
                    >
                      Submit for Internal Review →
                    </button>
                  )}

                  {deliverable.status === "internal_review" && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleStatusChange("ready_for_client")}
                        className="w-full bg-emerald-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                      >
                        Approve & Send to Client →
                      </button>
                      <button
                        onClick={() => {
                          setTargetRejectStage("internal_revision");
                          setShowRejectModal(true);
                        }}
                        className="w-full border border-red-200 bg-red-50 text-red-700 text-xs font-semibold py-2 rounded-xl hover:bg-red-100 transition-all"
                      >
                        Request Internal Revision
                      </button>
                    </div>
                  )}

                  {deliverable.status === "ready_for_client" && (
                    <button
                      onClick={() => handleStatusChange("client_review")}
                      className="w-full bg-orange-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-sm"
                    >
                      Mark in Client Review Room
                    </button>
                  )}

                  {deliverable.status === "client_review" && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleStatusChange("approved")}
                        className="w-full bg-emerald-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                      >
                        Client Approved Asset ✓
                      </button>
                      <button
                        onClick={() => {
                          setTargetRejectStage("client_revision");
                          setShowRejectModal(true);
                        }}
                        className="w-full border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold py-2 rounded-xl hover:bg-amber-100 transition-all"
                      >
                        Client Requested Revision
                      </button>
                    </div>
                  )}

                  {deliverable.status === "approved" && (
                    <button
                      onClick={() => handleStatusChange("delivered")}
                      className="w-full bg-neutral-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-black transition-all shadow-sm"
                    >
                      Mark Published / Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERNAL TEAM COMMENTS (STAFF ONLY) */}
          {activeTab === "internal_comments" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Internal Team Thread:</strong> Comments posted here are strictly private to Lumen & Co staff and will NEVER be visible to the client.
                </span>
              </div>

              <form onSubmit={handlePostInternalComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add internal comment or @mention staff…"
                  value={newInternalComment}
                  onChange={(e) => setNewInternalComment(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-black flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Comment
                </button>
              </form>

              <div className="space-y-3">
                {deliverable.internal_comments.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">No internal notes yet.</p>
                ) : (
                  deliverable.internal_comments.map((ic) => (
                    <div key={ic.id} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900">
                          {ic.staff_name} <span className="text-[10px] font-normal text-neutral-400">({ic.staff_role})</span>
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(ic.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">{ic.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CLIENT PORTAL COMMENTS */}
          {activeTab === "client_comments" && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0 text-purple-600" />
                <span>
                  <strong>Client Portal Communication:</strong> Messages here sync directly with the client's dashboard.
                </span>
              </div>

              <form onSubmit={handlePostClientComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Send a client-visible message or update…"
                  value={newClientComment}
                  onChange={(e) => setNewClientComment(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-600 flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Send to Client
                </button>
              </form>

              <div className="space-y-3">
                {deliverable.client_comments.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">No client messages yet.</p>
                ) : (
                  deliverable.client_comments.map((cc) => (
                    <div
                      key={cc.id}
                      className={`p-4 rounded-2xl border space-y-1 ${
                        cc.actor === "client"
                          ? "bg-purple-50/60 border-purple-200 text-purple-950"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold">
                          {cc.author_name}{" "}
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold bg-white border">
                            {cc.actor}
                          </span>
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(cc.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{cc.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL LOG */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900">Status & Activity Audit Log</h4>
              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                {deliverable.activity_logs.length === 0 ? (
                  <p className="p-4 text-xs text-neutral-400 text-center">No activity logged yet.</p>
                ) : (
                  deliverable.activity_logs.map((log) => (
                    <div key={log.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-neutral-50">
                      <div>
                        <p className="font-bold text-neutral-900">{log.action_description}</p>
                        <p className="text-[10px] text-neutral-400">
                          Actor: {log.actor_name} ({log.actor_role})
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MANDATORY REJECTION REASON MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-neutral-200">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-base font-bold text-neutral-900">Mandatory Revision Note</h3>
            </div>
            <p className="text-xs text-neutral-600">
              You must provide a clear, specific reason for requesting revisions so the assignee knows what changes to make.
            </p>
            <textarea
              rows={3}
              placeholder="Explain required changes or missing criteria…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-neutral-300 rounded-2xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejection}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Confirm Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
