function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
const {
  useState: useStateC,
  useEffect: useEffectC
} = React;

// === Icons ===
const Icon = {
  Search: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3-3"
  })),
  Whatsapp: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"
  })),
  Calendar: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4M8 2v4M3 10h18"
  })),
  Clock: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 6v6l4 2"
  })),
  Hotel: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 22V8l9-5 9 5v14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 22v-6h6v6M3 12h18"
  })),
  Bus: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "16",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 11h16M7 18v2M17 18v2M9 4V2h6v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "14.5",
    r: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "14.5",
    r: "1",
    fill: "currentColor"
  })),
  Plane: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
  })),
  Map: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 18 3 21V6l6-3 6 3 6-3v15l-6 3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 3v15M15 6v15"
  })),
  Solo: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"
  })),
  Cuotas: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "6",
    width: "20",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 11h20M6 16h4"
  })),
  Check: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })),
  Copa: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 21h8M12 15v6M5 3h14l-2 8a5 5 0 0 1-10 0z"
  })),
  Guia: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2 4 7v6c0 5 4 8 8 9 4-1 8-4 8-9V7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  })),
  Arrow: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  })),
  Close: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  })),
  Sliders: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"
  })),
  External: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 3h6v6M10 14 21 3M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"
  })),
  Wallet: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 14h.01M3 9V7a2 2 0 0 1 2-2h12"
  })),
  QR: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 14h3M20 14v3M14 20h7M17 17h.01"
  })),
  Office: () => /*#__PURE__*/React.createElement("svg", {
    className: "nt-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 21V7l9-4 9 4v14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 21v-8h6v8M3 21h18"
  }))
};

