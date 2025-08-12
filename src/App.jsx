import React, { useMemo, useRef, useEffect, useState } from 'react'

const fmt = (x) => (Number.isFinite(x) ? x.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—');
const toNumber = (v, fallback = 0) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
};

const variants = [
  { id: 1, label: "Вариант 1 (DVB-T, 8 МГц, 16-QAM, 3/4, 1280×720@25, Bpp=12, K=40, аудио 44.1 кГц/16/2)",
    data: { standard: "DVB-T", bwMHz: 8, modulation: "16-QAM", M: 16, fec: 3/4, H: 1280, V: 720, fps: 25, bpp: 12, compression: 40, audioFs: 44100, audioBits: 16, audioCh: 2 } },
  { id: 2, label: "Вариант 2 (DVB-T2, 8 МГц, 64-QAM, 2/3, 1920×1080@25, Bpp=12, K=50, аудио 48 кГц/16/2)",
    data: { standard: "DVB-T2", bwMHz: 8, modulation: "64-QAM", M: 64, fec: 2/3, H: 1920, V: 1080, fps: 25, bpp: 12, compression: 50, audioFs: 48000, audioBits: 16, audioCh: 2 } },
  { id: 3, label: "Вариант 3 (ATSC, 6 МГц, 8-VSB, 3/4, 1920×1080@30, Bpp=12, K=30, аудио 48 кГц/24/6)",
    data: { standard: "ATSC", bwMHz: 6, modulation: "8-VSB", M: 8, fec: 3/4, H: 1920, V: 1080, fps: 30, bpp: 12, compression: 30, audioFs: 48000, audioBits: 24, audioCh: 6 } },
  { id: 4, label: "Вариант 4 (DVB-T2, 7 МГц, 16-QAM, 5/6, 1280×720@50, Bpp=12, K=35, аудио 48 кГц/16/2)",
    data: { standard: "DVB-T2", bwMHz: 7, modulation: "16-QAM", M: 16, fec: 5/6, H: 1280, V: 720, fps: 50, bpp: 12, compression: 35, audioFs: 48000, audioBits: 16, audioCh: 2 } },
  { id: 5, label: "Вариант 5 (ISDB-T, 6 МГц, QPSK, 3/4, 640×480@30, Bpp=12, K=25, аудио 44.1 кГц/16/1)",
    data: { standard: "ISDB-T", bwMHz: 6, modulation: "QPSK", M: 4, fec: 3/4, H: 640, V: 480, fps: 30, bpp: 12, compression: 25, audioFs: 44100, audioBits: 16, audioCh: 1 } },
  { id: 6, label: "Вариант 6 (DVB-T, 8 МГц, 64-QAM, 3/4, 3840×2160@50, Bpp=12, K=80, аудио 48 кГц/24/6)",
    data: { standard: "DVB-T", bwMHz: 8, modulation: "64-QAM", M: 64, fec: 3/4, H: 3840, V: 2160, fps: 50, bpp: 12, compression: 80, audioFs: 48000, audioBits: 24, audioCh: 6 } },
  { id: 7, label: "Вариант 7 (DVB-T2, 7 МГц, 256-QAM, 3/5, 1920×1080@60, Bpp=12, K=60, аудио 48 кГц/16/2)",
    data: { standard: "DVB-T2", bwMHz: 7, modulation: "256-QAM", M: 256, fec: 3/5, H: 1920, V: 1080, fps: 60, bpp: 12, compression: 60, audioFs: 48000, audioBits: 16, audioCh: 2 } },
  { id: 8, label: "Вариант 8 (ATSC 3.0, 6 МГц, 64-QAM, 5/6, 1280×720@30, Bpp=12, K=45, аудио 48 кГц/24/6)",
    data: { standard: "ATSC 3.0", bwMHz: 6, modulation: "64-QAM", M: 64, fec: 5/6, H: 1280, V: 720, fps: 30, bpp: 12, compression: 45, audioFs: 48000, audioBits: 24, audioCh: 6 } },
];

