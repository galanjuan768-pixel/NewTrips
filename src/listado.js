/* global React, Card, Icon, Ph, Sticker, useReveal, getPriceInfo, formatPrice */
const {
  useState: useStateL,
  useMemo: useMemoL,
  useEffect: useEffectL,
  useRef: useRefL
} = React;

// ============ HELPERS ============
function priceARS(p) {
  const pi = getPriceInfo(p);
  return pi.current * (pi.currency === 'USD' ? 1100 : 1);
}
function getPopularityScore(p) {
  let s = 0;
  if (p.sellos?.includes('ultimos-cupos')) s += 35;
  if (p.destacado) s += 30;
  if (p.sellos?.includes('promo-2x1')) s += 22;
  if (p.sellos?.includes('tarifa-promo')) s += 20;
  if (p.sellos?.includes('family-plan')) s += 12;
  if (p.precio2do) s += 12;
  if (p.salidas?.length >= 3) s += 8;
  // Boost destinos icónicos
  const top = ['cataratas', 'bariloche', 'mendoza', 'camboriu', 'europa', 'salta'];
  if (top.includes(p.foto)) s += 10;
  return s;
}
function discountPct(p) {
  const pi = getPriceInfo(p);
  if (!pi.old) return null;
  const pct = Math.round((1 - pi.current / pi.old) * 100);
  return pct > 4 ? pct : null;
}

// ============ SISTEMA DE BADGES DE PROMOCIÓN (7 tipos) ============
// Devuelve la lista ordenada de badges a mostrar según los datos del paquete.
//  A pago-contado · B 2do-pax · C oferta · D promo (puntual)
//  E super-promo-low-cost · F últimos lugares · G family plan
function familyTip(fp) {
  const parts = [];
  if (fp.menorHasta5) parts.push('menores hasta 5 años: ' + formatPrice(fp.menorHasta5, 'ARS'));
  if (fp.menor6a10) parts.push('de 6 a 10 años: ' + formatPrice(fp.menor6a10, 'ARS'));
  const lista = parts.length ? parts.join(' · ') + '. ' : '';
  return 'Family Plan · tarifa reducida para ' + lista + 'Aplica compartiendo habitación con 2 adultos.';
}
function getPromoFlags(pkg) {
  const s = pkg.sellos || [];
  const flags = [];

  // F — Urgencia (último(s) lugar/cupos) — se liquidan con descuento
  if (s.includes('ultimos-cupos')) {
    flags.push({
      cls: 'urgent',
      text: pkg.urgenciaTexto || 'Últimos cupos',
      sub: 'Con descuento'
    });
  }

  // B — 2do pasajero con descuento (sin precio tachado)
  if (s.includes('promo-2x1') || s.includes('promo-2do-30')) {
    const pct = s.includes('promo-2do-30') ? 30 : 50;
    flags.push({
      cls: '2do',
      text: '2do PAX ' + pct + '% OFF',
      sub: 'Promo pareja'
    });
  }

  // G — Family Plan (requiere objeto familyPlan con tarifas de menores)
  if (s.includes('family-plan') && pkg.familyPlan) {
    flags.push({
      cls: 'family',
      text: 'FAMILY PLAN',
      tip: familyTip(pkg.familyPlan)
    });
  }

  // E — Super Promo Low Cost
  if (s.includes('low-cost')) {
    flags.push({
      cls: 'lowcost',
      text: 'SUPER PROMO LOW COST'
    });
  }

  // D — Promo puntual (tarifa promo sin comparación de regular)
  if (s.includes('promo-puntual')) {
    flags.push({
      cls: 'promo-puntual',
      text: 'PROMO'
    });
  }

  // A / C — Pago contado u Oferta (con precio regular tachado)
  if (s.includes('tarifa-promo')) {
    const pct = discountPct(pkg);
    const oferta = s.includes('oferta');
    flags.push({
      cls: oferta ? 'oferta' : 'promo',
      text: (oferta ? 'OFERTA' : 'PAGO CONTADO') + (pct ? ' −' + pct + '%' : '')
    });
  }
  return flags;
}

// Tipos de promo para la barra de filtros (id = cls del badge)
const PROMO_FILTERS = [{
  id: 'promo',
  label: 'Pago contado',
  color: '#ED1C24'
}, {
  id: '2do',
  label: '2do PAX OFF',
  color: '#C8911F'
}, {
  id: 'oferta',
  label: 'Oferta',
  color: '#D24A1F'
}, {
  id: 'promo-puntual',
  label: 'Promo',
  color: '#0F6E3F'
}, {
  id: 'lowcost',
  label: 'Super Promo Low Cost',
  color: '#C81E6E'
}, {
  id: 'urgent',
  label: 'Últimos lugares',
  color: '#ED1C24'
}, {
  id: 'family',
  label: 'Family Plan',
  color: '#2F8FB5'
}];

// Tipos de promo activos en un paquete (deriva de los badges)
function pkgPromoTypes(pkg) {
  return getPromoFlags(pkg).map(f => f.cls);
}
function countCuotas(p) {
  return 6; // simplificado por defecto. Pueden venir del paquete si quisieran
}
function transportLabel(t) {
  return t === 'aereo' ? 'Avión' : 'Bus';
}