// === Destination scenes (real-feeling illustrated backgrounds) ===
const Scenes = {
  cataratas: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-cat",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#1A8E5B"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#0A4F33"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "wt-cat",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#FFFFFF",
    stopOpacity: "0.95"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#A4E6D0",
    stopOpacity: "0.5"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-cat)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,120 Q80,90 160,110 T320,100 T400,120 L400,140 L0,140 Z",
    fill: "#0F4A2E"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.92"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "140",
    width: "60",
    height: "160",
    fill: "url(#wt-cat)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "115",
    y: "135",
    width: "80",
    height: "165",
    fill: "url(#wt-cat)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "210",
    y: "145",
    width: "55",
    height: "155",
    fill: "url(#wt-cat)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "280",
    y: "138",
    width: "95",
    height: "162",
    fill: "url(#wt-cat)"
  })), /*#__PURE__*/React.createElement("ellipse", {
    cx: "200",
    cy: "295",
    rx: "220",
    ry: "22",
    fill: "#fff",
    opacity: "0.18"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "50",
    r: "22",
    fill: "#FFD23F",
    opacity: "0.55"
  })),
  "cataratas-brasil": /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-cb",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#1F9A6E"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#0B5A41"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-cb)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,140 Q120,100 200,120 T400,130 L400,160 L0,160 Z",
    fill: "#0A4731"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#fff",
    opacity: "0.88"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "20",
    y: "160",
    width: "70",
    height: "140",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "105",
    y: "155",
    width: "110",
    height: "145",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "230",
    y: "160",
    width: "68",
    height: "140",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "310",
    y: "152",
    width: "82",
    height: "148",
    rx: "2"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "50",
    r: "18",
    fill: "#FFE680",
    opacity: "0.6"
  })),
  termas: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-tm",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#D86A2F"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#7C2A12"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-tm)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "330",
    cy: "70",
    r: "38",
    fill: "#FFD23F",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 Q100,160 200,180 T400,180 L400,300 L0,300 Z",
    fill: "#1F8FA8",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "230",
    rx: "60",
    ry: "10",
    fill: "#fff",
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "280",
    cy: "245",
    rx: "80",
    ry: "12",
    fill: "#fff",
    opacity: "0.35"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#fff",
    strokeWidth: "3",
    fill: "none",
    opacity: "0.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M80,180 Q70,165 80,150 Q90,135 80,120"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M150,175 Q140,160 150,145 Q160,130 150,115"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M260,180 Q250,165 260,150 Q270,135 260,120"
  }))),
  mendoza: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-mz",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#C24E3F"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#6B1E18"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-mz)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "60",
    r: "30",
    fill: "#FFD23F",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,140 L80,80 L130,120 L200,60 L280,130 L340,90 L400,150 L400,200 L0,200 Z",
    fill: "#3B1611"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40,90 L100,40 L150,80 L210,30 L280,90 L340,55 L400,110 L400,150 L0,150 Z",
    fill: "#5C2A21",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "100",
    y: "200",
    fill: "#2B5C2E"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#1A3F1D",
    strokeWidth: "2",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,225 Q200,215 400,225"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,245 Q200,235 400,245"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,265 Q200,255 400,265"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,285 Q200,275 400,285"
  }))),
  salta: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-sl",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#F0A87A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#C46A3D"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-sl)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "60",
    r: "24",
    fill: "#FFE680",
    opacity: "0.75"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,150 L70,90 L120,130 L170,80 L250,140 L320,100 L400,160 L400,300 L0,300 Z",
    fill: "#7C2418"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M0,160 L70,100 L120,140 L170,90 L250,150 L320,110 L400,170 L400,180 L0,180 Z",
    fill: "#D85A2A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 L400,180 L400,200 L0,200 Z",
    fill: "#E8B23E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,200 L400,200 L400,220 L0,220 Z",
    fill: "#9E5A2C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,220 L400,220 L400,240 L0,240 Z",
    fill: "#6E3220"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,240 L400,240 L400,260 L0,260 Z",
    fill: "#4B7C5E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,260 L400,260 L400,280 L0,280 Z",
    fill: "#3D2A1F"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,280 L400,280 L400,300 L0,300 Z",
    fill: "#7A4A3A"
  }))),
  carlospaz: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-cp",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#7BC2C9"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#3F8E9E"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-cp)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "55",
    r: "22",
    fill: "#FFD23F",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 Q70,140 140,160 Q210,180 280,140 Q340,110 400,150 L400,210 L0,210 Z",
    fill: "#3A5824"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,200 Q70,170 140,185 Q220,200 290,170 Q350,150 400,180 L400,220 L0,220 Z",
    fill: "#446B2E"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "80",
    y: "220",
    fill: "#1F5C68"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.3",
    stroke: "#fff",
    strokeWidth: "1.5",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,250 Q100,247 200,250 T400,250"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,265 Q100,262 200,265 T400,265"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,280 Q100,277 200,280 T400,280"
  }))),
  camboriu: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-cm",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#FFB87A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.55",
    stopColor: "#E87C50"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#9A3A2A"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-cm)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "200",
    cy: "180",
    r: "55",
    fill: "#FFE680",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,200 Q100,190 200,200 T400,200 L400,300 L0,300 Z",
    fill: "#1F8FA8",
    opacity: "0.92"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,220 Q80,205 160,215 T320,215 T400,220 L400,260 L0,260 Z",
    fill: "#1B6E8E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,250 Q100,240 200,250 T400,250 L400,300 L0,300 Z",
    fill: "#0F4D6E"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(40,200)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "0",
    width: "4",
    height: "60",
    fill: "#3A2818"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5,0 Q-15,-15 -25,-5 Q-10,-5 5,5 Z",
    fill: "#1F5C2E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5,0 Q25,-18 38,-8 Q22,-3 5,5 Z",
    fill: "#1F5C2E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5,0 Q-5,-22 -22,-22 Q-8,-12 5,5 Z",
    fill: "#1F5C2E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5,0 Q20,-25 35,-22 Q18,-14 5,5 Z",
    fill: "#1F5C2E"
  }))),
  vina: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-vn",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#5FA3D4"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#1B5E8C"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-vn)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 L60,140 L120,170 L200,130 L280,170 L340,140 L400,170 L400,210 L0,210 Z",
    fill: "#1A4060"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "90",
    y: "210",
    fill: "#2F6E96"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.4",
    stroke: "#fff",
    strokeWidth: "1",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,235 Q100,232 200,235 T400,235"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,260 Q100,257 200,260 T400,260"
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(200,225)"
  }, /*#__PURE__*/React.createElement("circle", {
    r: "32",
    fill: "#fff",
    opacity: "0.18"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "22",
    fill: "#ED1C24",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "6",
    fill: "#FFD23F"
  }))),
  europa: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-eu",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#FFB57A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.6",
    stopColor: "#D86E70"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#5A2A6E"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-eu)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "80",
    r: "30",
    fill: "#FFE680",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(200,80)",
    fill: "#1A1410",
    opacity: "0.85"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "-30,200 -20,80 -15,40 -10,15 -5,0 5,0 10,15 15,40 20,80 30,200"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "-32",
    y: "70",
    width: "64",
    height: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "-25",
    y: "130",
    width: "50",
    height: "6"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "-2,-10 2,-10 0,-20"
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(70,140)",
    fill: "#1A1410",
    opacity: "0.8"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,140 L0,30 Q0,0 30,0 L70,0 Q100,0 100,30 L100,140 Z"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "50",
    width: "70",
    height: "10",
    fill: "#FFB57A"
  })), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "60",
    y: "240",
    fill: "#2A1A2E"
  })),
  merlo: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-ml",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#E8D08A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#A36B2E"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-ml)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "60",
    r: "24",
    fill: "#FFE680",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 L80,100 L160,160 L240,90 L320,150 L400,110 L400,300 L0,300 Z",
    fill: "#7C4A24"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,220 Q100,205 200,220 T400,220 L400,300 L0,300 Z",
    fill: "#4D6E2E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,260 Q100,245 200,260 T400,260 L400,300 L0,300 Z",
    fill: "#3A5824"
  })),
  federacion: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-fd",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#E89A5A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#A24B22"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-fd)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "55",
    r: "22",
    fill: "#FFE680",
    opacity: "0.78"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,170 Q100,150 200,165 T400,170 L400,300 L0,300 Z",
    fill: "#1F8FA8"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#fff",
    strokeWidth: "2.5",
    fill: "none",
    opacity: "0.7"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M100,170 Q90,155 100,140 Q110,125 100,110"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M180,165 Q170,150 180,135 Q190,120 180,105"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M270,168 Q260,153 270,138 Q280,123 270,108"
  })), /*#__PURE__*/React.createElement("ellipse", {
    cx: "200",
    cy: "230",
    rx: "180",
    ry: "15",
    fill: "#fff",
    opacity: "0.18"
  })),
  bariloche: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-br",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#9FCFE0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#3F7C9C"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-br)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 L80,80 L130,140 L200,60 L280,150 L340,100 L400,160 L400,200 L0,200 Z",
    fill: "#3D5060"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M80,80 L100,110 L130,140 L120,100 Z M200,60 L240,120 L280,150 L260,90 Z",
    fill: "#fff",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "100",
    y: "200",
    fill: "#1F4060"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.35",
    stroke: "#fff",
    strokeWidth: "1",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,230 Q100,228 200,230 T400,230"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,250 Q100,247 200,250 T400,250"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,270 Q100,267 200,270 T400,270"
  }))),
  "puerto-varas": /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-pv",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#A8D0E0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#3F7CA0"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-pv)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M150,200 L200,40 L250,200 Z",
    fill: "#2A3A4A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M180,100 L200,40 L220,100 L210,120 L200,105 L190,120 Z",
    fill: "#fff",
    opacity: "0.95"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,200 L100,150 L150,200 L250,200 L300,160 L400,200 L400,210 L0,210 Z",
    fill: "#3A5870"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "100",
    y: "210",
    fill: "#1F4868"
  })),
  talampaya: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-tl",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#FFB87A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#C24E3F"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-tl)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "60",
    r: "26",
    fill: "#FFE680",
    opacity: "0.75"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "30",
    y: "100",
    width: "80",
    height: "200",
    fill: "#7C2418"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "140",
    y: "130",
    width: "60",
    height: "170",
    fill: "#9E3220"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "230",
    y: "90",
    width: "70",
    height: "210",
    fill: "#7C2418"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "330",
    y: "140",
    width: "60",
    height: "160",
    fill: "#9E3220"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#5A1B12",
    opacity: "0.6"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "30",
    y: "140",
    width: "80",
    height: "4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "30",
    y: "180",
    width: "80",
    height: "4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "230",
    y: "130",
    width: "70",
    height: "4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "230",
    y: "180",
    width: "70",
    height: "4"
  })), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "40",
    y: "260",
    fill: "#E8B23E"
  })),
  catamarca: /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-ct",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#E8B27A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#A24A1D"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-ct)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "60",
    r: "26",
    fill: "#FFE680",
    opacity: "0.75"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,160 L80,100 L160,150 L240,80 L320,140 L400,110 L400,300 L0,300 Z",
    fill: "#7C3818"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,220 Q100,200 200,220 T400,220 L400,300 L0,300 Z",
    fill: "#C46A3D"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,260 Q100,245 200,260 T400,260 L400,300 L0,300 Z",
    fill: "#E8B27A"
  })),
  "punta-este": /*#__PURE__*/React.createElement("svg", {
    className: "scene",
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "sk-pe",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#FFC890"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#D87850"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#sk-pe)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "70",
    r: "28",
    fill: "#FFE680",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "150",
    y: "180",
    fill: "#E8C896"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 Q100,170 200,180 T400,180 L400,200 L0,200 Z",
    fill: "#1F8FA8",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(180,180)",
    fill: "#A8662E"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "10",
    height: "100",
    rx: "5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "20",
    y: "-20",
    width: "10",
    height: "120",
    rx: "5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "-40",
    width: "10",
    height: "140",
    rx: "5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "60",
    y: "-30",
    width: "10",
    height: "130",
    rx: "5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "80",
    y: "-10",
    width: "10",
    height: "110",
    rx: "5"
  })))
};

