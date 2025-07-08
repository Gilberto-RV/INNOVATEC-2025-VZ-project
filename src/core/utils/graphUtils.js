// src/core/utils/graphUtils.js

export function buildGraph(features) {
  const graph = {};
  const nodeCoords = {};

  features.forEach(feature => {
    const { properties, geometry } = feature;

    // Registrar coordenadas del nodo si es tipo Punto
    if (geometry.type === 'Point') {
      const [lon, lat] = geometry.coordinates;
      nodeCoords[properties.id] = { latitude: lat, longitude: lon };
    }

    // Registrar caminos (from <-> to)
    if (properties.tipo === 'CAMINO' && properties.from && properties.to) {
      if (!graph[properties.from]) graph[properties.from] = [];
      if (!graph[properties.to]) graph[properties.to] = [];

      graph[properties.from].push(properties.to);
      graph[properties.to].push(properties.from);
    }

    // Registrar conexiones adicionales (conexiones desde nodos como EDIFICIO, ENTRADA, CRUCE)
    if (Array.isArray(properties.conexiones)) {
      if (!graph[properties.id]) graph[properties.id] = [];
      properties.conexiones.forEach(conn => {
        graph[properties.id].push(conn);
        if (!graph[conn]) graph[conn] = [];
        graph[conn].push(properties.id);
      });
    }
  });

  return { graph, nodeCoords };
}

export function findRoute(graph, start, goal) {
  const visited = new Set();
  const queue = [[start]];

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === goal) return path;

    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = graph[node] || [];
      neighbors.forEach(next => {
        if (!visited.has(next)) {
          queue.push([...path, next]);
        }
      });
    }
  }

  return null; // No se encontró ruta
}
