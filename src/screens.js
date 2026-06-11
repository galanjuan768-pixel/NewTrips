/* global React, Card, Pills, Header, TopStrip, Footer, Fab, Sticker, Stamp, Ph, Icon, DifIcon, useReveal, formatPrice, getPriceInfo */
const {
  useState: useStateS,
  useMemo: useMemoS
} = React;
const useState = useStateS;
const useMemo = useMemoS;

// ============ HOME ============
function HomeScreen({
  packages,
  onSelect,
  onWhatsapp,
  onNavigate
}) {
  useReveal();
  const PromoSections = window.HomePromoSections;
  const [heroSearch, setHeroSearch] = useState('');
  const handleSearchSubmit = e => {
    e.preventDefault();
    onNavigate('listado', null, null, null, heroSearch.trim());
  };
  const featured = packages.slice(0, 3);
  const proximas = packages.slice(0, 6);
  const promosPaquetes = packages.filter(p => p.temporadas?.includes('promociones'));
  const temporadasPrincipales = ['mayo-junio-26', 'vacaciones-invierno', 'agosto-diciembre', 'brasil', 'europa', 'fiestas', 'verano', 'marzo-abril-27'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    className: "nt-hero nt-hero--dark"
  }, /*#__PURE__*/React.createElement("video", {
    className: "nt-hero-video",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto",
    disableRemotePlayback: true,
    "aria-hidden": true,
    ref: v => {
      if (v) {
        v.muted = true;
        v.defaultMuted = true;
        v.volume = 0;
      }
    }
  }, /*#__PURE__*/React.createElement("source", {
    src: "assets/hero.mp4#t=0.001",
    type: "video/mp4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-hero-inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-hero-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse"
  }), "Salidas confirmadas \xB7 Mayo del 26 a Abril del 27"), /*#__PURE__*/React.createElement("div", {
    className: "nt-hero-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-stat-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "plus"
  }, "+"), "10 a\xF1os"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Viajando ", /*#__PURE__*/React.createElement("br", null), "juntos")), /*#__PURE__*/React.createElement("div", {
    className: "nt-stat-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "plus"
  }, "\u2665"), "Miles"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "De viajeros ", /*#__PURE__*/React.createElement("br", null), "felices"))), /*#__PURE__*/React.createElement("h1", null, "Eleg\xED tu", /*#__PURE__*/React.createElement("br", null), "pr\xF3ximo ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "viaje.")), /*#__PURE__*/React.createElement("p", {
    className: "nt-hero-lede"
  }, "M\xE1s de 40 paquetes grupales con bus o avi\xF3n, todo incluido, salidas desde tu ciudad del interior bonaerense. Cuotas sin inter\xE9s y coordinador acompa\xF1ante. Vos viaj\xE1s, nosotros nos ocupamos."), /*#__PURE__*/React.createElement("div", {
    className: "nt-hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-cta",
    onClick: () => onNavigate('listado')
  }, "Ver paquetes ", /*#__PURE__*/React.createElement(Icon.Arrow, null)), /*#__PURE__*/React.createElement("button", {
    className: "nt-cta nt-cta--ghost",
    onClick: () => onNavigate('listado')
  }, "Ver destinos")), /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-contorno.png",
    alt: "",
    "aria-hidden": true,
    className: "nt-hero-floatlogo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nt-hero-collage",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-collage-item nt-floater",
    style: {
      left: '2%',
      top: '8%',
      width: '34%',
      height: '58%',
      '--rot': '-3deg',
      transform: 'rotate(-3deg)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: "cataratas",
    label: "// Cataratas del Iguaz\xFA"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-collage-item nt-floater nt-floater--2",
    style: {
      left: '38%',
      top: '22%',
      width: '28%',
      height: '48%',
      '--rot': '2deg',
      transform: 'rotate(2deg)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: "termas",
    label: "// Termas R\xEDo Hondo"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-collage-item nt-floater nt-floater--3",
    style: {
      right: '18%',
      top: '4%',
      width: '24%',
      height: '52%',
      '--rot': '-1.5deg',
      transform: 'rotate(-1.5deg)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: "torre-eiffel",
    label: "// Europa"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-collage-item nt-floater nt-floater--4",
    style: {
      right: '2%',
      bottom: '4%',
      width: '24%',
      height: '42%',
      '--rot': '4deg',
      transform: 'rotate(4deg)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: "camboriu",
    label: "// Cambori\xFA"
  })), /*#__PURE__*/React.createElement(Stamp, {
    style: {
      right: '6%',
      top: '38%'
    }
  }, "VIAJ\xC1S", /*#__PURE__*/React.createElement("br", null), "SOLO \xB7", /*#__PURE__*/React.createElement("br", null), "IGUAL", /*#__PURE__*/React.createElement("br", null), "TARIFA")))), /*#__PURE__*/React.createElement("section", {
    className: "nt-searchband"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-searchband-inner nt-reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-searchband-eyebrow"
  }, "Encontr\xE1 tu viaje"), /*#__PURE__*/React.createElement("h2", {
    className: "nt-searchband-title"
  }, "\xBFA d\xF3nde quer\xE9s ir?"), /*#__PURE__*/React.createElement("p", {
    className: "nt-searchband-sub"
  }, "Escrib\xED un destino y te mostramos los paquetes disponibles al instante."), /*#__PURE__*/React.createElement("form", {
    className: "nt-searchband-bar",
    onSubmit: handleSearchSubmit,
    role: "search"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "nt-searchband-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2"
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
    placeholder: "Busc\xE1 un destino: Cataratas, Mendoza, Brasil\u2026",
    value: heroSearch,
    onChange: e => setHeroSearch(e.target.value),
    "aria-label": "Buscar destino"
  }), heroSearch && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nt-searchband-clear",
    onClick: () => setHeroSearch(''),
    "aria-label": "Limpiar"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
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
    className: "nt-searchband-submit"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.5",
    y2: "16.5"
  })), /*#__PURE__*/React.createElement("span", null, "Buscar"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-searchband-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-searchband-tags-label"
  }, "Populares:"), ['Cataratas', 'Mendoza', 'Brasil', 'Bariloche', 'Termas', 'Europa'].map(tag => /*#__PURE__*/React.createElement("button", {
    key: tag,
    className: "nt-searchband-tag",
    onClick: () => onNavigate('listado', null, null, null, tag)
  }, tag))))), /*#__PURE__*/React.createElement("section", {
    className: "nt-magnus nt-magnus--compact",
    id: "magnus"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-magnus-compact-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-magnus-compact-icon"
  }, /*#__PURE__*/React.createElement(Icon.Wallet, null)), /*#__PURE__*/React.createElement("div", {
    className: "nt-magnus-compact-body nt-reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-magnus-eyebrow"
  }, "No necesit\xE1s tarjeta"), /*#__PURE__*/React.createElement("h2", null, "Pag\xE1 tu viaje ", /*#__PURE__*/React.createElement("em", null, "en cuotas sin inter\xE9s"), ", sin tarjeta de cr\xE9dito."), /*#__PURE__*/React.createElement("p", null, "Pag\xE1s por QR, transferencia o en oficina. Vos eleg\xEDs en cu\xE1ntas cuotas, sin recargos ni tarjeta. Las cuotas van desde que hac\xE9s la reserva hasta 15 d\xEDas antes de viajar."), /*#__PURE__*/React.createElement("div", {
    className: "nt-magnus-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.magnussistemas.com.ar/login",
    target: "_blank",
    rel: "noopener",
    className: "nt-magnus-cta"
  }, /*#__PURE__*/React.createElement(Icon.Wallet, null), " Ingresar a pagar ", /*#__PURE__*/React.createElement(Icon.External, null)), /*#__PURE__*/React.createElement("button", {
    className: "nt-magnus-cta-secondary",
    onClick: onWhatsapp
  }, /*#__PURE__*/React.createElement(Icon.Whatsapp, null), " Consultar"))))), /*#__PURE__*/React.createElement("section", {
    className: "nt-promobands"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-promobands-intro nt-reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-section-eyebrow",
    style: {
      color: 'var(--nt-red)'
    }
  }, "Promos vigentes"), /*#__PURE__*/React.createElement("h2", {
    className: "nt-section-title"
  }, "Pag\xE1s ", /*#__PURE__*/React.createElement("em", null, "menos"), ". Viaj\xE1s igual."), /*#__PURE__*/React.createElement("p", {
    className: "nt-promobands-lede"
  }, "Vigentes hasta el 30 de junio o agotar cupos. Toc\xE1 el t\xEDtulo de cada promo para ver todos los paquetes de esa categor\xEDa.")), PromoSections && /*#__PURE__*/React.createElement(PromoSections, {
    packages: packages,
    onSelect: onSelect,
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement("section", {
    className: "nt-section nt-temporadas-section nt-temporadas-section--cream",
    style: {
      paddingTop: 56,
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-section-head nt-reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "nt-section-eyebrow"
  }, "Por temporada"), /*#__PURE__*/React.createElement("h2", {
    className: "nt-section-title"
  }, "\xBFCu\xE1ndo quer\xE9s viajar?")), /*#__PURE__*/React.createElement("a", {
    className: "nt-section-link",
    onClick: () => onNavigate('listado'),
    style: {
      cursor: 'pointer'
    }
  }, "Ver todo el calendario")), /*#__PURE__*/React.createElement("div", {
    className: "ntw-grid"
  }, temporadasPrincipales.map((tid, i) => {
    const tp = window.NT_TEMPORADAS.find(x => x.id === tid);
    const count = packages.filter(p => p.temporadas?.includes(tid)).length;
    return /*#__PURE__*/React.createElement("button", {
      key: tid,
      className: "ntw-card nt-reveal",
      style: {
        '--tp-color': tp.color,
        transitionDelay: `${i * 50}ms`
      },
      onClick: () => onNavigate('listado', null, tid)
    }, /*#__PURE__*/React.createElement("div", {
      className: "ntw-media",
      "aria-hidden": true
    }, /*#__PURE__*/React.createElement("img", {
      src: `assets/photos/temporadas/${tid}.png`,
      alt: "",
      loading: "lazy",
      decoding: "async"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ntw-scrim"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ntw-when"
    }, /*#__PURE__*/React.createElement("b", null, tp.cuando || tp.eyebrow), tp.anio && /*#__PURE__*/React.createElement("i", null, tp.anio))), /*#__PURE__*/React.createElement("div", {
      className: "ntw-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ntw-eyebrow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ntw-icon",
      "aria-hidden": true
    }, tp.icon), tp.eyebrow), /*#__PURE__*/React.createElement("h3", null, tp.nombre), /*#__PURE__*/React.createElement("p", null, tp.subtitulo), /*#__PURE__*/React.createElement("span", {
      className: "ntw-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ntw-count"
    }, count, " ", count === 1 ? 'paquete' : 'paquetes'), /*#__PURE__*/React.createElement("span", {
      className: "ntw-arrow"
    }, /*#__PURE__*/React.createElement(Icon.Arrow, null)))));
  }))), /*#__PURE__*/React.createElement(DestinosSection, {
    packages: packages,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(PaquetesPreview, {
    packages: packages,
    onNavigate: onNavigate,
    onSelect: onSelect
  }), /*#__PURE__*/React.createElement("section", {
    className: "nt-highlight nt-highlight--simple",
    style: {
      backgroundColor: "rgb(26, 20, 16)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-highlight-inner nt-highlight-inner--simple"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-section-eyebrow",
    style: {
      color: 'var(--nt-yellow)'
    }
  }, "Nuestro diferencial"), /*#__PURE__*/React.createElement("h2", null, "Viaj\xE1s solo.", /*#__PURE__*/React.createElement("br", null), "Pag\xE1s ", /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'underline',
      textDecorationStyle: 'wavy',
      textDecorationThickness: '3px',
      textUnderlineOffset: '8px',
      color: "rgb(237, 28, 36)"
    }
  }, "lo mismo"), "."), /*#__PURE__*/React.createElement("p", null, "Si compart\xEDs habitaci\xF3n, pag\xE1s la misma tarifa que en base doble. Sin recargo por viajar solo. Te sum\xE1s al grupo y un coordinador te acompa\xF1a todo el viaje."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-cta",
    style: {
      backgroundColor: "rgb(237, 28, 36)",
      color: '#fff'
    },
    onClick: () => onNavigate('listado')
  }, "Ver paquetes con esta tarifa ", /*#__PURE__*/React.createElement(Icon.Arrow, null)))))), /*#__PURE__*/React.createElement("section", {
    className: "nt-difs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-difs-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-difs-head nt-reveal"
  }, /*#__PURE__*/React.createElement("h2", null, "Por qu\xE9 somos ", /*#__PURE__*/React.createElement("em", null, "tu pr\xF3xima agencia."))), /*#__PURE__*/React.createElement("div", {
    className: "nt-difs-grid"
  }, window.NT_DIFERENCIALES.map((d, i) => /*#__PURE__*/React.createElement("div", {
    className: "nt-dif nt-reveal",
    key: i,
    style: {
      transitionDelay: `${i * 40}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-dif-icon"
  }, /*#__PURE__*/React.createElement(DifIcon, {
    name: d.icon
  })), /*#__PURE__*/React.createElement("h3", null, d.titulo), /*#__PURE__*/React.createElement("p", null, d.subtitulo)))))), /*#__PURE__*/React.createElement("section", {
    className: "nt-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-section-head nt-reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "nt-section-eyebrow"
  }, "Antes de viajar"), /*#__PURE__*/React.createElement("h2", {
    className: "nt-section-title"
  }, "Preguntas frecuentes"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      maxWidth: 800
    }
  }, window.NT_FAQS.map((f, i) => /*#__PURE__*/React.createElement(Faq, {
    key: i,
    q: f.q,
    a: f.a
  })))));
}
function Faq({
  q,
  a
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-reveal",
    style: {
      borderBottom: '1px solid var(--nt-line)',
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      width: '100%',
      textAlign: 'left',
      padding: '18px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(18px, 2vw, 22px)',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, q, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: open ? 'var(--nt-red)' : 'var(--nt-cream-warm)',
      color: open ? '#fff' : 'var(--nt-ink)',
      display: 'grid',
      placeItems: 'center',
      fontSize: 18,
      fontWeight: 600,
      transition: 'all 0.2s ease',
      flexShrink: 0
    }
  }, open ? '–' : '+')), open && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 18px',
      maxWidth: 720,
      fontSize: 15,
      color: 'var(--nt-ink-soft)'
    }
  }, a));
}

// ============ LISTADO ============
function ListadoScreen({
  packages,
  onSelect,
  initialCategoria,
  initialTemporada,
  initialDestino
}) {
  const [activeCat, setActiveCat] = useState(initialCategoria || 'todos');
  const [activeTemp, setActiveTemp] = useState(initialTemporada || 'todas');
  const [activeDest, setActiveDest] = useState(initialDestino || 'todos');
  const [transporte, setTransporte] = useState('todos'); // todos | bus | aereo
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('proxima'); // proxima | precio-asc | precio-desc
  useReveal();
  const filtered = useMemo(() => {
    let list = packages;
    if (activeCat !== 'todos') list = list.filter(p => p.categoria === activeCat);
    if (activeTemp !== 'todas') list = list.filter(p => p.temporadas?.includes(activeTemp));
    if (activeDest !== 'todos') list = list.filter(p => p.foto === activeDest);
    if (transporte !== 'todos') list = list.filter(p => p.transporte === transporte);
    if (search) list = list.filter(p => (p.titulo + p.destino + p.subtitulo).toLowerCase().includes(search.toLowerCase()));
    list = [...list];
    if (sort === 'precio-asc') list.sort((a, b) => getPriceInfo(a).current * (getPriceInfo(a).currency === 'USD' ? 1100 : 1) - getPriceInfo(b).current * (getPriceInfo(b).currency === 'USD' ? 1100 : 1));
    if (sort === 'precio-desc') list.sort((a, b) => getPriceInfo(b).current * (getPriceInfo(b).currency === 'USD' ? 1100 : 1) - getPriceInfo(a).current * (getPriceInfo(a).currency === 'USD' ? 1100 : 1));
    return list;
  }, [packages, activeCat, activeTemp, activeDest, transporte, search, sort]);
  const tempActiva = activeTemp !== 'todas' ? window.NT_TEMPORADAS.find(t => t.id === activeTemp) : null;
  const destActivo = activeDest !== 'todos' ? packages.find(p => p.foto === activeDest) : null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Pills, {
    active: activeCat,
    onChange: setActiveCat,
    packages: packages
  }), /*#__PURE__*/React.createElement("div", {
    className: "nt-temp-chips-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-temp-chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: `nt-temp-chip ${activeTemp === 'todas' ? 'active' : ''}`,
    onClick: () => setActiveTemp('todas')
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCC5"), " Todo el a\xF1o", /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, packages.length)), window.NT_TEMPORADAS.map(t => {
    const count = packages.filter(p => p.temporadas?.includes(t.id)).length;
    if (count === 0) return null;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: `nt-temp-chip ${activeTemp === t.id ? 'active' : ''}`,
      style: activeTemp === t.id ? {
        background: t.color,
        borderColor: t.color,
        color: '#fff'
      } : {},
      onClick: () => setActiveTemp(t.id)
    }, /*#__PURE__*/React.createElement("span", null, t.icon), " ", t.nombre, /*#__PURE__*/React.createElement("span", {
      className: "count"
    }, count));
  }), /*#__PURE__*/React.createElement("button", {
    className: `nt-temp-chip ${activeTemp === 'promociones' ? 'active' : ''}`,
    style: activeTemp === 'promociones' ? {
      background: 'var(--nt-red)',
      borderColor: 'var(--nt-red)',
      color: '#fff'
    } : {
      color: 'var(--nt-red)',
      borderColor: 'var(--nt-red)'
    },
    onClick: () => setActiveTemp('promociones')
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFF7"), " Promociones", /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, packages.filter(p => p.temporadas?.includes('promociones')).length)))), tempActiva && /*#__PURE__*/React.createElement("div", {
    className: "nt-temp-banner",
    style: {
      background: tempActiva.bgColor,
      borderLeftColor: tempActiva.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-temp-banner-inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-temp-banner-icon",
    style: {
      background: tempActiva.color
    }
  }, tempActiva.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "nt-temp-banner-eyebrow",
    style: {
      color: tempActiva.color
    }
  }, tempActiva.eyebrow), /*#__PURE__*/React.createElement("h2", null, tempActiva.nombre), /*#__PURE__*/React.createElement("p", null, tempActiva.subtitulo)), /*#__PURE__*/React.createElement("button", {
    className: "nt-temp-banner-clear",
    onClick: () => setActiveTemp('todas')
  }, /*#__PURE__*/React.createElement(Icon.Close, null), " Quitar filtro"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-listing-layout"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "nt-filters"
  }, /*#__PURE__*/React.createElement("h4", null, "Filtros"), /*#__PURE__*/React.createElement("div", {
    className: "nt-filters-section"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 12,
      marginBottom: 8
    }
  }, "Buscar"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Destino o nombre\u2026",
    value: search,
    onChange: e => setSearch(e.target.value),
    style: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid var(--nt-line)',
      borderRadius: 10,
      fontFamily: 'inherit',
      fontSize: 14
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-filters-section"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 12,
      marginBottom: 8
    }
  }, "Transporte"), [['todos', 'Todos'], ['bus', 'En bus'], ['aereo', 'En avión']].map(([v, label]) => /*#__PURE__*/React.createElement("label", {
    key: v,
    className: "nt-filter-row"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "transporte",
    checked: transporte === v,
    onChange: () => setTransporte(v),
    style: {
      accentColor: 'var(--nt-red)'
    }
  }), label), /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, v === 'todos' ? packages.length : packages.filter(p => p.transporte === v).length)))), /*#__PURE__*/React.createElement("div", {
    className: "nt-filters-section"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 12,
      marginBottom: 8
    }
  }, "Diferenciales"), [['viaja-solo', 'Viajás solo · igual tarifa'], ['family-plan', 'Family Plan'], ['piscina-climatizada', 'Piscina climatizada'], ['cupos-confirmados', 'Cupos confirmados'], ['tarifa-promo', 'Promo pago contado']].map(([sello, label]) => /*#__PURE__*/React.createElement("label", {
    key: sello,
    className: "nt-filter-row"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  }), label), /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, packages.filter(p => p.sellos.includes(sello)).length)))), /*#__PURE__*/React.createElement("div", {
    className: "nt-filters-section"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 12,
      marginBottom: 8
    }
  }, "Mes de salida"), ['Mayo 26', 'Junio 26', 'Julio 26', 'Agosto 26', 'Septiembre 26', 'Octubre 26', 'Noviembre 26', 'Diciembre 26', 'Fiestas', 'Enero 27', 'Febrero 27'].map(m => /*#__PURE__*/React.createElement("label", {
    key: m,
    className: "nt-filter-row"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  }), " ", m))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nt-listing-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, activeCat === 'todos' ? 'Todos los paquetes' : window.NT_CATEGORIES.find(c => c.id === activeCat)?.nombre), /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, filtered.length, " viajes encontrados")), /*#__PURE__*/React.createElement("div", {
    className: "nt-sort"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "sort"
  }, "Ordenar por"), /*#__PURE__*/React.createElement("select", {
    id: "sort",
    value: sort,
    onChange: e => setSort(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "proxima"
  }, "Pr\xF3xima salida"), /*#__PURE__*/React.createElement("option", {
    value: "precio-asc"
  }, "Precio: menor a mayor"), /*#__PURE__*/React.createElement("option", {
    value: "precio-desc"
  }, "Precio: mayor a menor")))), /*#__PURE__*/React.createElement("div", {
    className: "nt-grid"
  }, filtered.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.id,
    pkg: p,
    onClick: onSelect
  }))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 24px',
      textAlign: 'center',
      color: 'var(--nt-ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("p", null, "Sin resultados con esos filtros. Prob\xE1 con otra categor\xEDa.")))));
}

// ============ DETALLE ============
function PaxStepper({
  label,
  hint,
  value,
  min,
  max,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-paxrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-paxrow-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-paxrow-title"
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    className: "nt-paxrow-hint"
  }, hint)), /*#__PURE__*/React.createElement("div", {
    className: "nt-pax-controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-pax-btn",
    onClick: () => onChange(Math.max(min, value - 1)),
    disabled: value <= min,
    "aria-label": `Quitar ${label}`
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    className: "nt-pax-count"
  }, value), /*#__PURE__*/React.createElement("button", {
    className: "nt-pax-btn",
    onClick: () => onChange(Math.min(max, value + 1)),
    disabled: value >= max,
    "aria-label": `Sumar ${label}`
  }, "+")));
}
function DetalleScreen({
  pkg,
  onBack,
  onWhatsapp
}) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [adults, setAdults] = useState(1);
  const [kids0a5, setKids0a5] = useState(0);
  const [kids6a10, setKids6a10] = useState(0);
  const [transportClass, setTransportClass] = useState('semicama');
  const price = getPriceInfo(pkg);
  useReveal();
  if (!pkg) return null;
  const cama = transportClass === 'cocheCama';
  const hasKids = ntHasKids(pkg);
  const fp = pkg.familyPlan || {};
  const occupants = adults + kids0a5 + kids6a10;
  const quote = computeQuote(pkg, {
    adults,
    kids0a5,
    kids6a10,
    cama
  });
  const semicamaRate = ntRoomRate(pkg, occupants, false);
  const camaRate = ntRoomRate(pkg, occupants, true);
  const paxResumen = [`${adults} ${adults === 1 ? 'adulto' : 'adultos'}`, kids0a5 ? `${kids0a5} menor${kids0a5 > 1 ? 'es' : ''} (≤5)` : null, kids6a10 ? `${kids6a10} menor${kids6a10 > 1 ? 'es' : ''} (6-10)` : null].filter(Boolean).join(' · ');
  const handleBook = () => {
    onWhatsapp({
      pkg,
      selectedDate: pkg.salidas[selectedDate],
      adults,
      kids0a5,
      kids6a10,
      transportClass,
      cama,
      total: quote.total,
      currency: quote.currency,
      paxResumen
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-detail"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-detail-back",
    onClick: onBack
  }, "\u2190 Volver al listado"), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-hero"
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: pkg.foto,
    label: `// ${pkg.destino}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-hero-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-hero-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-hero-meta"
  }, /*#__PURE__*/React.createElement("span", null, pkg.duracion), /*#__PURE__*/React.createElement("span", null, pkg.transporte === 'aereo' ? '✈ Vuelo directo' : '🚌 Bus premium'), /*#__PURE__*/React.createElement("span", null, pkg.regimen)), /*#__PURE__*/React.createElement("h1", null, pkg.titulo), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      marginTop: 8,
      opacity: 0.92
    }
  }, pkg.destino)), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-stickers"
  }, pkg.sellos.map((s, i) => /*#__PURE__*/React.createElement(Sticker, {
    key: s,
    tipo: s,
    tilt: i % 2 === 0 ? 1 : 2
  })))), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Qu\xE9 incluye"), /*#__PURE__*/React.createElement("div", {
    className: "nt-includes-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon"
  }, pkg.transporte === 'aereo' ? '✈' : '🚌'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, pkg.transporte === 'aereo' ? `Vuelos directos` : 'Bus ida y vuelta'), pkg.transporte === 'aereo' && pkg.aerolinea && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, pkg.aerolinea), pkg.transporte === 'bus' && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, "Semicama o coche cama"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon"
  }, "\uD83C\uDFE8"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Hospedaje"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, pkg.hotel))), /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon"
  }, "\uD83C\uDF7D"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Comidas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, pkg.regimen))), /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon"
  }, "\uD83D\uDDFA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Excursiones"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, pkg.excursiones.length, " actividades incluidas"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon"
  }, "\uD83C\uDFE5"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Asistencia Avril"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, "Sin l\xEDmite de edad"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon"
  }, "\uD83D\uDC65"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Coordinador"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, "Te acompa\xF1a todo el viaje"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon"
  }, "\uD83C\uDF77"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Servicio a bordo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 2
    }
  }, "Cena con vino \xB7 snacks \xB7 infusiones"))), pkg.destacado && /*#__PURE__*/React.createElement("div", {
    className: "nt-include-item",
    style: {
      background: 'var(--nt-red)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-include-icon",
    style: {
      background: '#fff',
      color: 'var(--nt-red)'
    }
  }, "\u2605"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Destacado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      marginTop: 2,
      opacity: 0.9
    }
  }, pkg.destacado))))), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Excursiones incluidas"), /*#__PURE__*/React.createElement("ol", {
    style: {
      paddingLeft: 20,
      fontSize: 15,
      lineHeight: 1.7,
      columnCount: 2,
      columnGap: 32,
      columnRule: '1px dashed var(--nt-line)'
    }
  }, pkg.excursiones.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      breakInside: 'avoid',
      marginBottom: 6
    }
  }, e)))), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Embarques"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--nt-ink-soft)',
      marginBottom: 12,
      fontSize: 14
    }
  }, "El bus pasa por estas ciudades. Sumate desde la m\xE1s cercana, sin costo extra."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, pkg.embarques.map(e => /*#__PURE__*/React.createElement("span", {
    key: e,
    style: {
      padding: '8px 14px',
      borderRadius: 999,
      background: 'var(--nt-cream-warm)',
      fontSize: 13,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em'
    }
  }, e)))), /*#__PURE__*/React.createElement("div", {
    className: "nt-detail-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Fechas de salida"), /*#__PURE__*/React.createElement("div", {
    className: "nt-departures"
  }, pkg.salidas.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `nt-departure ${selectedDate === i ? 'selected' : ''}`,
    onClick: () => setSelectedDate(i)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      border: '2px solid',
      borderColor: selectedDate === i ? 'var(--nt-ink)' : 'var(--nt-line)',
      display: 'grid',
      placeItems: 'center'
    }
  }, selectedDate === i && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--nt-ink)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "nt-departure-date"
  }, s.fecha)), /*#__PURE__*/React.createElement("span", {
    className: `nt-departure-status nt-departure-status--${s.estado}`
  }, window.NT_SELLOS[s.estado]?.texto || s.estado)))))), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    className: "nt-book"
  }, price.isPromo && /*#__PURE__*/React.createElement("span", {
    className: "nt-book-tag"
  }, "\u26A1 Tarifa promo \xB7 Pago contado"), !price.isPromo && pkg.sellos.includes('ultimos-cupos') && /*#__PURE__*/React.createElement("span", {
    className: "nt-book-tag"
  }, "\uD83D\uDD25 \xDAltimos cupos disponibles"), !price.isPromo && !pkg.sellos.includes('ultimos-cupos') && /*#__PURE__*/React.createElement("span", {
    className: "nt-book-tag"
  }, "Precio por persona"), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-perhead"
  }, price.old && /*#__PURE__*/React.createElement("div", {
    className: "nt-book-oldline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-book-old"
  }, formatPrice(price.old, price.currency)), (() => {
    const pct = Math.round((1 - price.current / price.old) * 100);
    return pct > 3 ? /*#__PURE__*/React.createElement("span", {
      className: "nt-book-off"
    }, "\u2212", pct, "%") : null;
  })()), /*#__PURE__*/React.createElement("div", {
    className: `nt-book-price ${price.isPromo || price.old ? 'is-discount' : ''}`
  }, formatPrice(price.current, price.currency), /*#__PURE__*/React.createElement("small", null, " desde \xB7 por persona"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-installments"
  }, /*#__PURE__*/React.createElement("strong", null, "Cuotas sin inter\xE9s"), " hasta 15 d\xEDas antes de viajar. Reserv\xE1s con se\xF1a, vas pagando."), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "Fecha de salida"), /*#__PURE__*/React.createElement("select", {
    value: selectedDate,
    onChange: e => setSelectedDate(parseInt(e.target.value))
  }, pkg.salidas.map((s, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i
  }, s.fecha, " \xB7 ", window.NT_SELLOS[s.estado]?.texto || '')))), pkg.transporte === 'bus' && pkg.precioCama && /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "Servicio del bus"), /*#__PURE__*/React.createElement("select", {
    value: transportClass,
    onChange: e => setTransportClass(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "semicama"
  }, "Semicama \xB7 ", formatPrice(semicamaRate, 'ARS'), " p/p"), /*#__PURE__*/React.createElement("option", {
    value: "cocheCama"
  }, "Coche cama \xB7 ", formatPrice(camaRate, 'ARS'), " p/p"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "\xBFQui\xE9nes viajan?"), /*#__PURE__*/React.createElement("div", {
    className: "nt-paxbox"
  }, /*#__PURE__*/React.createElement(PaxStepper, {
    label: "Adultos",
    hint: "13 a\xF1os o m\xE1s",
    value: adults,
    min: 1,
    max: 10,
    onChange: setAdults
  }), hasKids && fp.menorHasta5 != null && /*#__PURE__*/React.createElement(PaxStepper, {
    label: "Menores hasta 5 a\xF1os",
    hint: `Family Plan · ${formatPrice(fp.menorHasta5, 'ARS')} c/u`,
    value: kids0a5,
    min: 0,
    max: 6,
    onChange: setKids0a5
  }), hasKids && fp.menor6a10 != null && /*#__PURE__*/React.createElement(PaxStepper, {
    label: "Menores de 6 a 10 a\xF1os",
    hint: `Family Plan · ${formatPrice(fp.menor6a10, 'ARS')} c/u`,
    value: kids6a10,
    min: 0,
    max: 6,
    onChange: setKids6a10
  })), !hasKids && pkg.transporte !== 'aereo' && /*#__PURE__*/React.createElement("p", {
    className: "nt-book-kidnote"
  }, "\xBFViajan menores? Consultanos por tarifas y disponibilidad para chicos."), hasKids && adults < 2 && kids0a5 + kids6a10 > 0 && /*#__PURE__*/React.createElement("p", {
    className: "nt-book-kidnote"
  }, "\u2139\uFE0F Las tarifas de menores aplican compartiendo habitaci\xF3n con 2 adultos.")), /*#__PURE__*/React.createElement("div", {
    className: "nt-quote"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-head"
  }, "Detalle de tu reserva"), /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-rows"
  }, quote.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: `nt-quote-row ${it.discounted ? 'is-discount' : ''}`,
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-row-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-who"
  }, it.label), it.sub && /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-tag"
  }, it.sub)), /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-row-amt"
  }, it.discounted && it.regular ? /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-reg"
  }, formatPrice(it.regular, quote.currency)) : null, /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-amt"
  }, formatPrice(it.amount, quote.currency))))), quote.currency === 'USD' && (quote.impuestos > 0 || quote.cityTax > 0) && /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-row nt-quote-row--tax"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-row-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-who"
  }, "Impuestos + tasas")), /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-row-amt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-amt"
  }, formatPrice((quote.impuestos || 0) + (quote.cityTax || 0), 'USD'))))), quote.savings > 0 && /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-savings"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF89 Ahorr\xE1s"), /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-savings-amt"
  }, formatPrice(quote.savings, quote.currency))), /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-total"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-quote-total-lbl"
  }, /*#__PURE__*/React.createElement("span", null, "Total", quote.currency === 'USD' ? ' final' : ''), /*#__PURE__*/React.createElement("small", null, paxResumen)), /*#__PURE__*/React.createElement("span", {
    className: "nt-quote-total-amt"
  }, formatPrice(quote.total, quote.currency)))), /*#__PURE__*/React.createElement("button", {
    className: "nt-book-cta",
    onClick: handleBook
  }, /*#__PURE__*/React.createElement(Icon.Whatsapp, null), " Reservar \xB7 consultar disponibilidad"), /*#__PURE__*/React.createElement("button", {
    className: "nt-book-secondary"
  }, "\uD83D\uDCE5 Descargar itinerario PDF"), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-trust"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, "Incauca Turismo \xB7 Leg. 12.379"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, "Asistencia Avril sin l\xEDmite de edad"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, "Coordinador acompa\xF1ante"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, "Sin sorpresas: precio publicado = precio final*"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      marginTop: 4,
      opacity: 0.7
    }
  }, "* + 1.5% gastos administrativos"))))));
}