// Map destination keys → real photo files in /assets/photos
const PhotoMap = {
  carlospaz: 'assets/photos/carlospaz.png',
  camboriu: 'assets/photos/camboriu.png',
  merlo: 'assets/photos/merlo.png',
  cataratas: 'assets/photos/cataratas.png',
  'cataratas-brasil': 'assets/photos/cataratas.png',
  mendoza: 'assets/photos/mendoza.png',
  termas: 'assets/photos/termas.png',
  federacion: 'assets/photos/federacion.png',
  salta: 'assets/photos/salta.png',
  talampaya: 'assets/photos/talampaya.png',
  catamarca: 'assets/photos/catamarca.png',
  europa: 'assets/photos/europa.png',
  'puerto-varas': 'assets/photos/puerto-varas.png',
  vina: 'assets/photos/vina.png',
  'punta-este': 'assets/photos/punta-este.png',
  bariloche: 'assets/photos/bariloche.png'
};
const PhotoLabels = {
  carlospaz: 'Villa Carlos Paz',
  camboriu: 'Balneário Camboriú',
  merlo: 'Merlo · San Luis',
  cataratas: 'Cataratas del Iguazú',
  'cataratas-brasil': 'Cataratas · Brasil',
  mendoza: 'Mendoza',
  termas: 'Termas de Río Hondo',
  federacion: 'Federación · Entre Ríos',
  salta: 'Salta y Jujuy',
  talampaya: 'Talampaya · La Rioja',
  catamarca: 'Catamarca · Fiambalá',
  europa: 'Europa Soñada',
  'puerto-varas': 'Puerto Varas · Chile',
  vina: 'Viña del Mar · Chile',
  'punta-este': 'Punta del Este · Uruguay',
  bariloche: 'Bariloche'
};
function Ph({
  kind,
  label,
  style,
  ...rest
}) {
  const photo = PhotoMap[kind];
  if (photo) {
    return /*#__PURE__*/React.createElement("div", _extends({
      className: `ph ph--${kind} ph--photo`,
      "data-label": label,
      style: style
    }, rest), /*#__PURE__*/React.createElement("img", {
      src: photo,
      alt: PhotoLabels[kind] || kind,
      loading: "eager",
      fetchpriority: "high",
      decoding: "async",
      className: "scene",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }));
  }
  const scene = Scenes[kind];
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `ph ph--${kind}`,
    "data-label": label,
    style: style
  }, rest), scene);
}

