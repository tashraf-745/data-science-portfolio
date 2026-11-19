/* Radial "skills spiral", styled after a paper-cut radial bar chart:
   - petals swept past 360deg so the spiral visibly coils past its own start
   - each petal sits in a slightly larger white "slot" (the paper-cutout groove)
   - color bands aren't per-petal — they're shared concentric rings that every
     petal crosses, so the checker pattern lines up across the whole chart
   - a subtle turbulence-noise filter adds paper grain over the whole chart
   Label text is counter-rotated by the negative of the petal's own rotation
   so it stays upright regardless of position (see buildSkillsChart below). */
function buildSkillsChart() {
  const svg = document.getElementById('skills-chart');
  if (!svg) return;

  const detailPanel = document.getElementById('skill-detail');
  const detailDefault = document.getElementById('skill-detail-default');
  const detailName = document.getElementById('skill-name');
  const detailCategory = document.getElementById('skill-category');
  const detailDesc = document.getElementById('skill-desc');
  const chartWrap = document.getElementById('chart-wrap');
  const tooltip = document.getElementById('skill-tooltip');

  const size = 1120; // wide enough that even the longest label ("Statistical Modeling") clears the edge
  const cx = size / 2;
  const cy = size / 2;
  const petalWidth = 40;
  const slotPad = 6;       // slot is wider than the petal on each side
  const slotTipExtend = 8; // slot reaches a little past the petal's tip
  const ringWidth = 48;    // shared concentric ring thickness (the checker rhythm)
  const startAngle = -15;
  const totalSweep = 384;  // > 360 so the spiral coils past its own start, ~24deg seam gap
  const step = totalSweep / (SKILLS.length - 1);
  const labelGap = 18;

  const defs = `
    <defs>
      <pattern id="dotTexture" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="2.5" r="1.3" fill="rgba(255,255,255,0.6)"></circle>
      </pattern>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" result="noise"></feTurbulence>
        <feColorMatrix in="noise" type="saturate" values="0"></feColorMatrix>
      </filter>
    </defs>`;

  /* Slice a [r0, r1] range at the shared ring boundaries so every petal's
     checker texture lines up on the same concentric rings, rather than each
     petal banding independently. Alternating ring segments use the same tier
     color at reduced opacity rather than a second color, so the three tiers
     stay visually distinct from each other. */
  function ringSegments(r0, r1) {
    const segs = [];
    let cursor = r0;
    let k = Math.floor(r0 / ringWidth);
    while (cursor < r1) {
      const ringEnd = (Math.floor(cursor / ringWidth) + 1) * ringWidth;
      const next = Math.min(ringEnd, r1);
      segs.push({ r0: cursor, r1: next, k });
      cursor = next;
      k += 1;
    }
    return segs;
  }

  const petalsMarkup = SKILLS.map((skill, i) => {
    const angle = startAngle + i * step;
    const cat = CATEGORIES[skill.category];
    const length = skill.length;
    const x = cx - petalWidth / 2;
    const clipId = `petalClip-${i}`;

    const slotX = cx - (petalWidth + slotPad * 2) / 2;
    const slotY = cy - (length + slotTipExtend);
    const slotW = petalWidth + slotPad * 2;
    const slotH = length + slotTipExtend;

    /* Three synthetic, illustrative tiers (not measured data) — see
       TIER_SPLITS in data.js. tierColors run darkest-to-lightest outward. */
    const tierColors = [cat.base, cat.tip, cat.pale];
    let tierStart = 0;
    const bandsMarkup = TIER_SPLITS.map((split, tierIdx) => {
      const tierEnd = length * split;
      const segs = ringSegments(tierStart, tierEnd);
      const isLastTier = tierIdx === TIER_SPLITS.length - 1;
      const markup = segs.map((seg, segIdx) => {
        const h = seg.r1 - seg.r0;
        const yTop = cy - seg.r1;
        const faded = seg.k % 2 === 1;
        const isTipSeg = isLastTier && segIdx === segs.length - 1;
        const dotsOverlay = isTipSeg && skill.dots
          ? `<rect x="${x}" y="${yTop}" width="${petalWidth}" height="${h}" fill="url(#dotTexture)"></rect>`
          : '';
        return `<rect x="${x}" y="${yTop}" width="${petalWidth}" height="${h}" style="fill:${tierColors[tierIdx]}" ${faded ? 'opacity="0.72"' : ''}></rect>${dotsOverlay}`;
      }).join('');
      tierStart = tierEnd;
      return markup;
    }).join('');

    /* Labels read outward along their own bar's radial direction, rather than
       sitting horizontally — a horizontal label is as wide as its text, which
       at this density clips neighboring bars; a radial label stays inside its
       own bar's angular corridor by construction. Flip to anchor="end" with a
       +90deg local turn on the left half of the circle so the text is never
       upside down. */
    const labelR = cy - (length + labelGap);
    const normAngle = ((angle % 360) + 360) % 360;
    const flip = normAngle > 90 && normAngle < 270;
    const localTurn = flip ? 90 : -90;
    const labelAnchor = flip ? 'end' : 'start';

    return `
      <g class="petal" tabindex="0" role="button" aria-label="${skill.name} skill" data-index="${i}"
         transform="rotate(${angle} ${cx} ${cy})">
        <rect class="petal-slot" x="${slotX}" y="${slotY}" width="${slotW}" height="${slotH}" rx="${slotW / 2}"></rect>
        <clipPath id="${clipId}">
          <rect x="${x}" y="${cy - length}" width="${petalWidth}" height="${length}" rx="${petalWidth / 2}"></rect>
        </clipPath>
        <g clip-path="url(#${clipId})">${bandsMarkup}</g>
        <rect class="petal-ring" x="${x}" y="${cy - length}" width="${petalWidth}" height="${length}" rx="${petalWidth / 2}"></rect>
        <text class="petal-label" x="${cx}" y="${labelR}" dy="0.32em" text-anchor="${labelAnchor}"
              transform="rotate(${localTurn} ${cx} ${labelR})">${skill.name}</text>
        <circle class="petal-tip-anchor" cx="${cx}" cy="${cy - length}" r="1"></circle>
      </g>`;
  }).join('');

  const hub = `<circle class="chart-hub" cx="${cx}" cy="${cy}" r="30"></circle>`;
  const grainOverlay = `<rect class="chart-grain" x="0" y="0" width="${size}" height="${size}" filter="url(#grain)"></rect>`;

  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.innerHTML = defs + petalsMarkup + hub + grainOverlay;

  const petals = Array.from(svg.querySelectorAll('.petal'));
  let pinnedIndex = null;

  function paintActive(index) {
    petals.forEach((p, i) => p.classList.toggle('is-active', i === index));
  }

  /* Position the floating tooltip above the hovered petal's actual tip.
     A tiny circle (rotation-invariant bounding box, unlike a rotated rect)
     marks the tip in SVG space; its real screen position after the chart's
     CSS scaling is read back with getBoundingClientRect(). */
  function showTooltip(index) {
    const skill = SKILLS[index];
    const anchor = petals[index].querySelector('.petal-tip-anchor');
    const anchorBox = anchor.getBoundingClientRect();
    const wrapBox = chartWrap.getBoundingClientRect();
    tooltip.textContent = skill.name;
    tooltip.hidden = false;
    const left = anchorBox.left + anchorBox.width / 2 - wrapBox.left;
    const top = anchorBox.top - wrapBox.top;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  function showDetail(index) {
    const skill = SKILLS[index];
    const cat = CATEGORIES[skill.category];
    detailDefault.hidden = true;
    detailPanel.hidden = false;
    detailName.textContent = skill.name;
    detailCategory.textContent = cat.label;
    detailCategory.style.color = cat.base;
    detailDesc.textContent = skill.description;
  }

  function clearDetail() {
    detailPanel.hidden = true;
    detailDefault.hidden = false;
    paintActive(null);
    hideTooltip();
  }

  petals.forEach((petal, i) => {
    petal.addEventListener('mouseenter', () => { paintActive(i); showDetail(i); showTooltip(i); });
    petal.addEventListener('focus', () => { paintActive(i); showDetail(i); showTooltip(i); });
    petal.addEventListener('mouseleave', () => {
      if (pinnedIndex === null) clearDetail();
      else { paintActive(pinnedIndex); showDetail(pinnedIndex); showTooltip(pinnedIndex); }
    });
    petal.addEventListener('click', () => {
      pinnedIndex = pinnedIndex === i ? null : i;
      if (pinnedIndex === null) clearDetail();
      else { paintActive(i); showDetail(i); showTooltip(i); }
    });
    petal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); petal.click(); }
    });
  });

  /* The tooltip's position is read from the page's current layout, so a
     pinned tooltip goes stale if the viewport is resized (orientation
     change, window resize) while it's showing. */
  window.addEventListener('resize', () => {
    if (pinnedIndex !== null && !tooltip.hidden) showTooltip(pinnedIndex);
  });
}

document.addEventListener('DOMContentLoaded', buildSkillsChart);
