import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */
interface PlantDef {
  id: string;
  name: string;
  emoji: string;
  days: number;
  points: number;
  color: string;
  accent: string;
  description: string;
}
interface ActivePlant {
  defId: string;
  progress: number;
  plantedAt: number;
  wateredToday: number;
  lastWaterDate: string;
}
interface MissionDef {
  id: string;
  label: string;
  desc: string;
  emoji: string;
  target: number;
  reward: string;
  rewardType: "points" | "water" | "badge";
  rewardAmount: number;
}
interface RewardDef {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  trigger: (stats: HarvestStats) => boolean;
  badge?: string;
}
interface HarvestStats {
  totalHarvests: number;
  byPlant: Record<string, number>;
  streak: number;
  totalPoints: number;
}
interface GameState {
  activePlants: (ActivePlant | null)[];
  water: number;
  points: number;
  lastDailyClaim: string;
  lastWaterRegen: number;
  totalHarvests: number;
  byPlant: Record<string, number>;
  streak: number;
  lastHarvestDate: string;
  unlockedRewards: string[];
  completedMissions: string[];
  redeemedRewards: string[];
  xp: number;
  gems: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */
const PLANT_DEFS: PlantDef[] = [
  {
    id: "talas",
    name: "Talas Bogor",
    emoji: "🌿",
    days: 7,
    points: 50,
    color: "#22c55e",
    accent: "#15803d",
    description: "Cepat tumbuh",
  },
  {
    id: "pala",
    name: "Pala Premium",
    emoji: "🌰",
    days: 14,
    points: 120,
    color: "#f97316",
    accent: "#c2410c",
    description: "Poin tertinggi",
  },
  {
    id: "jambu",
    name: "Jambu Kristal",
    emoji: "🍐",
    days: 10,
    points: 80,
    color: "#eab308",
    accent: "#a16207",
    description: "Seimbang",
  },
];

const MISSIONS: MissionDef[] = [
  {
    id: "m1",
    label: "Panen Pertama",
    desc: "Panen tanaman pertamamu",
    emoji: "🌾",
    target: 1,
    reward: "+30 Poin",
    rewardType: "points",
    rewardAmount: 30,
  },
  {
    id: "m2",
    label: "Petani Rajin",
    desc: "Panen 3x berturut-turut",
    emoji: "🔥",
    target: 3,
    reward: "+5 Air",
    rewardType: "water",
    rewardAmount: 5,
  },
  {
    id: "m3",
    label: "Master Talas",
    desc: "Panen Talas Bogor 5x",
    emoji: "🌿",
    target: 5,
    reward: "+100 Poin",
    rewardType: "points",
    rewardAmount: 100,
  },
  {
    id: "m4",
    label: "Pala Hunter",
    desc: "Panen Pala Premium 3x",
    emoji: "🌰",
    target: 3,
    reward: "+80 Poin",
    rewardType: "points",
    rewardAmount: 80,
  },
  {
    id: "m5",
    label: "Jambu Lover",
    desc: "Panen Jambu Kristal 4x",
    emoji: "🍐",
    target: 4,
    reward: "+60 Poin",
    rewardType: "points",
    rewardAmount: 60,
  },
  {
    id: "m6",
    label: "Panen 10x",
    desc: "Capai total 10 kali panen",
    emoji: "🏆",
    target: 10,
    reward: "+200 Poin",
    rewardType: "points",
    rewardAmount: 200,
  },
  {
    id: "m7",
    label: "Kolektor Poin",
    desc: "Kumpulkan total 500 Daya Poin",
    emoji: "💰",
    target: 500,
    reward: "+10 Air",
    rewardType: "water",
    rewardAmount: 10,
  },
];

const REWARDS: RewardDef[] = [
  {
    id: "r1",
    emoji: "🎁",
    title: "Cashback 10%",
    desc: "Cashback 10% untuk pembelian pertama",
    trigger: (s) => s.totalHarvests >= 1,
  },
  {
    id: "r2",
    emoji: "🚚",
    title: "Gratis Ongkir",
    desc: "Gratis ongkos kirim seluruh Indonesia",
    trigger: (s) => s.totalHarvests >= 3,
  },
  {
    id: "r3",
    emoji: "💸",
    title: "Diskon 20%",
    desc: "Diskon 20% untuk semua produk Bogor",
    trigger: (s) => (s.byPlant.talas || 0) >= 3,
  },
  {
    id: "r4",
    emoji: "🔥",
    title: "Flash Sale Akses",
    desc: "Akses eksklusif flash sale 1 jam lebih awal",
    trigger: (s) => s.streak >= 3,
  },
  {
    id: "r5",
    emoji: "💎",
    title: "Cashback 50%",
    desc: "Cashback 50% khusus produk lokal Bogor",
    trigger: (s) => (s.byPlant.talas || 0) >= 5,
  },
  {
    id: "r6",
    emoji: "🛍️",
    title: "Diskon 35%",
    desc: "Diskon 35% min. belanja Rp150.000",
    trigger: (s) => s.totalPoints >= 500,
  },
  {
    id: "r7",
    emoji: "🎀",
    title: "Member Premium",
    desc: "Upgrade ke member Premium 30 hari GRATIS",
    trigger: (s) => s.totalHarvests >= 10,
  },
  {
    id: "r8",
    emoji: "🏅",
    title: "Voucher Rp25.000",
    desc: "Voucher belanja senilai Rp25.000",
    trigger: (s) => (s.byPlant.pala || 0) >= 3,
  },
];

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2500];
const LEVEL_NAMES = [
  "Petani Baru",
  "Petani Muda",
  "Petani Aktif",
  "Petani Hebat",
  "Master Tani",
  "Grand Farmer",
  "Legenda Kebun",
];

const SLOTS = 3;
const MAX_WATER = 12;
const WATER_REGEN_MS = 60_000;
const WATER_BOOST = 8;
const MAX_WATER_PER_DAY = 2;
const PROGRESS_TICK_MS = 3_000;
const DAILY_WATER_BONUS = 5;
const XP_PER_HARVEST = 30;

const DEFAULT_STATE: GameState = {
  activePlants: [null, null, null],
  water: 5,
  points: 0,
  lastDailyClaim: "",
  lastWaterRegen: Date.now(),
  totalHarvests: 0,
  byPlant: {},
  streak: 0,
  lastHarvestDate: "",
  unlockedRewards: [],
  completedMissions: [],
  redeemedRewards: [],
  xp: 0,
  gems: 0,
};

const today = () => new Date().toDateString();

function loadState(): GameState {
  try {
    const r = localStorage.getItem("hb_v5");
    if (!r) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(r) };
  } catch {
    return DEFAULT_STATE;
  }
}
function saveState(s: GameState) {
  localStorage.setItem("hb_v5", JSON.stringify(s));
}

function getLevel(xp: number) {
  let l = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) l = i;
  }
  return l;
}
function getLevelProgress(xp: number) {
  const l = getLevel(xp);
  const lo = LEVEL_THRESHOLDS[l];
  const hi = LEVEL_THRESHOLDS[l + 1] || lo + 500;
  return Math.min(100, Math.round(((xp - lo) / (hi - lo)) * 100));
}

/* ═══════════════════════════════════════════════════════════════════════════
   SOUNDS
═══════════════════════════════════════════════════════════════════════════ */
const mkCtx = () =>
  new (window.AudioContext || (window as any).webkitAudioContext)();
function playWater() {
  try {
    const c = mkCtx(),
      o = c.createOscillator(),
      g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.frequency.setValueAtTime(880, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.3);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
    o.start();
    o.stop(c.currentTime + 0.35);
  } catch {}
}
function playHarvest() {
  try {
    const c = mkCtx();
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = c.createOscillator(),
        g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.frequency.value = f;
      g.gain.setValueAtTime(0.13, c.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(
        0.001,
        c.currentTime + i * 0.12 + 0.3,
      );
      o.start(c.currentTime + i * 0.12);
      o.stop(c.currentTime + i * 0.12 + 0.3);
    });
  } catch {}
}
function playPlant() {
  try {
    const c = mkCtx(),
      o = c.createOscillator(),
      g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.frequency.setValueAtTime(330, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(660, c.currentTime + 0.2);
    g.gain.setValueAtTime(0.07, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
    o.start();
    o.stop(c.currentTime + 0.25);
  } catch {}
}
function playUnlock() {
  try {
    const c = mkCtx();
    [660, 880, 1100, 1320].forEach((f, i) => {
      const o = c.createOscillator(),
        g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.12, c.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(
        0.001,
        c.currentTime + i * 0.1 + 0.25,
      );
      o.start(c.currentTime + i * 0.1);
      o.stop(c.currentTime + i * 0.1 + 0.25);
    });
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════════════════════════════ */
function ConfettiBlast({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    const pts = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.width,
      y: -20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 5 + 2,
      col: [
        "#22c55e",
        "#eab308",
        "#f97316",
        "#60a5fa",
        "#f472b6",
        "#a78bfa",
        "#fbbf24",
      ][Math.floor(Math.random() * 7)],
      sz: Math.random() * 11 + 4,
      rot: Math.random() * 360,
      rs: (Math.random() - 0.5) * 14,
    }));
    let fr = 0,
      raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14;
        p.rot += p.rs;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.sz / 2, -p.sz / 2, p.sz, p.sz);
        ctx.restore();
      });
      if (++fr < 140) raf = requestAnimationFrame(tick);
      else onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLANT SVG
