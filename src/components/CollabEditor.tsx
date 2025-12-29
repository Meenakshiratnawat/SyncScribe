import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

type Props = {
  docId: string;
  onStatusChange?: (s: "connecting" | "connected" | "disconnected") => void;
};

function pickColor() {
  const colors = ["#2F6FED", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function CollabEditor({ docId, onStatusChange }: Props) {
  const [user] = useState(() => ({
    name: "Meenakshi",
    color: pickColor(),
  }));

  const [synced, setSynced] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [connStatus, setConnStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
const [peerCount, setPeerCount] = useState(0);
const othersCount = Math.max(peerCount - 1, 0);
  const ydocRef = useRef<Y.Doc | null>(null);

  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }

  const ydoc = ydocRef.current;

  const wsBaseUrl = "ws://localhost:1234";

  const provider = useMemo(() => {
    return new WebsocketProvider(wsBaseUrl, docId, ydoc, {
      connect: true,
    });
  }, [docId, ydoc, wsBaseUrl]);

  useEffect(() => {
    console.log("[collab] wsBaseUrl", { docId, wsBaseUrl });
  }, [docId, wsBaseUrl]);

  useEffect(() => {
    // Broadcast basic presence info
    provider.awareness.setLocalStateField("user", user);
  }, [provider, user]);

  useEffect(() => {
    const updatePeers = () => {
      // includes self
      setPeerCount(provider.awareness.getStates().size);
    };

    updatePeers();
    provider.awareness.on("change", updatePeers);
    return () => {
      provider.awareness.off("change", updatePeers);
    };
  }, [provider]);

  useEffect(() => {
    onStatusChange?.("connecting");

    const handleStatus = (e: {
      status: "connecting" | "connected" | "disconnected";
    }) => {
      setConnStatus(e.status);
      onStatusChange?.(e.status);
    };

    provider.on("status", handleStatus);

    const handleClose = () => {
      console.warn("[yjs] connection closed", { docId });
    };

    const handleError = (err: unknown) => {
      console.error("[yjs] connection error", { docId, err });
    };

    provider.on("connection-close", handleClose);
    provider.on("connection-error", handleError);

    return () => {
      provider.off("status", handleStatus);
      provider.off("connection-close", handleClose);
      provider.off("connection-error", handleError);
    };
  }, [provider, onStatusChange, docId]);

  useEffect(() => {
    const handleSync = (isSynced: boolean) => {
      setSynced(isSynced);
      // Helpful to see in both tabs
      console.log("[yjs sync]", { docId, isSynced });
    };

    const handleUpdate = () => {
      setUpdateCount((c) => c + 1);
    };

    provider.on("sync", handleSync);
    ydoc.on("update", handleUpdate);

    return () => {
      provider.off("sync", handleSync);
      ydoc.off("update", handleUpdate);
    };
  }, [provider, ydoc, docId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Tiptap v3 renamed History -> UndoRedo. Collaboration provides its own history.
        undoRedo: false,
      }),
      Collaboration.configure({
        document: ydoc,
        field: "collabpad",
      }),
      CollaborationCaret.configure({
        provider,
        user,
      }),
    ],
    autofocus: true,
    editable: true,
    editorProps: {
      attributes: {
        class: "proseMirrorRoot",
        spellcheck: "false",
      },
    },
  });

  // Expose Yjs doc and provider on window for debugging
  useEffect(() => {
    (window as any).__ydoc = ydoc;
    (window as any).__provider = provider;
    (window as any).__ydocToJSON = () => ydoc.toJSON();
  }, [ydoc, provider]);

  // Cleanly disconnect from y-websocket on tab close/refresh or unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        provider.destroy();
        ydoc.destroy();
      } catch {
        // ignore if already destroyed
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [provider, ydoc]);

  return (
    <div className="tiptapEditor" onClick={() => editor?.commands.focus()}>
      <div className="collabDebug">
        <span>room: <b>{docId}</b></span>
        <span>ws: <b>{wsBaseUrl}</b></span>
        <span>status: <b>{connStatus}</b></span>
        <span>sync: <b>{synced ? "yes" : "no"}</b></span>
        <span>peers: <b>{othersCount}</b></span>
        <span>updates: <b>{updateCount}</b></span>
      </div>
      <div className="collabHint">
        Type here. Open another tab at the same <code>/doc/{docId}</code> to see real-time sync.
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}