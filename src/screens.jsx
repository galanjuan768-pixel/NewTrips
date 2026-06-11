/* global React, Card, Pills, Header, TopStrip, Footer, Fab, Sticker, Stamp, Ph, Icon, DifIcon, useReveal, formatPrice, getPriceInfo */
const { useState: useStateS, useMemo: useMemoS } = React;
const useState = useStateS;
const useMemo = useMemoS;

// ============ HOME ============
function HomeScreen({ packages, onSelect, onWhatsapp, onNavigate }) {
  useReveal();
  const PromoSections = window.HomePromoSections;
  const [heroSearch, setHeroSearch] = useState('');
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('listado', null, null, null, heroSearch.trim());
  };
  const featured = packages.slice(0, 3);
  const proximas = packages.slice(0, 6);
  const promosPaquetes = packages.filter((p) => p.temporadas?.includes('promociones'));
  const temporadasPrincipales = ['mayo-junio-26', 'vacaciones-invierno', 'agosto-diciembre', 'brasil', 'europa', 'fiestas', 'verano', 'marzo-abril-27'];
  return (
    <>
      <section className="nt-hero nt-hero--dark">
        <video className="nt-hero-video" autoPlay muted loop playsInline preload="auto" disableRemotePlayback aria-hidden ref={(v) => {if (v) {v.muted = true; v.defaultMuted = true; v.volume = 0;}}}>
          <source src="assets/hero.mp4#t=0.001" type="video/mp4" />
        </video>
        <div className="nt-hero-inner">
          <span className="nt-hero-tag">
            <span className="pulse"></span>
            Salidas confirmadas · Mayo del 26 a Abril del 27
          </span>

          <div className="nt-hero-stats">
            <div className="nt-stat-row">
              <span className="num"><span className="plus">+</span>10 años</span>
              <span className="label">Viajando <br />juntos</span>
            </div>
            <div className="nt-stat-row">
              <span className="num"><span className="plus">♥</span>Miles</span>
              <span className="label">De viajeros <br />felices</span>
            </div>
          </div>

          <h1>
            Elegí tu<br />
            próximo <span className="accent">viaje.</span>
          </h1>
          <p className="nt-hero-lede">
            Más de 40 paquetes grupales con bus o avión, todo incluido, salidas desde tu ciudad del interior bonaerense. Cuotas sin interés y coordinador acompañante. Vos viajás, nosotros nos ocupamos.
          </p>
          <div className="nt-hero-actions">
            <button className="nt-cta" onClick={() => onNavigate('listado')}>
              Ver paquetes <Icon.Arrow />
            </button>
            <button className="nt-cta nt-cta--ghost" onClick={() => onNavigate('listado')}>
              Ver destinos
            </button>
          </div>

          {/* Floating collage (hidden in dark hero via CSS) */}
          <img src="assets/logo-contorno.png" alt="" aria-hidden className="nt-hero-floatlogo" />
          <div className="nt-hero-collage" aria-hidden>
            <div className="nt-collage-item nt-floater" style={{ left: '2%', top: '8%', width: '34%', height: '58%', '--rot': '-3deg', transform: 'rotate(-3deg)' }}>
              <Ph kind="cataratas" label="// Cataratas del Iguazú" />
            </div>
            <div className="nt-collage-item nt-floater nt-floater--2" style={{ left: '38%', top: '22%', width: '28%', height: '48%', '--rot': '2deg', transform: 'rotate(2deg)' }}>
              <Ph kind="termas" label="// Termas Río Hondo" />
            </div>
            <div className="nt-collage-item nt-floater nt-floater--3" style={{ right: '18%', top: '4%', width: '24%', height: '52%', '--rot': '-1.5deg', transform: 'rotate(-1.5deg)' }}>
              <Ph kind="torre-eiffel" label="// Europa" />
            </div>
            <div className="nt-collage-item nt-floater nt-floater--4" style={{ right: '2%', bottom: '4%', width: '24%', height: '42%', '--rot': '4deg', transform: 'rotate(4deg)' }}>
              <Ph kind="camboriu" label="// Camboriú" />
            </div>
            <Stamp style={{ right: '6%', top: '38%' }}>VIAJÁS<br />SOLO ·<br />IGUAL<br />TARIFA</Stamp>
          </div>
        </div>
      </section>

      {/* === Buscador grande (debajo del hero) === */}
      <section className="nt-searchband">
        <div className="nt-searchband-inner nt-reveal">
          <span className="nt-searchband-eyebrow">Encontrá tu viaje</span>
          <h2 className="nt-searchband-title">¿A dónde querés ir?</h2>
          <p className="nt-searchband-sub">Escribí un destino y te mostramos los paquetes disponibles al instante.</p>
          <form className="nt-searchband-bar" onSubmit={handleSearchSubmit} role="search">
            <svg className="nt-searchband-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
            <input
              type="text"
              placeholder="Buscá un destino: Cataratas, Mendoza, Brasil…"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              aria-label="Buscar destino"
            />
            {heroSearch &&
              <button type="button" className="nt-searchband-clear" onClick={() => setHeroSearch('')} aria-label="Limpiar">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
              </button>
            }
            <button type="submit" className="nt-searchband-submit">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
              <span>Buscar</span>
            </button>
          </form>
          <div className="nt-searchband-tags">
            <span className="nt-searchband-tags-label">Populares:</span>
            {['Cataratas', 'Mendoza', 'Brasil', 'Bariloche', 'Termas', 'Europa'].map((tag) =>
              <button key={tag} className="nt-searchband-tag" onClick={() => onNavigate('listado', null, null, null, tag)}>{tag}</button>
            )}
          </div>
        </div>
      </section>

      {/* === Pagá en cuotas sin tarjeta (compacto) === */}
      <section className="nt-magnus nt-magnus--compact" id="magnus">
        <div className="nt-magnus-compact-inner">
          <div className="nt-magnus-compact-icon"><Icon.Wallet /></div>
          <div className="nt-magnus-compact-body nt-reveal">
            <span className="nt-magnus-eyebrow">No necesitás tarjeta</span>
            <h2>Pagá tu viaje <em>en cuotas sin interés</em>, sin tarjeta de crédito.</h2>
            <p>Pagás por QR, transferencia o en oficina. Vos elegís en cuántas cuotas, sin recargos ni tarjeta. Las cuotas van desde que hacés la reserva hasta 15 días antes de viajar.</p>
            <div className="nt-magnus-actions">
              <a href="https://newtrips.magnussistemas.com.ar/login" target="_blank" rel="noopener" className="nt-magnus-cta">
                <Icon.Wallet /> Ingresar a pagar <Icon.External />
              </a>
              <button className="nt-magnus-cta-secondary" onClick={onWhatsapp}>
                <Icon.Whatsapp /> Consultar
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* === Promociones (carruseles) === */}
      <section className="nt-promobands">
        <div className="nt-promobands-intro nt-reveal">
          <span className="nt-section-eyebrow" style={{ color: 'var(--nt-red)' }}>Promos vigentes</span>
          <h2 className="nt-section-title">Pagás <em>menos</em>. Viajás igual.</h2>
          <p className="nt-promobands-lede">Vigentes hasta el 30 de junio o agotar cupos. Tocá el título de cada promo para ver todos los paquetes de esa categoría.</p>
        </div>
        {PromoSections &&
          <PromoSections packages={packages} onSelect={onSelect} onNavigate={onNavigate} />
        }
      </section>

      {/* === Buscar por temporada === */}
      <section className="nt-section nt-temporadas-section nt-temporadas-section--cream" style={{ paddingTop: 56, paddingBottom: 64 }}>
        <div className="nt-section-head nt-reveal">
          <div>
            <span className="nt-section-eyebrow">Por temporada</span>
            <h2 className="nt-section-title">¿Cuándo querés viajar?</h2>
          </div>
          <a className="nt-section-link" onClick={() => onNavigate('listado')} style={{ cursor: 'pointer' }}>Ver todo el calendario</a>
        </div>
        <div className="ntw-grid">
          {temporadasPrincipales.map((tid, i) => {
            const tp = window.NT_TEMPORADAS.find((x) => x.id === tid);
            const count = packages.filter((p) => p.temporadas?.includes(tid)).length;
            return (
              <button
                key={tid}
                className="ntw-card nt-reveal"
                style={{ '--tp-color': tp.color, transitionDelay: `${i * 50}ms` }}
                onClick={() => onNavigate('listado', null, tid)}>

                <div className="ntw-media" aria-hidden>
                  <img src={`assets/photos/temporadas/${tid}.png`} alt="" loading="lazy" decoding="async" />
                  <span className="ntw-scrim"></span>
                  <span className="ntw-when">
                    <b>{tp.cuando || tp.eyebrow}</b>
                    {tp.anio && <i>{tp.anio}</i>}
                  </span>
                </div>
                <div className="ntw-body">
                  <span className="ntw-eyebrow"><span className="ntw-icon" aria-hidden>{tp.icon}</span>{tp.eyebrow}</span>
                  <h3>{tp.nombre}</h3>
                  <p>{tp.subtitulo}</p>
                  <span className="ntw-foot">
                    <span className="ntw-count">{count} {count === 1 ? 'paquete' : 'paquetes'}</span>
                    <span className="ntw-arrow"><Icon.Arrow /></span>
                  </span>
                </div>
              </button>);

          })}
        </div>
      </section>

      {/* === Todos nuestros destinos === */}
      <DestinosSection packages={packages} onNavigate={onNavigate} />

      {/* === Vista previa de la tienda de paquetes === */}
      <PaquetesPreview packages={packages} onNavigate={onNavigate} onSelect={onSelect} />

      {/* Highlight: viajás solo (simple) */}
      <section className="nt-highlight nt-highlight--simple" style={{ backgroundColor: "rgb(26, 20, 16)" }}>
        <div className="nt-highlight-inner nt-highlight-inner--simple">
          <div className="nt-reveal">
            <span className="nt-section-eyebrow" style={{ color: 'var(--nt-yellow)' }}>Nuestro diferencial</span>
            <h2>Viajás solo.<br />Pagás <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy', textDecorationThickness: '3px', textUnderlineOffset: '8px', color: "rgb(237, 28, 36)" }}>lo mismo</span>.</h2>
            <p>Si compartís habitación, pagás la misma tarifa que en base doble. Sin recargo por viajar solo. Te sumás al grupo y un coordinador te acompaña todo el viaje.</p>
            <div style={{ marginTop: 22 }}>
              <button className="nt-cta" style={{ backgroundColor: "rgb(237, 28, 36)", color: '#fff' }} onClick={() => onNavigate('listado')}>
                Ver paquetes con esta tarifa <Icon.Arrow />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciales */}
      <section className="nt-difs">
        <div className="nt-difs-inner">
          <div className="nt-difs-head nt-reveal">
            <h2>Por qué somos <em>tu próxima agencia.</em></h2>
          </div>
          <div className="nt-difs-grid">
            {window.NT_DIFERENCIALES.map((d, i) =>
            <div className="nt-dif nt-reveal" key={i} style={{ transitionDelay: `${i * 40}ms` }}>
                <div className="nt-dif-icon"><DifIcon name={d.icon} /></div>
                <h3>{d.titulo}</h3>
                <p>{d.subtitulo}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="nt-section">
        <div className="nt-section-head nt-reveal">
          <div>
            <span className="nt-section-eyebrow">Antes de viajar</span>
            <h2 className="nt-section-title">Preguntas frecuentes</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 12, maxWidth: 800 }}>
          {window.NT_FAQS.map((f, i) => <Faq key={i} q={f.q} a={f.a} />)}
        </div>
      </section>
    </>);

}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="nt-reveal" style={{ borderBottom: '1px solid var(--nt-line)', padding: '4px 0' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', textAlign: 'left', padding: '18px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 600, letterSpacing: '-0.01em'
      }}>
        {q}
        <span style={{
          width: 32, height: 32, borderRadius: '50%',
          background: open ? 'var(--nt-red)' : 'var(--nt-cream-warm)',
          color: open ? '#fff' : 'var(--nt-ink)',
          display: 'grid', placeItems: 'center',
          fontSize: 18, fontWeight: 600,
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}>{open ? '–' : '+'}</span>
      </button>
      {open && <p style={{ margin: '0 0 18px', maxWidth: 720, fontSize: 15, color: 'var(--nt-ink-soft)' }}>{a}</p>}
    </div>);

}