═══════════════════════════════════════════════════════════════════════════ */
function PlantSVG({
  progress,
  defId,
  size = 130,
}: {
  progress: number;
  defId: string;
  size?: number;
}) {
  const isH = progress >= 100,
    isR = progress >= 80,
    isM = progress >= 50,
    isE = progress >= 20,
    isS = progress < 5;
  const pal: Record<string, any> = {
    talas: {
      stem: "#16a34a",
      ld: "#15803d",
      ll: "#4ade80",
      f: "#166534",
      fg: "#86efac",
    },
    pala: {
      stem: "#b45309",
      ld: "#15803d",
      ll: "#4ade80",
      f: "#b45309",
      fg: "#fcd34d",
    },
    jambu: {
      stem: "#65a30d",
      ld: "#16a34a",
      ll: "#a3e635",
      f: "#ca8a04",
      fg: "#fde047",
    },
  };
  const p = pal[defId] || pal.talas;
  const lm = isH ? "#f59e0b" : isR ? "#a3e635" : p.ld,
    lmi = isH ? "#fbbf24" : isR ? "#4ade80" : p.ll,
    sc = isH ? "#ca8a04" : p.stem,
    fc = isH ? "#fbbf24" : p.f;
  const gY = 118,
    sH = isH ? 66 : isR ? 60 : isM ? 50 : isE ? 34 : 12,
    sT = gY - sH;
  return (
    <svg
      viewBox="0 0 130 130"
      width={size}
      height={size}
      style={{ overflow: "visible", display: "block" }}
    >
      {isR && (
        <ellipse
          cx="65"
          cy={sT + sH / 2}
          rx={isH ? 50 : 36}
          ry={isH ? 50 : 36}
          fill={isH ? "#fbbf2444" : p.fg + "33"}
          style={{ animation: "glowPulse 1.8s ease-in-out infinite" }}
        />
      )}
      <ellipse
        cx="65"
        cy={gY + 12}
        rx="34"
        ry="8"
        fill="#92400e"
        opacity="0.22"
      />
      <ellipse
        cx="65"
        cy={gY + 8}
        rx="24"
        ry="5"
        fill="#a16207"
        opacity="0.28"
      />
      {isS && (
        <ellipse
          cx="65"
          cy={gY + 2}
          rx="8"
          ry="5"
          fill="#a16207"
          opacity="0.75"
        />
      )}
      {!isE && !isS && (
        <>
          <ellipse
            cx="65"
            cy={gY + 2}
            rx="7"
            ry="4.5"
            fill="#a16207"
            opacity="0.6"
          />
          <line
            x1="65"
            y1={gY + 2}
            x2="65"
            y2={sT}
            stroke={p.stem}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="65"
            cy={sT - 4}
            rx="5"
            ry="4"
            fill={p.ll}
            opacity="0.85"
          />
        </>
      )}
      {isE && !isM && (
        <>
          <line
            x1="65"
            y1={gY}
            x2="65"
            y2={sT}
            stroke={sc}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="50"
            cy={sT + 10}
            rx="13"
            ry="6.5"
            fill={lm}
            transform={`rotate(-35 50 ${sT + 10})`}
          />
          <ellipse
            cx="80"
            cy={sT + 10}
            rx="13"
            ry="6.5"
            fill={lm}
            transform={`rotate(35 80 ${sT + 10})`}
          />
          <line
            x1="50"
            y1={sT + 10}
            x2="62"
            y2={sT + 10}
            stroke="#fff"
            strokeWidth="0.8"
            opacity="0.4"
          />
          <ellipse
            cx="65"
            cy={sT - 4}
            rx="6"
            ry="4.5"
            fill={lmi}
            opacity="0.9"
          />
        </>
      )}
      {isM && !isR && (
        <>
          <line
            x1="65"
            y1={gY}
            x2="65"
            y2={sT}
            stroke={sc}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="40"
            cy={sT + 18}
            rx="18"
            ry="9"
            fill={lm}
            transform={`rotate(-45 40 ${sT + 18})`}
          />
          <ellipse
            cx="90"
            cy={sT + 18}
            rx="18"
            ry="9"
            fill={lm}
            transform={`rotate(45 90 ${sT + 18})`}
          />
          <ellipse
            cx="46"
            cy={sT + 4}
            rx="14"
            ry="7"
            fill={lmi}
            opacity="0.88"
            transform={`rotate(-22 46 ${sT + 4})`}
          />
          <ellipse
            cx="84"
            cy={sT + 4}
            rx="14"
            ry="7"
            fill={lmi}
            opacity="0.88"
            transform={`rotate(22 84 ${sT + 4})`}
          />
          <ellipse
            cx="65"
            cy={sT - 7}
            rx="9"
            ry="8"
            fill={p.f}
            opacity="0.85"
          />
          <ellipse
            cx="61"
            cy={sT - 11}
            rx="3.5"
            ry="2.5"
            fill="#fff"
            opacity="0.25"
          />
        </>
      )}
      {isR && !isH && (
        <>
          <line
            x1="65"
            y1={gY}
            x2="65"
            y2={sT}
            stroke={sc}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <ellipse
            cx="34"
            cy={sT + 20}
            rx="22"
            ry="11"
            fill={lm}
            transform={`rotate(-48 34 ${sT + 20})`}
          />
          <ellipse
            cx="96"
            cy={sT + 20}
            rx="22"
            ry="11"
            fill={lm}
            transform={`rotate(48 96 ${sT + 20})`}
          />
          <ellipse
            cx="43"
            cy={sT + 5}
            rx="16"
            ry="8"
            fill={lmi}
            opacity="0.9"
            transform={`rotate(-24 43 ${sT + 5})`}
          />
          <ellipse
            cx="87"
            cy={sT + 5}
            rx="16"
            ry="8"
            fill={lmi}
            opacity="0.9"
            transform={`rotate(24 87 ${sT + 5})`}
          />
          <ellipse cx="65" cy={sT - 13} rx="14" ry="13" fill={fc} />
          <ellipse
            cx="65"
            cy={sT - 13}
            rx="14"
            ry="13"
            fill="none"
            stroke={p.f}
            strokeWidth="1.5"
          />
          <ellipse
            cx="60"
            cy={sT - 18}
            rx="5"
            ry="3"
            fill="#fff"
            opacity="0.28"
          />
        </>
      )}
      {isH && (
        <>
          <line
            x1="65"
            y1={gY}
            x2="65"
            y2={sT}
            stroke="#ca8a04"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="30"
            cy={sT + 22}
            rx="25"
            ry="13"
            fill="#f59e0b"
            transform={`rotate(-50 30 ${sT + 22})`}
          />
          <ellipse
            cx="100"
            cy={sT + 22}
            rx="25"
            ry="13"
            fill="#f59e0b"
            transform={`rotate(50 100 ${sT + 22})`}
          />
          <ellipse
            cx="40"
            cy={sT + 5}
            rx="17"
            ry="9"
            fill="#fbbf24"
            opacity="0.9"
            transform={`rotate(-26 40 ${sT + 5})`}
          />
          <ellipse
            cx="90"
            cy={sT + 5}
            rx="17"
            ry="9"
            fill="#fbbf24"
            opacity="0.9"
            transform={`rotate(26 90 ${sT + 5})`}
          />
          <ellipse
            cx="65"
            cy={sT - 16}
            rx="17"
            ry="16"
            fill="#fbbf24"
            style={{ animation: "glowPulse 1.5s ease-in-out infinite" }}
          />
          <ellipse
            cx="65"
            cy={sT - 16}
            rx="17"
            ry="16"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />
          <ellipse
            cx="58"
            cy={sT - 22}
            rx="6"
            ry="4"
            fill="#fff"
            opacity="0.32"
          />
          {(
            [
              [-22, -18],
              [22, -18],
              [-28, 0],
              [28, 0],
            ] as [number, number][]
          ).map(([dx, dy], i) => (
            <text
              key={i}
              x={65 + dx}
              y={sT - 16 + dy}
              fontSize="10"
              textAnchor="middle"
              fill="#fde047"
              style={{
                animation: `sparkle ${0.7 + i * 0.3}s ease-in-out infinite alternate`,
              }}
            >
              ✦
            </text>
          ))}
        </>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HARVEST MODAL (NEW — replaces instant popup)
═══════════════════════════════════════════════════════════════════════════ */
interface HarvestResult {
  def: PlantDef;
  points: number;
  newRewards: RewardDef[];
  completedMissions: MissionDef[];
  levelUp?: { from: number; to: number };
  streakBonus?: number;
}
function HarvestModal({
  result,
  onClose,
}: {
  result: HarvestResult;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const hasExtras =
    result.newRewards.length > 0 ||
    result.completedMissions.length > 0 ||
    result.levelUp ||
    result.streakBonus;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 32,
          padding: 0,
          overflow: "hidden",
          maxWidth: 420,
          width: "92%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          animation: "modalIn 0.4s cubic-bezier(0.34,1.4,0.64,1) forwards",
        }}
      >
        {/* Green header */}
        <div
          style={{
            background: "linear-gradient(135deg,#16a34a,#15803d)",
            padding: "28px 28px 24px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.15),transparent 70%)",
            }}
          />
          <div
            style={{
              fontSize: 72,
              lineHeight: 1,
              marginBottom: 8,
              position: "relative",
              animation: "bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {result.def.emoji}
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 26,
              fontWeight: 900,
              color: "#fff",
              position: "relative",
            }}
          >
            Panen Berhasil!
          </div>
          <div style={{ color: "#bbf7d0", fontSize: 14, position: "relative" }}>
            {result.def.name}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px" }}>
          {step === 0 && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              {/* Points earned */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                  border: "1.5px solid #86efac",
                  borderRadius: 16,
                  padding: "16px 20px",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}
                  >
                    Daya Poin Diperoleh
                  </div>
                  <div
                    style={{ fontSize: 28, fontWeight: 900, color: "#14532d" }}
                  >
                    +{result.points} 🪙
                  </div>
                  <div style={{ fontSize: 11, color: "#4ade80" }}>
                    = Rp{result.points} diskon belanja
                  </div>
                </div>
                <div style={{ fontSize: 40 }}>💰</div>
              </div>

              {/* Streak bonus */}
              {(result.streakBonus || 0) > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "linear-gradient(135deg,#fff7ed,#fed7aa)",
                    border: "1.5px solid #fb923c",
                    borderRadius: 14,
                    padding: "12px 16px",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 28 }}>🔥</span>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#c2410c",
                      }}
                    >
                      Streak Bonus ×{result.streakBonus}
                    </div>
                    <div style={{ fontSize: 11, color: "#ea580c" }}>
                      Panen {result.streakBonus} hari berturut-turut!
                    </div>
                  </div>
                </div>
              )}

              {/* XP gained */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                  border: "1.5px solid #c4b5fd",
                  borderRadius: 14,
                  padding: "12px 16px",
                  marginBottom: hasExtras ? 12 : 0,
                }}
              >
                <span style={{ fontSize: 24 }}>⭐</span>
                <div>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9" }}
                  >
                    +{XP_PER_HARVEST} XP
                  </div>
                  <div style={{ fontSize: 11, color: "#7c3aed" }}>
                    Level progress meningkat
                  </div>
                </div>
              </div>

              {hasExtras && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#fffbeb,#fef9c3)",
                    border: "1px solid #fde047",
                    fontSize: 12,
                    color: "#92400e",
                    fontWeight: 600,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setStep(1)}
                >
                  ✨ Ada{" "}
                  {result.newRewards.length +
                    result.completedMissions.length +
                    (result.levelUp ? 1 : 0)}{" "}
                  hadiah menunggumu! Lihat →
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 14,
                }}
              >
                🎁 Kamu Mendapatkan:
              </div>

              {result.levelUp && (
                <div
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                    borderRadius: 16,
                    padding: "16px 18px",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 32 }}>🏅</span>
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}
                    >
                      Level Up!
                    </div>
                    <div style={{ fontSize: 12, color: "#ddd6fe" }}>
                      {LEVEL_NAMES[result.levelUp.from]} →{" "}
                      <strong style={{ color: "#fde047" }}>
                        {LEVEL_NAMES[result.levelUp.to]}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {result.completedMissions.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                    border: "1.5px solid #86efac",
                    borderRadius: 14,
                    padding: "12px 16px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#15803d",
                      }}
                    >
                      Misi Selesai: {m.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#4ade80" }}>
                      {m.reward}
                    </div>
                  </div>
                  <span style={{ fontSize: 18 }}>✅</span>
                </div>
              ))}

              {result.newRewards.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "linear-gradient(135deg,#fffbeb,#fef9c3)",
                    border: "1.5px solid #fbbf24",
                    borderRadius: 14,
                    padding: "12px 16px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{r.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#92400e",
                      }}
                    >
                      Reward Baru: {r.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#b45309" }}>
                      {r.desc}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      background: "#fbbf24",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 99,
                      fontWeight: 700,
                    }}
                  >
                    BARU
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {step === 0 && hasExtras && (
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 14,
                  border: "1.5px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Lihat Hadiah 🎁
              </button>
            )}
            {step === 1 && (
              <button
                onClick={() => setStep(0)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 14,
                  border: "1.5px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ← Kembali
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 15,
                background: "linear-gradient(135deg,#fb923c,#f97316)",
                color: "#fff",
                boxShadow: "0 6px 20px rgba(249,115,22,0.4)",
                transition: "all 0.2s ease",
              }}
            >
              OK, Lanjut Bertani! 🌾
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SAWAH PLOT CARD
═══════════════════════════════════════════════════════════════════════════ */
function SawahPlot({
  index,
  plant,
  def,
  state,
  onPlant,
  onWater,
  onHarvest,
  selecting,
  setSelecting,
}: {
  index: number;
  plant: ActivePlant | null;
  def: PlantDef | null;
  state: GameState;
  onPlant: (i: number, id: string) => void;
  onWater: (i: number) => void;
  onHarvest: (i: number) => void;
  selecting: number | null;
  setSelecting: (v: number | null) => void;
}) {
  const [waterDrops, setWaterDrops] = useState(false);
  const [hvAnim, setHvAnim] = useState(false);
  const wd = plant?.lastWaterDate ?? "";
  const wToday = wd === today() ? (plant?.wateredToday ?? 0) : 0;
  const prog = plant ? Math.min(100, plant.progress) : 0;
  const canWater =
    !!plant &&
    plant.progress < 100 &&
    state.water >= 1 &&
    wToday < MAX_WATER_PER_DAY;
  const canHarvest = !!plant && prog >= 100;
  const stageLabel = !plant
    ? "Belum Ditanam"
    : prog >= 100
      ? "✨ Siap Panen!"
      : prog >= 80
        ? "🌾 Menguning"
        : prog >= 50
          ? "🌿 Subur"
          : prog >= 20
            ? "🌱 Tumbuh"
            : "🌱 Benih";
  const stageColor = !plant
    ? "#94a3b8"
    : prog >= 100
      ? "#f97316"
      : prog >= 80
        ? "#fb923c"
        : prog >= 50
          ? "#fbbf24"
          : prog >= 20
            ? "#f59e0b"
            : "#94a3b8";
  const barGrad =
    prog >= 100
      ? "linear-gradient(90deg,#f97316,#f59e0b)"
      : prog >= 80
        ? "linear-gradient(90deg,#fb923c,#fbbf24)"
        : prog >= 50
          ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
          : "linear-gradient(90deg,#fed7aa,#fbbf24)";
  const skyBg =
    prog >= 100
      ? "linear-gradient(180deg,#fffbeb 0%,#fef9c3 40%,transparent 100%)"
      : prog >= 80
        ? "linear-gradient(180deg,#fefce8 0%,#f0fdf4 40%,transparent 100%)"
        : prog >= 50
          ? "linear-gradient(180deg,#f0fdf4 0%,#ecfdf5 40%,transparent 100%)"
          : "linear-gradient(180deg,#f8fafc 0%,#f1f5f9 40%,transparent 100%)";

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          borderRadius: 24,
          overflow: "visible",
          background: "#fff",
          border: `2px solid ${canHarvest ? "#fbbf24" : def ? def.color + "55" : "#e2e8f0"}`,
          boxShadow: canHarvest
            ? "0 0 0 4px rgba(251,191,36,0.18),0 8px 36px rgba(251,191,36,0.28)"
            : "0 4px 24px rgba(0,0,0,0.08)",
          transition: "all 0.4s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: def
                  ? `linear-gradient(135deg,${def.color}20,${def.accent}25)`
                  : "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              {def ? def.emoji : "🪴"}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
                {def ? def.name : `Lahan ${index + 1}`}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: stageColor }}>
                {stageLabel}
              </div>
            </div>
          </div>
          {def && (
            <div
              style={{
                background: `linear-gradient(135deg,${def.color}20,${def.accent}20)`,
                border: `1px solid ${def.color}55`,
                borderRadius: 99,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: def.accent,
              }}
            >
              🪙 {def.points}
            </div>
          )}
        </div>

        {/* Field visual */}
        <div
          style={{
            margin: "0 14px",
            borderRadius: 18,
            overflow: "hidden",
            position: "relative",
            height: 210,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: skyBg }} />
          {prog >= 70 && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 18,
                width: prog >= 100 ? 34 : 26,
                height: prog >= 100 ? 34 : 26,
                borderRadius: "50%",
                background: prog >= 100 ? "#fbbf24" : "#fde68a",
                boxShadow: prog >= 100 ? "0 0 20px #fbbf2488" : "none",
                transition: "all 0.5s ease",
                animation:
                  prog >= 100 ? "glowPulse 2s ease-in-out infinite" : "none",
              }}
            />
          )}
          {prog > 20 && prog < 80 && (
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 14,
                display: "flex",
              }}
            >
              {[18, 24, 16].map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: s,
                    height: s,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.65)",
                    marginLeft: i === 0 ? 0 : -9,
                  }}
                />
              ))}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 56,
              background: "linear-gradient(180deg,#a16207 0%,#78350f 100%)",
              opacity: 0.18,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
              background:
                "repeating-linear-gradient(90deg,transparent,transparent 14px,rgba(120,53,15,0.06) 14px,rgba(120,53,15,0.06) 15px)",
            }}
          />
          {[20, 45, 72].map((x, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 0,
                left: `${x}%`,
                width: 2,
                height: 50,
                background:
                  "linear-gradient(180deg,transparent,rgba(147,197,253,0.3))",
                opacity: 0.5,
              }}
            />
          ))}
          {[8, 18, 72, 82, 90].map((x, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 48,
                left: `${x}%`,
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
              }}
            >
              {[7, 11, 8].map((h, j) => (
                <div
                  key={j}
                  style={{
                    width: 2.5,
                    height: h,
                    borderRadius: "2px 2px 0 0",
                    background: prog > 30 ? "#4ade80" : "#9ca3af",
                    opacity: 0.55,
                    transform: `rotate(${(j - 1) * 14}deg)`,
                    transition: "background 1.5s ease",
                  }}
                />
              ))}
            </div>
          ))}
          {waterDrops &&
            [38, 52, 66].map((x, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: 16,
                  fontSize: 18,
                  animation: `waterDrop 0.7s ${i * 0.12}s ease-out forwards`,
                  opacity: 0,
                }}
              >
                💧
              </div>
            ))}
          {canHarvest && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 200,
                height: 100,
                background:
                  "radial-gradient(ellipse at top,rgba(251,191,36,0.45) 0%,transparent 70%)",
                animation: "glowPulse 2s ease-in-out infinite",
              }}
            />
          )}
          {!plant && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 36, opacity: 0.18 }}>🌾</div>
              <div
                style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}
              >
                Lahan kosong
              </div>
            </div>
          )}
          {plant && def && (
            <div
              style={{
                position: "absolute",
                bottom: 36,
                left: "50%",
                transform: "translateX(-50%)",
                transition: "all 0.9s cubic-bezier(0.34,1.15,0.64,1)",
                filter: canHarvest
                  ? `drop-shadow(0 0 14px ${def.color}99)`
                  : "none",
              }}
            >
              <PlantSVG progress={prog} defId={def.id} size={135} />
            </div>
          )}
          {plant && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 99,
                  padding: "3px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: stageColor,
                  border: `1px solid ${stageColor}44`,
                }}
              >
                {prog >= 100
                  ? "✨ PANEN!"
                  : prog >= 80
                    ? "🌾 Hampir"
                    : prog >= 50
                      ? "🌿 Subur"
                      : prog >= 20
                        ? "🌱 Tumbuh"
                        : "🌱 Benih"}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 99,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 800,
                  color: stageColor,
                  border: `1px solid ${stageColor}44`,
                }}
              >
                {Math.round(prog)}%
              </div>
            </>
          )}
        </div>

        {/* Progress bar */}
        {plant && (
          <div style={{ padding: "10px 18px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
                fontSize: 11,
                color: "#64748b",
              }}
            >
              <span>Progress Panen</span>
              <span style={{ fontWeight: 700, color: stageColor }}>
                {Math.round(prog)}%
              </span>
            </div>
            <div
              style={{
                height: 9,
                background: "#e2e8f0",
                borderRadius: 99,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${prog}%`,
                  borderRadius: 99,
                  background: barGrad,
                  transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.45) 50%,transparent 100%)",
                  animation: "shimmerBar 2s infinite",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                fontSize: 10,
                color: "#94a3b8",
              }}
            >
              <span>
                Siram: {wToday}/{MAX_WATER_PER_DAY}x
              </span>
              <span>{def?.days}h grow</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: "12px 14px 16px", display: "flex", gap: 8 }}>
          {!plant ? (
            <button
              onClick={() => setSelecting(selecting === index ? null : index)}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 13,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
                fontFamily: "inherit",
                background:
                  selecting === index
                    ? "linear-gradient(135deg,#4ade80,#16a34a)"
                    : "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                color: selecting === index ? "#fff" : "#16a34a",
                boxShadow:
                  selecting === index
                    ? "0 4px 16px rgba(74,222,128,0.4)"
                    : "none",
                transition: "all 0.2s ease",
              }}
            >
              {selecting === index ? "✕ Batal" : "🌱 Pilih Bibit"}
            </button>
          ) : (
            <>
              <button
                disabled={!canWater}
                onClick={() => {
                  if (!canWater) return;
                  setWaterDrops(true);
                  setTimeout(() => setWaterDrops(false), 900);
                  onWater(index);
                  playWater();
                }}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 13,
                  border: "none",
                  cursor: canWater ? "pointer" : "not-allowed",
                  fontWeight: 700,
                  fontSize: 13,
                  fontFamily: "inherit",
                  background: canWater
                    ? "linear-gradient(135deg,#60a5fa,#2563eb)"
                    : "#e2e8f0",
                  color: canWater ? "#fff" : "#94a3b8",
                  boxShadow: canWater
                    ? "0 4px 14px rgba(96,165,250,0.4)"
                    : "none",
                  transition: "all 0.2s ease",
                }}
              >
                💧 Siram
              </button>
              <button
                disabled={!canHarvest}
                onClick={() => {
                  if (!canHarvest) return;
                  setHvAnim(true);
                  setTimeout(() => setHvAnim(false), 300);
                  onHarvest(index);
                }}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 13,
                  border: "none",
                  cursor: canHarvest ? "pointer" : "not-allowed",
                  fontWeight: 700,
                  fontSize: 13,
                  fontFamily: "inherit",
                  background: canHarvest
                    ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                    : "#e2e8f0",
                  color: canHarvest ? "#fff" : "#94a3b8",
                  transform: hvAnim ? "scale(0.93)" : "scale(1)",
                  boxShadow: canHarvest
                    ? "0 4px 16px rgba(251,191,36,0.5)"
                    : "none",
                  animation: canHarvest ? "harvestPulse 2s infinite" : "none",
                  transition: "all 0.18s ease",
                }}
              >
                🧺 Panen
              </button>
            </>
          )}
        </div>
      </div>

      {selecting === index && !plant && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 40,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 14px 48px rgba(0,0,0,0.15)",
            border: "1px solid #e2e8f0",
            padding: 14,
            animation: "dropIn 0.22s ease forwards",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            Pilih Bibit
          </div>
          {PLANT_DEFS.map((pd) => (
            <button
              key={pd.id}
              onClick={() => {
                onPlant(index, pd.id);
                setSelecting(null);
                playPlant();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                marginBottom: 6,
                cursor: "pointer",
                border: `1.5px solid ${pd.color}44`,
                background: `linear-gradient(135deg,${pd.color}11,${pd.accent}08)`,
                fontFamily: "inherit",
                textAlign: "left",
                transition: "all 0.18s ease",
              }}
            >
              <span style={{ fontSize: 22 }}>{pd.emoji}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}
                >
                  {pd.name}
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  {pd.description}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: pd.accent,
                  background: `${pd.color}22`,
                  padding: "3px 8px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                }}
              >
                {pd.days}h · 🪙{pd.points}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REWARDS TAB
═══════════════════════════════════════════════════════════════════════════ */
function RewardsTab({
  state,
  onRedeem,
}: {
  state: GameState;
  onRedeem: (id: string) => void;
}) {
  const stats: HarvestStats = {
    totalHarvests: state.totalHarvests,
    byPlant: state.byPlant,
    streak: state.streak,
    totalPoints: state.points,
  };
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#fef9c3,#fffbeb)",
          borderRadius: 20,
          padding: "18px 20px",
          marginBottom: 20,
          border: "1px solid #fde047",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#92400e",
            marginBottom: 4,
          }}
        >
          🪙 Total Daya Poin
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#78350f" }}>
          {state.points.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: "#b45309" }}>
          Setiap 1 poin = Rp1 diskon saat checkout di aplikasi
        </div>
        <div
          style={{
            marginTop: 10,
            height: 8,
            background: "#fde68a",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, (state.points / 1000) * 100)}%`,
              background: "linear-gradient(90deg,#f59e0b,#d97706)",
              borderRadius: 99,
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: "#b45309", marginTop: 4 }}>
          {state.points}/1000 poin untuk hadiah spesial
        </div>
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: 14,
        }}
      >
        🎁 Reward Tersedia
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {REWARDS.map((r) => {
          const unlocked =
            r.trigger(stats) || state.unlockedRewards.includes(r.id);
          const redeemed = state.redeemedRewards.includes(r.id);
          return (
            <div
              key={r.id}
              style={{
                borderRadius: 18,
                padding: "16px 14px",
                background: unlocked
                  ? "linear-gradient(135deg,#fffbeb,#fef9c3)"
                  : "#f8fafc",
                border: `1.5px solid ${unlocked ? (redeemed ? "#d1fae5" : "#fbbf24") : "#e2e8f0"}`,
                opacity: unlocked ? 1 : 0.55,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {unlocked && !redeemed && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#f97316",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: 99,
                  }}
                >
                  BARU
                </div>
              )}
              {redeemed && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#d1fae5",
                    color: "#15803d",
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: 99,
                  }}
                >
                  DIKLAIM
                </div>
              )}
              <div style={{ fontSize: 32, marginBottom: 8 }}>{r.emoji}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 3,
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {r.desc}
              </div>
              {!unlocked && (
                <div
                  style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}
                >
                  🔒 Penuhi syarat untuk unlock
                </div>
              )}
              <button
                disabled={!unlocked || redeemed}
                onClick={() => {
                  if (unlocked && !redeemed) {
                    onRedeem(r.id);
                    playUnlock();
                  }
                }}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  borderRadius: 10,
                  border: "none",
                  cursor: unlocked && !redeemed ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 12,
                  background: redeemed
                    ? "#d1fae5"
                    : unlocked
                      ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                      : "#e2e8f0",
                  color: redeemed ? "#15803d" : unlocked ? "#fff" : "#94a3b8",
                  boxShadow:
                    unlocked && !redeemed
                      ? "0 4px 14px rgba(251,191,36,0.4)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {redeemed
                  ? "✅ Sudah Diklaim"
                  : unlocked
                    ? "Klaim Sekarang"
                    : "🔒 Terkunci"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MISSIONS TAB
