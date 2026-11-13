'use client';

import React from 'react';
import { CORRIDOR_CODES, CORRIDORS } from '@/lib/data/corridors';
import { BusLiveState, BusStop } from '@/lib/types';

interface SchematicMapProps {
  svgRef: React.RefObject<SVGSVGElement>;
  buses: BusLiveState[];
  visibleCorridors: Record<string, boolean>;
  hubs: BusStop[];
  schematicPin: { x: number; y: number } | null;
  onMapClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onOpenSheet: (stopCode: string) => void;
  onSelectBus: (bus: BusLiveState) => void;
}

export default function SchematicMap({
  svgRef,
  buses,
  visibleCorridors,
  hubs,
  schematicPin,
  onMapClick,
  onOpenSheet,
  onSelectBus,
}: SchematicMapProps) {
  return (
    <svg
      ref={svgRef}
      id="map"
      viewBox="0 0 600 400"
      className="block w-full touch-manipulation select-none"
      role="img"
      aria-label="Peta skematik lima koridor Bus Trans Palu dengan posisi bus"
      onClick={onMapClick}
    >
      {/* Land & Coastline Background */}
      <rect width="600" height="400" fill="#e6eedd" />
      <path d="M0,0 H400 C360,36 290,52 236,96 C170,148 90,118 0,168 Z" fill="#a6d0f0" />
      <path d="M0,0 H370 C335,30 270,46 222,86 C165,134 85,104 0,148 Z" fill="#7fb8e6" opacity=".55" />
      <g stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".9">
        <path d="M20,260 Q160,240 260,285 T580,250" />
        <path d="M560,60 Q540,150 590,200" />
        <path d="M60,320 Q140,300 190,330" />
      </g>

      {/* Schematic Corridor Paths */}
      <g id="layer-paths">
        {CORRIDOR_CODES.map((code) => {
          const c = CORRIDORS[code];
          if (!visibleCorridors[code] || !c.schematic_path) return null;
          return (
            <g key={code} data-c={code}>
              <path
                d={c.schematic_path}
                fill="none"
                stroke="#fff"
                strokeWidth="9"
                strokeLinecap="round"
                opacity=".9"
              />
              <path
                d={c.schematic_path}
                fill="none"
                stroke={c.color_hex}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>

      {/* Hub Transit Dots */}
      <g id="layer-hubs">
        {hubs.map((hub) => {
          if (hub.schematic_x === undefined || hub.schematic_y === undefined) return null;
          return (
            <g
              key={hub.stop_code}
              className="hubdot cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`Halte ${hub.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenSheet(hub.stop_code);
              }}
            >
              <circle
                className="ring"
                cx={hub.schematic_x}
                cy={hub.schematic_y}
                r="11"
                fill="#fff"
                stroke="#1b2d52"
                strokeWidth="3"
              />
              <circle cx={hub.schematic_x} cy={hub.schematic_y} r="4" fill="#1b2d52" />
              <text
                x={hub.schematic_x + (hub.label_x || 0)}
                y={hub.schematic_y + (hub.label_y || 0)}
                textAnchor={hub.label_anchor || 'middle'}
                fontSize="11.5"
                fontWeight="700"
                fill="#1b2d52"
              >
                {hub.short_name || hub.name}
              </text>
            </g>
          );
        })}
      </g>

      {/* Real-time Buses on Schematic */}
      <g id="layer-buses">
        {buses.map((bus) => {
          if (!visibleCorridors[bus.corridor_code]) return null;
          const corridor = CORRIDORS[bus.corridor_code];
          if (!corridor) return null;

          const p = bus.p ?? 0.5;
          let bx = 300;
          let by = 200;
          if (bus.corridor_code === '01') {
            bx = 520 - p * 220;
            by = 46 + p * 124;
          } else if (bus.corridor_code === '02') {
            bx = 408 - p * 298;
            by = 132 + p * 68;
          } else if (bus.corridor_code === '03M') {
            bx = 300 + p * 140;
            by = 170 + p * 150;
          } else if (bus.corridor_code === '03Y') {
            bx = 300 + p * 140;
            by = 170 + p * 150;
          } else if (bus.corridor_code === '04') {
            bx = 440 - p * 230;
            by = 320 + p * 30;
          }

          const heading = bus.dir === 1 ? (bus.heading || 180) : ((bus.heading || 0) + 180) % 360;

          return (
            <g
              key={bus.bus_id}
              className="busg cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`Bus ${bus.hull_number}`}
              transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${heading})`}
              style={{ opacity: bus.tracking_status === 'OFFLINE' ? 0.45 : 1 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBus(bus);
              }}
            >
              <rect
                x="-10"
                y="-6"
                width="20"
                height="12"
                rx="3.5"
                fill="#fff"
                stroke={corridor.color_hex}
                strokeWidth="2.5"
              />
              <rect x="3" y="-4" width="5" height="8" rx="1.5" fill="#1d2b45" />
              <circle
                cx="-4"
                cy="0"
                r="2.6"
                fill={
                  bus.tracking_status === 'ACTIVE'
                    ? '#4f9fe0'
                    : bus.tracking_status === 'STALE'
                    ? '#ffc233'
                    : '#7b8499'
                }
              />
            </g>
          );
        })}
      </g>

      {/* User Click Pin on Schematic */}
      {schematicPin && (
        <g id="layer-me" transform={`translate(${schematicPin.x.toFixed(1)} ${schematicPin.y.toFixed(1)})`}>
          <path
            d="M0,0 C-12,-14 -12,-28 0,-28 C12,-28 12,-14 0,0Z"
            fill="#ff6b4a"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle cx="0" cy="-19" r="4" fill="#fff" />
        </g>
      )}
    </svg>
  );
}
