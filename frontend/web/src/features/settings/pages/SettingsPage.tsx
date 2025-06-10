import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ErrorDisplay,
  Layout,
  NotFoundError,
  SidebarLayout,
  Spinner,
} from "@/common/components";
import { routes } from "@/common/constants/routes";
import { SettingsSection } from "../types";
import { useMyProfile } from "../../profiles/hooks/useProfile";
import ProfileSettings from "../components/ProfileSettings";
import SecuritySettings from "../components/SecuritySettings";
import { BillingSettings } from "../components/BillingSettings";
import PortfolioSettings from "../components/PortfolioSettings";
import SettingsSidebar from "../components/SettingsSidebar";
import { useRequiredUser } from "@/common/contexts";

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>(
    SettingsSection.Profile
  );
  const navigate = useNavigate();
  const { user } = useRequiredUser();
  const { data: profile, isLoading, error, refetch } = useMyProfile();

  if (isLoading) {
    return (
      <Layout>
        <SidebarLayout sidebar={[]} wide>
          <Spinner message="Loading profile..." size="lg" />
        </SidebarLayout>
      </Layout>
    );
  }

  if (error) {
    const errorDisplay =
      error instanceof NotFoundError ? (
        <ErrorDisplay
          error={error}
          title="Failed to load profile"
          onRedirect={() => {
            navigate(routes.public.home);
          }}
        />
      ) : (
        <ErrorDisplay
          error={error}
          title="Failed to load profile"
          onRetry={refetch}
        />
      );

    return (
      <Layout>
        <SidebarLayout sidebar={[]} wide>
          {errorDisplay}
        </SidebarLayout>
      </Layout>
    );
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case SettingsSection.Profile:
        return <ProfileSettings initialData={profile} />;
      case SettingsSection.Security:
        return (
          <SecuritySettings
            initialData={{
              email: user.email,
              repeatPassword: "",
              currentPassword: "",
              newPassword: "",
            }}
          />
        );
      case SettingsSection.Billing:
        return <BillingSettings />;
      case SettingsSection.Portfolio:
        return <PortfolioSettings initialData={profile?.educator} />;
      default:
        return <ProfileSettings initialData={profile} />;
    }
  };

  return (
    <Layout>
      <SidebarLayout
        sidebarWidth="sm"
        sidebar={
          <SettingsSidebar
            hasEducatorProfile={!!profile?.educator}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        }
      >
        {renderSectionContent()}
      </SidebarLayout>
    </Layout>
  );
};

export default SettingsPage;