function SelectVariant({ items, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = items.find((x) => x.id === value);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl border p-2 text-left flex items-center justify-between gap-2"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate block">{current ? current.label : 'Выберите вариант'}</span>
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 max-h-72 w-full min-w-[28rem] overflow-auto rounded-xl border bg-white p-1 shadow-lg">
          {items.map((it) => (
            <button
              key={it.id}
              className={`w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 ${it.id===value? 'bg-gray-50' : ''}`}
              role="option"
              aria-selected={it.id===value}
              onClick={() => { onChange(it.id); setOpen(false); }}
            >
              <div className="whitespace-normal leading-snug">{it.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, children, help }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {help && <p className="text-xs text-gray-500">{help}</p>}
    </div>
  );
}

function NumberInput({ value, onChange, min, step = 1, placeholder }) {
  return (
    <input
      className="w-full rounded-2xl border p-2 outline-none focus:ring-2"
      type="number"
      value={value}
      onChange={(e) => onChange(toNumber(e.target.value, 0))}
      min={min}
      step={step}
      placeholder={placeholder}
    />
  );
}

export default function App() {
  const [state, setState] = useState({ ...variants[1].data });
  const [variantId, setVariantId] = useState(2);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  const { bwMHz, M, fec, H, V, fps, bpp, compression, audioFs, audioBits, audioCh, standard, modulation } = state;

  const calc = useMemo(() => {
    const BW = toNumber(bwMHz) * 1e6; // Hz
    const log2M = Math.log2(toNumber(M));
    const fecRate = toNumber(fec);
    const rawVideo = toNumber(H) * toNumber(V) * toNumber(bpp) * toNumber(fps); // bit/s
    const video = rawVideo / Math.max(1, toNumber(compression));
    const audio = toNumber(audioFs) * toNumber(audioBits) * toNumber(audioCh);
    const total = video + audio;
    const channel = BW * log2M;
    const effective = channel * fecRate;
    const fits = effective >= total;
    return { BW, log2M, fecRate, rawVideo, video, audio, total, channel, effective, fits };
  }, [bwMHz, M, fec, H, V, fps, bpp, compression, audioFs, audioBits, audioCh]);

  const applyVariant = (id) => {
    const v = variants.find((x) => x.id === id);
    if (!v) return;
    setState({ ...v.data });
    setVariantId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Калькулятор параметров цифрового ТВ (QAM / OFDM)</h1>
          <p className="text-gray-600">Заполните исходные данные слева — результаты пересчёта появятся справа в реальном времени.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: Inputs */}
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-4">
              <label className="text-sm mb-1 block">Вариант:</label>
              <SelectVariant items={variants} value={variantId} onChange={applyVariant} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Стандарт">
                <input className="w-full rounded-2xl border p-2" value={standard} onChange={(e) => set({ standard: e.target.value })} />
              </Field>
              <Field label="Модуляция">
                <input className="w-full rounded-2xl border p-2" value={modulation} onChange={(e) => set({ modulation: e.target.value })} />
              </Field>
              <Field label="Полоса канала, МГц">
                <NumberInput value={bwMHz} onChange={(v) => set({ bwMHz: v })} step={0.1} />
              </Field>
              <Field label="Порядок модуляции, M">
                <NumberInput value={M} onChange={(v) => set({ M: v })} />
              </Field>
              <Field label="FEC (доля полезных данных)">
                <NumberInput value={fec} onChange={(v) => set({ fec: v })} step={0.05} />
                <p className="text-xs text-gray-500">Напр.: 0.5, 0.67, 0.75, 0.83…</p>
              </Field>

              <div className="col-span-2 mt-2 text-sm font-medium">Видео</div>
              <Field label="Ширина, пикс (H)">
                <NumberInput value={H} onChange={(v) => set({ H: v })} />
              </Field>
              <Field label="Высота, пикс (V)">
                <NumberInput value={V} onChange={(v) => set({ V: v })} />
              </Field>
              <Field label="Кадровая частота, fps">
                <NumberInput value={fps} onChange={(v) => set({ fps: v })} />
              </Field>
              <Field label="Бит на пиксель (Bpp)">
                <NumberInput value={bpp} onChange={(v) => set({ bpp: v })} />
              </Field>
              <Field label="Коэфф. сжатия (K)">
                <NumberInput value={compression} onChange={(v) => set({ compression: v })} />
              </Field>

              <div className="col-span-2 mt-2 text-sm font-medium">Аудио</div>
              <Field label="Частота дискретизации, Гц">
                <NumberInput value={audioFs} onChange={(v) => set({ audioFs: v })} step={100} />
              </Field>
              <Field label="Глубина, бит">
                <NumberInput value={audioBits} onChange={(v) => set({ audioBits: v })} />
              </Field>
              <Field label="Каналы (1/2/6)">
                <NumberInput value={audioCh} onChange={(v) => set({ audioCh: v })} />
              </Field>
            </div>
          </section>

          {/* Right: Results */}
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Результаты</h2>
            <div className="grid grid-cols-1 gap-2">
              <div className="rounded-xl border p-3">
                <div className="text-sm text-gray-500">Несжатый видео-битрейт</div>
                <div className="text-xl font-semibold">{fmt(calc.rawVideo / 1e6)} Мбит/с</div>
                <div className="text-xs text-gray-500">= H × V × Bpp × fps</div>
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-sm text-gray-500">Сжатый видео-битрейт</div>
                <div className="text-xl font-semibold">{fmt(calc.video / 1e6)} Мбит/с</div>
                <div className="text-xs text-gray-500">= Raw / Kсж</div>
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-sm text-gray-500">Аудио-битрейт</div>
                <div className="text-xl font-semibold">{fmt(calc.audio / 1e6)} Мбит/с</div>
                <div className="text-xs text-gray-500">= fs × bits × channels</div>
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-sm text-gray-500">Суммарный битрейт программы</div>
                <div className="text-xl font-semibold">{fmt(calc.total / 1e6)} Мбит/с</div>
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-sm text-gray-500">Теоретическая пропускная способность канала</div>
                <div className="text-xl font-semibold">{fmt(calc.channel / 1e6)} Мбит/с</div>
                <div className="text-xs text-gray-500">= BW × log₂(M)</div>
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-sm text-gray-500">Эффективная пропускная способность (учёт FEC)</div>
                <div className={`text-xl font-semibold ${'${calc.fits ? \"text-emerald-600\" : \"text-rose-600\"}'}`}>{'${fmt(calc.effective / 1e6)}'} Мбит/с</div>
                <div className="text-xs text-gray-500">= Channel × FEC</div>
              </div>

              <div className={`rounded-xl border p-3 ${'${calc.fits ? \"bg-emerald-50 border-emerald-200\" : \"bg-rose-50 border-rose-200\"}'}`}>
                <div className="text-sm text-gray-500">Итог</div>
                <div className={`text-lg font-semibold ${'${calc.fits ? \"text-emerald-700\" : \"text-rose-700\"}'}`}>
                  {'${calc.fits ? \"Поток влезает в канал ✅\" : \"Поток не влезает в канал ❌\"}'}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Пояснения</h3>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Все расчёты — теоретические. Реальные системы имеют накладные расходы (служебные данные, пилоты, GI, интерливинг и т.п.).</li>
            <li>FEC вводите как дробь доли полезных данных (например, 0.75 для 3/4).</li>
            <li>Для QAM: M = 4 (QPSK), 16, 64, 256 и т.д.; log₂(M) автоматически увеличивает скорость.</li>
            <li>Единицы: входные частоты — в Гц, итоговые значения отображаются в Мбит/с.</li>
          </ul>
        </section>

        <footer className="text-xs text-gray-500">© {new Date().getFullYear()} Digital TV Calc.</footer>
      </div>
    </div>
  );
}