// Sticker
function Sticker({
  tipo,
  tilt
}) {
  const sello = window.NT_SELLOS[tipo];
  if (!sello) return null;
  const cls = `nt-sticker ${tilt === 1 ? 'nt-sticker--rotate-1' : tilt === 2 ? 'nt-sticker--rotate-2' : ''}`;
  return /*#__PURE__*/React.createElement("span", {
    className: cls,
    style: {
      background: sello.color,
      color: sello.textColor
    }
  }, sello.texto);
}

// Spinning round stamp
function Stamp({
  children,
  style,
  color = '#ED1C24'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-stamp",
    style: style
  }, /*#__PURE__*/React.createElement("svg", {
    className: "ring",
    viewBox: "0 0 200 200",
    width: "130",
    height: "130"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
    id: "circ",
    d: "M100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "92",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    fontSize: "14",
    fontFamily: "JetBrains Mono, monospace",
    fontWeight: "600",
    fill: color,
    letterSpacing: "3"
  }, /*#__PURE__*/React.createElement("textPath", {
    href: "#circ",
    startOffset: "0"
  }, "INCAUCA TURISMO LEG. 12.379 \xB7 NEW TRIPS \xB7 ARGENTINA \xB7"))), /*#__PURE__*/React.createElement("div", {
    className: "badge",
    style: {
      background: color
    }
  }, children));
}

// Format currency in ARS or USD
function formatPrice(amount, currency = 'ARS') {
  if (currency === 'USD') return `USD ${amount.toLocaleString('en-US')}`;
  return '$' + amount.toLocaleString('es-AR');
}