// ============ WHATSAPP MODAL ============
function WhatsappModal({
  inquiry,
  onClose
}) {
  const [nombre, setNombre] = useState('');
  const [adults, setAdults] = useState(inquiry?.adults || 1);
  const [kids0a5, setKids0a5] = useState(inquiry?.kids0a5 || 0);
  const [kids6a10, setKids6a10] = useState(inquiry?.kids6a10 || 0);
  const [habitacion, setHabitacion] = useState('compartida');
  const [embarque, setEmbarque] = useState('');
  const [fechaSalida, setFechaSalida] = useState(inquiry?.selectedDate?.fecha || inquiry?.pkg?.salidas[0]?.fecha || '');
  const pkg = inquiry?.pkg;
  const cama = inquiry?.cama || false;
  const hasKids = pkg ? ntHasKids(pkg) : false;
  const fp = pkg?.familyPlan || {};
  const quote = pkg ? computeQuote(pkg, {
    adults,
    kids0a5,
    kids6a10,
    cama
  }) : null;
  const paxResumen = [`${adults} ${adults === 1 ? 'adulto' : 'adultos'}`, kids0a5 ? `${kids0a5} menor${kids0a5 > 1 ? 'es' : ''} (≤5)` : null, kids6a10 ? `${kids6a10} menor${kids6a10 > 1 ? 'es' : ''} (6-10)` : null].filter(Boolean).join(' · ');
  const message = useMemo(() => {
    const lines = [];
    lines.push(`¡Hola New Trips! 👋`);
    lines.push('');
    if (pkg) {
      lines.push(`Quiero consultar por el paquete *${pkg.titulo}* (${pkg.destino}).`);
      if (fechaSalida) lines.push(`Fecha de salida: *${fechaSalida}*`);
      lines.push(`Pasajeros: *${paxResumen}*`);
      lines.push(`Habitación: *${habitacion === 'compartida' ? 'Compartida (igual tarifa)' : habitacion === 'doble' ? 'Doble (en pareja)' : 'Individual'}*`);
      if (embarque) lines.push(`Embarque desde: *${embarque}*`);
      if (quote) lines.push(`Total estimado: *${formatPrice(quote.total, quote.currency)}*${quote.savings > 0 ? ` (ahorro ${formatPrice(quote.savings, quote.currency)})` : ''}`);
    } else {
      lines.push(`Quiero hacer una consulta general sobre los paquetes.`);
    }
    if (nombre) lines.push(`\nMi nombre es ${nombre}.`);
    lines.push('\n¿Me podés confirmar disponibilidad y enviarme el itinerario? ¡Gracias! 🧳');
    return lines.join('\n');
  }, [pkg, fechaSalida, paxResumen, habitacion, embarque, nombre, quote]);
  const handleSend = () => {
    const phone = '5492235287375';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-modal-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-modal-close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon.Close, null)), /*#__PURE__*/React.createElement("h3", null, pkg ? 'Consultar este paquete' : 'Consultá lo que necesites'), /*#__PURE__*/React.createElement("p", null, "Te conectamos con un asesor por WhatsApp en menos de 5 minutos. Respondemos de Lun a Sab 9 a 20hs.")), /*#__PURE__*/React.createElement("div", {
    className: "nt-modal-body"
  }, pkg && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px',
      background: 'var(--nt-cream-warm)',
      borderRadius: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 10,
      overflow: 'hidden',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: pkg.foto,
    label: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 16,
      lineHeight: 1.1,
      marginBottom: 2
    }
  }, pkg.titulo), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--nt-ink-soft)'
    }
  }, pkg.destino, " \xB7 ", pkg.duracion))), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "Tu nombre"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nombre,
    onChange: e => setNombre(e.target.value),
    placeholder: "Ej: Mar\xEDa"
  })), pkg && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "Fecha de salida"), /*#__PURE__*/React.createElement("select", {
    value: fechaSalida,
    onChange: e => setFechaSalida(e.target.value)
  }, pkg.salidas.map((s, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: s.fecha
  }, s.fecha, " \xB7 ", window.NT_SELLOS[s.estado]?.texto)))), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "Pasajeros"), /*#__PURE__*/React.createElement("div", {
    className: "nt-paxbox"
  }, /*#__PURE__*/React.createElement(PaxStepper, {
    label: "Adultos",
    hint: "13 a\xF1os o m\xE1s",
    value: adults,
    min: 1,
    max: 10,
    onChange: setAdults
  }), hasKids && fp.menorHasta5 != null && /*#__PURE__*/React.createElement(PaxStepper, {
    label: "Menores hasta 5 a\xF1os",
    hint: "Family Plan",
    value: kids0a5,
    min: 0,
    max: 6,
    onChange: setKids0a5
  }), hasKids && fp.menor6a10 != null && /*#__PURE__*/React.createElement(PaxStepper, {
    label: "Menores de 6 a 10 a\xF1os",
    hint: "Family Plan",
    value: kids6a10,
    min: 0,
    max: 6,
    onChange: setKids6a10
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "Habitaci\xF3n"), /*#__PURE__*/React.createElement("select", {
    value: habitacion,
    onChange: e => setHabitacion(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "compartida"
  }, "Compartida \u2014 igual tarifa que base doble"), /*#__PURE__*/React.createElement("option", {
    value: "doble"
  }, "Doble \u2014 viajo en pareja"), /*#__PURE__*/React.createElement("option", {
    value: "individual"
  }, "Individual \u2014 consultar suplemento"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-book-field"
  }, /*#__PURE__*/React.createElement("label", null, "Embarque"), /*#__PURE__*/React.createElement("select", {
    value: embarque,
    onChange: e => setEmbarque(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Eleg\xED tu ciudad"), pkg.embarques.map(e => /*#__PURE__*/React.createElement("option", {
    key: e,
    value: e
  }, e))))), pkg && quote && /*#__PURE__*/React.createElement("div", {
    className: "nt-modal-total"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-modal-total-lbl"
  }, /*#__PURE__*/React.createElement("span", null, "Total estimado"), /*#__PURE__*/React.createElement("small", null, paxResumen)), /*#__PURE__*/React.createElement("div", {
    className: "nt-modal-total-amt"
  }, quote.savings > 0 && /*#__PURE__*/React.createElement("span", {
    className: "nt-modal-total-save"
  }, "Ahorr\xE1s ", formatPrice(quote.savings, quote.currency)), /*#__PURE__*/React.createElement("span", null, formatPrice(quote.total, quote.currency)))), /*#__PURE__*/React.createElement("div", {
    className: "nt-msg-preview"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      display: 'block',
      marginBottom: 8,
      color: 'var(--nt-ink)',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "Mensaje a enviar"), message), /*#__PURE__*/React.createElement("button", {
    className: "nt-book-cta",
    onClick: handleSend,
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Icon.Whatsapp, null), " Enviar consulta por WhatsApp"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--nt-ink-soft)',
      marginTop: 12
    }
  }, "\uD83D\uDD12 Tu consulta no implica ning\xFAn compromiso. Te confirmamos disponibilidad y precio final antes de reservar."))));
}

