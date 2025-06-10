import React, { useState, ReactNode } from "react";
import { cn } from "../../utils";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTabId,
  className,
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? items[0]?.id);
  const activeTab = items.find((tab) => tab.id === activeTabId);

  return (
    <div className={cn(className)}>
      <div className="mb-6 border-b border-ora-navy">
        <nav
          className="flex space-x-1 bg-ora-gray-50 rounded-lg w-fit"
          aria-label="Tabs"
        >
          {items.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-t-md ora-transition",
                  "focus:outline-none",
                  isActive
                    ? "bg-ora-navy text-white shadow-sm"
                    : "text-ora-gray hover:text-ora-navy hover:bg-white/50"
                )}
                aria-selected={isActive}
                role="tab"
                id={`tab-${tab.id}`}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div
        id={`panel-${activeTabId}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTabId}`}
        tabIndex={0}
        className="focus:outline-none"
      >
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;
