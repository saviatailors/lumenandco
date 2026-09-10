import { ReactNode } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  title = "No items found",
  description = "Get started by adding your first record.",
  actionLabel,
  onAction,
  icon,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="p-10 border border-dashed border-neutral-200 rounded-3xl text-center space-y-3 bg-neutral-50/50">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
        {icon || <FolderOpen className="h-6 w-6" />}
      </div>
      <div>
        <h4 className="text-sm font-bold text-neutral-800">{title}</h4>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-0.5">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button onClick={onAction} size="sm">
            <Plus className="h-3.5 w-3.5" /> {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
