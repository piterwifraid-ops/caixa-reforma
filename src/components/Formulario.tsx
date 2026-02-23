import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

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
  vermelho:    "#e52207",
  vermelhoSub: "#fde8e6",
  cinzaFundo:  "#f8f9fa",
  cinzaBorda:  "#dee2e6",
  cinzaTexto:  "#555",
  cinzaLabel:  "#888",
  branco:      "#ffffff",
  texto:       "#1c1c1e",
};

// ─── Dados simulados do quiz (props reais viriam do componente pai) ────────────
const QUIZ_MOCK = [
  { pergunta: "Tipo de moradia",      resposta: "Moro na cidade (área urbana)", categoria: "MORADIA" },
  { pergunta: "Renda familiar bruta", resposta: "Até R$ 3.200,00 — Faixa I",   categoria: "RENDA"   },
  { pergunta: "Tipo de reforma",      resposta: "Elétrica / Hidráulica",         categoria: "OBRA"    },
  { pergunta: "Valor necessário",     resposta: "R$ 5.000 a R$ 10.000",          categoria: "VALOR"   },
];

// ─── Simulação de API CPF (mock — substitua por chamada real) ─────────────────
const buscarCPF = (cpf) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const cpfLimpo = cpf.replace(/\D/g, "");
      if (cpfLimpo === "00000000000") return reject("CPF não encontrado.");
      resolve({
        nome:          "Maria Aparecida dos Santos",
        dataNascimento:"12/04/1985",
        nomeMae:       "Ana Maria dos Santos",
        situacao:      "Regular",
        cpf:           cpfLimpo,
      });
    }, 1400);
  });

// ─── API ViaCEP ────────────────────────────────────────────────────────────────
const buscarCEP = (cep) =>
  fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`)
    .then((r) => r.json())
    .then((d) => {
      if (d.erro) throw new Error("CEP não encontrado.");
      return d;
    });

// ─── Máscaras ─────────────────────────────────────────────────────────────────
const mascaraCPF = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
};
const mascaraCEP = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0,5)}-${d.slice(5)}` : d;
};

// ─── Componentes Base ─────────────────────────────────────────────────────────

const SectionHeader = ({ numero, titulo, descricao }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%",
        background: C.azul, color: C.branco,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, flexShrink: 0,
      }}>{numero}</div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: C.azulEscuro, margin: 0 }}>{titulo}</h2>
    </div>
    {descricao && (
      <p style={{ fontSize: 13, color: C.cinzaTexto, marginLeft: 42, lineHeight: 1.5 }}>{descricao}</p>
    )}
    <div style={{ height: 2, background: C.azulClaro, marginTop: 12, borderRadius: 1 }} />
  </div>
);

