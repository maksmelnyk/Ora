import { Sidebar, SidebarSection } from "@/common/components";
import { cn } from "@/common/utils";
import { SettingsItem, SettingsSection } from "../types";

interface SettingsSidebarProps {
  hasEducatorProfile: boolean;
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const getSettingsItems = (hasEducatorProfile: boolean): SettingsItem[] => [
  { id: SettingsSection.Profile, label: "Profile" },
  { id: SettingsSection.Security, label: "Security" },
  { id: SettingsSection.Billing, label: "Payment" },
  ...(hasEducatorProfile
    ? [{ id: SettingsSection.Portfolio, label: "Portfolio" }]
    : []),
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
  hasEducatorProfile,
}) => {
  const settingsItems = getSettingsItems(hasEducatorProfile);

  return (
    <Sidebar>
      {settingsItems.map((item) => {
        const isActive = activeSection === item.id;

        return (
          <SidebarSection
            key={item.id}
            title=""
            defaultOpen={true}
            collapsible={false}
          >
            <button
              onClick={() => onSectionChange(item.id)}
              className={cn("text-ora-gray focus:outline-none")}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="ora-subheading">{item.label}</span>
            </button>
          </SidebarSection>
        );
      })}
    </Sidebar>
  );
};

export default SettingsSidebar;