// === Últimos lugares: cards estilo referente ===
function UltimosLugaresSection({
  packages,
  onSelect
}) {
  // Pick packages flagged ultimos-cupos / casi-completa, fallback: first 2 promos / first 2
  const ultimos = useMemo(() => {
    const urg = packages.filter(p => p.sellos?.includes('ultimos-cupos') || p.sellos?.includes('casi-completa') || p.salidas?.some(s => s.estado === 'ultimos-cupos' || s.estado === 'casi-completa'));
    if (urg.length >= 2) return urg.slice(0, 3);
    return [...urg, ...packages.filter(p => !urg.includes(p))].slice(0, 3);
  }, [packages]);
  if (ultimos.length === 0) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "nt-ultimos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-ultimos-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-ultimos-head nt-reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-ultimos-flag"
  }, "Apur\xE1te ahora"), /*#__PURE__*/React.createElement("h2", null, "\xDAltimos ", /*#__PURE__*/React.createElement("em", null, "lugares."))), /*#__PURE__*/React.createElement("div", {
    className: "nt-ultimos-grid"
  }, ultimos.map((p, i) => {
    const price = getPriceInfo(p);
    // For "últimos cupos" packages: show a faux original price 15% higher,
    // so the urgency-discount is visible even when no precioPromo is set.
    const isArs = price.currency === 'ARS';
    const oldPrice = price.old || (isArs ? Math.round(price.current * 1.15 / 10000) * 10000 - 1 : null);
    const pct = oldPrice ? Math.round((1 - price.current / oldPrice) * 100) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "nt-ultimos-card nt-reveal",
      key: p.id,
      onClick: () => onSelect(p),
      style: {
        transitionDelay: `${i * 50}ms`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "nt-ultimos-card-media"
    }, /*#__PURE__*/React.createElement(Ph, {
      kind: p.foto,
      label: `// ${p.destino}`
    }), /*#__PURE__*/React.createElement("span", {
      className: "nt-ultimos-card-flag"
    }, "\xDAltimos lugares"), pct && /*#__PURE__*/React.createElement("span", {
      className: "nt-ultimos-card-discount"
    }, "\u2212", pct, "%")), /*#__PURE__*/React.createElement("div", {
      className: "nt-ultimos-card-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "nt-ultimos-card-where"
    }, p.destino), /*#__PURE__*/React.createElement("h4", null, p.titulo), /*#__PURE__*/React.createElement("span", {
      className: "nt-ultimos-card-meta"
    }, p.duracion, " \xB7 ", p.salidas[0].fecha), /*#__PURE__*/React.createElement("span", {
      className: "nt-ultimos-card-reason"
    }, "Precio rebajado por \xFAltimos cupos"), /*#__PURE__*/React.createElement("div", {
      className: "nt-ultimos-card-price"
    }, /*#__PURE__*/React.createElement("div", {
      className: "nt-ultimos-card-price-stack"
    }, oldPrice && /*#__PURE__*/React.createElement("span", {
      className: "old"
    }, formatPrice(oldPrice, price.currency)), /*#__PURE__*/React.createElement("span", {
      className: "now"
    }, formatPrice(price.current, price.currency))), /*#__PURE__*/React.createElement("span", {
      className: "more"
    }, "Ver m\xE1s \u2192"))));
  }))));
}

