/* global React, ReactDOM, HomeScreen, ListadoScreen, DetalleScreen, WhatsappModal, Header, TopStrip, Fab, Footer */
const useStateA = React.useState;
const useEffectA = React.useEffect;
const THEME = {
  "rojo": "#ED1C24",
  "intensidadSellos": "media",
  "vibe": "vibrante",
  "animaciones": true,
  "fontDisplay": "Bricolage Grotesque",
  "view": "auto",
  "tempStyle": "colorido",
  "tempLayout": "foto",
  "promoStyle": "blocks"
};
function App() {
  const t = THEME;
  const [screen, setScreen] = useStateA('home');
  const [selectedPkg, setSelectedPkg] = useStateA(null);
  const [initialCat, setInitialCat] = useStateA('todos');
  const [initialTemp, setInitialTemp] = useStateA('todas');
  const [initialDest, setInitialDest] = useStateA('todos');
  const [initialPromo, setInitialPromo] = useStateA('todas');
  const [initialSearch, setInitialSearch] = useStateA('');
  const [whatsappInquiry, setWhatsappInquiry] = useStateA(null);
  const [showWhatsapp, setShowWhatsapp] = useStateA(false);
  useEffectA(() => {
    document.documentElement.style.setProperty('--nt-red', t.rojo);
    document.documentElement.style.setProperty('--nt-red-dark', t.rojo);
  }, [t.rojo]);
  useEffectA(() => {
    const fontMap = {
      'Bricolage Grotesque': "'Bricolage Grotesque', system-ui, sans-serif",
      'Familjen Grotesk': "'Familjen Grotesk', system-ui, sans-serif",
      'Fraunces': "'Fraunces', Georgia, serif"
    };
    document.documentElement.style.setProperty('--font-display', fontMap[t.fontDisplay] || fontMap['Bricolage Grotesque']);
  }, [t.fontDisplay]);
  useEffectA(() => {
    document.body.classList.toggle('no-anim', !t.animaciones);
    document.body.classList.toggle('view-mobile', t.view === 'mobile');
  }, [t.animaciones, t.view]);
  useEffectA(() => {
    const styles = ['pastel', 'colorido', 'crema'];
    styles.forEach(s => document.body.classList.toggle(`temp-style-${s}`, t.tempStyle === s));
  }, [t.tempStyle]);
  useEffectA(() => {
    const layouts = ['foto', 'agenda', 'revista'];
    layouts.forEach(l => document.body.classList.toggle(`temp-layout-${l}`, t.tempLayout === l));
  }, [t.tempLayout]);
  useEffectA(() => {
    const styles = ['clean', 'blocks', 'giant', 'postal'];
    styles.forEach(s => document.body.classList.toggle(`promo-style-${s}`, t.promoStyle === s));
  }, [t.promoStyle]);
  useEffectA(() => {
    window.scrollTo(0, 0);
  }, [screen, selectedPkg]);
  useEffectA(() => {
    const onScroll = () => {
      document.body.classList.toggle('nt-scrolled', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffectA(() => {
    document.body.classList.toggle('nt-home', screen === 'home');
  }, [screen]);
  const handleNavigate = (s, cat, temp, dest, search, promo) => {
    setScreen(s);
    if (cat) setInitialCat(cat);else if (s === 'listado' && !temp && !dest && !promo) setInitialCat('todos');
    if (temp) setInitialTemp(temp);else if (s === 'listado' && !cat && !dest && !promo) setInitialTemp('todas');
    if (dest) setInitialDest(dest);else if (s === 'listado') setInitialDest('todos');
    if (s === 'listado') setInitialPromo(promo || 'todas');
    if (s === 'listado') setInitialSearch(search || '');
  };
  const handleSelect = pkg => {
    setSelectedPkg(pkg);
    setScreen('detalle');
  };
  const handleWhatsapp = inquiry => {
    setWhatsappInquiry(inquiry || null);
    setShowWhatsapp(true);
  };
  const packages = window.NT_PACKAGES;
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-app",
    "data-screen-label": screen
  }, /*#__PURE__*/React.createElement(TopStrip, null), /*#__PURE__*/React.createElement(Header, {
    onNavigate: handleNavigate,
    onWhatsapp: () => handleWhatsapp(null),
    current: screen
  }), screen === 'home' && /*#__PURE__*/React.createElement(HomeScreen, {
    packages: packages,
    onSelect: handleSelect,
    onWhatsapp: () => handleWhatsapp(null),
    onNavigate: handleNavigate
  }), screen === 'listado' && /*#__PURE__*/React.createElement(ListadoScreen, {
    packages: packages,
    onSelect: handleSelect,
    initialCategoria: initialCat,
    initialTemporada: initialTemp,
    initialDestino: initialDest,
    initialPromo: initialPromo,
    initialSearch: initialSearch,
    key: `${initialCat}-${initialTemp}-${initialDest}-${initialPromo}-${initialSearch}`
  }), screen === 'detalle' && selectedPkg && /*#__PURE__*/React.createElement(DetalleScreen, {
    pkg: selectedPkg,
    onBack: () => setScreen('listado'),
    onWhatsapp: inq => handleWhatsapp(inq || {
      pkg: selectedPkg
    })
  }), /*#__PURE__*/React.createElement(Footer, {
    onNavigate: handleNavigate
  }), /*#__PURE__*/React.createElement(Fab, {
    onClick: () => handleWhatsapp(null)
  }), showWhatsapp && /*#__PURE__*/React.createElement(WhatsappModal, {
    inquiry: whatsappInquiry,
    onClose: () => setShowWhatsapp(false)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