// ============ LISTADO ============
function ListadoScreen({ packages, onSelect, initialCategoria, initialTemporada, initialDestino }) {
  const [activeCat, setActiveCat] = useState(initialCategoria || 'todos');
  const [activeTemp, setActiveTemp] = useState(initialTemporada || 'todas');
  const [activeDest, setActiveDest] = useState(initialDestino || 'todos');
  const [transporte, setTransporte] = useState('todos'); // todos | bus | aereo
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('proxima'); // proxima | precio-asc | precio-desc
  useReveal();

  const filtered = useMemo(() => {
    let list = packages;
    if (activeCat !== 'todos') list = list.filter((p) => p.categoria === activeCat);
    if (activeTemp !== 'todas') list = list.filter((p) => p.temporadas?.includes(activeTemp));
    if (activeDest !== 'todos') list = list.filter((p) => p.foto === activeDest);
    if (transporte !== 'todos') list = list.filter((p) => p.transporte === transporte);
    if (search) list = list.filter((p) =>
    (p.titulo + p.destino + p.subtitulo).toLowerCase().includes(search.toLowerCase())
    );
    list = [...list];
    if (sort === 'precio-asc') list.sort((a, b) => getPriceInfo(a).current * (getPriceInfo(a).currency === 'USD' ? 1100 : 1) - getPriceInfo(b).current * (getPriceInfo(b).currency === 'USD' ? 1100 : 1));
    if (sort === 'precio-desc') list.sort((a, b) => getPriceInfo(b).current * (getPriceInfo(b).currency === 'USD' ? 1100 : 1) - getPriceInfo(a).current * (getPriceInfo(a).currency === 'USD' ? 1100 : 1));
    return list;
  }, [packages, activeCat, activeTemp, activeDest, transporte, search, sort]);

  const tempActiva = activeTemp !== 'todas' ? window.NT_TEMPORADAS.find((t) => t.id === activeTemp) : null;
  const destActivo = activeDest !== 'todos' ? packages.find((p) => p.foto === activeDest) : null;

  return (
    <>
      <Pills active={activeCat} onChange={setActiveCat} packages={packages} />

      {/* Temporada chips */}
      <div className="nt-temp-chips-wrap">
        <div className="nt-temp-chips">
          <button
            className={`nt-temp-chip ${activeTemp === 'todas' ? 'active' : ''}`}
            onClick={() => setActiveTemp('todas')}>
            
            <span>📅</span> Todo el año
            <span className="count">{packages.length}</span>
          </button>
          {window.NT_TEMPORADAS.map((t) => {
            const count = packages.filter((p) => p.temporadas?.includes(t.id)).length;
            if (count === 0) return null;
            return (
              <button
                key={t.id}
                className={`nt-temp-chip ${activeTemp === t.id ? 'active' : ''}`}
                style={activeTemp === t.id ? { background: t.color, borderColor: t.color, color: '#fff' } : {}}
                onClick={() => setActiveTemp(t.id)}>
                
                <span>{t.icon}</span> {t.nombre}
                <span className="count">{count}</span>
              </button>);

          })}
          <button
            className={`nt-temp-chip ${activeTemp === 'promociones' ? 'active' : ''}`}
            style={activeTemp === 'promociones' ? { background: 'var(--nt-red)', borderColor: 'var(--nt-red)', color: '#fff' } : { color: 'var(--nt-red)', borderColor: 'var(--nt-red)' }}
            onClick={() => setActiveTemp('promociones')}>
            
            <span>🏷</span> Promociones
            <span className="count">{packages.filter((p) => p.temporadas?.includes('promociones')).length}</span>
          </button>
        </div>
      </div>

      {tempActiva &&
      <div className="nt-temp-banner" style={{ background: tempActiva.bgColor, borderLeftColor: tempActiva.color }}>
          <div className="nt-temp-banner-inner">
            <span className="nt-temp-banner-icon" style={{ background: tempActiva.color }}>{tempActiva.icon}</span>
            <div>
              <span className="nt-temp-banner-eyebrow" style={{ color: tempActiva.color }}>{tempActiva.eyebrow}</span>
              <h2>{tempActiva.nombre}</h2>
              <p>{tempActiva.subtitulo}</p>
            </div>
            <button className="nt-temp-banner-clear" onClick={() => setActiveTemp('todas')}>
              <Icon.Close /> Quitar filtro
            </button>
          </div>
        </div>
      }

      <div className="nt-listing-layout">
        <aside className="nt-filters">
          <h4>Filtros</h4>
          <div className="nt-filters-section">
            <h4 style={{ fontSize: 12, marginBottom: 8 }}>Buscar</h4>
            <input
              type="text"
              placeholder="Destino o nombre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--nt-line)', borderRadius: 10, fontFamily: 'inherit', fontSize: 14 }} />
            
          </div>
          <div className="nt-filters-section">
            <h4 style={{ fontSize: 12, marginBottom: 8 }}>Transporte</h4>
            {[['todos', 'Todos'], ['bus', 'En bus'], ['aereo', 'En avión']].map(([v, label]) =>
            <label key={v} className="nt-filter-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" name="transporte" checked={transporte === v} onChange={() => setTransporte(v)} style={{ accentColor: 'var(--nt-red)' }} />
                  {label}
                </span>
                <span className="count">{v === 'todos' ? packages.length : packages.filter((p) => p.transporte === v).length}</span>
              </label>
            )}
          </div>
          <div className="nt-filters-section">
            <h4 style={{ fontSize: 12, marginBottom: 8 }}>Diferenciales</h4>
            {[
            ['viaja-solo', 'Viajás solo · igual tarifa'],
            ['family-plan', 'Family Plan'],
            ['piscina-climatizada', 'Piscina climatizada'],
            ['cupos-confirmados', 'Cupos confirmados'],
            ['tarifa-promo', 'Promo pago contado']].
            map(([sello, label]) =>
            <label key={sello} className="nt-filter-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" />
                  {label}
                </span>
                <span className="count">{packages.filter((p) => p.sellos.includes(sello)).length}</span>
              </label>
            )}
          </div>
          <div className="nt-filters-section">
            <h4 style={{ fontSize: 12, marginBottom: 8 }}>Mes de salida</h4>
            {['Mayo 26', 'Junio 26', 'Julio 26', 'Agosto 26', 'Septiembre 26', 'Octubre 26', 'Noviembre 26', 'Diciembre 26', 'Fiestas', 'Enero 27', 'Febrero 27'].map((m) =>
            <label key={m} className="nt-filter-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" /> {m}
                </span>
              </label>
            )}
          </div>
        </aside>

        <div>
          <div className="nt-listing-head">
            <div>
              <h1>{activeCat === 'todos' ? 'Todos los paquetes' : window.NT_CATEGORIES.find((c) => c.id === activeCat)?.nombre}</h1>
              <span className="count">{filtered.length} viajes encontrados</span>
            </div>
            <div className="nt-sort">
              <label htmlFor="sort">Ordenar por</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="proxima">Próxima salida</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>
          <div className="nt-grid">
            {filtered.map((p) => <Card key={p.id} pkg={p} onClick={onSelect} />)}
          </div>
          {filtered.length === 0 &&
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--nt-ink-soft)' }}>
              <p>Sin resultados con esos filtros. Probá con otra categoría.</p>
            </div>
          }
        </div>
      </div>
    </>);

}

