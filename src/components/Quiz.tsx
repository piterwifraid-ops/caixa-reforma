import { useState } from "react";

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

// ─── Utilitários ──────────────────────────────────────────────────────────────
const getServico = (val: string) => ({
  a: "elétrica e hidráulica",
  b: "telhado e infiltrações",
  c: "piso, azulejo e pintura",
  d: "banheiro, cozinha e área de serviço",
  e: "novo cômodo ou energia solar",
}[val] || "reforma da sua casa");

const getValorFaixa = (val: string) => ({
  a: "R$ 5.000 a R$ 10.000",
  b: "R$ 10.001 a R$ 20.000",
  c: "R$ 20.001 a R$ 30.000",
  d: "Acima de R$ 30.000",
}[val] || "a confirmar");

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

// ─── Formulário de Lead ───────────────────────────────────────────────────────
interface FormLeadProps {
  resumo: {
    faixa: string;
    juros: string;
    servico: string;
    valor: string;
  };
  onEnviar: (dados: { nome: string; whatsapp: string; email: string }) => void;
}

const FormLead = ({ resumo, onEnviar }: FormLeadProps) => {
  const [form, setForm] = useState({ nome: "", whatsapp: "", email: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  const validar = () => {
    const e: Record<string, string> = {};
    if (form.nome.trim().split(" ").length < 2) e.nome = "Informe seu nome completo.";
    if (form.whatsapp.replace(/\D/g,"").length < 10) e.whatsapp = "Número inválido.";
    if (!form.email.includes("@") || !form.email.includes(".")) e.email = "E-mail inválido.";
    setErros(e);
    return !Object.keys(e).length;
  };

  const mascaraWpp = (v: string) => {
    const d = v.replace(/\D/g,"").slice(0,11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  const enviar = () => {
    if (!validar()) return;
    setEnviando(true);
    setTimeout(() => { setEnviando(false); onEnviar(form); }, 1000);
  };

  return (
    <div style={{ animation: "entrar 0.4s ease" }}>
      {/* Resumo da elegibilidade */}
      <div style={{ background: C.verdeClaro, border: `1.5px solid ${C.verde}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.verde, flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 700, color: C.verde, fontSize: 15, marginBottom: 6 }}>
              Você atende aos critérios do programa!
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                `Faixa ${resumo.faixa} — ${resumo.juros} a.m.`,
                `Reforma: ${getServico(resumo.servico)}`,
                `Valor estimado: ${getValorFaixa(resumo.valor)}`,
                `Sem necessidade de escritura`,
              ].map(t => (
                <li key={t} style={{ fontSize: 13, color: "#1a5e1e", padding: "3px 0" }}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div style={{ background: C.branco, borderRadius: 10, border: `1px solid ${C.cinzaBorda}`, padding: "22px 20px" }}>
        <p style={{ fontWeight: 700, color: C.azulEscuro, fontSize: 16, marginBottom: 4 }}>
          Receba seu plano de contratação
        </p>
        <p style={{ fontSize: 13, color: C.cinzaTexto, marginBottom: 18 }}>
          Preencha seus dados e veja como contratar o empréstimo agora mesmo.
        </p>

        {[
          { key: "nome", label: "Nome completo *", placeholder: "Ex: João da Silva", type: "text" },
          { key: "whatsapp", label: "WhatsApp *", placeholder: "(11) 99999-9999", type: "tel" },
          { key: "email", label: "E-mail *", placeholder: "joao@email.com.br", type: "email" },
        ].map(({ key, label, placeholder, type }: { key: string; label: string; placeholder: string; type: string }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 5 }}>
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={e => {
                const v = key === "whatsapp" ? mascaraWpp(e.target.value) : e.target.value;
                setForm(f => ({ ...f, [key]: v }));
                setErros(er => ({ ...er, [key]: "" }));
              }}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 6,
                border: `1.5px solid ${erros[key] ? C.vermelho : C.cinzaBorda}`,
                fontSize: 14, outline: "none", background: erros[key] ? C.vermelhoSub : C.cinzaFundo,
                boxSizing: "border-box", color: "#111",
              }}
            />
            {erros[key] && (
              <p style={{ fontSize: 12, color: C.vermelho, marginTop: 4 }}>{erros[key]}</p>
            )}
          </div>
        ))}

        <button
          onClick={enviar}
          disabled={enviando}
          style={{
            width: "100%", padding: "14px", borderRadius: 6, border: "none",
            background: enviando ? "#aaa" : C.azul,
            color: C.branco, fontSize: 15, fontWeight: 700,
            cursor: enviando ? "default" : "pointer",
            boxShadow: enviando ? "none" : "0 2px 8px rgba(19,81,180,0.3)",
            transition: "background 0.2s",
          }}
        >
          {enviando ? "Processando..." : "Ver como contratar →"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 12 }}>
          <span style={{ fontSize: 12, color: "#999" }}>Dados protegidos. Não compartilhamos com terceiros.</span>
        </div>
      </div>
    </div>
  );
};

// ─── Resultado Final ──────────────────────────────────────────────────────────
interface ResultadoProps {
  resumo: {
    faixa: string;
    juros: string;
    servico: string;
    valor: string;
  };
  lead: { nome: string; email: string };
  onReiniciar: () => void;
}

const Resultado = ({ resumo, lead, onReiniciar }: ResultadoProps) => {
  const primeiroNome = lead.nome.split(" ")[0];

  return (
    <div style={{ animation: "entrar 0.4s ease" }}>
      {/* Cabeçalho de aprovação */}
      <div style={{
        background: `linear-gradient(135deg, ${C.azulEscuro} 0%, ${C.azul} 100%)`,
        borderRadius: 10, padding: "28px 24px", marginBottom: 16, textAlign: "center",
      }}>
        <h2 style={{ color: C.branco, fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
          {primeiroNome}, você está pré-qualificado!
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
          Seu perfil atende os critérios do <strong>Reforma Casa Brasil</strong>
        </p>
      </div>

      {/* Painel de dados */}
      <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        {/* Faixa destaque */}
        <div style={{ background: C.amareloSub, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: C.amarelo, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>SUA FAIXA DE CRÉDITO</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.azulEscuro }}>
              Faixa {resumo.faixa} — Juros de {resumo.juros} ao mês
            </p>
          </div>
        </div>

        {/* Grid de info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${C.cinzaBorda}` }}>
          {[
            { rotulo: "VALOR DISPONÍVEL", valor: "R$ 5.000 a R$ 30.000" },
            { rotulo: "PRAZO", valor: "24 a 60 parcelas" },
            { rotulo: "REFORMA ESCOLHIDA", valor: getServico(resumo.servico) },
            { rotulo: "ESTIMATIVA DE OBRA", valor: getValorFaixa(resumo.valor) },
          ].map(({ rotulo, valor }, i) => (
            <div key={rotulo} style={{
              padding: "14px 16px",
              borderRight: i % 2 === 0 ? `1px solid ${C.cinzaBorda}` : "none",
              borderBottom: i < 2 ? `1px solid ${C.cinzaBorda}` : "none",
            }}>
              <p style={{ fontSize: 10, color: "#888", fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>{rotulo}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.azulEscuro, lineHeight: 1.3 }}>{valor}</p>
            </div>
          ))}
        </div>

        {/* Passos */}
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>Próximos passos:</p>
          {[
            "Acesse o App CAIXA Tem ou vá a uma agência",
            "Faça a simulação com o valor da reforma",
            "Envie as fotos da casa (antes da obra)",
            "Receba 90% do valor e inicie a reforma",
            "Após concluir, envie as fotos do depois e receba os 10% restantes",
          ].map((passo, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <span style={{
                background: C.azul, color: C.branco, width: 22, height: 22,
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
              }}>{i + 1}</span>
              <p style={{ fontSize: 13, color: C.cinzaTexto, lineHeight: 1.5 }}>{passo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a href="#" style={{
        display: "block", textAlign: "center", padding: "15px",
        background: C.azul, color: C.branco, borderRadius: 8,
        fontWeight: 700, fontSize: 15, textDecoration: "none",
        boxShadow: "0 2px 10px rgba(19,81,180,0.3)", marginBottom: 10,
      }}>
        Abrir App CAIXA e simular agora
      </a>
      <a href="#" style={{
        display: "block", textAlign: "center", padding: "12px",
        background: C.branco, color: C.azul,
        border: `1.5px solid ${C.azul}`, borderRadius: 8,
        fontWeight: 600, fontSize: 14, textDecoration: "none", marginBottom: 16,
      }}>
        Encontrar agência mais próxima
      </a>

      {/* Aviso */}
      <div style={{ background: C.cinzaFundo, border: `1px solid ${C.cinzaBorda}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.cinzaTexto, lineHeight: 1.6 }}>
        <strong>Importante:</strong> Esta é uma pré-qualificação. A aprovação final depende de análise de crédito pela CAIXA. Resultado enviado para <strong>{lead.email}</strong>.
      </div>

      <button
        onClick={onReiniciar}
        style={{ width: "100%", background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: "6px 0" }}
      >
        Refazer o quiz
      </button>
    </div>
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
  const [etapa, setEtapa] = useState("quiz");   // quiz | lead | resultado | bloqueio
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [respostas, setRespostas] = useState<Record<number, OpcaoData>>({});
  const [lead, setLead] = useState<{ nome: string; email: string } | null>(null);
  const [motivoBloqueio, setMotivoBloqueio] = useState("");
  const [animando, setAnimando] = useState(false);

  const q = perguntas[perguntaAtual];

  const resumo = {
    faixa: respostas[2]?.faixa || "II",
    juros: respostas[2]?.juros || "1,95%",
    servico: respostas[3]?.id || "a",
    valor: respostas[4]?.id || "a",
  };

  const reiniciar = () => {
    setEtapa("quiz"); setPerguntaAtual(0); setSelecionada(null);
    setRespostas({}); setLead(null); setMotivoBloqueio(""); setAnimando(false);
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
      } else {
        setEtapa("lead");
      }
      setAnimando(false);
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

        {/* ── LEAD ── */}
        {etapa === "lead" && lead === null && (
          <FormLead
            resumo={resumo}
            onEnviar={(dados) => {
              // persistir dados relevantes da aprovação com base na escolha de valor
              const escolhaValor = respostas[4]?.id || "a";
              const mapaMedia: Record<string, number> = {
                a: (5000 + 10000) / 2,
                b: (10001 + 20000) / 2,
                c: (20001 + 30000) / 2,
                d: 30000,
              };
              const valorAprovado = mapaMedia[escolhaValor] || 15000;
              const aprovData = {
                nome: dados.nome,
                faixa: respostas[2]?.faixa || "I",
                jurosAm: parseFloat((respostas[2]?.juros || "1.17").replace(",", ".")) / 100,
                servico: respostas[3]?.id || "a",
                valorSolicitadoRange: respostas[4]?.id || "a",
                valorAprovado,
              };
              if (typeof window !== "undefined") {
                localStorage.setItem("aprovacaoData", JSON.stringify(aprovData));
              }
              setLead(dados);
              setEtapa("resultado");
            }}
          />
        )}

        {/* ── RESULTADO ── */}
        {etapa === "resultado" && lead && (
          <Resultado resumo={resumo} lead={lead} onReiniciar={reiniciar} />
        )}

        {/* ── BLOQUEIO ── */}
        {etapa === "bloqueio" && (
          <Bloqueio motivo={motivoBloqueio} onReiniciar={reiniciar} />
        )}

      </div>

    </div>
  );
}