// Destinos a los que pertenece un paquete (multi-destino).
// Si no declara `destinos`, usa su destino principal `foto`.
function pkgDestinos(p) {
  const list = p.destinos && p.destinos.length ? p.destinos.slice() : [];
  if (p.foto && !list.includes(p.foto)) list.push(p.foto);
  return list;
}
const DIFERENCIALES = [{
  id: 'viaja-solo',
  label: 'Viajás solo · igual tarifa',
  icon: '👤'
}, {
  id: 'family-plan',
  label: 'Family Plan',
  icon: '👨‍👩‍👧'
}, {
  id: 'piscina-climatizada',
  label: 'Piscina climatizada',
  icon: '🏊'
}, {
  id: 'cupos-confirmados',
  label: 'Cupos confirmados',
  icon: '✓'
}, {
  id: 'tarifa-promo',
  label: 'Promo pago contado',
  icon: '🏷'
}, {
  id: 'ultimos-cupos',
  label: 'Últimos cupos',
  icon: '🔥'
}];
const MESES_OPCIONES = ['Mayo 26', 'Junio 26', 'Julio 26', 'Agosto 26', 'Septiembre 26', 'Octubre 26', 'Noviembre 26', 'Diciembre 26', 'Fiestas', 'Enero 27', 'Febrero 27', 'Marzo 27', 'Abril 27'];
const PRECIO_RANGOS = [{
  id: 'todos',
  label: 'Cualquier precio',
  max: Infinity
}, {
  id: '300',
  label: 'Hasta $300.000',
  max: 300000
}, {
  id: '600',
  label: '$300.000 – $600.000',
  min: 300000,
  max: 600000
}, {
  id: '1000',
  label: '$600.000 – $1.000.000',
  min: 600000,
  max: 1000000
}, {
  id: 'plus',
  label: 'Más de $1.000.000',
  min: 1000000,
  max: Infinity
}];

// ============ NEW CARD ============
function PackageCardV2({
  pkg,
  onClick,
  isFav,
  onToggleFav,
  highlighted
}) {
  const price = getPriceInfo(pkg);
  const dpct = discountPct(pkg);
  const sellos = pkg.sellos || [];
  const salidas = pkg.salidas || [];
  const cuotas = countCuotas(pkg);
  const promo2doPct = sellos.includes('promo-2do-30') ? 30 : sellos.includes('promo-2x1') ? 50 : null;
  return /*#__PURE__*/React.createElement("article", {
    className: `pkg-card ${highlighted ? 'is-highlighted' : ''}`,
    onClick: () => onClick(pkg),
    role: "button",
    tabIndex: 0,
    onKeyDown: e => {
      if (e.key === 'Enter') onClick(pkg);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pkg-media"
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: pkg.foto,
    label: pkg.destino
  }), /*#__PURE__*/React.createElement("div", {
    className: "pkg-top-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pkg-flags"
  }, getPromoFlags(pkg).map((f, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: 'pkg-flag pkg-flag--' + f.cls,
    title: f.tip || undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "pkg-flag-text"
  }, f.text), f.sub && /*#__PURE__*/React.createElement("span", {
    className: "pkg-flag-sub"
  }, f.sub)))), /*#__PURE__*/React.createElement("button", {
    className: `pkg-fav ${isFav ? 'is-fav' : ''}`,
    onClick: e => {
      e.stopPropagation();
      onToggleFav(pkg.id);
    },
    "aria-label": isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: isFav ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 21s-7-4.3-7-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 21 11c0 5.7-7 10-7 10z",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pkg-transport"
  }, pkg.transporte === 'aereo' ? /*#__PURE__*/React.createElement(Icon.Plane, null) : /*#__PURE__*/React.createElement(Icon.Bus, null), /*#__PURE__*/React.createElement("span", null, transportLabel(pkg.transporte)))), /*#__PURE__*/React.createElement("div", {
    className: "pkg-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pkg-where"
  }, pkg.destino), /*#__PURE__*/React.createElement("h3", {
    className: "pkg-title"
  }, pkg.titulo), /*#__PURE__*/React.createElement("div", {
    className: "pkg-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon.Clock, null), " ", pkg.duracion)), salidas.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pkg-salidas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pkg-salidas-head"
  }, /*#__PURE__*/React.createElement(Icon.Calendar, null), /*#__PURE__*/React.createElement("span", {
    className: "pkg-salidas-label"
  }, salidas.length === 1 ? 'Salida' : `${salidas.length} salidas`)), /*#__PURE__*/React.createElement("div", {
    className: "pkg-salidas-list"
  }, salidas.map((s, i) => {
    const cls = s.estado === 'ultimos-cupos' || s.estado === 'casi-completa' ? 'pkg-salida pkg-salida--urgent' : s.estado === 'cupos-confirmados' ? 'pkg-salida pkg-salida--confirmed' : 'pkg-salida';
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: cls
    }, s.fecha);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pkg-price-row"
  }, price.old && /*#__PURE__*/React.createElement("div", {
    className: "pkg-price-old-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pkg-price-old"
  }, formatPrice(price.old, price.currency)), dpct && /*#__PURE__*/React.createElement("span", {
    className: "pkg-price-off"
  }, "\u2212", dpct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "pkg-price-now"
  }, /*#__PURE__*/React.createElement("span", {
    className: `amount ${price.isPromo || price.old ? 'is-discount' : ''}`
  }, formatPrice(price.current, price.currency)), /*#__PURE__*/React.createElement("span", {
    className: "caption"
  }, "desde \xB7 ", pkg.base === 'doble' ? 'base doble' : 'por persona')), promo2doPct && pkg.precio2do && /*#__PURE__*/React.createElement("div", {
    className: "pkg-price-2do"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pkg-price-2do-label"
  }, "2do pax \u2212", promo2doPct, "%"), /*#__PURE__*/React.createElement("span", {
    className: "pkg-price-2do-amount"
  }, formatPrice(pkg.precio2do, 'ARS')))), /*#__PURE__*/React.createElement("div", {
    className: "pkg-cuotas"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pkg-cuotas-icon"
  }, "\uD83D\uDCB3"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Cuotas sin inter\xE9s"), " desde la reserva hasta 15 d\xEDas antes del viaje \xB7 sin tarjeta de cr\xE9dito")), /*#__PURE__*/React.createElement("div", {
    className: "pkg-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pkg-cta"
  }, "Ver detalle", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "13 5 19 12 13 19"
  }))))));
}

