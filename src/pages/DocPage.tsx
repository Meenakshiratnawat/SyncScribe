import { useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import "../app.css";
import CollabEditor from "../components/CollabEditor";
import { useState } from "react";

export default function DocPage() {
  const { docId } = useParams();
const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  return (
    <div className="appShell">
      <header className="topBar">
        <div className="docTitle">
          <div className="docDot" />
          <div>
            <div className="docName">SyncScribe</div>
            <div className="docSub">Doc: {docId}</div>
          </div>
        </div>

        <div className="topBarRight">
          <button className="btn btnGhost" disabled>
            Save Version (later)
          </button>
         <div className="pill">{status === "connected" ? "Connected" : status === "connecting" ? "Connecting" : "Offline"}</div>

        </div>
      </header>

      <main className="mainGrid">
<section className="editorPane">
  {docId ? <CollabEditor docId={docId} onStatusChange={setStatus} /> : null}
        </section>

        <aside className="rightPane">
          <Sidebar />
        </aside>
      </main>
    </div>
  );
}