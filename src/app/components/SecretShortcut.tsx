import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

const SEQUENCE = "/sahit";

/** Listens for the hidden "/sahit" typed sequence and opens the private CRM. */
export function SecretShortcut() {
  const router = useRouter();

  useEffect(() => {
    let buffer = "";
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) {
          return;
        }
      }
      if (e.key.length !== 1) return;

      buffer = (buffer + e.key).slice(-SEQUENCE.length);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        buffer = "";
      }, 2000);

      if (buffer.toLowerCase() === SEQUENCE) {
        buffer = "";
        void router.navigate({ to: "/sahit/" });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  return null;
}