// ============ FILTERS DRAWER ============
function FiltersDrawer({
  open,
  onClose,
  transporte,
  setTransporte,
  diferenciales,
  setDiferenciales,
  meses,
  setMeses,
  precioRango,
  setPrecioRango,
  packages
}) {
  useEffectL(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  const toggle = (set, current, value) => {
    const arr = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    set(arr);
  };
  const limpiar = () => {
    setTransporte('todos');
    setDiferenciales([]);
    setMeses([]);
    setPrecioRango('todos');
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `fdr-backdrop ${open ? 'is-open' : ''}`,
    onClick: onClose,
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("aside", {
    className: `fdr ${open ? 'is-open' : ''}`,
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("header", {
    className: "fdr-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "fdr-eyebrow"
  }, "Refin\xE1 tu b\xFAsqueda"), /*#__PURE__*/React.createElement("h3", null, "Filtros")), /*#__PURE__*/React.createElement("button", {
    className: "fdr-close",
    onClick: onClose,
    "aria-label": "Cerrar"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    width: "20",
    height: "20"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "fdr-body"
  }, /*#__PURE__*/React.createElement("section", {
    className: "fdr-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Transporte"), /*#__PURE__*/React.createElement("div", {
    className: "fdr-pills"
  }, [['todos', 'Todos'], ['bus', '🚌  Bus'], ['aereo', '✈  Avión']].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: `fdr-pill ${transporte === v ? 'is-active' : ''}`,
    onClick: () => setTransporte(v)
  }, l, /*#__PURE__*/React.createElement("span", {
    className: "fdr-pill-count"
  }, v === 'todos' ? packages.length : packages.filter(p => p.transporte === v).length))))), /*#__PURE__*/React.createElement("section", {
    className: "fdr-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Diferenciales"), /*#__PURE__*/React.createElement("div", {
    className: "fdr-checks"
  }, DIFERENCIALES.map(d => /*#__PURE__*/React.createElement("label", {
    key: d.id,
    className: `fdr-check ${diferenciales.includes(d.id) ? 'is-checked' : ''}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: diferenciales.includes(d.id),
    onChange: () => toggle(setDiferenciales, diferenciales, d.id)
  }), /*#__PURE__*/React.createElement("span", {
    className: "fdr-check-box"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "5 13 9 17 19 7"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "fdr-check-label"
  }, /*#__PURE__*/React.createElement("span", null, d.icon), " ", d.label), /*#__PURE__*/React.createElement("span", {
    className: "fdr-check-count"
  }, packages.filter(p => p.sellos?.includes(d.id)).length))))), /*#__PURE__*/React.createElement("section", {
    className: "fdr-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Mes de salida"), /*#__PURE__*/React.createElement("div", {
    className: "fdr-chips"
  }, MESES_OPCIONES.map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    className: `fdr-chip ${meses.includes(m) ? 'is-active' : ''}`,
    onClick: () => toggle(setMeses, meses, m)
  }, m)))), /*#__PURE__*/React.createElement("section", {
    className: "fdr-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Rango de precio"), /*#__PURE__*/React.createElement("div", {
    className: "fdr-pills fdr-pills--block"
  }, PRECIO_RANGOS.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.id,
    className: `fdr-pill ${precioRango === r.id ? 'is-active' : ''}`,
    onClick: () => setPrecioRango(r.id)
  }, r.label))))), /*#__PURE__*/React.createElement("footer", {
    className: "fdr-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fdr-clear",
    onClick: limpiar
  }, "Limpiar todo"), /*#__PURE__*/React.createElement("button", {
    className: "fdr-apply",
    onClick: onClose
  }, "Aplicar filtros"))));
}

// ============ MAP VIEW ============
const MAP_POINTS = {
  // Coords en viewBox 0 0 240 520 (Argentina silhouette stylized)
  salta: {
    x: 110,
    y: 65,
    region: 'Norte'
  },
  catamarca: {
    x: 100,
    y: 110,
    region: 'Norte'
  },
  talampaya: {
    x: 92,
    y: 135,
    region: 'Cuyo'
  },
  termas: {
    x: 135,
    y: 145,
    region: 'Litoral'
  },
  federacion: {
    x: 145,
    y: 165,
    region: 'Litoral'
  },
  cataratas: {
    x: 168,
    y: 75,
    region: 'Litoral'
  },
  'cataratas-brasil': {
    x: 168,
    y: 75,
    region: 'Litoral'
  },
  mendoza: {
    x: 95,
    y: 215,
    region: 'Cuyo'
  },
  merlo: {
    x: 118,
    y: 195,
    region: 'Cuyo'
  },
  carlospaz: {
    x: 130,
    y: 185,
    region: 'Centro'
  },
  bariloche: {
    x: 100,
    y: 300,
    region: 'Patagonia'
  },
  'puerto-varas': {
    x: 70,
    y: 290,
    region: 'Chile'
  },
  vina: {
    x: 70,
    y: 215,
    region: 'Chile'
  },
  'punta-este': {
    x: 165,
    y: 235,
    region: 'Uruguay'
  },
  camboriu: {
    x: 195,
    y: 130,
    region: 'Brasil'
  },
  europa: {
    x: 215,
    y: 30,
    region: 'Internacional',
    external: true
  }
};
function MapView({
  packages,
  onSelect
}) {
  const [activeFoto, setActiveFoto] = useStateL(null);
  const grouped = useMemoL(() => {
    const g = {};
    for (const p of packages) {
      for (const k of pkgDestinos(p)) {
        if (!g[k]) g[k] = [];
        g[k].push(p);
      }
    }
    return g;
  }, [packages]);
  const activePackages = activeFoto ? grouped[activeFoto] || [] : null;
  const destinos = Object.keys(grouped).filter(k => MAP_POINTS[k]);
  return /*#__PURE__*/React.createElement("div", {
    className: "map-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-canvas"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 240 520",
    className: "map-svg",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "map-grid",
    x: "0",
    y: "0",
    width: "20",
    height: "20",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 20 0 L 0 0 0 20",
    fill: "none",
    stroke: "rgba(26,20,16,0.04)",
    strokeWidth: "0.5"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "dot-glow"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "rgba(237,28,36,0.6)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "rgba(237,28,36,0)"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "240",
    height: "520",
    fill: "url(#map-grid)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 145,30 L 158,48 L 168,70 L 162,90 L 152,108 L 158,130 L 148,158 L 152,188 L 142,218 L 148,245 L 138,275 L 132,305 L 122,340 L 112,375 L 100,408 L 88,442 L 80,470 L 72,492 L 80,500 L 92,495 L 100,478 L 110,455 L 122,425 L 135,395 L 148,360 L 160,322 L 170,285 L 178,248 L 186,210 L 192,170 L 196,130 L 192,90 L 184,60 L 170,40 Z",
    fill: "rgba(26,20,16,0.06)",
    stroke: "rgba(26,20,16,0.25)",
    strokeWidth: "1",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 78,180 L 80,230 L 75,280 L 70,320 L 65,360 L 60,400 L 56,440 L 50,470",
    fill: "none",
    stroke: "rgba(26,20,16,0.18)",
    strokeWidth: "1",
    strokeDasharray: "3,3"
  }), /*#__PURE__*/React.createElement("text", {
    x: "135",
    y: "55",
    className: "map-region"
  }, "NORTE"), /*#__PURE__*/React.createElement("text", {
    x: "115",
    y: "160",
    className: "map-region"
  }, "CENTRO"), /*#__PURE__*/React.createElement("text", {
    x: "95",
    y: "260",
    className: "map-region"
  }, "CUYO"), /*#__PURE__*/React.createElement("text", {
    x: "115",
    y: "370",
    className: "map-region"
  }, "PATAGONIA"), /*#__PURE__*/React.createElement("text", {
    x: "195",
    y: "100",
    className: "map-region map-region--ext"
  }, "BR"), /*#__PURE__*/React.createElement("text", {
    x: "175",
    y: "245",
    className: "map-region map-region--ext"
  }, "UY"), destinos.map(foto => {
    const pt = MAP_POINTS[foto];
    const isActive = activeFoto === foto;
    const count = grouped[foto].length;
    return /*#__PURE__*/React.createElement("g", {
      key: foto,
      className: `map-pin ${isActive ? 'is-active' : ''}`,
      transform: `translate(${pt.x} ${pt.y})`,
      onClick: () => setActiveFoto(isActive ? null : foto),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      r: "14",
      fill: "url(#dot-glow)",
      className: "map-pin-glow"
    }), /*#__PURE__*/React.createElement("circle", {
      r: "6",
      className: "map-pin-outer"
    }), /*#__PURE__*/React.createElement("circle", {
      r: "3.5",
      className: "map-pin-inner"
    }), /*#__PURE__*/React.createElement("text", {
      y: "-12",
      textAnchor: "middle",
      className: "map-pin-label"
    }, window.NT_DESTINO_LABELS?.[foto] || foto), /*#__PURE__*/React.createElement("text", {
      y: "22",
      textAnchor: "middle",
      className: "map-pin-count"
    }, count));
  }))), /*#__PURE__*/React.createElement("aside", {
    className: "map-side"
  }, !activePackages && /*#__PURE__*/React.createElement("div", {
    className: "map-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "map-empty-eyebrow"
  }, "Vista mapa"), /*#__PURE__*/React.createElement("h3", null, "Toc\xE1 un destino del mapa"), /*#__PURE__*/React.createElement("p", null, "Cada punto rojo marca un destino con paquetes disponibles. Tocalo para ver los viajes a esa ciudad."), /*#__PURE__*/React.createElement("div", {
    className: "map-empty-legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "map-pin-mini"
  }), " ", /*#__PURE__*/React.createElement("em", null, destinos.length, " destinos \xB7 ", packages.length, " paquetes"))), activePackages && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "map-side-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "map-side-eyebrow"
  }, activePackages.length, " ", activePackages.length === 1 ? 'paquete' : 'paquetes'), /*#__PURE__*/React.createElement("h3", null, window.NT_DESTINO_LABELS?.[activeFoto] || activeFoto), /*#__PURE__*/React.createElement("button", {
    className: "map-side-clear",
    onClick: () => setActiveFoto(null)
  }, "\u2190 Volver al mapa")), /*#__PURE__*/React.createElement("div", {
    className: "map-side-list"
  }, activePackages.map(p => {
    const pi = getPriceInfo(p);
    return /*#__PURE__*/React.createElement("button", {
      key: p.id,
      className: "map-side-item",
      onClick: () => onSelect(p)
    }, /*#__PURE__*/React.createElement("div", {
      className: "map-side-item-media"
    }, /*#__PURE__*/React.createElement(Ph, {
      kind: p.foto,
      label: p.destino
    })), /*#__PURE__*/React.createElement("div", {
      className: "map-side-item-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "map-side-item-where"
    }, p.destino), /*#__PURE__*/React.createElement("strong", null, p.titulo), /*#__PURE__*/React.createElement("span", {
      className: "map-side-item-meta"
    }, p.duracion, " \xB7 ", transportLabel(p.transporte)), /*#__PURE__*/React.createElement("span", {
      className: "map-side-item-price"
    }, pi.old && /*#__PURE__*/React.createElement("small", null, formatPrice(pi.old, pi.currency)), formatPrice(pi.current, pi.currency))), /*#__PURE__*/React.createElement("span", {
      className: "map-side-item-arrow"
    }, "\u2192"));
  })))));
}

// ============ HERO (compact) ============
function ListadoHero({
  count,
  total,
  search,
  setSearch,
  tempActiva,
  destLabel,
  onSubmitSearch
}) {
  const [hint, setHint] = useStateL(null); // 'success' | 'empty' | null
  const handleSubmit = e => {
    e.preventDefault();
    if (!search.trim()) {
      setHint(null);
      return;
    }
    if (count > 0) {
      setHint('success');
      onSubmitSearch();
    } else {
      setHint('empty');
    }
  };
  // Reset hint si el usuario sigue tipeando
  useEffectL(() => {
    setHint(null);
  }, [search]);
  return /*#__PURE__*/React.createElement("section", {
    className: "ltd-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-hero-eyebrow"
  }, /*#__PURE__*/React.createElement("span", null, "Cat\xE1logo \xB7 ", total, " paquetes activos"), /*#__PURE__*/React.createElement("span", {
    className: "ltd-hero-eyebrow-dot"
  }), /*#__PURE__*/React.createElement("span", null, "Salidas confirmadas mayo 26 \u2192 abril 27")), /*#__PURE__*/React.createElement("h1", {
    className: "ltd-hero-title"
  }, destLabel ? /*#__PURE__*/React.createElement(React.Fragment, null, "Paquetes a ", /*#__PURE__*/React.createElement("em", null, destLabel)) : tempActiva ? /*#__PURE__*/React.createElement(React.Fragment, null, tempActiva.nombre) : /*#__PURE__*/React.createElement(React.Fragment, null, "Eleg\xED tu pr\xF3ximo ", /*#__PURE__*/React.createElement("em", null, "viaje"), ".")), /*#__PURE__*/React.createElement("p", {
    className: "ltd-hero-lede"
  }, "M\xE1s de ", total, " paquetes grupales con bus o avi\xF3n, todo incluido, salidas desde tu ciudad. Cuotas sin inter\xE9s y coordinador acompa\xF1ante."), /*#__PURE__*/React.createElement("form", {
    className: "ltd-searchbar",
    onSubmit: handleSubmit,
    role: "search"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "20",
    height: "20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.5",
    y2: "16.5"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\xBFAd\xF3nde quer\xE9s ir? Ej: Brasil, Cataratas, Bariloche\u2026",
    value: search,
    onChange: e => setSearch(e.target.value)
  }), search && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ltd-searchbar-clear",
    onClick: () => setSearch(''),
    "aria-label": "Limpiar"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "ltd-searchbar-submit",
    "aria-label": "Buscar"
  }, "Buscar")), hint === 'empty' && /*#__PURE__*/React.createElement("div", {
    className: "ltd-search-hint ltd-search-hint--empty",
    role: "alert"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-search-hint-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16.5",
    x2: "12",
    y2: "16.6"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "No encontramos paquetes para \"", search, "\""), /*#__PURE__*/React.createElement("p", null, "Revis\xE1 la ortograf\xEDa o prob\xE1 con otra palabra (ej. ", /*#__PURE__*/React.createElement("em", null, "Cataratas"), ", ", /*#__PURE__*/React.createElement("em", null, "Bariloche"), ", ", /*#__PURE__*/React.createElement("em", null, "Brasil"), "). Si no, desliz\xE1 abajo y refin\xE1 con los ", /*#__PURE__*/React.createElement("em", null, "filtros"), ".")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ltd-search-hint-btn",
    onClick: () => {
      setSearch('');
      onSubmitSearch();
    }
  }, "Ver todos los paquetes")), hint === 'success' && /*#__PURE__*/React.createElement("div", {
    className: "ltd-search-hint ltd-search-hint--success",
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-search-hint-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "20",
    height: "20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "5 13 9 17 19 7"
  }))), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, count), " ", count === 1 ? 'paquete encontrado' : 'paquetes encontrados', " para \"", search, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "ltd-hero-counter"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-hero-counter-big"
  }, count), /*#__PURE__*/React.createElement("span", {
    className: "ltd-hero-counter-text"
  }, count === 1 ? 'paquete encontrado' : 'paquetes encontrados'))));
}

// ============ MAIN ============
function ListadoScreenV2({
  packages,
  onSelect,
  initialCategoria,
  initialTemporada,
  initialDestino,
  initialPromo,
  initialSearch
}) {
  const [activeCat, setActiveCat] = useStateL(initialCategoria || 'todos');
  const [activeTemp, setActiveTemp] = useStateL(initialTemporada || 'todas');
  const [activeDest, setActiveDest] = useStateL(initialDestino || 'todos');
  const [activePromo, setActivePromo] = useStateL(initialPromo || 'todas');
  const [transporte, setTransporte] = useStateL('todos');
  const [diferenciales, setDiferenciales] = useStateL([]);
  const [meses, setMeses] = useStateL([]);
  const [precioRango, setPrecioRango] = useStateL('todos');
  const [search, setSearch] = useStateL(initialSearch || '');
  const [sort, setSort] = useStateL('popular');
  const [view, setView] = useStateL('grid'); // grid | mapa
  const [drawerOpen, setDrawerOpen] = useStateL(false);
  const [favoritos, setFavoritos] = useStateL(() => {
    try {
      return JSON.parse(localStorage.getItem('nt_favs') || '[]');
    } catch {
      return [];
    }
  });
  useEffectL(() => {
    try {
      localStorage.setItem('nt_favs', JSON.stringify(favoritos));
    } catch {}
  }, [favoritos]);
  useReveal();
  const toggleFav = id => setFavoritos(arr => arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  const filtered = useMemoL(() => {
    let list = packages;
    if (activeCat !== 'todos') list = list.filter(p => p.categoria === activeCat);
    if (activeTemp !== 'todas') {
      list = list.filter(p => p.temporadas?.includes(activeTemp) || activeTemp === 'promociones' && (p.sellos?.includes('tarifa-promo') || p.sellos?.includes('promo-2x1') || discountPct(p)));
    }
    if (activeDest !== 'todos') list = list.filter(p => pkgDestinos(p).includes(activeDest));
    if (activePromo !== 'todas') {
      if (activePromo === 'con-promo') list = list.filter(p => pkgPromoTypes(p).length > 0);else list = list.filter(p => pkgPromoTypes(p).includes(activePromo));
    }
    if (transporte !== 'todos') list = list.filter(p => p.transporte === transporte);
    if (diferenciales.length) list = list.filter(p => diferenciales.every(d => p.sellos?.includes(d)));
    if (meses.length) list = list.filter(p => p.salidas?.some(s => meses.some(m => s.fecha.includes(m.split(' ')[0]) && s.fecha.includes(m.split(' ')[1]?.replace('26', '2026').replace('27', '2027')))));
    if (precioRango !== 'todos') {
      const r = PRECIO_RANGOS.find(x => x.id === precioRango);
      list = list.filter(p => {
        const ars = priceARS(p);
        return ars >= (r.min || 0) && ars <= r.max;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => (p.titulo + ' ' + p.destino + ' ' + (p.subtitulo || '')).toLowerCase().includes(q));
    }
    list = [...list];
    if (sort === 'popular') {
      list.sort((a, b) => getPopularityScore(b) - getPopularityScore(a) || priceARS(a) - priceARS(b));
    }
    if (sort === 'precio-asc') list.sort((a, b) => priceARS(a) - priceARS(b));
    if (sort === 'precio-desc') list.sort((a, b) => priceARS(b) - priceARS(a));
    if (sort === 'proxima') list.sort((a, b) => {
      const fa = a.salidas?.[0]?.fecha || '';
      const fb = b.salidas?.[0]?.fecha || '';
      return fa.localeCompare(fb);
    });
    if (sort === 'duracion') {
      const dur = p => parseInt((p.duracion || '0').match(/\d+/)?.[0] || '0', 10);
      list.sort((a, b) => dur(a) - dur(b));
    }
    return list;
  }, [packages, activeCat, activeTemp, activeDest, activePromo, transporte, diferenciales, meses, precioRango, search, sort]);
  const tempActiva = activeTemp !== 'todas' ? window.NT_TEMPORADAS?.find(t => t.id === activeTemp) : null;
  const destLabel = activeDest !== 'todos' ? window.NT_DESTINO_LABELS?.[activeDest] || activeDest : null;

  // Conteo de destinos disponibles
  const destinosCount = useMemoL(() => {
    const c = {};
    packages.forEach(p => {
      pkgDestinos(p).forEach(d => {
        c[d] = (c[d] || 0) + 1;
      });
    });
    return c;
  }, [packages]);

  // Conteo de paquetes por tipo de promo
  const promoCount = useMemoL(() => {
    const c = {};
    let conPromo = 0;
    packages.forEach(p => {
      const types = pkgPromoTypes(p);
      if (types.length) conPromo++;
      types.forEach(t => {
        c[t] = (c[t] || 0) + 1;
      });
    });
    c.__total = conPromo;
    return c;
  }, [packages]);
  const activeFilterCount = (transporte !== 'todos' ? 1 : 0) + diferenciales.length + meses.length + (precioRango !== 'todos' ? 1 : 0);
  const limpiarTodo = () => {
    setActiveCat('todos');
    setActiveTemp('todas');
    setActiveDest('todos');
    setActivePromo('todas');
    setTransporte('todos');
    setDiferenciales([]);
    setMeses([]);
    setPrecioRango('todos');
    setSearch('');
  };
  const gridRef = useRefL(null);
  const handleSubmitSearch = () => {
    setTimeout(() => {
      if (gridRef.current) {
        const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  // Si llega desde home con una búsqueda, hacer scroll a la grilla al montar
  useEffectL(() => {
    if (initialSearch) {
      setTimeout(() => {
        if (gridRef.current) {
          const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({
            top,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
    // eslint-disable-next-line
  }, []);
  const totalFilters = activeFilterCount + (activeCat !== 'todos' ? 1 : 0) + (activeTemp !== 'todas' ? 1 : 0) + (activeDest !== 'todos' ? 1 : 0) + (activePromo !== 'todas' ? 1 : 0) + (search ? 1 : 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "ltd2"
  }, /*#__PURE__*/React.createElement(ListadoHero, {
    count: filtered.length,
    total: packages.length,
    search: search,
    setSearch: setSearch,
    tempActiva: tempActiva,
    destLabel: destLabel,
    onSubmitSearch: handleSubmitSearch
  }), /*#__PURE__*/React.createElement("div", {
    className: "ltd-filterbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-filterbar-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-cats"
  }, window.NT_CATEGORIES?.map(c => {
    const count = c.id === 'todos' ? packages.length : packages.filter(p => p.categoria === c.id).length;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: `ltd-cat ${activeCat === c.id ? 'is-active' : ''}`,
      onClick: () => setActiveCat(c.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ltd-cat-icon"
    }, c.icon), /*#__PURE__*/React.createElement("span", {
      className: "ltd-cat-name"
    }, c.nombre), /*#__PURE__*/React.createElement("span", {
      className: "ltd-cat-count"
    }, count));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ltd-temps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-temps-inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: `ltd-temp ${activeTemp === 'todas' ? 'is-active' : ''}`,
    onClick: () => setActiveTemp('todas')
  }, "\uD83D\uDCC5 Todo el a\xF1o"), window.NT_TEMPORADAS?.map(t => {
    const cnt = packages.filter(p => p.temporadas?.includes(t.id)).length;
    if (cnt === 0) return null;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: `ltd-temp ${activeTemp === t.id ? 'is-active' : ''}`,
      style: activeTemp === t.id ? {
        background: t.color,
        borderColor: t.color,
        color: '#fff'
      } : {},
      onClick: () => setActiveTemp(t.id)
    }, t.icon, " ", t.nombre, " ", /*#__PURE__*/React.createElement("em", null, cnt));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ltd-destinos-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-destinos-inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: `ltd-dest ${activeDest === 'todos' ? 'is-active' : ''}`,
    onClick: () => setActiveDest('todos')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-dest-icon"
  }, "\uD83C\uDF0E"), /*#__PURE__*/React.createElement("span", {
    className: "ltd-dest-name"
  }, "Todos los destinos"), /*#__PURE__*/React.createElement("span", {
    className: "ltd-dest-count"
  }, packages.length)), Object.keys(destinosCount).map(foto => {
    const cnt = destinosCount[foto];
    if (cnt === 0) return null;
    const label = window.NT_DESTINO_LABELS?.[foto] || foto;
    return /*#__PURE__*/React.createElement("button", {
      key: foto,
      className: `ltd-dest ${activeDest === foto ? 'is-active' : ''}`,
      onClick: () => setActiveDest(activeDest === foto ? 'todos' : foto)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ltd-dest-name"
    }, label), /*#__PURE__*/React.createElement("span", {
      className: "ltd-dest-count"
    }, cnt));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ltd-promos-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-promos-inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-promos-label"
  }, "\uD83C\uDF9F Promociones"), /*#__PURE__*/React.createElement("button", {
    className: `ltd-promo ltd-promo--all ${activePromo === 'todas' ? 'is-active' : ''}`,
    onClick: () => setActivePromo('todas')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-promo-name"
  }, "Todos"), /*#__PURE__*/React.createElement("span", {
    className: "ltd-promo-count"
  }, packages.length)), /*#__PURE__*/React.createElement("button", {
    className: `ltd-promo ltd-promo--anypromo ${activePromo === 'con-promo' ? 'is-active' : ''}`,
    onClick: () => setActivePromo(activePromo === 'con-promo' ? 'todas' : 'con-promo')
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-promo-name"
  }, "Todas las promociones"), /*#__PURE__*/React.createElement("span", {
    className: "ltd-promo-count"
  }, promoCount.__total || 0)), /*#__PURE__*/React.createElement("span", {
    className: "ltd-promos-divider"
  }), PROMO_FILTERS.map(pf => {
    const cnt = promoCount[pf.id] || 0;
    if (cnt === 0) return null;
    const active = activePromo === pf.id;
    return /*#__PURE__*/React.createElement("button", {
      key: pf.id,
      className: `ltd-promo ltd-promo--type ${active ? 'is-active' : ''}`,
      style: active ? {
        background: pf.color,
        borderColor: pf.color,
        color: '#fff'
      } : {
        borderColor: pf.color,
        background: pf.color + '14'
      },
      onClick: () => setActivePromo(active ? 'todas' : pf.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ltd-promo-dot",
      style: {
        background: pf.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "ltd-promo-name"
    }, pf.label), /*#__PURE__*/React.createElement("span", {
      className: "ltd-promo-count"
    }, cnt));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ltd-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-toolbar-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-toolbar-left"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ltd-morefilters",
    onClick: () => setDrawerOpen(true)
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "6",
    x2: "20",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "7",
    y1: "12",
    x2: "20",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "18",
    x2: "20",
    y2: "18"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "6",
    r: "2.5",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14",
    cy: "12",
    r: "2.5",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "18",
    r: "2.5",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("span", null, "M\xE1s filtros"), activeFilterCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "ltd-morefilters-badge"
  }, activeFilterCount)), /*#__PURE__*/React.createElement("div", {
    className: "ltd-sort"
  }, /*#__PURE__*/React.createElement("label", null, "Ordenar"), /*#__PURE__*/React.createElement("div", {
    className: "ltd-sort-pills"
  }, [['popular', 'Populares'], ['precio-asc', 'Menor $'], ['precio-desc', 'Mayor $'], ['proxima', 'Próximas'], ['duracion', 'Más cortas']].map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: `ltd-sort-pill ${sort === id ? 'is-active' : ''}`,
    onClick: () => setSort(id)
  }, label)))), totalFilters > 0 && /*#__PURE__*/React.createElement("button", {
    className: "ltd-clear",
    onClick: limpiarTodo
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "13",
    height: "13",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  })), "Limpiar todo (", totalFilters, ")")), /*#__PURE__*/React.createElement("div", {
    className: "ltd-toolbar-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ltd-viewtoggle"
  }, /*#__PURE__*/React.createElement("button", {
    className: `ltd-viewtoggle-btn ${view === 'grid' ? 'is-active' : ''}`,
    onClick: () => setView('grid'),
    "aria-label": "Vista grilla"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "15",
    height: "15",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "8",
    height: "8",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "3",
    width: "8",
    height: "8",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "13",
    width: "8",
    height: "8",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "13",
    width: "8",
    height: "8",
    rx: "1"
  })), "Grilla"), /*#__PURE__*/React.createElement("button", {
    className: `ltd-viewtoggle-btn ${view === 'mapa' ? 'is-active' : ''}`,
    onClick: () => setView('mapa'),
    "aria-label": "Vista mapa"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "15",
    height: "15",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "3 6 9 4 15 6 21 4 21 18 15 20 9 18 3 20 3 6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "4",
    x2: "9",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "6",
    x2: "15",
    y2: "20"
  })), "Mapa"))))), /*#__PURE__*/React.createElement("div", {
    className: "ltd-content",
    ref: gridRef
  }, view === 'grid' && /*#__PURE__*/React.createElement(React.Fragment, null, filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "ltd-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ltd-empty-icon"
  }, "\uD83E\uDDED"), /*#__PURE__*/React.createElement("h3", null, "Sin resultados con esos filtros"), /*#__PURE__*/React.createElement("p", null, "Prob\xE1 quitar alguno o ampliar el rango de fechas."), /*#__PURE__*/React.createElement("button", {
    className: "ltd-empty-btn",
    onClick: limpiarTodo
  }, "Limpiar todo y ver todos")), filtered.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ltd-grid"
  }, filtered.map(p => /*#__PURE__*/React.createElement(PackageCardV2, {
    key: p.id,
    pkg: p,
    onClick: onSelect,
    isFav: favoritos.includes(p.id),
    onToggleFav: toggleFav
  })))), view === 'mapa' && /*#__PURE__*/React.createElement(MapView, {
    packages: filtered,
    onSelect: onSelect
  })), /*#__PURE__*/React.createElement(FiltersDrawer, {
    open: drawerOpen,
    onClose: () => setDrawerOpen(false),
    transporte: transporte,
    setTransporte: setTransporte,
    diferenciales: diferenciales,
    setDiferenciales: setDiferenciales,
    meses: meses,
    setMeses: setMeses,
    precioRango: precioRango,
    setPrecioRango: setPrecioRango,
    packages: packages
  }));
}

// ============ HOME — CARRUSELES DE PROMOCIONES ============
// Orden e identidad de cada sección. El `id` coincide con el cls del badge
// y con el filtro de promo del listado (PROMO_FILTERS).
const HOME_PROMO_SECTIONS = [{
  id: 'urgent',
  eyebrow: 'Apuráte ahora',
  title: 'Últimos lugares',
  lede: 'Salidas casi completas, con precio rebajado por los últimos cupos.',
  stamp: 'ÚLTIMOS\nCUPOS',
  kicker: '¡Vuelan!'
}, {
  id: '2do',
  eyebrow: 'Promo pareja',
  title: '2do pasajero con descuento',
  lede: 'Viajan dos, el segundo paga menos. Ideal para ir acompañado.',
  stamp: '2do\nPAX',
  kicker: 'De a dos'
}, {
  id: 'family',
  eyebrow: 'Para toda la familia',
  title: 'Family Plan',
  lede: 'Tarifas reducidas para los menores que comparten habitación con dos adultos.',
  stamp: 'PLAN\nFAMILIA',
  kicker: 'Con los chicos'
}, {
  id: 'oferta',
  eyebrow: 'Tarifa rebajada',
  title: 'Ofertas',
  lede: 'Paquetes con descuento sobre la tarifa regular. Por tiempo limitado.',
  stamp: 'OFERTA',
  kicker: 'Rebajado'
}, {
  id: 'promo-puntual',
  eyebrow: 'Promo vigente',
  title: 'Promo',
  lede: 'Precios promocionales en destinos seleccionados.',
  stamp: 'PROMO',
  kicker: 'Vigente'
}, {
  id: 'lowcost',
  eyebrow: 'El precio más bajo',
  title: 'Super Promo Low Cost',
  lede: 'Los viajes más económicos de la temporada, todo incluido.',
  stamp: 'LOW\nCOST',
  kicker: 'Imbatible'
}, {
  id: 'promo',
  eyebrow: 'Abonando de contado',
  title: 'Pago al contado',
  lede: 'Pagando en efectivo o transferencia accedés a la tarifa más baja.',
  stamp: 'CONTADO',
  kicker: 'Tarifa baja'
}];
function HomePromoRow({
  section,
  packages,
  onSelect,
  onNavigate
}) {
  const scrollerRef = useRefL(null);
  const [scrollState, setScrollState] = useStateL({
    atStart: true,
    atEnd: false
  });
  const list = useMemoL(() => packages.filter(p => pkgPromoTypes(p).includes(section.id)), [packages, section.id]);
  const updateScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setScrollState({
      atStart,
      atEnd
    });
  };
  useEffectL(() => {
    updateScroll();
  }, [list.length]);
  const scroll = dir => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * (el.clientWidth * 0.85),
      behavior: 'smooth'
    });
  };
  if (list.length === 0) return null;
  const goToFiltered = () => onNavigate('listado', null, null, null, '', section.id);
  const pf = PROMO_FILTERS.find(p => p.id === section.id);
  const accent = pf ? pf.color : 'var(--nt-red)';
  return /*#__PURE__*/React.createElement("section", {
    className: "promo-row nt-reveal",
    "data-count": list.length,
    style: {
      '--promo-accent': accent
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "promo-row-num",
    "aria-hidden": true
  }, String(list.length).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    className: "promo-row-stamp",
    "aria-hidden": true
  }, (section.stamp || '').split('\n').map((ln, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, ln))), /*#__PURE__*/React.createElement("div", {
    className: "promo-row-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "promo-row-titles",
    role: "button",
    tabIndex: 0,
    onClick: goToFiltered,
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToFiltered();
      }
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "promo-row-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "promo-row-dot"
  }), section.eyebrow), /*#__PURE__*/React.createElement("span", {
    className: "promo-row-kicker",
    "aria-hidden": true
  }, section.kicker), /*#__PURE__*/React.createElement("h2", {
    className: "promo-row-title"
  }, section.title, /*#__PURE__*/React.createElement("span", {
    className: "promo-row-titlearrow",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "13 5 19 12 13 19"
  })))), /*#__PURE__*/React.createElement("p", {
    className: "promo-row-lede"
  }, section.lede)), /*#__PURE__*/React.createElement("div", {
    className: "promo-row-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "promo-row-seeall",
    onClick: goToFiltered
  }, "Ver los ", list.length, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "15",
    height: "15",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "13 5 19 12 13 19"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "promo-row-arrows"
  }, /*#__PURE__*/React.createElement("button", {
    className: "promo-arrow",
    onClick: () => scroll(-1),
    disabled: scrollState.atStart,
    "aria-label": "Anterior"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 5 8 12 15 19"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "promo-arrow",
    onClick: () => scroll(1),
    disabled: scrollState.atEnd,
    "aria-label": "Siguiente"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 5 16 12 9 19"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "promo-row-scroller-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "promo-row-scroller",
    ref: scrollerRef,
    onScroll: updateScroll
  }, list.map(p => /*#__PURE__*/React.createElement("div", {
    className: "promo-card-slot",
    key: p.id
  }, /*#__PURE__*/React.createElement(PackageCardV2, {
    pkg: p,
    onClick: onSelect,
    isFav: false,
    onToggleFav: () => {}
  }))), /*#__PURE__*/React.createElement("button", {
    className: "promo-card-end",
    onClick: goToFiltered
  }, /*#__PURE__*/React.createElement("span", {
    className: "promo-card-end-arrow",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "26",
    height: "26",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "13 5 19 12 13 19"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "promo-card-end-text"
  }, "Ver todos", /*#__PURE__*/React.createElement("br", null), section.title.toLowerCase())))));
}
function HomePromoSections({
  packages,
  onSelect,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "promo-rows"
  }, HOME_PROMO_SECTIONS.map(section => /*#__PURE__*/React.createElement(HomePromoRow, {
    key: section.id,
    section: section,
    packages: packages,
    onSelect: onSelect,
    onNavigate: onNavigate
  })));
}

// Override the listado screen
window.ListadoScreen = ListadoScreenV2;
window.PackageCardV2 = PackageCardV2;
window.HomePromoSections = HomePromoSections;
window.getPopularityScore = getPopularityScore;
