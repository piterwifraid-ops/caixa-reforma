import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Paleta Gov.br ────────────────────────────────────────────────────────────
const C = {
  azul:      "#1351b4",
  azulEscuro:"#003D82",
  azulClaro: "#d4e3ff",
  amarelo:   "#F5A623",
  amareloSub:"#fff8e8",
  verde:     "#168821",
  verdeClaro:"#e3f5e1",
  vermelho:  "#e52207",
  vermelhoSub:"#fde8e6",
  cinzaFundo:"#f8f9fa",
  cinzaBorda:"#dee2e6",
  cinzaTexto:"#555",
  branco:    "#ffffff",
};

// ─── Perguntas ────────────────────────────────────────────────────────────────
const perguntas = [
  {
    id: 1,
    categoria: "MORADIA",
    titulo: "Onde você mora?",
    descricao: "O programa atende imóveis em área urbana — independente de ser casa própria, alugada ou cedida.",
    tipo: "unica",
    opcoes: [
      { id: "a", texto: "Moro na cidade (área urbana)", sub: "Casa própria, alugada ou cedida", ok: true },
      { id: "b", texto: "Moro em área rural", sub: "Zona rural, sítio ou chácara", ok: false, bloqueia: true },
    ],
  },
  {
    id: 2,
    categoria: "RENDA",
    titulo: "Qual é a renda bruta mensal da sua família?",
    descricao: "Some os ganhos de todos que moram com você. Bolsa Família e BPC não entram nessa conta.",
    tipo: "unica",
    opcoes: [
      { id: "a", texto: "Até R$ 3.200,00", sub: "Faixa I — juros de 1,17% a.m.", ok: true, faixa: "I", juros: "1,17%" },
      { id: "b", texto: "De R$ 3.200,01 a R$ 9.600,00", sub: "Faixa II — juros de 1,95% a.m.", ok: true, faixa: "II", juros: "1,95%" },
      { id: "c", texto: "Acima de R$ 9.600,00", sub: "Fora do limite do programa", ok: false, bloqueia: true },
    ],
  },
  {
    id: 3,
    categoria: "OBRA",
    titulo: "O que você quer reformar?",
    descricao: "Você pode escolher até 3 tipos de serviço no mesmo contrato. Selecione o principal agora.",
    tipo: "unica",
    opcoes: [
      { id: "a", texto: "Elétrica / Hidráulica", sub: "Fiação, encanamento, torneiras, chuveiro", ok: true },
      { id: "b", texto: "Telhado / Infiltração", sub: "Telhas, laje, impermeabilização", ok: true },
      { id: "c", texto: "Piso / Pintura / Azulejo", sub: "Revestimentos e pintura de paredes", ok: true },
      { id: "d", texto: "Banheiro / Cozinha / Área de serviço", sub: "Reforma completa de cômodos", ok: true },
      { id: "e", texto: "Novo cômodo / Energia solar / Outro", sub: "Ampliação ou outros serviços elegíveis", ok: true },
    ],
  },
  {
    id: 4,
    categoria: "VALOR",
    titulo: "Quanto você precisa para a reforma?",
    descricao: "O empréstimo vai de R$ 5.000 a R$ 30.000, com prazo de 24 a 60 parcelas.",
    tipo: "unica",
    opcoes: [
      { id: "a", texto: "R$ 5.000 a R$ 10.000", sub: "Obras menores e reparos", ok: true },
      { id: "b", texto: "R$ 10.001 a R$ 20.000", sub: "Reformas de médio porte", ok: true },
      { id: "c", texto: "R$ 20.001 a R$ 30.000", sub: "Reformas amplas", ok: true },
      { id: "d", texto: "Acima de R$ 30.000", sub: "Fora do limite — mas informe assim mesmo", ok: true },
    ],
  },
];

// ─── Barra de Progresso ───────────────────────────────────────────────────────
interface ProgressoProps {
  atual: number;
  total: number;
}