// ============ DETALLE ============
function PaxStepper({ label, hint, value, min, max, onChange }) {
  return (
    <div className="nt-paxrow">
      <div className="nt-paxrow-label">
        <span className="nt-paxrow-title">{label}</span>
        {hint && <span className="nt-paxrow-hint">{hint}</span>}
      </div>
      <div className="nt-pax-controls">
        <button className="nt-pax-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Quitar ${label}`}>−</button>
        <span className="nt-pax-count">{value}</span>
        <button className="nt-pax-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Sumar ${label}`}>+</button>
      </div>
    </div>);
}

function DetalleScreen({ pkg, onBack, onWhatsapp }) {
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
  const quote = computeQuote(pkg, { adults, kids0a5, kids6a10, cama });
  const semicamaRate = ntRoomRate(pkg, occupants, false);
  const camaRate = ntRoomRate(pkg, occupants, true);

  const paxResumen = [
    `${adults} ${adults === 1 ? 'adulto' : 'adultos'}`,
    kids0a5 ? `${kids0a5} menor${kids0a5 > 1 ? 'es' : ''} (≤5)` : null,
    kids6a10 ? `${kids6a10} menor${kids6a10 > 1 ? 'es' : ''} (6-10)` : null,
  ].filter(Boolean).join(' · ');

  const handleBook = () => {
    onWhatsapp({
      pkg, selectedDate: pkg.salidas[selectedDate],
      adults, kids0a5, kids6a10, transportClass, cama,
      total: quote.total, currency: quote.currency, paxResumen,
    });
  };

  return (
    <div className="nt-detail">
      <button className="nt-detail-back" onClick={onBack}>← Volver al listado</button>

      <div className="nt-detail-hero">
        <Ph kind={pkg.foto} label={`// ${pkg.destino}`} />
        <div className="nt-detail-hero-overlay"></div>
        <div className="nt-detail-hero-content">
          <div className="nt-detail-hero-meta">
            <span>{pkg.duracion}</span>
            <span>{pkg.transporte === 'aereo' ? '✈ Vuelo directo' : '🚌 Bus premium'}</span>
            <span>{pkg.regimen}</span>
          </div>
          <h1>{pkg.titulo}</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginTop: 8, opacity: 0.92 }}>{pkg.destino}</div>
        </div>
        <div className="nt-detail-stickers">
          {pkg.sellos.map((s, i) => <Sticker key={s} tipo={s} tilt={i % 2 === 0 ? 1 : 2} />)}
        </div>
      </div>

      <div className="nt-detail-grid">
        <div>
          <div className="nt-detail-section">
            <h2>Qué incluye</h2>
            <div className="nt-includes-grid">
              <div className="nt-include-item">
                <span className="nt-include-icon">{pkg.transporte === 'aereo' ? '✈' : '🚌'}</span>
                <div>
                  <strong>{pkg.transporte === 'aereo' ? `Vuelos directos` : 'Bus ida y vuelta'}</strong>
                  {pkg.transporte === 'aereo' && pkg.aerolinea && <div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>{pkg.aerolinea}</div>}
                  {pkg.transporte === 'bus' && <div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>Semicama o coche cama</div>}
                </div>
              </div>
              <div className="nt-include-item">
                <span className="nt-include-icon">🏨</span>
                <div><strong>Hospedaje</strong><div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>{pkg.hotel}</div></div>
              </div>
              <div className="nt-include-item">
                <span className="nt-include-icon">🍽</span>
                <div><strong>Comidas</strong><div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>{pkg.regimen}</div></div>
              </div>
              <div className="nt-include-item">
                <span className="nt-include-icon">🗺</span>
                <div><strong>Excursiones</strong><div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>{pkg.excursiones.length} actividades incluidas</div></div>
              </div>
              <div className="nt-include-item">
                <span className="nt-include-icon">🏥</span>
                <div><strong>Asistencia Avril</strong><div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>Sin límite de edad</div></div>
              </div>
              <div className="nt-include-item">
                <span className="nt-include-icon">👥</span>
                <div><strong>Coordinador</strong><div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>Te acompaña todo el viaje</div></div>
              </div>
              <div className="nt-include-item">
                <span className="nt-include-icon">🍷</span>
                <div><strong>Servicio a bordo</strong><div style={{ fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 2 }}>Cena con vino · snacks · infusiones</div></div>
              </div>
              {pkg.destacado &&
              <div className="nt-include-item" style={{ background: 'var(--nt-red)', color: '#fff' }}>
                  <span className="nt-include-icon" style={{ background: '#fff', color: 'var(--nt-red)' }}>★</span>
                  <div><strong>Destacado</strong><div style={{ fontSize: 12, marginTop: 2, opacity: 0.9 }}>{pkg.destacado}</div></div>
                </div>
              }
            </div>
          </div>

          <div className="nt-detail-section">
            <h2>Excursiones incluidas</h2>
            <ol style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.7, columnCount: 2, columnGap: 32, columnRule: '1px dashed var(--nt-line)' }}>
              {pkg.excursiones.map((e, i) => <li key={i} style={{ breakInside: 'avoid', marginBottom: 6 }}>{e}</li>)}
            </ol>
          </div>

          <div className="nt-detail-section">
            <h2>Embarques</h2>
            <p style={{ color: 'var(--nt-ink-soft)', marginBottom: 12, fontSize: 14 }}>El bus pasa por estas ciudades. Sumate desde la más cercana, sin costo extra.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {pkg.embarques.map((e) =>
              <span key={e} style={{
                padding: '8px 14px', borderRadius: 999,
                background: 'var(--nt-cream-warm)',
                fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em'
              }}>{e}</span>
              )}
            </div>
          </div>

          <div className="nt-detail-section">
            <h2>Fechas de salida</h2>
            <div className="nt-departures">
              {pkg.salidas.map((s, i) =>
              <div
                key={i}
                className={`nt-departure ${selectedDate === i ? 'selected' : ''}`}
                onClick={() => setSelectedDate(i)}>
                
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: '2px solid', borderColor: selectedDate === i ? 'var(--nt-ink)' : 'var(--nt-line)',
                    display: 'grid', placeItems: 'center'
                  }}>
                      {selectedDate === i && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--nt-ink)' }}></span>}
                    </span>
                    <span className="nt-departure-date">{s.fecha}</span>
                  </div>
                  <span className={`nt-departure-status nt-departure-status--${s.estado}`}>
                    {window.NT_SELLOS[s.estado]?.texto || s.estado}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside>
          <div className="nt-book">
            {price.isPromo && <span className="nt-book-tag">⚡ Tarifa promo · Pago contado</span>}
            {!price.isPromo && pkg.sellos.includes('ultimos-cupos') && <span className="nt-book-tag">🔥 Últimos cupos disponibles</span>}
            {!price.isPromo && !pkg.sellos.includes('ultimos-cupos') && <span className="nt-book-tag">Precio por persona</span>}

            <div className="nt-book-perhead">
              {price.old &&
                <div className="nt-book-oldline">
                  <span className="nt-book-old">{formatPrice(price.old, price.currency)}</span>
                  {(() => {const pct = Math.round((1 - price.current / price.old) * 100);return pct > 3 ? <span className="nt-book-off">−{pct}%</span> : null;})()}
                </div>
              }
              <div className={`nt-book-price ${price.isPromo || price.old ? 'is-discount' : ''}`}>
                {formatPrice(price.current, price.currency)}
                <small> desde · por persona</small>
              </div>
            </div>

            <div className="nt-book-installments">
              <strong>Cuotas sin interés</strong> hasta 15 días antes de viajar. Reservás con seña, vas pagando.
            </div>

            <div className="nt-book-field">
              <label>Fecha de salida</label>
              <select value={selectedDate} onChange={(e) => setSelectedDate(parseInt(e.target.value))}>
                {pkg.salidas.map((s, i) => <option key={i} value={i}>{s.fecha} · {window.NT_SELLOS[s.estado]?.texto || ''}</option>)}
              </select>
            </div>

            {pkg.transporte === 'bus' && pkg.precioCama &&
            <div className="nt-book-field">
                <label>Servicio del bus</label>
                <select value={transportClass} onChange={(e) => setTransportClass(e.target.value)}>
                  <option value="semicama">Semicama · {formatPrice(semicamaRate, 'ARS')} p/p</option>
                  <option value="cocheCama">Coche cama · {formatPrice(camaRate, 'ARS')} p/p</option>
                </select>
              </div>
            }

            <div className="nt-book-field">
              <label>¿Quiénes viajan?</label>
              <div className="nt-paxbox">
                <PaxStepper label="Adultos" hint="13 años o más" value={adults} min={1} max={10} onChange={setAdults} />
                {hasKids && fp.menorHasta5 != null &&
                  <PaxStepper label="Menores hasta 5 años" hint={`Family Plan · ${formatPrice(fp.menorHasta5, 'ARS')} c/u`} value={kids0a5} min={0} max={6} onChange={setKids0a5} />
                }
                {hasKids && fp.menor6a10 != null &&
                  <PaxStepper label="Menores de 6 a 10 años" hint={`Family Plan · ${formatPrice(fp.menor6a10, 'ARS')} c/u`} value={kids6a10} min={0} max={6} onChange={setKids6a10} />
                }
              </div>
              {!hasKids && pkg.transporte !== 'aereo' &&
                <p className="nt-book-kidnote">¿Viajan menores? Consultanos por tarifas y disponibilidad para chicos.</p>
              }
              {hasKids && adults < 2 && (kids0a5 + kids6a10) > 0 &&
                <p className="nt-book-kidnote">ℹ️ Las tarifas de menores aplican compartiendo habitación con 2 adultos.</p>
              }
            </div>

            <div className="nt-quote">
              <div className="nt-quote-head">Detalle de tu reserva</div>
              <div className="nt-quote-rows">
                {quote.items.map((it, i) =>
                  <div className={`nt-quote-row ${it.discounted ? 'is-discount' : ''}`} key={i}>
                    <div className="nt-quote-row-label">
                      <span className="nt-quote-who">{it.label}</span>
                      {it.sub && <span className="nt-quote-tag">{it.sub}</span>}
                    </div>
                    <div className="nt-quote-row-amt">
                      {it.discounted && it.regular ? <span className="nt-quote-reg">{formatPrice(it.regular, quote.currency)}</span> : null}
                      <span className="nt-quote-amt">{formatPrice(it.amount, quote.currency)}</span>
                    </div>
                  </div>
                )}
                {quote.currency === 'USD' && (quote.impuestos > 0 || quote.cityTax > 0) &&
                  <div className="nt-quote-row nt-quote-row--tax">
                    <div className="nt-quote-row-label"><span className="nt-quote-who">Impuestos + tasas</span></div>
                    <div className="nt-quote-row-amt"><span className="nt-quote-amt">{formatPrice((quote.impuestos || 0) + (quote.cityTax || 0), 'USD')}</span></div>
                  </div>
                }
              </div>
              {quote.savings > 0 &&
                <div className="nt-quote-savings">
                  <span>🎉 Ahorrás</span>
                  <span className="nt-quote-savings-amt">{formatPrice(quote.savings, quote.currency)}</span>
                </div>
              }
              <div className="nt-quote-total">
                <div className="nt-quote-total-lbl">
                  <span>Total{quote.currency === 'USD' ? ' final' : ''}</span>
                  <small>{paxResumen}</small>
                </div>
                <span className="nt-quote-total-amt">{formatPrice(quote.total, quote.currency)}</span>
              </div>
            </div>

            <button className="nt-book-cta" onClick={handleBook}>
              <Icon.Whatsapp /> Reservar · consultar disponibilidad
            </button>
            <button className="nt-book-secondary">📥 Descargar itinerario PDF</button>

            <div className="nt-book-trust">
              <div className="row">Incauca Turismo · Leg. 12.379</div>
              <div className="row">Asistencia Avril sin límite de edad</div>
              <div className="row">Coordinador acompañante</div>
              <div className="row">Sin sorpresas: precio publicado = precio final*</div>
              <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>* + 1.5% gastos administrativos</div>
            </div>
          </div>
        </aside>
      </div>
    </div>);

}