// === Destinos (todos) ===
const NT_DESTINO_LABELS = {
  'cataratas': 'Cataratas',
  'cataratas-brasil': 'Cataratas & Brasil',
  'mendoza': 'Mendoza',
  'salta': 'Salta & Jujuy',
  'termas': 'Termas de Río Hondo',
  'carlospaz': 'Carlos Paz',
  'federacion': 'Federación',
  'camboriu': 'Camboriú',
  'vina': 'Viña del Mar',
  'punta-este': 'Punta del Este',
  'talampaya': 'Talampaya',
  'bariloche': 'Bariloche',
  'puerto-varas': 'Puerto Varas',
  'catamarca': 'Catamarca',
  'merlo': 'Merlo · San Luis',
  'europa': 'Europa'
};
window.NT_DESTINO_LABELS = NT_DESTINO_LABELS;
function DestinosSection({
  packages,
  onNavigate
}) {
  const destinos = useMemo(() => {
    const map = new Map();
    packages.forEach(p => {
      if (!map.has(p.foto)) {
        map.set(p.foto, {
          foto: p.foto,
          count: 0
        });
      }
      map.get(p.foto).count++;
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [packages]);
  return /*#__PURE__*/React.createElement("section", {
    className: "nt-section nt-destinos-section",
    style: {
      paddingTop: 24,
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-section-head nt-reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "nt-section-eyebrow"
  }, "\xBFA d\xF3nde te llevamos?"), /*#__PURE__*/React.createElement("h2", {
    className: "nt-section-title"
  }, "Todos nuestros destinos")), /*#__PURE__*/React.createElement("a", {
    className: "nt-section-link",
    onClick: () => onNavigate('listado'),
    style: {
      cursor: 'pointer'
    }
  }, "Ver todos los paquetes")), /*#__PURE__*/React.createElement("div", {
    className: "nt-destinos-grid"
  }, destinos.map((d, i) => /*#__PURE__*/React.createElement("button", {
    key: d.foto,
    className: "nt-destino-card nt-reveal",
    style: {
      transitionDelay: `${i * 25}ms`
    },
    onClick: () => onNavigate('listado', null, null, d.foto)
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-destino-photo"
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: d.foto,
    label: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-destino-overlay",
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("div", {
    className: "nt-destino-body"
  }, /*#__PURE__*/React.createElement("h3", null, NT_DESTINO_LABELS[d.foto] || d.foto), /*#__PURE__*/React.createElement("div", {
    className: "nt-destino-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-destino-count"
  }, d.count, " ", d.count === 1 ? 'paquete' : 'paquetes'), /*#__PURE__*/React.createElement("span", {
    className: "nt-destino-arrow"
  }, /*#__PURE__*/React.createElement(Icon.Arrow, null))))))));
}

// === Servicios ===
function ServiciosSection({
  onNavigate,
  onWhatsapp
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "nt-servicios"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-servicios-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-servicios-head nt-reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-section-eyebrow"
  }, "Servicios"), /*#__PURE__*/React.createElement("h2", null, "M\xE1s all\xE1 de los paquetes.")), /*#__PURE__*/React.createElement("div", {
    className: "nt-servicios-grid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-servicio-card nt-reveal",
    onClick: onWhatsapp
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-servicio-icon"
  }, /*#__PURE__*/React.createElement(Icon.Map, null)), /*#__PURE__*/React.createElement("h3", null, "Turismo Receptivo"), /*#__PURE__*/React.createElement("p", null, "Recibimos contingentes de todo el pa\xEDs en Mar del Plata. Excursiones, traslados, hoteles y coordinaci\xF3n local con +25 a\xF1os de experiencia."), /*#__PURE__*/React.createElement("span", {
    className: "nt-servicio-link"
  }, "Consultar ", /*#__PURE__*/React.createElement(Icon.Arrow, null))), /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.com.ar",
    target: "_blank",
    rel: "noopener",
    className: "nt-servicio-card nt-servicio-card--red nt-reveal",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-servicio-icon"
  }, /*#__PURE__*/React.createElement(Icon.Solo, null)), /*#__PURE__*/React.createElement("h3", null, "Egresados"), /*#__PURE__*/React.createElement("p", null, "Viajes de egresados con todo incluido, coordinadores y la confianza de cientos de promociones que ya viajaron con nosotros."), /*#__PURE__*/React.createElement("span", {
    className: "nt-servicio-link"
  }, "Ir al sitio ", /*#__PURE__*/React.createElement(Icon.External, null))), /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.magnussistemas.com.ar/login",
    target: "_blank",
    rel: "noopener",
    className: "nt-servicio-card nt-servicio-card--cream nt-reveal",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-servicio-icon"
  }, /*#__PURE__*/React.createElement(Icon.Wallet, null)), /*#__PURE__*/React.createElement("h3", null, "Autogesti\xF3n"), /*#__PURE__*/React.createElement("p", null, "Pag\xE1 tus cuotas, descarg\xE1 comprobantes y consult\xE1 el estado de tu viaje desde nuestra app de autogesti\xF3n, sin tarjeta de cr\xE9dito."), /*#__PURE__*/React.createElement("span", {
    className: "nt-servicio-link"
  }, "Ingresar ", /*#__PURE__*/React.createElement(Icon.External, null))))));
}
Object.assign(window, {
  HomeScreen,
  ListadoScreen,
  DetalleScreen,
  WhatsappModal,
  Faq,
  UltimosLugaresSection,
  ServiciosSection,
  DestinosSection
});

