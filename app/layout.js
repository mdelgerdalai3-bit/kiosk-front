import "./globals.css";

export const metadata = {
  title: "ОЮУНЛАГ — Гадаадад суралцагчид",
  description: "Оюунлаг сургуулийн төгсөгчид дэлхий дахинд суралцаж буй интерактив 3D глоб",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
