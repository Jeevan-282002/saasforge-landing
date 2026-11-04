export interface SiteConfig {
  name: string;
  tagline: string;
  headline: string;
  subheadline: string;
  supportingMessage: string;
  description: string;
  url: string;
  ogImage: string;
  author: {
    name: string;
    github: string;
    profileUrl: string;
  };
  links: {
    githubRepo: string;
    landingRepo: string;
    githubIssues: string;
    docs: {
      readme: string;
      architecture: string;
      multiTenancy: string;
      subscriptionsQuotas: string;
      developerGuide: string;
      taskflowGuide: string;
      securityAudit: string;
      productionReadiness: string;
      commercialChecklist: string;
      testReport: string;
    };
  };
  testingMetrics: {
    configA: {
      passed: number;
      skipped: number;
      label: string;
    };
    configB: {
      passed: number;
      skipped: number;
      label: string;
    };
    freshMigrations: {
      coreTables: number;
      demoTables: number;
    };
    isolationChecks: {
      passed: number;
      total: number;
    };
    databaseRouterChecks: {
      passed: number;
      total: number;
    };
    codeQuality: {
      tool: string;
      errors: number;
    };
  };
  tally: {
    defaultFormUrl: string;
  };
  navigation: Array<{
    name: string;
    href: string;
  }>;
}

export const siteConfig: SiteConfig = {
  name: "Django SaaS Foundation",
  tagline: "Build Your SaaS Product. Not Your SaaS Infrastructure.",
  headline: "Build Your SaaS Product. Not Your SaaS Infrastructure.",
  subheadline: "A reusable Django SaaS foundation with multi-tenancy, RBAC, organization management, audit logging and subscription infrastructure already implemented.",
  supportingMessage: "Stop rebuilding common SaaS infrastructure. Start building the product that matters.",
  description: "A reusable, production-tested Django SaaS foundation featuring database-per-tenant isolation, 4-tier RBAC, organization management, audit logging, and subscription infrastructure.",
  url: "https://saasforge-landing.pages.dev",
  ogImage: "/og-image.svg",
  author: {
    name: "Jeevan-282002",
    github: "Jeevan-282002",
    profileUrl: "https://github.com/Jeevan-282002",
  },
  links: {
    githubRepo: "https://github.com/Jeevan-282002/Saas-Boilerplate",
    landingRepo: "https://github.com/Jeevan-282002/saasforge-landing",
    githubIssues: "https://github.com/Jeevan-282002/Saas-Boilerplate/issues",
    docs: {
      readme: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/README.md",
      architecture: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/architecture.md",
      multiTenancy: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/multi-tenancy.md",
      subscriptionsQuotas: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/subscriptions-quotas.md",
      developerGuide: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/developer-guide.md",
      taskflowGuide: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/how_to_delete_or_replace_taskflow.md",
      securityAudit: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/SECURITY_AUDIT.md",
      productionReadiness: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/PRODUCTION_READINESS.md",
      commercialChecklist: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/docs/COMMERCIAL_RELEASE_CHECKLIST.md",
      testReport: "https://github.com/Jeevan-282002/Saas-Boilerplate/blob/main/TEST_REPORT.md",
    },
  },
  testingMetrics: {
    configA: {
      passed: 152,
      skipped: 2,
      label: "Full Suite (PostgreSQL Integration & Live Isolation)",
    },
    configB: {
      passed: 105,
      skipped: 11,
      label: "Foundation Only (Zero Demo Apps Configured)",
    },
    freshMigrations: {
      coreTables: 20,
      demoTables: 0,
    },
    isolationChecks: {
      passed: 9,
      total: 9,
    },
    databaseRouterChecks: {
      passed: 3,
      total: 3,
    },
    codeQuality: {
      tool: "Ruff Linter & Formatter",
      errors: 0,
    },
  },
  tally: {
    defaultFormUrl: (typeof process !== "undefined" && process.env?.PUBLIC_TALLY_FORM_URL) || (import.meta as any).env?.PUBLIC_TALLY_FORM_URL || "https://tally.so/r/laBxAB",
  },
  navigation: [
    { name: "Features", href: "#features" },
    { name: "Architecture", href: "#architecture" },
    { name: "Testing", href: "#testing" },
    { name: "Developer Experience", href: "#developer-experience" },
    { name: "Documentation", href: "#documentation" },
    { name: "FAQ", href: "#faq" },
  ],
};

