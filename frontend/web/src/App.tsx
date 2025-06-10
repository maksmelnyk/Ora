import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./common/constants/routes";
import { AuthProvider } from "./common/contexts/AuthContext";
import { KeycloakProvider } from "./common/contexts/KeycloakContext";
import { UserProvider } from "./common/contexts/UserContext";
import HomePage from "./features/home/HomePage";
import SignUpPage from "./features/auth/pages/SignUpPage";
import ProductCatalogPage from "./features/products/pages/ProductCatalogPage";
import ProductDetailsPage from "./features/products/pages/ProductDetailsPage";
import ProfilePage from "./features/profiles/pages/ProfilePage";
import InitialAuthLoader from "./common/components/shell/InitialAuthLoader";
import SettingsPage from "./features/settings/pages/SettingsPage";
import AuthGuard from "./common/components/navigation/AuthGuard";
import ScrollToTop from "./common/components/navigation/ScrollToTop";
import ProductEditPage from "./features/products/pages/ProductEditPage";
import { EducatorApplicationPage } from "./features/educators/pages/EducatorApplicationPage";
import PaymentPage from "./features/payments/pages/PaymentPage";
import { ROLES } from "./common/constants/roles";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        {/* <ThemeProvider> */}
        <KeycloakProvider>
          <AuthProvider>
            <UserProvider>
              <InitialAuthLoader>
                {/* <NotificationProvider> */}
                <Routes>
                  <Route path={routes.public.home} element={<HomePage />} />
                  <Route path={routes.auth.signUp} element={<SignUpPage />} />
                  <Route
                    path={routes.products.list}
                    element={<ProductCatalogPage />}
                  />
                  <Route
                    path={routes.products.details.path}
                    element={<ProductDetailsPage />}
                  />
                  <Route
                    path={routes.profiles.profile.path}
                    element={<ProfilePage />}
                  />
                  <Route element={<AuthGuard />}>
                    <Route
                      path={routes.educators.application}
                      element={<EducatorApplicationPage />}
                    />
                    <Route
                      path={routes.profiles.myProfile}
                      element={<ProfilePage />}
                    />
                    <Route
                      path={routes.settings.settings}
                      element={<SettingsPage />}
                    />
                    <Route
                      path={routes.products.checkout.path}
                      element={<PaymentPage />}
                    />
                  </Route>

                  <Route
                    element={<AuthGuard requiredRoles={[ROLES.EDUCATOR]} />}
                  >
                    <Route
                      path={routes.products.create}
                      element={<ProductEditPage />}
                    />
                  </Route>
                </Routes>
              </InitialAuthLoader>
            </UserProvider>
            {/* </NotificationProvider> */}
          </AuthProvider>
        </KeycloakProvider>
        {/* </ThemeProvider> */}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
