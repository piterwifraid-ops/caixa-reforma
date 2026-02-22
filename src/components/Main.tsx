import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const navigate = useNavigate();
  const styles = `
    .rcb-hero { background: linear-gradient(135deg, #003D82 0%, #1351b4 50%, #0072c6 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
    .rcb-hero p { color: rgba(255,255,255,0.9); font-size: 15px; max-width: 600px; margin: 0 auto 25px; position: relative; }
    .rcb-btn-primary { display: inline-block; background: #fff; color: #1351b4; padding: 14px 40px; border-radius: 4px; font-weight: 700; font-size: 15px; text-decoration: none; border: 2px solid #1351b4; cursor: pointer; transition: all .2s; }
    .rcb-btn-primary:hover { background: #f0f0f0; }
    .rcb-section { background: #fff; padding: 40px 20px; border-bottom: 1px solid #eee; }
    .rcb-section.gray { background: #f7f8fa; }
    .rcb-container { max-width: 1100px; margin: 0 auto; }
    .rcb-section-title { color: #1351b4; font-size: 22px; font-weight: 700; margin-bottom: 20px; border-left: 4px solid #f5a623; padding-left: 12px; }
    .rcb-steps { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; margin-top: 20px; }
    .rcb-step { flex: 1; min-width: 250px; max-width: 320px; text-align: center; }
    .rcb-step-number { color: #f5a623; font-size: 18px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; justify-content: center; }
    .rcb-step-number::before { content: ""; font-size: 12px; }
    .rcb-step p { color: #555; font-size: 14px; line-height: 1.6; }
    .rcb-video-wrap { display: flex; justify-content: center; padding: 10px 0; }
    .rcb-video-wrap iframe { width: 100%; max-width: 700px; height: 394px; border: none; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .rcb-o-que-e p { font-size: 15px; line-height: 1.8; margin-bottom: 15px; }
    .rcb-o-que-e strong { color: #1351b4; }
    .rcb-cta-box { background: #f0f6ff; border-left: 4px solid #1351b4; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; font-weight: 700; color: #1351b4; font-size: 15px; }
    .rcb-cards-faixa { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px; }
    .rcb-card-faixa { flex: 1; min-width: 240px; background: #f0f6ff; border: 1px solid #c5d9f5; border-radius: 8px; padding: 20px; }
    .rcb-card-faixa h4 { color: #1351b4; font-size: 16px; margin-bottom: 8px; }
    .rcb-card-faixa p { color: #444; font-size: 14px; }
    .rcb-two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .rcb-info-box { background: #f7f8fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .rcb-info-box h4 { color: #1351b4; font-size: 16px; margin-bottom: 12px; font-weight: 700; }
    .rcb-info-list { list-style: none; }
    .rcb-info-list li { font-size: 14px; padding: 6px 0 6px 20px; position: relative; line-height: 1.5; }
    .rcb-info-list li::before { content: ""; color: #f5a623; position: absolute; left: 4px; font-size: 16px; }
    .rcb-tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .rcb-tag { background: #fff; border: 1px solid #dde; border-radius: 20px; padding: 4px 12px; font-size: 12px; color: #555; }
    .rcb-valor-info { background: #1351b4; color: #fff; padding: 16px 24px; border-radius: 8px; margin-bottom: 24px; font-size: 16px; }
    .rcb-valor-info strong { font-size: 20px; }
    table.rcb-servicos { width: 100%; border-collapse: collapse; margin-top: 10px; }
    table.rcb-servicos th { background: #1351b4; color: #fff; padding: 12px 16px; text-align: left; font-size: 14px; }
    table.rcb-servicos td { padding: 12px 16px; border-bottom: 1px solid #e0e8f5; font-size: 14px; vertical-align: top; }
    table.rcb-servicos tr:nth-child(even) td { background: #eaf2fb; }
    table.rcb-servicos tr:hover td { background: #d8eaf8; }
    table.rcb-servicos td:first-child { width: 40px; color: #1351b4; font-weight: 700; }
    table.rcb-servicos td:nth-child(2) { font-weight: 600; width: 200px; }
    .rcb-pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    .rcb-pricing-item { background: #f0f6ff; border: 1px solid #c5d9f5; border-radius: 8px; padding: 20px; text-align: center; }
    .rcb-pricing-item h4 { color: #1351b4; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .rcb-pricing-item .rcb-value { font-size: 22px; font-weight: 700; color: #003D82; }
    .rcb-pricing-item .rcb-sub { font-size: 12px; color: #777; margin-top: 5px; }
    .rcb-step-item { display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid #eee; align-items: flex-start; }
    .rcb-step-item:last-child { border-bottom: none; }
    .rcb-step-num { background: #1351b4; color: #fff; font-weight: 700; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
    .rcb-step-item p { font-size: 14px; line-height: 1.6; padding-top: 5px; }
    .rcb-step-item strong { color: #1351b4; }
    .rcb-obs { background: #fff8e1; border-left: 4px solid #f5a623; padding: 12px 16px; margin-top: 16px; font-size: 13px; border-radius: 0 6px 6px 0; }
    .rcb-cta-final { background: linear-gradient(135deg, #003D82, #1351b4); padding: 50px 20px; text-align: center; }
    .rcb-cta-final h2 { color: #fff; font-size: 26px; margin-bottom: 12px; }
    .rcb-cta-final p { color: rgba(255,255,255,0.85); margin-bottom: 24px; }
    .rcb-btn-white { background: #fff; color: #1351b4; padding: 14px 44px; border-radius: 4px; font-weight: 700; font-size: 16px; text-decoration: none; display: inline-block; border: 2px solid #fff; transition: all .2s; cursor: pointer; }
    .rcb-btn-white:hover { background: #e8f0fe; }
    @media(max-width:700px){
      .rcb-steps { flex-direction: column; align-items: center; }
      .rcb-video-wrap iframe { height: 220px; }
      .rcb-pricing-grid { grid-template-columns: 1fr; }
      .rcb-two-cols { grid-template-columns: 1fr; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <main style={{ flexGrow: 1, fontFamily: "'Open Sans', sans-serif", color: '#333', fontSize: '15px' }}>

        {/* Breadcrumb */}
        <div style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '8px 0' }}>
          <div className="rcb-container" style={{ padding: '0 20px', fontSize: '12px', color: '#666' }}>
            <a href="#" style={{ color: '#1351b4', textDecoration: 'none' }}>Início</a>
            <span style={{ margin: '0 5px' }}></span>
            <a href="#" style={{ color: '#1351b4', textDecoration: 'none' }}>Habitação</a>
            <span style={{ margin: '0 5px' }}></span>
            <strong>Reforma Casa Brasil</strong>
          </div>
        </div>

        {/* Hero */}
        <div className="rcb-hero">
          <img
            src="https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/reforma-casa-brasil/programa-reforma-casa-brasil/@@govbr.institucional.banner/c8f173dd-f063-4bcc-bc81-b57e11c29106/@@images/d1015c0e-b264-41d3-9a5c-4a14c9ed0ee5.png"
            alt="Banner do Programa Reforma Casa Brasil"
            style={{ maxWidth: '648px', width: '100%', borderRadius: '8px', marginBottom: '20px', display: 'block', margin: '0 auto 20px' }}
          />
          <p>Financiamento com recursos do Fundo Social para reforma e melhoria da sua casa em área urbana</p>
          <button onClick={() => navigate('/login')} className="rcb-btn-primary">Simule e Contrate</button>
        </div>

        {/* Steps */}
        <div className="rcb-section">
          <div className="rcb-container">
            <div className="rcb-steps">
              <div className="rcb-step">
                <div style={{ background: '#e8f4ff', borderRadius: '8px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img src="https://www.caixa.gov.br/voce/habitacao/reforma-casa-brasil/PublishingImages/reforma-casal-01-370x160.jpg" alt="Simulação" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
                <div className="rcb-step-number">Passo 1: Faça uma simulação</div>
                <p>Identifique o valor das prestações que cabe no seu orçamento, confira os juros, o valor final e decida com tranquilidade.</p>
              </div>
              <div className="rcb-step">
                <div style={{ background: '#e8f4ff', borderRadius: '8px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img src="https://www.caixa.gov.br/voce/habitacao/reforma-casa-brasil/PublishingImages/reforma-casal-02-370x160.jpg" alt="Solicite o empréstimo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
                <div className="rcb-step-number">Passo 2: Solicite o empréstimo</div>
                <p>Responda algumas perguntas simples sobre a estrutura do imóvel que vai reformar e o local onde ele está.</p>
              </div>
              <div className="rcb-step">
                <div style={{ background: '#e8f4ff', borderRadius: '8px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img src="https://www.caixa.gov.br/voce/habitacao/reforma-casa-brasil/PublishingImages/reforma-casal-03-370x160.jpg" alt="Acompanhe a solicitação" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
                <div className="rcb-step-number">Passo 3: Acompanhe a solicitação</div>
                <p>Verifique o andamento do seu pedido.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="rcb-section gray">
          <div className="rcb-container">
            <div className="rcb-video-wrap">
              <iframe
                src="https://www.youtube-nocookie.com/embed/TBSE1smeMRU?si=rds1FkvnuAKWvQfB"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* O que é */}
        <div className="rcb-section rcb-o-que-e" id="o-que-e">
          <div className="rcb-container">
            <h2 className="rcb-section-title">O que é</h2>
            <p>O <strong>Programa Reforma Casa Brasil</strong> é um empréstimo para reformar sua casa e melhorar as condições de vida para você e para sua família.</p>
            <p>O objetivo é investir em conforto, segurança, acessibilidade e condições de moradia digna.</p>
            <div className="rcb-cta-box">
              Contrate pelo App CAIXA ou em uma agência.<br />
              As contratações pelo App CAIXA Tem começam dia 17/11/2025.
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button onClick={() => navigate('/login')} className="rcb-btn-primary" id="simule">Simule e contrate</button>
            </div>
          </div>
        </div>

        {/* Quem pode participar */}
        <div className="rcb-section gray">
          <div className="rcb-container">
            <h2 className="rcb-section-title">Quem pode participar</h2>
            <p style={{ marginBottom: '20px' }}>Para contratar, é necessário residir em área urbana, possuir <strong>renda mensal bruta familiar de até R$&nbsp;9.600,00</strong>  classificadas em duas faixas  e ter uma avaliação de crédito aprovada:</p>
            <div className="rcb-cards-faixa">
              <div className="rcb-card-faixa">
                <h4>Faixa I</h4>
                <p>Renda bruta familiar mensal <strong>até R$&nbsp;3.200,00</strong></p>
              </div>
              <div className="rcb-card-faixa">
                <h4>Faixa II</h4>
                <p>Renda bruta familiar mensal <strong>de R$&nbsp;3.200,01 até R$&nbsp;9.600,00</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Minha casa pode participar */}
        <div className="rcb-section">
          <div className="rcb-container">
            <h2 className="rcb-section-title">Minha casa pode participar</h2>
            <div className="rcb-two-cols">
              <div>
                <div className="rcb-info-box">
                  <h4>Mesmo que:</h4>
                  <ul className="rcb-info-list">
                    <li>Você não tenha a escritura do imóvel.</li>
                    <li>Você alugue ou more de favor.</li>
                    <li>A casa não seja do Programa Minha Casa, Minha Vida.</li>
                  </ul>
                </div>
                <div className="rcb-info-box">
                  <h4>A casa pode ser:</h4>
                  <ul className="rcb-info-list">
                    <li><strong>Residencial:</strong> onde você mora; ou</li>
                    <li><strong>Mista:</strong> usada também como espaço de trabalho.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* O que é cobrado */}
        <div className="rcb-section">
          <div className="rcb-container">
            <h2 className="rcb-section-title">O que é cobrado</h2>
            <div className="rcb-pricing-grid">
              <div className="rcb-pricing-item">
                <h4>Valor</h4>
                <div className="rcb-value">R$&nbsp;5.000 a R$&nbsp;30.000</div>
                <div className="rcb-sub">Valor do empréstimo</div>
              </div>
              <div className="rcb-pricing-item">
                <h4>Juros  Faixa I</h4>
                <div className="rcb-value">1,17% a.m.</div>
                <div className="rcb-sub">Renda até R$&nbsp;3.200,00</div>
              </div>
              <div className="rcb-pricing-item">
                <h4>Juros  Faixa II</h4>
                <div className="rcb-value">1,95% a.m.</div>
                <div className="rcb-sub">Renda R$&nbsp;3.200,01  R$&nbsp;9.600,00</div>
              </div>
              <div className="rcb-pricing-item">
                <h4>Prazo</h4>
                <div className="rcb-value">24 a 60</div>
                <div className="rcb-sub">parcelas para pagar</div>
              </div>
            </div>
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#555' }}> Não tem taxas e tarifas.</p>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button onClick={() => navigate('/login')} className="rcb-btn-primary">Simule e contrate</button>
            </div>
          </div>
        </div>

        {/* Como funciona */}
        <div className="rcb-section gray">
          <div className="rcb-container">
            <h2 className="rcb-section-title">Como funciona</h2>
            <div>
              {[
                <p>Você pode começar por aqui, <strong>a partir de 03/11/2025</strong>, simulando uma proposta e verificando se atende aos critérios do programa.</p>,
                <p>Responda perguntas sobre sua casa.</p>,
                <p>Escolha até 3 serviços dos serviços da lista.</p>,
                <p>Informe o valor que vai precisar.</p>,
                <p>Atualize seus dados.</p>,
                <p>Confira se o valor foi aprovado e escolha a quantidade de parcelas para pagar.</p>,
                <p>Tire fotos dos lugares que serão reformados  Fotos do &ldquo;Antes&rdquo;.</p>,
                <p>Receba 90% do valor do empréstimo.</p>,
                <p>Comece a pagar a primeira parcela depois de 30 dias.</p>,
                <p>Faça a obra  em até 55 dias.</p>,
                <p>Envie as fotos da reforma concluída  Fotos do &ldquo;Depois&rdquo;.</p>,
                <p>Receba os 10% restantes do valor.</p>,
              ].map((content, idx) => (
                <div key={idx} className="rcb-step-item">
                  <div className="rcb-step-num">{idx + 1}</div>
                  {content}
                </div>
              ))}
            </div>
            <div className="rcb-obs">
              <strong>Observação:</strong> As parcelas serão recalculadas após o recebimento do valor completo do empréstimo.
            </div>
          </div>
        </div>

        {/* O que pode ser reformado */}
        <div className="rcb-section">
          <div className="rcb-container">
            <h2 className="rcb-section-title">O que pode ser reformado</h2>
            <div className="rcb-valor-info">
              O valor do empréstimo pode ser de <strong>R$&nbsp;5.000,00 até R$&nbsp;30.000,00</strong>
            </div>
            <p style={{ color: 'rgb(19, 81, 180)', marginBottom: '16px', fontWeight: '600' }}>
              Verifique os serviços disponíveis abaixo.
            </p>
            <table className="rcb-servicos">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Descrição dos Serviços</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Pequenas instalações ou trocas</td>
                  <td>Instalar ou trocar maçanetas, torneiras, sifões, chuveiros, tomadas, luminárias, lâmpadas e outros</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Elétrica</td>
                  <td>Instalar ou trocar fios, quadro de energia e entrada de luz</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Hidráulica</td>
                  <td>Instalar ou trocar tubulação de água ou esgoto, caixa d'água e/ou fossa</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Corrigir ou prevenir infiltrações</td>
                  <td>Prevenir infiltrações em pisos, lajes, paredes e/ou muros</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Revestimento</td>
                  <td>Instalar ou trocar pisos e/ou azulejos</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Reboco e pintura</td>
                  <td>Rebocar e/ou pintar paredes, tetos e/ou muros</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>Portas e janelas</td>
                  <td>Instalar ou trocar portas e/ou janelas</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>Telhado e forro</td>
                  <td>Instalar, trocar ou consertar telhado, forro ou manta para redução do calor</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>Segurança e acessibilidade</td>
                  <td>Instalar ou trocar rampas, barras de apoio, corrimão, proteção em escadas, corredores e/ou varandas</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>Energia solar</td>
                  <td>Instalar placas solares para geração de energia elétrica e/ou aquecimento de água</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>Novo cômodo</td>
                  <td>Construir quarto, sala, banheiro, cozinha e área de serviço</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>Cômodo existente</td>
                  <td>Reformar quarto, sala, banheiro, cozinha e área de serviço ou reforçar estrutura</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Final */}
        <div className="rcb-cta-final">
          <h2>Pronto para reformar sua casa?</h2>
          <p>Simule agora pelo App CAIXA ou em uma agência e realize o sonho da sua reforma.</p>
          <button onClick={() => navigate('/login')} className="rcb-btn-white">Simule e Contrate</button>
        </div>

      </main>
    </>
  );
};

export default Main;
