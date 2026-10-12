import { useEffect, useRef } from 'react';

export default function ConnectionMap({ ideas, connections, onOpen }) {
  const mapRef = useRef(null);
  // A wider circle gives each node room without a graph-layout dependency.
  const radius = Math.max(170, ideas.length * 38);
  const size = ideas.length === 1 ? 320 : radius * 2 + 260;
  const center = size / 2;
  const nodes = ideas.map((idea, index) => {
    const angle = (index / ideas.length) * Math.PI * 2 - Math.PI / 2;
    return { ...idea, x: ideas.length === 1 ? center : center + Math.cos(angle) * radius, y: ideas.length === 1 ? center : center + Math.sin(angle) * radius };
  });
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  useEffect(() => {
    // Start at the top-center node, even when the map needs horizontal scrolling.
    const map = mapRef.current;
    map.scrollLeft = (map.scrollWidth - map.clientWidth) / 2;
  }, [ideas.length]);

  return (
    <div ref={mapRef} className="map-scroll rounded-3xl border border-stone-200 bg-white" tabIndex={0} role="region" aria-label="Scrollable connection map">
      <svg viewBox={`0 0 ${size} ${size}`} style={{ minWidth: size }} className="map-svg" role="group" aria-label="Idea connection map">
        <title>Your ideas and the connections between them</title>
        <defs>
          <pattern id="map-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1" fill="#e9e5dc" /></pattern>
        </defs>
        <rect width={size} height={size} fill="url(#map-dots)" />
        {connections.map(([firstId, secondId]) => {
          const first = nodesById.get(firstId);
          const second = nodesById.get(secondId);
          if (!first || !second) return null;
          return <line key={JSON.stringify([firstId, secondId])} x1={first.x} y1={first.y} x2={second.x} y2={second.y} stroke="#baa9d9" strokeWidth="2" />;
        })}
        {nodes.map((node, index) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} role="button" tabIndex={0} aria-label={`Open idea: ${node.title}`} onClick={() => onOpen(node.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(node.id); } }} className="map-node">
            <title>{node.title}</title>
            <rect x="-100" y="-33" width="200" height="66" rx="20" fill={index % 2 === 0 ? '#fff1e6' : '#f1ecfa'} stroke={index % 2 === 0 ? '#e6bf9f' : '#c7b8ea'} />
            <text textAnchor="middle" dominantBaseline="central" fontSize="14" fill="#35332F">{node.title.length > 23 ? `${node.title.slice(0, 22)}…` : node.title}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