// ============ WHATSAPP MODAL ============
function WhatsappModal({ inquiry, onClose }) {
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
  const quote = pkg ? computeQuote(pkg, { adults, kids0a5, kids6a10, cama }) : null;

  const paxResumen = [
    `${adults} ${adults === 1 ? 'adulto' : 'adultos'}`,
    kids0a5 ? `${kids0a5} menor${kids0a5 > 1 ? 'es' : ''} (≤5)` : null,
    kids6a10 ? `${kids6a10} menor${kids6a10 > 1 ? 'es' : ''} (6-10)` : null,
  ].filter(Boolean).join(' · ');

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

  return (
    <div className="nt-modal-backdrop" onClick={onClose}>
      <div className="nt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nt-modal-head">
          <button className="nt-modal-close" onClick={onClose}><Icon.Close /></button>
          <h3>{pkg ? 'Consultar este paquete' : 'Consultá lo que necesites'}</h3>
          <p>Te conectamos con un asesor por WhatsApp en menos de 5 minutos. Respondemos de Lun a Sab 9 a 20hs.</p>
        </div>
        <div className="nt-modal-body">
          {pkg &&
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: 'var(--nt-cream-warm)', borderRadius: 12, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <Ph kind={pkg.foto} label="" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, lineHeight: 1.1, marginBottom: 2 }}>{pkg.titulo}</div>
                <div style={{ fontSize: 12, color: 'var(--nt-ink-soft)' }}>{pkg.destino} · {pkg.duracion}</div>
              </div>
            </div>
          }

          <div className="nt-book-field"><label>Tu nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: María" />
          </div>

          {pkg &&
          <>
              <div className="nt-book-field"><label>Fecha de salida</label>
                <select value={fechaSalida} onChange={(e) => setFechaSalida(e.target.value)}>
                  {pkg.salidas.map((s, i) => <option key={i} value={s.fecha}>{s.fecha} · {window.NT_SELLOS[s.estado]?.texto}</option>)}
                </select>
              </div>
              <div className="nt-book-field"><label>Pasajeros</label>
                <div className="nt-paxbox">
                  <PaxStepper label="Adultos" hint="13 años o más" value={adults} min={1} max={10} onChange={setAdults} />
                  {hasKids && fp.menorHasta5 != null &&
                    <PaxStepper label="Menores hasta 5 años" hint="Family Plan" value={kids0a5} min={0} max={6} onChange={setKids0a5} />
                  }
                  {hasKids && fp.menor6a10 != null &&
                    <PaxStepper label="Menores de 6 a 10 años" hint="Family Plan" value={kids6a10} min={0} max={6} onChange={setKids6a10} />
                  }
                </div>
              </div>
              <div className="nt-book-field"><label>Habitación</label>
                <select value={habitacion} onChange={(e) => setHabitacion(e.target.value)}>
                  <option value="compartida">Compartida — igual tarifa que base doble</option>
                  <option value="doble">Doble — viajo en pareja</option>
                  <option value="individual">Individual — consultar suplemento</option>
                </select>
              </div>
              <div className="nt-book-field"><label>Embarque</label>
                <select value={embarque} onChange={(e) => setEmbarque(e.target.value)}>
                  <option value="">Elegí tu ciudad</option>
                  {pkg.embarques.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </>
          }

          {pkg && quote &&
            <div className="nt-modal-total">
              <div className="nt-modal-total-lbl">
                <span>Total estimado</span>
                <small>{paxResumen}</small>
              </div>
              <div className="nt-modal-total-amt">
                {quote.savings > 0 && <span className="nt-modal-total-save">Ahorrás {formatPrice(quote.savings, quote.currency)}</span>}
                <span>{formatPrice(quote.total, quote.currency)}</span>
              </div>
            </div>
          }

          <div className="nt-msg-preview">
            <strong style={{ display: 'block', marginBottom: 8, color: 'var(--nt-ink)', fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Mensaje a enviar</strong>
            {message}
          </div>

          <button className="nt-book-cta" onClick={handleSend} style={{ marginTop: 18 }}>
            <Icon.Whatsapp /> Enviar consulta por WhatsApp
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--nt-ink-soft)', marginTop: 12 }}>
            🔒 Tu consulta no implica ningún compromiso. Te confirmamos disponibilidad y precio final antes de reservar.
          </p>
        </div>
      </div>
    </div>);

}

