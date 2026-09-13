import {CanvasTexture, Color, SRGBColorSpace, Vector2} from "three";

import {clusterById} from "@/content/clusters";
import type {AppLocale} from "@/i18n/routing";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {CoreIdentity, PortfolioNode} from "@/lib/portfolio-types";

function drawPattern(
  context: CanvasRenderingContext2D,
  node: PortfolioNode | CoreIdentity,
  accent: string,
) {
  context.strokeStyle = accent;
  context.fillStyle = accent;
  context.lineWidth = 2;
  context.globalAlpha = 0.38;

  if (node.visual.variant === "genomic-nebula") {
    for (let strand = 0; strand < 2; strand += 1) {
      context.beginPath();
      for (let index = 0; index < 18; index += 1) {
        const x = 470 + Math.sin(index * 0.7 + strand * Math.PI) * 95;
        const y = 55 + index * 24;
        if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    }
    return;
  }

  if (node.visual.variant === "system-module") {
    for (let index = 0; index < 5; index += 1) {
      context.strokeRect(
        410 + (index % 3) * 115,
        105 + Math.floor(index / 3) * 105,
        82,
        52,
      );
    }
    return;
  }

  if (node.visual.variant === "human-signal") {
    for (let radius = 45; radius <= 185; radius += 45) {
      context.beginPath();
      context.arc(585, 245, radius, Math.PI * 1.08, Math.PI * 1.92);
      context.stroke();
    }
    return;
  }

  if (node.visual.variant === "data-node") {
    for (let index = 0; index < 5; index += 1) {
      const y = 135 + index * 52;
      context.beginPath();
      context.moveTo(390, y);
      context.lineTo(590, 255 + (y - 240) * 0.24);
      context.lineTo(835, 245 + index * 8);
      context.stroke();
    }
    return;
  }

  const points = [[420, 330], [500, 155], [610, 260], [735, 120], [810, 310]];
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
  });
  context.stroke();
  points.forEach(([x, y]) => {
    context.beginPath();
    context.arc(x, y, 7, 0, Math.PI * 2);
    context.fill();
  });
}

function alphaColor(value: string, alpha: number) {
  const color = new Color(value);
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
}

export async function createProjectFallbackTexture(
  node: PortfolioNode | CoreIdentity,
  locale: AppLocale,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 540;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create procedural project cover");

  const cluster = "cluster" in node ? clusterById[node.cluster] : {
    color: "#78d7ff", title: node.primaryRole,
  };
  const gradient = context.createRadialGradient(620, 210, 15, 620, 210, 520);
  gradient.addColorStop(0, alphaColor(cluster.color, 0.28));
  gradient.addColorStop(0.55, "#071722");
  gradient.addColorStop(1, "#03090e");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawPattern(context, node, cluster.color);

  context.globalAlpha = 1;
  context.fillStyle = "#e8f7fc";
  context.font = "600 38px system-ui, sans-serif";
  context.fillText(resolveLocalizedText(node.title, locale), 54, 420, 760);
  context.fillStyle = cluster.color;
  context.font = "500 17px ui-monospace, monospace";
  context.fillText(resolveLocalizedText(cluster.title, locale).toUpperCase(), 56, 462);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return {texture, uvOffset: new Vector2(0, 0), uvScale: new Vector2(1, 1)};
}