// Reveal on scroll
function useReveal() {
  useEffectC(() => {
    const els = document.querySelectorAll('.nt-reveal:not(.in)');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.1
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

// Top strip marquee
function TopStrip() {
  const items = ["🇦🇷 Incauca Turismo · Legajo 12.379", "Cuotas sin interés hasta 15 días antes de viajar", "Viajás solo: pagás base doble", "Embarques desde Mar del Plata, Tandil, Azul, Olavarría, Junín…", "Cena con vino y snacks a bordo", "Coordinador en todo el viaje · desde tu ciudad"];
  const all = [...items, ...items];
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-topstrip",
    style: {
      color: "rgb(250, 246, 238)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-topstrip-track"
  }, all.map((t, i) => /*#__PURE__*/React.createElement("span", {
    className: "nt-topstrip-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-topstrip-dot"
  }), t))));
}

// Header
function Header({
  onNavigate,
  onWhatsapp,
  current
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Cerrar menú al cambiar tamaño a desktop
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const handler = e => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Bloquear scroll body cuando el menú está abierto
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  const go = (page, cat, temp, dest, search, promo) => {
    setMenuOpen(false);
    onNavigate(page, cat, temp, dest, search, promo);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "nt-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-header-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nt-logo",
    onClick: () => onNavigate('home'),
    role: "button"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-shield.png",
    alt: "New Trips",
    className: "nt-logo-shield"
  }), /*#__PURE__*/React.createElement("small", {
    className: "nt-logo-leg"
  }, "LEG. 12.379")), /*#__PURE__*/React.createElement("nav", {
    className: "nt-nav"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate('listado'),
    role: "button",
    style: {
      cursor: 'pointer'
    }
  }, "Paquetes"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate('listado', null, 'vacaciones-invierno'),
    role: "button",
    style: {
      cursor: 'pointer'
    }
  }, "Vac. Invierno"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate('listado', null, 'brasil'),
    role: "button",
    style: {
      cursor: 'pointer'
    }
  }, "Brasil"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate('listado', null, 'europa'),
    role: "button",
    style: {
      cursor: 'pointer'
    }
  }, "Europa"), /*#__PURE__*/React.createElement("button", {
    className: "nt-cta-promos",
    onClick: () => onNavigate('listado', null, null, null, null, 'con-promo')
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-cta-promos-spark",
    "aria-hidden": true
  }, "%"), /*#__PURE__*/React.createElement("span", {
    className: "nt-cta-promos-text"
  }, "Promociones"), /*#__PURE__*/React.createElement("span", {
    className: "nt-cta-promos-pulse",
    "aria-hidden": true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nt-header-cta"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.com.ar",
    target: "_blank",
    rel: "noopener",
    className: "nt-header-egresados"
  }, "Egresados"), /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.magnussistemas.com.ar/login",
    target: "_blank",
    rel: "noopener",
    className: "nt-cta nt-cta--ghost nt-cta--pay"
  }, /*#__PURE__*/React.createElement(Icon.Wallet, null), /*#__PURE__*/React.createElement("span", {
    className: "nt-cta--text-hide"
  }, "Pagar mi viaje")), /*#__PURE__*/React.createElement("button", {
    className: "nt-cta",
    onClick: onWhatsapp
  }, /*#__PURE__*/React.createElement(Icon.Whatsapp, null), /*#__PURE__*/React.createElement("span", {
    className: "nt-cta--text-hide"
  }, "Consultar")), /*#__PURE__*/React.createElement("button", {
    className: `nt-burger-btn ${menuOpen ? 'is-open' : ''}`,
    onClick: () => setMenuOpen(!menuOpen),
    "aria-label": "Men\xFA",
    "aria-expanded": menuOpen
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))))), /*#__PURE__*/React.createElement("div", {
    className: `nt-drawer-backdrop ${menuOpen ? 'is-open' : ''}`,
    onClick: () => setMenuOpen(false),
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("aside", {
    className: `nt-drawer ${menuOpen ? 'is-open' : ''}`,
    "aria-hidden": !menuOpen
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-drawer-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-eyebrow"
  }, "Men\xFA"), /*#__PURE__*/React.createElement("button", {
    className: "nt-drawer-close",
    onClick: () => setMenuOpen(false),
    "aria-label": "Cerrar men\xFA"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
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
  })))), /*#__PURE__*/React.createElement("nav", {
    className: "nt-drawer-nav"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('listado')
  }, /*#__PURE__*/React.createElement("span", null, "Paquetes"), /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('listado', null, 'vacaciones-invierno')
  }, /*#__PURE__*/React.createElement("span", null, "Vacaciones de Invierno"), /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('listado', null, 'brasil')
  }, /*#__PURE__*/React.createElement("span", null, "Brasil"), /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('listado', null, 'europa')
  }, /*#__PURE__*/React.createElement("span", null, "Europa"), /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("button", {
    className: "nt-drawer-promos",
    onClick: () => go('listado', null, null, null, null, 'con-promo')
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-spark"
  }, "%"), /*#__PURE__*/React.createElement("span", null, "Promociones"), /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-arrow"
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-drawer-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nt-drawer-extras"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.com.ar",
    target: "_blank",
    rel: "noopener",
    onClick: () => setMenuOpen(false)
  }, /*#__PURE__*/React.createElement("span", null, "Egresados"), /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-arrow"
  }, "\u2197")), /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.magnussistemas.com.ar/login",
    target: "_blank",
    rel: "noopener",
    onClick: () => setMenuOpen(false)
  }, /*#__PURE__*/React.createElement("span", null, "Pagar mi viaje"), /*#__PURE__*/React.createElement("span", {
    className: "nt-drawer-arrow"
  }, "\u2197"))), /*#__PURE__*/React.createElement("button", {
    className: "nt-drawer-cta",
    onClick: () => {
      setMenuOpen(false);
      onWhatsapp();
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    width: "18",
    height: "18"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.5 14.4c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1 2.1 3.3 5.1 4.6c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.2-.7.2-1.4.2-1.5-.1-.2-.3-.3-.6-.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.4 1.3 4.9L2 22l5.3-1.3c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3.1-.2-.3C4.1 14.8 3.7 13.4 3.7 12c0-4.6 3.7-8.3 8.3-8.3S20.3 7.4 20.3 12s-3.7 8-8.3 8z"
  })), "Consultar por WhatsApp")));
}

