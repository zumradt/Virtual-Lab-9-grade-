import React, { useMemo, useState } from "react";

const ELEMENTS = {
  1: { symbol: "H", name: "Водород" },
  2: { symbol: "He", name: "Гелий" },
  3: { symbol: "Li", name: "Литий" },
  4: { symbol: "Be", name: "Бериллий" },
  5: { symbol: "B", name: "Бор" },
  6: { symbol: "C", name: "Углерод" },
  7: { symbol: "N", name: "Азот" },
  8: { symbol: "O", name: "Кислород" },
  9: { symbol: "F", name: "Фтор" },
  10: { symbol: "Ne", name: "Неон" },
  11: { symbol: "Na", name: "Натрий" },
  12: { symbol: "Mg", name: "Магний" },
  13: { symbol: "Al", name: "Алюминий" },
  14: { symbol: "Si", name: "Кремний" },
  15: { symbol: "P", name: "Фосфор" },
  16: { symbol: "S", name: "Сера" },
  17: { symbol: "Cl", name: "Хлор" },
  18: { symbol: "Ar", name: "Аргон" },
  19: { symbol: "K", name: "Калий" },
  20: { symbol: "Ca", name: "Кальций" },
};

function generateNucleonPositions(total, radiusBase = 36) {
  const positions = [];
  if (total <= 0) return positions;
  let remaining = total;
  let ring = 0;
  while (remaining > 0) {
    const onThisRing = Math.min(remaining, ring === 0 ? 1 : ring * 6);
    const r = ring === 0 ? 0 : radiusBase * ring * 0.65;
    for (let i = 0; i < onThisRing; i++) {
      const angle = (i / onThisRing) * Math.PI * 2;
      positions.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
    }
    remaining -= onThisRing;
    ring++;
  }
  return positions;
}

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function NuclearStructureLab() {
  const [Z, setZ] = useState(8);
  const [N, setN] = useState(8);
  const A = Z + N;

  const el = ELEMENTS[Z] || { symbol: `Z${Z}`, name: `Элемент Z=${Z}` };

  const [practiceMode, setPracticeMode] = useState("none");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const nucleusPositions = useMemo(() => generateNucleonPositions(A), [A]);

  const protonPositions = nucleusPositions.slice(0, Z);
  const neutronPositions = nucleusPositions.slice(Z, Z + N);

  const stabilityHint = useMemo(() => {
    if (Z <= 8) {
      if (Math.abs(N - Z) <= 1) return "Соотношение N≈Z — типично для лёгких стабильных ядер.";
      return "Для лёгких элементов обычно N близко к Z.";
    }
    if (N >= Z + 2) return "Для более тяжёлых ядер N обычно > Z, что ближе к стабильности.";
    return "Для более тяжёлых элементов стабильные изотопы обычно имеют N заметно больше Z.";
  }, [Z, N]);

  function reset() {
    setZ(8);
    setN(8);
    setPracticeMode("none");
    setAnswer("");
    setFeedback(null);
  }

  function randomize() {
    const newZ = Math.floor(Math.random() * 20) + 1;
    const delta = Math.floor(Math.random() * 5) - 1;
    const newN = Math.max(0, newZ + delta);
    setZ(newZ);
    setN(newN);
    setPracticeMode("none");
    setAnswer("");
    setFeedback(null);
  }

  function checkAnswer() {
    const val = Number(answer);
    let ok = false;
    if (practiceMode === "findA") ok = val === A;
    if (practiceMode === "findN") ok = val === N;
    if (practiceMode === "findZ") ok = val === Z;
    setFeedback(ok ? "Верно!" : "Проверь вычисления.");
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 p-6">
      <div className="max-w-6xl mx-auto grid gap-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Виртуальная лаборатория: строение атомного ядра</h1>
            <p className="text-slate-600">Нуклоны, протонное число Z, нейтронное число N, массовое число A.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={randomize} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white shadow hover:bg-indigo-500 transition">Случайно</button>
            <button onClick={reset} className="px-4 py-2 rounded-2xl bg-slate-200 text-slate-900 shadow hover:bg-slate-300 transition">Сброс</button>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white shadow p-4">
            <h2 className="font-bold text-lg">Определения</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-semibold">Нуклоны</span> — частицы ядра: протоны и нейтроны.</li>
              <li><span className="font-semibold">Z</span> — протонное число (число протонов, определяет элемент).</li>
              <li><span className="font-semibold">N</span> — нейтронное число (число нейтронов).</li>
              <li><span className="font-semibold">A</span> — массовое число: <span className="font-mono">A = Z + N</span>.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white shadow p-4">
            <h2 className="font-bold text-lg">Запись изотопа</h2>
            <div className="mt-3 flex items-center gap-4">
              <div className="relative">
                <div className="text-3xl font-extrabold leading-none">{el.symbol}</div>
                <div className="absolute -left-6 -top-4 text-xs font-bold">{A}</div>
                <div className="absolute -left-6 top-3 text-xs font-bold">{Z}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Элемент: {el.name}</div>
                <div className="text-sm">Изотопная запись: <span className="font-mono align-middle">^{A}_{Z}{el.symbol}</span></div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow p-4">
            <h2 className="font-bold text-lg">Подсказка по стабильности</h2>
            <p className="mt-2 text-sm text-slate-700">{stabilityHint}</p>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl bg-white shadow p-5 flex flex-col gap-5">
            <h3 className="font-bold text-xl">Параметры ядра</h3>

            <div className="space-y-4">
              <div>
                <label className="flex items-baseline justify-between">
                  <span className="font-semibold">Протоны Z</span>
                  <span className="font-mono text-sm">Z = {Z}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={Z}
                  onChange={(e) => setZ(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={Z}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setZ(Math.min(20, Math.max(1, isNaN(val) ? 1 : val)));
                    }}
                    className="w-24 rounded-xl border border-slate-300 px-2 py-1 font-mono"
                  />
                  <span className="text-sm text-slate-600">Элемент: {el.symbol} ({el.name})</span>
                </div>
              </div>

              <div>
                <label className="flex items-baseline justify-between">
                  <span className="font-semibold">Нейтроны N</span>
                  <span className="font-mono text-sm">N = {N}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={N}
                  onChange={(e) => setN(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={N}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setN(Math.min(40, Math.max(0, isNaN(val) ? 0 : val)));
                    }}
                    className="w-24 rounded-xl border border-slate-300 px-2 py-1 font-mono"
                  />
                  <span className="text-sm text-slate-600">Массовое число A = {A}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold">Тренажёр вычислений</h4>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {[
                  { mode: "none", label: "Выключен" },
                  { mode: "findA", label: "Найти A" },
                  { mode: "findN", label: "Найти N" },
                  { mode: "findZ", label: "Найти Z" },
                ].map(({ mode, label }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setPracticeMode(mode);
                      setAnswer("");
                      setFeedback(null);
                    }}
                    className={classNames(
                      "px-3 py-1.5 rounded-full text-sm border shadow-sm",
                      practiceMode === mode
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {practiceMode !== "none" && (
                <div className="mt-3 grid gap-2">
                  <div className="text-sm text-slate-700">
                    {practiceMode === "findA" && (
                      <>
                        Дано: Z = <span className="font-mono">{Z}</span>, N = <span className="font-mono">{N}</span>. Найдите A.
                      </>
                    )}
                    {practiceMode === "findN" && (
                      <>
                        Дано: Z = <span className="font-mono">{Z}</span>, A = <span className="font-mono">{A}</span>. Найдите N.
                      </>
                    )}
                    {practiceMode === "findZ" && (
                      <>
                        Дано: N = <span className="font-mono">{N}</span>, A = <span className="font-mono">{A}</span>. Найдите Z.
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Ваш ответ"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-32 rounded-xl border border-slate-300 px-3 py-1.5 font-mono"
                    />
                    <button onClick={checkAnswer} className="px-4 py-1.5 rounded-2xl bg-emerald-600 text-white shadow hover:bg-emerald-500">Проверить</button>
                    {feedback && (
                      <span className={classNames(
                        "text-sm font-semibold",
                        feedback === "Верно!" ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {feedback}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow p-5">
            <h3 className="font-bold text-xl mb-3">Визуализация ядра</h3>
            <div className="aspect-square w-full relative grid place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
              <div className="relative" style={{ width: 360, height: 360 }}>
                <svg viewBox="-200 -200 400 400" className="w-full h-full">
                  <defs>
                    <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopOpacity="0.2" stopColor="#818cf8" />
                      <stop offset="100%" stopOpacity="0" stopColor="#818cf8" />
                    </radialGradient>
                  </defs>
                  <circle cx={0} cy={0} r={160} fill="url(#nucleusGlow)" />

                  {protonPositions.map((p, i) => (
                    <g key={`p-${i}`} transform={`translate(${p.x},${p.y})`}>
                      <circle r={12} fill="#ef4444" opacity={0.9} />
                      <text x={0} y={4} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={700}>p⁺</text>
                    </g>
                  ))}

                  {neutronPositions.map((p, i) => (
                    <g key={`n-${i}`} transform={`translate(${p.x},${p.y})`}>
                      <circle r={12} fill="#64748b" opacity={0.9} />
                      <text x={0} y={4} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={700}>n</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#ef4444" }}></span> Протоны p⁺ ({Z})</span>
              <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#64748b" }}></span> Нейтроны n ({N})</span>
              <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full border border-slate-300"></span> Всего нуклонов A = {A}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white shadow p-5">
          <h3 className="font-bold text-xl">Задачи для самопроверки</h3>
          <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
            <li>Установите Z = 6. Подберите N так, чтобы получить изотоп углерода-12. Выпишите изотопную запись.</li>
            <li>Найдите A для Z = 11 и N = 12. Как называется элемент?</li>
            <li>При A = 40 и Z = 20 найдите N. Какой это элемент и какова запись изотопа?</li>
            <li>Измените Z и N так, чтобы получить случаи N = Z и N > Z. Сравните подсказки стабильности.</li>
          </ol>
        </section>

        <footer className="text-xs text-slate-500 text-center py-4">
          © 2025 Виртуальная лаборатория по физике (9 класс). Формулы: A = Z + N. Символы элементов для Z = 1..20.
        </footer>
      </div>
    </div>
  );
}
