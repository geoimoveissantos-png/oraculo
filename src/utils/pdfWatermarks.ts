import jsPDF from 'jspdf';

export const ACCENT_GOLD = '#D4AF37';
export const ACCENT_GOLD_LIGHT = '#F3E5AB';
export const PRIMARY = '#1A1B2F';

export const drawStarOfDavid = (doc: jsPDF, cx: number, cy: number, r: number, strokeColor: string = ACCENT_GOLD) => {
  doc.setDrawColor(strokeColor);
  doc.setLineWidth(0.4);

  // Outer concentric circles
  doc.circle(cx, cy, r * 1.3, 'S');
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, r * 1.18, 'S');

  // Triangle 1 (pointing up)
  const sin60 = Math.sin(Math.PI / 3);
  const cos60 = Math.cos(Math.PI / 3);
  const p1 = [cx, cy - r];
  const p2 = [cx + r * sin60, cy + r * cos60];
  const p3 = [cx - r * sin60, cy + r * cos60];

  doc.setLineWidth(0.4);
  doc.line(p1[0], p1[1], p2[0], p2[1]);
  doc.line(p2[0], p2[1], p3[0], p3[1]);
  doc.line(p3[0], p3[1], p1[0], p1[1]);

  // Triangle 2 (pointing down)
  const q1 = [cx, cy + r];
  const q2 = [cx + r * sin60, cy - r * cos60];
  const q3 = [cx - r * sin60, cy - r * cos60];

  doc.line(q1[0], q1[1], q2[0], q2[1]);
  doc.line(q2[0], q2[1], q3[0], q3[1]);
  doc.line(q3[0], q3[1], q1[0], q1[1]);

  // Inner center circle / dot
  doc.circle(cx, cy, 1.2, 'S');
};

export const drawEyeOfProvidence = (doc: jsPDF, cx: number, cy: number, size: number) => {
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.5);

  // Radiating rays
  const rayLen = size * 1.35;
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = (angle * Math.PI) / 180;
    const x1 = cx + (size * 0.7) * Math.cos(rad);
    const y1 = cy + (size * 0.7) * Math.sin(rad);
    const x2 = cx + rayLen * Math.cos(rad);
    const y2 = cy + rayLen * Math.sin(rad);
    doc.setLineWidth(0.2);
    doc.line(x1, y1, x2, y2);
  }

  // Equilateral triangle
  const h = size * 1.1;
  const halfW = size * 0.75;
  doc.setLineWidth(0.5);
  doc.line(cx, cy - h * 0.6, cx + halfW, cy + h * 0.4);
  doc.line(cx + halfW, cy + h * 0.4, cx - halfW, cy + h * 0.4);
  doc.line(cx - halfW, cy + h * 0.4, cx, cy - h * 0.6);

  // Inner eye shape
  const eyeW = size * 0.45;
  const eyeH = size * 0.2;
  doc.setLineWidth(0.3);
  doc.line(cx - eyeW, cy + 1, cx, cy - eyeH + 1);
  doc.line(cx, cy - eyeH + 1, cx + eyeW, cy + 1);
  doc.line(cx - eyeW, cy + 1, cx, cy + eyeH + 1);
  doc.line(cx, cy + eyeH + 1, cx + eyeW, cy + 1);

  // Iris & pupil
  doc.circle(cx, cy + 1, size * 0.1, 'F');
};

export const drawSacredCrossWithAlphaOmega = (doc: jsPDF, cx: number, cy: number, size: number) => {
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.8);

  // Vertical bar
  doc.line(cx, cy - size * 0.7, cx, cy + size * 0.7);
  // Horizontal bar
  doc.line(cx - size * 0.45, cy - size * 0.2, cx + size * 0.45, cy - size * 0.2);

  // Flared ends (serifs)
  doc.setLineWidth(0.3);
  doc.line(cx - 2, cy - size * 0.7, cx + 2, cy - size * 0.7);
  doc.line(cx - 2, cy + size * 0.7, cx + 2, cy + size * 0.7);
  doc.line(cx - size * 0.45, cy - size * 0.2 - 2, cx - size * 0.45, cy - size * 0.2 + 2);
  doc.line(cx + size * 0.45, cy - size * 0.2 - 2, cx + size * 0.45, cy - size * 0.2 + 2);

  // Alpha & Omega text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('A', cx - size * 0.55, cy - size * 0.15, { align: 'right' });
  doc.text('Ω', cx + size * 0.55, cy - size * 0.15, { align: 'left' });
};

