import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF7F3",
        ink: "#000000",
        card: "#FFFFFF",
        "card-foreground": "#000000",
        popover: "#FFFFFF",
        "popover-foreground": "#000000",
        primary: "#3DDC97",
        "primary-foreground": "#000000",
        secondary: "#FFFFFF",
        muted: "#ECE7DC",
        "muted-foreground": "#555555",
        "accent-soft": "#E4FAF0",
        destructive: "#E5484D",
        "destructive-foreground": "#000000",
        "danger-ink": "#B91C1C",
        border: "#000000",
        ring: "#000000",
        success: "#16A34A",
        warning: "#F5A623",
      },
      fontFamily: {
        display: ['"Montserrat"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "Consolas", "monospace"],
        body: ["system-ui", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        "2xl": "12px",
        brutal: "6px",
      },
      borderWidth: {
        DEFAULT: "2px",
        brutal: "2px",
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0 #000",
        brutal: "4px 4px 0 #000",
      },
    },
  },
} satisfies Config;