// === Últimos lugares: cards estilo referente ===
function UltimosLugaresSection({ packages, onSelect }) {
  // Pick packages flagged ultimos-cupos / casi-completa, fallback: first 2 promos / first 2
  const ultimos = useMemo(() => {
    const urg = packages.filter((p) =>
    p.sellos?.includes('ultimos-cupos') ||
    p.sellos?.includes('casi-completa') ||
    p.salidas?.some((s) => s.estado === 'ultimos-cupos' || s.estado === 'casi-completa')
    );
    if (urg.length >= 2) return urg.slice(0, 3);
    return [...urg, ...packages.filter((p) => !urg.includes(p))].slice(0, 3);
  }, [packages]);

  if (ultimos.length === 0) return null;

  return (
    <section className="nt-ultimos">
      <div className="nt-ultimos-inner">
        <div className="nt-ultimos-head nt-reveal">
          <span className="nt-ultimos-flag">Apuráte ahora</span>
          <h2>Últimos <em>lugares.</em></h2>
        </div>
        <div className="nt-ultimos-grid">
          {ultimos.map((p, i) => {
            const price = getPriceInfo(p);
            // For "últimos cupos" packages: show a faux original price 15% higher,
            // so the urgency-discount is visible even when no precioPromo is set.
            const isArs = price.currency === 'ARS';
            const oldPrice = price.old || (isArs ? Math.round(price.current * 1.15 / 10000) * 10000 - 1 : null);
            const pct = oldPrice ? Math.round((1 - price.current / oldPrice) * 100) : null;
            return (
              <div className="nt-ultimos-card nt-reveal" key={p.id} onClick={() => onSelect(p)} style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="nt-ultimos-card-media">
                  <Ph kind={p.foto} label={`// ${p.destino}`} />
                  <span className="nt-ultimos-card-flag">Últimos lugares</span>
                  {pct && <span className="nt-ultimos-card-discount">−{pct}%</span>}
                </div>
                <div className="nt-ultimos-card-body">
                  <span className="nt-ultimos-card-where">{p.destino}</span>
                  <h4>{p.titulo}</h4>
                  <span className="nt-ultimos-card-meta">{p.duracion} · {p.salidas[0].fecha}</span>
                  <span className="nt-ultimos-card-reason">Precio rebajado por últimos cupos</span>
                  <div className="nt-ultimos-card-price">
                    <div className="nt-ultimos-card-price-stack">
                      {oldPrice && <span className="old">{formatPrice(oldPrice, price.currency)}</span>}
                      <span className="now">{formatPrice(price.current, price.currency)}</span>
                    </div>
                    <span className="more">Ver más →</span>
                  </div>
                </div>
              </div>);
          })}
        </div>
      </div>
    </section>);
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
function DestinosSection({ packages, onNavigate }) {
  const destinos = useMemo(() => {
    const map = new Map();
    packages.forEach((p) => {
      if (!map.has(p.foto)) {
        map.set(p.foto, { foto: p.foto, count: 0 });
      }
      map.get(p.foto).count++;
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [packages]);

  return (
    <section className="nt-section nt-destinos-section" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="nt-section-head nt-reveal">
        <div>
          <span className="nt-section-eyebrow">¿A dónde te llevamos?</span>
          <h2 className="nt-section-title">Todos nuestros destinos</h2>
        </div>
        <a className="nt-section-link" onClick={() => onNavigate('listado')} style={{ cursor: 'pointer' }}>Ver todos los paquetes</a>
      </div>
      <div className="nt-destinos-grid">
        {destinos.map((d, i) =>
        <button
          key={d.foto}
          className="nt-destino-card nt-reveal"
          style={{ transitionDelay: `${i * 25}ms` }}
          onClick={() => onNavigate('listado', null, null, d.foto)}>
            <div className="nt-destino-photo">
              <Ph kind={d.foto} label="" />
            </div>
            <div className="nt-destino-overlay" aria-hidden></div>
            <div className="nt-destino-body">
              <h3>{NT_DESTINO_LABELS[d.foto] || d.foto}</h3>
              <div className="nt-destino-foot">
                <span className="nt-destino-count">{d.count} {d.count === 1 ? 'paquete' : 'paquetes'}</span>
                <span className="nt-destino-arrow"><Icon.Arrow /></span>
              </div>
            </div>
          </button>
        )}
      </div>
    </section>);
}

// === Servicios ===
function ServiciosSection({ onNavigate, onWhatsapp }) {
  return (
    <section className="nt-servicios">
      <div className="nt-servicios-inner">
        <div className="nt-servicios-head nt-reveal">
          <span className="nt-section-eyebrow">Servicios</span>
          <h2>Más allá de los paquetes.</h2>
        </div>
        <div className="nt-servicios-grid">
          <button className="nt-servicio-card nt-reveal" onClick={onWhatsapp}>
            <div className="nt-servicio-icon"><Icon.Map /></div>
            <h3>Turismo Receptivo</h3>
            <p>Recibimos contingentes de todo el país en Mar del Plata. Excursiones, traslados, hoteles y coordinación local con +25 años de experiencia.</p>
            <span className="nt-servicio-link">Consultar <Icon.Arrow /></span>
          </button>

          <a href="https://newtrips.com.ar" target="_blank" rel="noopener" className="nt-servicio-card nt-servicio-card--red nt-reveal" style={{ textDecoration: 'none' }}>
            <div className="nt-servicio-icon"><Icon.Solo /></div>
            <h3>Egresados</h3>
            <p>Viajes de egresados con todo incluido, coordinadores y la confianza de cientos de promociones que ya viajaron con nosotros.</p>
            <span className="nt-servicio-link">Ir al sitio <Icon.External /></span>
          </a>

          <a href="https://newtrips.magnussistemas.com.ar/login" target="_blank" rel="noopener" className="nt-servicio-card nt-servicio-card--cream nt-reveal" style={{ textDecoration: 'none' }}>
            <div className="nt-servicio-icon"><Icon.Wallet /></div>
            <h3>Autogestión</h3>
            <p>Pagá tus cuotas, descargá comprobantes y consultá el estado de tu viaje desde nuestra app de autogestión, sin tarjeta de crédito.</p>
            <span className="nt-servicio-link">Ingresar <Icon.External /></span>
          </a>
        </div>
      </div>
    </section>);
}

Object.assign(window, { HomeScreen, ListadoScreen, DetalleScreen, WhatsappModal, Faq, UltimosLugaresSection, ServiciosSection, DestinosSection });

// === Vista previa de paquetes (home) ===
function PaquetesPreview({ packages, onNavigate, onSelect }) {
  const [activeCat, setActiveCat] = useState('todos');
  const scrollerRef = React.useRef(null);

  // Top populares — si tenemos window.getPopularityScore, ordenar por eso; sino, los primeros
  const sorted = useMemo(() => {
    const score = window.getPopularityScore || (() => 0);
    let list = packages;
    if (activeCat !== 'todos') list = list.filter((p) => p.categoria === activeCat);
    return [...list].sort((a, b) => score(b) - score(a)).slice(0, 8);
  }, [packages, activeCat]);

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  const cats = (window.NT_CATEGORIES || []).slice(0, 6); // mostrar las primeras 6 para no saturar

  if (!window.PackageCardV2) {
    return null; // listado.jsx no se cargó
  }
  const Card = window.PackageCardV2;

  return (
    <section className="pp-section">
      <div className="pp-inner">
        <div className="pp-head nt-reveal">
          <div>
            <span className="pp-eyebrow">Catálogo · {packages.length} paquetes</span>
            <h2 className="pp-title">
              Echá un vistazo a <em>nuestros viajes</em>.
            </h2>
            <p className="pp-lede">
              Salidas confirmadas, cuotas sin interés y coordinador acompañante. Estos son los más elegidos de la temporada.
            </p>
          </div>
          <button className="pp-cta" onClick={() => onNavigate('listado')}>
            Ver todos los paquetes
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 5 19 12 13 19"/></svg>
          </button>
        </div>

        <div className="pp-cats">
          <button
            className={`pp-cat ${activeCat === 'todos' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('todos')}>
            <span className="pp-cat-icon">★</span>
            <span>Populares</span>
          </button>
          {cats.filter((c) => c.id !== 'todos').map((c) => (
            <button
              key={c.id}
              className={`pp-cat ${activeCat === c.id ? 'is-active' : ''}`}
              onClick={() => setActiveCat(c.id)}>
              <span className="pp-cat-icon">{c.icon}</span>
              <span>{c.nombre}</span>
            </button>
          ))}
          <button
            className="pp-cat pp-cat--ghost"
            onClick={() => onNavigate('listado')}>
            <span>+ Ver más categorías</span>
          </button>
        </div>

        <div className="pp-scroller-wrap">
          <button className="pp-arrow pp-arrow--left" onClick={() => scroll(-1)} aria-label="Anterior">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 5 8 12 15 19"/></svg>
          </button>
          <div className="pp-scroller" ref={scrollerRef}>
            {sorted.map((p) => (
              <div className="pp-card-slot" key={p.id}>
                <Card pkg={p} onClick={onSelect} isFav={false} onToggleFav={() => {}} />
              </div>
            ))}
            <div className="pp-card-slot pp-card-end">
              <button className="pp-card-end-btn" onClick={() => onNavigate('listado')}>
                <span className="pp-card-end-num">+{Math.max(0, packages.length - 8)}</span>
                <span className="pp-card-end-text">paquetes más</span>
                <span className="pp-card-end-arrow">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 5 19 12 13 19"/></svg>
                </span>
              </button>
            </div>
          </div>
          <button className="pp-arrow pp-arrow--right" onClick={() => scroll(1)} aria-label="Siguiente">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 5 16 12 9 19"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PaquetesPreview });