// Pills (categories)
function Pills({
  active,
  onChange,
  packages
}) {
  const counts = window.NT_CATEGORIES.reduce((acc, c) => {
    acc[c.id] = c.id === 'todos' ? packages.length : packages.filter(p => p.categoria === c.id).length;
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-pills-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-pills"
  }, window.NT_CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: `nt-pill ${active === c.id ? 'active' : ''}`,
    onClick: () => onChange(c.id)
  }, /*#__PURE__*/React.createElement("span", null, c.icon), " ", c.nombre, /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, counts[c.id])))));
}

// Compute display price for a package (returns { current, old?, currency, base })
function getPriceInfo(p) {
  if (p.precioUSD) {
    return {
      current: p.precioUSD,
      currency: 'USD',
      impuestos: p.impuestosUSD,
      suffix: '+ imp'
    };
  }
  const promo = p.precioPromo;
  const reg = p.precio || p.precioCama || p.precioCuadruple || p.precioTriple || 0;
  if (promo) return {
    current: promo,
    old: reg,
    currency: 'ARS',
    isPromo: true
  };
  // Últimos cupos: se liquidan con descuento sobre el precio regular anterior
  if (p.precioAntes) return {
    current: reg,
    old: p.precioAntes,
    currency: 'ARS'
  };
  return {
    current: reg,
    currency: 'ARS'
  };
}

// === Cotizador en vivo ===
// Tarifa por persona según ocupación de la habitación y servicio del bus.
function ntRoomRate(p, occupants, cama) {
  if (p.precioPromo) {
    return cama && p.precioCamaPromo ? p.precioCamaPromo : p.precioPromo;
  }
  if (occupants >= 4 && p.precioCuadruple) {
    return cama && p.precioCuadrupleCama ? p.precioCuadrupleCama : p.precioCuadruple;
  }
  if (occupants === 3 && p.precioTriple) {
    return cama && p.precioTripleCama ? p.precioTripleCama : p.precioTriple;
  }
  const base = cama && p.precioCama ? p.precioCama : p.precio;
  return base || p.precioCama || p.precioCuadruple || p.precioTriple || 0;
}

// ¿El paquete ofrece tarifas de menores (Family Plan con valores definidos)?
function ntHasKids(p) {
  return !!(p.familyPlan && (p.familyPlan.menorHasta5 || p.familyPlan.menor6a10));
}

