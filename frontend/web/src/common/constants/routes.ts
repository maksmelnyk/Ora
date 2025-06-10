export interface DynamicRoute {
  path: string;
  to: (param: string) => string;
}

interface PublicRoutes {
  home: string;
  about: string;
  help: string;
  terms: string;
  search: string;
  notFound: string;
  serverError: string;
}

interface AuthRoutes {
  signIn: string;
  signUp: string;
  forgotPassword: string;
  resetPassword: string;
}

interface ProfileRoutes {
  myProfile: string;
  profile: DynamicRoute;
}

interface ProductRoutes {
  list: string;
  details: DynamicRoute;
  create: string;
  edit: DynamicRoute;
  checkout: DynamicRoute;
}

interface EducatorRoutes {
  list: string;
  application: string;
  calendar: DynamicRoute;
}

interface CommunicationRoutes {
  messages: string;
  conversation: DynamicRoute;
  videoSession: DynamicRoute;
}

interface SettingsRoutes {
  settings: string;
}

export interface AppRoutes {
  public: PublicRoutes;
  auth: AuthRoutes;
  profiles: ProfileRoutes;
  educators: EducatorRoutes;
  products: ProductRoutes;
  communication: CommunicationRoutes;
  settings: SettingsRoutes;
}

export const routes: AppRoutes = {
  public: {
    home: "/",
    about: "/about",
    help: "/help",
    terms: "/terms",
    search: "/search",
    notFound: "/404",
    serverError: "/500",
  },

  auth: {
    signIn: "/signin",
    signUp: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },

  profiles: {
    myProfile: "/profiles/me",
    profile: {
      path: "/profiles/:userId",
      to: (userId: string) => `/profiles/${userId}`,
    },
  },

  products: {
    list: "/products",
    details: {
      path: "/products/:productId",
      to: (productId: string) => `/products/${productId}`,
    },
    create: "/products/create",
    edit: {
      path: "/products/:productId/edit",
      to: (productId: string) => `/products/${productId}/edit`,
    },
    checkout: {
      path: "/products/:productId/checkout",
      to: (productId: string) => `/products/${productId}/checkout`,
    },
  },

  educators: {
    list: "/educators",
    application: "/become-educator",
    calendar: {
      path: "/instructor/calendar/:educatorId",
      to: (educatorId: string) => `/instructor/calendar/${educatorId}`,
    },
  },

  communication: {
    messages: "/messages",
    conversation: {
      path: "/messages/:conversationId",
      to: (conversationId: string) => `/messages/${conversationId}`,
    },
    videoSession: {
      path: "/session/:sessionId",
      to: (sessionId: string) => `/session/${sessionId}`,
    },
  },

  settings: {
    settings: "/settings",
  },
};