export const drawTripleMoon = (doc: jsPDF, cx: number, cy: number, r: number, strokeColor: string = ACCENT_GOLD) => {
  doc.setDrawColor(strokeColor);
  doc.setLineWidth(0.4);

  // Full Moon (Center)
  doc.circle(cx, cy, r, 'S');
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, r * 0.72, 'S');
  doc.circle(cx, cy, 0.9, 'F');

  // Left Waxing Crescent
  doc.setLineWidth(0.35);
  doc.circle(cx - r * 2.2, cy, r * 0.95, 'S');
  doc.setLineWidth(0.25);
  doc.circle(cx - r * 1.85, cy, r * 0.88, 'S');

  // Right Waning Crescent
  doc.setLineWidth(0.35);
  doc.circle(cx + r * 2.2, cy, r * 0.95, 'S');
  doc.setLineWidth(0.25);
  doc.circle(cx + r * 1.85, cy, r * 0.88, 'S');

  // Orbital Axis
  doc.setLineWidth(0.2);
  doc.line(cx - r * 3.8, cy, cx - r * 2.9, cy);
  doc.line(cx + r * 2.9, cy, cx + r * 3.8, cy);

  // Small astral dots
  doc.circle(cx - r * 4.1, cy, 0.6, 'F');
  doc.circle(cx + r * 4.1, cy, 0.6, 'F');
};

export const drawVintageHourglass = (doc: jsPDF, x: number, y: number, w: number, h: number, strokeColor: string = ACCENT_GOLD) => {
  doc.setDrawColor(strokeColor);
  doc.setLineWidth(0.5);

  // Top Carved Pediment
  doc.line(x - 1.2, y, x + w + 1.2, y);
  doc.line(x, y + 2.2, x + w, y + 2.2);
  doc.circle(x + w / 2, y - 1.2, 0.9, 'S');

  // Bottom Base
  doc.line(x, y + h - 2.2, x + w, y + h - 2.2);
  doc.line(x - 1.2, y + h, x + w + 1.2, y + h);
  doc.circle(x + w / 2, y + h + 1.2, 0.9, 'S');

  // Pillars
  doc.setLineWidth(0.35);
  doc.line(x + 1.2, y + 2.2, x + 1.2, y + h - 2.2);
  doc.circle(x + 1.2, y + h / 2, 0.8, 'S');
  doc.line(x + w - 1.2, y + 2.2, x + w - 1.2, y + h - 2.2);
  doc.circle(x + w - 1.2, y + h / 2, 0.8, 'S');

  // Glass Chambers
  doc.setLineWidth(0.3);
  const neckY = y + h / 2;
  const neckHalfW = 1.0;
  const midX = x + w / 2;

  doc.line(x + 2.8, y + 3.0, midX - neckHalfW, neckY);
  doc.line(x + w - 2.8, y + 3.0, midX + neckHalfW, neckY);
  doc.line(midX - neckHalfW, neckY, x + 2.8, y + h - 3.0);
  doc.line(midX + neckHalfW, neckY, x + w - 2.8, y + h - 3.0);

  // Falling Sand
  doc.setLineWidth(0.2);
  doc.line(midX - 2.5, y + 6.5, midX + 2.5, y + 6.5);
  doc.line(midX, y + 6.5, midX, y + h - 4.5);
  doc.line(midX - 3.2, y + h - 4.5, midX + 3.2, y + h - 4.5);
  doc.circle(midX, y + h - 5.2, 1.2, 'S');
};

