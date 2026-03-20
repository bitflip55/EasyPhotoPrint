import { Sidebar } from "@/ui/components/Sidebar";
import { PreviewStage } from "@/ui/components/PreviewStage";

export function App() {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <Sidebar />
      </aside>
      <main className="app-shell__main">
        <PreviewStage />
      </main>
    </div>
  );
}
