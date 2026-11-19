/* Hero headline: letters assemble from scattered positions, then the
   accent color sweeps through the three clauses on a continuous loop.
   The h1 keeps its real text content (and an aria-label matching it) so
   search engines and screen readers see the actual headline regardless
   of how this decorates it; the generated spans are aria-hidden. */
(function () {
  var SENTENCES = [
    'Finding signal in the noise.',
    'Building models that matter.',
    'Explaining results so everyone gets it.',
  ];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function makeChar(ch) {
    var charEl = document.createElement('span');
    charEl.className = 'hero-char';
    charEl.textContent = ch;
    if (!reduced) {
      var angle = Math.random() * Math.PI * 2;
      var dist = 90 + Math.random() * 200;
      charEl.style.setProperty('--dx', (Math.cos(angle) * dist).toFixed(0) + 'px');
      charEl.style.setProperty('--dy', (Math.sin(angle) * dist).toFixed(0) + 'px');
      charEl.style.setProperty('--rot', (Math.random() * 140 - 70).toFixed(0) + 'deg');
      charEl.style.transitionDelay = Math.round(Math.random() * 500) + 'ms';
    }
    return charEl;
  }

  function run() {
    var el = document.getElementById('hero-title');
    if (!el) return;

    var inner = document.createElement('span');
    inner.className = 'hero-assemble';
    inner.setAttribute('aria-hidden', 'true');

    // Each sentence is its own block (one line), and within a sentence each
    // WORD is its own atomic inline-block of letters — real space
    // characters sit between word spans, not inside them, so if a sentence
    // ever has to wrap on a narrow screen it wraps at a word boundary, not
    // mid-word (letters are individual inline-blocks for the fly-in effect,
    // which otherwise gives the browser no concept of "word" to wrap by).
    var segEls = SENTENCES.map(function (sentence) {
      var segEl = document.createElement('span');
      segEl.className = 'hero-seg';
      var words = sentence.split(' ');
      words.forEach(function (word, wordIdx) {
        var wordEl = document.createElement('span');
        wordEl.className = 'hero-word';
        word.split('').forEach(function (ch) {
          wordEl.appendChild(makeChar(ch));
        });
        segEl.appendChild(wordEl);
        if (wordIdx < words.length - 1) segEl.appendChild(document.createTextNode(' '));
      });
      inner.appendChild(segEl);
      return segEl;
    });

    el.textContent = '';
    el.appendChild(inner);

    function startSweep() {
      var i = 0;
      function step() {
        segEls.forEach(function (s) { s.classList.remove('hero-seg--active'); });
        segEls[i % segEls.length].classList.add('hero-seg--active');
        i += 1;
      }
      step();
      setInterval(step, 900);
    }

    if (reduced) {
      inner.classList.add('assembled');
      startSweep();
      return;
    }

    // two animation frames, not one reflow read: removing then instantly
    // re-adding a class in the same tick can get coalesced by the browser
    // into a single style recalculation that never visibly commits the
    // "before" state, so the transition never (re)starts.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        inner.classList.add('assembled');
        setTimeout(startSweep, 1500);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', run);
})();