const Campo = ({ label, obrigatorio, erro, children, dica, full }) => (
  <div style={{ flex: full ? "1 1 100%" : "1 1 calc(50% - 8px)", minWidth: 200 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 5 }}>
      {label}
      {obrigatorio && <span style={{ color: C.vermelho, marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {dica && !erro && (
      <p style={{ fontSize: 11, color: C.cinzaLabel, marginTop: 3 }}>{dica}</p>
    )}
    {erro && (
      <p style={{ fontSize: 11, color: C.vermelho, marginTop: 3, fontWeight: 500 }}>{erro}</p>
    )}
  </div>
);

const Input = ({ value, onChange, placeholder, disabled, erro, type = "text", maxLength }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    maxLength={maxLength}
    style={{
      width: "100%", padding: "10px 12px", borderRadius: 6,
      border: `1.5px solid ${erro ? C.vermelho : disabled ? "#d0d0d0" : C.cinzaBorda}`,
      fontSize: 14, color: disabled ? "#777" : C.texto,
      background: disabled ? "#f0f0f0" : erro ? C.vermelhoSub : C.branco,
      boxSizing: "border-box", outline: "none",
      cursor: disabled ? "not-allowed" : "text",
    }}
  />
);

const Select = ({ value, onChange, options, disabled, erro }) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    style={{
      width: "100%", padding: "10px 12px", borderRadius: 6,
      border: `1.5px solid ${erro ? C.vermelho : C.cinzaBorda}`,
      fontSize: 14, color: value ? C.texto : C.cinzaLabel,
      background: C.branco, boxSizing: "border-box", outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      appearance: "auto",
    }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const StatusBadge = ({ status }) => {
  const map = {
    Regular:    { bg: C.verdeClaro, color: C.verde,    texto: "Regular"    },
    Irregular:  { bg: C.vermelhoSub, color: C.vermelho, texto: "Irregular" },
    Pendente:   { bg: C.amareloSub, color: "#7a4d00",  texto: "Pendente"   },
  };
  const s = map[status] || map.Regular;
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 99,
      background: s.bg, color: s.color, fontSize: 12, fontWeight: 700,
    }}>{s.texto}</span>
  );
};

// ─── Header Gov ───────────────────────────────────────────────────────────────
const GovHeader = () => (
  <>
    <div style={{ background: C.azulEscuro, padding: "5px 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>gov.br</span>
        <div style={{ display: "flex", gap: 18 }}>
          {["Acesso à Informação", "Legislação", "Acessibilidade"].map(l => (
            <a key={l} href="#" style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
    <div style={{ background: C.branco, borderBottom: `3px solid ${C.azul}`, padding: "11px 0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <svg height="36" viewBox="0 0 200 48" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="34" fontFamily="Arial Black,sans-serif" fontSize="26" fontWeight="900" fill="#F5A623">CAIXA</text>
          <text x="0" y="46" fontFamily="Arial,sans-serif" fontSize="10" fill={C.azul}>ECONÔMICA FEDERAL</text>
        </svg>
        <div style={{ width: 1, height: 30, background: C.cinzaBorda }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.azulEscuro, lineHeight: 1.2 }}>Reforma Casa Brasil</p>
          <p style={{ fontSize: 11, color: C.cinzaTexto }}>Solicitação de Empréstimo</p>
        </div>
      </div>
    </div>
    <div style={{ background: C.branco, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "7px 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", fontSize: 12, color: "#666" }}>
        <a href="#" style={{ color: C.azul, textDecoration: "none" }}>Início</a>
        <span style={{ margin: "0 5px", color: "#bbb" }}>›</span>
        <a href="#" style={{ color: C.azul, textDecoration: "none" }}>Habitação</a>
        <span style={{ margin: "0 5px", color: "#bbb" }}>›</span>
        <a href="#" style={{ color: C.azul, textDecoration: "none" }}>Reforma Casa Brasil</a>
        <span style={{ margin: "0 5px", color: "#bbb" }}>›</span>
        <strong style={{ color: "#333" }}>Formulário de Solicitação</strong>
      </div>
    </div>
  </>
);

// ─── Stepper de Etapas ────────────────────────────────────────────────────────
const StepperTopo = ({ etapaAtual }) => {
  const etapas = [
    { n: 1, label: "Elegibilidade",  sub: "Concluído" },
    { n: 2, label: "Identificação",  sub: "CPF e dados" },
    { n: 3, label: "Endereço",       sub: "Local do imóvel" },
    { n: 4, label: "Confirmação",    sub: "Revisão e envio" },
  ];
  return (
    <div style={{ background: C.branco, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "16px 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
          {/* Linha de conexão */}
          <div style={{ position: "absolute", top: 14, left: "6%", right: "6%", height: 2, background: C.cinzaBorda, zIndex: 0 }} />
          {etapas.map((e) => {
            const feita = e.n < etapaAtual;
            const ativa = e.n === etapaAtual;
            return (
              <div key={e.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: feita ? C.verde : ativa ? C.azul : C.cinzaBorda,
                  color: feita || ativa ? C.branco : "#aaa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, border: ativa ? `3px solid ${C.azulEscuro}` : "none",
                  marginBottom: 6, transition: "all 0.3s",
                }}>
                  {feita ? "—" : e.n}
                </div>
                <p style={{ fontSize: 12, fontWeight: ativa ? 700 : 400, color: ativa ? C.azul : feita ? C.verde : "#aaa", textAlign: "center", lineHeight: 1.3 }}>{e.label}</p>
                <p style={{ fontSize: 10, color: "#bbb", textAlign: "center" }}>{e.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Seção 0: Resumo do Quiz ──────────────────────────────────────────────────
const ResumoQuiz = ({ respostas }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader numero="A" titulo="Respostas do Quiz de Elegibilidade" descricao="Dados informados durante a verificação de elegibilidade. Não é possível alterar esses campos nesta etapa." />
    <div style={{ background: C.verdeClaro, border: `1px solid ${C.verde}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.verde, flexShrink: 0 }} />
      <p style={{ fontSize: 13, color: "#1a5e1e", fontWeight: 600 }}>Perfil elegível para o programa Reforma Casa Brasil</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
      {respostas.map((r, i) => (
        <div key={i} style={{
          background: C.cinzaFundo, border: `1px solid ${C.cinzaBorda}`,
          borderRadius: 8, padding: "12px 14px",
          borderLeft: `3px solid ${C.azul}`,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.cinzaLabel, letterSpacing: 0.5, marginBottom: 4 }}>{r.categoria}</p>
          <p style={{ fontSize: 11, color: C.cinzaTexto, marginBottom: 2 }}>{r.pergunta}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.azulEscuro }}>{r.resposta}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Seção 1: Identificação via CPF ──────────────────────────────────────────
const SecaoCPF = ({ dadosCPF, setDadosCPF }) => {
  const { userData } = useUser();
  const [cpf, setCpf]           = useState("");
  const [status, setStatus]     = useState("idle"); // idle | loading | ok | erro
  const [mensagem, setMensagem] = useState("");

  // If userData is set in context (from /login), populate fields automatically
  useEffect(() => {
    if (userData && userData.cpf) {
      const formatted = mascaraCPF(userData.cpf);
      setCpf(formatted);
      setDadosCPF({
        nome: userData.nome || "",
        dataNascimento: userData.data_nascimento || "",
        nomeMae: userData.nome_mae || "",
        situacao: "Regular",
        cpf: userData.cpf.replace(/\D/g, ""),
      });
      setStatus("ok");
      setMensagem("");
    }
  }, [userData, setDadosCPF]);

  const consultar = async () => {
    const limpo = cpf.replace(/\D/g, "");
    if (limpo.length !== 11) { setMensagem("Digite um CPF válido com 11 dígitos."); setStatus("erro"); return; }
    setStatus("loading");
    setMensagem("");
    setDadosCPF(null);
    try {
      const dados = await buscarCPF(limpo);
      setDadosCPF(dados);
      setStatus("ok");
    } catch (e) {
      setStatus("erro");
      setMensagem(typeof e === "string" ? e : "Não foi possível consultar o CPF. Tente novamente.");
    }
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionHeader numero="1" titulo="Identificação do Solicitante" descricao="Informe o CPF do titular da solicitação. Os dados serão preenchidos automaticamente." />

      {/* CPF input removed as requested. */}

      {/* Aviso mock removido conforme solicitado */}

      {/* Dados retornados */}
      {dadosCPF && (
        <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 8, overflow: "hidden", animation: "entrar 0.3s ease" }}>
          <div style={{ background: C.azulFundo, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.azulEscuro }}>Dados encontrados na base da Receita Federal</p>
            <StatusBadge status={dadosCPF.situacao} />
          </div>
          <div style={{ padding: "16px", display: "flex", flexWrap: "wrap", gap: 16 }}>
            {[
              { rotulo: "CPF",              valor: dadosCPF.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") },
              { rotulo: "Nome completo",    valor: dadosCPF.nome },
              { rotulo: "Data de nascimento", valor: dadosCPF.dataNascimento },
              { rotulo: "Nome da mãe",     valor: dadosCPF.nomeMae },
            ].map(({ rotulo, valor }) => (
              <div key={rotulo} style={{ flex: "1 1 200px" }}>
                <p style={{ fontSize: 11, color: C.cinzaLabel, fontWeight: 600, letterSpacing: 0.4, marginBottom: 3 }}>{rotulo.toUpperCase()}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.texto }}>{valor}</p>
              </div>
            ))}
          </div>
          <div style={{ background: C.cinzaFundo, borderTop: `1px solid ${C.cinzaBorda}`, padding: "8px 16px" }}>
            <p style={{ fontSize: 11, color: C.cinzaTexto }}>
              Dados obtidos automaticamente. Se houver divergência, dirija-se a uma agência da CAIXA.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Seção 2: Dados Complementares ───────────────────────────────────────────
const SecaoDadosComplementares = ({ form, setForm, erros }) => {
  const atualizar = (campo) => (e) => setForm(f => ({ ...f, [campo]: e.target.value }));

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionHeader numero="2" titulo="Dados Complementares" descricao="Preencha os campos abaixo para complementar seu cadastro." />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        <Campo label="E-mail" obrigatorio erro={erros.email}>
          <Input value={form.email} onChange={atualizar("email")} placeholder="seu@email.com.br" type="email" erro={erros.email} />
        </Campo>
        <Campo label="WhatsApp / Telefone" obrigatorio erro={erros.telefone}>
          <Input value={form.telefone} onChange={atualizar("telefone")} placeholder="(11) 99999-9999" erro={erros.telefone} />
        </Campo>
        <Campo label="Tipo de imóvel" obrigatorio erro={erros.tipoImovel} full>
          <Select
            value={form.tipoImovel}
            onChange={atualizar("tipoImovel")}
            erro={erros.tipoImovel}
            options={[
              { value: "", label: "Selecione..." },
              { value: "proprio", label: "Imóvel próprio" },
              { value: "alugado", label: "Imóvel alugado" },
              { value: "cedido", label: "Imóvel cedido (de favor)" },
              { value: "financiado", label: "Imóvel financiado" },
            ]}
          />
        </Campo>
        <Campo label="Possui escritura ou contrato?" obrigatorio erro={erros.escritura}>
          <Select
            value={form.escritura}
            onChange={atualizar("escritura")}
            erro={erros.escritura}
            options={[
              { value: "", label: "Selecione..." },
              { value: "sim", label: "Sim, possuo documentação" },
              { value: "nao", label: "Não possuo escritura" },
              { value: "parcial", label: "Possuo apenas contrato de compra e venda" },
            ]}
          />
        </Campo>
      </div>
    </div>
  );
};

// ─── Seção 3: Endereço via CEP ────────────────────────────────────────────────
const SecaoEndereco = ({ end, setEnd, erros }) => {
  const [statusCEP, setStatusCEP] = useState("idle");
  const [erroCEP, setErroCEP]     = useState("");

  const consultarCEP = async (cep) => {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setStatusCEP("loading");
    setErroCEP("");
    try {
      const d = await buscarCEP(limpo);
      setEnd(prev => ({
        ...prev,
        logradouro: d.logradouro || "",
        bairro:     d.bairro     || "",
        cidade:     d.localidade || "",
        uf:         d.uf         || "",
      }));
      setStatusCEP("ok");
    } catch {
      setErroCEP("CEP não encontrado. Verifique e tente novamente.");
      setStatusCEP("erro");
    }
  };

  const atualizar = (campo) => (e) => setEnd(prev => ({ ...prev, [campo]: e.target.value }));

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionHeader numero="3" titulo="Endereço do Imóvel a ser Reformado" descricao="Informe o CEP para preenchimento automático. Confirme ou corrija os dados." />

      {/* CEP */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 200px" }}>
          <Campo label="CEP" obrigatorio erro={erroCEP || erros.cep}>
            <Input
              value={end.cep}
              onChange={e => {
                const v = mascaraCEP(e.target.value);
                setEnd(prev => ({ ...prev, cep: v }));
                setErroCEP("");
                setStatusCEP("idle");
                if (v.replace(/\D/g, "").length === 8) consultarCEP(v);
              }}
              placeholder="00000-000"
              maxLength={9}
              erro={erroCEP || erros.cep}
            />
          </Campo>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: (erroCEP || erros.cep) ? 18 : 0 }}>
          <div style={{ fontSize: 13, color: statusCEP === "ok" ? C.verde : statusCEP === "loading" ? C.azul : "transparent", fontWeight: 600, paddingBottom: 10 }}>
            {statusCEP === "loading" ? "Buscando endereço..." : statusCEP === "ok" ? "Endereço encontrado" : ""}
          </div>
        </div>
      </div>

      {/* Campos de endereço */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        <Campo label="Logradouro (Rua, Avenida, etc.)" obrigatorio full erro={erros.logradouro}>
          <Input
            value={end.logradouro}
            onChange={atualizar("logradouro")}
            placeholder="Ex: Rua das Flores"
            disabled={statusCEP === "loading"}
            erro={erros.logradouro}
          />
        </Campo>

        <Campo label="Número" obrigatorio erro={erros.numero}>
          <Input value={end.numero} onChange={atualizar("numero")} placeholder="Ex: 123" erro={erros.numero} />
        </Campo>
        <Campo label="Complemento" erro={erros.complemento}>
          <Input value={end.complemento} onChange={atualizar("complemento")} placeholder="Apto, Bloco, Casa..." />
        </Campo>

        <Campo label="Bairro" obrigatorio erro={erros.bairro}>
          <Input value={end.bairro} onChange={atualizar("bairro")} placeholder="Nome do bairro" disabled={statusCEP === "loading"} erro={erros.bairro} />
        </Campo>
        <Campo label="Cidade" obrigatorio erro={erros.cidade}>
          <Input value={end.cidade} onChange={atualizar("cidade")} placeholder="Cidade" disabled={statusCEP === "loading"} erro={erros.cidade} />
        </Campo>

        <Campo label="UF" obrigatorio erro={erros.uf}>
          <Select
            value={end.uf}
            onChange={atualizar("uf")}
            erro={erros.uf}
            options={[
              { value: "", label: "Selecione..." },
              ...["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
                  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]
                .map(u => ({ value: u, label: u }))
            ]}
          />
        </Campo>

        <Campo label="Ponto de referência" full>
          <Input value={end.referencia} onChange={atualizar("referencia")} placeholder="Ex: Próximo ao mercado central" />
        </Campo>
      </div>
    </div>
  );
};

// ─── Seção 4: Declaração e Envio ──────────────────────────────────────────────
const SecaoDeclaracao = ({ aceite, setAceite, erros }) => (
  <div style={{ marginBottom: 28 }}>
    <SectionHeader numero="4" titulo="Declaração e Envio" descricao="Leia atentamente antes de enviar sua solicitação." />

    <div style={{ background: C.cinzaFundo, border: `1px solid ${C.cinzaBorda}`, borderRadius: 8, padding: "16px", marginBottom: 16, fontSize: 13, color: C.cinzaTexto, lineHeight: 1.7 }}>
      <p style={{ fontWeight: 700, color: C.texto, marginBottom: 8 }}>Declaro para os devidos fins que:</p>
      <ul style={{ paddingLeft: 18 }}>
        <li>As informações prestadas neste formulário são verdadeiras e de minha inteira responsabilidade.</li>
        <li>Estou ciente de que a prestação de informações falsas pode implicar em responsabilidade civil e criminal.</li>
        <li>O imóvel informado está localizado em área urbana e não está em zona de risco.</li>
        <li>Autorizo a Caixa Econômica Federal a consultar meu histórico de crédito para fins de análise desta solicitação.</li>
        <li>Estou ciente de que esta solicitação não garante a aprovação do empréstimo, sujeita à análise de crédito.</li>
      </ul>
    </div>

    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={aceite}
        onChange={e => setAceite(e.target.checked)}
        style={{ width: 16, height: 16, marginTop: 2, cursor: "pointer", accentColor: C.azul }}
      />
      <span style={{ fontSize: 13, color: C.texto, lineHeight: 1.5 }}>
        Li e concordo com os termos da declaração acima e autorizo o tratamento dos meus dados conforme a{" "}
        <a href="#" style={{ color: C.azul }}>Lei Geral de Proteção de Dados (LGPD)</a>.
        <span style={{ color: C.vermelho }}> *</span>
      </span>
    </label>
    {erros.aceite && <p style={{ fontSize: 12, color: C.vermelho, marginTop: 6 }}>{erros.aceite}</p>}
  </div>
);

// ─── Tela de Sucesso ──────────────────────────────────────────────────────────
const TelaSucesso = ({ protocolo, onReiniciar }) => (
  <div style={{ animation: "entrar 0.4s ease" }}>
    <div style={{ background: C.verdeClaro, border: `1.5px solid ${C.verde}`, borderRadius: 10, padding: "32px 28px", textAlign: "center", marginBottom: 20 }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.verde, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.verde, marginBottom: 8 }}>Solicitação enviada com sucesso!</h2>
      <p style={{ fontSize: 14, color: "#1a5e1e", marginBottom: 16, lineHeight: 1.6 }}>
        Sua solicitação foi recebida pela CAIXA e está em análise. Você receberá um retorno em até 3 dias úteis pelo e-mail e WhatsApp informados.
      </p>
      <div style={{ background: C.branco, borderRadius: 8, padding: "12px 20px", display: "inline-block" }}>
        <p style={{ fontSize: 11, color: C.cinzaLabel, marginBottom: 3 }}>NÚMERO DE PROTOCOLO</p>
        <p style={{ fontSize: 20, fontWeight: 800, color: C.azulEscuro, letterSpacing: 1 }}>{protocolo}</p>
      </div>
    </div>

    <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.azulEscuro, marginBottom: 12 }}>Próximos passos:</p>
      {[
        "Guarde o número de protocolo — você precisará dele para acompanhar sua solicitação.",
        "Aguarde contato da CAIXA via e-mail ou WhatsApp em até 3 dias úteis.",
        "Se aprovado, você receberá orientações para envio de documentos e fotos do imóvel.",
        "Após assinatura do contrato, 90% do valor será liberado para início da obra.",
      ].map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <span style={{ background: C.azul, color: C.branco, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</span>
          <p style={{ fontSize: 13, color: C.cinzaTexto, lineHeight: 1.5 }}>{p}</p>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <a href="#" style={{ flex: 1, display: "block", textAlign: "center", padding: "13px", background: C.azul, color: C.branco, borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
        Acompanhar solicitação
      </a>
      <button onClick={onReiniciar} style={{ flex: 1, padding: "13px", background: C.branco, color: C.azul, border: `1.5px solid ${C.azul}`, borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
        Nova solicitação
      </button>
    </div>
  </div>
);

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function FormularioSolicitacao({ respostasQuiz }) {
  const respostas = respostasQuiz || QUIZ_MOCK;
  const navigate = useNavigate();

  const [dadosCPF, setDadosCPF] = useState(null);
  const [form, setForm]         = useState({ email: "", telefone: "", tipoImovel: "", escritura: "" });
  const [end, setEnd]           = useState({ cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "", referencia: "" });
  const [aceite, setAceite]     = useState(false);
  const [erros, setErros]       = useState({});
  const [enviando, setEnviando] = useState(false);
  const [protocolo, setProtocolo] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(2);

  // Avança stepper conforme preenchimento
  useEffect(() => {
    if (protocolo) { setEtapaAtual(4); return; }
    if (aceite)    { setEtapaAtual(4); return; }
    if (end.logradouro) { setEtapaAtual(4); return; }
    if (dadosCPF)  { setEtapaAtual(3); return; }
    setEtapaAtual(2);
  }, [dadosCPF, end.logradouro, aceite, protocolo]);

  const validar = () => {
    const e = {};
    if (!dadosCPF)              e.cpf        = "Consulte o CPF antes de enviar.";
    if (!form.email.includes("@")) e.email   = "E-mail inválido.";
    if (!form.telefone)         e.telefone   = "Informe um telefone.";
    if (!form.tipoImovel)       e.tipoImovel = "Selecione o tipo do imóvel.";
    if (!form.escritura)        e.escritura  = "Selecione uma opção.";
    if (!end.cep || end.cep.replace(/\D/g,"").length < 8) e.cep = "CEP inválido.";
    if (!end.logradouro)        e.logradouro = "Informe o logradouro.";
    if (!end.numero)            e.numero     = "Informe o número.";
    if (!end.bairro)            e.bairro     = "Informe o bairro.";
    if (!end.cidade)            e.cidade     = "Informe a cidade.";
    if (!end.uf)                e.uf         = "Selecione o estado.";
    if (!aceite)                e.aceite     = "Você deve aceitar os termos para prosseguir.";
    setErros(e);
    return !Object.keys(e).length;
  };

  const enviar = () => {
    if (!validar()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      navigate("/aprovacao");
    }, 1800);
  };

  const reiniciar = () => {
    setDadosCPF(null); setForm({ email: "", telefone: "", tipoImovel: "", escritura: "" });
    setEnd({ cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "", referencia: "" });
    setAceite(false); setErros({}); setProtocolo(null); setEtapaAtual(2);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: C.cinzaFundo, minHeight: "100vh", color: C.texto }}>
      <style>{`
        @keyframes entrar { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input, select { font-family: inherit; }
        input:focus, select:focus { outline: none; border-color: ${C.azul} !important; box-shadow: 0 0 0 3px ${C.azulClaro}; }
        a { color: ${C.azul}; }
        @media (max-width: 600px) {
          .grid-campos { flex-direction: column !important; }
        }
      `}</style>

      <StepperTopo etapaAtual={etapaAtual} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px", display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── Coluna principal ── */}
        <div style={{ flex: "1 1 580px" }}>

          {!protocolo ? (
            <>
              {/* Alerta de erros */}
              {Object.keys(erros).length > 0 && (
                <div style={{ background: C.vermelhoSub, border: `1.5px solid ${C.vermelho}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, animation: "entrar 0.3s ease" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.vermelho, marginBottom: 6 }}>Corrija os campos obrigatórios antes de enviar:</p>
                  <ul style={{ paddingLeft: 18, fontSize: 13, color: "#8a0000" }}>
                    {Object.values(erros).map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}

              <ResumoQuiz respostas={respostas} />
              <SecaoCPF dadosCPF={dadosCPF} setDadosCPF={setDadosCPF} />
              <SecaoDadosComplementares form={form} setForm={setForm} erros={erros} />
              <SecaoEndereco end={end} setEnd={setEnd} erros={erros} />
              <SecaoDeclaracao aceite={aceite} setAceite={setAceite} erros={erros} />

              {/* Botão de envio */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button style={{ padding: "12px 24px", background: C.branco, color: C.azul, border: `1.5px solid ${C.azul}`, borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  Salvar rascunho
                </button>
                <button
                  onClick={enviar}
                  disabled={enviando}
                  style={{
                    padding: "12px 32px", borderRadius: 6, border: "none",
                    background: enviando ? "#aaa" : C.azul,
                    color: C.branco, fontSize: 15, fontWeight: 700,
                    cursor: enviando ? "not-allowed" : "pointer",
                    boxShadow: enviando ? "none" : "0 2px 8px rgba(19,81,180,0.3)",
                  }}
                >
                  {enviando ? "Enviando solicitação..." : "Enviar solicitação"}
                </button>
              </div>
            </>
          ) : (
            <TelaSucesso protocolo={protocolo} onReiniciar={reiniciar} />
          )}
        </div>

        
      </div>

      {/* footer removed per request */}
    </div>
  );
}
