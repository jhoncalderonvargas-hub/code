"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

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

const CABECERAS_FILTRADAS = ["host", "connection", "accept-encoding", "content-length"];

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
    res.writeHead(200, { "Content-Type": MIME[path.extname(archivo)] || "application/octet-stream" });
    res.end(contenido);
  });
});

async function proxyApi(req, res, pathname, busqueda) {
  const objetivo = TRACCAR + pathname + busqueda;
  try {
    const cuerpo = await leerCuerpo(req);
    const cabeceras = {};
    for (const [clave, valor] of Object.entries(req.headers)) {
      if (!CABECERAS_FILTRADAS.includes(clave)) cabeceras[clave] = valor;
    }
    const upstream = await fetch(objetivo, {
      method: req.method,
      headers: cabeceras,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.from(cuerpo)
    });
    const datos = await upstream.arrayBuffer();
    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8"
    });
    res.end(Buffer.from(datos));
  } catch (err) {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      error: "El proxy no pudo conectarse con Traccar (" + TRACCAR + "). " + err.message
    }));
  }
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