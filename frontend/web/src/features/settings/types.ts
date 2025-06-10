export enum SettingsSection {
  Profile = "profile",
  Security = "security",
  Billing = "billing",
  Portfolio = "portfolio",
}

export interface SettingsItem {
  id: SettingsSection;
  label: string;
}

export interface SecurityData {
  email: string;
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
}
