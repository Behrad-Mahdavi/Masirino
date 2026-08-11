import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(marketing)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(auth)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(dashboard)/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/tests/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/results/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#F2FAF9",
          100: "#E4F4F2",
          200: "#D6EEEB",
          500: "#58BDAF",
          600: "#52B8AB",
          700: "#347E75",
          800: "#2E7068",
        },
        navy: {
          50: "#F4F5FB",
          100: "#D7DBF1",
          600: "#202A5A",
          700: "#21295A",
        },
        pink: {
          50: "#FEFAFB",
          100: "#FCE8EF",
          500: "#E0195B",
          700: "#CE1754",
        },
        amber: {
          50: "#FFFDFA",
          100: "#FEF7EC",
          300: "#FFD641",
          500: "#F8A41D",
          600: "#E49007",
          800: "#A56216",
        },
        ink: {
          500: "#525252",
          700: "#3D3B3A",
          800: "#333230",
          900: "#292827",
        },
        neutral: {
          0: "#FFFFFF",
          25: "#FCFCFC",
          50: "#F6F6F6",
          100: "#EDECEC",
          300: "#D0CFCD",
        },
      },
      fontFamily: {
        sans: ["IRANSansXFaNum", "IRANSansX", "Vazirmatn", "sans-serif"],
        numeric: ["IRANSansXFaNum", "IRANSansX", "Vazirmatn", "sans-serif"],
      },
      borderRadius: {
        xs: "3px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "22px",
        "3xl": "24px",
        leaf: "12px 0 12px 0",
        "leaf-inverse": "0 12px 0 12px",
      },
      borderWidth: {
        hairline: "1px",
        DEFAULT: "1px",
        thick: "2px",
        heavy: "3px",
      },
      boxShadow: {
        "flat-sm": "-3px 3px 0 0 var(--shadow-color, #292827)",
        "flat-md": "-4px 4px 0 0 var(--shadow-color, #292827)",
        "flat-lg": "-6px 6px 0 0 var(--shadow-color, #292827)",
        "flat-xl": "-8px 8px 0 0 var(--shadow-color, #292827)",
        "overlay": "0 8px 24px 0 rgba(0,0,0,0.19)",
      },
      maxWidth: {
        canvas: "1440px",
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