export const drawSacredDreamcatcher = (doc: jsPDF, cx: number, cy: number, r: number, strokeColor: string = ACCENT_GOLD, lifePathNum: number = 8) => {
  doc.setDrawColor(strokeColor);
  doc.setLineWidth(0.6);

  // Outer Hoop
  doc.circle(cx, cy, r, 'S');
  doc.setLineWidth(0.25);
  doc.circle(cx, cy, r - 0.9, 'S');
  doc.circle(cx, cy, r * 1.14, 'S');

  // Web
  const pointsCount = 12;
  const pts: [number, number][] = [];
  for (let i = 0; i < pointsCount; i++) {
    const angle = (i * 2 * Math.PI) / pointsCount;
    pts.push([cx + (r - 1.2) * Math.cos(angle), cy + (r - 1.2) * Math.sin(angle)]);
  }

  doc.setLineWidth(0.2);
  for (let i = 0; i < pointsCount; i++) {
    const pNext = pts[(i + 4) % pointsCount];
    doc.line(pts[i][0], pts[i][1], pNext[0], pNext[1]);
  }

  // Center Jewel
  doc.setFillColor(24, 26, 48);
  doc.circle(cx, cy, r * 0.42, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r * 0.42, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(String(lifePathNum), cx, cy + 2.0, { align: 'center' });

  // Feathers helper
  const drawFeather = (fx: number, fy: number, len: number, angleDeg: number = 0) => {
    const rad = (angleDeg * Math.PI) / 180;
    const endX = fx + len * Math.sin(rad);
    const endY = fy + len * Math.cos(rad);
    doc.setLineWidth(0.25);
    doc.line(fx, fy, endX, endY);

    const midX = (fx + endX) / 2;
    const midY = (fy + endY) / 2;
    const normX = Math.cos(rad) * 1.5;
    const normY = -Math.sin(rad) * 1.5;

    doc.setLineWidth(0.18);
    doc.line(fx, fy, midX + normX, midY + normY);
    doc.line(midX + normX, midY + normY, endX, endY);
    doc.line(fx, fy, midX - normX, midY - normY);
    doc.line(midX - normX, midY - normY, endX, endY);
  };

  doc.setLineWidth(0.3);
  doc.line(cx, cy + r, cx, cy + r + 5.5);
  doc.circle(cx, cy + r + 6.3, 1.0, 'S');
  drawFeather(cx, cy + r + 7.3, 16, 0);
  drawFeather(cx, cy + r + 7.3, 13, -16);
  drawFeather(cx, cy + r + 7.3, 13, 16);

  const leftX = cx - r * 0.65;
  const leftY = cy + r * 0.75;
  doc.line(leftX, leftY, leftX, leftY + 4.5);
  doc.circle(leftX, leftY + 5.2, 0.8, 'S');
  drawFeather(leftX, leftY + 6.0, 12, -8);
  drawFeather(leftX, leftY + 10, 10, 12);

  const rightX = cx + r * 0.65;
  const rightY = cy + r * 0.75;
  doc.line(rightX, rightY, rightX, rightY + 4.5);
  doc.circle(rightX, rightY + 5.2, 0.8, 'S');
  drawFeather(rightX, rightY + 6.0, 12, 8);
  drawFeather(rightX, rightY + 6.0, 10, -12);
};

export const drawTarotCardFan = (doc: jsPDF, cx: number, cy: number, side: 'left' | 'right', strokeColor: string = ACCENT_GOLD) => {
  doc.setDrawColor(strokeColor);
  const cardW = 11;
  const cardH = 19;
  const offsets = side === 'left' ? [-14, -7, 0] : [0, 7, 14];

  offsets.forEach((offX, idx) => {
    const posX = cx + offX - cardW / 2;
    const posY = cy + (idx === 1 ? -1.5 : 0.5) - cardH / 2;
    doc.setFillColor(28, 30, 52);
    doc.roundedRect(posX, posY, cardW, cardH, 1, 1, 'F');
    doc.setLineWidth(0.35);
    doc.roundedRect(posX, posY, cardW, cardH, 1, 1, 'S');

    doc.setLineWidth(0.18);
    doc.rect(posX + 1.2, posY + 1.2, cardW - 2.4, cardH - 2.4);

    doc.line(posX + 1.2, posY + cardH / 2, posX + cardW / 2, posY + 1.2);
    doc.line(posX + cardW / 2, posY + 1.2, posX + cardW - 1.2, posY + cardH / 2);
    doc.line(posX + cardW - 1.2, posY + cardH / 2, posX + cardW / 2, posY + cardH - 1.2);
    doc.line(posX + cardW / 2, posY + cardH - 1.2, posX + 1.2, posY + cardH / 2);
    doc.circle(posX + cardW / 2, posY + cardH / 2, 0.7, 'F');
  });
};

export const drawRitualCandle = (doc: jsPDF, x: number, y: number, w: number, h: number, strokeColor: string = ACCENT_GOLD) => {
  doc.setFillColor(34, 38, 65);
  doc.roundedRect(x, y, w, h, 1.2, 1.2, 'F');
  doc.setDrawColor(strokeColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, w, h, 1.2, 1.2, 'S');

  // Wick
  const midX = x + w / 2;
  doc.setLineWidth(0.3);
  doc.line(midX, y, midX, y - 2.5);

  // Flame
  doc.setFillColor(255, 200, 50);
  doc.circle(midX, y - 4.5, 1.8, 'F');
  doc.setFillColor(255, 245, 180);
  doc.circle(midX, y - 4.2, 0.9, 'F');
};

export const drawBackgroundMysticalRunes = (doc: jsPDF, startX: number, startY: number, w: number, h: number) => {
  const runes = ['✦', '•', '✧', '☉', '☽', '☿', '♀', '♃', '♄', '⚡', '∞', '∆', 'Ψ', 'Ω', '☥', '★'];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(42, 46, 80);

  const cols = 12;
  const rows = 14;
  const stepX = w / cols;
  const stepY = h / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r * 7 + c * 13) % 3 === 0) {
        const glyph = runes[(r * 5 + c * 3) % runes.length];
        const rx = startX + c * stepX + (r % 2 === 0 ? 3 : -2);
        const ry = startY + r * stepY + (c % 2 === 0 ? 2 : -1);
        doc.text(glyph, rx, ry);
      }
    }
  }
};

