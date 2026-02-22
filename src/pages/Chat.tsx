import { useState, useEffect, useRef } from "react";

// ─── Paleta Gov.br ─────────────────────────────────────────────────────────────
const C = {
  azul:        "#1351b4",
  azulEscuro:  "#003D82",
  azulClaro:   "#d4e3ff",
  azulFundo:   "#edf2fb",
  amarelo:     "#F5A623",
  amareloSub:  "#fff8e8",
  verde:       "#168821",
  verdeClaro:  "#e3f5e1",
  verdeBorda:  "#9dd69f",
  cinzaFundo:  "#f4f5f7",
  cinzaBorda:  "#dee2e6",
  cinzaTexto:  "#555",
  cinzaLabel:  "#888",
  branco:      "#ffffff",
  texto:       "#1c1c1e",
  bolhaAgente: "#ffffff",
  bolhaUser:   "#1351b4",
};

// ─── Agente ───────────────────────────────────────────────────────────────────
const AGENTE = {
  nome:  "Agente CAIXA",
  cargo: "Analista de Habitação",
  id:    "AGT-4821",
};

// ─── Tipos de cômodo ──────────────────────────────────────────────────────────
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

// ─── Fluxo de conversa ────────────────────────────────────────────────────────
const FLUXO = [
  {
    id:      "boas_vindas",
    tipo:    "agente",
    delay:   600,
    texto:   (dados) =>
      `Olá, ${dados.nomeUsuario || "boa tarde"}! Sou ${AGENTE.nome}, analista de habitação responsável pelo acompanhamento da sua solicitação do programa Reforma Casa Brasil.\n\nSua solicitação de empréstimo foi aprovada. Para prosseguirmos com a liberação do crédito, preciso que você envie as fotos do imóvel antes do início da obra.`,
  },
  {
    id:      "orientacao",
    tipo:    "agente",
    delay:   1200,
    texto:   () =>
      `Essas fotos são obrigatórias e comprovam o estado atual do imóvel. Elas serão comparadas com as fotos do "depois", que você enviará ao finalizar a reforma.\n\nVamos começar? Qual cômodo ou área você vai reformar primeiro?`,
    acao:    "selecionar_comodo",
  },
];

// ─── Formatar hora ───────────────────────────────────────────────────────────
const hora = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

// ─── Avatar do agente ─────────────────────────────────────────────────────────
const AvatarAgente = ({ tamanho = 36 }) => (
  <div style={{
    width: tamanho, height: tamanho, borderRadius: "50%", flexShrink: 0,
    background: `linear-gradient(135deg, ${C.azulEscuro}, ${C.azul})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(19,81,180,0.3)",
  }}>
    <svg width={tamanho * 0.55} height={tamanho * 0.55} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="white" opacity="0.9" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
    </svg>
  </div>
);

// ─── Bolha do agente ──────────────────────────────────────────────────────────
const BolhaAgente = ({ texto, horario, animando }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, animation: "entrar 0.3s ease" }}>
    <AvatarAgente />
    <div style={{ maxWidth: "75%", minWidth: 60 }}>
      <p style={{ fontSize: 10, color: C.cinzaLabel, marginBottom: 4, fontWeight: 600 }}>
        {AGENTE.nome} · {horario}
      </p>
      <div style={{
        background: C.bolhaAgente, border: `1px solid ${C.cinzaBorda}`,
        borderRadius: "0 12px 12px 12px", padding: "12px 14px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
      }}>
        {animando ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 2px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%", background: C.cinzaBorda,
                animation: `piscar 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: C.texto, lineHeight: 1.6, whiteSpace: "pre-line" }}>{texto}</p>
        )}
      </div>
    </div>
  </div>
);

