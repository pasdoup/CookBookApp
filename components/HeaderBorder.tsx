import { Colors } from "@/constants";
import React from "react";
import Svg, { Path } from 'react-native-svg';



export function HeaderBorder ({ color = Colors.vanilla }: { color?: string }) {
  const width = 390;
  const step  = 30; // largeur de chaque créneau
  const h     = 16; // hauteur

  let d = `M0,${h} `;
  for (let x = 0; x < width; x += step) {
    d += `L${x},${h} L${x},0 L${x + step / 2},${h / 2} L${x + step},0 L${x + step},${h} `;
  }
  d += `L${width},${h} Z`;
  return (
  <Svg 
  width={width}
      height={h}
      style={{ position: 'absolute', bottom: 0, left: 0 }}>
      <Path
        d={d} 
        fill={color}
      />
    </Svg>)
}