export const drawEsotericWatermark = (doc: jsPDF, pageNum: number, pageWidth: number = 210) => {
  const cx = pageWidth / 2; // 105 mm
  const cy = 152; // Centro do conteúdo
  const WM_COLOR = '#E4E7F5';
  const WM_GOLD = '#ECE7DC';

  doc.setDrawColor(WM_COLOR);
  doc.setLineWidth(0.18);

  const styleCycle = ((pageNum - 2) % 6) + 1;

  if (styleCycle === 1) {
    // Metatron's Cube & Pythagorean Circles
    for (let r of [18, 36, 54, 70]) {
      doc.circle(cx, cy, r, 'S');
    }
    doc.setDrawColor(WM_GOLD);
    const hexPoints: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      hexPoints.push([cx + 54 * Math.cos(ang), cy + 54 * Math.sin(ang)]);
      doc.circle(cx + 54 * Math.cos(ang), cy + 54 * Math.sin(ang), 5.5, 'S');
    }
    for (let i = 0; i < 6; i++) {
      for (let j = i + 1; j < 6; j++) {
        doc.line(hexPoints[i][0], hexPoints[i][1], hexPoints[j][0], hexPoints[j][1]);
      }
    }
  } else if (styleCycle === 2) {
    // Sri Yantra & Lotus Mandala
    doc.circle(cx, cy, 68, 'S');
    doc.circle(cx, cy, 48, 'S');
    doc.circle(cx, cy, 28, 'S');
    doc.setDrawColor(WM_GOLD);
    for (let i = 0; i < 16; i++) {
      const ang = (i * 2 * Math.PI) / 16;
      doc.line(cx + 16 * Math.cos(ang), cy + 16 * Math.sin(ang), cx + 64 * Math.cos(ang), cy + 64 * Math.sin(ang));
    }
  } else if (styleCycle === 3) {
    // Octagram of Abundance & Sacred Infinity
    doc.circle(cx, cy, 65, 'S');
    doc.setDrawColor(WM_GOLD);
    const rInf = 22;
    doc.circle(cx - rInf, cy, rInf, 'S');
    doc.circle(cx + rInf, cy, rInf, 'S');
    const starR = 48;
    doc.rect(cx - starR * 0.7, cy - starR * 0.7, starR * 1.4, starR * 1.4);
  } else if (styleCycle === 4) {
    // Celestial Zodiac Wheel
    doc.circle(cx, cy, 66, 'S');
    doc.circle(cx, cy, 58, 'S');
    for (let i = 0; i < 12; i++) {
      const ang = (i * 2 * Math.PI) / 12;
      doc.line(cx + 42 * Math.cos(ang), cy + 42 * Math.sin(ang), cx + 58 * Math.cos(ang), cy + 58 * Math.sin(ang));
    }
  } else if (styleCycle === 5) {
    // Solomon's Seal & Eye of Providence
    doc.circle(cx, cy, 66, 'S');
    doc.circle(cx, cy, 60, 'S');
    doc.setDrawColor(WM_GOLD);
    for (let a = 0; a < 360; a += 30) {
      const rad = (a * Math.PI) / 180;
      doc.line(cx + 24 * Math.cos(rad), cy + 24 * Math.sin(rad), cx + 58 * Math.cos(rad), cy + 58 * Math.sin(rad));
    }
  } else {
    // Sacred Lotus & Sunburst of Gratitude
    doc.circle(cx, cy, 68, 'S');
    doc.circle(cx, cy, 56, 'S');
    doc.setDrawColor(WM_GOLD);
    for (let i = 0; i < 24; i++) {
      const ang = (i * 2 * Math.PI) / 24;
      const inR = i % 2 === 0 ? 30 : 38;
      doc.line(cx + inR * Math.cos(ang), cy + inR * Math.sin(ang), cx + 56 * Math.cos(ang), cy + 56 * Math.sin(ang));
    }
  }
};