// ─── Bolha do usuário ─────────────────────────────────────────────────────────
const BolhaUsuario = ({ texto, horario }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "flex-end", marginBottom: 16, animation: "entrar 0.3s ease" }}>
    <div style={{ maxWidth: "70%" }}>
      <p style={{ fontSize: 10, color: C.cinzaLabel, marginBottom: 4, textAlign: "right", fontWeight: 600 }}>
        Você · {horario}
      </p>
      <div style={{
        background: C.bolhaUser, borderRadius: "12px 12px 0 12px",
        padding: "12px 14px", boxShadow: "0 1px 6px rgba(19,81,180,0.2)",
      }}>
        <p style={{ fontSize: 14, color: C.branco, lineHeight: 1.6 }}>{texto}</p>
      </div>
    </div>
    <div style={{
      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
      background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill={C.cinzaTexto} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.cinzaTexto} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

// ─── Card de foto enviada ─────────────────────────────────────────────────────
const CardFoto = ({ foto, onRemover }) => (
  <div style={{
    position: "relative", borderRadius: 8, overflow: "hidden",
    border: `2px solid ${C.verde}`, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    width: 90, height: 90, flexShrink: 0,
  }}>
    <img src={foto.preview} alt={foto.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(0,0,0,0.55)", padding: "3px 5px",
    }}>
      <p style={{ fontSize: 9, color: C.branco, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{foto.nome}</p>
    </div>
    {onRemover && (
      <button onClick={onRemover} style={{
        position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: "50%",
        background: "rgba(229,34,7,0.9)", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", color: C.branco, fontSize: 11, fontWeight: 700,
      }}>×</button>
    )}
  </div>
);

// ─── Bolha de fotos enviadas ──────────────────────────────────────────────────
const BolhaFotos = ({ fotos, comodo, horario }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "flex-end", marginBottom: 16, animation: "entrar 0.3s ease" }}>
    <div style={{ maxWidth: "80%" }}>
      <p style={{ fontSize: 10, color: C.cinzaLabel, marginBottom: 4, textAlign: "right", fontWeight: 600 }}>
        Você · {horario}
      </p>
      <div style={{
        background: C.bolhaUser, borderRadius: "12px 12px 0 12px",
        padding: "12px 14px",
      }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>
          {fotos.length} foto{fotos.length > 1 ? "s" : ""} — {comodo}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {fotos.map((f, i) => (
            <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 6, overflow: "hidden" }}>
              <img src={f.preview} alt={f.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill={C.cinzaTexto} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.cinzaTexto} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

// ─── Seletor de opções ────────────────────────────────────────────────────────
const SeletorOpcoes = ({ opcoes, onSelecionar, multiplo = false, titulo }) => {
  const [selecionados, setSelecionados] = useState([]);

  const toggleOpcao = (op) => {
    if (!multiplo) { onSelecionar([op]); return; }
    setSelecionados(prev =>
      prev.includes(op) ? prev.filter(x => x !== op) : [...prev, op]
    );
  };

  return (
    <div style={{ animation: "entrar 0.3s ease", marginBottom: 16 }}>
      {titulo && <p style={{ fontSize: 12, color: C.cinzaTexto, marginBottom: 8, fontWeight: 600 }}>{titulo}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: multiplo && selecionados.length > 0 ? 10 : 0 }}>
        {opcoes.map(op => (
          <button
            key={op}
            onClick={() => toggleOpcao(op)}
            style={{
              padding: "8px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              border: `1.5px solid ${selecionados.includes(op) ? C.azul : C.cinzaBorda}`,
              background: selecionados.includes(op) ? C.azulClaro : C.branco,
              color: selecionados.includes(op) ? C.azulEscuro : C.cinzaTexto,
              fontWeight: selecionados.includes(op) ? 700 : 400,
              transition: "all 0.15s ease",
            }}
          >
            {op}
          </button>
        ))}
      </div>
      {multiplo && selecionados.length > 0 && (
        <button
          onClick={() => onSelecionar(selecionados)}
          style={{
            padding: "9px 20px", borderRadius: 8, background: C.azul,
            color: C.branco, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}
        >
          Confirmar seleção ({selecionados.length})
        </button>
      )}
    </div>
  );
};

// ─── Zona de upload de fotos ──────────────────────────────────────────────────
const ZonaUpload = ({ comodo, tipoReforma, onEnviar, onCancelar }) => {
  const [fotos, setFotos]       = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef                = useRef(null);

  const processarArquivos = (arquivos) => {
    const novos = Array.from(arquivos)
      .filter(f => f.type.startsWith("image/"))
      .map(f => ({ arquivo: f, nome: f.name, preview: URL.createObjectURL(f) }));
    setFotos(prev => [...prev, ...novos].slice(0, 10));
  };

  const remover = (i) => setFotos(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div style={{ animation: "entrar 0.3s ease", marginBottom: 16 }}>
      {/* Info do cômodo */}
      <div style={{ background: C.amareloSub, border: `1px solid ${C.amarelo}`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
        <p style={{ fontWeight: 700, color: "#5a3e00", marginBottom: 2 }}>Enviando fotos de:</p>
        <p style={{ color: "#3d2a00" }}>{comodo} — <span style={{ color: C.cinzaTexto }}>{tipoReforma}</span></p>
      </div>

      {/* Instrucoes */}
      <div style={{ background: C.azulFundo, border: `1px solid ${C.azulClaro}`, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: C.azulEscuro, fontWeight: 600, marginBottom: 4 }}>Dicas para boas fotos:</p>
        <ul style={{ paddingLeft: 16, fontSize: 12, color: C.cinzaTexto, lineHeight: 1.7 }}>
          <li>Fotografe toda a extensão do problema, não apenas um ponto</li>
          <li>Tire fotos de pelo menos 2 ângulos diferentes</li>
          <li>Garanta boa iluminação — acenda as luzes se necessário</li>
          <li>Mínimo de 2 fotos por cômodo, máximo de 10</li>
        </ul>
      </div>

      {/* Zona de drag & drop */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); processarArquivos(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? C.azul : C.cinzaBorda}`,
          borderRadius: 10, padding: "24px 16px", textAlign: "center",
          background: dragOver ? C.azulFundo : C.cinzaFundo,
          cursor: "pointer", transition: "all 0.2s ease", marginBottom: 12,
        }}
      >
        <input
          ref={inputRef} type="file" accept="image/*" multiple
          style={{ display: "none" }}
          onChange={e => processarArquivos(e.target.files)}
        />
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8, opacity: 0.5 }}>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={C.azul} strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke={C.azul} strokeWidth="1.5" />
          <path d="M21 15l-5-5L5 21" stroke={C.azul} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.azulEscuro, marginBottom: 4 }}>
          Toque para selecionar fotos
        </p>
        <p style={{ fontSize: 12, color: C.cinzaTexto }}>ou arraste e solte aqui · JPG, PNG · Máx. 10 fotos</p>
      </div>

      {/* Prévia das fotos */}
      {fotos.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: C.cinzaTexto, marginBottom: 8, fontWeight: 600 }}>
            {fotos.length} foto{fotos.length > 1 ? "s" : ""} selecionada{fotos.length > 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {fotos.map((f, i) => (
              <CardFoto key={i} foto={f} onRemover={() => remover(i)} />
            ))}
          </div>
        </div>
      )}

      {/* Ações */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onCancelar}
          style={{ flex: 1, padding: "10px", borderRadius: 7, border: `1.5px solid ${C.cinzaBorda}`, background: C.branco, color: C.cinzaTexto, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Cancelar
        </button>
        <button
          onClick={() => fotos.length >= 2 && onEnviar(fotos)}
          disabled={fotos.length < 2}
          style={{
            flex: 2, padding: "10px", borderRadius: 7, border: "none",
            background: fotos.length >= 2 ? C.azul : C.cinzaBorda,
            color: C.branco, fontSize: 13, fontWeight: 700,
            cursor: fotos.length >= 2 ? "pointer" : "not-allowed",
            transition: "background 0.2s",
          }}
        >
          {fotos.length < 2
            ? `Adicione mais ${2 - fotos.length} foto${2 - fotos.length > 1 ? "s" : ""}`
            : `Enviar ${fotos.length} foto${fotos.length > 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
};

// ─── Status de protocolo ──────────────────────────────────────────────────────
const StatusProtocolo = ({ fotos }) => {
  const total = fotos.reduce((s, g) => s + g.fotos.length, 0);
  return (
    <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 10, overflow: "hidden", marginBottom: 16, animation: "entrar 0.3s ease" }}>
      <div style={{ background: C.azulFundo, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.azulEscuro }}>Fotos enviadas nesta sessão</p>
        <span style={{ background: C.azul, color: C.branco, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99 }}>
          {total} foto{total !== 1 ? "s" : ""}
        </span>
      </div>
      <div style={{ padding: "10px 14px" }}>
        {fotos.map((g, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < fotos.length - 1 ? `1px solid ${C.cinzaBorda}` : "none" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.texto }}>{g.comodo}</p>
              <p style={{ fontSize: 11, color: C.cinzaTexto }}>{g.tipoReforma}</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.verde }}>
              {g.fotos.length} foto{g.fotos.length !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Header do chat ───────────────────────────────────────────────────────────
const HeaderChat = ({ online }) => (
  <div style={{ background: `linear-gradient(135deg, ${C.azulEscuro}, ${C.azul})`, padding: "0" }}>
    {/* Topo gov */}
    <div style={{ background: "rgba(0,0,0,0.2)", padding: "4px 16px", display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>gov.br</span>
      <div style={{ display: "flex", gap: 12 }}>
        {["Acesso à Informação", "Acessibilidade"].map(l => (
          <a key={l} href="#" style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>{l}</a>
        ))}
      </div>
    </div>

    {/* Info do agente */}
    <div style={{ padding: "14px 16px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative" }}>
        <AvatarAgente tamanho={46} />
        <div style={{
          position: "absolute", bottom: 1, right: 1, width: 11, height: 11,
          borderRadius: "50%", background: online ? "#4caf50" : "#9e9e9e",
          border: "2px solid white",
        }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.branco, lineHeight: 1.2 }}>{AGENTE.nome}</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{AGENTE.cargo} · ID {AGENTE.id}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: online ? "#4caf50" : "#9e9e9e" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{online ? "Disponível" : "Ocupado"}</span>
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>Reforma Casa Brasil</p>
      </div>
    </div>

    {/* Breadcrumb */}
    <div style={{ background: "rgba(0,0,0,0.15)", padding: "6px 16px", fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
      Início › Habitação › Reforma Casa Brasil › Envio de Fotos
    </div>
  </div>
);

// ─── APP PRINCIPAL ───────────────────────────────────────────────────────────
export default function ChatBot({ nomeUsuario = "Maria Aparecida" }) {
  const [mensagens, setMensagens]         = useState([]);
  const [fase, setFase]                   = useState("aguardando"); // aguardando | comodo | tipo_reforma | upload | mais_comodos | concluido
  const [comodoAtual, setComodoAtual]     = useState(null);
  const [tipoReforma, setTipoReforma]     = useState(null);
  const [fotosEnviadas, setFotosEnviadas] = useState([]); // [{comodo, tipoReforma, fotos}]
  const [digitando, setDigitando]         = useState(false);
  const [inputTexto, setInputTexto]       = useState("");
  const [online]                          = useState(true);
  const fimRef                            = useRef(null);
  const inputRef                          = useRef(null);

  // Scroll automático
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, digitando, fase]);

  // Mensagem do agente com delay e animação de digitação
  const agenteDiz = (texto, delay = 600) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDigitando(true);
        setTimeout(() => {
          setDigitando(false);
          setMensagens(prev => [...prev, {
            tipo: "agente", texto, horario: hora(), id: Date.now(),
          }]);
          resolve();
        }, 1200 + texto.length * 12);
      }, delay);
    });
  };

  // Mensagem do usuário
  const usuarioDiz = (texto) => {
    setMensagens(prev => [...prev, {
      tipo: "usuario", texto, horario: hora(), id: Date.now(),
    }]);
  };

  // Fotos do usuário
  const usuarioEnviaFotos = (fotos, comodo, tipoRef) => {
    setMensagens(prev => [...prev, {
      tipo: "fotos", fotos, comodo, tipoRef, horario: hora(), id: Date.now(),
    }]);
  };

  // Início da conversa
  useEffect(() => {
    const iniciar = async () => {
      await agenteDiz(
        `Olá, ${nomeUsuario}! Sou o ${AGENTE.nome}, analista de habitação responsável pelo acompanhamento da sua solicitação do programa Reforma Casa Brasil.\n\nSua solicitação de empréstimo foi aprovada! Para darmos continuidade à liberação do crédito, preciso que você envie as fotos do imóvel antes de iniciar a obra — são as fotos do \"Antes\".`,
        800
      );
      await agenteDiz(
        `Essas fotos são obrigatórias e comprovam o estado atual do imóvel. Elas serão comparadas com as fotos do \"Depois\", que você enviará ao concluir a reforma.\n\nVamos começar. Por favor, me diga: qual é o cômodo ou área que você pretende reformar?`,
        400
      );
      setFase("comodo");
    };
    iniciar();
  }, []);

  // Usuário seleciona cômodo
  const handleComodo = async (opcoes) => {
    const comodo = opcoes[0];
    setComodoAtual(comodo);
    usuarioDiz(comodo);
    setFase("aguardando");
    await agenteDiz(`Entendido — ${comodo}. E qual é o tipo de problema ou reforma que será realizada neste local?`, 300);
    setFase("tipo_reforma");
  };

  // Usuário seleciona tipo de reforma
  const handleTipoReforma = async (opcoes) => {
    const tipo = opcoes[0];
    setTipoReforma(tipo);
    usuarioDiz(tipo);
    setFase("aguardando");
    await agenteDiz(
      `Perfeito. Agora preciso que você envie as fotos de \"${comodoAtual}\" mostrando o problema de ${tipo.toLowerCase()}.\n\nLembre-se:\n• Mínimo 2 fotos por cômodo\n• Fotografe toda a extensão do problema\n• Pelo menos 2 ângulos diferentes\n• Boa iluminação é essencial`,
      300
    );
    setFase("upload");
  };

  // Usuário envia fotos
  const handleFotos = async (fotos) => {
    usuarioEnviaFotos(fotos, comodoAtual, tipoReforma);
    const grupo = { comodo: comodoAtual, tipoReforma, fotos };
    const novasFotos = [...fotosEnviadas, grupo];
    setFotosEnviadas(novasFotos);
    setFase("aguardando");

    await agenteDiz(
      `Recebi ${fotos.length} foto${fotos.length > 1 ? "s" : ""} de \"${comodoAtual}\" — ${tipoReforma}. Obrigado!\n\nVocê tem mais algum cômodo ou área para registrar?`,
      300
    );
    setFase("mais_comodos");
  };

  // Mais cômodos ou finalizar
  const handleMaisComodos = async (resposta) => {
    usuarioDiz(resposta);
    setFase("aguardando");
    if (resposta === "Sim, tenho mais áreas") {
      setComodoAtual(null);
      setTipoReforma(null);
      await agenteDiz("Ótimo! Qual é o próximo cômodo ou área?", 300);
      setFase("comodo");
    } else {
      const total = fotosEnviadas.reduce((s, g) => s + g.fotos.length, 0);
      await agenteDiz(
        `Perfeito! Vou registrar o encerramento do envio das fotos do \"Antes\".\n\nResumo do envio:\n• ${fotosEnviadas.length} cômodo${fotosEnviadas.length > 1 ? "s" : ""} registrado${fotosEnviadas.length > 1 ? "s" : ""}\n• ${total} fotos no total\n\nSuas fotos foram registradas com sucesso no protocolo da sua solicitação. Você pode iniciar a reforma assim que receber o depósito em conta.`,
        300
      );
      await agenteDiz(
        `Após concluir a reforma, você deverá retornar a este canal e enviar as fotos do \"Depois\" dos mesmos cômodos fotografados hoje.\n\nCaso tenha dúvidas, entre em contato pelo SAC 0800 726 0101. Bom trabalho na reforma, ${nomeUsuario.split(" ")[0]}!`,
        600
      );
      setFase("concluido");
    }
  };

  // Envio de texto livre
  const handleEnvioTexto = () => {
    if (!inputTexto.trim()) return;
    usuarioDiz(inputTexto);
    setInputTexto("");
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: C.cinzaFundo, minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 0 30px",
    }}>
      <style>{`
        @keyframes entrar { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes piscar {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        input { font-family: inherit; }
        button:hover:not(:disabled) { filter: brightness(0.92); }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.cinzaBorda}; border-radius: 2px; }
      `}</style>

      {/* Container do chat */}
      <div style={{
        width: "100%", maxWidth: 560,
        background: C.branco,
        display: "flex", flexDirection: "column",
        minHeight: "100vh",
        boxShadow: "0 0 40px rgba(0,0,0,0.1)",
      }}>

        {/* Header */}
        <HeaderChat online={online} />

        {/* Protocolo */}
        <div style={{ background: C.amareloSub, borderBottom: `1px solid #f0d090`, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 11, color: "#5a3e00", fontWeight: 600 }}>Protocolo de envio de fotos</p>
          <p style={{ fontSize: 11, color: "#5a3e00", fontWeight: 700 }}>RCB-{Date.now().toString().slice(-7)}</p>
        </div>

        {/* Área de mensagens */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px" }}>

          {/* Data */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ background: C.cinzaBorda, color: C.cinzaTexto, fontSize: 11, padding: "3px 12px", borderRadius: 99 }}>
              Hoje, {hora()}
            </span>
          </div>

          {/* Mensagens */}
          {mensagens.map((m) => {
            if (m.tipo === "agente") return <BolhaAgente key={m.id} texto={m.texto} horario={m.horario} />;
            if (m.tipo === "usuario") return <BolhaUsuario key={m.id} texto={m.texto} horario={m.horario} />;
            if (m.tipo === "fotos") return <BolhaFotos key={m.id} fotos={m.fotos} comodo={m.comodo} horario={m.horario} />;
            return null;
          })}

          {/* Indicador de digitação */}
          {digitando && <BolhaAgente texto="" horario={hora()} animando />}

          {/* Controles interativos por fase */}
          {!digitando && (
            <div>
              {fase === "comodo" && (
                <SeletorOpcoes
                  opcoes={COMODOS}
                  onSelecionar={handleComodo}
                  titulo="Selecione o cômodo ou área:"
                />
              )}

              {fase === "tipo_reforma" && (
                <SeletorOpcoes
                  opcoes={TIPOS_REFORMA}
                  onSelecionar={handleTipoReforma}
                  titulo="Selecione o tipo de reforma:"
                />
              )}

              {fase === "upload" && (
                <ZonaUpload
                  comodo={comodoAtual}
                  tipoReforma={tipoReforma}
                  onEnviar={handleFotos}
                  onCancelar={() => setFase("tipo_reforma")}
                />
              )}

              {fase === "mais_comodos" && (
                <>
                  {fotosEnviadas.length > 0 && <StatusProtocolo fotos={fotosEnviadas} />}
                  <SeletorOpcoes
                    opcoes={["Sim, tenho mais áreas", "Não, concluí o envio"]}
                    onSelecionar={(ops) => handleMaisComodos(ops[0])}
                    titulo="Deseja registrar mais áreas?"
                  />
                </>
              )}

              {fase === "concluido" && (
                <div style={{ animation: "entrar 0.4s ease" }}>
                  {fotosEnviadas.length > 0 && <StatusProtocolo fotos={fotosEnviadas} />}
                  <div style={{ background: C.verdeClaro, border: `1.5px solid ${C.verde}`, borderRadius: 10, padding: "16px", textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.verde, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.verde, marginBottom: 4 }}>Envio concluído!</p>
                    <p style={{ fontSize: 13, color: "#1a5e1e", lineHeight: 1.5 }}>Suas fotos foram registradas com sucesso. Aguarde a liberação do crédito para iniciar a obra.</p>
                    <button
                      onClick={() => window.location.reload()}
                      style={{ marginTop: 14, padding: "10px 24px", borderRadius: 7, background: C.azul, color: C.branco, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                    >
                      Nova sessão
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={fimRef} />
        </div>

        {/* Rodapé do chat */}
        <div style={{ borderTop: `1px solid ${C.cinzaBorda}`, padding: "10px 12px", background: C.branco }}>
          {/* Input de texto */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input
              ref={inputRef}
              value={inputTexto}
              onChange={e => setInputTexto(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEnvioTexto()}
              placeholder="Digite uma mensagem para o agente..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 20,
                border: `1.5px solid ${C.cinzaBorda}`, fontSize: 13,
                background: C.cinzaFundo, color: C.texto,
              }}
            />
            <button
              onClick={handleEnvioTexto}
              disabled={!inputTexto.trim()}
              style={{
                width: 38, height: 38, borderRadius: "50%", border: "none",
                background: inputTexto.trim() ? C.azul : C.cinzaBorda,
                color: C.branco, cursor: inputTexto.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p style={{ fontSize: 10, color: C.cinzaLabel, textAlign: "center" }}>
            Atendimento oficial CAIXA · Reforma Casa Brasil · Protocolo seguro
          </p>
        </div>
      </div>
    </div>
  );
}
