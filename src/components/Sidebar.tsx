import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveTab } from "../store/uiSlice";

export function Sidebar() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((s) => s.ui.activeTab);

  const title = useMemo(() => {
    return activeTab === "comments" ? "Comments" : "Versions";
  }, [activeTab]);

  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <div className="sidebarTitle">Sidebar Panel</div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "comments" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("comments"))}
        >
          Comments
        </button>

        <button
          className={`tab ${activeTab === "versions" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("versions"))}
        >
          Versions
        </button>
      </div>

      <div className="sidebarBody">
        <div className="panelTitle">{title}</div>

        {activeTab === "comments" ? (
          <div className="emptyState">
            <div className="emptyStateMain">No comments yet</div>
            <div className="emptyStateSub">
              Select text in the editor → add comment (we’ll build this later).
            </div>

            <div className="listMock">
              <div className="listItemMock">
                <div className="chip">P2</div>
                <div>
                  <div className="mockStrong">Example comment thread</div>
                  <div className="mockMuted">“This paragraph needs clarity…”</div>
                </div>
              </div>
              <div className="listItemMock">
                <div className="chip">P5</div>
                <div>
                  <div className="mockStrong">Another thread</div>
                  <div className="mockMuted">“Add citation here.”</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="emptyState">
            <div className="emptyStateMain">No versions saved</div>
            <div className="emptyStateSub">
              You’ll be able to save snapshots and restore a copy.
            </div>

            <div className="listMock">
              <div className="listItemMock">
                <div className="chip">v1</div>
                <div>
                  <div className="mockStrong">Version — Draft</div>
                  <div className="mockMuted">Dec 22, 2025 • Meenakshi</div>
                </div>
              </div>
              <div className="listItemMock">
                <div className="chip">v2</div>
                <div>
                  <div className="mockStrong">Version — Review</div>
                  <div className="mockMuted">Dec 23, 2025 • Meenakshi</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}