// === Vista previa de paquetes (home) ===
function PaquetesPreview({
  packages,
  onNavigate,
  onSelect
}) {
  const [activeCat, setActiveCat] = useState('todos');
  const scrollerRef = React.useRef(null);

  // Top populares — si tenemos window.getPopularityScore, ordenar por eso; sino, los primeros
  const sorted = useMemo(() => {
    const score = window.getPopularityScore || (() => 0);
    let list = packages;
    if (activeCat !== 'todos') list = list.filter(p => p.categoria === activeCat);
    return [...list].sort((a, b) => score(b) - score(a)).slice(0, 8);
  }, [packages, activeCat]);
  const scroll = dir => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * (el.clientWidth * 0.8),
      behavior: 'smooth'
    });
  };
  const cats = (window.NT_CATEGORIES || []).slice(0, 6); // mostrar las primeras 6 para no saturar

  if (!window.PackageCardV2) {
    return null; // listado.jsx no se cargó
  }
  const Card = window.PackageCardV2;
  return /*#__PURE__*/React.createElement("section", {
    className: "pp-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-head nt-reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "pp-eyebrow"
  }, "Cat\xE1logo \xB7 ", packages.length, " paquetes"), /*#__PURE__*/React.createElement("h2", {
    className: "pp-title"
  }, "Ech\xE1 un vistazo a ", /*#__PURE__*/React.createElement("em", null, "nuestros viajes"), "."), /*#__PURE__*/React.createElement("p", {
    className: "pp-lede"
  }, "Salidas confirmadas, cuotas sin inter\xE9s y coordinador acompa\xF1ante. Estos son los m\xE1s elegidos de la temporada.")), /*#__PURE__*/React.createElement("button", {
    className: "pp-cta",
    onClick: () => onNavigate('listado')
  }, "Ver todos los paquetes", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
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
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pp-cats"
  }, /*#__PURE__*/React.createElement("button", {
    className: `pp-cat ${activeCat === 'todos' ? 'is-active' : ''}`,
    onClick: () => setActiveCat('todos')
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-cat-icon"
  }, "\u2605"), /*#__PURE__*/React.createElement("span", null, "Populares")), cats.filter(c => c.id !== 'todos').map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: `pp-cat ${activeCat === c.id ? 'is-active' : ''}`,
    onClick: () => setActiveCat(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-cat-icon"
  }, c.icon), /*#__PURE__*/React.createElement("span", null, c.nombre))), /*#__PURE__*/React.createElement("button", {
    className: "pp-cat pp-cat--ghost",
    onClick: () => onNavigate('listado')
  }, /*#__PURE__*/React.createElement("span", null, "+ Ver m\xE1s categor\xEDas"))), /*#__PURE__*/React.createElement("div", {
    className: "pp-scroller-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp-arrow pp-arrow--left",
    onClick: () => scroll(-1),
    "aria-label": "Anterior"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 5 8 12 15 19"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pp-scroller",
    ref: scrollerRef
  }, sorted.map(p => /*#__PURE__*/React.createElement("div", {
    className: "pp-card-slot",
    key: p.id
  }, /*#__PURE__*/React.createElement(Card, {
    pkg: p,
    onClick: onSelect,
    isFav: false,
    onToggleFav: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pp-card-slot pp-card-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp-card-end-btn",
    onClick: () => onNavigate('listado')
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-card-end-num"
  }, "+", Math.max(0, packages.length - 8)), /*#__PURE__*/React.createElement("span", {
    className: "pp-card-end-text"
  }, "paquetes m\xE1s"), /*#__PURE__*/React.createElement("span", {
    className: "pp-card-end-arrow"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "20",
    height: "20",
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
  })))))), /*#__PURE__*/React.createElement("button", {
    className: "pp-arrow pp-arrow--right",
    onClick: () => scroll(1),
    "aria-label": "Siguiente"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 5 16 12 9 19"
  }))))));
}
Object.assign(window, {
  PaquetesPreview
});
