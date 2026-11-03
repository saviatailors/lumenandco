import { Modal } from "./ui/Modal";
import WhatsAppMessengerView from "./WhatsAppMessengerView";
import { UserRoleType } from "@/lib/messenger.types";

export interface BuiltInMessengerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: UserRoleType;
  currentUserId?: string;
  currentUserName?: string;
  clientBrandId?: string;
  clientBrandName?: string;
}

export default function BuiltInMessengerModal({
  isOpen,
  onClose,
  currentUserRole = "founder",
  currentUserId = "staff-6",
  currentUserName = "Sahit Sai",
  clientBrandId,
  clientBrandName,
}: BuiltInMessengerProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-6xl">
      <div className="-m-6 h-[85vh] max-h-[780px] overflow-hidden rounded-3xl flex flex-col">
        <WhatsAppMessengerView
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          clientBrandId={clientBrandId}
          clientBrandName={clientBrandName}
          onCloseModal={onClose}
          isEmbeddedModal={true}
        />
      </div>
    </Modal>
  );
}
