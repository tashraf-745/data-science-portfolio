/* A quiet, original decorative backdrop — a dense ring of thin radiating
   spokes, inspired by (not copied from) radial "sunburst" data art. Fully
   deterministic (two combined sine waves drive the length variation) so the
   page renders the same way every time, with no runtime randomness. */
function buildAmbientBackground() {
  const svg = document.getElementById('ambient-bg-svg');
  if (!svg) return;

  const size = 1000;
  const cx = size / 2;
  const cy = size / 2;
  const innerRadius = 36;
  const spokeCount = 170;

  const lines = [];
  for (let i = 0; i < spokeCount; i += 1) {
    const angle = (360 / spokeCount) * i;
    const length = 170 + 150 * Math.abs(Math.sin(i * 0.37)) + 95 * Math.abs(Math.sin(i * 0.13 + 1.1));
    const color = i % 3 === 0 ? 'var(--teal-dark)' : 'var(--accent)';
    lines.push(
      `<line x1="${cx}" y1="${cy - innerRadius}" x2="${cx}" y2="${cy - innerRadius - length}" ` +
      `stroke="${color}" stroke-width="2" stroke-linecap="round" ` +
      `transform="rotate(${angle} ${cx} ${cy})"></line>`
    );
  }

  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.innerHTML = lines.join('');
}

document.addEventListener('DOMContentLoaded', buildAmbientBackground);
