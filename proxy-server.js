"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { Readable } = require("stream");

const PORT = process.env.PORT || 3000;
const TRACCAR = (process.env.TRACCAR_URL || "http://127.0.0.1:8082").replace(/\/+$/, "");
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const CABECERAS_FILTRADAS = ["host", "connection", "content-length"];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    await proxyApi(req, res, pathname, url.search);
    return;
  }

  let archivo = path.normalize(pathname === "/" ? "/index.html" : pathname);
  if (archivo.startsWith("..") || archivo.startsWith("/..")) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }
  archivo = path.join(ROOT, archivo);

  fs.readFile(archivo, (err, contenido) => {
    if (err) {
      if (archivo === path.join(ROOT, "index.html")) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("No encontrado");
        return;
      }
      res.writeHead(302, { Location: "/" });
      res.end();
      return;
    }
    const tipo = MIME[path.extname(archivo)] || "application/octet-stream";
    const cabeceras = { "Content-Type": tipo, "Cache-Control": "no-cache" };
    const comprimible = /^(text\/|application\/(javascript|json))/.test(tipo);
    if (comprimible && aceptaGzip(req) && contenido.length > 1024) {
      const comprimido = zlib.gzipSync(contenido, { level: 6 });
      cabeceras["Content-Encoding"] = "gzip";
      cabeceras["Content-Length"] = comprimido.length;
      cabeceras["Vary"] = "Accept-Encoding";
      res.writeHead(200, cabeceras);
      res.end(comprimido);
      return;
    }
    cabeceras["Content-Length"] = contenido.length;
    res.writeHead(200, cabeceras);
    res.end(contenido);
  });
});

async function proxyApi(req, res, pathname, busqueda) {
  const objetivo = TRACCAR + pathname + busqueda;
  try {
    const cuerpo = await leerCuerpo(req);
    const cabeceras = {};
    for (const [clave, valor] of Object.entries(req.headers)) {
      if (CABECERAS_FILTRADAS.includes(clave)) continue;
      cabeceras[clave] = valor;
    }
    // El fetch de Node descomprime de forma transparente pero conserva las
    // cabeceras content-encoding/content-length, lo que produce respuestas
    // inconsistentes. Se pide sin comprimir y se comprime aqui, en streaming.
    cabeceras["accept-encoding"] = "identity";

    const upstream = await fetch(objetivo, {
      method: req.method,
      headers: cabeceras,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.from(cuerpo)
    });

    const cabecerasSalida = {
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8"
    };
    const cookies = typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : (upstream.headers.get("set-cookie") ? [upstream.headers.get("set-cookie")] : []);
    if (cookies.length) cabecerasSalida["Set-Cookie"] = cookies;

    // El JSON de Traccar comprime ~60x (claves repetidas en cada posicion).
    const comprimir = Boolean(upstream.body) &&
      ["GET", "HEAD"].includes(req.method) &&
      aceptaGzip(req);
    if (comprimir) {
      cabecerasSalida["Content-Encoding"] = "gzip";
      cabecerasSalida["Vary"] = "Accept-Encoding";
    }

    res.writeHead(upstream.status, cabecerasSalida);
    if (!upstream.body || req.method === "HEAD") {
      res.end();
      return;
    }

    const flujo = Readable.fromWeb(upstream.body);
    flujo.on("error", () => res.destroy());
    res.on("close", () => flujo.destroy());
    if (comprimir) {
      flujo.pipe(zlib.createGzip({ level: 6 })).pipe(res);
    } else {
      flujo.pipe(res);
    }
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    }
    res.end(JSON.stringify({
      error: "El proxy no pudo conectarse con Traccar (" + TRACCAR + "). " + err.message
    }));
  }
}

function aceptaGzip(req) {
  const cabecera = req.headers["accept-encoding"] || "";
  return /\bgzip\b/.test(cabecera);
}

function leerCuerpo(req) {
  return new Promise((resolve) => {
    const trozos = [];
    req.on("data", (t) => trozos.push(t));
    req.on("end", () => resolve(Buffer.concat(trozos)));
  });
}

server.listen(PORT, () => {
  console.log("Gestor de flota activo: http://localhost:" + PORT);
  console.log("API Traccar (nativo): " + TRACCAR);
  console.log("Los datos no se guardan: credenciales solo viajan de tu navegador al proxy.");
});