const Progresso = ({ atual, total }: ProgressoProps) => {
  const pct = Math.round((atual / total) * 100);
  const labels = ["Moradia", "Renda", "Obra", "Valor"];
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Steps */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        {labels.map((l, i) => {
          const done = i < atual - 1;
          const active = i === atual - 1;
          return (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? C.verde : active ? C.azul : C.cinzaBorda,
                color: done || active ? "#fff" : "#aaa",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, marginBottom: 4,
                transition: "all 0.3s ease",
                border: active ? `2px solid ${C.azulEscuro}` : "none",
              }}>
                {done ? "—" : i + 1}
              </div>
              <span style={{ fontSize: 10, color: active ? C.azul : done ? C.verde : "#aaa", fontWeight: active ? 700 : 400, textAlign: "center" }}>
                {l}
              </span>
            </div>
          );
        })}
      </div>
      {/* Barra */}
      <div style={{ background: C.cinzaBorda, borderRadius: 99, height: 4 }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${C.azulEscuro}, ${C.azul})`,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
};

// ─── Card de Opção ────────────────────────────────────────────────────────────
interface OpcaoData {
  id: string;
  texto: string;
  sub?: string;
  ok?: boolean;
  bloqueia?: boolean;
  faixa?: string;
  juros?: string;
}

interface OpcaoProps {
  opcao: OpcaoData;
  selecionada: string | null;
  onClick: (opcao: OpcaoData) => void;
  desabilitada: boolean;
}

const Opcao = ({ opcao, selecionada, onClick, desabilitada }: OpcaoProps) => {
  const ativa = selecionada === opcao.id;
  return (
    <button
      onClick={() => !desabilitada && onClick(opcao)}
      style={{
        display: "flex", alignItems: "center", width: "100%", gap: 14,
        padding: "14px 18px", marginBottom: 10, borderRadius: 8,
        border: `2px solid ${ativa ? C.azul : C.cinzaBorda}`,
        background: ativa ? C.azulClaro : C.branco,
        cursor: desabilitada ? "default" : "pointer",
        textAlign: "left", transition: "all 0.2s ease",
        boxShadow: ativa ? `0 0 0 3px ${C.azulClaro}` : "none",
      }}
    >
      {/* Radio visual */}
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${ativa ? C.azul : "#bbb"}`,
        background: ativa ? C.azul : C.branco,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {ativa && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: ativa ? 700 : 500, color: ativa ? C.azulEscuro : "#222", marginBottom: 2 }}>
          {opcao.texto}
        </p>
        {opcao.sub && (
          <p style={{ fontSize: 12, color: ativa ? C.azul : C.cinzaTexto }}>{opcao.sub}</p>
        )}
      </div>
      {ativa && (
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.azul, flexShrink: 0 }} />
      )}
    </button>
  );
};

// ─── Bloqueio (inelegível) ────────────────────────────────────────────────────
interface BloqueioProps {
  motivo: string;
  onReiniciar: () => void;
}

