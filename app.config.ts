export default defineAppConfig({
  // App branding
  app: {
    name: "FileMan",
    description: "Internal File Sharing System",
    version: "1.0.0",
  },

  // UI theme configuration
  ui: {
    colors: {
      primary: "blue",
      neutral: "slate",
    },
    button: {
      defaultVariants: {
        color: "primary",
      },
    },
  },

  // Navigation configuration
  navigation: {
    sidebar: [
      {
        label: "Dashboard",
        icon: "i-heroicons-home",
        to: "/dashboard",
      },
      {
        label: "My Files",
        icon: "i-heroicons-folder",
        to: "/dashboard/files",
      },
      {
        label: "Shared With Me",
        icon: "i-heroicons-users",
        to: "/dashboard/shared",
      },
      {
        label: "Recent",
        icon: "i-heroicons-clock",
        to: "/dashboard/recent",
      },
      {
        label: "Trash",
        icon: "i-heroicons-trash",
        to: "/dashboard/trash",
      },
    ],
  },
});
