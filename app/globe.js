"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { COUNTRIES, HOME, BRAND } from "../data";

export default function Globe() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const pinRefs = useRef([]);
  // эргэлт/чирэлт/zoom-ийн төлөв
  const st = useRef({ phi: 0, theta: 0.25, drag: 0, dragY: 0, zoom: 1 });
  const pointer = useRef(null);
  const pointerY = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let width = wrapRef.current?.offsetWidth || 600;
    const onResize = () => { width = wrapRef.current?.offsetWidth || 600; };
    window.addEventListener("resize", onResize);

    // эхэндээ Улаанбаатар руу харуулна
    const PHI0 = -HOME.loc[1] * Math.PI / 180;
    st.current.phi = PHI0;

    const markers = COUNTRIES.map((c) => ({
      location: c.loc,
      size: Math.min(0.03 + c.n * 0.004, 0.09),
    }));
    markers.push({ location: HOME.loc, size: 0.1 });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: PHI0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: BRAND.base,
      markerColor: BRAND.pink,
      glowColor: BRAND.blue,
      markers,
      onRender: (state) => {
        const s = st.current;
        if (pointer.current === null) s.phi += 0.004; // чирэхгүй үед автоматаар эргэнэ
        const phi = s.phi + s.drag;
        const theta = Math.max(-0.6, Math.min(0.6, s.theta + s.dragY));
        state.phi = phi;
        state.theta = theta;
        state.width = width * dpr;
        state.height = width * dpr;
        positionPins(phi, theta, width);
      },
    });

    // зөөлөн гарч ирэх
    canvas.style.opacity = "0";
    requestAnimationFrame(() => {
      canvas.style.transition = "opacity 1.2s ease";
      canvas.style.opacity = "1";
    });

    // ── Чирж эргүүлэх ──
    const down = (e) => {
      pointer.current = e.clientX;
      pointerY.current = e.clientY;
      canvas.style.cursor = "grabbing";
    };
    const move = (e) => {
      if (pointer.current === null) return;
      const cx = e.clientX ?? e.touches?.[0]?.clientX;
      const cy = e.clientY ?? e.touches?.[0]?.clientY;
      st.current.drag += (cx - pointer.current) * 0.006;
      st.current.dragY += (cy - pointerY.current) * 0.006;
      pointer.current = cx;
      pointerY.current = cy;
    };
    const up = () => {
      pointer.current = null;
      pointerY.current = null;
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    function positionPins(phi, theta, w) {
      const R = w / 2;
      for (let i = 0; i < COUNTRIES.length; i++) {
        const el = pinRefs.current[i];
        if (!el) continue;
        const c = COUNTRIES[i];
        const lat = (c.loc[0] * Math.PI) / 180;
        const lng = (c.loc[1] * Math.PI) / 180;
        const x = Math.cos(lat) * Math.sin(lng + phi);
        const y = Math.sin(lat);
        const z = Math.cos(lat) * Math.cos(lng + phi);
        // theta хазайлт (X тэнхлэгээр)
        const y2 = y * Math.cos(theta) - z * Math.sin(theta);
        const z2 = y * Math.sin(theta) + z * Math.cos(theta);
        const sx = R + x * R * 0.92;
        const sy = R - y2 * R * 0.92;
        const vis = z2 > 0.12;
        el.style.transform = `translate(${sx}px, ${sy}px)`;
        el.style.opacity = vis ? String(Math.min(1, (z2 - 0.12) * 3)) : "0";
        el.style.zIndex = vis ? String(10 + Math.round(z2 * 10)) : "0";
      }
    }

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  function applyZoom() {
    if (innerRef.current)
      innerRef.current.style.transform = `scale(${st.current.zoom})`;
  }
  const zoomBy = (f) => {
    st.current.zoom = Math.max(1, Math.min(2.4, st.current.zoom * f));
    applyZoom();
  };
  const zoomReset = () => {
    st.current.zoom = 1;
    st.current.drag = 0;
    st.current.dragY = 0;
    applyZoom();
  };
  const onWheel = (e) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.1 : 0.9);
  };

  return (
    <>
      <div className="globe-stage" ref={wrapRef} onWheel={onWheel}>
        <div className="globe-inner" ref={innerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
          <canvas ref={canvasRef} />
          {COUNTRIES.map((c, i) => (
            <div className="pin" key={c.name} ref={(el) => (pinRefs.current[i] = el)}>
              <div className="polaroid">
                <span className="badge">{c.n}</span>
                <div className="pic">{c.flag}</div>
                <div className="cap">{c.name}<small>{c.city}</small></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <button onClick={() => zoomBy(1.3)} title="Томруулах">＋</button>
        <button onClick={() => zoomBy(0.77)} title="Жижигрүүлэх">－</button>
        <button onClick={zoomReset} title="Сэргээх">⟳</button>
      </div>
    </>
  );
}
