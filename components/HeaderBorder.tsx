import { Colors, Spacing } from "@/constants";
import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import Svg, { Path } from 'react-native-svg';

type Props = ViewProps & {
    color?: string,
}

export function HeaderBorder ({ color = Colors.cream }: Props) {
  const width = 490;
  const step  = 40; // largeur de chaque créneau
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
    </Svg>
  )
}

const styles = StyleSheet.create({
    header: {
        padding: Spacing.sm,
        paddingBottom: Spacing.xl,
        height: 100,
      },
      logo: {
        width: 24, 
        height: 24
      },
});