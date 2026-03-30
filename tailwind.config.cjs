/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 60px -24px rgba(15, 23, 42, 0.22)",
      },
      backgroundImage: {
        "app-grid":
          "radial-gradient(circle at top left, rgba(59, 130, 246, 0.10), transparent 28%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 24%), linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92))",
      },
      fontFamily: {
        sans: [
          "SF Pro Text",
          "SF Pro Display",
          "Segoe UI",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif"
        ],
      },
    },
  },
  plugins: [],
};
