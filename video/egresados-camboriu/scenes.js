/* New Trips · Egresados CAMBORIÚ — un solo destino, mucha animación. Rojo y blanco.
   1080×1920, 24 s, 120 BPM. Cierre: agendar una reunión. */
(function () {
  const { W, H, C, NS, BEAT, lerp, prog, E, hash, kick, h, tf, mb, fit, svg, CHECK, scene, SAFE_TOP, SAFE_BOTTOM, EG_IMG, confetti, renderConfetti, endCard, finish } = NTV;
  const WHITE = '#FFFFFF', RED = C.red;
  const PHOTO_WHEEL = '../../assets/photos/camboriu.png'; // Camboriú con la vuelta al mundo (repo)
  const PHOTO_SITE = EG_IMG('camboriu'); // Camboriú desde el agua (egresados.html)
  const svgEl = (parent, w = W, hh = H) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', `0 0 ${w} ${hh}`); s.setAttribute('width', w); s.setAttribute('height', hh);
    Object.assign(s.style, { position: 'absolute', left: '0', top: '0' });
    parent.appendChild(s);
    return s;
  };

  // ======================================================================
  // S1 · 0–3 s · "CAMBORIÚ" letra por letra + "TE ESPERA" + sol con rayos girando
  // ======================================================================
  const s1 = scene(0, 3.0);
  const sun1 = svgEl(s1.el);
  sun1.innerHTML = `<g id="rays">${Array.from({ length: 24 }, (_, k) => `<rect x="-12" y="-560" width="24" height="170" rx="12" fill="${WHITE}" opacity=".9" transform="rotate(${k * 15})"/>`).join('')}</g><circle r="330" fill="${WHITE}"/>`;
  const rays = sun1.querySelector('#rays');
  const lab1 = h('div', { cls: 'mono abs', text: 'VIAJE DE EGRESADOS · SECUNDARIA', style: { left: '0', width: W + 'px', textAlign: 'center', top: SAFE_TOP + 'px', fontSize: '28px', color: WHITE } }, s1.el);
  const word1 = h('div', { cls: 'disp abs', style: { left: '60px', top: SAFE_TOP + 70 + 'px', color: WHITE, whiteSpace: 'nowrap' } }, s1.el);
  const letters = 'CAMBORIÚ'.split('').map((ch) => h('span', { text: ch, style: { display: 'inline-block', transformOrigin: '50% 100%' } }, word1));
  const pill1 = h('div', { cls: 'abs', text: 'TE ESPERA', style: { left: '50%', background: WHITE, color: RED, padding: '18px 44px', borderRadius: '999px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '76px', whiteSpace: 'nowrap', transformOrigin: '50% 50%', boxShadow: '0 18px 40px rgba(120,0,6,.35)' } }, s1.el);
  const conf1 = confetti(s1.el, 70, 11);
  s1.prepare = () => {
    const fs = fit(word1, 960);
    pill1.style.top = SAFE_TOP + 70 + fs * 0.86 + 40 + 'px';
    pill1.style.marginLeft = -pill1.offsetWidth / 2 + 'px';
  };
  s1.render = (lt) => {
    const es = E.outExpo(prog(lt, 0, 1.0));
    sun1.querySelector('circle').setAttribute('transform', `translate(540 ${lerp(2300, 1500, es)}) scale(${1 + kick(lt, Math.floor(lt * 2) / 2, 8) * 0.03})`);
    rays.setAttribute('transform', `translate(540 ${lerp(2300, 1500, es)}) rotate(${lt * 25})`);
    tf(lab1, { o: prog(lt, 0.05, 0.25) });
    letters.forEach((l, i) => {
      const a = 0.1 + i * 0.07, m = E.outBack(prog(lt, a, a + 0.35));
      tf(l, { y: lerp(-700, 0, E.outExpo(prog(lt, a, a + 0.3))), r: lerp((i % 2 ? 1 : -1) * 30, 0, m), sy: 1 + kick(lt, a + 0.3, 14) * 0.18 - kick(lt, a + 0.3, 14) * 0.18 * 0, sx: 1 - kick(lt, a + 0.3, 14) * 0.12, o: prog(lt, a, a + 0.04) });
    });
    const p = E.outBack(prog(lt, 0.9, 1.25));
    tf(pill1, { s: p * (1 + kick(lt, 1.5, 10) * 0.06 + kick(lt, 2.0, 10) * 0.06), r: lerp(-25, -3, p) + Math.sin(lt * 7) * 0.8, o: p > 0.01 ? 1 : 0 });
    renderConfetti(conf1, lt, 0.95, 540, 1000, 11, 3.2);
  };

  // ======================================================================
  // S2 · 3–6,5 s · Ruta animada: Mar del Plata → Camboriú, sello de llegada
  // ======================================================================
  const s2 = scene(3.0, 6.5);
  const t2 = h('div', { cls: 'disp abs', html: 'DE MAR DEL PLATA<br>A CAMBORIÚ', style: { left: '60px', top: SAFE_TOP - 10 + 'px', color: RED, lineHeight: '.9' } }, s2.el);
  const map2 = svgEl(s2.el);
  const RT = 'M 240 1200 C 140 1060, 520 1080, 470 960 S 700 800, 820 780';
  let clouds = '';
  for (let k = 0; k < 4; k++) clouds += `<g class="cl" data-k="${k}"><ellipse cx="0" cy="0" rx="90" ry="34" fill="none" stroke="rgba(237,28,36,.25)" stroke-width="5"/><ellipse cx="50" cy="-18" rx="56" ry="30" fill="#fff" stroke="rgba(237,28,36,.25)" stroke-width="5"/></g>`;
  map2.innerHTML = `<defs><mask id="rm" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><path id="rmp" d="${RT}" fill="none" stroke="#fff" stroke-width="40"/></mask></defs>${clouds}
    <path d="${RT}" fill="none" stroke="rgba(237,28,36,.15)" stroke-width="10" stroke-linecap="round"/>
    <path id="rt" d="${RT}" fill="none" stroke="${RED}" stroke-width="12" stroke-linecap="round" stroke-dasharray="2 26" mask="url(#rm)"/>
    <circle cx="240" cy="1200" r="22" fill="${RED}"/><circle cx="240" cy="1200" r="10" fill="#fff"/>`;
  const rt = map2.querySelector('#rt'), rmp = map2.querySelector('#rmp'), cls = [...map2.querySelectorAll('.cl')];
  const from2 = h('div', { cls: 'abs', html: '<b style="font-family:\'Bricolage Grotesque\';font-size:44px">Mar del Plata</b><br><span class="mono" style="font-size:22px">SALIDA</span>', style: { left: '285px', top: '1180px', color: RED, lineHeight: '1.1' } }, s2.el);
  const dot2 = h('div', { cls: 'abs', style: { left: '-30px', top: '-30px', width: '60px', height: '60px', borderRadius: '50%', background: RED, border: '8px solid #fff', boxSizing: 'border-box', boxShadow: '0 8px 20px rgba(237,28,36,.5)' } }, s2.el);
  const stamp2 = h('div', {
    cls: 'abs', html: `<div class="mono" style="font-size:22px">LLEGADA</div><div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:58px;line-height:1">CAMBORIÚ</div><div class="mono" style="font-size:22px">BRASIL</div>`,
    style: { left: 820 - 170 + 'px', top: 780 - 170 + 'px', width: '340px', height: '340px', borderRadius: '50%', border: `10px solid ${RED}`, boxSizing: 'border-box', color: RED, background: 'rgba(255,255,255,.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transformOrigin: '50% 50%' },
  }, s2.el);
  let RT_LEN = 1;
  s2.prepare = () => { fit(t2, 960); RT_LEN = rt.getTotalLength(); };
  s2.render = (lt) => {
    const e = E.outExpo(prog(lt, 0, 0.4));
    tf(t2, { x: lerp(-1150, 0, e) }); mb(t2, lerp(60, 0, e), 0);
    cls.forEach((c, k) => c.setAttribute('transform', `translate(${((k * 330 + lt * 60) % 1300) - 150} ${620 + k * 170})`));
    tf(from2, { o: prog(lt, 0.2, 0.4) });
    const p = E.inOutCubic(prog(lt, 0.4, 2.2));
    rmp.setAttribute('stroke-dasharray', `${(RT_LEN * p).toFixed(1)} ${RT_LEN + 10}`);
    const pt = rt.getPointAtLength(RT_LEN * p);
    tf(dot2, { x: pt.x, y: pt.y - 6 - Math.abs(Math.sin(lt * 12)) * 14, s: 1 + Math.sin(lt * 12) * 0.05, o: prog(lt, 0.35, 0.45) });
    const st = E.outExpo(prog(lt, 2.25, 2.45));
    tf(stamp2, { s: lerp(2.6, 1, st) * (1 + kick(lt, 2.45, 12) * 0.08), r: lerp(-50, -12, st), o: prog(lt, 2.25, 2.3) });
  };

  // ======================================================================
  // S3 · 6,5–10 s · La foto se arma en tiras + stickers que saltan en cada beat
  // ======================================================================
  const s3 = scene(6.5, 10.0);
  const N3 = 5, SW = W / N3;
  const slices = Array.from({ length: N3 }, (_, i) => {
    const sl = h('div', { cls: 'abs', style: { left: i * SW + 'px', top: '0', width: SW + 1 + 'px', height: H + 'px', overflow: 'hidden' } }, s3.el);
    const im = h('img', { src: PHOTO_WHEEL, style: { position: 'absolute', left: -i * SW + 'px', top: '0', width: W + 'px', height: H + 'px', objectFit: 'cover', objectPosition: '24% 50%', transformOrigin: `${540 - i * SW}px 50%` } }, sl);
    return { sl, im };
  });
  h('div', { cls: 'layer', style: { background: 'linear-gradient(180deg, rgba(237,28,36,.55) 0%, rgba(237,28,36,0) 30%, rgba(237,28,36,0) 60%, rgba(237,28,36,.7) 100%)' } }, s3.el);
  const STK = [['SOL', -8, 140, 380], ['PLAYA', 6, 520, 560], ['AMIGOS', -4, 120, 820], ['¡TU PROMO!', 5, 380, 1060]].map(([w, r, x, y]) => h('div', { cls: 'abs', text: w, style: { left: x + 'px', top: y + 'px', background: WHITE, color: RED, padding: '18px 40px', borderRadius: '24px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '88px', whiteSpace: 'nowrap', transformOrigin: '50% 50%', boxShadow: '0 20px 40px rgba(120,0,6,.35)', '--r': r } }, s3.el));
  const lab3 = h('div', { cls: 'mono abs', text: 'BALNEARIO CAMBORIÚ · BRASIL', style: { left: '0', width: W + 'px', textAlign: 'center', top: SAFE_TOP - 70 + 'px', fontSize: '28px', color: WHITE } }, s3.el);
  s3.render = (lt) => {
    slices.forEach((s, i) => {
      const a = i * 0.08, e = E.outExpo(prog(lt, a, a + 0.55));
      tf(s.sl, { y: (i % 2 ? 1 : -1) * lerp(H, 0, e) });
      tf(s.im, { s: lerp(1.25, 1.05, E.outExpo(prog(lt, 0, 2))) + lt * 0.015 });
    });
    tf(lab3, { o: prog(lt, 0.6, 0.8) });
    STK.forEach((el, i) => {
      const a = 0.8 + i * 0.5, m = E.outBack(prog(lt, a, a + 0.3)), r = +el.style.getPropertyValue('--r');
      tf(el, { s: m * (1 + kick(lt, a + 0.5, 10) * 0.05), r: lerp(r * 5, r, m) + Math.sin(lt * 5 + i) * 1.2, y: Math.sin(lt * 3 + i) * 6, o: m > 0.01 ? 1 : 0 });
    });
  };

  // ======================================================================
  // S4 · 10–13,5 s · "PLAYA DE DÍA" (sol, olas, sombrilla) → "BOLICHE DE NOCHE" (bola de boliche girando)
  // ======================================================================
  const s4 = scene(10.0, 13.5);
  const day = h('div', { cls: 'layer', style: { background: WHITE, overflow: 'hidden' } }, s4.el);
  const daySvg = svgEl(day);
  daySvg.innerHTML = `<circle id="dsun" cx="860" cy="1000" r="140" fill="${RED}"/>
    <g id="dsr">${Array.from({ length: 12 }, (_, k) => `<rect x="-8" y="-250" width="16" height="60" rx="8" fill="${RED}" transform="rotate(${k * 30})"/>`).join('')}</g>
    <g id="waves"></g>
    <g id="umb" transform="translate(300 1080)"><rect x="-6" y="-10" width="12" height="230" fill="${RED}"/><path d="M-230 0 Q 0 -230 230 0 Z" fill="${RED}"/><path d="M-230 0 Q -115 -60 -77 0 Q 0 -60 77 0 Q 115 -60 230 0" fill="#fff"/><path d="M-77 0 Q 0 -210 77 0" fill="none" stroke="#fff" stroke-width="6"/></g>`;
  const dsun = daySvg.querySelector('#dsun'), dsr = daySvg.querySelector('#dsr'), waves = daySvg.querySelector('#waves'), umb = daySvg.querySelector('#umb');
  const dayT = h('div', { cls: 'disp abs', html: 'PLAYA<br>DE DÍA', style: { left: '60px', top: SAFE_TOP + 'px', color: RED, lineHeight: '.88' } }, day);
  const night = h('div', { cls: 'layer', style: { background: RED, overflow: 'hidden' } }, s4.el);
  const nSvg = svgEl(night);
  const BALL = { x: 540, y: 760, r: 230 };
  let tiles = '';
  for (let row = -6; row <= 6; row++) for (let col = -8; col <= 8; col++) tiles += `<rect class="tl" data-r="${row}" data-c="${col}" width="34" height="34" rx="4"/>`;
  nSvg.innerHTML = `<defs><clipPath id="bc"><circle cx="${BALL.x}" cy="${BALL.y}" r="${BALL.r}"/></clipPath>
      <radialGradient id="bs" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#ED1C24" stop-opacity=".45"/></radialGradient></defs>
    <g id="beams"></g><g id="stars"></g>
    <line x1="${BALL.x}" y1="0" x2="${BALL.x}" y2="${BALL.y - BALL.r}" stroke="#fff" stroke-width="6"/>
    <circle cx="${BALL.x}" cy="${BALL.y}" r="${BALL.r}" fill="#fff"/>
    <g clip-path="url(#bc)">${tiles}</g>
    <circle cx="${BALL.x}" cy="${BALL.y}" r="${BALL.r}" fill="url(#bs)"/>`;
  const tl = [...nSvg.querySelectorAll('.tl')], beams = nSvg.querySelector('#beams'), stars = nSvg.querySelector('#stars');
  const nightT = h('div', { cls: 'disp abs', html: 'BOLICHE<br>DE NOCHE', style: { left: '60px', top: '1010px', color: WHITE, lineHeight: '.88' } }, night);
  const wipe4 = h('div', { cls: 'abs', style: { left: '0', top: '0', width: W + 'px', height: H + 'px', overflow: 'hidden' } }, s4.el);
  wipe4.appendChild(night);
  s4.prepare = () => { fit(dayT, 620); fit(nightT, 900); };
  s4.render = (lt) => {
    // de día
    const e = E.outExpo(prog(lt, 0, 0.4));
    tf(dayT, { y: lerp(-500, 0, e), o: prog(lt, 0, 0.05) });
    dsun.setAttribute('cy', (1000 + Math.sin(lt * 2) * 10).toFixed(1));
    dsr.setAttribute('transform', `translate(860 ${(1000 + Math.sin(lt * 2) * 10).toFixed(1)}) rotate(${lt * 30})`);
    let wd = '';
    for (let r = 0; r < 5; r++) {
      const y = 1250 + r * 60; let d = `M -40 ${y}`;
      for (let x = -40; x <= 1120; x += 40) d += ` L ${x} ${(y + Math.sin(x / 70 + lt * 4 + r) * 14).toFixed(1)}`;
      wd += `<path d="${d}" fill="none" stroke="${RED}" stroke-width="10" stroke-linecap="round" opacity="${1 - r * 0.17}"/>`;
    }
    waves.innerHTML = wd;
    const ue = E.outBack(prog(lt, 0.25, 0.65));
    umb.setAttribute('transform', `translate(290 ${lerp(1500, 1150, ue).toFixed(1)}) rotate(${(Math.sin(lt * 3) * 4).toFixed(2)})`);
    // cortina hacia la noche (de abajo hacia arriba) a los 1,6 s
    const wp = E.inOutCubic(prog(lt, 1.5, 1.85));
    wipe4.style.clipPath = `inset(${((1 - wp) * 100).toFixed(2)}% 0 0 0)`;
    // de noche: bola de boliche que gira, haces de luz y estrellas
    const rot = lt * 1.4;
    tl.forEach((r) => {
      const row = +r.dataset.r, col = +r.dataset.c;
      const lat = row * 0.24, ph = col * 0.38 + rot;
      const x = BALL.x + Math.sin(ph) * Math.cos(lat) * BALL.r - 17, y = BALL.y + Math.sin(lat) * BALL.r - 17;
      const front = Math.cos(ph);
      r.setAttribute('x', x.toFixed(1)); r.setAttribute('y', y.toFixed(1));
      r.setAttribute('fill', front > 0.55 ? '#fff' : front > 0 ? '#F7B9BC' : '#F28C90');
      r.setAttribute('opacity', front > -0.2 ? 1 : 0);
    });
    let bm = '';
    for (let k = 0; k < 8; k++) {
      const ang = k * 45 + lt * 40;
      bm += `<path d="M ${BALL.x} ${BALL.y} L ${BALL.x + Math.cos((ang - 4) * Math.PI / 180) * 1600} ${BALL.y + Math.sin((ang - 4) * Math.PI / 180) * 1600} L ${BALL.x + Math.cos((ang + 4) * Math.PI / 180) * 1600} ${BALL.y + Math.sin((ang + 4) * Math.PI / 180) * 1600} Z" fill="#fff" opacity="${(0.12 + 0.08 * Math.sin(lt * 6 + k)).toFixed(3)}"/>`;
    }
    beams.innerHTML = bm;
    let st = '';
    for (let k = 0; k < 26; k++) {
      const x = hash(k) * W, y = 300 + hash(k + 40) * 1300, tw = 0.5 + 0.5 * Math.sin(lt * 8 + k * 2.1), sz = 6 + hash(k + 80) * 10;
      st += `<path d="M ${x} ${y - sz * 2} L ${x + sz * 0.5} ${y - sz * 0.5} L ${x + sz * 2} ${y} L ${x + sz * 0.5} ${y + sz * 0.5} L ${x} ${y + sz * 2} L ${x - sz * 0.5} ${y + sz * 0.5} L ${x - sz * 2} ${y} L ${x - sz * 0.5} ${y - sz * 0.5} Z" fill="#fff" opacity="${(tw * 0.9).toFixed(2)}"/>`;
    }
    stars.innerHTML = st;
    const ne = E.outExpo(prog(lt, 1.85, 2.2));
    tf(nightT, { y: lerp(400, 0, ne), s: 1 + kick(lt, 2.5, 10) * 0.04 + kick(lt, 3.0, 10) * 0.04, o: prog(lt, 1.85, 1.9) });
  };

  // ======================================================================
  // S5 · 13,5–18 s · "TU VIAJE INCLUYE" — checklist tildado despacio (uno cada 0,8 s)
  // ======================================================================
  const s5 = scene(13.5, 18.0);
  const t5 = ['TU VIAJE', 'INCLUYE'].map((w) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: WHITE, transformOrigin: '0% 50%' } }, s5.el));
  const ITEMS = ['Coordinadores con el grupo', 'Médico las 24 hs', 'Excursiones y actividades', 'Noches de boliche', 'Fotos y novedades a las familias'];
  const rows5 = ITEMS.map((txt) => {
    const row = h('div', { cls: 'abs', style: { left: '70px', display: 'flex', alignItems: 'center', gap: '24px', transformOrigin: '0% 50%' } }, s5.el);
    const box = h('div', { style: { width: '70px', height: '70px', borderRadius: '50%', border: '5px solid #fff', boxSizing: 'border-box', flex: 'none', position: 'relative' } }, row);
    const ck = h('div', { html: CHECK(RED), style: { position: 'absolute', inset: '-5px', borderRadius: '50%', background: WHITE, padding: '7px', transformOrigin: '50% 50%' } }, box);
    h('span', { text: txt, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '56px', letterSpacing: '-.02em', color: WHITE, whiteSpace: 'nowrap' } }, row);
    return { row, ck };
  });
  const conf5 = confetti(s5.el, 60, 5);
  s5.prepare = () => {
    let y = SAFE_TOP + 10;
    t5.forEach((el) => { const hh = fit(el, 700) * 0.86; el.style.top = y + 'px'; y += hh + 10; });
    y += 50;
    rows5.forEach((r) => { r.row.style.top = y + 'px'; y += 112; });
  };
  s5.render = (lt) => {
    t5.forEach((el, i) => {
      const a = i * 0.25, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e) }); mb(el, lerp(60, 0, e), 0);
    });
    rows5.forEach((r, i) => {
      const a = 0.7 + i * 0.8, m = E.outExpo(prog(lt, a - 0.3, a));
      tf(r.row, { x: lerp(-250, 0, m), o: prog(lt, a - 0.3, a - 0.2) });
      const c = E.outBack(prog(lt, a, a + 0.3));
      tf(r.ck, { s: c, r: lerp(-60, 0, c), o: c > 0.01 ? 1 : 0 });
    });
    renderConfetti(conf5, lt, 0.7 + 4 * 0.8 + 0.3, 540, 1350, 5, 2.4);
  };

  // ======================================================================
  // S6 · 18–21 s · Polaroids que caen + "PLAN DE PAGOS EN CUOTAS PARA TU CURSO"
  // ======================================================================
  const s6 = scene(18.0, 21.0);
  const POLS = [
    { src: PHOTO_SITE, pos: '60% 50%', cap: '¡NOS VAMOS!', x: 120, y: 290, r: -8 },
    { src: PHOTO_WHEEL, pos: '24% 50%', cap: 'LA MEJOR SEMANA', x: 300, y: 490, r: 6 },
  ].map((p) => {
    const el = h('div', { cls: 'abs', style: { left: p.x + 'px', top: p.y + 'px', width: '660px', padding: '20px 20px 90px', background: WHITE, boxSizing: 'border-box', boxShadow: '0 30px 70px rgba(120,0,6,.4)', transformOrigin: '50% 50%' } }, s6.el);
    h('img', { src: p.src, style: { display: 'block', width: '620px', height: '440px', objectFit: 'cover', objectPosition: p.pos } }, el);
    h('div', { text: p.cap, style: { position: 'absolute', left: '0', right: '0', bottom: '22px', textAlign: 'center', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '42px', color: RED } }, el);
    return { el, ...p };
  });
  const st6 = h('div', { cls: 'abs', html: `<div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:66px;line-height:1">PLAN DE PAGOS<br>EN CUOTAS</div><div class="mono" style="font-size:24px;margin-top:12px">PARA TODO TU CURSO · TODO POR ESCRITO</div>`, style: { left: '90px', top: '1075px', width: '900px', padding: '30px 40px', boxSizing: 'border-box', background: RED, color: WHITE, border: '6px solid #fff', borderRadius: '30px', textAlign: 'center', transformOrigin: '50% 50%', boxShadow: '0 24px 50px rgba(120,0,6,.35)' } }, s6.el);
  s6.render = (lt) => {
    POLS.forEach((p, i) => {
      const a = i * 0.45, e = E.outExpo(prog(lt, a, a + 0.5)), b = E.outBack(prog(lt, a + 0.2, a + 0.6));
      tf(p.el, { y: lerp(-1600, 0, e) + Math.sin(lt * 2 + i) * 6, r: lerp(p.r * 4, p.r, b) + Math.sin(lt * 1.6 + i) * 1, o: prog(lt, a, a + 0.05) });
      mb(p.el, 0, lerp(50, 0, E.outExpo(prog(lt, a, a + 0.3))));
    });
    const m = E.outBack(prog(lt, 1.2, 1.55));
    tf(st6, { s: m * (1 + kick(lt, 2.0, 10) * 0.05 + kick(lt, 2.5, 10) * 0.05), r: lerp(-12, -2, m), o: m > 0.01 ? 1 : 0 });
  };

  // S7 · 21–24 s · Cierre
  endCard(21.0, 3.0, 'AGENDÁ UNA REUNIÓN');

  finish((t) => (t < 3 ? RED : t < 6.5 ? WHITE : t < 10 ? RED : t < 13.5 ? WHITE : t < 18 ? RED : t < 21 ? '#FDEBEC' : WHITE), 24.0, 1, [3.0, 6.5, 10.0, 11.6, 13.5, 18.0, 21.0]);
})();
