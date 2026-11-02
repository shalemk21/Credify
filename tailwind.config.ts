import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2A5B",
          primary: "#0B2A5B",
          deep: "#0A2147",
          dark: "#081A38",
          light: "#183F7D",
        },
        orange: {
          DEFAULT: "#F47B20",
          accent: "#F47B20",
          hover: "#E0680D",
          light: "#FFF4ED",
        },
        green: {
          DEFAULT: "#2E9E5B",
          success: "#2E9E5B",
          tint: "#E8F6EE",
          dark: "#238048",
        },
        badge: {
          gold: "#F5A623",
          goldBg: "#FEF6E7",
          silver: "#8A94A6",
          silverBg: "#F0F2F5",
          bronze: "#B87333",
          bronzeBg: "#FDF4EE",
        },
        canvas: {
          DEFAULT: "#F4F7FB",
          card: "#FFFFFF",
          muted: "#EBF1F7",
        },
        content: {
          primary: "#0F1B33",
          secondary: "#5B6B84",
          muted: "#94A3B8",
        },
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 42, 91, 0.06), 0 2px 6px -1px rgba(11, 42, 91, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(11, 42, 91, 0.12), 0 4px 10px -2px rgba(11, 42, 91, 0.06)',
        'button': '0 4px 14px 0 rgba(244, 123, 32, 0.35)',
        'button-navy': '0 4px 14px 0 rgba(11, 42, 91, 0.3)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
