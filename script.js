/* ==========================================================================
   Thirukkural Interactive Story Engine - 13-Scene Cinematic Sequence
   Metaphor: Seed Comfort Zone -> Decision -> Obstacle -> Failure -> Persistence -> Breakthrough -> Tree
   Pure Vanilla JS (No External Libraries)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- ACOUSTIC SOUND SYNTHESIZER ---
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type, duration, gainVal = 0.1) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio tone error:', e);
    }
  }

  function playClickSound() { playTone(392, 'sine', 0.12, 0.12); }
  function playFlipSound() { playTone(329.63, 'triangle', 0.15, 0.18); }
  function playStruggleSound() { playTone(130.81, 'sawtooth', 0.18, 0.2); }
  function playCrackSound() { playTone(523.25, 'triangle', 0.12, 0.18); }

  function playSuccessSound() {
    if (!soundEnabled) return;
    const notes = [392, 493.88, 587.33, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 'sine', 0.4, 0.18);
      }, idx * 110);
    });
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playClickSound();
  });

  // --- TAMIL TEXT TO SPEECH ---
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ta-IN';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  }

  const ttsBtn = document.getElementById('tts-btn');
  const speakNarrativeBtn = document.getElementById('speak-narrative-btn');

  ttsBtn.addEventListener('click', () => {
    const activeText = narrativeTextEl.textContent + ". " + narrativeSubtextEl.textContent;
    speakText(activeText);
  });

  speakNarrativeBtn.addEventListener('click', () => {
    const activeText = narrativeTextEl.textContent + ". " + narrativeSubtextEl.textContent;
    speakText(activeText);
  });


  // --- NAVIGATION TAB ENGINE ---
  const navStoryBtn = document.getElementById('nav-story-btn');
  const navKuralBtn = document.getElementById('nav-kural-btn');
  const navGameBtn = document.getElementById('nav-game-btn');

  const storySection = document.getElementById('story-section');
  const kuralSection = document.getElementById('kural-section');
  const gameSection = document.getElementById('game-section');

  function showTab(tabName) {
    playClickSound();
    navStoryBtn.classList.remove('active');
    navKuralBtn.classList.remove('active');
    navGameBtn.classList.remove('active');

    if (tabName === 'story') {
      navStoryBtn.classList.add('active');
      storySection.scrollIntoView({ behavior: 'smooth' });
    } else if (tabName === 'kural') {
      navKuralBtn.classList.add('active');
      kuralSection.scrollIntoView({ behavior: 'smooth' });
    } else if (tabName === 'game') {
      navGameBtn.classList.add('active');
      gameSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navStoryBtn.addEventListener('click', () => showTab('story'));
  navKuralBtn.addEventListener('click', () => showTab('kural'));
  navGameBtn.addEventListener('click', () => showTab('game'));

  document.getElementById('start-story-btn').addEventListener('click', () => {
    showTab('story');
    startAutoPlay();
  });

  document.getElementById('quick-game-btn').addEventListener('click', () => showTab('game'));
  document.getElementById('goto-game-btn').addEventListener('click', () => showTab('game'));
  document.getElementById('learn-kural-btn').addEventListener('click', () => showTab('kural'));


  // --- 13-SCENE CINEMATIC TIMELINE DATA ---
  const storyScenes = [
    {
      id: 1,
      title: "1. Comfort Zone (சௌகரியமான சூழல்)",
      text: '"Comfort Zone — இங்கேயே இருந்தால் பாதுகாப்பாக இருக்கலாம்..."',
      subtext: "விதை மண்ணுக்குள் அமைதியாகவும் பாதுகாப்பாகவும் இருந்தது.",
      posClass: "pos-underground",
      crack: false,
      rain: false,
      rocks: false,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 2,
      title: "2. The Desire to Grow (வளர வேண்டும் எனும் ஆசை)",
      text: '"இங்கேயே இருந்தால் பாதுகாப்பு... ஆனால் வளர வேண்டும்."',
      subtext: "சூரிய ஒளிக்கதிர் மண்ணில் பாய்கிறது. விதை விழித்துக் கொள்கிறது.",
      posClass: "pos-underground",
      crack: true,
      choiceOverlay: true,
      rain: false,
      rocks: false,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 3,
      title: "3. The First Attempt (முதல் முயற்சி)",
      text: '"முதல் முயற்சி: தண்டு மேலே நகரத் தொடங்கியது."',
      subtext: "வேர்கள் கீழ்நோக்கியும், தண்டு மேல்நோக்கியும் நகரத் தொடங்கியது.",
      posClass: "pos-pushing",
      crack: true,
      rain: true,
      rocks: false,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 4,
      title: "4. The First Obstacle (முதல் தடை)",
      text: '"தடை. பாறை வழியை மறித்தது."',
      subtext: "இயற்கையான பெரிய பாறை தண்டு மேலே செல்வதைத் தடுத்தது.",
      posClass: "pos-struggling",
      crack: true,
      rain: false,
      rocks: true,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 5,
      title: "5. Failure (தற்காலிகத் தடை)",
      text: '"முடியவில்லை... முயற்சி தற்காலிகமாகத் தடுத்தது."',
      subtext: "தண்டு சற்று பின்வாங்கியது. வெளிச்சம் குறைந்தது.",
      posClass: "pos-struggling",
      crack: true,
      rain: false,
      rocks: true,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 6,
      title: "6. The Decision (முடிவு எடுத்தல்)",
      text: '"மீண்டும் முயற்சி. தளர்ச்சி அடையாதே!"',
      subtext: "சூரிய வெளிச்சத்தின் அழைப்பைக் கண்டு விதை மீண்டும் தள்ளத் தொடங்கியது.",
      posClass: "pos-struggling",
      crack: true,
      rain: false,
      rocks: true,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 7,
      title: "7. Multiple Attempts (தொடர் முயற்சிகள்)",
      text: '"01 ➔ 02 ➔ 03 ➔ 04: இடைவிடாத முயற்சி."',
      subtext: "மீண்டும் மீண்டும் முயன்று பாறையைச் சுற்றி வழி கண்டுபிடித்தது!",
      posClass: "pos-struggling",
      crack: true,
      tryOverlay: true,
      rocks: true,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 8,
      title: "8. Breaking the Comfort Zone (எல்லையை உடைத்தல்)",
      text: '"சௌகரிய மண்டலத்தை உடைத்தல்: மண் பிளந்தது!"',
      subtext: "மண்ணின் மேல் அடுக்கை தண்டு பிளக்கத் தொடங்கியது.",
      posClass: "pos-sprout",
      crack: true,
      rain: false,
      rocks: false,
      leaves: 0,
      tree: false,
      split: false
    },
    {
      id: 9,
      title: "9. Breakthrough (வெளி உலகப் பிரவேசம்)",
      text: '"Comfort Zone → Growth: சூரிய வெளிச்சம் பாய்ந்தது!"',
      subtext: "மண்ணை பிளந்து வெளி உலகிற்கு வந்து பிரகாசமான வெளிச்சத்தைக் கண்டது!",
      posClass: "pos-sprout",
      crack: true,
      rain: false,
      rocks: false,
      leaves: 1,
      tree: false,
      split: false
    },
    {
      id: 10,
      title: "10. First Breath of Freedom (சுதந்திரக் காற்று)",
      text: '"சுதந்திரக் காற்று: கஷ்டப்பட்டது வீண்போகவில்லை!"',
      subtext: "இளந்தளிர் காற்றில் மெதுவாக அசைந்தாடியது.",
      posClass: "pos-sprout",
      crack: true,
      rain: false,
      rocks: false,
      leaves: 1,
      tree: false,
      split: false
    },
    {
      id: 11,
      title: "11. Time-Lapse Growth (கால வளர்ச்சி)",
      text: '"வளர்ச்சி: சிறு விதை இப்போது பெரு மரமானது!"',
      subtext: "முயற்சியின் பலனால் செடி வளர்ந்து கம்பீரமான மரமானது.",
      posClass: "pos-tree",
      crack: true,
      rain: false,
      rocks: false,
      leaves: 1,
      tree: true,
      split: false
    },
    {
      id: 12,
      title: "12. Visualize the Comfort Zone (சௌகரிய ஒப்பீடு)",
      text: '"வசதியில் இருப்பது பாதுகாப்பாக இருக்கலாம். ஆனால் வளர்ச்சிக்கு முயற்சி தேவை."',
      subtext: "மண்ணுக்குள் விதையாக இருப்பது பாதுகாப்பு | வெளியே வந்ததால் மரமானது!",
      posClass: "pos-tree",
      crack: true,
      rain: false,
      rocks: false,
      leaves: 1,
      tree: true,
      split: true
    },
    {
      id: 13,
      title: "13. Connect to Thirukkural (குறளுடன் இணைப்பு)",
      text: '"அருமை உடைத்தென்று அசாவாமை வேண்டும் - பெருமை முயற்சி தரும்."',
      subtext: "கஷ்டம் வந்தாலும் முயற்சியை விட்டுவிடாதே. இடைவிடாத முயற்சியே பெருமை தரும்!",
      posClass: "pos-tree",
      crack: true,
      rain: false,
      rocks: false,
      leaves: 1,
      tree: true,
      split: false
    }
  ];

  let currentSceneIdx = 0;
  let tryStep = 0;
  let autoPlayTimer = null;
  let isAutoPlaying = false;

  // DOM Elements
  const sceneCounterEl = document.getElementById('scene-counter');
  const sceneTitleEl = document.getElementById('scene-title');
  const storyProgressBar = document.getElementById('story-progress-bar');
  const narrativeTextEl = document.getElementById('narrative-text');
  const narrativeSubtextEl = document.getElementById('narrative-subtext');
  const characterWrapper = document.getElementById('character-wrapper');
  
  // SVG Character Elements
  const seedCrack = document.getElementById('seed-crack');
  const leafLeft = document.getElementById('leaf-left');
  const leafRight = document.getElementById('leaf-right');
  const treeCanopy = document.getElementById('tree-canopy');
  const rootLeft = document.getElementById('root-left');
  const rootRight = document.getElementById('root-right');

  // Stage Overlays
  const skyLayer = document.getElementById('sky-layer');
  const rainContainer = document.getElementById('rain-container');
  const rocksContainer = document.getElementById('rocks-container');
  const choiceContainer = document.getElementById('choice-container');
  const tryContainer = document.getElementById('try-container');
  const splitComparison = document.getElementById('split-comparison');

  // Nav Controls
  const prevSceneBtn = document.getElementById('prev-scene-btn');
  const nextSceneBtn = document.getElementById('next-scene-btn');
  const autoplayBtn = document.getElementById('autoplay-btn');
  const sceneDotsContainer = document.getElementById('scene-dots');
  const storyEndCta = document.getElementById('story-end-cta');

  // Generate Navigation Dots
  storyScenes.forEach((scene, index) => {
    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.title = scene.title;
    dot.addEventListener('click', () => {
      stopAutoPlay();
      goToScene(index);
    });
    sceneDotsContainer.appendChild(dot);
  });

  // Rain Drops Generation
  for (let i = 0; i < 20; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDelay = `${Math.random() * 0.8}s`;
    drop.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;
    rainContainer.appendChild(drop);
  }

  function renderScene(idx) {
    const scene = storyScenes[idx];
    currentSceneIdx = idx;

    // Header & Progress
    sceneCounterEl.textContent = `காட்சி ${scene.id < 10 ? '0' + scene.id : scene.id} / 13`;
    sceneTitleEl.textContent = scene.title;
    storyProgressBar.style.width = `${((idx + 1) / storyScenes.length) * 100}%`;

    // Narrative Text
    narrativeTextEl.textContent = scene.text;
    narrativeSubtextEl.textContent = scene.subtext;

    // Character position & Crack line
    characterWrapper.className = `character-wrapper ${scene.posClass}`;
    if (scene.crack && seedCrack) {
      seedCrack.style.opacity = '1';
    } else if (seedCrack) {
      seedCrack.style.opacity = '0';
    }

    // Sky & Weather
    if (scene.rain) {
      rainContainer.style.opacity = '1';
      skyLayer.style.background = 'linear-gradient(180deg, #1A130F 0%, #2B1B14 100%)';
    } else if (scene.id >= 8) {
      rainContainer.style.opacity = '0';
      skyLayer.style.background = 'linear-gradient(180deg, #5C4A3E 0%, #3B2E26 60%, #2B1B14 100%)';
    } else {
      rainContainer.style.opacity = '0';
      skyLayer.style.background = 'linear-gradient(180deg, #1C110C 0%, #2B1B14 100%)';
    }

    // Rocks Obstacles
    if (scene.rocks) {
      rocksContainer.style.opacity = '1';
    } else {
      rocksContainer.style.opacity = '0';
    }

    // Choice Overlay (Scene 2)
    if (scene.choiceOverlay) {
      choiceContainer.classList.remove('hidden');
    } else {
      choiceContainer.classList.add('hidden');
    }

    // Try Overlay (Scene 7)
    if (scene.tryOverlay) {
      tryContainer.classList.remove('hidden');
      resetTrySequence();
    } else {
      tryContainer.classList.add('hidden');
    }

    // Split Comparison Overlay (Scene 12)
    if (scene.split && splitComparison) {
      splitComparison.classList.remove('hidden');
    } else if (splitComparison) {
      splitComparison.classList.add('hidden');
    }

    // Leaf & Tree SVG growth
    const seedShellLeft = document.getElementById('seed-shell-left');
    const seedShellRight = document.getElementById('seed-shell-right');
    const stemPath = document.getElementById('stem-path');

    if (scene.leaves > 0) {
      leafLeft.setAttribute('transform', 'translate(100, 70) scale(1)');
      leafRight.setAttribute('transform', 'translate(100, 70) scale(1)');
    } else {
      leafLeft.setAttribute('transform', 'translate(100, 70) scale(0)');
      leafRight.setAttribute('transform', 'translate(100, 70) scale(0)');
    }

    if (scene.tree) {
      treeCanopy.setAttribute('transform', 'translate(100, 20) scale(1.5)');
      if (seedShellLeft) seedShellLeft.style.transform = 'rotate(-20deg)';
      if (seedShellRight) seedShellRight.style.transform = 'rotate(20deg)';
      if (stemPath) {
        stemPath.setAttribute('stroke-width', '8');
        stemPath.setAttribute('stroke', '#6B4636');
      }
      if (idx === 10) playSuccessSound();
    } else {
      treeCanopy.setAttribute('transform', 'translate(100, 20) scale(0)');
      if (seedShellLeft) seedShellLeft.style.transform = 'rotate(0deg)';
      if (seedShellRight) seedShellRight.style.transform = 'rotate(0deg)';
      if (stemPath) {
        stemPath.setAttribute('stroke-width', '5');
        stemPath.setAttribute('stroke', '#557A46');
      }
    }

    // Root expansion
    if (scene.id >= 3) {
      rootLeft.setAttribute('d', 'M 100 160 Q 60 185 40 210');
      rootRight.setAttribute('d', 'M 100 160 Q 140 185 160 210');
    } else {
      rootLeft.setAttribute('d', 'M 100 160 Q 80 175 70 190');
      rootRight.setAttribute('d', 'M 100 160 Q 120 175 130 190');
    }

    // Update Dots UI
    const dots = sceneDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === idx) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    // Nav Buttons
    prevSceneBtn.disabled = (idx === 0);
    if (idx === storyScenes.length - 1) {
      nextSceneBtn.textContent = 'முடிவு (Finish) →';
      storyEndCta.classList.remove('hidden');
    } else {
      nextSceneBtn.textContent = 'அடுத்த காட்சி →';
      storyEndCta.classList.add('hidden');
    }
  }

  function goToScene(idx) {
    if (idx >= 0 && idx < storyScenes.length) {
      playClickSound();
      renderScene(idx);
    }
  }

  // Auto-Play Engine
  function startAutoPlay() {
    isAutoPlaying = true;
    autoplayBtn.textContent = '⏸️ நிறுத்து (Pause)';
    autoplayBtn.classList.add('btn-heritage-gold');
    
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      if (currentSceneIdx < storyScenes.length - 1) {
        goToScene(currentSceneIdx + 1);
      } else {
        stopAutoPlay();
      }
    }, 2800);
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    autoplayBtn.textContent = '▶️ திரைப்படக் காட்சி (Auto-Play)';
    autoplayBtn.classList.remove('btn-heritage-gold');
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  autoplayBtn.addEventListener('click', () => {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  prevSceneBtn.addEventListener('click', () => {
    stopAutoPlay();
    goToScene(currentSceneIdx - 1);
  });

  nextSceneBtn.addEventListener('click', () => {
    stopAutoPlay();
    if (currentSceneIdx === storyScenes.length - 1) {
      showTab('kural');
    } else {
      goToScene(currentSceneIdx + 1);
    }
  });

  // Scene 2 Choice Buttons
  document.getElementById('choice-stay-btn').addEventListener('click', () => {
    playClickSound();
    narrativeTextEl.textContent = '"இங்கேயே இருந்தால் மரமாக முடியாது!"';
    narrativeSubtextEl.textContent = 'விதையே, வெளியே செல்ல முயற்சி செய்து வளர்!';
  });

  document.getElementById('choice-grow-btn').addEventListener('click', () => {
    playSuccessSound();
    goToScene(2);
  });

  // Scene 7 Try Sequence Handler (01 -- 02 -- 03 -- 04)
  const pushEffortBtn = document.getElementById('push-effort-btn');
  const try1Num = document.getElementById('try-1');
  const try2Num = document.getElementById('try-2');
  const try3Num = document.getElementById('try-3');
  const try4Num = document.getElementById('try-4');

  function resetTrySequence() {
    tryStep = 0;
    try1Num.className = 'step-num';
    try2Num.className = 'step-num';
    try3Num.className = 'step-num';
    try4Num.className = 'step-num';
    pushEffortBtn.innerHTML = '<span>கடினமான மண்ணைப் பிளந்து முயல்</span> <span>→</span>';
    pushEffortBtn.disabled = false;
  }

  pushEffortBtn.addEventListener('click', () => {
    tryStep++;
    if (tryStep === 1) {
      playStruggleSound();
      try1Num.className = 'step-num active-step';
      characterWrapper.style.transform = 'translateX(-54%) rotate(-4deg)';
      setTimeout(() => characterWrapper.style.transform = 'translateX(-50%) rotate(0deg)', 300);
      narrativeTextEl.textContent = '"முயற்சி 01: கடினமான கல் தடுத்தது... ஆனால் விதை நிற்கவில்லை!"';
    } else if (tryStep === 2) {
      playStruggleSound();
      try2Num.className = 'step-num active-step';
      characterWrapper.style.transform = 'translateX(-46%) rotate(4deg)';
      setTimeout(() => characterWrapper.style.transform = 'translateX(-50%) rotate(0deg)', 300);
      narrativeTextEl.textContent = '"முயற்சி 02: மண் அடர்த்தியாக இருந்தது..."';
    } else if (tryStep === 3) {
      playCrackSound();
      try3Num.className = 'step-num active-step';
      document.getElementById('rock-top').style.transform = 'translateY(-10px) scale(0.9)';
      narrativeTextEl.textContent = '"முயற்சி 03: கல்லில் விரிசல் விழுந்தது! இன்னும் கொஞ்சம் முயற்சி!"';
      pushEffortBtn.innerHTML = '<span>இறுதி முயற்சி! மண்ணைப் பிளந்து செல்</span> <span>→</span>';
    } else if (tryStep >= 4) {
      playSuccessSound();
      try4Num.className = 'step-num active-step';
      document.getElementById('rock-top').style.transform = 'translateY(-40px) scale(0.5)';
      document.getElementById('rock-top').style.opacity = '0';
      pushEffortBtn.innerHTML = '<span>வெற்றி! வெளியே செல்!</span>';
      pushEffortBtn.disabled = true;
      narrativeTextEl.textContent = '"தொடர்ந்து முயன்றதால் விதை மண்ணைப் பிளந்து வெளியே வந்தது!"';
      
      setTimeout(() => {
        goToScene(7); // advance to Scene 8
      }, 1200);
    }
  });

  // --- INTERACTIVE QUESTION MINI-MODULE ---
  const optGiveup = document.getElementById('opt-giveup');
  const optTryagain = document.getElementById('opt-tryagain');
  const choiceFeedback = document.getElementById('choice-feedback');

  optGiveup.addEventListener('click', () => {
    playClickSound();
    choiceFeedback.classList.remove('hidden');
    choiceFeedback.textContent = '❌ தவறான முடிவு! குறள் சொல்வது: கஷ்டம் வந்ததும் சோர்ந்து போகக் கூடாது.';
  });

  optTryagain.addEventListener('click', () => {
    playSuccessSound();
    choiceFeedback.classList.remove('hidden');
    choiceFeedback.textContent = '✨ சரியான முடிவு! "பெருமை முயற்சி தரும்!" - தொடர்ந்து முயன்றால் வெற்றி நிச்சயம்!';
    setTimeout(() => {
      showTab('story');
      goToScene(6);
    }, 1500);
  });


  // --- FLASH CARD GAME ENGINE ---
  const flashCardsData = [
    { id: 1, q: "விதை முதலில் எங்கே இருந்தது?", a: "மண்ணுக்குள் இருந்தது." },
    { id: 2, q: "மண்ணுக்குள் இருப்பது விதைக்கு எப்படி இருந்தது?", a: "பாதுகாப்பாகவும் சௌகரியமாகவும் இருந்தது." },
    { id: 3, q: "விதை ஏன் வெளியே வர முயன்றது?", a: "வளர்ந்து செடியாக வேண்டும் என்பதால்." },
    { id: 4, q: "விதைக்கு என்ன கஷ்டம் வந்தது?", a: "கடினமான மண்ணும் கற்களும் தடையாக இருந்தன." },
    { id: 5, q: "கஷ்டம் வந்ததும் விதை என்ன செய்தது?", a: "முயற்சியை விடாமல் மீண்டும் முயன்றது." },
    { id: 6, q: "விதை வெளியே வந்த பிறகு என்ன ஆனது?", a: "அது செடியாகவும் பின்னர் மரமாகவும் வளர்ந்தது." },
    { id: 7, q: "விதை நமக்கு என்ன கற்றுக்கொடுக்கிறது?", a: "கஷ்டம் வந்தாலும் முயற்சியை விடக்கூடாது." },
    { id: 8, q: "இந்தக் குறளின் முக்கிய பாடம் என்ன?", a: "தொடர்ந்து முயன்றால் வெற்றி கிடைக்கும்." }
  ];

  let activeCardIndex = 0;
  let score = 0;
  let userAnswers = new Array(flashCardsData.length).fill(null);

  const flashCard = document.getElementById('flash-card');
  const cardNumFront = document.getElementById('card-num-front');
  const cardNumBack = document.getElementById('card-num-back');
  const cardQuestionEl = document.getElementById('card-question');
  const cardAnswerEl = document.getElementById('card-answer');

  const currentScoreEl = document.getElementById('current-score');
  const totalCardsEl = document.getElementById('total-cards');
  const cardProgressTextEl = document.getElementById('card-progress-text');

  const btnAnswerWrong = document.getElementById('btn-answer-wrong');
  const btnAnswerCorrect = document.getElementById('btn-answer-correct');
  const cardThumbsGrid = document.getElementById('card-thumbs-grid');

  const gameResultsModal = document.getElementById('game-results');
  const finalScoreVal = document.getElementById('final-score-val');
  const resultsMessageEl = document.getElementById('results-message');

  totalCardsEl.textContent = flashCardsData.length;

  // Generate Thumbnails
  flashCardsData.forEach((card, idx) => {
    const thumb = document.createElement('div');
    thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
    thumb.textContent = idx < 9 ? `0${idx + 1}` : idx + 1;
    thumb.addEventListener('click', () => loadCard(idx));
    cardThumbsGrid.appendChild(thumb);
  });

  // Flip Card Handler
  flashCard.addEventListener('click', () => {
    playFlipSound();
    flashCard.classList.toggle('flipped');
  });

  function loadCard(idx) {
    if (idx < 0 || idx >= flashCardsData.length) return;
    playClickSound();

    activeCardIndex = idx;
    flashCard.classList.remove('flipped');

    const card = flashCardsData[idx];
    cardNumFront.textContent = `#0${card.id}`;
    cardNumBack.textContent = `#0${card.id}`;
    cardQuestionEl.textContent = card.q;
    cardAnswerEl.textContent = card.a;

    cardProgressTextEl.textContent = `கார்டு 0${idx + 1} / 0${flashCardsData.length}`;

    // Update Thumbs UI
    const thumbs = cardThumbsGrid.querySelectorAll('.thumb-item');
    thumbs.forEach((thumb, i) => {
      thumb.className = 'thumb-item';
      if (userAnswers[i] === true) thumb.classList.add('correct');
      if (userAnswers[i] === false) thumb.classList.add('wrong');
      if (i === idx) thumb.classList.add('active');
    });
  }

  function handleAnswer(isCorrect) {
    playClickSound();
    if (userAnswers[activeCardIndex] === null) {
      if (isCorrect) score++;
    } else if (userAnswers[activeCardIndex] === false && isCorrect) {
      score++;
    } else if (userAnswers[activeCardIndex] === true && !isCorrect) {
      score = Math.max(0, score - 1);
    }

    userAnswers[activeCardIndex] = isCorrect;
    currentScoreEl.textContent = score;

    if (activeCardIndex < flashCardsData.length - 1) {
      setTimeout(() => loadCard(activeCardIndex + 1), 300);
    } else {
      const allAnswered = userAnswers.every(ans => ans !== null);
      if (allAnswered || activeCardIndex === flashCardsData.length - 1) {
        setTimeout(showGameResults, 500);
      }
    }
  }

  btnAnswerCorrect.addEventListener('click', (e) => {
    e.stopPropagation();
    handleAnswer(true);
  });

  btnAnswerWrong.addEventListener('click', (e) => {
    e.stopPropagation();
    handleAnswer(false);
  });

  function showGameResults() {
    playSuccessSound();
    finalScoreVal.textContent = score;

    if (score === flashCardsData.length) {
      resultsMessageEl.textContent = "🌳 அருமை! நீங்கள் விதையைப் போல முயற்சியைக் கைவிடவில்லை!";
    } else if (score >= 5) {
      resultsMessageEl.textContent = "✨ மிக நன்று! நல்ல முயற்சி! தொடர்ந்து குறளைப் பயிலுங்கள்.";
    } else {
      resultsMessageEl.textContent = "🌱 நன்று! மீண்டும் ஒருமுறை கதையைப் படித்து விளையாடிப் பாருங்கள்.";
    }

    gameResultsModal.classList.remove('hidden');
  }

  document.getElementById('replay-game-btn').addEventListener('click', () => {
    playClickSound();
    score = 0;
    userAnswers.fill(null);
    currentScoreEl.textContent = '0';
    gameResultsModal.classList.add('hidden');
    loadCard(0);
  });

  document.getElementById('replay-story-btn').addEventListener('click', () => {
    gameResultsModal.classList.add('hidden');
    showTab('story');
    goToScene(0);
  });

  // --- INITIAL START ---
  renderScene(0);
  loadCard(0);

});