const Bloqueio = ({ motivo, onReiniciar }: BloqueioProps) => (
  <div style={{ animation: "entrar 0.4s ease" }}>
    <div style={{ background: C.vermelhoSub, border: `1.5px solid ${C.vermelho}`, borderRadius: 10, padding: "24px 20px", marginBottom: 16, textAlign: "center" }}>
      <h2 style={{ fontSize: 18, color: "#a00", fontWeight: 700, marginBottom: 8 }}>
        Seu perfil não se enquadra no programa agora
      </h2>
      <p style={{ fontSize: 14, color: "#600", lineHeight: 1.6 }}>
        {motivo === "rural"
          ? "O Reforma Casa Brasil atende apenas imóveis em área urbana (cidades). Imóveis em zona rural não são elegíveis."
          : "O programa atende famílias com renda bruta de até R$ 9.600,00. Fora desta faixa, outras linhas de crédito podem ajudar."}
      </p>
    </div>
    <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 10, padding: "20px" }}>
      <p style={{ fontWeight: 700, color: C.azulEscuro, fontSize: 15, marginBottom: 12 }}>Outras opções da CAIXA para você:</p>
      {[
        { label: "Crédito Imobiliário CAIXA", sub: "Para compra ou reforma com FGTS" },
        { label: "Carta de Crédito FGTS", sub: "Utilize seu saldo do FGTS" },
        { label: "Atendimento personalizado", sub: "Fale com um gerente da CAIXA" },
      ].map(({ label, sub }) => (
        <a key={label} href="#" style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 14px", marginBottom: 8, borderRadius: 8,
          border: `1px solid ${C.cinzaBorda}`, textDecoration: "none",
          background: C.cinzaFundo,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.azul, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.azul }}>{label}</p>
            <p style={{ fontSize: 12, color: C.cinzaTexto }}>{sub}</p>
          </div>
          <span style={{ marginLeft: "auto", color: C.azul, fontSize: 16 }}>›</span>
        </a>
      ))}
    </div>
    <button onClick={onReiniciar}
      style={{ width: "100%", background: "none", border: "none", color: "#999", fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: "14px 0" }}>
      Refazer o quiz
    </button>
  </div>
);

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function Quiz() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState("quiz");   // quiz | bloqueio
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [respostas, setRespostas] = useState<Record<number, OpcaoData>>({});
  const [motivoBloqueio, setMotivoBloqueio] = useState("");
  const [animando, setAnimando] = useState(false);

  const q = perguntas[perguntaAtual];

  const reiniciar = () => {
    setEtapa("quiz"); setPerguntaAtual(0); setSelecionada(null);
    setRespostas({}); setMotivoBloqueio(""); setAnimando(false);
  };

  const selecionar = (opcao: OpcaoData) => {
    if (animando || selecionada) return;
    setSelecionada(opcao.id);
    setAnimando(true);

    setTimeout(() => {
      const novasRespostas = { ...respostas, [q.id]: opcao };

      if (opcao.bloqueia) {
        setMotivoBloqueio(q.id === 1 ? "rural" : "renda");
        setEtapa("bloqueio");
        setAnimando(false);
        return;
      }

      setRespostas(novasRespostas);

      if (perguntaAtual < perguntas.length - 1) {
        setPerguntaAtual(p => p + 1);
        setSelecionada(null);
        setAnimando(false);
      } else {
        const escolhaValor = novasRespostas[4]?.id || "a";
        const mapaMedia: Record<string, number> = { a: 7500, b: 15000, c: 25000, d: 30000 };
        const valorAprovado = mapaMedia[escolhaValor] || 15000;
        const aprovData = {
          faixa: novasRespostas[2]?.faixa || "I",
          jurosAm: parseFloat((novasRespostas[2]?.juros || "1.17").replace(",", ".")) / 100,
          servico: novasRespostas[3]?.id || "a",
          valorAprovado,
        };
        localStorage.setItem("aprovacaoData", JSON.stringify(aprovData));
        navigate("/formulario");
      }
    }, 420);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: C.cinzaFundo, minHeight: "30vh" }}>
      <style>{`
        @keyframes entrar { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulsar { 0%,100%{transform:scale(1)} 50%{transform:scale(1.015)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        input { font-family: inherit; }
        input:focus { outline: none; border-color: ${C.azul} !important; box-shadow: 0 0 0 3px ${C.azulClaro}; }
        .opcao-btn:hover { border-color: ${C.azul} !important; background: ${C.azulClaro} !important; }
      `}</style>

      {/* ── Conteúdo Principal ── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "8px 16px 12px" }}>

        {/* ── QUIZ ── */}
        {etapa === "quiz" && (
          <div key={perguntaAtual} style={{ animation: "entrar 0.35s ease" }}>

            {/* Título da seção */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ background: C.azulClaro, color: C.azul, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, letterSpacing: 0.5 }}>
                  {q.categoria}
                </span>
              </div>
              <h1 style={{ fontSize: 13, color: C.cinzaTexto, fontWeight: 400 }}>
                Verificação de elegibilidade — Reforma Casa Brasil
              </h1>
            </div>

            {/* Card de pergunta */}
            <div style={{ background: C.branco, borderRadius: 10, border: `1px solid ${C.cinzaBorda}`, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              {/* Barra colorida topo */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${C.azulEscuro}, ${C.azul}, #0072c6)` }} />

              <div style={{ padding: "24px 22px" }}>
                <Progresso atual={perguntaAtual + 1} total={perguntas.length} />

                {/* Pergunta */}
                <div style={{ marginBottom: 22 }}>
                  <h2 style={{ fontSize: 20, color: "#1a1a2e", fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
                    {q.titulo}
                  </h2>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: C.amareloSub, borderLeft: `3px solid ${C.amarelo}`, padding: "8px 12px", borderRadius: "0 6px 6px 0" }}>
                    <p style={{ fontSize: 13, color: "#5a4000", lineHeight: 1.5 }}>{q.descricao}</p>
                  </div>
                </div>

                {/* Opções */}
                <div>
                  {q.opcoes.map(op => (
                    <Opcao
                      key={op.id}
                      opcao={op}
                      selecionada={selecionada}
                      onClick={selecionar}
                      desabilitada={!!selecionada}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Rodapé de confiança */}
          </div>
        )}

        {/* ── BLOQUEIO ── */}
        {etapa === "bloqueio" && (
          <Bloqueio motivo={motivoBloqueio} onReiniciar={reiniciar} />
        )}

      </div>

    </div>
  );
}