═══════════════════════════════════════════════════════════════════════════ */
function MissionsTab({ state }: { state: GameState }) {
  const getMissionProgress = (m: MissionDef) => {
    if (m.id === "m3") return state.byPlant.talas || 0;
    if (m.id === "m4") return state.byPlant.pala || 0;
    if (m.id === "m5") return state.byPlant.jambu || 0;
    if (m.id === "m2") return state.streak;
    if (m.id === "m7") return state.points;
    return state.totalHarvests;
  };
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
          borderRadius: 20,
          padding: "18px 20px",
          marginBottom: 20,
          border: "1px solid #c4b5fd",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 40 }}>🎯</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>
            Misi Aktif
          </div>
          <div style={{ fontSize: 12, color: "#6d28d9" }}>
            Selesaikan misi untuk bonus ekstra!
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#7c3aed",
              marginTop: 4,
            }}
          >
            {state.completedMissions.length}/{MISSIONS.length} misi selesai
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MISSIONS.map((m) => {
          const cur = getMissionProgress(m);
          const done = state.completedMissions.includes(m.id);
          const pct = Math.min(100, Math.round((cur / m.target) * 100));
          return (
            <div
              key={m.id}
              style={{
                borderRadius: 18,
                padding: "16px 18px",
                background: done
                  ? "linear-gradient(135deg,#f0fdf4,#dcfce7)"
                  : "#fff",
                border: `1.5px solid ${done ? "#86efac" : "#e2e8f0"}`,
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{m.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {m.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      {m.desc}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {done ? (
                    <div
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      ✅ Selesai
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#64748b",
                      }}
                    >
                      {cur}/{m.target}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  height: 8,
                  background: "#f1f5f9",
                  borderRadius: 99,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    borderRadius: 99,
                    background: done
                      ? "linear-gradient(90deg,#4ade80,#22c55e)"
                      : "linear-gradient(90deg,#a78bfa,#7c3aed)",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  {pct}% selesai
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: done ? "#dcfce7" : "#ede9fe",
                    padding: "3px 10px",
                    borderRadius: 99,
                  }}
                >
                  <span style={{ fontSize: 11 }}>🎁</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: done ? "#15803d" : "#6d28d9",
                    }}
                  >
                    {m.reward}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATS TAB
═══════════════════════════════════════════════════════════════════════════ */
function StatsTab({ state }: { state: GameState }) {
  const level = getLevel(state.xp);
  const lvlPct = getLevelProgress(state.xp);
  const nextLvl = LEVEL_THRESHOLDS[level + 1] || LEVEL_THRESHOLDS[level] + 500;
  return (
    <div>
      {/* Level card */}
      <div
        style={{
          background: "linear-gradient(135deg,#6d28d9,#4c1d95)",
          borderRadius: 22,
          padding: "22px 24px",
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            {["🌱", "🌿", "🌾", "🏅", "🥇", "🏆", "👑"][level]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 600 }}>
              Level {level + 1}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
              {LEVEL_NAMES[level]}
            </div>
            <div style={{ fontSize: 11, color: "#a78bfa" }}>
              {state.xp} / {nextLvl} XP
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 8,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${lvlPct}%`,
              background: "linear-gradient(90deg,#c4b5fd,#fde047)",
              borderRadius: 99,
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: "#a78bfa", marginTop: 4 }}>
          {lvlPct}% menuju level berikutnya
        </div>
      </div>

      {/* Harvest stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          {
            icon: "🧺",
            label: "Total Panen",
            val: state.totalHarvests,
            col: "#22c55e",
            bg: "#f0fdf4",
          },
          {
            icon: "🔥",
            label: "Hari Beruntun",
            val: `${state.streak} hari`,
            col: "#f97316",
            bg: "#fff7ed",
          },
          {
            icon: "🪙",
            label: "Total Poin",
            val: state.points.toLocaleString(),
            col: "#f59e0b",
            bg: "#fffbeb",
          },
          {
            icon: "💎",
            label: "Gems",
            val: state.gems,
            col: "#8b5cf6",
            bg: "#ede9fe",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: 16,
              padding: "14px 16px",
              border: `1px solid ${s.col}22`,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: s.col,
                lineHeight: 1,
              }}
            >
              {s.val}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Per-plant stats */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "18px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 14,
          }}
        >
          📊 Panen per Tanaman
        </div>
        {PLANT_DEFS.map((pd) => {
          const cnt = state.byPlant[pd.id] || 0;
          const maxCnt = Math.max(
            ...PLANT_DEFS.map((p) => state.byPlant[p.id] || 0),
            1,
          );
          return (
            <div key={pd.id} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                  fontSize: 12,
                }}
              >
                <span>
                  {pd.emoji} {pd.name}
                </span>
                <span style={{ fontWeight: 700, color: pd.accent }}>
                  {cnt}x panen
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "#f1f5f9",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(cnt / maxCnt) * 100}%`,
                    background: `linear-gradient(90deg,${pd.color},${pd.accent})`,
                    borderRadius: 99,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div
        style={{
          marginTop: 14,
          background: "#fff",
          borderRadius: 18,
          padding: "18px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 14,
          }}
        >
          🏅 Badge Terkumpul
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {state.completedMissions.map((id) => {
            const m = MISSIONS.find((x) => x.id === id);
            return m ? (
              <div
                key={id}
                style={{
                  background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                  border: "1px solid #c4b5fd",
                  borderRadius: 12,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#5b21b6",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{m.emoji}</span>
                {m.label}
              </div>
            ) : null;
          })}
          {state.completedMissions.length === 0 && (
            <div
              style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}
            >
              Belum ada badge. Selesaikan misi!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN GAME
═══════════════════════════════════════════════════════════════════════════ */
export function GamePage() {
  const [state, setState] = useState<GameState>(loadState);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [harvestResult, setHarvestResult] = useState<HarvestResult | null>(
    null,
  );
  const [confetti, setConfetti] = useState(false);
  const [waterCD, setWaterCD] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [started, setStarted] = useState(() => {
    const s = loadState();
    return s.totalHarvests > 0 || s.activePlants.some(Boolean) || s.points > 0;
  });
  const [activeTab, setActiveTab] = useState<
    "farm" | "rewards" | "missions" | "stats"
  >("farm");
  const [toast, setToast] = useState<{ msg: string; emoji: string } | null>(
    null,
  );
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    saveState(state);
  }, [state]);
  useEffect(() => {
    const c = () => setCanClaim(stateRef.current.lastDailyClaim !== today());
    c();
    const t = setInterval(c, 10_000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(
      () =>
        setState((p) => ({
          ...p,
          activePlants: p.activePlants.map((pl) =>
            pl && pl.progress < 100
              ? { ...pl, progress: Math.min(100, pl.progress + 1) }
              : pl,
          ),
        })),
      PROGRESS_TICK_MS,
    );
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      setState((p) => {
        const e = Date.now() - p.lastWaterRegen;
        if (e >= WATER_REGEN_MS && p.water < MAX_WATER)
          return {
            ...p,
            water: Math.min(MAX_WATER, p.water + 1),
            lastWaterRegen: Date.now(),
          };
        return p;
      });
      setWaterCD(() =>
        Math.ceil(
          Math.max(
            0,
            WATER_REGEN_MS - (Date.now() - stateRef.current.lastWaterRegen),
          ) / 1000,
        ),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg: string, emoji: string) => {
    setToast({ msg, emoji });
    setTimeout(() => setToast(null), 2500);
  };

  const handlePlant = useCallback((i: number, id: string) => {
    setState((p) => {
      const ap = [...p.activePlants];
      ap[i] = {
        defId: id,
        progress: 0,
        plantedAt: Date.now(),
        wateredToday: 0,
        lastWaterDate: "",
      };
      return { ...p, activePlants: ap };
    });
  }, []);

  const handleWater = useCallback((i: number) => {
    setState((p) => {
      if (p.water < 1) return p;
      const ap = [...p.activePlants];
      const pl = ap[i];
      if (!pl) return p;
      const wd = pl.lastWaterDate === today() ? pl.wateredToday : 0;
      if (wd >= MAX_WATER_PER_DAY) return p;
      ap[i] = {
        ...pl,
        progress: Math.min(100, pl.progress + WATER_BOOST),
        wateredToday: wd + 1,
        lastWaterDate: today(),
      };
      return { ...p, water: p.water - 1, activePlants: ap };
    });
  }, []);

  const handleHarvest = useCallback((slotIdx: number) => {
    setState((prev) => {
      const ap = [...prev.activePlants];
      const pl = ap[slotIdx];
      if (!pl || pl.progress < 100) return prev;
      const def = PLANT_DEFS.find((d) => d.id === pl.defId);
      if (!def) return prev;
      playHarvest();

      // Streak
      const newStreak =
        prev.lastHarvestDate === today()
          ? prev.streak
          : prev.lastHarvestDate ===
              new Date(Date.now() - 86400000).toDateString()
            ? prev.streak + 1
            : 1;
      const streakBonus = newStreak >= 3 ? newStreak : undefined;

      // XP & Level
      const oldLevel = getLevel(prev.xp);
      const newXp = prev.xp + XP_PER_HARVEST;
      const newLevel = getLevel(newXp);
      const levelUp =
        newLevel > oldLevel ? { from: oldLevel, to: newLevel } : undefined;

      // By-plant counts
      const byPlant = {
        ...prev.byPlant,
        [def.id]: (prev.byPlant[def.id] || 0) + 1,
      };
      const newTotalHarvests = prev.totalHarvests + 1;
      const newPoints = prev.points + def.points + (streakBonus ? 10 : 0);
      const newGems = prev.gems + (newLevel > oldLevel ? 5 : 0);

      // Stats snapshot for trigger checking
      const stats: HarvestStats = {
        totalHarvests: newTotalHarvests,
        byPlant,
        streak: newStreak,
        totalPoints: newPoints,
      };

      // Check new rewards
      const newUnlocked = [...prev.unlockedRewards];
      const newRewards: RewardDef[] = [];
      REWARDS.forEach((r) => {
        if (!prev.unlockedRewards.includes(r.id) && r.trigger(stats)) {
          newUnlocked.push(r.id);
          newRewards.push(r);
        }
      });

      // Check missions
      const newCompleted = [...prev.completedMissions];
      const completedMissions: MissionDef[] = [];
      let bonusPts = 0,
        bonusWater = 0;
      MISSIONS.forEach((m) => {
        if (prev.completedMissions.includes(m.id)) return;
        let cur = 0;
        if (m.id === "m3") cur = byPlant.talas || 0;
        else if (m.id === "m4") cur = byPlant.pala || 0;
        else if (m.id === "m5") cur = byPlant.jambu || 0;
        else if (m.id === "m2") cur = newStreak;
        else if (m.id === "m7") cur = newPoints;
        else cur = newTotalHarvests;
        if (cur >= m.target) {
          newCompleted.push(m.id);
          completedMissions.push(m);
          if (m.rewardType === "points") bonusPts += m.rewardAmount;
          if (m.rewardType === "water") bonusWater += m.rewardAmount;
        }
      });

      if (newRewards.length > 0 || completedMissions.length > 0) playUnlock();

      ap[slotIdx] = null;
      const finalState: GameState = {
        ...prev,
        activePlants: ap,
        points: newPoints + bonusPts,
        water: Math.min(MAX_WATER, prev.water + bonusWater),
        totalHarvests: newTotalHarvests,
        byPlant,
        streak: newStreak,
        lastHarvestDate: today(),
        unlockedRewards: newUnlocked,
        completedMissions: newCompleted,
        xp: newXp,
        gems: newGems,
      };

      setConfetti(true);
      setHarvestResult({
        def,
        points: def.points + (streakBonus ? 10 : 0),
        newRewards,
        completedMissions,
        levelUp,
        streakBonus,
      });
      return finalState;
    });
  }, []);

  const handleClaim = () => {
    if (!canClaim) return;
    setState((p) => ({
      ...p,
      water: Math.min(MAX_WATER, p.water + DAILY_WATER_BONUS),
      lastDailyClaim: today(),
      gems: p.gems + 1,
    }));
    setCanClaim(false);
    showToast(`+${DAILY_WATER_BONUS} Air & +1 Gem diklaim!`, "🎁");
  };

  const handleRedeem = (id: string) => {
    setState((p) => ({ ...p, redeemedRewards: [...p.redeemedRewards, id] }));
    const r = REWARDS.find((x) => x.id === id);
    showToast(`${r?.title} berhasil diklaim!`, "🎁");
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const activeCnt = state.activePlants.filter(Boolean).length;
  const hasReady = state.activePlants.some((p) => p && p.progress >= 100);
  const level = getLevel(state.xp);
  const lvlPct = getLevelProgress(state.xp);
  const unclaimedRewards = REWARDS.filter(
    (r) =>
      state.unlockedRewards.includes(r.id) &&
      !state.redeemedRewards.includes(r.id),
  ).length;
  const pendingMissions = MISSIONS.filter(
    (m) => !state.completedMissions.includes(m.id),
  ).length;

  const TABS = [
    { id: "farm", label: "🌾 Kebun", badge: hasReady ? 1 : 0 },
    { id: "rewards", label: "🎁 Reward", badge: unclaimedRewards },
    { id: "missions", label: "🎯 Misi", badge: 0 },
    { id: "stats", label: "📊 Statistik", badge: 0 },
  ];

  // ─── Landing ────────────────────────────────────────────────────────────────
  if (!started)
    return (
      <>
        <GlobalStyles />
        <div
          className="game-root"
          style={{
            minHeight: "calc(100vh - 92px)",
            paddingTop: "80px",
            paddingBottom: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div
            className="landing-grid"
            style={{
              maxWidth: 1060,
              width: "100%",
              alignItems: "center",
            }}
          >
            <div style={{ animation: "fadeUp 0.6s ease forwards" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 24,
                  background: "linear-gradient(135deg,#fed7aa,#fdba74)",
                  border: "1px solid #fb923c",
                  borderRadius: 99,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#c2410c",
                }}
              >
                ✦ Gamification × Bogor
              </div>
              <h1 style={{ marginBottom: 20 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 54,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Harvest
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 54,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    color: "#1e293b",
                  }}
                >
                  Bogor
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#64748b",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Mini Game Farming
                </span>
              </h1>
              <p
                style={{
                  color: "#64748b",
                  fontSize: 15,
                  lineHeight: 1.75,
                  marginBottom: 28,
                }}
              >
                Tanam, rawat, dan panen tanaman khas Bogor secara virtual!
                <br />
                Kumpulkan{" "}
                <strong style={{ color: "#f59e0b" }}>Daya Poin</strong>,
                selesaikan misi, dan dapatkan reward nyata.
              </p>
              {/* Feature pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 28,
                }}
              >
                {[
                  ["🚚", "Gratis Ongkir"],
                  ["💸", "Cashback 50%"],
                  ["🎁", "Diskon 35%"],
                  ["🏅", "Level Up"],
                  ["🔥", "Streak Bonus"],
                ].map(([e, t]) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 99,
                      padding: "5px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#475569",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span>{e}</span>
                    {t}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                  marginBottom: 32,
                }}
              >
                {[
                  { icon: "☀️", val: SLOTS, label: "Lahan" },
                  { icon: "🎯", val: MISSIONS.length, label: "Misi" },
                  { icon: "🎁", val: REWARDS.length, label: "Reward" },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "14px 10px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 3 }}>
                      {s.icon}
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: "#1e293b",
                        lineHeight: 1,
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStarted(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 32px",
                  borderRadius: 18,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  background: "linear-gradient(135deg,#4ade80,#16a34a)",
                  color: "#fff",
                  boxShadow: "0 8px 28px rgba(74,222,128,0.45)",
                  transition: "all 0.2s ease",
                }}
              >
                🌿 Mulai Bertani →
              </button>
            </div>
            {/* Preview */}
            <div
              style={{
                animation: "fadeUp 0.6s 0.15s ease both",
                position: "relative",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 28,
                  padding: 28,
                  boxShadow: "0 24px 64px rgba(0,0,0,0.09)",
                  border: "1px solid #e2e8f0",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "linear-gradient(135deg,#dcfce7,#86efac)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    🌿
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#1e293b",
                      }}
                    >
                      Kebun Virtual
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      Harvest Bogor
                    </div>
                  </div>
                </div>
                <div
                  className="plant-grid"
                  style={{
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {PLANT_DEFS.map((pd, i) => (
                    <div
                      key={pd.id}
                      style={{
                        background: `linear-gradient(135deg,${pd.color}12,${pd.accent}08)`,
                        border: `1.5px solid ${pd.color}33`,
                        borderRadius: 16,
                        padding: "14px 8px",
                        textAlign: "center",
                        animation: `float ${2.5 + i * 0.5}s ease-in-out infinite`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          height: 80,
                          marginBottom: 4,
                        }}
                      >
                        <PlantSVG
                          progress={[40, 88, 100][i]}
                          defId={pd.id}
                          size={100}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        {pd.name}
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          color: pd.accent,
                          background: `${pd.color}22`,
                          borderRadius: 99,
                          padding: "2px 6px",
                          display: "inline-block",
                        }}
                      >
                        🪙{pd.points}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Reward preview strip */}
                <div
                  style={{
                    background: "linear-gradient(135deg,#fffbeb,#fef9c3)",
                    borderRadius: 14,
                    padding: "12px 16px",
                    border: "1px solid #fde047",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#92400e",
                      marginBottom: 8,
                    }}
                  >
                    🎁 Reward Yang Bisa Didapat
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      "🚚 Gratis Ongkir",
                      "💸 Cashback 50%",
                      "🛍️ Diskon 35%",
                      "💎 Cashback 10%",
                    ].map((r) => (
                      <span
                        key={r}
                        style={{
                          background: "#fff",
                          border: "1px solid #fbbf24",
                          borderRadius: 99,
                          padding: "3px 9px",
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#92400e",
                        }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: 24,
                    width: 50,
                    height: 50,
                    background: "linear-gradient(135deg,#fef9c3,#fde047)",
                    border: "2px solid #fbbf24",
                    borderRadius: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    boxShadow: "0 6px 20px rgba(251,191,36,0.4)",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  🪙
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    right: -16,
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg,#4ade80,#16a34a)",
                    borderRadius: 17,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    boxShadow: "0 8px 24px rgba(74,222,128,0.5)",
                    border: "3px solid #fff",
                    animation: "float 2.5s ease-in-out infinite",
                  }}
                >
                  🌾
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );

  // ─── Game ──────────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles />
      {confetti && <ConfettiBlast onDone={() => setConfetti(false)} />}
      {harvestResult && (
        <HarvestModal
          result={harvestResult}
          onClose={() => setHarvestResult(null)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 150,
            background: "#1e293b",
            color: "#fff",
            borderRadius: 99,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "toastIn 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 18 }}>{toast.emoji}</span>
          {toast.msg}
        </div>
      )}

      <div
        className="game-root"
        style={{
          minHeight: "calc(100vh - 92px)",
          paddingTop: "80px",
          paddingBottom: "70px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 30,
            padding: "11px 24px",
          }}
        >
          <div
            className="game-top-bar"
            style={{
              maxWidth: 1160,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {/* Logo + level */}
            <div className="game-top-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 13,
                  background: "linear-gradient(135deg,#4ade80,#16a34a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🌿
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontWeight: 900,
                    fontSize: 17,
                    color: "#1e293b",
                    lineHeight: 1,
                  }}
                >
                  Harvest Bogor
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>
                  {state.totalHarvests}x panen
                </div>
              </div>
              {/* Level badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                  border: "1.5px solid #c4b5fd",
                  borderRadius: 99,
                  padding: "5px 12px",
                }}
              >
                <span style={{ fontSize: 14 }}>
                  {["🌱", "🌿", "🌾", "🏅", "🥇", "🏆", "👑"][level]}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#5b21b6",
                      lineHeight: 1,
                    }}
                  >
                    Lv.{level + 1}
                  </div>
                  <div
                    style={{
                      width: 48,
                      height: 4,
                      background: "#ddd6fe",
                      borderRadius: 99,
                      overflow: "hidden",
                      marginTop: 2,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${lvlPct}%`,
                        background: "linear-gradient(90deg,#a78bfa,#7c3aed)",
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="game-top-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Streak */}
              {state.streak > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "linear-gradient(135deg,#fff7ed,#fed7aa)",
                    border: "1.5px solid #fb923c",
                    borderRadius: 99,
                    padding: "7px 12px",
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <div
                    style={{ fontSize: 13, fontWeight: 800, color: "#c2410c" }}
                  >
                    {state.streak}
                  </div>
                </div>
              )}
              {/* Gems */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                  border: "1.5px solid #c4b5fd",
                  borderRadius: 99,
                  padding: "7px 12px",
                }}
              >
                <span style={{ fontSize: 16 }}>💎</span>
                <div
                  style={{ fontSize: 13, fontWeight: 800, color: "#5b21b6" }}
                >
                  {state.gems}
                </div>
              </div>
              {/* Water */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                  border: "1.5px solid #93c5fd",
                  borderRadius: 99,
                  padding: "7px 14px",
                }}
              >
                <span style={{ fontSize: 16 }}>💧</span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#1d4ed8",
                      lineHeight: 1,
                    }}
                  >
                    {state.water}/{MAX_WATER}
                  </div>
                  {state.water < MAX_WATER && (
                    <div style={{ fontSize: 9, color: "#3b82f6" }}>
                      +1 {fmt(waterCD)}
                    </div>
                  )}
                </div>
              </div>
              {/* Points */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "linear-gradient(135deg,#fef9c3,#fef08a)",
                  border: "1.5px solid #fde047",
                  borderRadius: 99,
                  padding: "7px 14px",
                }}
              >
                <span style={{ fontSize: 16 }}>🪙</span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#92400e",
                      lineHeight: 1,
                    }}
                  >
                    {state.points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 9, color: "#b45309" }}>Daya Poin</div>
                </div>
              </div>
              {/* Daily claim */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleClaim}
                  disabled={!canClaim}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 99,
                    border: "none",
                    cursor: canClaim ? "pointer" : "not-allowed",
                    padding: "8px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    background: canClaim
                      ? "linear-gradient(135deg,#a78bfa,#7c3aed)"
                      : "#f1f5f9",
                    color: canClaim ? "#fff" : "#94a3b8",
                    boxShadow: canClaim
                      ? "0 4px 16px rgba(167,139,250,0.4)"
                      : "none",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  🎁{canClaim ? " Klaim!" : ""}
                </button>
                {canClaim && (
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -4,
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "2px 5px",
                      borderRadius: 99,
                      animation: "harvestPulse 1.5s infinite",
                    }}
                  >
                    !
                  </div>
                )}
              </div>
              <button
                onClick={() => setStarted(false)}
                style={{
                  background: "none",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "7px 12px",
                  fontSize: 11,
                  color: "#64748b",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                ← Keluar
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "20px 20px 60px",
          }}
        >
          {/* TABS */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 20,
              padding: "6px",
              background: "#f1f5f9",
              borderRadius: 18,
              width: "fit-content",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  position: "relative",
                  padding: "9px 20px",
                  borderRadius: 13,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.2s ease",
                  background: activeTab === t.id ? "#fff" : "transparent",
                  color: activeTab === t.id ? "#1e293b" : "#64748b",
                  boxShadow:
                    activeTab === t.id ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t.label}
                {t.badge > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 6,
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "1px 5px",
                      borderRadius: 99,
                      minWidth: 16,
                      textAlign: "center",
                    }}
                  >
                    {t.badge}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ── FARM TAB ── */}
          {activeTab === "farm" && (
            <div
              className="farm-grid"
              style={{
                display: "grid",
                gap: 20,
                alignItems: "start",
              }}
            >
              {/* Left panel */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 22,
                    padding: 20,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontWeight: 900,
                      fontSize: 18,
                      color: "#1e293b",
                      marginBottom: 6,
                    }}
                  >
                    Kebun Virtual
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    Siram setiap hari, panen saat matang!
                  </p>
                  {[
                    {
                      icon: "🌱",
                      label: "Lahan aktif",
                      val: `${activeCnt}/${SLOTS}`,
                      col: "#22c55e",
                    },
                    {
                      icon: "🪙",
                      label: "Total poin",
                      val: state.points.toLocaleString(),
                      col: "#f59e0b",
                    },
                    {
                      icon: "🔥",
                      label: "Streak",
                      val: `${state.streak} hari`,
                      col: "#f97316",
                    },
                    {
                      icon: "💧",
                      label: "Air tersisa",
                      val: `${state.water}/${MAX_WATER}`,
                      col: "#60a5fa",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 12px",
                        background: "#f8fafc",
                        borderRadius: 12,
                        marginBottom: 7,
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 14 }}>{s.icon}</span>
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          {s.label}
                        </span>
                      </div>
                      <span
                        style={{ fontWeight: 800, fontSize: 14, color: s.col }}
                      >
                        {s.val}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Quick mission peek */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 22,
                    padding: 20,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#1e293b",
                      }}
                    >
                      🎯 Misi Aktif
                    </div>
                    <button
                      onClick={() => setActiveTab("missions")}
                      style={{
                        fontSize: 11,
                        color: "#7c3aed",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontFamily: "inherit",
                      }}
                    >
                      Lihat semua →
                    </button>
                  </div>
                  {MISSIONS.filter(
                    (m) => !state.completedMissions.includes(m.id),
                  )
                    .slice(0, 3)
                    .map((m) => {
                      let cur = 0;
                      if (m.id === "m3") cur = state.byPlant.talas || 0;
                      else if (m.id === "m4") cur = state.byPlant.pala || 0;
                      else if (m.id === "m5") cur = state.byPlant.jambu || 0;
                      else if (m.id === "m2") cur = state.streak;
                      else if (m.id === "m7") cur = state.points;
                      else cur = state.totalHarvests;
                      const pct = Math.min(
                        100,
                        Math.round((cur / m.target) * 100),
                      );
                      return (
                        <div key={m.id} style={{ marginBottom: 10 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 11,
                              marginBottom: 4,
                            }}
                          >
                            <span>
                              {m.emoji} {m.label}
                            </span>
                            <span style={{ color: "#94a3b8" }}>
                              {cur}/{m.target}
                            </span>
                          </div>
                          <div
                            style={{
                              height: 5,
                              background: "#f1f5f9",
                              borderRadius: 99,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                background:
                                  "linear-gradient(90deg,#a78bfa,#7c3aed)",
                                borderRadius: 99,
                                transition: "width 0.5s ease",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  {pendingMissions === 0 && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#22c55e",
                        fontWeight: 600,
                      }}
                    >
                      🎉 Semua misi selesai!
                    </div>
                  )}
                </div>
                {/* Reward teaser */}
                {unclaimedRewards > 0 && (
                  <button
                    onClick={() => setActiveTab("rewards")}
                    style={{
                      background: "linear-gradient(135deg,#fef9c3,#fffbeb)",
                      border: "1.5px solid #fbbf24",
                      borderRadius: 18,
                      padding: "14px 16px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      animation: "harvestPulse 2.5s infinite",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#92400e",
                      }}
                    >
                      🎁 {unclaimedRewards} Reward Menunggu!
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#b45309", marginTop: 3 }}
                    >
                      Klik untuk klaim hadiah kamu →
                    </div>
                  </button>
                )}
              </div>

              {/* Plots */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontWeight: 700,
                        fontSize: 20,
                        color: "#1e293b",
                        marginBottom: 2,
                      }}
                    >
                      🌾 Lahan Pertanianmu
                    </h2>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>
                      {activeCnt}/{SLOTS} lahan aktif
                    </p>
                  </div>
                  {hasReady && (
                    <div
                      style={{
                        background: "linear-gradient(135deg,#fef9c3,#fef08a)",
                        border: "1.5px solid #fbbf24",
                        borderRadius: 14,
                        padding: "8px 14px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#92400e",
                        animation: "harvestPulse 2s infinite",
                      }}
                    >
                      ✨ Siap panen!
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
                    gap: 16,
                    position: "relative",
                  }}
                  onClick={() => {
                    if (selecting !== null) setSelecting(null);
                  }}
                >
                  {Array.from({ length: SLOTS }).map((_, i) => {
                    const plant = state.activePlants[i];
                    const def = plant
                      ? (PLANT_DEFS.find((d) => d.id === plant.defId) ?? null)
                      : null;
                    return (
                      <div key={i} onClick={(e) => e.stopPropagation()}>
                        <SawahPlot
                          index={i}
                          plant={plant}
                          def={def}
                          state={state}
                          onPlant={handlePlant}
                          onWater={handleWater}
                          onHarvest={handleHarvest}
                          selecting={selecting}
                          setSelecting={setSelecting}
                        />
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 18px",
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg,rgba(74,222,128,0.07),rgba(251,191,36,0.05))",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", flex: 1 }}>
                    <strong style={{ color: "#1e293b" }}>💡 Loop:</strong> Tanam
                    → Siram ({MAX_WATER_PER_DAY}x/hari +{WATER_BOOST}%) → Panen
                    → Poin → Reward
                  </div>
                  <div style={{ fontSize: 11, color: "#3b82f6" }}>
                    💧 Regen:{" "}
                    <strong>
                      {state.water < MAX_WATER ? fmt(waterCD) : "Penuh!"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <RewardsTab state={state} onRedeem={handleRedeem} />
          )}
          {activeTab === "missions" && <MissionsTab state={state} />}
          {activeTab === "stats" && <StatsTab state={state} />}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      
      body{font-family:'DM Sans',sans-serif;background:#fff7ed}
      button{font-family:'DM Sans',sans-serif}
      .game-root{
        background:#FEF5E7;
        min-height:100vh;position:relative;
        padding-top:80px;
        padding-bottom:70px;
      }
      .game-root::before{content:'';position:fixed;inset:0;pointer-events:none;
        background:radial-gradient(ellipse 80% 40% at 20% 20%,rgba(249,115,22,0.12) 0%,transparent 70%),
                   radial-gradient(ellipse 60% 50% at 80% 80%,rgba(251,191,36,0.10) 0%,transparent 70%);}
      .landing-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;}
      .plant-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
      @media (max-width: 1024px){.landing-grid{grid-template-columns:1fr;gap:30px;}.plant-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
      @media (max-width: 640px){.game-root{padding-top:70px;padding-bottom:60px;}.landing-grid{grid-template-columns:1fr;gap:18px;}.plant-grid{grid-template-columns:1fr;}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes glowPulse{0%,100%{opacity:.3}50%{opacity:.75}}
      @keyframes sparkle{0%{opacity:.35;transform:scale(0.75)}100%{opacity:1;transform:scale(1.25)}}
      @keyframes shimmerBar{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}
      @keyframes harvestPulse{0%,100%{box-shadow:0 4px 14px rgba(251,191,36,0.5)}50%{box-shadow:0 4px 28px rgba(251,191,36,0.9),0 0 0 6px rgba(251,191,36,0.15)}}
      @keyframes waterDrop{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(70px) scale(0.7)}}
      @keyframes dropIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes modalIn{0%{transform:scale(0.6) translateY(40px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
      @keyframes bounceIn{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
      @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      .landing-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;}
      .plant-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
      .farm-grid{grid-template-columns:260px 1fr;}
      .game-top-bar {
        width: 100%;
      }
      .game-top-left,
      .game-top-right {
        flex: 1 1 auto;
        min-width: 220px;
      }
      @media (max-width: 1024px){
        .landing-grid{grid-template-columns:1fr;gap:30px;}
        .plant-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
        .farm-grid{grid-template-columns:1fr;}
      }
      @media (max-width: 640px){
        .game-root{padding-top:70px;padding-bottom:60px;}
        .landing-grid{grid-template-columns:1fr;gap:18px;}
        .plant-grid{grid-template-columns:1fr;}
        .farm-grid{grid-template-columns:1fr;gap:16px;}
        .game-top-left,
        .game-top-right {
          flex: 1 1 100%;
          min-width: 0;
        }
        .game-top-right {
          justify-content: flex-start;
          gap: 6px;
          flex-wrap: wrap;
        }
      }
    `}</style>
  );
}
