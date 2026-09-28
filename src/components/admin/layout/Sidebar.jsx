import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import logo from "../../../assets/Logo.png";

const LOGO_SRC = logo;

export const DesktopSidebar = ({ collapsed, onToggle }) => (
  <aside
    className={
      "sticky top-0 hidden h-screen shrink-0 flex-col bg-white transition-[width] duration-200 md:flex " +
      "border-r border-zs-beigeLine " +
      (collapsed ? "w-[80px]" : "w-64")
    }
  >
    <div className={"flex items-center gap-2.5 px-5 py-6 " + (collapsed ? "justify-center" : "")}>
      <img src={LOGO_SRC} alt="ZeeScents logo" className="h-9 w-9 shrink-0 rounded-xl object-contain invert" />
      {!collapsed && (
        <div className="leading-tight">
          <p className="zs-display text-[15px] font-bold text-zs-charcoal">ZeeScents</p>
          <p className="text-[11px] text-zs-charcoal/45">Admin workspace</p>
        </div>
      )}
    </div>

    <SidebarNav collapsed={collapsed} />

    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="mx-4 mb-5 flex items-center justify-center gap-2 rounded-xl border border-zs-beigeLine py-2.5 text-xs font-semibold text-zs-charcoal/55 transition-colors hover:border-zs-gold/40 hover:bg-zs-gold/5 hover:text-zs-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zs-gold"
    >
      {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Collapse</>}
    </button>
  </aside>
);

export const MobileDrawer = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="absolute inset-0 bg-zs-charcoal/50" onClick={onClose} />
      <div className="relative flex h-full w-72 max-w-[80%] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zs-beigeLine px-5 py-6">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_SRC} alt="ZeeScents logo" className="h-9 w-9 shrink-0 rounded-xl object-contain invert" />
            <div className="leading-tight">
              <p className="zs-display text-[15px] font-bold text-zs-charcoal">ZeeScents</p>
              <p className="text-[11px] text-zs-charcoal/45">Admin workspace</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full p-1.5 text-zs-charcoal/60 transition-colors hover:bg-zs-beige hover:text-zs-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zs-gold"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarNav onNavigate={onClose} />
      </div>
    </div>
  );
};