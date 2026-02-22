import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  cinzaFundo:  "#f8f9fa",
  cinzaBorda:  "#dee2e6",
  cinzaTexto:  "#555",
  cinzaLabel:  "#888",
  branco:      "#ffffff",
  texto:       "#1c1c1e",
};

// ─── Dados mock (viriam do formulário anterior) ────────────────────────────────
const DADOS_MOCK = {
  nome:            "Maria Aparecida dos Santos",
  cpf:             "***.456.789-**",
  valorSolicitado: 15000,
  valorAprovado:   15000,
  faixa:           "I",
  jurosAm:         0.0117,
  servico:         "Elétrica / Hidráulica",
  endereco:        "Rua das Flores, 123 — Bairro Centro, São Paulo/SP",
};

// ─── Cálculo de parcela (Price) ────────────────────────────────────────────────
const calcParcela = (pv, taxaAm, n) => {
  if (taxaAm === 0) return pv / n;
  const fator = Math.pow(1 + taxaAm, n);
  return (pv * taxaAm * fator) / (fator - 1);
};

const fmt = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtN = (v, dec = 2) => v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// Gov header removed per user request.

// ─── Stepper ──────────────────────────────────────────────────────────────────
const Stepper = () => {
  const etapas = [
    { n: 1, label: "Elegibilidade"  },
    { n: 2, label: "Identificação"  },
    { n: 3, label: "Endereço"       },
    { n: 4, label: "Análise"        },
    { n: 5, label: "Parcelas"       },
    { n: 6, label: "Contratação"    },
  ];
  const atual = 5;
  return (
    <div style={{ background: C.branco, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "14px 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
          <div style={{ position: "absolute", top: 13, left: "4%", right: "4%", height: 2, background: C.cinzaBorda, zIndex: 0 }} />
          {etapas.map((e) => {
            const feita = e.n < atual;
            const ativa = e.n === atual;
            return (
              <div key={e.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: feita ? C.verde : ativa ? C.azul : C.cinzaBorda,
                  color: feita || ativa ? C.branco : "#aaa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  border: ativa ? `3px solid ${C.azulEscuro}` : "2px solid transparent",
                  marginBottom: 5, transition: "all 0.3s",
                }}>
                  {feita ? "—" : e.n}
                </div>
                <p style={{ fontSize: 10, fontWeight: ativa ? 700 : 400, color: ativa ? C.azul : feita ? C.verde : "#aaa", textAlign: "center" }}>{e.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Banner de Aprovação ──────────────────────────────────────────────────────
const BannerAprovacao = ({ dados }) => {
  const aprovado   = dados.valorAprovado;
  const solicitado = dados.valorSolicitado;
  const parcial    = aprovado < solicitado;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.azulEscuro} 0%, ${C.azul} 100%)`,
      borderRadius: 12, overflow: "hidden", marginBottom: 24,
      boxShadow: "0 4px 20px rgba(19,81,180,0.18)",
    }}>
      {/* Faixa de status */}
      <div style={{ background: parcial ? C.amarelo : C.verde, padding: "8px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.branco, flexShrink: 0 }} />
        <p style={{ fontSize: 13, fontWeight: 700, color: C.branco }}>
          {parcial ? "Aprovação parcial — valor diferente do solicitado" : "Crédito aprovado — valor total liberado"}
        </p>
      </div>

      <div style={{ padding: "28px 28px 24px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
        {/* Valor aprovado destaque */}
        <div style={{ flex: "1 1 240px" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>
            VALOR APROVADO PARA REFORMA
          </p>
          <p style={{ fontSize: 42, fontWeight: 800, color: C.branco, lineHeight: 1, marginBottom: 6 }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aprovado)}
          </p>
          {parcial && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
              Você solicitou {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(solicitado)}. O valor aprovado é inferior após análise de crédito.
            </p>
          )}
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: C.branco, fontSize: 12, padding: "4px 12px", borderRadius: 99, fontWeight: 600 }}>
              Faixa {dados.faixa}
            </span>
            <span style={{ background: "rgba(255,255,255,0.15)", color: C.branco, fontSize: 12, padding: "4px 12px", borderRadius: 99, fontWeight: 600 }}>
              { (dados.jurosAm * 100).toFixed(2) }% a.m.
            </span>
            <span style={{ background: "rgba(255,255,255,0.15)", color: C.branco, fontSize: 12, padding: "4px 12px", borderRadius: 99, fontWeight: 600 }}>
              Sem tarifas
            </span>
          </div>
        </div>

        {/* Info do solicitante */}
        <div style={{ flex: "0 0 220px", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "16px 18px" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 10, fontWeight: 600, letterSpacing: 0.4 }}>SOLICITANTE</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.branco, marginBottom: 4 }}>{dados.nome}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>CPF: {dados.cpf}</p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 8, marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 3 }}>REFORMA</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{dados.servico}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Simulador de Parcelas ────────────────────────────────────────────────────
const SimuladorParcelas = ({ valor, jurosAm, onConfirmar }) => {
  const opcoesPrazo = [24, 30, 36, 42, 48, 54, 60];
  const [prazo, setPrazo]       = useState(36);
  const [confirmado, setConfirmado] = useState(false);
  const simRef = useRef(null);

  const parcela    = calcParcela(valor, jurosAm, prazo);
  const totalPago  = parcela * prazo;
  const totalJuros = totalPago - valor;
  const cet        = (Math.pow(totalPago / valor, 12 / prazo) - 1) * 100;

  // Primeira parcela = 30 dias após, recalcula após receber os 10% restantes
  const parcelaInicial  = calcParcela(valor * 0.9, jurosAm, prazo);
  const parcelaFinal    = calcParcela(valor, jurosAm, prazo);

  useEffect(() => {
    if (confirmado && simRef.current) {
      simRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [confirmado]);

  return (
    <div ref={simRef}>
      <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>

        {/* Cabeçalho */}
        <div style={{ background: C.azulFundo, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.azul, color: C.branco, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>2</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.azulEscuro }}>Escolha o número de parcelas</p>
            <p style={{ fontSize: 12, color: C.cinzaTexto }}>Selecione o prazo que melhor cabe no seu orçamento</p>
          </div>
        </div>

        <div style={{ padding: "22px 20px" }}>

          {/* Grade de opções de prazo */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: 24 }}>
            {opcoesPrazo.map((n) => {
              const p = calcParcela(valor, jurosAm, n);
              const ativo = n === prazo;
              return (
                <button
                  key={n}
                  onClick={() => { setPrazo(n); setConfirmado(false); }}
                  style={{
                    padding: "14px 8px", borderRadius: 8, cursor: "pointer",
                    border: `2px solid ${ativo ? C.azul : C.cinzaBorda}`,
                    background: ativo ? C.azul : C.branco,
                    textAlign: "center", transition: "all 0.18s ease",
                    boxShadow: ativo ? `0 2px 12px rgba(19,81,180,0.25)` : "none",
                  }}
                >
                  <p style={{ fontSize: 18, fontWeight: 800, color: ativo ? C.branco : C.azulEscuro, marginBottom: 2 }}>{n}x</p>
                  <p style={{ fontSize: 11, color: ativo ? "rgba(255,255,255,0.85)" : C.cinzaTexto, lineHeight: 1.3 }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Painel de detalhes da simulação */}
          <div style={{
            background: C.azulFundo, border: `1.5px solid ${C.azulClaro}`,
            borderRadius: 10, overflow: "hidden", marginBottom: 20,
            animation: "entrar 0.25s ease",
          }} key={prazo}>

            {/* Destaque da parcela escolhida */}
            <div style={{ background: C.azul, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: 0.4, marginBottom: 4 }}>VALOR DA PARCELA</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: C.branco, lineHeight: 1 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parcela)}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>por mês durante {prazo} meses</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>1ª parcela em</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.branco }}>30 dias após contratação</p>
              </div>
            </div>

            {/* Detalhamento financeiro */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 0 }}>
              {[
                { rotulo: "Valor financiado",   valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor),       sub: "100% aprovado" },
                { rotulo: "Total de parcelas",   valor: `${prazo}x`,      sub: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parcela) + " cada" },
                { rotulo: "Total a pagar",       valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPago),   sub: "Principal + juros" },
                { rotulo: "Total em juros",      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalJuros),  sub: fmtN(cet) + "% a.a. (CET)" },
              ].map(({ rotulo, valor: v, sub }, i) => (
                <div key={rotulo} style={{
                  padding: "14px 16px",
                  borderRight: (i % 2 === 0 && i < 3) ? `1px solid ${C.azulClaro}` : "none",
                  borderTop: i >= 2 ? `1px solid ${C.azulClaro}` : "none",
                }}>
                  <p style={{ fontSize: 10, color: C.cinzaLabel, fontWeight: 600, letterSpacing: 0.4, marginBottom: 4 }}>{rotulo.toUpperCase()}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: C.azulEscuro, marginBottom: 2 }}>{v}</p>
                  <p style={{ fontSize: 11, color: C.cinzaTexto }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Aviso sobre recalculo após os 10% */}
          <div style={{ background: C.amareloSub, borderLeft: `3px solid ${C.amarelo}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#5a3e00", lineHeight: 1.6 }}>
            <strong>Atenção:</strong> Você receberá 90% ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor * 0.9)}) ao contratar e começará a pagar a 1ª parcela após 30 dias.
            Após enviar as fotos da obra concluída, os 10% restantes ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor * 0.1)}) serão liberados e as parcelas serão recalculadas.
          </div>

          {/* Tabela de amortização resumida */}
          <details style={{ marginBottom: 20 }}>
            <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.azul, padding: "8px 0", userSelect: "none", listStyle: "none" }}>
              Ver demonstrativo de parcelas (primeiras e últimas)
            </summary>
            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: C.azulFundo }}>
                    { ["Parcela", "Saldo devedor", "Amortização", "Juros", "Valor da parcela"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.azulEscuro, fontWeight: 700, borderBottom: `2px solid ${C.cinzaBorda}`, whiteSpace: "nowrap" }}>{h}</th>
                    )) }
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const rows = [];
                    let saldo = valor;
                    const taxa = jurosAm;
                    const pmt  = calcParcela(valor, taxa, prazo);

                    const renderRow = (i) => {
                      const jurosMes   = saldo * taxa;
                      const amort      = pmt - jurosMes;
                      const saldoAntes = saldo;
                      saldo -= amort;
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.cinzaBorda}`, background: i % 2 === 0 ? C.cinzaFundo : C.branco }}>
                          <td style={{ padding: "7px 12px", fontWeight: 600, color: C.azulEscuro }}>{i}</td>
                          <td style={{ padding: "7px 12px" }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoAntes)}</td>
                          <td style={{ padding: "7px 12px" }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amort)}</td>
                          <td style={{ padding: "7px 12px", color: "#c44" }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(jurosMes)}</td>
                          <td style={{ padding: "7px 12px", fontWeight: 700 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pmt)}</td>
                        </tr>
                      );
                    };

                    // Recalcular saldo para mostrar linhas corretas
                    saldo = valor;
                    for (let i = 1; i <= prazo; i++) {
                      const jurosMes = saldo * taxa;
                      const amort    = pmt - jurosMes;
                      if (i <= 3 || i >= prazo - 2) rows.push(renderRow(i));
                      else if (i === 4) rows.push(
                        <tr key="dots"><td colSpan={5} style={{ padding: "6px 12px", color: C.cinzaLabel, fontSize: 11, textAlign: "center" }}>...</td></tr>
                      );
                      saldo -= amort;
                    }
                    return rows;
                  })()}
                </tbody>
              </table>
            </div>
          </details>

          {/* Botão de confirmação */}
          {!confirmado ? (
            <button
              onClick={() => { setConfirmado(true); onConfirmar({ prazo, parcela, totalPago, totalJuros }); }}
              style={{
                width: "100%", padding: "15px", borderRadius: 8, border: "none",
                background: C.azul, color: C.branco,
                fontSize: 16, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 3px 12px rgba(19,81,180,0.3)",
                transition: "background 0.2s",
              }}
            >
              Confirmar {prazo} parcelas de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parcela)} →
            </button>
          ) : (
            <div style={{ background: C.verdeClaro, border: `1.5px solid ${C.verde}`, borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, animation: "entrar 0.3s ease" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.verde, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.verde }}>Parcelas confirmadas: {prazo}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parcela)}</p>
                <p style={{ fontSize: 12, color: "#1a5e1e" }}>Prossiga para revisar o contrato e assinar digitalmente.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Resumo da Solicitação ────────────────────────────────────────────────────
const ResumoSolicitacao = ({ dados }) => (
  <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
    <div style={{ background: C.azulFundo, borderBottom: `1px solid ${C.cinzaBorda}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.azul, color: C.branco, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>1</div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.azulEscuro }}>Resumo da sua solicitação</p>
        <p style={{ fontSize: 12, color: C.cinzaTexto }}>Dados informados nas etapas anteriores</p>
      </div>
    </div>
    <div style={{ padding: "18px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { rotulo: "Solicitante",      valor: dados.nome          },
          { rotulo: "CPF",              valor: dados.cpf           },
          { rotulo: "Valor aprovado",   valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dados.valorAprovado), destaque: true },
          { rotulo: "Taxa de juros",    valor: `${(dados.jurosAm * 100).toFixed(2)}% a.m. (Faixa ${dados.faixa})` },
          { rotulo: "Tipo de reforma",  valor: dados.servico       },
          { rotulo: "Imóvel",           valor: dados.endereco, full: true },
        ].map(({ rotulo, valor, destaque, full }) => (
          <div key={rotulo} style={{ ...(full ? { gridColumn: "1 / -1" } : {}) }}>
            <p style={{ fontSize: 10, color: C.cinzaLabel, fontWeight: 600, letterSpacing: 0.4, marginBottom: 4 }}>{rotulo.toUpperCase()}</p>
            <p style={{ fontSize: destaque ? 18 : 14, fontWeight: destaque ? 800 : 500, color: destaque ? C.azulEscuro : C.texto, lineHeight: 1.3 }}>{valor}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Painel lateral removed per user request.

// ─── Botão de Prosseguir ──────────────────────────────────────────────────────
const RodapeAcao = ({ simulacao, dados }) => {
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  if (!simulacao) return null;
  return (
    <div style={{ background: C.branco, border: `1px solid ${C.cinzaBorda}`, borderRadius: 12, padding: "20px 24px", animation: "entrar 0.3s ease" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: 13, color: C.cinzaTexto, marginBottom: 4 }}>Você escolheu</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: C.azulEscuro }}>
            {simulacao.prazo}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacao.parcela)}
          </p>
          <p style={{ fontSize: 12, color: C.cinzaTexto }}>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulacao.totalPago)} · Taxa: {(dados.jurosAm * 100).toFixed(2)}% a.m.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={{ padding: "12px 22px", borderRadius: 7, border: `1.5px solid ${C.azul}`, background: C.branco, color: C.azul, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Voltar
          </button>
          <button
            onClick={() => { setEnviando(true); navigate('/chat'); }}
            disabled={enviando}
            style={{
              padding: "12px 28px", borderRadius: 7, border: "none",
              background: enviando ? "#aaa" : C.verde,
              color: C.branco, fontSize: 15, fontWeight: 700,
              cursor: enviando ? "not-allowed" : "pointer",
              boxShadow: enviando ? "none" : `0 3px 12px rgba(22,136,33,0.3)`,
            }}
          >
            {enviando ? "Processando..." : "Prosseguir para contrato"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function PaginaAprovacao({ dadosSolicitacao = null }) {
  let dados = dadosSolicitacao || DADOS_MOCK;
  // tentar ler dados de aprovação salvos pelo quiz (localStorage)
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("aprovacaoData");
      if (raw) {
        const saved = JSON.parse(raw);
        dados = {
          ...dados,
          nome: saved.nome || dados.nome,
          valorAprovado: saved.valorAprovado || dados.valorAprovado,
          faixa: saved.faixa || dados.faixa,
          jurosAm: typeof saved.jurosAm === "number" ? saved.jurosAm : dados.jurosAm,
          servico: saved.servico ? (saved.servico === "a" ? "Elétrica / Hidráulica" : saved.servico) : dados.servico,
        };
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  const [simulacao, setSimulacao] = useState(null);

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: C.cinzaFundo, minHeight: "100vh", color: C.texto }}>
      <style>{`
        @keyframes entrar { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        button:hover:not(:disabled) { filter: brightness(0.93); }
        details summary::-webkit-details-marker { display: none; }
        details summary::before { content: "+ "; color: ${C.azul}; }
        details[open] summary::before { content: "- "; }
      `}</style>

      <Stepper />

      {/* Hero de status */}
      <div style={{ background: C.azulEscuro, padding: "14px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: 0.5 }}>ETAPA 5 DE 6</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.branco }}>Confira a aprovação e escolha suas parcelas</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Protocolo de análise</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.branco }}>ANA-{Date.now().toString().slice(-7)}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px 50px", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* Coluna principal */}
        <div style={{ flex: "1 1 580px" }}>
          <BannerAprovacao dados={dados} />
          <ResumoSolicitacao dados={dados} />
          <SimuladorParcelas
            valor={dados.valorAprovado}
            jurosAm={dados.jurosAm}
            onConfirmar={(s) => setSimulacao(s)}
          />
          <RodapeAcao simulacao={simulacao} dados={dados} />
        </div>

        {/* Coluna lateral (removida) */}
      </div>

      {/* Footer */}
      <div style={{ background: C.azul, color: "rgba(255,255,255,0.8)", padding: "20px", textAlign: "center", fontSize: 12 }}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
          {["Sobre a Caixa", "Fale Conosco", "Ouvidoria", "Acessibilidade", "Mapa do Site"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <p>© 2025 Caixa Econômica Federal. Todos os direitos reservados.</p>
        <p style={{ marginTop: 6, fontSize: 11 }}>SAC 0800 726 0101 · Ouvidoria 0800 725 7474 · Deficiente auditivo/fala 0800 726 2492</p>
      </div>
    </div>
  );
}
