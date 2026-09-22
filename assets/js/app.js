(function () {
  "use strict";

  var CLAVE = "flota_config_v1";
  var CLAVE_CONSUMOS = "flota_consumos_v1";
  var CLAVE_CONDUCTORES = "flota_conductores_v1";
  var CLAVE_VELOCIDADES = "flota_velocidades_v1";
  var CLAVE_MODO_OSCURO = "flota_modo_oscuro";
  var CLAVE_POIS = "flota_pois";
  var CLAVE_HOSPITALES_EDITADOS = "flota_hospitales_editados";
  var CLAVE_MAPA_OSCURO = "flota_mapa_oscuro";

  var CONFIG_POR_DEFECTO = {
    baseUrl: "http://localhost:3000",
    authType: "basic",
    token: "",
    user: "",
    password: "",
    deviceIds: [],
    refreshSec: 15,
    consumoMedio: 7,
    precioCombustible: 16000,
    limiteVelocidad: 80
  };

  var config = cargarConfig();
  var consumosPorVehiculo = cargarConsumos();
  var conductores = cargarConductores();
  var historialVelocidades = cargarVelocidades();
  var pois = cargarPois();
  var hospitales = [
    {
      id: 1,
      nombre: "Hospital San Vicente Fundación",
      tipo: "Hospital Privado",
      direccion: "Calle 64 #51D-154, Medellín",
      telefono: "(604) 444-1333",
      camas: 650,
      lat: 6.2445,
      lon: -75.5685,
      especialidades: ["Urgencias", "Alta complejidad", "Trasplantes", "Oncología", "Neurocirugía", "Quemados"]
    },
    {
      id: 2,
      nombre: "Hospital General de Medellín",
      tipo: "Hospital Público",
      direccion: "Carrera 48 #32-102, Medellín",
      telefono: "(604) 384-7300",
      camas: 520,
      lat: 6.2490,
      lon: -75.5740,
      especialidades: ["Urgencias", "Cirugía", "Medicina Interna", "Pediatría", "Ginecología"]
    },
    {
      id: 3,
      nombre: "Hospital Pablo Tobón Uribe",
      tipo: "Hospital Privado",
      direccion: "Carrera 51D #60-100, Medellín",
      telefono: "(604) 444-0555",
      camas: 450,
      lat: 6.2350,
      lon: -75.5580,
      especialidades: ["Urgencias", "Cardiovascular", "Neurología", "Oncología", "Ortopedia"]
    },
    {
      id: 4,
      nombre: "Hospital Universitario San Jorge",
      tipo: "Hospital Público",
      direccion: "Calle 64 #5-85, Medellín",
      telefono: "(604) 444-4444",
      camas: 380,
      lat: 6.2620,
      lon: -75.5650,
      especialidades: ["Urgencias", "Traumatología", "Medicina Interna", "Cirugía"]
    },
    {
      id: 5,
      nombre: "Hospital Alma Máter de Antioquia",
      tipo: "Hospital Público",
      direccion: "Calle 69 #51C-24, Medellín",
      telefono: "(604) 604-9595",
      camas: 300,
      lat: 6.2420,
      lon: -75.5620,
      especialidades: ["Urgencias", "Pediatría", "Ginecología", "Cirugía General"]
    },
    {
      id: 6,
      nombre: "Clínica Cardio VID",
      tipo: "Clínica Privada",
      direccion: "Carrera 43 #1-50, Medellín",
      telefono: "(604) 444-0555",
      camas: 120,
      lat: 6.2090,
      lon: -75.5750,
      especialidades: ["Cardiología", "Cirugía Cardiovascular", "Hemodinámica", "Rehabilitación Cardíaca"]
    },
    {
      id: 7,
      nombre: "Hospital de la Mujer",
      tipo: "Hospital Público",
      direccion: "Carrera 42 #5-50, Medellín",
      telefono: "(604) 444-3333",
      camas: 200,
      lat: 6.2250,
      lon: -75.5680,
      especialidades: ["Ginecología", "Obstetricia", "Neonatología", "Planificación Familiar"]
    },
    {
      id: 8,
      nombre: "Centro Médico Imbanaco",
      tipo: "Centro Médico",
      direccion: "Carrera 38A #5-100, Medellín",
      telefono: "(604) 444-5555",
      camas: 280,
      lat: 6.2180,
      lon: -75.5820,
      especialidades: ["Urgencias", "Cirugía Plástica", "Rehabilitación", "Medicina Deportiva"]
    },
    {
      id: 9,
      nombre: "Hospital Infantil San Juan de Dios",
      tipo: "Hospital Público",
      direccion: "Carrera 50 #58-18, Medellín",
      telefono: "(604) 444-8800",
      camas: 180,
      lat: 6.2380,
      lon: -75.5540,
      especialidades: ["Pediatría", "Neonatología", "Cirugía Pediátrica", "Urgencias Pediátricas"]
    },
    {
      id: 10,
      nombre: "Clínica El Rosario",
      tipo: "Clínica Privada",
      direccion: "Carrera 43A #1-50, Medellín",
      telefono: "(604) 444-0555",
      camas: 150,
      lat: 6.2050,
      lon: -75.5710,
      especialidades: ["Cardiología", "Oftalmología", "Odontología", "Cirugía General"]
    },
    {
      id: 11,
      nombre: "Hospital San Juan de Dios (Bello)",
      tipo: "Hospital Público",
      direccion: "Carrera 49 #61-81, Bello",
      telefono: "(604) 605-4949",
      camas: 120,
      lat: 6.3350,
      lon: -75.5530,
      especialidades: ["Urgencias", "Medicina Interna", "Pediatría", "Ginecología"]
    },
    {
      id: 12,
      nombre: "Hospital San Fernando (Amagá)",
      tipo: "Hospital Público",
      direccion: "Carrera 51 #52-81, Amagá",
      telefono: "(604) 847-2121",
      camas: 80,
      lat: 6.0380,
      lon: -75.7030,
      especialidades: ["Urgencias", "Medicina General", "Cirugía General"]
    },
    {
      id: 13,
      nombre: "Hospital San Juan de Dios (Rionegro)",
      tipo: "Hospital Público",
      direccion: "Carrera 51 #56-20, Rionegro",
      telefono: "(604) 605-4949",
      camas: 100,
      lat: 6.1530,
      lon: -75.3750,
      especialidades: ["Urgencias", "Medicina Interna", "Pediatría", "Cirugía"]
    },
    {
      id: 14,
      nombre: "Hospital Mental de Antioquia",
      tipo: "Hospital Público",
      direccion: "Calle 31 #32-14, Medellín",
      telefono: "(604) 320-1212",
      camas: 200,
      lat: 6.2680,
      lon: -75.5610,
      especialidades: ["Psiquiatría", "Salud Mental", "Adicciones", "Neurología"]
    },
    {
      id: 15,
      nombre: "Hospital San Rafael (Santa Fe de Antioquia)",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Santa Fe de Antioquia",
      telefono: "(604) 836-1212",
      camas: 50,
      lat: 6.5560,
      lon: -75.8260,
      especialidades: ["Urgencias", "Medicina General", "Atención Básica"]
    },
    {
      id: 16,
      nombre: "Hospital San Juan de Dios (Yarumal)",
      tipo: "Hospital Público",
      direccion: "Carrera 23 #12-13, Yarumal",
      telefono: "(604) 853-7373",
      camas: 80,
      lat: 6.9633,
      lon: -75.4172,
      especialidades: ["Urgencias", "Medicina General", "Especializada", "Laboratorio", "Hospitalización"]
    },
    {
      id: 17,
      nombre: "Hospital Santa Rosa de Osos",
      tipo: "Hospital Público",
      direccion: "Calle 44 #49B-90, Santa Rosa de Osos",
      telefono: "(604) 855-2029",
      camas: 60,
      lat: 6.8400,
      lon: -75.4600,
      especialidades: ["Urgencias", "Medicina General", "Pediatría", "Ginecología"]
    },
    {
      id: 18,
      nombre: "Hospital San Roque",
      tipo: "Hospital Público",
      direccion: "Calle 10 #10-51, San Roque",
      telefono: "(604) 855-5896",
      camas: 50,
      lat: 6.9833,
      lon: -75.5167,
      especialidades: ["Urgencias", "Medicina General", "Odontología", "Laboratorio"]
    },
    {
      id: 19,
      nombre: "Hospital Donmatías",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Donmatías",
      telefono: "(604) 855-1212",
      camas: 60,
      lat: 6.4867,
      lon: -75.3917,
      especialidades: ["Urgencias", "Medicina General", "Pediatría"]
    },
    {
      id: 20,
      nombre: "Hospital Carolina del Príncipe",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Carolina del Príncipe",
      telefono: "(604) 855-1313",
      camas: 40,
      lat: 6.7500,
      lon: -75.2833,
      especialidades: ["Urgencias", "Medicina General", "Atención Básica"]
    },
    {
      id: 21,
      nombre: "Hospital Gómez Plata",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Gómez Plata",
      telefono: "(604) 855-1414",
      camas: 45,
      lat: 6.6833,
      lon: -75.2167,
      especialidades: ["Urgencias", "Medicina General", "Pediatría"]
    },
    {
      id: 22,
      nombre: "Hospital Yolombó",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Yolombó",
      telefono: "(604) 855-1515",
      camas: 35,
      lat: 6.59010,
      lon: -75.01718,
      especialidades: ["Urgencias", "Medicina General", "Atención Básica"]
    },
    {
      id: 23,
      nombre: "Hospital Santo Domingo",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Santo Domingo",
      telefono: "(604) 855-1616",
      camas: 40,
      lat: 6.4667,
      lon: -75.1667,
      especialidades: ["Urgencias", "Medicina General", "Pediatría"]
    },
    {
      id: 24,
      nombre: "Hospital Campamento",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Campamento",
      telefono: "(604) 855-1717",
      camas: 30,
      lat: 6.9833,
      lon: -75.3000,
      especialidades: ["Urgencias", "Medicina General", "Atención Básica"]
    },
    {
      id: 25,
      nombre: "Hospital Angostura",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Angostura",
      telefono: "(604) 855-1818",
      camas: 35,
      lat: 6.8833,
      lon: -75.3333,
      especialidades: ["Urgencias", "Medicina General", "Atención Básica"]
    },
    {
      id: 26,
      nombre: "Hospital San Camilo de Vegachí",
      tipo: "Hospital Público",
      direccion: "Carrera 49a #50a-14, Vegachí",
      telefono: "(604) 830-5625",
      camas: 40,
      lat: 6.7731,
      lon: -74.7994,
      especialidades: ["Urgencias", "Medicina General", "Laboratorio", "Hospitalización"]
    },
    {
      id: 27,
      nombre: "Hospital La Misericordia (Yalí)",
      tipo: "Hospital Público",
      direccion: "Calle 18 #23-24, Yalí",
      telefono: "(604) 867-5655",
      camas: 35,
      lat: 6.6767,
      lon: -74.8411,
      especialidades: ["Urgencias", "Medicina General", "Pediatría"]
    },
    {
      id: 28,
      nombre: "Hospital San Vicente de Remedios",
      tipo: "Hospital Público",
      direccion: "Calle Las Palmas #12-120, Remedios",
      telefono: "(604) 830-3727",
      camas: 50,
      lat: 7.0275,
      lon: -74.6939,
      especialidades: ["Urgencias", "Medicina General", "Cirugía", "Ginecología"]
    },
    {
      id: 29,
      nombre: "Hospital San Juan de Dios (Segovia)",
      tipo: "Hospital Público",
      direccion: "Campamento La Salada, Segovia",
      telefono: "(604) 831-5626",
      camas: 45,
      lat: 6.9933,
      lon: -74.6722,
      especialidades: ["Urgencias", "Medicina General", "Pediatría"]
    },
    {
      id: 30,
      nombre: "Hospital San Antonio (Zaragoza)",
      tipo: "Hospital Público",
      direccion: "Calle 25 #17C1, Zaragoza",
      telefono: "(604) 838-8312",
      camas: 40,
      lat: 7.1333,
      lon: -74.8667,
      especialidades: ["Urgencias", "Medicina General", "Laboratorio"]
    },
    {
      id: 31,
      nombre: "Hospital San Antonio (Cisneros)",
      tipo: "Hospital Público",
      direccion: "Calle 18 #17-105, Cisneros",
      telefono: "(604) 863-2255",
      camas: 30,
      lat: 6.7000,
      lon: -75.0833,
      especialidades: ["Urgencias", "Medicina General", "Atención Básica"]
    },
    {
      id: 32,
      nombre: "Hospital San José (Caracolí)",
      tipo: "Hospital Público",
      direccion: "Carrera 10 #10-50, Caracolí",
      telefono: "(604) 855-1919",
      camas: 25,
      lat: 6.4000,
      lon: -74.7500,
      especialidades: ["Urgencias", "Medicina General", "Atención Básica"]
    },
    {
      id: 33,
      nombre: "Corregimiento El Rubí (Yolombó)",
      tipo: "Corregimiento",
      direccion: "Vereda El Rubí, Yolombó",
      telefono: "(604) 865-4181",
      camas: 0,
      lat: 6.6200,
      lon: -74.9800,
      especialidades: ["Centro Poblado"]
    },
    {
      id: 34,
      nombre: "Corregimiento La Floresta (Yolombó)",
      tipo: "Corregimiento",
      direccion: "Vereda La Floresta, Yolombó",
      telefono: "(604) 865-4181",
      camas: 0,
      lat: 6.6100,
      lon: -74.9600,
      especialidades: ["Centro Poblado"]
    },
    {
      id: 35,
      nombre: "Corregimiento Villa Nueva (Yolombó)",
      tipo: "Corregimiento",
      direccion: "Vereda Villa Nueva, Yolombó",
      telefono: "(604) 865-4181",
      camas: 0,
      lat: 6.6299,
      lon: -75.1538,
      especialidades: ["Centro Poblado"]
    }
  ];

  aplicarEdicionesHospitales();

  var hospitalesLayers = {};
  var coberturaLayers = {};
  var coberturaVisible = false;
  var radioCobertura = 5000;
  var CLAVE_HOSPITALES_VISIBLE = "flota_hospitales_visible";
  var CLAVE_RADIO_COBERTURA = "flota_radio_cobertura";

  var capasVisibles = {
    vehiculos: true,
    geozonas: true,
    pois: true,
    hospitales: false,
    cobertura: false,
    ruta: true
  };

  var poiLayers = {};
  var rutaHistorial = null;
  var vehiculos = [];
  var marcadores = {};
  var mapa = null;
  var temporizador = null;
  var refrescando = false;
  var toastTimer = null;
  var geozonas = [];
  var geozonaLayers = {};
  var eventos = [];
  var idsVistos = {};
  var ultimaRevision = 0;
  var DOS_HORAS = 2 * 60 * 60 * 1000;

  function cargarEventosLocal() {
    try {
      var guardados = localStorage.getItem("flota_eventos");
      if (guardados) {
        eventos = JSON.parse(guardados);
        var cutoff = Date.now() - DOS_HORAS;
        eventos = eventos.filter(function (e) {
          var t = new Date(e.hora).getTime();
          return t > cutoff;
        });
      }
      var guardadosIds = localStorage.getItem("flota_idsVistos");
      if (guardadosIds) idsVistos = JSON.parse(guardadosIds);
    } catch (e) { /* ignore */ }
  }

  function guardarEventosLocal() {
    try {
      localStorage.setItem("flota_eventos", JSON.stringify(eventos));
      localStorage.setItem("flota_idsVistos", JSON.stringify(idsVistos));
    } catch (e) { /* ignore */ }
  }

  cargarEventosLocal();
  var filtroActual = { buscar: "", estado: "", conductor: "" };
  var tiempoQuieto = {};
  var distanciasCache = {};

  var $ = function (s) { return document.querySelector(s); };

  var lista = $("#vehiculos");
  var elConexion = $("#conexion");
  var elConexionTexto = $("#conexion-texto");
  var alertaInicial = $("#alerta-inicial");
  var modal = $("#modal");
  var toastEl = $("#toast");
  var formConfig = $("#form-config");
  var geozonaModal = $("#modal-geozona");
  var formGeozona = $("#form-geozona");
  var geozonaEditandoId = null;

  function cargarConfig() {
    try {
      var guardado = localStorage.getItem(CLAVE);
      if (guardado) {
        var c = JSON.parse(guardado);
        return Object.assign({}, CONFIG_POR_DEFECTO, c);
      }
    } catch (e) {}
    return Object.assign({}, CONFIG_POR_DEFECTO);
  }

  function guardarConfig(cfg) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(cfg));
    } catch (e) {}
  }

  function cargarConsumos() {
    try {
      var guardado = localStorage.getItem(CLAVE_CONSUMOS);
      if (guardado) return JSON.parse(guardado) || {};
    } catch (e) {}
    return {};
  }

  function guardarConsumos() {
    try {
      localStorage.setItem(CLAVE_CONSUMOS, JSON.stringify(consumosPorVehiculo));
    } catch (e) {}
  }

  function cargarConductores() {
    try {
      var guardado = localStorage.getItem(CLAVE_CONDUCTORES);
      if (guardado) return JSON.parse(guardado) || {};
    } catch (e) {}
    return {};
  }

  function guardarConductores() {
    try {
      localStorage.setItem(CLAVE_CONDUCTORES, JSON.stringify(conductores));
    } catch (e) {}
  }

  function cargarVelocidades() {
    try {
      var guardado = localStorage.getItem(CLAVE_VELOCIDADES);
      if (guardado) return JSON.parse(guardado) || {};
    } catch (e) {}
    return {};
  }

  function guardarVelocidades() {
    try {
      localStorage.setItem(CLAVE_VELOCIDADES, JSON.stringify(historialVelocidades));
    } catch (e) {}
  }

  function cargarPois() {
    try {
      var guardado = localStorage.getItem(CLAVE_POIS);
      if (guardado) return JSON.parse(guardado) || [];
    } catch (e) {}
    return [];
  }

  function guardarPois() {
    try {
      localStorage.setItem(CLAVE_POIS, JSON.stringify(pois));
    } catch (e) {}
  }

  function cargarHospitalesEditados() {
    try {
      var guardado = localStorage.getItem(CLAVE_HOSPITALES_EDITADOS);
      if (guardado) return JSON.parse(guardado) || {};
    } catch (e) {}
    return {};
  }

  function guardarHospitalesEditados() {
    try {
      var editados = {};
      hospitales.forEach(function (h) {
        if (h._editado) {
          editados[h.id] = { lat: h.lat, lon: h.lon, direccion: h.direccion, telefono: h.telefono };
        }
      });
      localStorage.setItem(CLAVE_HOSPITALES_EDITADOS, JSON.stringify(editados));
    } catch (e) {}
  }

  function aplicarEdicionesHospitales() {
    var editados = cargarHospitalesEditados();
    hospitales.forEach(function (h) {
      if (editados[h.id]) {
        h.lat = editados[h.id].lat;
        h.lon = editados[h.id].lon;
        if (editados[h.id].direccion) h.direccion = editados[h.id].direccion;
        if (editados[h.id].telefono) h.telefono = editados[h.id].telefono;
        h._editado = true;
      }
    });
  }

  function registrarVelocidad(id, velocidad) {
    if (!historialVelocidades[id]) {
      historialVelocidades[id] = { max: 0, suma: 0, cuenta: 0, inicio: new Date().toDateString() };
    }
    var h = historialVelocidades[id];
    var hoy = new Date().toDateString();
    if (h.inicio !== hoy) {
      h.max = 0;
      h.suma = 0;
      h.cuenta = 0;
      h.inicio = hoy;
    }
    if (velocidad > h.max) h.max = velocidad;
    h.suma += velocidad;
    h.cuenta++;
  }

  function estadisticasVelocidad(id) {
    var h = historialVelocidades[id];
    if (!h || h.cuenta === 0) return { max: 0, promedio: 0 };
    return { max: h.max, promedio: Math.round(h.suma / h.cuenta) };
  }

  function consumoVehiculo(id) {
    var c = parseFloat(consumosPorVehiculo[id]);
    if (isFinite(c) && c > 0) return c;
    return parseFloat(config.consumoMedio) || 7;
  }

  function obtenerCabeceras(cfg) {
    var c = cfg || config;
    if (c.authType === "token" && c.token) {
      return { Authorization: "Bearer " + c.token.trim() };
    }
    return { Authorization: "Basic " + btoa(c.user + ":" + c.password) };
  }

  function llamarApi(ruta, cfg, opciones) {
    var c = cfg || config;
    var o = opciones || {};
    var base = (c.baseUrl || "").trim().replace(/\/+$/, "");
    if (!base) return Promise.reject(new Error("Falta la URL del servidor."));
    var op = { method: o.metodo || "GET", headers: obtenerCabeceras(c) };
    if (o.cuerpo !== undefined) {
      op.headers["Content-Type"] = "application/json";
      op.body = JSON.stringify(o.cuerpo);
    }
    if (typeof AbortController !== "undefined" && !o.sinTimeout) {
      var ctrl = new AbortController();
      op.signal = ctrl.signal;
      setTimeout(function () { ctrl.abort(); }, 15000);
    }
    return fetch(base + "/api" + ruta, op).then(function (r) {
      if (r.status === 401) throw new Error("Acceso no autorizado (401). Revisa token o credenciales.");
      if (r.status === 403) throw new Error("Sin permisos (403).");
      if (r.status === 404) throw new Error("Respuesta 404. Revisa la URL base.");
      if (r.status === 502) throw new Error("El proxy no alcanzó a Traccar (502). ¿Está corriendo el servidor?");
      if (!r.ok) throw new Error("La API respondió con estado " + r.status + ".");
      if (r.status === 204) return null;
      return r.json().catch(function () { return null; });
    });
  }

  function refrescar() {
    if (!config.baseUrl || refrescando) return;
    refrescando = true;
    estadoConexion("wait", "Actualizando…");
    Promise.all([llamarApi("/devices"), llamarApi("/positions")])
      .then(function (res) {
        var dispositivos = res[0];
        var posiciones = res[1];
        ultimasPosiciones = posiciones;
        var seleccion = dispositivos.slice();
        if (config.deviceIds.length) {
          seleccion = seleccion.filter(function (d) {
            return config.deviceIds.indexOf(d.id) !== -1;
          });
        }
        var porId = {};
        posiciones.forEach(function (p) { porId[p.deviceId] = p; });

        vehiculos = seleccion.map(function (d) {
          return enriquecer(d, porId[d.id], distanciasCache[d.id] || null);
        });
        return Promise.allSettled([cargarGeozonas(), cargarEventos()]);
      }).then(function () {
        mostrarResultados();
        calcularDistanciasDePosiciones();
      })
      .catch(manejarError)
      .finally(function () {
        refrescando = false;
      });
  }

  var ultimasPosiciones = [];

  function calcularDistanciasDePosiciones() {
    var posicionesPorDispositivo = {};
    ultimasPosiciones.forEach(function (p) {
      if (!posicionesPorDispositivo[p.deviceId]) {
        posicionesPorDispositivo[p.deviceId] = [];
      }
      posicionesPorDispositivo[p.deviceId].push(p);
    });
    vehiculos.forEach(function (v) {
      if (v.id in distanciasCache) return;
      var posiciones = posicionesPorDispositivo[v.id];
      if (!posiciones || posiciones.length < 2) return;
      posiciones.sort(function (a, b) { return new Date(a.fixTime) - new Date(b.fixTime); });
      var totalMetros = 0;
      for (var i = 1; i < posiciones.length; i++) {
        totalMetros += distanciaKm(posiciones[i - 1].latitude, posiciones[i - 1].longitude, posiciones[i].latitude, posiciones[i].longitude) * 1000;
      }
      if (totalMetros > 0) {
        distanciasCache[v.id] = totalMetros;
        v.distancia = totalMetros;
        var km = totalMetros / 1000;
        var consumo = consumoVehiculo(v.id);
        v.litros = km * (consumo / 100);
        var precio = parseFloat(config.precioCombustible) || 0;
        v.costo = v.litros * precio;
      }
    });
    pintarEstadisticas();
  }

  function manejarError(err) {
    var msg = err && err.message ? err.message : "Error desconocido.";
    if (err instanceof TypeError) {
      msg = "No se pudo conectar. Revisa la URL, que el proxy o Traccar estén activos y el CORS si apuntas directo.";
    }
    estadoConexion("error", "Desconectado");
    mostrarToast(msg, "error");
  }

  function parsearGeozona(area) {
    if (!area) return null;
    var circ = area.match(/CIRCLE\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/i);
    if (circ) {
      return { tipo: "circle", lat: parseFloat(circ[1]), lon: parseFloat(circ[2]), radio: parseFloat(circ[3]) };
    }
    var pol = area.match(/POLYGON\s*\(\((.*?)\)\)/is);
    if (pol) {
      var puntos = pol[1].trim().split(",").map(function (par) {
        var c = par.trim().split(/\s+/);
        return [parseFloat(c[0]), parseFloat(c[1])];
      });
      if (puntos.length >= 3) return { tipo: "polygon", puntos: puntos };
    }
    return null;
  }

  function cargarGeozonas() {
    return llamarApi("/geofences")
      .then(function (lista) {
        var arr = Array.isArray(lista) ? lista : [];
        geozonas = arr.map(function (g) {
          g.dispositivos = [];
          g._area = parsearGeozona(g.area);
          return g;
        });
      })
      .catch(function () {
        if (!cargarGeozonas._avisado) {
          cargarGeozonas._avisado = true;
          mostrarToast("No se pudieron cargar las geozonas.", "info");
        }
      });
  }

  function vehiculoNombre(id) {
    var v = buscarVehiculo(id);
    return v ? v.nombre : ("Vehículo " + id);
  }

  function geozonaNombre(id) {
    for (var i = 0; i < geozonas.length; i++) if (geozonas[i].id === id) return geozonas[i].name;
    return "";
  }

  function buscarGeozona(id) {
    for (var i = 0; i < geozonas.length; i++) if (geozonas[i].id === id) return geozonas[i];
    return null;
  }

  function tituloGeozona(g) {
    var v = g.dispositivos && g.dispositivos.length ? "Vehículos asignados: " + g.dispositivos.join(", ") : "Sin vehículos asignados";
    return "<strong>" + esc(g.name) + "</strong>" + (g.description ? "<br>" + esc(g.description) : "") + "<br>" + v;
  }

  var dibujandoGeozona = false;
  var centroDibujo = null;
  var circuloTemporal = null;

  var ultimaVista = "";

  function dibujarGeozonas() {
    if (typeof L === "undefined" || !mapa) return;
    var COLOR = "#8b5cf6";
    var vistos = {};
    geozonas.forEach(function (g) {
      if (!g._area) return;
      vistos[g.id] = true;
      var conf = { color: COLOR, weight: 2.5, dashArray: "6 4", fillColor: COLOR, fillOpacity: 0.15 };
      var capa = geozonaLayers[g.id];
      if (!capa) {
        capa = g._area.tipo === "circle"
          ? L.circle([g._area.lat, g._area.lon], Object.assign({ radius: g._area.radio }, conf))
          : L.polygon(g._area.puntos, conf);
        capa.bindPopup(tituloGeozona(g));
        capa.addTo(mapa);
        geozonaLayers[g.id] = capa;
      } else {
        if (g._area.tipo === "circle") capa.setLatLng([g._area.lat, g._area.lon]).setRadius(g._area.radio);
        else capa.setLatLngs(g._area.puntos);
        capa.getPopup().setContent(tituloGeozona(g));
      }
    });
    Object.keys(geozonaLayers).forEach(function (id) {
      if (!vistos[id]) {
        mapa.removeLayer(geozonaLayers[id]);
        delete geozonaLayers[id];
      }
    });
  }

  function renderGeozonas() {
    var contenedor = $("#geozonas");
    if (!geozonas.length) {
      contenedor.innerHTML = '<div class="vacio"><p><strong>No hay geozonas.</strong></p><p class="note" style="margin-top:0.25rem;">Crea una con el botón "Nueva geozona" para vigilar las entradas y salidas de los vehículos.</p></div>';
      return;
    }
    contenedor.innerHTML = geozonas.map(geozonaHTML).join("");
  }

  function geozonaHTML(g) {
    var tipo = g._area && g._area.tipo === "circle"
      ? "Círculo · radio " + Math.round(g._area.radio) + " m"
      : (g._area && g._area.tipo === "polygon" ? "Polígono · " + g._area.puntos.length + " vértices" : "Área no reconocida");
    var chips = g.dispositivos && g.dispositivos.length
      ? g.dispositivos.map(function (id) { return '<span class="chip">' + esc(vehiculoNombre(id)) + '</span>'; }).join("")
      : '';
    return '<article class="card geozona">' +
      '<div class="geozona__head"><div><h3>' + esc(g.name) + '</h3><p class="note">' + esc(g.description || tipo) + '</p></div>' +
      '<div class="cluster">' +
      '<button class="text-link" type="button" data-ver-geozona="' + g.id + '">Ver en mapa</button>' +
      '<button class="text-link" type="button" data-editar-geozona="' + g.id + '">Editar</button>' +
      '<button class="text-link text-link--danger" type="button" data-borrar-geozona="' + g.id + '">Eliminar</button>' +
      '</div></div>' +
      '<div class="geozona__body"><p class="note">' + tipo + '</p>' +
      (chips ? '<div class="cluster">' + chips + '</div>' : '') +
    '</article>';
  }

  function cargarEventos() {
    var ids = vehiculos.map(function (v) { return v.id; });
    if (!ids.length) return Promise.resolve();
    var primera = !ultimaRevision;
    var desde = ultimaRevision || (Date.now() - 7 * 24 * 60 * 60 * 1000);
    var desdeIso = new Date(desde).toISOString();
    var params = ids.map(function (id) { return "deviceId=" + id; }).join("&") +
      "&from=" + desdeIso + "&to=" + isoAhora();
    return llamarApi("/reports/events?" + params)
      .then(function (ev) {
        ultimaRevision = Date.now();
        var arr = Array.isArray(ev) ? ev : [];
        arr.sort(function (a, b) { return new Date(b.eventTime || b.serverTime || 0) - new Date(a.eventTime || a.serverTime || 0); });
      var nuevos = [];
      if (primera) {
        arr.forEach(function (e) { idsVistos[e.id] = true; });
        eventos = arr.slice(0, 40).map(enriquecerEvento);
      } else {
        nuevos = arr.filter(function (e) {
          if (idsVistos[e.id]) return false;
          idsVistos[e.id] = true;
          return true;
        }).slice(0, 3);
        nuevos.forEach(notificarEvento);
        var nuevosEnriquecidos = arr.filter(function (e) { return !eventos.some(function (ex) { return ex.id === e.id; }); }).map(enriquecerEvento);
        eventos = nuevosEnriquecidos.concat(eventos).slice(0, 40);
        renderAlarmas();
      }
      var claves = Object.keys(idsVistos);
      if (claves.length > 200) {
        claves.slice(0, claves.length - 200).forEach(function (k) { delete idsVistos[k]; });
      }
      guardarEventosLocal();
      return true;
      })
      .catch(function () {
        if (!cargarEventos._avisado) {
          cargarEventos._avisado = true;
          mostrarToast("No se pudieron cargar los eventos.", "info");
        }
        return false;
      });
  }

  function enriquecerEvento(e) {
    return {
      id: e.id,
      tipo: e.type || "desconocido",
      vehiculo: vehiculoNombre(e.deviceId),
      geozona: geozonaNombre(e.geofenceId),
      hora: e.eventTime || e.serverTime || ""
    };
  }

  function renderAlarmas() {
    var contenedor = $("#alarmas");
    var total = $("#alarmas-num");
    var dosHorasAtras = Date.now() - 2 * 60 * 60 * 1000;
    eventos = eventos.filter(function (e) { return new Date(e.hora).getTime() > dosHorasAtras; });
    if (!eventos.length) {
      contenedor.innerHTML = '<div class="vacio"><p><strong>Sin alarmas registradas.</strong></p><p class="note" style="margin-top:0.25rem;">Las alarmas SOS de los dispositivos, y las entradas/salidas de geozonas, aparecerán aquí en tiempo real.</p></div>';
      total.textContent = "0";
      return;
    }
    total.textContent = String(eventos.length);
    contenedor.innerHTML = eventos.map(eventoHTML).join("");
  }

  function eventoHTML(e) {
    var mapaTipo = {
      geofenceEnter: ["success", "Entró a"],
      geofenceExit: ["warning", "Salió de"],
      geofence: ["info", "Geozona"],
      alarm: ["danger", "SOS"]
    };
    var mi = mapaTipo[e.tipo] || ["neutral", e.tipo];
    var texto = e.tipo === "alarm"
      ? "Alarma SOS · " + e.vehiculo
      : e.vehiculo + " " + mi[1] + " " + (e.geozona || "una geozona");
    var encabezado = e.tipo === "alarm"
      ? '<span class="badge badge--danger">' + mi[1] + '</span>'
      : '<span class="badge badge--' + mi[0] + '">' + mi[1] + '</span>';
    return '<div class="evento' + (e.tipo === "alarm" ? " evento--alarma" : "") + '">' +
      encabezado +
      '<span>' + esc(texto) + (e.hora ? ' · <span style="font-size:85%">' + desdeHace(e.hora) + '</span>' : '') + '</span>' +
      '<span class="evento__time" title="' + (e.hora ? esc(fechaHoraLocal(e.hora)) : "") + '">' + (e.hora ? fechaHoraLocal(e.hora) : "") + '</span>' +
    '</div>';
  }

  function notificarEvento(e) {
    var tipo = { geofenceEnter: "success", geofenceExit: "warning", geofence: "info", alarm: "error" }[e.type] || "info";
    var nombreV = vehiculoNombre(e.deviceId);
    var nombreG = geozonaNombre(e.geofenceId);
    var msg = e.type === "alarm"
      ? "¡SOS! Alarma de pánico desde " + nombreV
      : nombreV + (e.type === "geofenceEnter" ? " entró a " : " salió de ") + (nombreG || "una geozona");
    mostrarToast(msg, tipo);
  }

  function actualizarTiempoQuieto() {
    vehiculos.forEach(function (v) {
      if (!v.tienePosicion) {
        tiempoQuieto[v.id] = null;
        return;
      }
      if (v.velocidad > 1) {
        tiempoQuieto[v.id] = { desde: Date.now(), activo: false };
      } else {
        if (!tiempoQuieto[v.id] || !tiempoQuieto[v.id].activo) {
          tiempoQuieto[v.id] = { desde: Date.now(), activo: true };
        }
      }
    });
  }

  function formatearTiempo(ms) {
    if (!ms || ms < 0) return "—";
    var s = Math.floor(ms / 1000);
    if (s < 60) return s + " seg";
    var m = Math.floor(s / 60);
    if (m < 60) return m + " min " + (s % 60) + " seg";
    var h = Math.floor(m / 60);
    return h + " h " + (m % 60) + " min";
  }

  function tiempoQuietoHtml(id) {
    var t = tiempoQuieto[id];
    if (!t || !t.activo) return "En movimiento";
    return formatearTiempo(Date.now() - t.desde);
  }

  function abrirModalGeozona() {
    geozonaEditandoId = null;
    $("#modal-geozona-titulo").textContent = "Nueva geozona";
    formGeozona.querySelector('[type="submit"]').textContent = "Crear geozona";
    rellenarModalGeozona();
    geozonaModal.hidden = false;
    $("#gz-nombre").focus();
  }

  function editarGeozona(id) {
    var g = buscarGeozona(id);
    if (!g) return;
    geozonaEditandoId = id;
    $("#modal-geozona-titulo").textContent = "Editar geozona";
    formGeozona.querySelector('[type="submit"]').textContent = "Guardar cambios";
    rellenarModalGeozona();
    $("#gz-nombre").value = g.name || "";
    $("#gz-desc").value = g.description || "";
    if (g._area && g._area.tipo === "circle") {
      $("#gz-lat").value = g._area.lat;
      $("#gz-lon").value = g._area.lon;
      $("#gz-radio").value = Math.round(g._area.radio);
    }
    geozonaModal.hidden = false;
    $("#gz-nombre").focus();
  }

  function cerrarModalGeozona() {
    geozonaEditandoId = null;
    geozonaModal.hidden = true;
  }

  function rellenarModalGeozona() {
    var conPos = vehiculos.filter(function (v) { return v.tienePosicion; });
    $("#gz-elegir").innerHTML = '<option value="mapa">Centro actual del mapa</option>' +
      conPos.map(function (v) { return '<option value="' + v.id + '">' + esc(v.nombre) + '</option>'; }).join("");
    $("#gz-aplicar").innerHTML = '<option value="0">Todos los vehículos</option>' +
      vehiculos.map(function (v) { return '<option value="' + v.id + '">' + esc(v.nombre) + '</option>'; }).join("");
    $("#gz-nombre").value = "";
    $("#gz-desc").value = "";
    $("#gz-radio").value = 500;
    $("#gz-aplicar").value = "0";
    $("#gz-elegir").value = conPos.length ? String(conPos[0].id) : "mapa";
    rellenarCoordenadasGeozona();
  }

  function rellenarCoordenadasGeozona() {
    var val = $("#gz-elegir").value;
    var v = buscarVehiculo(parseInt(val, 10));
    if (v && v.tienePosicion) {
      $("#gz-lat").value = v.lat.toFixed(6);
      $("#gz-lon").value = v.lon.toFixed(6);
    } else if (mapa && typeof L !== "undefined") {
      var c = mapa.getCenter();
      $("#gz-lat").value = c.lat.toFixed(6);
      $("#gz-lon").value = c.lng.toFixed(6);
    } else {
      $("#gz-lat").value = "4.711000";
      $("#gz-lon").value = "-74.072100";
    }
  }

  function crearGeozonaGuardada(e) {
    e.preventDefault();
    cancelarDibujoGeozona();
    var nombre = $("#gz-nombre").value.trim();
    var descripcion = $("#gz-desc").value.trim();
    var lat = parseFloat($("#gz-lat").value);
    var lon = parseFloat($("#gz-lon").value);
    var radio = parseFloat($("#gz-radio").value);
    var aplicar = parseInt($("#gz-aplicar").value, 10);
    if (!nombre || isNaN(lat) || isNaN(lon) || !radio || radio <= 0) {
      mostrarToast("Completa nombre, coordenadas y un radio válido.", "error");
      return;
    }
    var area = "CIRCLE (" + lat.toFixed(6) + ", " + lon.toFixed(6) + ", " + Math.round(radio) + ")";
    var cuerpo = { name: nombre, description: descripcion, area: area };
    if (geozonaEditandoId) {
      var idEditar = geozonaEditandoId;
      var cuerpoEditar = { id: idEditar, name: nombre, description: descripcion, area: area };
      llamarApi("/geofences/" + idEditar, null, { metodo: "PUT", cuerpo: cuerpoEditar })
        .then(function () {
          cerrarModalGeozona();
          mostrarToast("Geozona actualizada.", "success");
          refrescar();
        })
        .catch(manejarError);
      return;
    }
    llamarApi("/geofences", null, { metodo: "POST", cuerpo: cuerpo })
      .then(function (geo) {
        var vinculados = aplicar === 0 ? vehiculos.map(function (v) { return v.id; }) : [aplicar];
        return Promise.all(vinculados.map(function (did) {
          return llamarApi("/permissions", null, { metodo: "POST", cuerpo: { deviceId: did, geofenceId: geo.id } });
        }));
      })
      .then(function () {
        cerrarModalGeozona();
        mostrarToast("Geozona creada y asignada.", "success");
        refrescar();
      })
      .catch(manejarError);
  }

  function iniciarDibujoGeozona() {
    if (typeof L === "undefined" || !mapa) {
      mostrarToast("El mapa no está disponible para dibujar.", "error");
      return;
    }
    dibujandoGeozona = true;
    centroDibujo = null;
    mostrarToast("Haz clic en el mapa para centrar la geozona, luego arrastra para definir el radio.", "info");
    mapa.getContainer().classList.add("mapa-dibujando");
    mapa.once("click", onMapaClickDibujo);
  }

  function cancelarDibujoGeozona() {
    dibujandoGeozona = false;
    centroDibujo = null;
    if (circuloTemporal) {
      mapa.removeLayer(circuloTemporal);
      circuloTemporal = null;
    }
    mapa.getContainer().classList.remove("mapa-dibujando");
    mapa.off("click", onMapaClickDibujo);
    mapa.off("mousemove", onMapaMoveDibujo);
    mapa.off("mouseup", onMapaUpDibujo);
  }

  function onMapaClickDibujo(e) {
    if (!dibujandoGeozona) return;
    centroDibujo = e.latlng;
    circuloTemporal = L.circle(centroDibujo, {
      radius: 50,
      color: "#8b5cf6",
      weight: 2,
      dashArray: "6 4",
      fillColor: "#8b5cf6",
      fillOpacity: 0.2,
      interactive: false
    }).addTo(mapa);
    mapa.on("mousemove", onMapaMoveDibujo);
    mapa.on("mouseup", onMapaUpDibujo);
  }

  function onMapaMoveDibujo(e) {
    if (!dibujandoGeozona || !centroDibujo) return;
    var radio = centroDibujo.distanceTo(e.latlng);
    radio = Math.max(50, Math.round(radio / 50) * 50);
    circuloTemporal.setRadius(radio);
  }

  function onMapaUpDibujo(e) {
    if (!dibujandoGeozona || !centroDibujo) return;
    var radio = centroDibujo.distanceTo(e.latlng);
    radio = Math.max(50, Math.round(radio / 50) * 50);
    circuloTemporal.setRadius(radio);
    dibujandoGeozona = false;
    mapa.getContainer().classList.remove("mapa-dibujando");
    mapa.off("mousemove", onMapaMoveDibujo);
    mapa.off("mouseup", onMapaUpDibujo);
    $("#gz-lat").value = centroDibujo.lat.toFixed(6);
    $("#gz-lon").value = centroDibujo.lng.toFixed(6);
    $("#gz-radio").value = radio;
    mostrarToast("Geozona dibujada: radio " + radio + " metros. Completá el nombre y guardá.", "success");
    setTimeout(function () {
      if (circuloTemporal) {
        mapa.removeLayer(circuloTemporal);
        circuloTemporal = null;
      }
    }, 3000);
    rellenarModalGeozona();
    $("#gz-lat").value = centroDibujo.lat.toFixed(6);
    $("#gz-lon").value = centroDibujo.lng.toFixed(6);
    $("#gz-radio").value = radio;
    geozonaModal.hidden = false;
    $("#gz-nombre").focus();
  }

  function borrarGeozona(id) {
    var g = buscarGeozona(id);
    if (!confirm("¿Eliminar la geozona '" + (g ? g.name : id) + "'? También se quitan sus asignaciones.")) return;
    llamarApi("/geofences/" + id, null, { metodo: "DELETE" })
      .then(function () {
        mostrarToast("Geozona eliminada.", "success");
        refrescar();
      })
      .catch(manejarError);
  }

  var modalPoi = $("#modal-poi");
  var formPoi = $("#form-poi");

  var iconosPoi = { pin: "📍", bodega: "🏭", cliente: "👤", gasolinera: "⛽", taller: "🔧", oficina: "🏢" };

  function abrirModalPoi() {
    poiEditandoId = null;
    $("#modal-poi-titulo").textContent = "Nuevo punto de interés";
    var conPos = vehiculos.filter(function (v) { return v.tienePosicion; });
    $("#poi-elegir").innerHTML = '<option value="mapa">Centro actual del mapa</option>' +
      conPos.map(function (v) { return '<option value="' + v.id + '">' + esc(v.nombre) + '</option>'; }).join("");
    $("#poi-nombre").value = "";
    $("#poi-tipo").value = "pin";
    if (conPos.length) {
      $("#poi-lat").value = conPos[0].lat.toFixed(6);
      $("#poi-lon").value = conPos[0].lon.toFixed(6);
    } else if (mapa && typeof L !== "undefined") {
      var c = mapa.getCenter();
      $("#poi-lat").value = c.lat.toFixed(6);
      $("#poi-lon").value = c.lng.toFixed(6);
    }
    modalPoi.hidden = false;
    $("#poi-nombre").focus();
  }

  function cerrarModalPoi() { modalPoi.hidden = true; }

  function guardarPoi(e) {
    e.preventDefault();
    if (poiEditandoId !== null) {
      guardarPoiEditado(e);
      return;
    }
    var nombre = $("#poi-nombre").value.trim();
    var tipo = $("#poi-tipo").value;
    var lat = parseFloat($("#poi-lat").value);
    var lon = parseFloat($("#poi-lon").value);
    if (!nombre || isNaN(lat) || isNaN(lon)) {
      mostrarToast("Completa nombre y coordenadas.", "error");
      return;
    }
    pois.push({ id: Date.now(), nombre: nombre, tipo: tipo, lat: lat, lon: lon });
    guardarPois();
    cerrarModalPoi();
    mostrarToast("POI creado.", "success");
    dibujarPois();
    renderPois();
  }

  function borrarPoi(id) {
    pois = pois.filter(function (p) { return p.id !== id; });
    guardarPois();
    if (poiLayers[id]) { mapa.removeLayer(poiLayers[id]); delete poiLayers[id]; }
    renderPois();
    mostrarToast("POI eliminado.", "success");
  }

  var poiEditandoId = null;

  function abrirModalEditarPoi(id) {
    var poi = null;
    for (var i = 0; i < pois.length; i++) {
      if (pois[i].id === id) { poi = pois[i]; break; }
    }
    if (!poi) return;
    poiEditandoId = id;
    modalPoi.hidden = false;
    $("#modal-poi-titulo").textContent = "Editar punto de interés";
    $("#poi-nombre").value = poi.nombre;
    $("#poi-tipo").value = poi.tipo;
    $("#poi-lat").value = poi.lat;
    $("#poi-lon").value = poi.lon;
    $("#poi-nombre").focus();
  }

  function guardarPoiEditado(e) {
    e.preventDefault();
    var nombre = $("#poi-nombre").value.trim();
    var tipo = $("#poi-tipo").value;
    var lat = parseFloat($("#poi-lat").value);
    var lon = parseFloat($("#poi-lon").value);
    if (!nombre || isNaN(lat) || isNaN(lon)) {
      mostrarToast("Completa nombre y coordenadas.", "error");
      return;
    }
    for (var i = 0; i < pois.length; i++) {
      if (pois[i].id === poiEditandoId) {
        pois[i].nombre = nombre;
        pois[i].tipo = tipo;
        pois[i].lat = lat;
        pois[i].lon = lon;
        break;
      }
    }
    guardarPois();
    cerrarModalPoi();
    poiEditandoId = null;
    mostrarToast("POI actualizado.", "success");
    dibujarPois();
    renderPois();
  }

  var modalHospital = $("#modal-hospital");
  var hospitalEditandoId = null;
  var CLAVE_HOSPITALES_CUSTOM = "flota_hospitales_custom";

  function cargarHospitalesCustom() {
    try { return JSON.parse(localStorage.getItem(CLAVE_HOSPITALES_CUSTOM)) || {}; } catch (e) { return {}; }
  }

  function guardarHospitalesCustom(datos) {
    localStorage.setItem(CLAVE_HOSPITALES_CUSTOM, JSON.stringify(datos));
  }

  function aplicarHospitalesCustom() {
    var custom = cargarHospitalesCustom();
    Object.keys(custom).forEach(function (id) {
      var h = null;
      for (var i = 0; i < hospitales.length; i++) {
        if (hospitales[i].id === parseInt(id, 10)) { h = hospitales[i]; break; }
      }
      if (h) { h.lat = custom[id].lat; h.lon = custom[id].lon; }
    });
  }

  function abrirModalHospital(id) {
    var h = null;
    for (var i = 0; i < hospitales.length; i++) {
      if (hospitales[i].id === id) { h = hospitales[i]; break; }
    }
    if (!h) return;
    hospitalEditandoId = id;
    $("#modal-hospital-titulo").textContent = "Editar " + h.nombre;
    $("#hospital-nombre").value = h.nombre;
    $("#hospital-tipo").value = h.tipo;
    $("#hospital-direccion").value = h.direccion || "";
    $("#hospital-telefono").value = h.telefono || "";
    $("#hospital-lat").value = h.lat;
    $("#hospital-lon").value = h.lon;
    modalHospital.hidden = false;
  }

  function cerrarModalHospital() { modalHospital.hidden = true; hospitalEditandoId = null; }

  function guardarHospital(e) {
    e.preventDefault();
    var lat = parseFloat($("#hospital-lat").value);
    var lon = parseFloat($("#hospital-lon").value);
    if (isNaN(lat) || isNaN(lon)) {
      mostrarToast("Completa las coordenadas.", "error");
      return;
    }
    for (var i = 0; i < hospitales.length; i++) {
      if (hospitales[i].id === hospitalEditandoId) {
        hospitales[i].lat = lat;
        hospitales[i].lon = lon;
        hospitales[i].direccion = $("#hospital-direccion").value.trim();
        hospitales[i].telefono = $("#hospital-telefono").value.trim();
        break;
      }
    }
    var custom = cargarHospitalesCustom();
    custom[hospitalEditandoId] = { lat: lat, lon: lon };
    guardarHospitalesCustom(custom);
    cerrarModalHospital();
    mostrarToast("Hospital actualizado.", "success");
    if (capasVisibles.hospitales) { dibujarHospitales(); }
  }

  function dibujarPois() {
    if (typeof L === "undefined" || !mapa) return;
    var vistos = {};
    pois.forEach(function (p) {
      vistos[p.id] = true;
      var icon = L.divIcon({ className: "poi-marker", html: '<span class="poi-icon">' + (iconosPoi[p.tipo] || "📍") + '</span>', iconSize: [24, 24], iconAnchor: [12, 12] });
      var cercano = hospitalCercano(p.lat, p.lon);
      var popup = "<strong>" + esc(p.nombre) + "</strong><br>" + (iconosPoi[p.tipo] || "") + " " + p.tipo;
      if (cercano) popup += "<br>🏥 " + esc(cercano.nombre) + " · " + cercano.distancia.toFixed(1) + " km";
      if (!poiLayers[p.id]) {
        poiLayers[p.id] = L.marker([p.lat, p.lon], { icon: icon }).addTo(mapa);
        poiLayers[p.id].bindPopup(popup);
      } else {
        poiLayers[p.id].setLatLng([p.lat, p.lon]);
        poiLayers[p.id].setPopupContent(popup);
      }
    });
    Object.keys(poiLayers).forEach(function (id) {
      if (!vistos[id]) { mapa.removeLayer(poiLayers[id]); delete poiLayers[id]; }
    });
  }

  function hospitalCercano(lat, lon) {
    var mejor = null;
    var menor = Infinity;
    hospitales.forEach(function (h) {
      var d = distanciaKm(lat, lon, h.lat, h.lon);
      if (d < menor) { menor = d; mejor = h; }
    });
    return mejor ? { nombre: mejor.nombre, distancia: menor } : null;
  }

  function renderPois() {
    var contenedor = $("#pois");
    if (!pois.length) {
      contenedor.innerHTML = '<div class="vacio"><p><strong>No hay puntos de interés.</strong></p><p class="note">Creá uno con el botón de arriba.</p></div>';
      return;
    }
    contenedor.innerHTML = pois.map(function (p) {
      var cercano = hospitalCercano(p.lat, p.lon);
      var infoExtra = cercano
        ? '<span class="chip">🏥 ' + esc(cercano.nombre) + ' · ' + cercano.distancia.toFixed(1) + ' km</span>'
        : '';
      return '<article class="card geozona">' +
        '<div class="geozona__head"><div><h3>' + (iconosPoi[p.tipo] || "📍") + " " + esc(p.nombre) + '</h3><p class="note">' + esc(p.tipo) + '</p></div>' +
        '<div class="cluster">' +
        '<button class="text-link" type="button" data-editar-poi="' + p.id + '">Editar</button>' +
        '<button class="text-link text-link--danger" type="button" data-borrar-poi="' + p.id + '">Eliminar</button>' +
        '</div></div>' +
        (infoExtra ? '<div class="geozona__body"><div class="cluster">' + infoExtra + '</div></div>' : '') +
      '</article>';
    }).join("");
  }

  function dibujarHospitales() {
    if (typeof L === "undefined" || !mapa) return;
    var iconHospital = L.divIcon({
      className: "poi-marker",
      html: '<span class="poi-icon">🏥</span>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    var vistos = {};
    hospitales.forEach(function (h) {
      vistos[h.id] = true;
      if (!hospitalesLayers[h.id]) {
        hospitalesLayers[h.id] = L.marker([h.lat, h.lon], { icon: iconHospital })
          .addTo(mapa)
          .bindPopup(
            "<strong>" + esc(h.nombre) + "</strong><br>" +
            "<small>" + esc(h.tipo) + "</small><br>" +
            esc(h.direccion) + "<br>" +
            "Tel: " + esc(h.telefono) + "<br>" +
            "Camas: " + h.camas + "<br>" +
            "<em>" + esc(h.especialidades.join(", ")) + "</em><br>" +
            "<button class='button button--sm' style='margin-top:6px' data-editar-hospital='" + h.id + "'>Editar coordenadas</button>"
          );
      } else {
        hospitalesLayers[h.id].setLatLng([h.lat, h.lon]);
      }
    });
    Object.keys(hospitalesLayers).forEach(function (id) {
      if (!vistos[id]) {
        mapa.removeLayer(hospitalesLayers[id]);
        delete hospitalesLayers[id];
      }
    });
  }

  function toggleHospitales() {
    coberturaVisible = !coberturaVisible;
    localStorage.setItem(CLAVE_HOSPITALES_VISIBLE, coberturaVisible);
    if (coberturaVisible) {
      dibujarHospitales();
      mostrarToast("Capa de hospitales activada", "success");
    } else {
      Object.keys(hospitalesLayers).forEach(function (id) {
        mapa.removeLayer(hospitalesLayers[id]);
      });
      hospitalesLayers = {};
      Object.keys(coberturaLayers).forEach(function (id) {
        mapa.removeLayer(coberturaLayers[id]);
      });
      coberturaLayers = {};
      mostrarToast("Capa de hospitales desactivada", "info");
    }
  }

  function dibujarCobertura() {
    if (typeof L === "undefined" || !mapa || !coberturaVisible) return;
    Object.keys(coberturaLayers).forEach(function (id) {
      mapa.removeLayer(coberturaLayers[id]);
    });
    coberturaLayers = {};
    hospitales.forEach(function (h) {
      var circle = L.circle([h.lat, h.lon], {
        radius: radioCobertura,
        color: "#2563eb",
        weight: 2,
        fillColor: "#2563eb",
        fillOpacity: 0.1,
        dashArray: "8 4"
      }).addTo(mapa);
      circle.bindPopup(
        "<strong>" + esc(h.nombre) + "</strong><br>" +
        "Cobertura: " + (radioCobertura / 1000) + " km"
      );
      coberturaLayers[h.id] = circle;
    });
  }

  function cambiarRadioCobertura(nuevoRadio) {
    radioCobertura = parseInt(nuevoRadio, 10) || 5000;
    localStorage.setItem(CLAVE_RADIO_COBERTURA, radioCobertura);
    if (coberturaVisible) dibujarCobertura();
  }

  function toggleCapa(nombre, visible) {
    capasVisibles[nombre] = visible;
    if (nombre === "vehiculos") {
      Object.keys(marcadores).forEach(function (id) {
        if (visible) marcadores[id].addTo(mapa);
        else mapa.removeLayer(marcadores[id]);
      });
    }
    if (nombre === "geozonas") {
      Object.keys(geozonaLayers).forEach(function (id) {
        if (visible) geozonaLayers[id].addTo(mapa);
        else mapa.removeLayer(geozonaLayers[id]);
      });
    }
    if (nombre === "pois") {
      Object.keys(poiLayers).forEach(function (id) {
        if (visible) poiLayers[id].addTo(mapa);
        else mapa.removeLayer(poiLayers[id]);
      });
    }
    if (nombre === "hospitales") {
      if (visible) dibujarHospitales();
      else {
        Object.keys(hospitalesLayers).forEach(function (id) {
          mapa.removeLayer(hospitalesLayers[id]);
        });
        hospitalesLayers = {};
      }
    }
    if (nombre === "cobertura") {
      if (visible) dibujarCobertura();
      else {
        Object.keys(coberturaLayers).forEach(function (id) {
          mapa.removeLayer(coberturaLayers[id]);
        });
        coberturaLayers = {};
      }
    }
    if (nombre === "ruta") {
      if (visible) {
        if (rutaHistorial) rutaHistorial.addTo(mapa);
      } else {
        if (rutaHistorial) mapa.removeLayer(rutaHistorial);
      }
    }
  }

  function renderHospitales() {
    var summaryContent = $(".hospital-summary__content");
    var contenedor = $("#hospitales");
    if (!summaryContent || !contenedor) return;

    var tipos = {};
    var totalCamas = 0;
    hospitales.forEach(function (h) {
      tipos[h.tipo] = (tipos[h.tipo] || 0) + 1;
      totalCamas += parseInt(h.camas) || 0;
    });
    var tipoHtml = Object.keys(tipos).map(function (t) {
      return '<span class="chip">' + esc(t) + ': ' + tipos[t] + '</span>';
    }).join("");

    summaryContent.innerHTML =
      '<div class="hospital-summary__stats">' +
        '<div class="hospital-summary__item"><span class="hospital-summary__value">' + hospitales.length + '</span><span class="hospital-summary__label">sedes</span></div>' +
        '<div class="hospital-summary__item"><span class="hospital-summary__value">' + totalCamas.toLocaleString("es-CO") + '</span><span class="hospital-summary__label">camas</span></div>' +
      '</div>' +
      '<div class="cluster" style="gap:0.3rem;">' + tipoHtml + '</div>';

    contenedor.innerHTML = hospitales.map(function (h) {
      return '<article class="card geozona">' +
        '<div class="geozona__head"><div><h3>🏥 ' + esc(h.nombre) + '</h3>' +
        '<p class="note">' + esc(h.tipo) + ' · ' + esc(h.direccion) + '</p></div>' +
        '<div class="cluster">' +
        '<button class="text-link" type="button" data-editar-hospital="' + h.id + '">Editar</button>' +
        '<button class="text-link" type="button" data-ver-hospital="' + h.id + '">Ver en mapa</button>' +
        '</div></div>' +
        '<div class="geozona__body">' +
        '<p class="note">Tel: ' + esc(h.telefono) + ' · Camas: ' + h.camas + '</p>' +
        '<p class="note">📍 ' + h.lat.toFixed(5) + ', ' + h.lon.toFixed(5) + '</p>' +
        '<div class="cluster">' + h.especialidades.map(function (e) {
          return '<span class="chip">' + esc(e) + '</span>';
        }).join("") + '</div></div></article>';
    }).join("");

    var expandBtn = $("#btn-expandir-hospitales");
    var expandSection = $("#hospital-expand");
    if (expandBtn) {
      expandBtn.onclick = function () {
        var visible = !expandSection.hidden;
        expandSection.hidden = visible;
        expandBtn.innerHTML = visible
          ? '<svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg>'
          : '<svg class="icon" aria-hidden="true"><use href="#i-minus"/></svg>';
        expandBtn.title = visible ? "Mostrar todos" : "Ocultar";
        expandBtn.setAttribute("aria-label", expandBtn.title);
      };
    }
  }

  function rellenarSelectorHistorial() {
    var sel = $("#hist-vehiculo");
    if (!sel) return;
    sel.innerHTML = vehiculos.map(function (v) {
      return '<option value="' + v.id + '">' + esc(v.nombre) + ' (ID ' + v.id + ')</option>';
    }).join("");
    if (rellenarSelectorHistorial._inicializado) return;
    rellenarSelectorHistorial._inicializado = true;
    var rango = $("#hist-rango").value;
    if (rango && rango !== "personalizado") {
      aplicarRangoHistorial(rango);
    }
  }

  function fechaLocalInput(fecha) {
    var y = fecha.getFullYear();
    var m = String(fecha.getMonth() + 1).padStart(2, "0");
    var d = String(fecha.getDate()).padStart(2, "0");
    var h = String(fecha.getHours()).padStart(2, "0");
    var min = String(fecha.getMinutes()).padStart(2, "0");
    return y + "-" + m + "-" + d + "T" + h + ":" + min;
  }

  function aplicarRangoHistorial(rango) {
    var ahora = new Date();
    var desde, hasta;
    if (rango === "hoy") {
      desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
      hasta = ahora;
    } else if (rango === "ayer") {
      hasta = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
      desde = new Date(hasta.getTime() - 24 * 60 * 60 * 1000);
    } else if (rango === "hoy-24h") {
      hasta = ahora;
      desde = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
    } else if (rango === "esta-semana") {
      var diaSemana = ahora.getDay() || 7;
      desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - diaSemana + 1, 0, 0, 0);
      hasta = ahora;
    } else if (rango === "semana-pasada") {
      var diaSemana2 = ahora.getDay() || 7;
      hasta = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - diaSemana2 + 1, 0, 0, 0);
      desde = new Date(hasta.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (rango === "este-mes") {
      desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0);
      hasta = ahora;
    } else if (rango === "mes-pasado") {
      hasta = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0);
      desde = new Date(hasta.getFullYear(), hasta.getMonth() - 1, 1, 0, 0, 0);
    } else {
      return;
    }
    if (desde) $("#hist-desde").value = fechaLocalInput(desde);
    if (hasta) $("#hist-hasta").value = fechaLocalInput(hasta);
  }

  function limpiarHistorial() {
    detenerPlayback();
    if (rutaHistorial) { mapa.removeLayer(rutaHistorial); rutaHistorial = null; }
    if (pbMarcador) { mapa.removeLayer(pbMarcador); pbMarcador = null; }
    pbLineas.forEach(function (l) { mapa.removeLayer(l); });
    pbLineas = [];
    pbMarcadoresInicio.forEach(function (m) { mapa.removeLayer(m); });
    pbMarcadoresInicio = [];
    pbMarcadoresFin.forEach(function (m) { mapa.removeLayer(m); });
    pbMarcadoresFin = [];
  }

  var pbPosiciones = [];
  var pbIndex = 0;
  var pbIntervalo = null;
  var pbMarcador = null;
  var pbDetalles = [];
  var pbLineas = [];
  var pbMarcadoresInicio = [];
  var pbMarcadoresFin = [];

  function cargarHistorial() {
    var id = parseInt($("#hist-vehiculo").value, 10);
    var desde = $("#hist-desde").value;
    var hasta = $("#hist-hasta").value;
    if (!id || !desde || !hasta) {
      mostrarToast("Seleccioná vehículo y rango de tiempo.", "error");
      return;
    }
    function histLocalIso(val) {
      var d = new Date(val);
      var y = d.getFullYear();
      var mo = String(d.getMonth() + 1).padStart(2, "0");
      var dia = String(d.getDate()).padStart(2, "0");
      var h = String(d.getHours()).padStart(2, "0");
      var min = String(d.getMinutes()).padStart(2, "0");
      var off = -d.getTimezoneOffset();
      var sign = off >= 0 ? "+" : "-";
      var offH = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0");
      var offM = String(Math.abs(off) % 60).padStart(2, "0");
      return y + "-" + mo + "-" + dia + "T" + h + ":" + min + ":00" + sign + offH + ":" + offM;
    }
    if (!mapa || typeof L === "undefined") {
      mostrarToast("El mapa no está disponible.", "error");
      return;
    }
    limpiarHistorial();
    detenerPlayback();
    pbPosiciones = [];
    pbDetalles = [];
    pbIndex = 0;
    $("#hist-controles").style.display = "none";
    var desdeIso = histLocalIso(desde);
    var hastaIso = histLocalIso(hasta);
    var info = $("#hist-info");
    info.textContent = "Cargando...";
    llamarApi("/positions?deviceId=" + id + "&from=" + desdeIso + "&to=" + hastaIso)
      .then(function (todasPos) {
      todasPos = Array.isArray(todasPos) ? todasPos : [];
      todasPos.sort(function (a, b) { return new Date(a.fixTime) - new Date(b.fixTime); });
      if (!todasPos.length) {
        info.textContent = "No hay posiciones en ese rango de tiempo.";
        return;
      }
      var UMbralParada = 5;
      var umbralDistancia = 0.1;
      var umbralTiempo = 2;
      var viajesCalc = [];
      var actual = null;
      for (var i = 0; i < todasPos.length; i++) {
        var vel = todasPos[i].speed ? Math.round(todasPos[i].speed * 1.852) : 0;
        if (vel > 0 && !actual) {
          actual = { startTime: todasPos[i].fixTime, startLat: todasPos[i].latitude, startLon: todasPos[i].longitude, puntos: [todasPos[i]], km: 0, maxSpeed: vel, distance: 0 };
        } else if (actual) {
          actual.puntos.push(todasPos[i]);
          if (i > 0) {
            var dist = distanciaKm(todasPos[i - 1].latitude, todasPos[i - 1].longitude, todasPos[i].latitude, todasPos[i].longitude);
            actual.km += dist;
          }
          if (vel > actual.maxSpeed) actual.maxSpeed = vel;
          if (vel === 0) {
            var tiempoQuietos = 0;
            for (var j = i + 1; j < todasPos.length; j++) {
              var vj = todasPos[j].speed ? Math.round(todasPos[j].speed * 1.852) : 0;
              if (vj > 0) break;
              tiempoQuietos = (new Date(todasPos[j].fixTime) - new Date(todasPos[i].fixTime)) / 60000;
            }
            if (tiempoQuietos >= UMbralParada || i === todasPos.length - 1) {
              actual.endTime = todasPos[i].fixTime;
              actual.endLat = todasPos[i].latitude;
              actual.endLon = todasPos[i].longitude;
              actual.distance = actual.km * 1000;
              var durMin = (new Date(actual.endTime) - new Date(actual.startTime)) / 60000;
              if (actual.km >= umbralDistancia && durMin >= umbralTiempo) {
                viajesCalc.push(actual);
              }
              actual = null;
            }
          }
        }
      }
      if (actual && actual.puntos.length > 1) {
        actual.endTime = todasPos[todasPos.length - 1].fixTime;
        actual.endLat = todasPos[todasPos.length - 1].latitude;
        actual.endLon = todasPos[todasPos.length - 1].longitude;
        actual.distance = actual.km * 1000;
        var durFin = (new Date(actual.endTime) - new Date(actual.startTime)) / 60000;
        if (actual.km >= umbralDistancia && durFin >= umbralTiempo) {
          viajesCalc.push(actual);
        }
      }
      if (!viajesCalc.length) {
        info.textContent = "No hay viajes en ese rango de tiempo.";
        return;
      }
      var viajes = viajesCalc;
      var colores = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];
      viajes.forEach(function (viaje, idx) {
        pbDetalles.push({ viaje: viaje, posiciones: viaje.puntos, color: colores[idx % colores.length] });
      });
      var todosPuntos = [];
      pbLineas = [];
      pbMarcadoresInicio = [];
      pbMarcadoresFin = [];
      pbDetalles.forEach(function (item, idx) {
        var puntos = item.posiciones.map(function (p) { return [p.latitude, p.longitude]; });
        var linea = L.polyline(puntos, { color: item.color, weight: 4, opacity: 0.3 }).addTo(mapa);
        todosPuntos = todosPuntos.concat(puntos);
        if (puntos.length >= 1) {
          var iconInicio = L.divIcon({
            className: "route-marker",
            html: '<div style="width:14px;height:14px;background:#16a34a;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });
          var iconFin = L.divIcon({
            className: "route-marker",
            html: '<div style="width:14px;height:14px;background:#dc2626;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });
          var mInicio = L.marker(puntos[0], { icon: iconInicio, interactive: false }).addTo(mapa);
          var mFin = L.marker(puntos[puntos.length - 1], { icon: iconFin, interactive: false }).addTo(mapa);
          pbMarcadoresInicio.push(mInicio);
          pbMarcadoresFin.push(mFin);
        }
        pbLineas.push(linea);
      });
      resaltarViaje(0);
      if (todosPuntos.length) {
        mapa.fitBounds(L.latLngBounds(todosPuntos).pad(0.1));
      }
      var kmTotal = 0;
      viajes.forEach(function (v) { kmTotal += (v.distance || 0); });
      var duracionMin = 0;
      viajes.forEach(function (v) {
        if (v.startTime && v.endTime) {
          duracionMin += (new Date(v.endTime) - new Date(v.startTime)) / 60000;
        }
      });
      info.innerHTML = "<strong>" + viajes.length + " viajes</strong> · " + (kmTotal / 1000).toFixed(1) + " km · " + Math.round(duracionMin) + " min totales";
      pbPosiciones = viajes;
      pbIndex = 0;
      $("#hist-controles").style.display = "";
      $("#pb-slider").max = viajes.length - 1;
      $("#pb-slider").value = 0;
      actualizarInfoPlaybackViajes(viajes);
    }).catch(function (err) {
      info.textContent = "Error: " + (err.message || "desconocido");
    });
  }

  function actualizarInfoPlaybackViajes(viajes) {
    if (!viajes || !viajes.length) return;
    var v = viajes[pbIndex] || viajes[0];
    var velMax = v.maxSpeed ? Math.round(v.maxSpeed * 1.852) : 0;
    var km = v.distance ? (v.distance / 1000).toFixed(1) : "0";
    var horaInicio = v.startTime ? horaLocal(v.startTime) : "";
    var horaFin = v.endTime ? horaLocal(v.endTime) : "";
    $("#pb-fecha").textContent = horaInicio + " — " + horaFin;
    $("#pb-info").textContent = "Viaje " + (pbIndex + 1) + "/" + viajes.length + " · " + km + " km · Vel máx: " + velMax + " km/h";
    $("#pb-slider").value = pbIndex;
  }

  function resaltarViaje(idx) {
    pbLineas.forEach(function (linea, i) {
      if (i === idx) {
        linea.setStyle({ weight: 5, opacity: 1 });
      } else {
        linea.setStyle({ weight: 2, opacity: 0.2 });
      }
    });
    pbMarcadoresInicio.forEach(function (m, i) { m.setOpacity(i === idx ? 1 : 0.15); });
    pbMarcadoresFin.forEach(function (m, i) { m.setOpacity(i === idx ? 1 : 0.15); });
    if (pbLineas[idx] && mapa) {
      mapa.fitBounds(pbLineas[idx].getBounds().pad(0.2));
    }
    if (pbDetalles[idx]) {
      var v = pbDetalles[idx].viaje;
      var velMax = v.maxSpeed ? Math.round(v.maxSpeed * 1.852) : 0;
      var km = v.distance ? (v.distance / 1000).toFixed(1) : "0";
      var horaInicio = v.startTime ? horaLocal(v.startTime) : "";
      var horaFin = v.endTime ? horaLocal(v.endTime) : "";
      $("#pb-fecha").textContent = horaInicio + " — " + horaFin;
      $("#pb-info").textContent = "Viaje " + (idx + 1) + "/" + pbDetalles.length + " · " + km + " km · Vel máx: " + velMax + " km/h";
      $("#pb-slider").value = idx;
    }
  }

  function detenerPlayback() {
    if (pbIntervalo) { clearInterval(pbIntervalo); pbIntervalo = null; }
    $("#pb-play").innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-play"/></svg>';
    $("#pb-play").setAttribute("aria-label", "Reproducir ruta");
  }

  function togglePlayback() {
    if (pbIntervalo) {
      detenerPlayback();
    } else {
      if (!pbDetalles.length || !pbDetalles[pbIndex]) return;
      var detalle = pbDetalles[pbIndex];
      if (!detalle.posiciones.length) {
        mostrarToast("No hay posiciones detalladas para este viaje.", "info");
        return;
      }
      if (pbIndex >= pbDetalles.length - 1) { pbIndex = 0; }
      document.getElementById("seccion-mapa").scrollIntoView({ behavior: "smooth" });
      $("#pb-play").innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-pause"/></svg>';
      $("#pb-play").setAttribute("aria-label", "Pausar ruta");
      var vel = parseInt($("#pb-velocidad").value, 10) || 3;
      var posIdx = 0;
      var posiciones = detalle.posiciones;
      if (pbMarcador) { mapa.removeLayer(pbMarcador); pbMarcador = null; }
      var icono = L.divIcon({ className: "poi-marker", html: '<span class="poi-icon" style="font-size:20px">🛞</span>', iconSize: [24, 24], iconAnchor: [12, 12] });
      pbMarcador = L.marker([posiciones[0].latitude, posiciones[0].longitude], { icon: icono }).addTo(mapa);
      mapa.setView([posiciones[0].latitude, posiciones[0].longitude], 16, { animate: true });
      pbIntervalo = setInterval(function () {
        if (posIdx >= posiciones.length - 1) {
          detenerPlayback();
          return;
        }
        posIdx++;
        var p = posiciones[posIdx];
        pbMarcador.setLatLng([p.latitude, p.longitude]);
        mapa.panTo([p.latitude, p.longitude], { animate: true, duration: 0.3 });
        var velActual = p.speed ? Math.round(p.speed * 1.852) : 0;
        var hora = p.fixTime ? horaLocal(p.fixTime) : "";
        $("#pb-fecha").textContent = hora;
        $("#pb-info").textContent = "Punto " + posIdx + "/" + posiciones.length + " · Vel: " + velActual + " km/h";
      }, 200 / vel);
    }
  }

  var reporteData = [];
  var reporteColumnas = [];

  function generarReporte() {
    var tipo = $("#reporte-tipo").value;
    var rango = $("#rep-rango").value;
    var ahora = new Date();
    var desde, hasta;
    function localIso(d) {
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, "0");
      var dia = String(d.getDate()).padStart(2, "0");
      var h = String(d.getHours()).padStart(2, "0");
      var min = String(d.getMinutes()).padStart(2, "0");
      var off = -d.getTimezoneOffset();
      var sign = off >= 0 ? "+" : "-";
      var offH = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0");
      var offM = String(Math.abs(off) % 60).padStart(2, "0");
      return y + "-" + m + "-" + dia + "T" + h + ":" + min + ":00" + sign + offH + ":" + offM;
    }
    if (rango === "custom") {
      desde = localIso(new Date($("#rep-desde").value));
      hasta = localIso(new Date($("#rep-hasta").value));
      if (!$("#rep-desde").value || !$("#rep-hasta").value) {
        mostrarToast("Seleccioná fechas personalizadas.", "error");
        return;
      }
    } else if (rango === "0") {
      var inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      desde = localIso(inicio);
      hasta = localIso(ahora);
    } else if (rango === "1") {
      var ayer = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1);
      var hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      desde = localIso(ayer);
      hasta = localIso(hoyInicio);
    } else {
      var dias = parseInt(rango) || 7;
      hasta = localIso(ahora);
      desde = localIso(new Date(ahora.getTime() - dias * 24 * 60 * 60 * 1000));
    }
    var resultado = $("#reporte-resultado");
    if (!vehiculos.length) {
      resultado.innerHTML = '<p class="note">No hay vehículos cargados.</p>';
      return;
    }
    var desdeIso = desde;
    var hastaIso = hasta;
    resultado.innerHTML = '<p class="note">Generando reporte...</p>';
    if (tipo === "eventos") {
      var ids = vehiculos.map(function (v) { return v.id; });
      var params = ids.map(function (id) { return "deviceId=" + id; }).join("&") +
        "&from=" + desdeIso + "&to=" + hastaIso;
      llamarApi("/reports/events?" + params).then(function (ev) {
        var arr = Array.isArray(ev) ? ev : [];
        arr.sort(function (a, b) {
          var da = typeof a.eventTime === "number" ? a.eventTime : new Date(String(a.eventTime || "").replace(" ", "T")).getTime();
          var db = typeof b.eventTime === "number" ? b.eventTime : new Date(String(b.eventTime || "").replace(" ", "T")).getTime();
          return (db || 0) - (da || 0);
        });
        if (!arr.length) {
          resultado.innerHTML = '<p class="note">No hay eventos en ese rango de fechas.</p>';
          return;
        }
        var tieneGeozonas = arr.some(function (e) { return e.type === "geofenceEnter" || e.type === "geofenceExit" || e.type === "geofence"; });
        var html = '<h3 style="margin:0.5rem 0;font-size:1rem;">Eventos (' + arr.length + ')</h3>';
        html += '<table class="table-report"><thead><tr><th>Fecha/Hora</th><th>Vehículo</th><th>Tipo</th>' + (tieneGeozonas ? '<th>Geozona</th>' : '') + '</tr></thead><tbody>';
        arr.forEach(function (e) {
          var nombreV = vehiculoNombre(e.deviceId);
          var nombreG = geozonaNombre(e.geofenceId);
          var tipoEtiqueta = { geofenceEnter: "Entró a geozona", geofenceExit: "Salió de geozona", geofence: "Geozona", alarm: "Alarma" }[e.type] || e.type;
          var claseTipo = e.type === "alarm" ? ' style="color:var(--danger)"' : e.type === "geofenceEnter" ? ' style="color:var(--success)"' : e.type === "geofenceExit" ? ' style="color:var(--warning)"' : "";
          html += '<tr><td>' + fechaHoraLocal(e.eventTime) + '</td><td>' + esc(nombreV) + '</td><td' + claseTipo + '>' + tipoEtiqueta + '</td>' + (tieneGeozonas ? '<td>' + esc(nombreG || "—") + '</td>' : '') + '</tr>';
        });
        html += '</tbody></table>';
        var porTipo = {};
        arr.forEach(function (e) { porTipo[e.type] = (porTipo[e.type] || 0) + 1; });
        html += '<h3 style="margin:1rem 0 0.5rem;font-size:1rem;">Resumen por tipo</h3>';
        html += '<table class="table-report"><thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead><tbody>';
        Object.keys(porTipo).forEach(function (t) {
          var label = { geofenceEnter: "Entró a geozona", geofenceExit: "Salió de geozona", geofence: "Geozona", alarm: "Alarma" }[t] || t;
          html += '<tr><td>' + label + '</td><td>' + porTipo[t] + '</td></tr>';
        });
        html += '</tbody></table>';
        resultado.innerHTML = html;
      }).catch(function (err) {
        resultado.innerHTML = '<p class="note">Error al cargar eventos: ' + esc(err.message || "desconocido") + '</p>';
      });
      return;
    }
    Promise.all(vehiculos.map(function (v) {
      return Promise.race([
        llamarApi("/positions?deviceId=" + v.id + "&from=" + desdeIso + "&to=" + hastaIso),
        new Promise(function (_, reject) { setTimeout(function () { reject(new Error("timeout")); }, 15000); })
      ]).then(function (pos) {
        var arr = Array.isArray(pos) ? pos : [];
        arr.sort(function (a, b) { return new Date(a.fixTime) - new Date(b.fixTime); });
        return { id: v.id, nombre: v.nombre, conductor: conductores[v.id] || "", consumo: v.consumo || config.consumoMedio || 7, posiciones: arr };
      }).catch(function () {
        return { id: v.id, nombre: v.nombre, conductor: conductores[v.id] || "", consumo: v.consumo || config.consumoMedio || 7, posiciones: [] };
      });
    })).then(function (datos) {
      var UMbralParada = 5;
      var umbralDistancia = 0.1;
      var umbralTiempo = 2;
      var resultados = datos.map(function (d) {
        var arr = d.posiciones;
        var trayectos = [];
        var trayectoActual = null;
        var kmTotal = 0;
        var maxVel = 0;
        var sumVel = 0;
        var conVel = 0;
        for (var i = 0; i < arr.length; i++) {
          var vel = arr[i].speed ? Math.round(arr[i].speed * 1.852) : 0;
          if (vel > maxVel) maxVel = vel;
          if (vel > 0) { sumVel += vel; conVel++; }
          if (vel > 0 && !trayectoActual) {
            trayectoActual = { inicio: arr[i].fixTime, latIni: arr[i].latitude, lonIni: arr[i].longitude, puntos: [arr[i]], km: 0, maxVel: vel, sumVel: vel, conVel: 1, paradas: 0 };
          } else if (trayectoActual) {
            trayectoActual.puntos.push(arr[i]);
            if (i > 0) {
              var dist = distanciaKm(arr[i - 1].latitude, arr[i - 1].longitude, arr[i].latitude, arr[i].longitude);
              trayectoActual.km += dist;
              kmTotal += dist;
            }
            if (vel > trayectoActual.maxVel) trayectoActual.maxVel = vel;
            if (vel > 0) { trayectoActual.sumVel += vel; trayectoActual.conVel++; }
            if (vel === 0) {
              trayectoActual.paradas++;
              var tiempoQuietos = 0;
              for (var j = i + 1; j < arr.length; j++) {
                var vj = arr[j].speed ? Math.round(arr[j].speed * 1.852) : 0;
                if (vj > 0) break;
                tiempoQuietos = (new Date(arr[j].fixTime) - new Date(arr[i].fixTime)) / 60000;
              }
              if (tiempoQuietos >= UMbralParada || i === arr.length - 1) {
                trayectoActual.fin = arr[i].fixTime;
                trayectoActual.latFin = arr[i].latitude;
                trayectoActual.lonFin = arr[i].longitude;
                trayectoActual.durMin = Math.round((new Date(trayectoActual.fin) - new Date(trayectoActual.inicio)) / 60000);
                trayectoActual.promVel = trayectoActual.conVel ? Math.round(trayectoActual.sumVel / trayectoActual.conVel) : 0;
                if (trayectoActual.km >= umbralDistancia && trayectoActual.durMin >= umbralTiempo) {
                  trayectos.push(trayectoActual);
                }
                trayectoActual = null;
              }
            }
          }
        }
        if (trayectoActual && trayectoActual.puntos.length > 1) {
          trayectoActual.fin = arr[arr.length - 1].fixTime;
          trayectoActual.latFin = arr[arr.length - 1].latitude;
          trayectoActual.lonFin = arr[arr.length - 1].longitude;
          trayectoActual.durMin = Math.round((new Date(trayectoActual.fin) - new Date(trayectoActual.inicio)) / 60000);
          trayectoActual.promVel = trayectoActual.conVel ? Math.round(trayectoActual.sumVel / trayectoActual.conVel) : 0;
          if (trayectoActual.km >= umbralDistancia && trayectoActual.durMin >= umbralTiempo) {
            trayectos.push(trayectoActual);
          }
        }
        var porDia = {};
        trayectos.forEach(function (t) {
          var dia = t.inicio.slice(0, 10);
          if (!porDia[dia]) porDia[dia] = { km: 0, trayectos: 0, durMin: 0, maxVel: 0, paradas: 0 };
          porDia[dia].km += t.km;
          porDia[dia].trayectos++;
          porDia[dia].durMin += t.durMin;
          porDia[dia].paradas += t.paradas;
          if (t.maxVel > porDia[dia].maxVel) porDia[dia].maxVel = t.maxVel;
        });
        var litros = kmTotal * (d.consumo / 100);
        return { id: d.id, nombre: d.nombre, conductor: d.conductor, kmTotal: kmTotal, maxVel: maxVel, promVel: conVel ? Math.round(sumVel / conVel) : 0, litros: litros, costo: litros * (config.precioCombustible || 0), trayectos: trayectos, porDia: porDia, primera: arr.length ? arr[0].fixTime : null, ultima: arr.length ? arr[arr.length - 1].fixTime : null };
      });
      var html = "";
      if (tipo === "resumen" || tipo === "vehiculo") {
        html += '<h3 style="margin:0.5rem 0;font-size:1rem;">Resumen total del rango</h3>';
        html += '<table class="table-report"><thead><tr><th>Vehículo</th><th>Conductor</th><th>Distancia (km)</th><th>Trayectos</th><th>Vel. máx</th><th>Vel. prom</th><th>Combustible (L)</th><th>Costo ($)</th></tr></thead><tbody>';
        var totalKm = 0, totalTrayectos = 0, totalLitros = 0, totalCosto = 0;
        resultados.forEach(function (r) {
          html += '<tr><td>' + esc(r.nombre) + '</td><td>' + esc(r.conductor) + '</td><td>' + r.kmTotal.toFixed(1) + '</td><td>' + r.trayectos.length + '</td><td>' + r.maxVel + ' km/h</td><td>' + r.promVel + ' km/h</td><td>' + r.litros.toFixed(1) + '</td><td>$' + Math.round(r.costo).toLocaleString("es-CO") + '</td></tr>';
          totalKm += r.kmTotal; totalTrayectos += r.trayectos.length; totalLitros += r.litros; totalCosto += r.costo;
        });
        html += '<tr style="font-weight:bold;background:var(--primary-light)"><td>TOTAL</td><td>—</td><td>' + totalKm.toFixed(1) + '</td><td>' + totalTrayectos + '</td><td>—</td><td>—</td><td>' + totalLitros.toFixed(1) + '</td><td>$' + Math.round(totalCosto).toLocaleString("es-CO") + '</td></tr>';
        html += '</tbody></table>';
        html += '<h3 style="margin:1rem 0 0.5rem;font-size:1rem;">Desglose por día</h3>';
        var diasTotales = {};
        resultados.forEach(function (r) {
          Object.keys(r.porDia).forEach(function (dia) {
            if (!diasTotales[dia]) diasTotales[dia] = { km: 0, trayectos: 0, durMin: 0, maxVel: 0, paradas: 0 };
            var dd = r.porDia[dia];
            diasTotales[dia].km += dd.km;
            diasTotales[dia].trayectos += dd.trayectos;
            diasTotales[dia].durMin += dd.durMin;
            diasTotales[dia].paradas += dd.paradas;
            if (dd.maxVel > diasTotales[dia].maxVel) diasTotales[dia].maxVel = dd.maxVel;
          });
        });
        html += '<table class="table-report"><thead><tr><th>Día</th><th>Distancia (km)</th><th>Trayectos</th><th>Tiempo (min)</th><th>Vel. máx</th><th>Paradas</th></tr></thead><tbody>';
        Object.keys(diasTotales).sort().forEach(function (dia) {
          var dd = diasTotales[dia];
          html += '<tr><td>' + dia + '</td><td>' + dd.km.toFixed(1) + '</td><td>' + dd.trayectos + '</td><td>' + dd.durMin + '</td><td>' + dd.maxVel + ' km/h</td><td>' + dd.paradas + '</td></tr>';
        });
        html += '</tbody></table>';
      }
      if (tipo === "resumen" || tipo === "trayectos") {
        html += '<h3 style="margin:1rem 0 0.5rem;font-size:1rem;">Detalle de trayectos</h3>';
        resultados.forEach(function (r) {
          if (!r.trayectos.length) return;
          html += '<p style="margin:0.5rem 0 0.25rem;font-weight:600;">' + esc(r.nombre) + ' (' + esc(r.conductor) + ')</p>';
          html += '<table class="table-report"><thead><tr><th>#</th><th>Inicio</th><th>Fin</th><th>Duración</th><th>Distancia</th><th>Vel. máx</th><th>Vel. prom</th><th>Paradas</th></tr></thead><tbody>';
          r.trayectos.forEach(function (t, idx) {
            html += '<tr><td>' + (idx + 1) + '</td><td>' + fechaHoraLocal(t.inicio) + '</td><td>' + fechaHoraLocal(t.fin) + '</td><td>' + t.durMin + ' min</td><td>' + t.km.toFixed(1) + ' km</td><td>' + t.maxVel + ' km/h</td><td>' + t.promVel + ' km/h</td><td>' + t.paradas + '</td></tr>';
          });
          html += '</tbody></table>';
        });
      }
      if (tipo === "velocidad") {
        html += '<table class="table-report"><thead><tr><th>Vehículo</th><th>Vel. máx</th><th>Vel. prom</th><th>Trayectos >80km/h</th></tr></thead><tbody>';
        resultados.filter(function (r) { return r.maxVel > 80; }).forEach(function (r) {
          html += '<tr><td>' + esc(r.nombre) + '</td><td>' + r.maxVel + ' km/h</td><td>' + r.promVel + ' km/h</td><td>' + r.trayectos.filter(function (t) { return t.maxVel > 80; }).length + '</td></tr>';
        });
        html += '</tbody></table>';
        if (!resultados.some(function (r) { return r.maxVel > 80; })) { html += '<p class="note">Ningún vehículo excedió 80 km/h.</p>'; }
      }
      if (tipo === "paradas") {
        html += '<table class="table-report"><thead><tr><th>Vehículo</th><th>Inicio</th><th>Fin</th><th>Duración</th><th>Lat</th><th>Lon</th></tr></thead><tbody>';
        var conParadas = false;
        resultados.forEach(function (r) {
          r.trayectos.forEach(function (t) {
            if (t.paradas > 0) {
              conParadas = true;
              html += '<tr><td>' + esc(r.nombre) + '</td><td>' + horaLocal(t.inicio) + '</td><td>' + horaLocal(t.fin) + '</td><td>' + t.durMin + ' min</td><td>' + t.latIni.toFixed(5) + '</td><td>' + t.lonIni.toFixed(5) + '</td></tr>';
            }
          });
        });
        html += '</tbody></table>';
        if (!conParadas) html += '<p class="note">No se detectaron paradas significativas.</p>';
      }
      resultado.innerHTML = html || '<p class="note">No hay datos para mostrar.</p>';
    });
  }

  function exportarCSV() {
    var contenedor = document.querySelector("#reporte-resultado");
    if (!contenedor || !contenedor.querySelector("table")) { mostrarToast("Primero generá un reporte.", "error"); return; }
    var tablas = contenedor.querySelectorAll("table");
    var csv = "";
    tablas.forEach(function (tabla, idx) {
      var titulo = tabla.previousElementSibling;
      if (titulo && titulo.tagName.match(/^H[2-6]$/)) {
        csv += "\n" + titulo.textContent + "\n";
      } else if (idx > 0) {
        csv += "\n\n";
      }
      var filas = tabla.querySelectorAll("tr");
      filas.forEach(function (fila) {
        var celdas = fila.querySelectorAll("th, td");
        var cols = [];
        celdas.forEach(function (c) { cols.push('"' + c.textContent.replace(/"/g, '""') + '"'); });
        csv += cols.join(";") + "\n";
      });
    });
    var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reporte_flota_" + new Date().toISOString().slice(0, 10) + ".csv";
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast("CSV exportado.", "success");
  }

  function exportarPDF() {
    var contenido = document.querySelector("#reporte-resultado");
    if (!contenido || !contenido.querySelector("table")) { mostrarToast("Primero generá un reporte.", "error"); return; }
    var w = window.open("", "_blank");
    if (!w) { mostrarToast("El navegador bloqueó la ventana emergente. Permití popups para este sitio.", "error"); return; }
    w.document.write("<html><head><title>Reporte Flota</title>");
    w.document.write("<style>body{font-family:Arial,sans-serif;padding:2rem;font-size:12px;}");
    w.document.write("table{width:100%;border-collapse:collapse;margin-bottom:1rem;}");
    w.document.write("th,td{padding:5px 8px;border:1px solid #ccc;text-align:left;}");
    w.document.write("th{background:#f0f0f0;font-weight:bold;}");
    w.document.write("h1{font-size:16px;} h3{font-size:13px;margin:1rem 0 0.5rem;}");
    w.document.write("</style></head><body>");
    w.document.write("<h1>Reporte de Flota</h1>");
    w.document.write("<p>Fecha: " + new Date().toLocaleDateString("es") + " " + new Date().toLocaleTimeString("es") + "</p>");
    w.document.write(contenido.innerHTML);
    w.document.write("<p style='margin-top:1rem;color:#888;font-size:10px;'>Generado por Gestor de Flota</p>");
    w.document.write("</body></html>");
    w.document.close();
    w.print();
  }

  function enriquecer(d, p, distancia) {
    var estado = estadoVehiculo(d, p);
    var velocidad = p && p.speed ? Math.round(p.speed * 1.852) : 0;
    if (velocidad > 0) registrarVelocidad(d.id, velocidad);
    var encendido = p && p.attributes ? String(p.attributes.ignition) === "true" : null;
    var sos = p && p.attributes && p.attributes.alarm ? String(p.attributes.alarm) : "";
    var km = typeof distancia === "number" ? distancia / 1000 : null;
    var consumo = consumoVehiculo(d.id);
    var litros = km === null ? null : km * (consumo / 100);
    var precio = parseFloat(config.precioCombustible) || 0;
    return {
      id: d.id,
      nombre: d.name || ("Vehículo " + d.id),
      uniqueId: d.uniqueId || "",
      estado: estado,
      velocidad: velocidad,
      encendido: encendido,
      sos: sos,
      consumo: consumo,
      litros: litros,
      costo: litros === null ? null : litros * precio,
      lat: p ? p.latitude : null,
      lon: p ? p.longitude : null,
      curso: p && p.course ? Math.round(p.course % 360) % 360 : null,
      direccion: p ? p.address : null,
      hora: p ? p.fixTime : d.lastUpdate,
      distancia: typeof distancia === "number" ? distancia : null,
      tienePosicion: !!p
    };
  }

  function estadoVehiculo(d, p) {
    var LAPSO = 15 * 60 * 1000;
    var edades = [];
    if (d.lastUpdate) {
      edades.push(Date.now() - new Date(d.lastUpdate).getTime());
    }
    if (p) {
      edades.push(Date.now() - new Date(p.fixTime).getTime());
      if (p.serverTime) edades.push(Date.now() - new Date(p.serverTime).getTime());
    }
    if (!edades.length) return { tipo: "nodata", etiqueta: "Sin datos" };
    var edad = Math.min.apply(null, edades);
    if (!p) {
      return {
        tipo: "nodata",
        etiqueta: edad > LAPSO ? "Sin señal" : "Sin datos"
      };
    }
    if (edad > LAPSO) return { tipo: "offline", etiqueta: "Sin señal" };
    var kmh = Math.round((p.speed || 0) * 1.852);
    if (kmh > 1) return { tipo: "moving", etiqueta: "En movimiento" };
    return { tipo: "stopped", etiqueta: "Detenido" };
  }

  function mostrarResultados() {
    pintarEstadisticas();
    pintarVehiculos();
    pintarMapa();
    renderGeozonas();
    dibujarGeozonas();
    dibujarPois();
    renderPois();
    renderHospitales();
    if (coberturaVisible) {
      dibujarHospitales();
      dibujarCobertura();
    }
    ajustarVista();
    renderAlarmas();
    actualizarTiempoQuieto();
    rellenarSelectoresConductores();
    rellenarSelectorHistorial();
    var d = new Date();
    $("#ultima-actualizacion").textContent = "Actualizado: " + d.toLocaleTimeString("es");
    estadoConexion("ok", "Conectado a " + hostCorto());
    guardarVelocidades();
  }

  function pintarEstadisticas() {
    var total = vehiculos.length;
    var lineas = vehiculos.filter(function (v) { return v.estado.tipo === "moving" || v.estado.tipo === "stopped"; }).length;
    var movimiento = vehiculos.filter(function (v) { return v.estado.tipo === "moving"; }).length;
    var detenidos = vehiculos.filter(function (v) { return v.estado.tipo === "stopped"; }).length;
    var fuera = vehiculos.filter(function (v) { return v.estado.tipo === "offline" || v.estado.tipo === "nodata"; }).length;
    var km = 0;
    var conDist = 0;
    var litrosTotal = 0;
    var costoTotal = 0;
    var conLitros = 0;
    vehiculos.forEach(function (v) {
      if (v.distancia !== null) { km += v.distancia; conDist++; }
      if (v.litros !== null) { litrosTotal += v.litros; conLitros++; }
      if (v.costo !== null) costoTotal += v.costo;
    });
    $("#stat-total").textContent = total;
    $("#stat-total-trend").textContent = "ID: " + vehiculos.map(function (v) { return v.id; }).join(", ") || "–";
    $("#stat-online").textContent = lineas;
    $("#stat-online-trend").textContent = movimiento + " en movimiento · " + detenidos + " detenidos";
    $("#stat-moving").textContent = movimiento;
    $("#stat-moving-trend").textContent = fuera ? fuera + " sin señal" : "toda la flota reportando";
    $("#stat-distance").textContent = conDist ? (km / 1000).toLocaleString("es", { maximumFractionDigits: 1 }) + " km" : "–";
    $("#stat-distance-trend").textContent = conDist ? "suma de vehículos con dato" : "se requiere el reporte diario";
    $("#stat-fuel").textContent = conLitros ? litrosTotal.toLocaleString("es", { maximumFractionDigits: 1 }) + " L" : "–";
    $("#stat-fuel-trend").textContent = conLitros
      ? (config.precioCombustible ? "$ " + Math.round(costoTotal).toLocaleString("es-CO") + " COP" : "sin precio configurado")
      : "se requiere distancia y consumo";
  }

  function filtrarVehiculos() {
    return vehiculos.filter(function (v) {
      if (filtroActual.buscar) {
        var busqueda = filtroActual.buscar.toLowerCase();
        if (v.nombre.toLowerCase().indexOf(busqueda) === -1 && String(v.id).indexOf(busqueda) === -1 && v.uniqueId.toLowerCase().indexOf(busqueda) === -1) return false;
      }
      if (filtroActual.estado && v.estado.tipo !== filtroActual.estado) return false;
      if (filtroActual.conductor) {
        var conductorV = conductores[v.id] || "";
        if (conductorV !== filtroActual.conductor) return false;
      }
      return true;
    });
  }

  function pintarVehiculos() {
    var visibles = filtrarVehiculos();
    if (!vehiculos.length) {
      lista.innerHTML = '<div class="vacio"><p><strong>No se encontraron vehículos.</strong></p><p class="note" style="margin-top:0.25rem;">Revisa los IDs configurados o crea dispositivos en Traccar. Sin IDs se toman todos los dispositivos de tu cuenta.</p></div>';
      return;
    }
    if (!visibles.length) {
      lista.innerHTML = '<div class="vacio"><p><strong>No hay vehículos con esos filtros.</strong></p></div>';
      return;
    }
    lista.innerHTML = visibles.map(tarjeta).join("");
  }

  function tarjeta(v) {
    var clasesBadge = { moving: "success", stopped: "info", offline: "warning", nodata: "neutral" };
    var enc = v.encendido === null ? "—" : (v.encendido ? "Sí" : "No");
    var dist = v.distancia === null ? "—" : (v.distancia / 1000).toLocaleString("es", { maximumFractionDigits: 1 }) + " km";
    var combust = v.litros === null
      ? "—"
      : v.litros.toLocaleString("es", { maximumFractionDigits: 1 }) + " L" + (v.costo === null ? "" : " · $ " + Math.round(v.costo).toLocaleString("es-CO"));
    var coords = v.tienePosicion ? v.lat.toFixed(5) + ", " + v.lon.toFixed(5) : "—";
    var direccion = v.direccion || (v.tienePosicion ? "Sin dirección registrada" : "Sin posición");
    var hora = v.hora ? desdeHace(v.hora) + " · " + horaLocal(v.hora) : "—";
    var curso = v.curso !== null ? v.curso + "°" : "—";
    var mapLink = v.tienePosicion ? '<button class="text-link" type="button" data-ver-mapa="' + v.id + '">Ver en mapa</button>' : '<span>Sin coordenadas</span>';
    var sosBadge = v.sos ? '<span class="badge badge--danger badge--sos">SOS ACTIVO</span>' : "";
    var estadoBadge = v.estado.tipo === "offline" ? "" : '<span class="badge badge--' + clasesBadge[v.estado.tipo] + ' badge--estado">' + v.estado.etiqueta + '</span>';
    var conductor = conductores[v.id] || "";
    var conductorHtml = conductor ? '<span class="badge badge--info">' + esc(conductor) + '</span>' : "";
    var velocidadBadge = "";
    var limite = parseFloat(config.limiteVelocidad) || 80;
    if (v.velocidad > limite) {
      velocidadBadge = '<span class="badge badge--danger badge--sos">EXCESO ' + v.velocidad + ' km/h</span>';
    }
    var stats = estadisticasVelocidad(v.id);
    var velStatsHtml = '<div class="vehicle__stat-speed"><span class="vehicle__stat-label">Máx / Promedio</span><span class="vehicle__stat-value">' + stats.max + ' / ' + stats.promedio + ' km/h</span></div>';
    var tiempoQuietoStr = tiempoQuietoHtml(v.id);
    var referencias = v.tienePosicion ? buscarReferenciasCercanas(v.lat, v.lon, 7) : [];
    var refsHtml = "";
    if (referencias.length) {
      refsHtml = '<div class="vehicle__refs"><span class="vehicle__refs-title">📍 Cerca de:</span>';
      for (var ri = 0; ri < referencias.length && ri < 2; ri++) {
        var iconoRef = referencias[ri].tipo === "hospital" ? "🏥" : "📌";
        var nombre = referencias[ri].nombre;
        if (nombre.length > 25) nombre = nombre.substring(0, 25) + "...";
        refsHtml += '<span class="vehicle__ref">' + iconoRef + ' <span class="vehicle__ref-name">' + esc(nombre) + '</span> <span class="vehicle__ref-dist">(' + referencias[ri].distancia.toFixed(1) + ' km)</span></span>';
      }
      refsHtml += '</div>';
    }
    return '<article class="card vehicle vehicle--' + v.estado.tipo + '">' +
      '<header class="vehicle__head">' +
        '<div><h3 class="vehicle__name">' + esc(v.nombre) + '</h3></div>' +
          '<span class="cluster">' +
          estadoBadge + sosBadge + velocidadBadge +
        '</span>' +
      '</header>' +
      refsHtml +
      '<div class="vehicle__compact-stats">' +
        '<div><span class="vehicle__stat-label">Velocidad</span><span class="vehicle__stat-value">' + v.velocidad + ' km/h</span></div>' +
        '<div><span class="vehicle__stat-label">Conductor</span><span class="vehicle__stat-value">' + esc(conductor || "Sin asignar") + '</span></div>' +
      '</div>' +
      '<div class="vehicle__actions"><button class="button button--outlined" type="button" data-abrir-modal-vehiculo="' + v.id + '"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg> Ver detalles</button>' + (v.tienePosicion ? mapLink : '') + '</div>' +
    '</article>';
  }

  function pintarMapa() {
    if (typeof L === "undefined") {
      if (!mapa && !$("#mapa").dataset.aviso) {
        $("#mapa").dataset.aviso = "1";
        $("#mapa").innerHTML = '<div class="mapa-offline">No se pudo cargar Leaflet. Verifica la conexión a internet para ver el mapa.</div>';
      }
      return;
    }
    if (!mapa) inicializarMapa();
    var visibles = {};
    vehiculos.forEach(function (v) {
      if (!v.tienePosicion) return;
      visibles[v.id] = true;
      var color = colorEstado(v.estado.tipo);
      if (!marcadores[v.id]) {
        var iconoVehiculo = L.divIcon({
          className: "poi-marker",
          html: '<span class="poi-icon" style="font-size:20px">🛞</span>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        marcadores[v.id] = L.marker([v.lat, v.lon], { icon: iconoVehiculo });
        marcadores[v.id].bindPopup(tituloPopup(v));
        marcadores[v.id].addTo(mapa);
      } else {
        marcadores[v.id].setLatLng([v.lat, v.lon]);
        marcadores[v.id].getPopup().setContent(tituloPopup(v));
      }
    });
    Object.keys(marcadores).forEach(function (id) {
      if (!visibles[id]) {
        mapa.removeLayer(marcadores[id]);
        delete marcadores[id];
      }
    });
  }

  var mapaClaro = null;
  var mapaOscuro = false;
  var mapaActual = "claro";

  function inicializarMapa() {
    mapa = L.map("mapa").setView([4.6990, -74.0830], 12);
    mapaClaro = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(mapa);
    var guardado = localStorage.getItem(CLAVE_MAPA_OSCURO);
    if (guardado === "true") {
      document.getElementById("mapa").classList.add("mapa-dark");
      mapaOscuro = true;
    }
  }

  function alternarMapaOscuro(activo) {
    if (!mapa) return;
    var mapaEl = document.getElementById("mapa");
    if (activo) {
      mapaEl.classList.add("mapa-dark");
    } else {
      mapaEl.classList.remove("mapa-dark");
    }
    mapaOscuro = activo;
    localStorage.setItem(CLAVE_MAPA_OSCURO, activo);
  }

  function colorEstado(tipo) {
    return { moving: "#16a34a", stopped: "#2563eb", offline: "#d97706", nodata: "#94a3b8" }[tipo] || "#94a3b8";
  }

  function tituloPopup(v) {
    return "<strong>" + esc(v.nombre) + "</strong><br>" + v.estado.etiqueta + " · " + v.velocidad + " km/h" +
      (v.direccion ? "<br>" + esc(v.direccion) : "");
  }

  function verEnMapa(id) {
    var v = buscarVehiculo(id);
    if (!v || !v.tienePosicion || typeof L === "undefined") return;
    document.getElementById("seccion-mapa").scrollIntoView({ behavior: "smooth" });
    if (!mapa) inicializarMapa();
    mapa.setView([v.lat, v.lon], 16);
  }

  function ajustarVista() {
    if (typeof L === "undefined" || !mapa) return;
    var clave = Object.keys(marcadores).sort().join(",") + "|" + Object.keys(geozonaLayers).sort().join(",") + "|" + Object.keys(hospitalesLayers).sort().join(",");
    if (clave === ultimaVista) return;
    ultimaVista = clave;
    var capas = [];
    Object.keys(marcadores).forEach(function (id) { capas.push(marcadores[id]); });
    Object.keys(geozonaLayers).forEach(function (id) { capas.push(geozonaLayers[id]); });
    Object.keys(hospitalesLayers).forEach(function (id) { capas.push(hospitalesLayers[id]); });
    Object.keys(coberturaLayers).forEach(function (id) { capas.push(coberturaLayers[id]); });
    if (!capas.length) return;
    if (capas.length === 1) {
      var unica = capas[0];
      mapa.setView(unica.getLatLng ? unica.getLatLng() : unica.getBounds().getCenter(), 14);
    } else {
      mapa.fitBounds(L.featureGroup(capas).getBounds().pad(0.15));
    }
  }

  function verGeozonaEnMapa(id) {
    var g = buscarGeozona(id);
    if (!g || !g._area || typeof L === "undefined") return;
    document.getElementById("seccion-mapa").scrollIntoView({ behavior: "smooth" });
    if (!mapa) inicializarMapa();
    if (!geozonaLayers[id]) dibujarGeozonas();
    var capa = geozonaLayers[id];
    if (capa) {
      ultimaVista = "" + parseInt(Date.now() / 1000, 10);
      mapa.fitBounds(capa.getBounds().pad(0.25));
    }
  }

  var listaConductores = cargarListaConductores();

  function rellenarSelectoresConductores() {
    document.querySelectorAll(".conductor-select").forEach(function (sel) {
      var id = parseInt(sel.getAttribute("data-conductor"), 10);
      var actual = conductores[id] || "";
      sel.innerHTML = '<option value="">Sin asignar</option>' +
        listaConductores.map(function (c) {
          return '<option value="' + esc(c) + '"' + (c === actual ? ' selected' : '') + '>' + esc(c) + '</option>';
        }).join("");
    });
    var filtroConductor = $("#filtro-conductor");
    if (filtroConductor) {
      var valActual = filtroConductor.value;
      filtroConductor.innerHTML = '<option value="">Todos los conductores</option>' +
        listaConductores.map(function (c) {
          return '<option value="' + esc(c) + '"' + (c === valActual ? ' selected' : '') + '>' + esc(c) + '</option>';
        }).join("");
    }
  }

  function buscarVehiculo(id) {
    for (var i = 0; i < vehiculos.length; i++) if (vehiculos[i].id === id) return vehiculos[i];
    return null;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function isoAhora() {
    return new Date().toISOString();
  }

  function isoInicioHoy() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }

  function inicioDeHoy() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function desdeHace(iso) {
    var dif = Date.now() - new Date(iso).getTime();
    if (dif < 0) return "hace un momento";
    var s = Math.floor(dif / 1000);
    if (s < 60) return "hace " + s + " s";
    var m = Math.floor(s / 60);
    if (m < 60) return "hace " + m + " min";
    var h = Math.floor(m / 60);
    if (h < 24) return "hace " + h + " h";
    return "hace " + Math.floor(h / 24) + " d";
  }

  function horaLocal(iso) {
    if (!iso && iso !== 0) return "—";
    var d = typeof iso === "number" ? new Date(iso) : new Date(String(iso).replace(" ", "T"));
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  }

  function fechaHoraLocal(iso) {
    if (!iso && iso !== 0) return "—";
    var d = typeof iso === "number" ? new Date(iso) : new Date(String(iso).replace(" ", "T"));
    if (isNaN(d.getTime())) return "—";
    var fecha = d.toLocaleDateString("es", { day: "2-digit", month: "2-digit", year: "2-digit" });
    var hora = d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    return fecha + ' ' + hora;
  }

  function distanciaKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function buscarReferenciasCercanas(lat, lon, radioKm) {
    var referencias = [];
    var i, d, item;
    for (i = 0; i < hospitales.length; i++) {
      item = hospitales[i];
      d = distanciaKm(lat, lon, item.lat, item.lon);
      if (d <= radioKm) {
        referencias.push({ tipo: "hospital", nombre: item.nombre, distancia: d });
      }
    }
    for (i = 0; i < pois.length; i++) {
      item = pois[i];
      d = distanciaKm(lat, lon, item.lat, item.lon);
      if (d <= radioKm) {
        referencias.push({ tipo: "poi", nombre: item.nombre, distancia: d });
      }
    }
    referencias.sort(function (a, b) { return a.distancia - b.distancia; });
    return referencias;
  }

  function referenciasHtml(lat, lon) {
    var refs = buscarReferenciasCercanas(lat, lon, 7);
    if (!refs.length) return "";
    var html = '<div class="vehicle__refs"><span class="vehicle__refs-title">📍 Cerca de:</span>';
    for (var i = 0; i < refs.length && i < 2; i++) {
      var icono = refs[i].tipo === "hospital" ? "🏥" : "📌";
      html += '<span class="vehicle__ref">' + icono + ' ' + esc(refs[i].nombre) + ' (' + refs[i].distancia.toFixed(1) + ' km)</span>';
    }
    html += '</div>';
    return html;
  }

  function hostCorto() {
    try { return new URL(config.baseUrl).host; } catch (e) { return config.baseUrl; }
  }

  function estadoConexion(tipo, texto) {
    elConexion.className = "conexion conexion--" + tipo;
    elConexionTexto.textContent = texto;
  }

  function mostrarToast(msg, tipo) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    toastEl.className = "toast" + (tipo ? " toast--" + tipo : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4500);
  }

  function setAlerta(tipo, titulo, texto, botonTexto, onBoton) {
    alertaInicial.className = "alert alert--" + tipo;
    alertaInicial.hidden = false;
    $("#alerta-inicial-titulo").textContent = titulo;
    $("#alerta-inicial-texto").textContent = texto;
    var btn = $("#btn-alerta");
    btn.textContent = botonTexto;
    btn.onclick = onBoton;
  }

  function abrirModal() {
    rellenarModal();
    modal.hidden = false;
    $("#cfg-base").focus();
  }

  function cerrarModal() {
    modal.hidden = true;
    $("#resultado-prueba").innerHTML = "";
  }

  function abrirModalVehiculo(id) {
    var v = vehiculos.find(function (veh) { return veh.id === id; });
    if (!v) return;
    var modalV = $("#modal-vehiculo");
    var body = $("#modal-vehiculo-body");
    var conductor = conductores[v.id] || "";
    var coords = v.tienePosicion ? v.lat.toFixed(5) + ", " + v.lon.toFixed(5) : "—";
    var direccion = v.direccion || (v.tienePosicion ? "Sin dirección registrada" : "Sin posición");
    var hora = v.hora ? desdeHace(v.hora) + " · " + horaLocal(v.hora) : "—";
    var curso = v.curso !== null ? v.curso + "°" : "—";
    var enc = v.encendido ? "Sí" : "No";
    var dist = v.distancia !== null ? (v.distancia / 1000).toFixed(1) + " km" : "—";
    var combust = v.litros === null
      ? "—"
      : v.litros.toLocaleString("es", { maximumFractionDigits: 1 }) + " L" + (v.costo === null ? "" : " · $ " + Math.round(v.costo).toLocaleString("es-CO"));
    var stats = estadisticasVelocidad(v.id);
    var tiempoQuietoStr = tiempoQuietoHtml(v.id);
    var referencias = v.tienePosicion ? buscarReferenciasCercanas(v.lat, v.lon, 7) : [];
    var refsHtml = referencias.length ? '<div class="vehicle__refs"><span class="vehicle__refs-title">Referencias cercanas:</span>' +
      referencias.map(function (r) { return '<span class="vehicle__ref">' + esc(r.nombre) + ' (' + r.distancia.toFixed(1) + ' km)</span>'; }).join("") + '</div>' : "";

    $("#modal-vehiculo-titulo").textContent = esc(v.nombre);
    body.innerHTML =
      '<div class="vehiculo-modal-grid">' +
        '<div class="vehiculo-modal-stat"><span class="vehicle__stat-label">Velocidad</span><span class="vehicle__stat-value">' + v.velocidad + ' km/h</span></div>' +
        '<div class="vehiculo-modal-stat"><span class="vehicle__stat-label">Rumbo</span><span class="vehicle__stat-value">' + curso + '</span></div>' +
        '<div class="vehiculo-modal-stat"><span class="vehicle__stat-label">Encendido</span><span class="vehicle__stat-value">' + enc + '</span></div>' +
        '<div class="vehiculo-modal-stat"><span class="vehicle__stat-label">Dist. hoy</span><span class="vehicle__stat-value">' + dist + '</span></div>' +
        '<div class="vehiculo-modal-stat"><span class="vehicle__stat-label">Combustible</span><span class="vehicle__stat-value">' + combust + '</span></div>' +
        '<div class="vehiculo-modal-stat"><span class="vehicle__stat-label">Vel. máx / prom</span><span class="vehicle__stat-value">' + stats.max + ' / ' + stats.promedio + ' km/h</span></div>' +
      '</div>' +
      '<dl class="vehicle__meta" style="margin-top:1rem;">' +
        '<div><dt>Conductor</dt><dd>' + esc(conductor || "Sin asignar") + '</dd></div>' +
        '<div><dt>Tiempo quieto</dt><dd>' + tiempoQuietoStr + '</dd></div>' +
        '<div><dt>Coordenadas</dt><dd>' + coords + '</dd></div>' +
        '<div><dt>Dirección</dt><dd>' + esc(direccion) + '</dd></div>' +
        '<div><dt>Última señal</dt><dd>' + hora + '</dd></div>' +
      '</dl>' +
      refsHtml;
    modalV.hidden = false;
  }

  function cerrarModalVehiculo() {
    $("#modal-vehiculo").hidden = true;
  }

  function rellenarModal() {
    $("#cfg-base").value = config.baseUrl;
    $("#cfg-metodo").value = config.authType;
    $("#cfg-token").value = config.token;
    $("#cfg-user").value = config.user;
    $("#cfg-pass").value = config.password;
    $("#cfg-ids").value = config.deviceIds.join(", ");
    $("#cfg-refresh").value = config.refreshSec || 15;
    $("#cfg-consumo").value = config.consumoMedio || 7;
    $("#cfg-precio").value = config.precioCombustible || 0;
    $("#cfg-velocidad").value = config.limiteVelocidad || 80;
    actualizarCamposAuth();
  }

  function actualizarCamposAuth() {
    var esToken = $("#cfg-metodo").value === "token";
    $("#campo-token").hidden = !esToken;
    $("#campo-basico").hidden = esToken;
  }

  function leerFormulario() {
    var cfg = {
      baseUrl: $("#cfg-base").value.trim(),
      authType: $("#cfg-metodo").value,
      token: $("#cfg-token").value.trim(),
      user: $("#cfg-user").value.trim(),
      password: $("#cfg-pass").value,
      deviceIds: [],
      refreshSec: Math.max(5, parseInt($("#cfg-refresh").value, 10) || 15),
      consumoMedio: Math.max(0.5, parseFloat($("#cfg-consumo").value) || 7),
      precioCombustible: Math.max(0, parseFloat($("#cfg-precio").value) || 0),
      limiteVelocidad: Math.max(20, parseInt($("#cfg-velocidad").value, 10) || 80)
    };
    $("#cfg-ids").value.split(",").forEach(function (s) {
      var n = parseInt(s.trim(), 10);
      if (!isNaN(n)) cfg.deviceIds.push(n);
    });
    return cfg;
  }

  function guardarConfiguracion(e) {
    e.preventDefault();
    var cfg = leerFormulario();
    if (!cfg.baseUrl) {
      mostrarToast("Escribe la URL del servidor Traccar o del proxy.", "error");
      return;
    }
    config = cfg;
    guardarConfig(config);
    vehiculos = [];
    $("#btn-refrescar").disabled = false;
    alertaInicial.hidden = true;
    cerrarModal();
    iniciarConexion();
  }

  function probarConexion() {
    var resultado = $("#resultado-prueba");
    var cfg = leerFormulario();
    if (!cfg.baseUrl) {
      resultado.innerHTML = '<div class="alert alert--error"><div><strong>Falta la URL</strong><p class="note">Escribe la dirección del servidor antes de probar.</p></div></div>';
      return;
    }
    resultado.innerHTML = '<div class="alert alert--warning"><div><strong>Probando…</strong><p class="note">Consultando /api/devices en ' + esc(cfg.baseUrl) + '.</p></div></div>';
    llamarApi("/devices", cfg)
      .then(function (dispositivos) {
        var n = dispositivos.length;
        resultado.innerHTML = '<div class="alert alert--success"><div><strong>Conexión correcta (' + n + ' dispositivos)</strong><p class="note">' +
          (n ? "Se mostrarán los vehículos de tu cuenta en el panel." : "No hay dispositivos en tu cuenta. Crea algunos en Traccar.") +
          '</p></div></div>';
      })
      .catch(function (err) {
        var msg = err && err.message ? err.message : "Error de conexión.";
        if (err instanceof TypeError) {
          msg = "Fallo de red/CORS. Si apuntas directo a Traccar nativo, usa el proxy (http://localhost:3000).";
        }
        resultado.innerHTML = '<div class="alert alert--error"><div><strong>Conexión fallida</strong><p class="note">' + esc(msg) + '</p></div></div>';
      });
  }

  function iniciarConexion() {
    detenerAutoRefresco();
    refrescar();
    temporizador = setInterval(refrescar, config.refreshSec * 1000);
  }

  function detenerAutoRefresco() {
    if (temporizador) {
      clearInterval(temporizador);
      temporizador = null;
    }
  }

  var modalConductores = $("#modal-conductores");

  function abrirModalConductores() {
    renderListaConductores();
    modalConductores.hidden = false;
  }

  function cerrarModalConductores() {
    modalConductores.hidden = true;
  }

  function renderListaConductores() {
    var contenedor = $("#lista-conductores-admin");
    if (!listaConductores.length) {
      contenedor.innerHTML = '<div class="vacio"><p><strong>No hay conductores registrados.</strong></p><p class="note">Agregá un conductor con el botón de abajo.</p></div>';
      return;
    }
    contenedor.innerHTML = listaConductores.map(function (c, i) {
      return '<div class="conductor-item">' +
        '<span class="conductor-item__nombre">' + esc(c) + '</span>' +
        '<span class="cluster">' +
          '<button class="text-link" type="button" data-editar-conductor="' + i + '">Editar</button>' +
          '<button class="text-link text-link--danger" type="button" data-borrar-conductor="' + i + '">Eliminar</button>' +
        '</span>' +
      '</div>';
    }).join("");
  }

  function agregarConductor() {
    var nombre = prompt("Nombre del nuevo conductor:");
    if (!nombre || !nombre.trim()) return;
    nombre = nombre.trim();
    if (listaConductores.indexOf(nombre) !== -1) {
      mostrarToast("Ese conductor ya existe.", "error");
      return;
    }
    listaConductores.push(nombre);
    guardarListaConductores();
    renderListaConductores();
    mostrarToast("Conductor " + nombre + " agregado.", "success");
  }

  function editarConductor(index) {
    var actual = listaConductores[index];
    var nuevo = prompt("Editar nombre:", actual);
    if (!nuevo || !nuevo.trim() || nuevo.trim() === actual) return;
    nuevo = nuevo.trim();
    if (listaConductores.indexOf(nuevo) !== -1) {
      mostrarToast("Ya existe un conductor con ese nombre.", "error");
      return;
    }
    listaConductores[index] = nuevo;
    Object.keys(conductores).forEach(function (id) {
      if (conductores[id] === actual) conductores[id] = nuevo;
    });
    guardarListaConductores();
    guardarConductores();
    renderListaConductores();
    mostrarToast("Conductor actualizado.", "success");
  }

  function borrarConductor(index) {
    var nombre = listaConductores[index];
    if (!confirm("¿Eliminar al conductor '" + nombre + "'?")) return;
    listaConductores.splice(index, 1);
    Object.keys(conductores).forEach(function (id) {
      if (conductores[id] === nombre) delete conductores[id];
    });
    guardarListaConductores();
    guardarConductores();
    renderListaConductores();
    mostrarToast("Conductor eliminado.", "success");
  }

  function guardarListaConductores() {
    try {
      localStorage.setItem("flota_lista_conductores", JSON.stringify(listaConductores));
    } catch (e) {}
  }

  function cargarListaConductores() {
    try {
      var guardado = localStorage.getItem("flota_lista_conductores");
      if (guardado) return JSON.parse(guardado);
    } catch (e) {}
    return ["Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Pedro Sánchez"];
  }

  listaConductores = cargarListaConductores();

  function iniciar() {
    aplicarHospitalesCustom();
    lista.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ver-mapa]");
      if (b) verEnMapa(parseInt(b.getAttribute("data-ver-mapa"), 10));
      var btnModal = e.target.closest("[data-abrir-modal-vehiculo]");
      if (btnModal) abrirModalVehiculo(parseInt(btnModal.getAttribute("data-abrir-modal-vehiculo"), 10));
    });
    lista.addEventListener("change", function (e) {
      var c = e.target.closest("[data-consumo]");
      if (!c) return;
      var id = parseInt(c.getAttribute("data-consumo"), 10);
      var val = parseFloat(c.value);
      if (!isFinite(val) || val <= 0) {
        mostrarToast("Consumo no válido. Usa un número mayor a 0.", "error");
        c.value = consumoVehiculo(id);
        return;
      }
      consumosPorVehiculo[id] = val;
      guardarConsumos();
      mostrarToast("Consumo del vehículo " + id + " actualizado a " + val + " L/100km.", "success");
      refrescar();
    });

    lista.addEventListener("change", function (e) {
      var c = e.target.closest("[data-conductor]");
      if (!c) return;
      var id = parseInt(c.getAttribute("data-conductor"), 10);
      var nombre = c.value;
      if (nombre) {
        conductores[id] = nombre;
        mostrarToast("Conductor " + nombre + " asignado al vehículo " + id + ".", "success");
      } else {
        delete conductores[id];
        mostrarToast("Conductor removido del vehículo " + id + ".", "info");
      }
      guardarConductores();
      refrescar();
    });

    $("#btn-refrescar").addEventListener("click", function () {
      refrescar();
    });

    $("#filtro-buscar").addEventListener("input", function () {
      filtroActual.buscar = this.value;
      pintarVehiculos();
    });
    $("#filtro-estado").addEventListener("change", function () {
      filtroActual.estado = this.value;
      pintarVehiculos();
    });
    $("#filtro-conductor").addEventListener("change", function () {
      filtroActual.conductor = this.value;
      pintarVehiculos();
    });

    $("#btn-config").addEventListener("click", abrirModal);
    document.querySelectorAll("[data-abrir-configuracion]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        abrirModal();
      });
    });
    $("#modal-cerrar").addEventListener("click", cerrarModal);
    $("#btn-cancelar-config").addEventListener("click", cerrarModal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) cerrarModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (!geozonaModal.hidden) { cancelarDibujoGeozona(); cerrarModalGeozona(); }
        else if (!modal.hidden) cerrarModal();
      }
    });

    $("#cfg-metodo").addEventListener("change", actualizarCamposAuth);
    formConfig.addEventListener("submit", guardarConfiguracion);
    $("#btn-probar").addEventListener("click", probarConexion);

    $("#btn-nueva-geozona").addEventListener("click", abrirModalGeozona);
    $("#gz-cerrar").addEventListener("click", function () { cancelarDibujoGeozona(); cerrarModalGeozona(); });
    $("#gz-cancelar").addEventListener("click", function () { cancelarDibujoGeozona(); cerrarModalGeozona(); });
    $("#gz-dibujar").addEventListener("click", function () {
      cancelarDibujoGeozona();
      cerrarModalGeozona();
      setTimeout(iniciarDibujoGeozona, 300);
    });
    $("#gz-elegir").addEventListener("change", rellenarCoordenadasGeozona);
    formGeozona.addEventListener("submit", crearGeozonaGuardada);
    $("#geozonas").addEventListener("click", function (e) {
      var ver = e.target.closest("[data-ver-geozona]");
      if (ver) { verGeozonaEnMapa(parseInt(ver.getAttribute("data-ver-geozona"), 10)); return; }
      var ed = e.target.closest("[data-editar-geozona]");
      if (ed) { editarGeozona(parseInt(ed.getAttribute("data-editar-geozona"), 10)); return; }
      var b = e.target.closest("[data-borrar-geozona]");
      if (b) borrarGeozona(parseInt(b.getAttribute("data-borrar-geozona"), 10));
    });
    $("#btn-limpiar-alarmas").addEventListener("click", function () {
      eventos = [];
      idsVistos = {};
      renderAlarmas();
    });

    $("#btn-abrir-conductores").addEventListener("click", function (e) {
      e.preventDefault();
      abrirModalConductores();
    });
    $("#cn-cerrar").addEventListener("click", cerrarModalConductores);
    $("#cn-agregar").addEventListener("click", agregarConductor);
    $("#lista-conductores-admin").addEventListener("click", function (e) {
      var editar = e.target.closest("[data-editar-conductor]");
      if (editar) { editarConductor(parseInt(editar.getAttribute("data-editar-conductor"), 10)); return; }
      var borrar = e.target.closest("[data-borrar-conductor]");
      if (borrar) borrarConductor(parseInt(borrar.getAttribute("data-borrar-conductor"), 10));
    });
    modalConductores.addEventListener("click", function (e) {
      if (e.target === modalConductores) cerrarModalConductores();
    });

    var modoOscuroGuardado = localStorage.getItem(CLAVE_MODO_OSCURO) === "true";
    if (modoOscuroGuardado) document.body.classList.add("modo-oscuro");
    $("#btn-modo-oscuro").addEventListener("click", function () {
      document.body.classList.toggle("modo-oscuro");
      var activo = document.body.classList.contains("modo-oscuro");
      localStorage.setItem(CLAVE_MODO_OSCURO, activo);
      this.innerHTML = activo
        ? '<svg class="icon" aria-hidden="true"><use href="#i-sun"/></svg>'
        : '<svg class="icon" aria-hidden="true"><use href="#i-moon"/></svg>';
      this.title = activo ? "Modo claro" : "Modo oscuro";
      this.setAttribute("aria-label", this.title);
    });
    if (modoOscuroGuardado) {
      $("#btn-modo-oscuro").innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-sun"/></svg>';
      $("#btn-modo-oscuro").title = "Modo claro";
      $("#btn-modo-oscuro").setAttribute("aria-label", "Modo claro");
    }

    $("#btn-nuevo-poi").addEventListener("click", abrirModalPoi);
    $("#poi-cerrar").addEventListener("click", cerrarModalPoi);
    $("#poi-cancelar").addEventListener("click", cerrarModalPoi);
    formPoi.addEventListener("submit", guardarPoi);
    $("#poi-elegir").addEventListener("change", function () {
      var val = this.value;
      var v = buscarVehiculo(parseInt(val, 10));
      if (v && v.tienePosicion) {
        $("#poi-lat").value = v.lat.toFixed(6);
        $("#poi-lon").value = v.lon.toFixed(6);
      } else if (mapa && typeof L !== "undefined") {
        var c = mapa.getCenter();
        $("#poi-lat").value = c.lat.toFixed(6);
        $("#poi-lon").value = c.lng.toFixed(6);
      }
    });
    $("#pois").addEventListener("click", function (e) {
      var editar = e.target.closest("[data-editar-poi]");
      if (editar) { abrirModalEditarPoi(parseInt(editar.getAttribute("data-editar-poi"), 10)); return; }
      var b = e.target.closest("[data-borrar-poi]");
      if (b) borrarPoi(parseInt(b.getAttribute("data-borrar-poi"), 10));
    });
    modalPoi.addEventListener("click", function (e) {
      if (e.target === modalPoi) cerrarModalPoi();
    });

    $("#hospital-cerrar").addEventListener("click", cerrarModalHospital);
    $("#hospital-cancelar").addEventListener("click", cerrarModalHospital);
    $("#form-hospital").addEventListener("submit", guardarHospital);
    modalHospital.addEventListener("click", function (e) {
      if (e.target === modalHospital) cerrarModalHospital();
    });

    $("#vehiculo-cerrar").addEventListener("click", cerrarModalVehiculo);
    $("#modal-vehiculo").addEventListener("click", function (e) {
      if (e.target === $("#modal-vehiculo")) cerrarModalVehiculo();
    });

    var mapaEl = document.getElementById("mapa");
    if (mapaEl) {
      mapaEl.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-editar-hospital]");
        if (btn) {
          var id = parseInt(btn.getAttribute("data-editar-hospital"), 10);
          abrirModalHospital(id);
        }
      });
    }

    var btnToggleHospitales = $("#btn-toggle-hospitales");
    var selectRadio = $("#select-radio-cobertura");
    var visibleGuardado = localStorage.getItem(CLAVE_HOSPITALES_VISIBLE) === "true";
    var radioGuardado = localStorage.getItem(CLAVE_RADIO_COBERTURA);
    if (radioGuardado) {
      radioCobertura = parseInt(radioGuardado, 10);
      selectRadio.value = radioCobertura;
    }
    if (visibleGuardado) {
      coberturaVisible = true;
      btnToggleHospitales.textContent = "Ocultar del mapa";
    }
    btnToggleHospitales.addEventListener("click", function () {
      toggleHospitales();
      this.textContent = coberturaVisible ? "Ocultar del mapa" : "Mostrar en mapa";
      if (coberturaVisible) dibujarCobertura();
    });
    selectRadio.addEventListener("change", function () {
      cambiarRadioCobertura(this.value);
    });

    var layerCheckboxes = ["layer-vehiculos", "layer-geozonas", "layer-pois", "layer-hospitales", "layer-cobertura", "layer-ruta"];
    var layerNames = ["vehiculos", "geozonas", "pois", "hospitales", "cobertura", "ruta"];
    layerCheckboxes.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", function () {
          toggleCapa(layerNames[i], this.checked);
        });
      }
    });

    var mapaOscuroCheck = document.getElementById("layer-mapa-oscuro");
    if (mapaOscuroCheck) {
      function actualizarLabelMapaOscuro(activo) {
        var icono = document.querySelector("#map-dark-toggle .map-dark-toggle__icon");
        var texto = document.querySelector("#map-dark-toggle .map-dark-toggle__text");
        if (icono) icono.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#' + (activo ? "i-sun" : "i-moon") + '"/></svg>';
        if (texto) texto.textContent = activo ? "Modo claro" : "Modo oscuro";
      }
      var guardadoOscuro = localStorage.getItem(CLAVE_MAPA_OSCURO);
      if (guardadoOscuro === "true") {
        mapaOscuroCheck.checked = true;
        actualizarLabelMapaOscuro(true);
      }
      mapaOscuroCheck.addEventListener("change", function () {
        alternarMapaOscuro(this.checked);
        actualizarLabelMapaOscuro(this.checked);
      });
    }

    document.getElementById("hospitales").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-ver-hospital]");
      if (btn) {
        var id = parseInt(btn.getAttribute("data-ver-hospital"), 10);
        for (var i = 0; i < hospitales.length; i++) {
          if (hospitales[i].id === id && mapa) {
            document.getElementById("seccion-mapa").scrollIntoView({ behavior: "smooth" });
            mapa.setView([hospitales[i].lat, hospitales[i].lon], 14);
            break;
          }
        }
      }
    });

    $("#btn-cargar-historial").addEventListener("click", cargarHistorial);

    function exportarGPX() {
      if (!pbDetalles[pbIndex]) return;
      var item = pbDetalles[pbIndex];
      var pts = item.posiciones;
      if (!pts || pts.length < 2) return;
      var nombre = "flota_viaje_" + (pbIndex + 1) + "_" + new Date().toISOString().slice(0, 10) + ".gpx";
      var gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
      gpx += '<gpx version="1.1" creator="Flota GPS"\n';
      gpx += '  xmlns="http://www.topografix.com/GPX/1/1"\n';
      gpx += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
      gpx += '  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n';
      gpx += '  <metadata>\n';
      gpx += '    <name>Viaje ' + (pbIndex + 1) + '</name>\n';
      gpx += '    <time>' + (item.viaje.startTime || new Date().toISOString()) + '</time>\n';
      gpx += '  </metadata>\n';
      gpx += '  <trk>\n';
      gpx += '    <name>Viaje ' + (pbIndex + 1) + '</name>\n';
      gpx += '    <trkseg>\n';
      pts.forEach(function (p) {
        var ele = p.altitude ? p.altitude.toFixed(1) : "0";
        var spd = p.speed ? (p.speed * 1.852).toFixed(1) : "0";
        gpx += '      <trkpt lat="' + p.latitude + '" lon="' + p.longitude + '">\n';
        gpx += '        <ele>' + ele + '</ele>\n';
        gpx += '        <time>' + p.fixTime + '</time>\n';
        gpx += '        <extensions>\n';
        gpx += '          <speed>' + spd + '</speed>\n';
        gpx += '        </extensions>\n';
        gpx += '      </trkpt>\n';
      });
      gpx += '    </trkseg>\n';
      gpx += '  </trk>\n';
      gpx += '</gpx>';
      var blob = new Blob([gpx], { type: "application/gpx+xml" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    $("#btn-exportar-gpx").addEventListener("click", exportarGPX);

    $("#hist-rango").addEventListener("change", function () {
      var rango = this.value;
      if (rango === "personalizado") return;
      aplicarRangoHistorial(rango);
    });

    $("#btn-generar-reporte").addEventListener("click", generarReporte);
    $("#btn-exportar-csv").addEventListener("click", exportarCSV);
    $("#btn-exportar-pdf").addEventListener("click", exportarPDF);
    $("#rep-rango").addEventListener("change", function () {
      var ahora = new Date();
      function inputLocal(d) {
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, "0");
        var dia = String(d.getDate()).padStart(2, "0");
        var h = String(d.getHours()).padStart(2, "0");
        var min = String(d.getMinutes()).padStart(2, "0");
        return y + "-" + m + "-" + dia + "T" + h + ":" + min;
      }
      var hastaStr, desdeStr;
      if (this.value === "custom") {
        desdeStr = inputLocal(new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000));
        hastaStr = inputLocal(ahora);
      } else if (this.value === "0") {
        desdeStr = inputLocal(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()));
        hastaStr = inputLocal(ahora);
      } else if (this.value === "1") {
        desdeStr = inputLocal(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1));
        hastaStr = inputLocal(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()));
      } else {
        var dias = parseInt(this.value) || 7;
        hastaStr = inputLocal(ahora);
        desdeStr = inputLocal(new Date(ahora.getTime() - dias * 24 * 60 * 60 * 1000));
      }
      $("#rep-desde").value = desdeStr;
      $("#rep-hasta").value = hastaStr;
    });
    $("#rep-rango").dispatchEvent(new Event("change"));

    $("#pb-play").addEventListener("click", togglePlayback);
    $("#pb-slider").addEventListener("input", function () {
      pbIndex = parseInt(this.value, 10);
      resaltarViaje(pbIndex);
    });
    $("#pb-prev").addEventListener("click", function () {
      if (pbDetalles.length && pbIndex > 0) {
        pbIndex--;
        resaltarViaje(pbIndex);
      }
    });
    $("#pb-next").addEventListener("click", function () {
      if (pbDetalles.length && pbIndex < pbDetalles.length - 1) {
        pbIndex++;
        resaltarViaje(pbIndex);
      }
    });

    if (config.baseUrl && (config.user || config.password || config.token)) {
      iniciarConexion();
    } else {
      setAlerta(
        "warning",
        "Sin conexión configurada",
        "Configura tu servidor Traccar (o el proxy) y tus credenciales en el botón Configuración para empezar a monitorear tus dispositivos.",
        "Configurar ahora",
        abrirModal
      );
    }
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();