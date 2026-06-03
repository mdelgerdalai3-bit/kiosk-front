import Globe from "./globe";
import { COUNTRIES } from "../data";

export default function Home() {
  const total = COUNTRIES.reduce((a, c) => a + c.n, 0);
  return (
    <main className="page">
      <div className="brand">
        {/* Лого нь public/ дотор байрлана */}
        <img className="logo" src="/logo.png" alt="ОЮУНЛАГ" />
        <div>
          <h1>ОЮУНЛАГ СУРГУУЛЬ</h1>
          <span>ГАДААДАД СУРАЛЦАГЧИД</span>
        </div>
      </div>

      <p className="subtitle">
        Манай төгсөгчид <b>{total}</b> сурагч <b>{COUNTRIES.length}</b> улсад суралцаж байна
      </p>

      <Globe />

      <div className="legend">
        {COUNTRIES.map((c) => (
          <div className="country" key={c.name}>
            <span className="cf">{c.flag}</span>
            <div className="cn">
              <b>{c.name}</b>
              <small>{c.city}</small>
            </div>
            <span className="cc">{c.n}</span>
          </div>
        ))}
      </div>

      <p className="foot">
        Powered by <a href="https://github.com/shuding/cobe" target="_blank" rel="noreferrer">COBE</a> · Next.js · ОЮУНЛАГ Мэдээллийн төв
      </p>
    </main>
  );
}
