# SyncScribe 📝

SyncScribe is a real-time collaborative document editor built with React, TypeScript, Tiptap, and Yjs.

Think of it as a mini Google Docs–style editor where multiple users can type in the same document and see each other's changes instantly (using CRDTs instead of manual merge logic).

## ✨ Features (current)

- 🧩 **Rich-text editor** using [Tiptap](https://tiptap.dev/) (ProseMirror-based)
- 🔁 **Real-time collaboration** with:
  - [Yjs](https://yjs.dev/) CRDT document
  - [y-websocket](https://github.com/yjs/y-websocket) as the sync server
- 🌐 **Room-based documents**:
  - URL pattern: `/doc/:id`
  - `/doc/demo` → room id = `demo`
- 🧠 **Global UI state with Redux Toolkit**:
  - Sidebar tabs: **Comments** / **Versions**
- 🧪 **Debug panel for collaboration**:
  - Shows current room, WebSocket URL, connection status
  - Sync status (`yes` / `no`)
  - Number of other peers in the same document
  - Number of Yjs updates received

---

## 🏗 Tech Stack
- **Frontend**
  - React (TypeScript)
  - Vite
  - React Router
  - Redux Toolkit
  - Tiptap (React + StarterKit)
  - Yjs
  - y-websocket client

- **Collaboration backend**
  - `y-websocket` server (Node.js process)  
    Used only for syncing Yjs documents over WebSockets.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run WebSocket server + Vite dev server together

SyncScribe uses a `y-websocket` server on port **1234**.

There is a helper script to start both:

```bash
npm run dev:all
```

This will:

- start `y-websocket` on `ws://localhost:1234`
- start Vite dev server on `http://localhost:5173`

You should see something like:

```bash
running at '0.0.0.0' on port 1234

VITE v7.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

### 3. Open the app

Go to:

```text
http://localhost:5173/doc/demo
```

### 4. Test collaboration

1. Open `http://localhost:5173/doc/demo` in **Tab 1**.
2. Open the same URL in **Tab 2** (or another browser / incognito).
3. Start typing in the editor in Tab 1.
4. You should see the text appear in Tab 2 in real time.

At the top of the editor there is a small debug bar that shows:

- `room: demo`
- `ws: ws://localhost:1234`
- `status: connected`
- `sync: yes`
- `peers: N` (number of **other** clients in this room)

---

## 📂 Project Structure (high-level)

```text
src/
  main.tsx          # React entry point
  App.tsx           # Routes + main layout
  pages/
    DocPage.tsx     # /doc/:id page, passes docId to editor + sidebar
  components/
    CollabEditor.tsx  # Tiptap + Yjs + y-websocket integration
    Sidebar.tsx       # Comments / Versions tab UI
  store/
    store.ts          # Redux store
    uiSlice.ts        # Sidebar tab state (comments | versions)
```

Key pieces:

- **`CollabEditor.tsx`**
  - Creates a single `Y.Doc`
  - Connects to the y-websocket server via `WebsocketProvider`
  - Binds Yjs doc to Tiptap with the Collaboration extension
  - Shows connection + sync debug info

- **`Sidebar.tsx`**
  - Simple UI with two tabs: Comments / Versions
  - Uses Redux (`activeTab`) to track which is active

---

## 🧭 Possible Next Steps

Planned / nice-to-have features:

- 💬 **Real comments**:
  - Anchor comments to text ranges
  - Store threads in a shared Yjs structure
- 🕒 **Versions tab**:
  - Save “snapshots” of the document
  - Restore previous versions
- 👥 **Better presence**:
  - Show connected users (name, color)
  - Cursor positions and selection highlights
- 🔐 **Backend persistence**:
  - Save Yjs document state to a database
  - Reload server-side state when room connects

---

## 🧑‍💻 Author

**SyncScribe** is a personal project by Meenakshi Ratnawat,  
built to practice:

- advanced React patterns,
- real-time collaboration with CRDTs (Yjs),
- and clean state management with Redux Toolkit.