// Calcula el presupuesto total a partir de la configuración de pasajeros.
// opts: { adults, kids0a5, kids6a10, cama }
// Devuelve { items:[{label, sub, amount, regular, discounted}], total, savings, currency, perRegular, isPromo, impuestos?, cityTax? }
function computeQuote(p, opts) {
  const o = opts || {};
  const adults = Math.max(0, o.adults || 0);
  const kids0a5 = Math.max(0, o.kids0a5 || 0);
  const kids6a10 = Math.max(0, o.kids6a10 || 0);
  const cama = !!o.cama;

  // Europa / aéreos en dólares
  if (p.precioUSD) {
    const items = [];
    for (let i = 0; i < adults; i++) items.push({
      label: `Pasajero ${i + 1}`,
      amount: p.precioUSD
    });
    const subtotal = p.precioUSD * adults;
    const impuestos = (p.impuestosUSD || 0) * adults;
    const cityTax = (p.cityTaxUSD || 0) * adults;
    return {
      items,
      currency: 'USD',
      perRegular: p.precioUSD,
      savings: 0,
      subtotal,
      impuestos,
      cityTax,
      total: subtotal + impuestos + cityTax
    };
  }
  const occupants = adults + kids0a5 + kids6a10;
  const rate = ntRoomRate(p, occupants, cama);
  const items = [];
  let savings = 0;
  const sellos = p.sellos || [];
  const has2do = !!(p.precio2do || p.precio2doCama) && (sellos.includes('promo-2x1') || sellos.includes('promo-2do-30'));
  const rate2do = (cama && p.precio2doCama ? p.precio2doCama : p.precio2do) || 0;
  const pct2do = sellos.includes('promo-2do-30') ? 30 : 50;
  for (let i = 0; i < adults; i++) {
    if (has2do && i % 2 === 1) {
      items.push({
        label: `Adulto ${i + 1}`,
        sub: `2.º pasajero · ${pct2do}% OFF`,
        amount: rate2do,
        regular: rate,
        discounted: true
      });
      savings += Math.max(0, rate - rate2do);
    } else {
      items.push({
        label: `Adulto ${i + 1}`,
        amount: rate
      });
    }
  }
  if (p.familyPlan) {
    for (let i = 0; i < kids0a5; i++) {
      const a = p.familyPlan.menorHasta5;
      if (a == null) continue;
      items.push({
        label: `Menor ${i + 1} · hasta 5 años`,
        sub: 'Family Plan',
        amount: a,
        regular: rate,
        discounted: true
      });
      savings += Math.max(0, rate - a);
    }
    for (let i = 0; i < kids6a10; i++) {
      const a = p.familyPlan.menor6a10;
      if (a == null) continue;
      items.push({
        label: `Menor ${i + 1} · 6 a 10 años`,
        sub: 'Family Plan',
        amount: a,
        regular: rate,
        discounted: true
      });
      savings += Math.max(0, rate - a);
    }
  }
  const total = items.reduce((s, x) => s + x.amount, 0);
  return {
    items,
    currency: 'ARS',
    total,
    savings,
    perRegular: rate,
    isPromo: !!p.precioPromo
  };
}

// Card
function Card({
  pkg,
  onClick
}) {
  const price = getPriceInfo(pkg);
  const cat = window.NT_CATEGORIES.find(c => c.id === pkg.categoria);
  const sellos = pkg.sellos || [];
  const proximaSalida = pkg.salidas[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-card nt-reveal",
    onClick: () => onClick(pkg)
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-card-media"
  }, /*#__PURE__*/React.createElement(Ph, {
    kind: pkg.foto,
    label: pkg.destino
  }), /*#__PURE__*/React.createElement("div", {
    className: "nt-stickers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-stickers-row"
  }, sellos.slice(0, 1).map((s, i) => /*#__PURE__*/React.createElement(Sticker, {
    key: s,
    tipo: s,
    tilt: 1
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nt-stickers-row"
  }, sellos.slice(1, 2).map(s => /*#__PURE__*/React.createElement(Sticker, {
    key: s,
    tipo: s,
    tilt: 2
  })))), /*#__PURE__*/React.createElement("span", {
    className: "nt-card-cat"
  }, cat?.icon, " ", cat?.nombre)), /*#__PURE__*/React.createElement("div", {
    className: "nt-card-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-card-where"
  }, pkg.destino), /*#__PURE__*/React.createElement("h3", null, pkg.titulo), /*#__PURE__*/React.createElement("div", {
    className: "nt-card-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon.Clock, null), " ", pkg.duracion), /*#__PURE__*/React.createElement("span", null, pkg.transporte === 'aereo' ? /*#__PURE__*/React.createElement(Icon.Plane, null) : /*#__PURE__*/React.createElement(Icon.Bus, null), " ", pkg.transporte === 'aereo' ? 'Vuelo directo' : 'Bus premium')), /*#__PURE__*/React.createElement("div", {
    className: "nt-card-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon.Calendar, null), " Pr\xF3x: ", proximaSalida.fecha)), /*#__PURE__*/React.createElement("div", {
    className: "nt-card-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-price-stack"
  }, price.old && /*#__PURE__*/React.createElement("span", {
    className: "nt-price-old-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-price-old"
  }, formatPrice(price.old, price.currency)), (() => {
    const pct = Math.round((1 - price.current / price.old) * 100);
    return pct > 3 ? /*#__PURE__*/React.createElement("span", {
      className: "nt-price-off"
    }, "\u2212", pct, "%") : null;
  })()), /*#__PURE__*/React.createElement("span", {
    className: `nt-price ${price.isPromo || price.old ? 'nt-price-promo' : ''}`
  }, formatPrice(price.current, price.currency), /*#__PURE__*/React.createElement("small", null, price.currency === 'USD' ? 'p/persona base doble' : `por persona${price.suffix ? ' ' + price.suffix : ''}`))), /*#__PURE__*/React.createElement("span", {
    className: "nt-card-cta"
  }, /*#__PURE__*/React.createElement(Icon.Arrow, null)))));
}

// Diferenciales icon
function DifIcon({
  name
}) {
  switch (name) {
    case 'solo':
      return /*#__PURE__*/React.createElement(Icon.Solo, null);
    case 'bus':
      return /*#__PURE__*/React.createElement(Icon.Bus, null);
    case 'cuotas':
      return /*#__PURE__*/React.createElement(Icon.Cuotas, null);
    case 'check':
      return /*#__PURE__*/React.createElement(Icon.Check, null);
    case 'copa':
      return /*#__PURE__*/React.createElement(Icon.Copa, null);
    case 'guia':
      return /*#__PURE__*/React.createElement(Icon.Guia, null);
    default:
      return /*#__PURE__*/React.createElement(Icon.Check, null);
  }
}

// Floating WhatsApp FAB
function Fab({
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "nt-fab",
    onClick: onClick,
    "aria-label": "Consultar por WhatsApp"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-fab-pulse"
  }), /*#__PURE__*/React.createElement(Icon.Whatsapp, null));
}

// Footer
function Footer({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "nt-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-footer-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-shield.png",
    alt: "New Trips",
    className: "nt-logo-shield nt-logo-shield--footer"
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-wordmark-white.png",
    alt: "New Trips",
    style: {
      height: 23,
      width: 'auto',
      display: 'block',
      objectFit: "contain"
    }
  })), /*#__PURE__*/React.createElement("small", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      opacity: 0.7,
      marginTop: 12,
      marginBottom: 16
    }
  }, "Incauca Turismo \xB7 Leg. 12.379"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 340,
      fontSize: 14,
      lineHeight: 1.55
    }
  }, "Agencia oficial argentina con a\xF1os armando viajes inolvidables. Salimos desde el interior bonaerense para que vos solo te ocupes de armar la valija.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Destinos"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate?.('listado', 'termas'),
    style: {
      cursor: 'pointer'
    }
  }, "Termas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate?.('listado', 'sierras'),
    style: {
      cursor: 'pointer'
    }
  }, "Sierras")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate?.('listado', 'cataratas'),
    style: {
      cursor: 'pointer'
    }
  }, "Cataratas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate?.('listado', 'playa'),
    style: {
      cursor: 'pointer'
    }
  }, "Playa \xB7 Brasil")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate?.('listado', null, 'europa'),
    style: {
      cursor: 'pointer'
    }
  }, "Europa")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate?.('listado', 'aereos'),
    style: {
      cursor: 'pointer'
    }
  }, "A\xE9reos")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Pagar y gestionar"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.magnussistemas.com.ar/login",
    target: "_blank",
    rel: "noopener"
  }, "Pagar mi viaje \u2197")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://newtrips.com.ar",
    target: "_blank",
    rel: "noopener"
  }, "Sitio Egresados \u2197")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNavigate?.('listado', null, 'promociones'),
    style: {
      cursor: 'pointer'
    }
  }, "Promos vigentes")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Contacto"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCDE +54 9 223 528-7375"), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCE7 newtripsmarketing@gmail.com"), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCCD Mar del Plata, Argentina"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/newtripsviajes",
    target: "_blank",
    rel: "noopener",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "20",
    rx: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "6.5",
    r: "1.3",
    fill: "currentColor",
    stroke: "none"
  })), "@newtripsviajes"))))), /*#__PURE__*/React.createElement("div", {
    className: "nt-footer-credits"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 New Trips \xB7 Incauca Turismo \xB7 Legajo 12.379"), /*#__PURE__*/React.createElement("span", null, "Hecho con \u2665 desde Mar del Plata")));
}
Object.assign(window, {
  Icon,
  Ph,
  Sticker,
  Stamp,
  Card,
  Pills,
  Header,
  TopStrip,
  Fab,
  Footer,
  DifIcon,
  formatPrice,
  getPriceInfo,
  useReveal,
  computeQuote,
  ntRoomRate,
  ntHasKids
});
