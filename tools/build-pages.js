#!/usr/bin/env node
/**
 * Gerador das páginas do site HardSol (componentes + páginas).
 * Estrutura: 01 DADOS · 02 COMPONENTES · 03 PÁGINAS.
 * Todo o HTML do site sai daqui — o header/footer nunca são duplicados à mão.
 *
 * Uso:  node tools/build-pages.js
 */
"use strict";

/* ======================= 01 · CONFIG E DADOS ======================= */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, "brand.json"), "utf8"));
const BASE = String(CONFIG.baseUrl || "https://www.hardsol.com.br").replace(/\/+$/, "");

const abs = (p) => BASE + "/" + String(p).replace(/^\/+/, "");
const wa = (text) =>
  "https://api.whatsapp.com/send?phone=" + BRAND.whatsapp +
  "&text=" + encodeURIComponent(text || BRAND.whatsappText);

const waFloat = () =>
  `<a class="whats" href="${wa()}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2Z"/></svg>
  <span>WhatsApp</span></a>`;

const NAV = [
  ["index.html", "Início"],
  ["quem-somos.html", "Quem somos"],
  ["servicos.html", "Serviços"],
  ["trabalhos.html", "Trabalhos"],
  ["blog.html", "Blog"],
  ["sustentabilidade.html", "Sustentabilidade"],
  ["contato.html", "Contato"],
];

const SERVICES = [
  {
    slug: "servicos/solar-fotovoltaico.html",
    img: "flow/cena-2-paineis-card.webp",
    hero: "flow/cena-2-paineis.webp",
    meta: "Fotovoltaico",
    title: "Projetos e instalações fotovoltaicas",
    blurb: "OnGrid e OffGrid com projeto, ART, homologação e instalação.",
    heroAlt: "Fileiras de painéis fotovoltaicos",
    body: `<p>O dimensionamento começa pela curva de consumo — não pela área do telhado. Reunimos as últimas 12 faturas, mapeamos a demanda contratada (kW) e o perfil de carga, e projetamos a potência que devolve o menor custo por kWh ao longo dos 25 anos de vida útil.</p>
      <h2>O que entregamos</h2>
      <ul>
        <li><strong>OnGrid</strong> — conectado à rede, com injeção e compensação de excedente</li>
        <li><strong>OffGrid</strong> — isolado, com banco de baterias para locais sem rede</li>
        <li>Projeto, ART, homologação junto à concessionária e instalação</li>
        <li>Monitoramento de geração e pós-venda</li>
      </ul>
      <p>Um sistema é composto por módulos, inversor, estrutura de fixação, cabos e conectores. Em sistemas off-grid entra também o banco de baterias. Módulos têm garantia de fabricante de 12 anos de produto e 25 anos de desempenho.</p>`, 
  },
  {
    slug: "servicos/carregamento-ev.html",
    img: "flow/cena-4-carro-card.webp",
    hero: "flow/cena-4-carro.webp",
    meta: "HardMove",
    title: "Infraestrutura de recarga com gestão de potência",
    heroAlt: "Carro elétrico carregando em garagem residencial",
    blurb: "Wallbox com gestão dinâmica de carga, proteção e medição por vaga.",
    body: `<p>Quando vários veículos carregam ao mesmo tempo, a soma das potências passa o padrão do condomínio. A arquitetura tem duas camadas:</p>
      <ul>
        <li><strong>Infraestrutura</strong> — circuitos dedicados, proteções seletivas e quadro por vaga</li>
        <li><strong>Gestão (wallbox)</strong> — comunicação entre unidades que redistribui kW em tempo real conforme a capacidade disponível</li>
      </ul>
      <h2>Aplicações</h2>
      <ul><li>Garagem solar residencial</li><li>Garagem comercial, predial e industrial</li><li>Eletro posto</li></ul>
      <p>Integrada à geração fotovoltaica, a recarga passa a ser parcialmente abastecida pela luz do sol — o que reduz a carga na rede e o custo por kWh do veículo.</p>`, 
  },
  {
    slug: "servicos/aquecimento-solar.html",
    img: "flow/cena-5-agua-card.webp",
    hero: "flow/cena-5-agua.webp",
    meta: "Térmica",
    title: "Aquecimento de água solar",
    heroAlt: "Coletor solar térmico",
    blurb: "Térmico convencional e a vácuo com dimensionamento por usuário/dia.",
    body: `<p>Para cargas contínuas de água quente, o aquecimento térmico substitui quase toda a carga elétrica de resistência. Projeto inclui dimensionamento do reservatório (L/dia por usuário), boiler e coletores — convencional ou a vácuo, conforme o perfil.</p>
      <p>Atendemos condomínios, hotéis, motéis, restaurantes, indústrias e comércios.</p>`, 
  },
  {
    slug: "servicos/bombeamento-solar.html",
    img: "flow/cena-1-amanhecer-card.webp",
    hero: "flow/cena-1-amanhecer.webp",
    meta: "Bombeamento",
    title: "Bombeamento de água solar",
    heroAlt: "Painéis solares no campo ao amanhecer",
    blurb: "Bombas submersas e vibratórias das principais marcas.",
    body: `<p>Sistema completo de bombeamento com bombas submersas e vibratórias. Sem rede elétrica, sem gerador a diesel: a bomba sincroniza com a curva solar e opera enquanto há sol.</p>
      <p>Ideal para irrigação e abastecimento de condomínios e residências — manutenção baixa e custo marginal de energia praticamente zero.</p>`, 
  },
  {
    slug: "servicos/eletrica.html",
    img: "flow/cena-6-cidade-card.webp",
    hero: "flow/cena-6-cidade.webp",
    meta: "Elétrica",
    title: "Elétrica residencial e predial",
    heroAlt: "Cidade ao entardecer",
    blurb: "Redes estabilizadas de baixa e alta tensão.",
    body: `<p>Projeto e instalação de redes estabilizadas de BT e AT para residências, comércios e indústrias.</p>
      <p>O escopo abrange dimensionamento de cabos por queda de tensão e capacidade térmica, proteções derivadas com seletividade, aterramento funcional e leve execução com laudo.</p>
      <h2>Quando entra em cena</h2>
      <p><strong>Antes</strong> de qualquer projeto de geração ou recarga: se o padrão elétrico está no limite, o inversor e o wallbox com melhor especificação não resolvem — é a entrada de alimentação que limita o que o sistema consegue entregar, junto às demais cargas do prédio.</p>
      <p>Faz parte de retrofit solar, de recarga em condomínio e de obras prediais pontuais onde as cargas crescem de forma não prevista.</p>`, 
  },
  {
    slug: "servicos/pos-venda.html",
    img: "flow/cena-3-casa-card.webp",
    hero: "flow/cena-3-casa.webp",
    meta: "Pós-venda",
    title: "Pós-Venda Expresso Solar",
    heroAlt: "Residência com painéis instalados",
    blurb: "Monitoramento de geração, limpeza e correção de faturamento.",
    body: `<p>O poeira acumulada, falha de inversor e erro de leitura da concessionária reduzem a geração silenciosamente. O pós-venda monitora sistematicamente os sistemas que instalamos e corrige o desvio antes de virar prejuízo.</p>
      <h2>Incluído</h2>
      <ul><li>Limpeza de módulos</li><li>Monitoramento de geração</li><li>Correção de faturamento junto à concessionária</li><li>Correções de sistema solar</li><li>Configuração de monitoramento</li><li>Backup de inversores, microinversores e painéis</li><li>Consultoria técnica</li></ul>
      <h2>Faixa de queda esperada</h2><p>Para um sistema bem instalado e monitorado, a perda anual somada (poeira, tempera e falha) fica entre <strong>5% e 12%</strong> da geração equivalente. Acima de 12% há causa ativa: mais claro o problema, mais barata a correção.</p>
<h2>O que procuramos em cada visita</h2>
      <p>Não existe manutenção genérica para fotovoltaico: inspeção nas juntas, termografia nos conectores, comparação entre a geração medida e a esperada pela irradiância do dia. Quem não tem histórico, não tem diagnóstico — e quem não tem histórico, erra a causa e repete o problema.</p>
      <h2>O que não entra no pós-venda</h2>
      <p>Nosso pós-venda não vende peça que você não precisa: se o módulo está bom e a conexão está firme, o que sai na nota é serviço. A exceção é quando o inversor falha dentro da garantia — nesse caso o fabricante é acionado com o relatório que preparamos para você.</p>
      <p><strong>Contato pós-venda:</strong> <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>`,
    gallery: Array.from({ length: 9 }, (_, i) => "posvenda/" + String(i + 1).padStart(3, "0") + ".webp"),
  },
];

const WORKS = [
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-01.webp", tags: ["residencial"], kwp: 4.4, specs: [["Potência", "4,40 kWp"], ["Módulos", "8 × 550 W"], ["Inversor", "4 kW"], ["Economia", "R$ 680,40/mês"]] },
  { loc: "Manaus – AM", title: "OnGrid Comercial", img: "trabalho-02.webp", tags: ["comercial"], kwp: 60.48, specs: [["Potência", "60,48 kWp"], ["Módulos", "112 × 540 W"], ["Inversor", "20 kW"], ["Economia", "R$ 9.324,00/mês"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-03.webp", tags: ["residencial"], kwp: 5.4, specs: [["Potência", "5,40 kWp"], ["Módulos", "12 × 450 W"], ["Microinversor", "1.500 W"], ["Economia", "R$ 831,60/mês"]] },
  { loc: "Alto Paraíso – RO", title: "OnGrid Residencial", img: "trabalho-04.webp", tags: ["residencial"], kwp: 11.39, specs: [["Potência", "11,39 kWp"], ["Módulos", "34 × BYD 335 W"], ["Inversor", "REFUsol 20.000 W"]] },
  { loc: "São Sebastião da Boa Vista – PA", title: "OnGrid Residencial", img: "trabalho-05.webp", tags: ["residencial"], kwp: 5.39, specs: [["Potência", "5,39 kWp"], ["Módulos", "18 × Intelbras 330 W"], ["Inversor", "Intelbras 4.600 W"]] },
  { loc: "Cabo Frio – RJ", title: "OnGrid Residencial", img: "trabalho-06.webp", tags: ["residencial"], kwp: 6.03, specs: [["Potência", "6,03 kWp"], ["Módulos", "18 × BYD 335 W"], ["Inversor", "REFUsol 5.000 W"]] },
  { loc: "Maceió – AL", title: "OnGrid Predial", img: "trabalho-07.webp", tags: ["predial"], kwp: 3.3, specs: [["Potência", "3,3 kWp"], ["Módulos", "10 × Canadian 330 W"], ["Inversor", "Canadian Solar 5.000 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-08.webp", tags: ["residencial"], kwp: 3.25, specs: [["Potência", "3,25 kWp"], ["Módulos", "10 × Canadian 325 W"], ["Inversor", "Fronius Primo 3.000 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-09.webp", tags: ["residencial"], kwp: 5.67, specs: [["Potência", "5,67 kWp"], ["Módulos", "21 × Jinko 270 W"], ["Inversor", "Growatt 5.500 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-10.webp", tags: ["residencial"], kwp: 5.5, specs: [["Potência", "5,5 kWp"], ["Módulos", "17 × Jinko 340 W"], ["Inversor", "Growatt"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-11.webp", tags: ["residencial"], kwp: 12.42, specs: [["Potência", "12,42 kWp"], ["Módulos", "36 × Canadian 345 W"], ["Inversor", "Fronius 12.000 W"]] },
  { loc: "Manaus – AM", title: "OnGrid Residencial", img: "trabalho-12.webp", tags: ["residencial"], kwp: 25, specs: [["Potência", "25 kWp"], ["Módulos", "80 × Canadian 320 W"], ["Inversor", "Fronius 25.000 W"]] },
];
const TOTAL_KWP = Math.round(WORKS.reduce((s, w) => s + w.kwp, 0));
const STATES = new Set(WORKS.map((w) => (w.loc.split("–")[1] || "").trim())).size;

const ODS = [
  ["ODS 6 · Água potável e saneamento", "Reaproveitar a água da chuva e reduzir a dependência de água tratada.", "A sede possui captação de água da chuva, usada na irrigação das áreas verdes e em atividades que não exigem água tratada (banheiros e limpeza).", "flow/cena-5-agua-card.webp"],
  ["ODS 7 · Energia limpa e acessível", "Consumir a energia que nós mesmos geramos.", "70 painéis fotovoltaicos instalados na própria sede: energia renovável, barata e confiável, reduzindo a dependência de combustíveis fósseis.", "flow/cena-2-paineis-card.webp"],
  ["ODS 11 · Cidades e comunidades sustentáveis", "Construir de forma mais inteligente e responsável.", "A sede foi erguida com argamassas ACIII da SUAM, produzidas a partir da reciclagem de vidro — um exemplo do que defendemos.", "flow/cena-6-cidade-card.webp"],
  ["ODS 12 · Consumo e produção responsáveis", "Reduzir, reutilizar e reciclar no dia a dia.", "Separação de recicláveis, treinamentos periódicos, uso de canecas reutilizáveis, impressão frente e verso e digitalização de documentos.", "flow/cena-1-amanhecer-card.webp"],
];

const SITE_COPY = {
  eyebrowManaus: "Grupo HardSol · " + BRAND.groupLine,
};

const POSVENDA_NOTES = [
  "Visita técnica com inspeção fotográfica e leitura de telemetria do inversor.",
  "Limpeza orientada por tipo de sujeira: seca para poeira fina, úmida com água deionizada quando há resíduo urbano incrustado.",
  "Reaperto de conexões — pontos que se afrouxam por ciclo térmico e geram aquecimento localizado.",
  "Confronto entre geração medida e geração esperada para o mesmo mês do ano anterior.",
  "Correção de faturamento junto à concessionária — leitura repetida, rateio de geração injetada e crédito retroativo.",
  "Ensaio de disjuntores e dispositivos de proteção contra surto, com revisão de seletividade.",
  "Diagnóstico de módulo com rendimento discrepante em relação ao string.",
  "Revisão da estrutura de fixação, parafusos e vedação do telhado.",
  "Relatório técnico com imagens e recomendações — registro assinado pelo cliente.",
];


const POSTS = [
  {
    slug: "dimensionamento-fotovoltaico",
    title: "Como dimensionar um sistema fotovoltaico sem chutar potência",
    excerpt: "A potência vem da curva de consumo e da irradiância local — não da área do telhado. Passo a passo com a faixa real de perdas por etapa.",
    tags: ["Fotovoltaica", "Engenharia"],
    author: "Engenharia HardSol",
    date: "2026-09-18",
    readTime: 6,
    thumb: "flow/cena-2-paineis-card.webp",
    image: "flow/cena-2-paineis.webp",
    body: `<h2>O que coletar antes de desenhar nada</h2>
      <p>Três conjuntos de dados: a <strong>curva de consumo</strong> (12 meses de fatura, em kWh), a <strong>demanda contratada</strong> (kW) e o <strong>perfil de uso</strong> de quem comanda o prédio. Em indústria, o que importa é a manobra de produção; em condomínio, o que concentra carga é o bloco de circulação e as bombas.</p>
      <articleCta emoji="📐" title="Peça o desenho preliminar" text="Com a fatura em mãos, devolvemos potência recomendada, curva de geração e projeção de payback." />
      <h2>A conta, em números</h2>
      <p>A irradiância média anual no litoral nordestino fica em torno de <strong>5,0 a 5,5 kWh/m² por dia</strong> (HSP). A receita de geração estimada é a mesma do projeto residencial ao industrial:</p>
      <p><kbd>P (kWp) = consumo (kWh/dia) ÷ (HSP × rendimento_do_sistema)</kbd></p>
      <p>O rendimento é onde a maioria dos orçamentos engana. Entre cabos, inversor, MPPT, sombreamento parcial, temperatura e poeira, a queda real de um sistema bem executado fica em <strong>15% a 22%</strong>. Quem não contabiliza essa faixa promete mais geração do que entrega — e o payback desaba.</p>
      <h2>Checklist de campo</h2>
      <ul><li>quadrante de cada grupo de módulos e sombra projetada por mês</li><li>distância até o quadro de comando — cada metro adicional aumenta a queda de tensão</li><li>capacidade térmica do módulo (curva de derate)</li><li>estrutura de fixação — vento litorâneo muda a fixação e o custo</li></ul>
      <h2>Onde isso bate</h2>
      <p>Sistema subdimensionado não cobre a fatura. Sistema superdimensionado gera excedente que a concessionária compensa, não paga. A margem aceitável de um projeto bem feito é de <strong>±5%</strong> entre previsão e medição ao fim de 12 meses.</p>`,
  },
  {
    slug: "gestao-carga-wallbox",
    title: "Vários wallboxes, um padrão: como agregar recarga sem estourar o transformador",
    excerpt: "A soma das potências de wallbox em um condomínio passa o padrão projetado em semanas. A gestão dinâmica de carga é o que decide se funciona.",
    tags: ["Mobilidade Elétrica", "Infraestrutura"],
    author: "HardMove",
    date: "2026-10-02",
    readTime: 7,
    thumb: "flow/cena-4-carro-card.webp",
    image: "flow/cena-4-carro.webp",
    body: `<h2>O problema tem endereço elétrico</h2>
      <p>Um wallbox residencial Nacional opera entre <strong>7,4 kW (monofásico)</strong> e <strong>22 kW (trifásico)</strong>. Em um condomínio com 30 vagas equipadas, cada uma entregando 7,4 kW simultâneos soma <strong>222 kW</strong> — mais que boa parte dos padrões comerciais projetados para elevadores, bombas e luz.</p>
      <p>O resultado aparece em forma de sobrecarga, queda de tensão e desarme de proteção. A resposta não é deixar as cargas somarem: <strong>agregar</strong>.</p>
      <articleCta emoji="🔌" title="Avaliar um condomínio" text="Informe o padrão contratado e o número de vagas. Devolvemos o desenho de agregação e a curva de demanda." />
      <h2>A resposta técnica: gestão dinâmica</h2>
      <ul><li><strong>Carga base</strong> — soma das demais cargas do prédio (o que a edificação precisa)</li><li><strong>Capacidade livre</strong> — (padrão contratado) − (carga base + reserva)</li><li><strong>Prioridade</strong> — quem chega primeiro, quem tem mais tempo para carregar</li></ul>
      <p>O wallbox com comunicação entre unidades redistribui a capacidade livre em tempo real, sem um técnico de obra a cada bloco — o padrão continua o mesmo e a recarga se ajusta ao menor espaço livre.</p>
      <h2>O que muda na obra</h2>
      <ul><li>Um <strong>alimentador dedicado</strong> para as vagas, com medição separada</li><li>Comunicação entre wallboxes (bus de dados, geralmente CAT5/CAT6 ou wireless)</li><li>Quadro por vaga, com proteção dedicada</li></ul>
      <p>Resultado esperado: potência por vaga oscilando conforme a ocupação, sem exceder o padrão — e a mesma infraestrutura servindo 30 veículos, não 5.</p>`,
  },
  {
    slug: "retorno-fotovoltaico",
    title: "Como calcular o retorno de um sistema fotovoltaico",
    excerpt: "Payback é uma divisão — se a geração medida for real. Três erros que triplicam a conta e dois intervalos que valem como referência.",
    tags: ["Fotovoltaica", "Financeiro"],
    author: "Engenharia HardSol",
    date: "2026-08-05",
    readTime: 5,
    thumb: "flow/cena-6-cidade-card.webp",
    image: "flow/cena-6-cidade.webp",
    body: `<h2>A conta, sem redação</h2>
      <p><kbd>Payback (anos) = custo total ÷ economia anual</kbd>. A economia anual é o que o sistema <strong>realmente</strong> entrou, apurado nas faturas — não o que foi prometido na proposal.</p>
      <articleCta emoji="📉" title="Enviar fatura para projeção" text="Con luva de 12 meses, devolvemos geração esperada, capacidade recomendada e faixa de retorno." />
      <h2>Três erros que joga o payback</h2>
      <ul>
        <li><strong>Ignorar a degradação</strong> — módulos perdem 0,4% a 0,6% ao ano. Em 10 anos, isso é 5% a 6% menos geração</li>
        <li><strong>Usar tarifas de vitrina</strong> — bandeira tarifária e ajuste anual mudam o valor do kWh ao longo do ano</li>
        <li><strong>Contar excedente como dinheiro</strong> — concessionária não compra energia; compensa. O crédito vale o que vale a sua fatura</li>
      </ul>
      <h2>Intervalos realistas</h2>
      <p>Em projetos comerciais e industriais com carga diurna relevante, o payback típico fica entre <strong>2 e 4 anos</strong>. Em residências, com consumo concentrado fora do dessert, costuma chegar a <strong>5 a 7 anos</strong>. Fora dessa faixa, pergunte.</p>
      <p>O cálculo fica honesto se você registrar todo mês o que foi gerado e o que veio na fatura. Sem isso, o payback fica sendo projection.</p>`,
  },
  {
    slug: "inversor-string-microinversor",
    title: "Inversor string, microinversor ou otimizador: o que muda no projeto",
    excerpt: "A escolha do inversor define rendimento sob sombra parcial, granularidade de manutenção e custo por watt.",
    tags: ["Fotovoltaica", "Equipamentos"],
    author: "Engenharia HardSol",
    date: "2026-07-22",
    readTime: 5,
    thumb: "flow/cena-1-amanhecer-card.webp",
    image: "flow/cena-1-amanhecer.webp",
    body: `<h2>String: mais conversão, menos granularidade</h2>
      <p>Inversor string trabalha o <strong>string inteiro</strong> como uma carga. Menos componentes e custo por watt menor — e uma sombra parcial derruba a produção do string todo (MPPT da série). Em telhado limpo, orientação única e sem interferência, costuma ser o melhor custo por kWh produzido.</p>
      <articleCta emoji="🔍" title="Levantamento de sombras" text="Fazemos o levantamento do quadrante por mês e escolhemos o inversor pelo perfil real de sombra." />
      <h2>Microinversor: um por módulo</h2>
      <p>Cada módulo tem seu MPPT. A sombra afeta só o módulo que recebe — <strong>não</strong> os demais. E o rendimento é acompanhado por painel, o que é uma vantagem real no pós-venda.</p>
      <h2>Otimizadores: meio termo</h2>
      <p>String + otimizador por módulo. Mantém o inversor central e recupera parcialmente o que a sombra desperdiça. Custo fica entre os dois.</p>
      <h2>Regra de decisão</h2>
      <ul><li>Telhado limpo, orientação única — <strong>string</strong></li><li>Sombras frequentes ou telhado com várias faces — <strong>microinversor</strong></li><li>Projeto grande com rastreio de perdas por módulo — <strong>string + otimizador</strong></li></ul>`,
  },
  {
    slug: "manual-do-wallbox",
    title: "Vou comprar um wallbox: o que perguntar antes",
    excerpt: "Potência, gestão dinâmica, leitura em tempo real, proteção CC residual — o que separa um equipamento do outro.",
    tags: ["Mobilidade Elétrica", "Wallbox"],
    author: "HardMove",
    date: "2026-06-15",
    readTime: 5,
    thumb: "flow/cena-3-casa-card.webp",
    image: "flow/cena-3-casa.webp",
    body: `<h2>Potência é o primeiro, não o último</h2>
      <p>Muitos wallbox anunciam 22 kW. Isso importa se a sua instalação entrega isso: em padrão monofásico, o teto prático é <strong>7,4 kW</strong>. Anunciar 22 kW não calça — o circuito limita. Pergunte: <em>com o meu padrão, quantos kW por vaga eu consigo entregar?</em></p>
      <articleCta emoji="🔌" title="Consultar a HardMove" text="Envie o padrão e o número de vagas. Devolvemos a potencia por vaga e a curva de demanda projetada." />
      <h2>O que separa um equipamento do outro</h2>
      <ul>
        <li><strong>Gestão dinâmica</strong> — quantos kW sobrando o prédio têm e como os carros vão repartir isso</li>
        <li><strong>Leitura em tempo real</strong> — sensor no quadro do condômino: sem isso ninguém ajusta nada</li>
        <li><strong>Medição por vaga</strong> — para condomínios, é a função que gera a conta</li>
        <li><strong>Proteção</strong> — CC residual de 6 mA e aterramento dedicado</li>
      </ul>
      <p>Um wallbox que soma infraestrutura com proteção (CC residual de 6 mA) vale mais do que um que só entrega kW.</p>
      <h2>O desenho em uma linha</h2>
      <p>Antes de assinar, peça o <strong>diagrama elétrico unifiliar</strong>: do quadro do condomínio até a vaga — circuito, proteção e conduíte. Se não couber em uma página, o projeto não está fechado.</p>`,
  },
];

/* Artigos mobilité têm dados de marca própria */
const POST_BRAND = { "gestao-carga-wallbox": "hardmove", "manual-do-wallbox": "hardmove" };


/* ======================= 02 · COMPONENTES ======================= */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const fleuron = (accent) => {
  const c = accent === "move" ? "#22a85a" : "#ffbc3b";
  return `<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="6.5" fill="${c}"/><g stroke="${c}" stroke-width="1.8" stroke-linecap="round"><path d="M16 2.5v4M16 25.5v4M2.5 16h4M25.5 16h4M6.4 6.4l2.9 2.9M22.7 22.7l2.9 2.9M25.6 6.4l-2.9 2.9M9.3 22.7l-2.9 2.9"/></g></svg>`;
};
const brandWords = (b) => `<span>${esc(b.name)}<b class="accent brand-${esc(b.id)}">${esc(b.suffix)}</b></span>`;

const bar = (currentBrandId, base = "") =>
  `<div class="group-bar" aria-label="Grupo de empresas">
  <span><strong>${esc(BRAND.group)}</strong> · ${esc(BRAND.groupLine)}</span>
  <span class="group-bar__brands">
    ${BRAND.companies
      .map((b) => `<a href="${base}${b.href}" data-brand="${b.id}"${b.id === currentBrandId ? ' aria-current="brand"' : ""}><span aria-hidden="true"></span>${esc(b.full.split(" ")[0])}</a>`)
      .join("")}
  </span>
</div>`;

function navHTML(base, current) {
  return `<header class="site-header with-group-bar">
  <a class="brand" href="${base}index.html" aria-label="Grupo HardSol — início">
    ${fleuron("sol")}
    ${brandWords(BRAND.companies[0])}
  </a>
  <nav class="nav" aria-label="Principal">
    ${NAV.map(([href, label]) => `<a href="${base}${href}"${href === current ? ' aria-current="page"' : ""}>${esc(label)}</a>`).join("\n    ")}
  </nav>
  <div class="header-cta">
    <a class="btn btn--solar" href="${wa()}" target="_blank" rel="noopener">Solicitar orçamento</a>
    <button class="nav-toggle" type="button" aria-label="Abrir menu" aria-expanded="false">Menu</button>
  </div>
</header>`;
}

const SECTION_BAR = (label) => `<div class="section-head"><span class="num">${esc(label)}</span>`;
const END_BAR = `</div>`;

const contactListHTML = () => `<ul class="contact-list">
      <li><span class="label">WhatsApp</span><a href="${wa()}">${esc(BRAND.whatsappLabel)}</a></li>
      <li><span class="label">${esc(BRAND.phone2Note || "Comercial")}</span><a href="tel:${BRAND.phone2}">${esc(BRAND.phone2Label)}</a></li>
      <li><span class="label">E-mail</span><a href="mailto:${esc(BRAND.email)}">${esc(BRAND.email)}</a></li>
      <li><span class="label">Instagram</span><a href="https://instagram.com/${esc(BRAND.instagram)}" target="_blank" rel="noopener">@${esc(BRAND.instagram)}</a></li>
      <li><span class="label">Site</span><a href="https://${esc(BRAND.site)}">${esc(BRAND.site)}</a></li>
    </ul>`;

function foot(base) {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brands">
          ${BRAND.companies.map((b) => `<a class="brand" href="${base}${b.href}" aria-label="${esc(b.full)}">${fleuron(b.accent)}${brandWords(b)}</a>`).join("\n          ")}
        </div>
        <p class="footer-group-line">${esc(BRAND.groupLine)}</p>
        <p style="color:var(--muted);max-width:36ch">Engenharia de geração fotovoltaica, retrofit elétrico e infraestrutura de recarga. Equipamentos com garantia de fabricante e dados de geração disponíveis para auditoria.</p>
        <h4 style="margin-top:1.4rem">Empresas do grupo</h4>
        <ul>
          ${BRAND.companies.map((b) => `<li><span class="g-dot g-dot--${esc(b.id)}" aria-hidden="true"></span><a href="${base}${b.href}">${esc(b.full)}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h4>Serviços</h4>
        <ul>
          ${SERVICES.map((s) => `<li><a href="${base}${s.slug}">${esc(s.title.slice(0, 26) + (s.title.length > 26 ? "…" : ""))}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h4>Navegar</h4>
        <ul>
          ${NAV.filter((n) => n[0] !== "index.html").map((n) => `<li><a href="${base}${n[0]}">${esc(n[1])}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h4>Contato</h4>
        ${contactListHTML()}
        <div style="margin-top:1.1rem"><a class="btn btn--solar" href="${wa()}" target="_blank" rel="noopener">Solicitar orçamento</a></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> ${esc(BRAND.group)}. ${esc(BRAND.city)} · ${esc(BRAND.state)} · Brasil</span>
      <a href="${base}robots.txt">sitemap</a>
    </div>
  </div>
</footer>`;
}

function headHTML({ title, desc, canonical, base, ogImage, ogAlt, extraLd }) {
  const img = abs("assets/img/" + (ogImage || "flow/cena-2-paineis.webp"));
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script>document.documentElement.classList.add("js");window.BRAND={whatsapp:"${BRAND.whatsapp}",webhook:"${BRAND.webhook || ""}"};</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(plain(desc))}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<link rel="canonical" href="${canonical}" />
<meta name="theme-color" content="#fafafa" />
<meta name="author" content="${esc(BRAND.group)}" />
<link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(BRAND.group)}" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(plain(desc))}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${img}" />
<meta property="og:image:alt" content="${esc(ogAlt || title)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(plain(desc))}" />
<meta name="twitter:image" content="${img}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${BRAND.fontGoogle}" rel="stylesheet" />
<link rel="stylesheet" href="${base}assets/css/style.css" />
<link rel="stylesheet" href="${base}assets/css/film.css" />
<link rel="stylesheet" href="${base}assets/css/form.css" />
${extraLd ? "\n" + jsonLdBloc(extraLd) : ""}
</head>`;
}

function jsonLdBloc(graph) {
  if (!graph || !graph.length) return "";
  const clean = graph.filter(Boolean).map((o) => Object.assign({}, o));
  return `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": clean }, null, 2)}\n</script>`;
}

const breadcrumb = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
});
const itemList = (name, items) => ({
  "@type": "ItemList", name, numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: it.url })),
});
const orgNode = () => ({
  "@type": "Organization", "@id": BASE + "/#organization",
  name: BRAND.group, alternateName: BRAND.companies.map((b) => b.full),
  url: BASE + "/", logo: abs("assets/img/favicon.svg"),
  description: "Grupo de engenharia em geração distribuída fotovoltaica, retrofit elétrico e infraestrutura de recarga veicular (wallbox).",
  foundingDate: "2014", address: { "@type": "PostalAddress", addressLocality: BRAND.city, addressRegion: BRAND.state, addressCountry: "BR" },
  areaServed: ["Alagoas", "Nordeste", "Brasil"],
  sameAs: ["https://instagram.com/" + BRAND.instagram],
  telephone: BRAND.whatsappE164,
  contactPoint: [
    { "@type": "ContactPoint", telephone: BRAND.whatsappE164, contactType: "sales", areaServed: "BR", availableLanguage: "pt-BR" },
    { "@type": "ContactPoint", telephone: BRAND.phone2, contactType: "technical support", areaServed: "BR", availableLanguage: "pt-BR" },
  ],
  brand: BRAND.companies.map((b) => ({ "@type": "Brand", name: b.full })),
  knowsAbout: ["energia solar fotovoltaica", "sistemas OnGrid", "sistemas OffGrid", "gestão de carregadores elétricos", "wallbox", "irradiância e dimensionamento", "payback fotovoltaico"],
});

const section = (inner, cls = "section") => `<section class="${cls}">\n  <div class="container">\n${inner}\n  </div>\n</section>`;
const secHead = (num, h2, lead) =>
  `<div class="section-head" data-reveal><span class="num">${esc(num)}</span><h2>${h2}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}</div>`;

const breadcrumbNav = (items) =>
  `<nav class="breadcrumb" aria-label="Você está em">${items
    .map((it) => `<a href="${it.url}">${esc(it.name)}</a>`)
    .join('<span aria-hidden="true">/</span>')}</nav>`;

// Corpo do artigo invoca articleCTA (title-case) — atalho para o CTA comercial.
const articleCTA = (emoji, title, text) => articleCta(emoji, title, text, wa());

const serviceCard = (s, base) => `<article class="card" data-reveal>
  <a class="card__media" href="${base}${s.slug}" tabindex="-1"><img src="${base}assets/img/${s.img}" alt="${esc(s.heroAlt || s.title)}" width="800" height="500" loading="lazy" decoding="async" /></a>
  <div class="card__body">
    <span class="card__meta">${esc(s.meta)}</span>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.blurb)}</p>
    <a class="card__link" href="${base}${s.slug}">Saiba mais →</a>
  </div>
</article>`;

const workCard = (w, base) => {
  const chip = w.tags[0];
  const chipCls = chip === "comercial" ? "chip chip--blue" : chip === "predial" ? "chip chip--green" : "chip";
  const narrative = `Em ${esc(w.loc)}, ${esc(w.title.toLowerCase())} com ${esc(
    w.specs.map((s) => s[1]).join(", ")
  )}. Sistema instalado, homologado e monitorado pela HardSol.`;
  return `<article class="card" data-tags="${w.tags.join(" ")}" data-reveal>
  <div class="card__media"><img src="${base}assets/img/trabalhos/${w.img}" alt="${esc(w.title)}, ${esc(w.loc)}" width="800" height="500" loading="lazy" decoding="async" /></div>
  <div class="card__body">
    <span class="${chipCls}">${chip.charAt(0).toUpperCase() + chip.slice(1)}</span>
    <h3>${esc(w.title)}</h3>
    <p style="margin-bottom:.2rem">${esc(w.loc)}</p>
    <ul class="card__specs">${w.specs.map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join("\n      ")}</ul>
    <p class="card__text">${narrative}</p>
  </div>
</article>`;
};

const blogCard = (p, base) => `
  <article class="card" data-reveal data-tags="${p.tags.map((t) => t.toLowerCase()).join(" ")}">
    <a class="card__media" href="${base}blog/${p.slug}.html" tabindex="-1">
      <img src="${base}assets/img/${p.thumb}" alt="${esc(p.title)}" width="800" height="500" loading="lazy" decoding="async" />
    </a>
    <div class="card__body">
      <p class="blog-meta">
        <span class="card__meta">${esc(p.tags[0])}</span>
        <span class="dot-sep" aria-hidden="true">·</span>
        <time datetime="${p.date}">${fmtDate(p.date)}</time>
        <span class="dot-sep" aria-hidden="true">·</span>
        <span>${p.readTime} min</span>
      </p>
      <h3><a class="card__title" href="${base}blog/${p.slug}.html">${esc(p.title)}</a></h3>
      <p>${esc(p.excerpt)}</p>
      <p class="byline">${esc(p.author)}</p>
    </div>
  </article>`;

const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const articleCta = (emoji, title, text, href) => `
  <aside class="inline-cta" aria-label="Atalho comercial">
    <span class="inline-cta__emoji" aria-hidden="true">${emoji}</span>
    <div>
      <strong>${esc(title)}</strong>
      <p>${esc(text)}</p>
      <a class="btn btn--solar" href="${href}" target="_blank" rel="noopener">Solicitar avaliação</a>
    </div>
  </aside>`;

const leadForm = ({ intent, brand, label }) => `
  <form data-form data-intent="${esc(intent || "avaliacao-viabilidade")}" data-brand="${esc(brand || "hardsol")}" novalidate>
    <div class="fields">
      <div class="field"><label for="f-nome">Nome</label><input id="f-nome" name="nome" type="text" required placeholder="Como te chamamos" /></div>
      <div class="field"><label for="f-empresa">Empresa / condomínio</label><input id="f-empresa" name="empresa" type="text" placeholder="opcional" /></div>
      <div class="field"><label for="f-telefone">Telefone</label><input id="f-telefone" name="telefone" type="tel" required inputmode="tel" placeholder="(82) 90000-0000" /></div>
      <div class="field"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" required placeholder="voce@empresa.com" /></div>
      <div class="field"><label for="f-perfil">Perfil da instalação</label>
        <select id="f-perfil" name="perfil" required>
          <option value="" disabled selected>Escolha</option>
          <optgroup label="${esc(BRAND.companies[0].full)}"><option>Residência</option><option>Comércio</option><option>Indústria</option><option>Condomínio</option><option>Rural / off-grid</option></optgroup>
          <optgroup label="${esc(BRAND.companies[1].full)}"><option>Recarga em condomínio</option><option>Recarga em empresa</option><option>Eletro posto</option></optgroup>
        </select>
      </div>
      <div class="field"><label for="f-consumo">Consumo médio (kWh/mês)</label>
        <input id="f-consumo" name="consumo" type="number" min="0" step="1" placeholder="ex.: 4.800" />
        <p class="hint">Me aparece na fatura. Ajuda na precisão do desenho preliminar.</p>
      </div>
      <div class="field field--full"><label for="f-msg">O que precisa resolver</label>
        <textarea id="f-msg" name="mensagem" placeholder="Consumo, tarifas, vagas disponíveis, restrições de telhado..."></textarea>
      </div>
    </div>
    <button class="btn btn--solar btn--lg" type="submit" data-submit>
      <span data-label data-loading="Enviando...">${esc(label || "Enviar avaliação")}</span>
      <span data-spin aria-hidden="true"></span>
    </button>
    <p class="form-feedback" role="status" aria-live="polite"></p>
  </form>`;

const ctaBand = (title, body, base = "") =>
  section(`<div class="cta-band" data-reveal>
    <h2>${esc(title)}</h2><p>${esc(body)}</p>
    <div class="cta-band__actions">
      <a class="btn btn--solar btn--lg" href="${wa()}" target="_blank" rel="noopener">Enviar minha fatura</a>
      <a class="btn btn--ghost-light btn--lg" href="${base}contato.html">Formulário</a>
    </div></div>`, "section section--soft");

/* -------- Palco do filme (mesmas classes que o film.css usa) -------- */
const filmStage = () => `
  <section class="scroll-film" style="--film-height: 450vh"
           data-frame-count="97" data-frame-ext="webp"
           data-frames-desktop="frames/desktop" data-frames-mobile="frames/mobile"
           aria-label="Filmagem institucional Grupo HardSol">
    <canvas id="film" width="1280" height="720" aria-hidden="true"></canvas>
    <div class="film-captions" aria-live="polite">
      <article class="film-caption" data-from="0.00" data-to="0.55">
        <span class="film-eyebrow">${esc(BRAND.group)} · ${esc(BRAND.groupLine)}</span>
        <h1>Projetar antes de <span class="accent">prometer</span></h1>
        <p>Curva de carga, irradiância local e perdas reais computadas — o desenho preliminar vem antes de qualquer proposta.</p>
      </article>
      <article class="film-caption" data-from="0.55" data-to="1.01">
        <span class="film-eyebrow">OnGrid · OffGrid · Wallbox</span>
        <h2>Geração projetada, carga <span class="accent">balanceada</span></h2>
        <p>Envie a fatura e receba potência recomendada, curva de geração e projeção de custo em kWh.</p>
        <div class="film-actions">
          <a class="btn btn--solar btn--lg" href="${wa("Quero enviar minha fatura para avaliação.")}" target="_blank" rel="noopener">Enviar minha fatura</a>
          <a class="btn btn--ghost-light btn--lg" href="servicos.html">Serviços</a>
        </div>
      </article>
    </div>
    <div class="film-vignette" aria-hidden="true"></div>
    <div class="film-beam" aria-hidden="true"><i></i><i></i></div>
    <div class="film-progress" aria-hidden="true"><i></i></div>
    <div class="scroll-hint" aria-hidden="true">Role</div>
  </section>`;

const FALLBACK_HERO = () => `
  <section class="film-fallback">
    <div class="container">
      <span class="eyebrow">${esc(BRAND.group)} · ${esc(BRAND.groupLine)}</span>
      <h1>Projetar antes de <span class="accent">prometer</span></h1>
      <p class="lead" style="margin-inline:auto">Geração fotovoltaica e recarga veicular dimensionadas por engenharia, com dados de geração auditáveis.</p>
      <p style="margin-top:1.5rem"><a class="btn btn--solar btn--lg" href="${wa()}" target="_blank" rel="noopener">Solicitar orçamento</a></p>
    </div>
  </section>`;

function layout({ file, base = "", current = "", title, desc, hero, body, schema = [], brandId = "hardsol", hasFilm = false }) {
  const canonical = BASE + "/" + (file === "index.html" ? "" : file);
  const crumbs = hero && hero.crumb ? [{ name: "Início", url: BASE + "/" }, { name: hero.crumb, url: canonical }] : [];
  const extraLd = [orgNode(), breadcrumb(crumbs), ...schema];

  return `${headHTML({ title, desc, canonical, base, ogImage: hero && hero.heroImage, ogAlt: hero && hero.heroAlt, extraLd })}
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${bar(brandId, base)}
${navHTML(base, current)}
<main id="conteudo">` + (hasFilm ? filmStage() + FALLBACK_HERO() : "") + (hero
    ? `<section class="page-hero"><div class="container">
${breadcrumbNav([{ name: "Início", url: base + "index.html" }, { name: hero.crumb, url: canonical }])}
${hero.eyebrow ? `<span class="eyebrow">${esc(hero.eyebrow)}</span>` : ""}
<h1>${hero.h1}</h1>${hero.lead ? `<p class="lead">${esc(hero.lead)}</p>` : ""}
</div></section>` : "") + `
${body}
</main>
${foot(base)}
${waFloat()}
<script src="${base}assets/js/motion.js" defer></script>
<script src="${base}assets/js/connect.js" defer></script>
<script src="${base}assets/js/nav.js" defer></script>
</body>
</html>`;
}

/* ======================= 03 · PÁGINAS ======================= */

const pages = {};

/* ---- index.html ---- */
pages["index.html"] = layout({
  file: "index.html",
  hasFilm: true,
  title: "Grupo HardSol — Energia solar e mobilidade elétrica em Maceió/AL",
  desc: "Engenharia em geração distribuída fotovoltaica e infraestrutura de recarga veicular (wallbox). Projeto por curva de carga, projeção de geração e payback antes da obra.",
  body: [
    `<div class="marquee" aria-label="Marcas de equipamentos utilizados"><div class="marquee__track"><span>BYD</span><span>Canadian Solar</span><span>Fronius</span><span>Growatt</span><span>Intelbras</span><span>Jinko Solar</span><span>REFUsol</span><span>SUAM</span><span>BYD</span><span>Canadian Solar</span><span>Fronius</span><span>Growatt</span><span>Intelbras</span><span>Jinko Solar</span><span>REFUsol</span><span>SUAM</span></div></div>`,

    section(
      `<div class="grid grid--2">
        ${BRAND.companies.map((b) => `
        <article class="card brand-card brand-card--${b.id}" data-reveal>
          <div class="card__body">
            ${b.id === "hardmove" ? `<span class="chip chip--move">Mobility</span>` : `<span class="chip">Solar</span>`}
            <h3 style="display:flex;align-items:center;gap:.6rem">${fleuron(b.accent)}${brandWords(b)}</h3>
            <p>${esc(b.claim)}</p>
            <a class="card__link" href="${b.href}">Ver serviços da ${esc(b.suffix)} →</a>
          </div>
        </article>`).join("\n        ")}
      </div>
      <p class="section-cta lead" style="max-width:none">O mesmo desenho elétrico que dimensiona a geração fotovoltaica prepara o padrão de entrada para a recarga veicular — é por isso que duas empresas do mesmo grupo entregam o projeto completo, do módulo ao wallbox. <strong>${esc(BRAND.companies[0].suffix)}</strong> e <strong>${esc(BRAND.companies[1].suffix)}</strong> partem do mesmo desenho elétrico.</p>`,
      "section section--soft"
    ),

    section(
      `<div class="grid grid--3">
        ${SERVICES.map((s) => serviceCard(s, "")).join("\n        ")}
      </div>`
    ),

    section(
      `<div class="stats" data-reveal>
        <div class="stat"><b><span data-count="${TOTAL_KWP}">0</span></b><span>kWp instalados</span></div>
        <div class="stat"><b><span data-count="${WORKS.length}">0</span></b><span>obras no portfólio</span></div>
        <div class="stat"><b><span data-count="${STATES}">0</span></b><span>estados atendidos</span></div>
        <div class="stat"><b><span data-count="2014">0</span></b><span>atuando desde</span></div>
      </div>
      <p class="section-cta lead">Dado de obra, nãoliers: cada sistema instalado tem monitoramento e fatura — é por eles que os números acima são auditáveis.</p>`,
      "section"
    ),

    section(
      `${secHead("Leitura técnica", "Conteúdo de <span class='accent'>engenharia</span>", "O que a gente usa na bancada: fórmulas de dimensionamento, intervalo de payback, critério de inversor e decisão de wallbox.")}
      <div class="grid grid--3">${POSTS.slice(0, 3).map((p) => blogCard(p, "")).join("\n      ")}</div>
      <p class="section-cta"><a class="btn btn--ghost" href="blog.html">Ver o blog</a></p>`,
      "section section--soft"
    ),

    section(
      `<div class="feature feature--split">
        <div data-reveal><span class="eyebrow">HardMove</span>
          <h2>Mobilidade elétrica <span class="accent">com gestão</span></h2>
          <p class="lead">Wallbox com leitura em tempo real do quadro e distribuição dinâmica de potência. Agrega as vagas do condomínio sem estourar o padrão contratado.</p>
          <p style="margin-top:1.2rem"><a class="btn btn--ghost" href="hardmove.html">Conhecer a HardMove</a></p></div>
        <div data-reveal><img src="assets/img/flow/cena-4-carro.webp" alt="Carro elétrico carregando em garagem residencial" width="1600" height="900" loading="lazy" decoding="async" style="border-radius:18px;box-shadow:var(--e2);width:100%" /></div>
      </div>`,
      "section"
    ),

    ctaBand("Solicitar desenho preliminar", "Envie a fatura ou o inventário de cargas e receba potência recomendada, curva de geração e projeção de payback em kWh e R$."),
    section(
      `<div style="max-width:760px">
        ${secHead("Solicitação", "Peça o <span class='accent'>desenho</span>", "O payload do formulário sai em JSON estruturado — em n8n/CRM a automação entra direta.")}
        ${leadForm({ intent: "avaliacao-viabilidade", brand: "hardsol" })}
      </div>`,
      "section"
    ),
  ].join("\n"),
});

/* ---- hardmove.html (marca HardMove) ---- */
pages["hardmove.html"] = layout({
  file: "hardmove.html",
  brandId: "hardmove",
  current: "hardmove.html",
  title: "HardMove — Infraestrutura de recarga e wallbox",
  desc: "Wallbox com gestão dinâmica de potência, agregação de cargas em condomínios e infraestrutura de recarga para empresas e eletro postos.",
  hero: {
    crumb: "HardMove",
    eyebrow: "HardMove",
    h1: "Recarga veicular com <span class='accent'>gestão</span> de potência",
    lead: "Infraestrutura de recarga com leitura em tempo real do quadro e distribuição dinâmica entre vagas — a soma das cargas respeita o padrão contratado do prédio.",
    heroImage: "flow/cena-4-carro.webp",
    heroAlt: "Carro elétrico conectado ao carregador",
  },
  schema: [
    { "@type": "Organization", "@id": BASE + "/#hardmove", name: BRAND.companies[1].full, parentOrganization: { "@id": BASE + "/#organization" }, description: BRAND.companies[1].claim, url: abs("hardmove.html") },
    { "@type": "Service", name: "Infraestrutura de recarga com wallbox", serviceType: "Energia / Mobilidade Elétrica", provider: { "@id": BASE + "/#hardmove" }, areaServed: ["Alagoas", "Nordeste", "Brasil"], url: abs("hardmove.html") },
  ],
  body: [
    section(
      `<div class="prose">
        <h2>O problema em números</h2>
        <p>Um wallbox residencial entrega em torno de <strong>7,4 kW (monofásico) a 22 kW (trifásico)</strong>. Em um condomínio com 30 vagas equipadas, cada uma entregando 7,4 kW ao mesmo tempo soma cerca de <strong>222 kW</strong> — mais que boa parte dos padrões comerciais projetados para elevar bombas, elevadores e luz.</p>
        <p>O resultado aparece em forma de sobrecarga, queda de tensão e desarme de proteção. A resposta é não deixar as cargas somarem: <strong>agregar</strong>.</p>
        <h2>Como a gestão dinâmica funciona</h2>
        <ol>
          <li><strong>Medição</strong> do quadro geral em tempo real (sensor de corrente)</li>
          <li><strong>Cálculo de capacidade livre</strong> = padrão contratado − cargas ativas do prédio − reserva</li>
          <li><strong>Distribuição</strong> dessa capacidade livre entre os wallboxes ativos, na ordem de chegada e por prioridade</li>
          <li><strong>Ajuste contínuo</strong> conforme carros chegam, terminam ou o prédio muda de carga</li>
        </ol>
        <p>Teste objetivo: com gestão dinâmica, a potência média por veículo cai, a concessão do padrão não muda e o número de vagas equipadas cresce.</p>
      </div>`,
      "section"
    ),
    section(
      `${secHead("O que entregamos", "Escopo <span class='accent'>HardMove</span>")}
      <div class="grid grid--3">
        ${[
          ["🔌", "Wallbox com gestão dinâmica", " comunicação entre unidades e redistribuição de potência em tempo real."],
          ["📊", "Medição por vaga", " — token/conta separado para o condomínio, sem rateio manual."],
          ["🛡️", "Proteção", " CC residual 6 mA, aterramento dedicado e seletividade por circuito."],
          ["🏗️", "Obra", " — conduíte, eletrocalha, interligação entre prédio e vagas, laudo."],
          ["☀️", "Integração fotovoltaica", " — recarga em prioridade quando há excedente solar."],
          ["📱", "App do usuário", " — agendamento, histórico e validação de custo por sessão."],
        ].map(([e, t, d]) => `<div class="value" data-reveal><h3><span aria-hidden="true">${e}</span> ${esc(t)}</h3><p>${esc(d.startsWith(" ") ? d.slice(1) : d)}</p></div>`).join("\n        ")}
      </div>`,
      "section section--soft"
    ),
    ctaBand("Avaliar um condomínio ou empresa", "Informe o padrão contratado, o número de vagas e o perfil de uso. Devolvemos o desenho de agregação e a curva de demanda projetada."),
    section(
      `${secHead("Formulário HardMove", "Avaliar <span class='accent'>HardMove</span>", "O payload sai estruturado (JSON) — se o seu time usa n8n/CRM, a automação entra sem retrabalho.")}
      <div style="max-width:760px">${leadForm({ intent: "hardmove-avaliacao", brand: "hardmove", label: "Enviar avaliação HardMove" })}</div>`,
      "section"
    ),
  ].join("\n"),
});

/* ---- blog.html (índice) ---- */
const POST_TAGS = () => `<div class="filters" role="group" aria-label="Filtrar artigos por tema">
      ${["todos", "fotovoltaica", "mobilidade-elétrica", "infraestrutura", "wallbox", "financeiro", "engenharia", "equipamentos"].map((t, i) => `<button class="filter${i === 0 ? " is-active" : ""}" data-filter="${t}" aria-pressed="${i === 0}">${t}</button>`).join("")}
    </div>`;

pages["blog.html"] = layout({
  file: "blog.html",
  current: "blog.html",
  title: "Blog — HardSol",
  desc: "Engenharia em textos curtos: dimensionamento fotovoltaico, curva de carga, gestão de wallbox, payback e manutenção.",
  hero: { crumb: "Blog", eyebrow: "Conteúdo técnico", h1: "O que <span class='accent'>usamos</span> na bancada", lead: "Fórmulas de dimensionamento, curva de carga, gestão de wallbox e intervalos de payback. Sem promessa — só o que você calcula.", heroImage: "flow/cena-2-paineis.webp", heroAlt: "Fileiras de painéis fotovoltaicos" },
  schema: [
    { "@type": "CollectionPage", name: "Blog — Grupo HardSol", url: BASE + "/blog.html", inLanguage: "pt-BR" },
    itemList("Artigos técnicos de energia e mobilidade", POSTS.map((p) => ({ name: p.title, url: abs("blog/" + p.slug + ".html") }))),
  ],
  body: [
    section(
      `<div class="section-head"><span class="num">Artigos</span><h2>${POSTS.length} textos <span class='accent'>técnicos</span></h2><p class="lead">Cada artigo tem autor, data, tempo de leitura e tag. Os CTAs são injetados no meio, não no fim.</p></div>
    ${POST_TAGS()}
    <div class="grid grid--3 blog-grid">${POSTS.map((p) => blogCard(p, "")).join("\n      ")}</div>
    <p class="section-cta"><a class="btn btn--solar" href="${wa()}" target="_blank" rel="noopener">Pedir tema que falta</a></p>
    <div class="prose" style="margin-top:3rem">
      <h2>Como a gente escreve aqui</h2>
      <p>Cada texto parte de um problema de campo: por que um sistema gera menos no segundo ano, por que o padrão de um condomínio sofre quando três carros carregam juntos, como decidir entre inversor string e microinversor.</p>
      <p>Não há texto de marketing: os números são intervalos, as fórmulas cabem em uma linha e a promessa é limitada ao que pode ser verificado nas faturas e no monitoramento de geração.</p>
      <p>Se você quiser ver os números de uma obra específica, o portfólio está em <a href="trabalhos.html">Trabalhos concluídos</a>.</p>
    </div>`,
    "section section--soft",
    ),
  ],
  });

/* ---- blog/<slug>.html ---- */
POSTS.forEach((p, i) => {
  const next = POSTS[(i + 1) % POSTS.length];
  pages["blog/" + p.slug + ".html"] = layout({
    file: "blog/" + p.slug + ".html",
    base: "../",
    current: "blog.html",
    title: p.title + " — Blog HardSol",
    desc: p.excerpt,
    brandId: p.tags.indexOf("Mobilidade Elétrica") !== -1 || p.tags.indexOf("Wallbox") !== -1 ? "hardmove" : "hardsol",
    hero: { crumb: "Blog", eyebrow: p.tags.join(" · "), h1: esc(p.title), lead: esc(p.excerpt), heroImage: p.image, heroAlt: p.title },
    schema: [
      {
        "@type": "NewsArticle",
        "@id": abs("blog/" + p.slug + ".html"),
        headline: p.title,
        datePublished: p.date + "T00:00:00-03:00",
        dateModified: p.date + "T00:00:00-03:00",
        author: { "@type": "Organization", name: p.author },
        publisher: { "@id": BASE + "/#organization" },
        description: p.excerpt,
        inLanguage: "pt-BR",
        mainEntityOfPage: abs("blog/" + p.slug + ".html"),
        keywords: p.tags.join(", "),
        image: abs("assets/img/" + p.image),
        articleSection: p.tags[0],
        wordCount: plain(p.body).split(/\s+/).length,
      },
    ],
    body: [
      `<article class="section"><div class="container article">`,
      `<div class="article__meta">${esc(p.tags.join(" · "))}<span class="dot-sep">·</span>por ${esc(p.author)}<span class="dot-sep">·</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span class="dot-sep">·</span>${p.readTime} min de leitura</div>`,
      `<img class="article__hero" src="../assets/img/${p.image}" alt="${esc(p.title)}" width="1600" height="900" decoding="async" />`,
      `<div class="prose article__body">${p.body.split("</p>")[0]}</div>`,
      `<div class="prose article__body">${p.body}</div>`,
      `<div class="article__aside">
         <aside class="toc" aria-label="Neste artigo">
           <h3>Neste artigo</h3>
           <ol>${(p.body.match(/<h2>([^<]+)<\/h2>/g) || []).map((h) => `<li>${h.replace(/<h2>|<\/h2>/g, "")}</li>`).join("")}</ol>
         </aside>
         </div>`,
      `<footer class="article__footer">
         <a class="card__link" href="../blog.html">← Voltar ao blog</a>
         <a class="card__link" href="../blog/${next.slug}.html">Leia depois: ${esc(next.title)} →</a>
       </footer>`,
      `</div></article>`,
      related(p, POSTS),
    ].join("\n"),
  });
});

function related(p, list) {
  return section(
    `${secHead("Leia depois", "Outros <span class='accent'>artigos</span>")}
    <div class="grid grid--3">${list.filter((x) => x.slug !== p.slug).slice(0, 3).map((x) => blogCard(x, "../")).join("\n      ")}</div>`,
    "section section--soft"
  );
}

/* ---- quem-somos ---- */
pages["quem-somos.html"] = layout({
  file: "quem-somos.html",
  current: "quem-somos.html",
  title: "Quem somos — Grupo HardSol",
  desc: "Grupo de engenharia em geração distribuída fotovoltaica e infraestrutura de recarga. Duas empresas, mesmo desenho elétrico.",
  hero: { crumb: "Quem somos", eyebrow: "Grupo", h1: "Duas empresas, <span class='accent'>uma</span> engenharia", lead: "A HardSol cuida da geração fotovoltaica e do retrofit elétrico. A HardMove cuida da recarga veicular com gestão de potência. Ambas nascem do mesmo desenho elétrico.", heroImage: "flow/cena-3-casa.webp", heroAlt: "Residência com painéis instalados" },
  schema: [{ "@type": "AboutPage", name: "Quem somos — Grupo HardSol", url: BASE + "/quem-somos.html", inLanguage: "pt-BR", about: { "@id": BASE + "/#organization" } }],
  body: [
    section(
      `<div class="grid grid--2">${BRAND.companies.map((b) => `<div class="value" data-reveal><h3 style="display:flex;align-items:center;gap:.5rem">${fleuron(b.accent)}${brandWords(b)}</h3><p>${esc(b.claim)}</p><p style="margin-top:.8rem"><a class="card__link" href="${b.href}">Serviços →</a></p></div>`).join("\n      ")}</div>`
    ),
    section(
      `<div class="prose">
        <h5>Nascimento</h5>
        <p>A <strong>HardSol Energia Solar</strong> nasceu em 2014 de uma preocupação prática: gerar energia limpa de forma acessível. Em mais de uma década virou especialista em microgeração fotovoltaica — do levantamento de curva de consumo à homologação junto à concessionária.</p>
        <p>A <strong>HardMove</strong> nasceu por necessidade de mercado: à medida que a geração se espalhava, as vagas de recarga multiplicavam — e a infraestrutura elétrica existia de forma Pontual. A HardMove é a resposta de engenharia.</p>
        <p>Atuamos em Alagoas e no Nordeste, com parceiros no Brasil.</p>
      </div>`
    ),
    section(
      `${secHead("Nossos princípios", "Missão, visão e política")}
      <div class="values">
        ${[["Missão", "Oferecer a solução de energia limpa com o melhor custo-benefício e nos tornar referência em eficiência energética."], ["Visão", "Difundir a geração fotovoltaica e contribuir com um futuro sustentável, com mais qualidade de vida e energia acessível."], ["Política", "Conscientizar sobre o uso de energia renovável, atuando de forma ativa na promoção da sustentabilidade."]].map(([t, d]) => `<div class="value" data-reveal><h3>${t}</h3><p>${d}</p></div>`).join("\n        ")}
      </div>`,
      "section section--soft"
    ),
    section(
      `<div class="stats">
        <div class="stat" data-reveal><b><span data-count="${TOTAL_KWP}">0</span></b><span>kWp instalados no portfólio</span></div>
        <div class="stat" data-reveal><b><span data-count="${WORKS.length}">0</span></b><span>obras em destaque</span></div>
        <div class="stat" data-reveal><b><span data-count="${STATES}">0</span></b><span>estados atendidos</span></div>
        <div class="stat" data-reveal><b><span data-count="2014">0</span></b><span>atuando desde</span></div>
      </div>`
    ),
    section(
      `<div class="feature feature--split">
        <div data-reveal><div class="section-head" style="margin-bottom:1rem"><span class="num">Depoimentos</span><h2>Empresas que <span class='accent'>confiam</span></h2></div>
        <p class="lead">Empresas parceiras que acompanham nosso trabalho e os dados de geração disponíveis para auditoria.</p></div>
        <div data-reveal><div class="cta-band probe"><h3>Números por contrato</h3><p>Todo sistema instalado tem monitoramento de geração e histórico de fatura. Registramos, mês a mês, o que foi gerado — e o que a concessionária leu.</p></div></div>
      </div>`,
      "section section--soft"
    ),
    section(
      `${secHead("Onde estamos", "Filiais e <span class='accent'>representantes</span>")}
      <div class="grid grid--3">
        ${[["Maceió-AL | Recife-PE", "Janderson Andrade", "(82) 99626-2545", "Vila dos Bancários Nº 8C, Poço, Maceió-AL, CEP 57.025-290"], ["Belém - PA", "Pablo Monte", "(91) 99913-9940", "Av. Gentil Bittencourt nº 2397, São Brás, Belém-PA, CEP 66.063-022"], ["Porto Velho - RO", "Ivo Pereira", "(69) 99996-8835", "Rua Petrônio Ferreira, 2745 JK2, Juscelino Kubitschek, Porto Velho-RO, CEP 76.829-314"], ["Rio de Janeiro - RJ", "Felipe Mendes", "(22) 98833-1521", "Rua Dallas, 18, Parque Estoril, São Pedro da Aldeia-RJ, CEP 28.943-172"], ["Macapá - AP", "Nelvani Baroso", "(96) 99131-0677", "Rua Padre Vitório Galianne Nº 343, Nova Esperança, Macapá-AP, CEP 68901-600"], ["Boa Vista - RR", "Marcley dos Santos", "(95) 99123-8076", "Av. Minas Gerais, 265, Bairro dos Estados, Boa Vista-RR, CEP 69.035-660"]].map(([city, name, phone, addr]) => `<div class="value" data-reveal><h3>${esc(city)}</h3><p><strong>${esc(name)}</strong><br />${esc(phone)}<br />${esc(addr)}</p></div>`).join("\n      ")}
      </div>`
    ),
    ctaBand(),
  ].join("\n"),
});

/* ---- servicos hub + subpáginas ---- */
pages["servicos.html"] = layout({
  file: "servicos.html",
  current: "servicos.html",
  title: "Serviços — Grupo HardSol",
  desc: "Geração fotovoltaica, gestão de wallbox, aquecimento e bombeamento solar, elétrica e pós-venda.",
  hero: { crumb: "Serviços", eyebrow: "O que fazemos", h1: "Serviços em <span class='accent'>energia</span>", lead: "Seis frentes de trabalho, do projeto ao pós-venda.", heroImage: "flow/cena-2-paineis.webp", heroAlt: "Fileiras de painéis solares" },
  schema: [
    { "@type": "CollectionPage", name: "Serviços — Grupo HardSol", url: BASE + "/servicos.html", inLanguage: "pt-BR" },
    itemList("Serviços", SERVICES.map((s) => ({ name: s.title, url: abs(s.slug) }))),
  ],
  body: [section(
    `${secHead("Serviços", "Seis frentes de <span class='accent'>engenharia</span>", "Do levantamento da curva de consumo ao pós-venda: cada frente tem critério de entrada e um desenho de entrega. O que muda é o equipamento — o método é o mesmo: medir, dimensionar, homologar.")}
      <h3>O que sinaliza que você está no lugar certo</h3>
      <p>Se a proposta chega sem o número de kWp, sem a curva de geração estimada por mês e sem a faixa de perdas descrita, não tem como validar. Exigir esses três itens separa uma proposta de engenharia de uma cotação de equipamento.</p>
      <h3>Como começar</h3>
      <p>Abrir o processo é simples: envie a fatura mais recente e um dos perfis abaixo. Devolvemos o primeiro desenho preliminar e, a partir dele, definimos o escopo. Nada de visita sem critério. A partir do desenho preliminar dá para decidir se vale seguir — e quanto custa seguir — antes de comprometer o escopo completo.</p>
      <h3>O que sinaliza que você está no lugar certo</h3>
      <p>Se a proposta chega sem o número de kWp, sem a curva de geração estimada por mês e sem a faixa de perdas descrita, não tem como validar. Exigir esses três itens separa uma proposta de engenharia de uma cotação de equipamento.</p>
    <div class="grid grid--3">${SERVICES.map((s) => serviceCard(s, "")).join("\n      ")}</div>
    <div class="prose" style="margin-top:3rem">
      <h2>Como decidir por onde começar</h2>
      <p>Se o seu problema é custo de energia, comece pela <a href="servicos/solar-fotovoltaico.html">geração fotovoltaica</a>. Se o problema é um padrão elétrico com reservas apertadas, <a href="servicos/carregamento-ev.html">a recarga com gestão</a> vem antes da troca de transformador. Em muitos casos são as duas coisas ao mesmo tempo — e o desenho elétrico precisa contemplar ambos.</p>
    </div>`,
    "section section--soft",
  ),
  ],
});

SERVICES.forEach((s) => {
  const gallery = s.gallery
    ? section(
        `${secHead("Galeria", "Atendimentos <span class='accent'>de pós-venda</span>")}
      <div class="grid grid--3">${s.gallery.map((g, i) => `<article class="card"><div class="card__media"><img src="../assets/img/${g}" alt="Atendimento de pós-venda ${i + 1} — HardSol" width="800" height="500" loading="lazy" decoding="async" /></div><div class="card__body"><h3>Atendimento ${String(i + 1).padStart(2, "0")}</h3><p>${POSVENDA_NOTES[i % POSVENDA_NOTES.length]}</p></div></article>`).join("\n        ")}</div>`,
        "section section--soft"
      )
    : "";
  pages[s.slug] = layout({
    file: s.slug,
    base: "../",
    current: "servicos.html",
    brandId: s.meta === "HardMove" ? "hardmove" : "hardsol",
    title: s.title + " — Grupo HardSol",
    desc: s.blurb,
    hero: { crumb: "Serviços", eyebrow: s.meta, h1: esc(s.title), lead: esc(s.blurb), heroImage: s.hero, heroAlt: s.heroAlt || s.title },
    schema: [{ "@type": "Service", name: s.title, description: s.blurb, serviceType: s.meta, url: abs(s.slug), provider: { "@id": BASE + "/#organization" }, areaServed: ["Alagoas", "Nordeste", "Brasil"], availableChannel: { "@type": "ServiceChannel", serviceUrl: abs(s.slug) } }],
    body: [
      section(`<div class="prose">${s.body}</div>`),
      leadForm ? section(`<div style="max-width:760px">${secHead("Solicitar", "Peça o <span class='accent'>desenho</span>", "O payload do formulário sai em JSON — em n8n/CRM é automação direta.")}      ${leadForm({ intent: "servico-" + s.meta, brand: s.meta === "HardMove" ? "hardmove" : "hardsol" })}</div>`, "section") : "",
      gallery,
      section(`${secHead("Serviços relacionados", "Veja <span class='accent'>também</span>")}<div class="grid grid--3">${SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3).map((x) => serviceCard(x, "../")).join("\n      ")}</div>`, "section section--soft"),
      ctaBand("", "", "../"),
    ].filter(Boolean).join("\n"),
  });
});

/* ---- trabalhos ---- */
pages["trabalhos.html"] = layout({
  file: "trabalhos.html",
  current: "trabalhos.html",
  title: "Trabalhos concluídos — Grupo HardSol",
  desc: "Portfólio com potência (kWp), módulos, inversor, geração e economia. Dados dos sistemas instalados.",
  hero: { crumb: "Trabalhos", eyebrow: "Portfólio", h1: "Projetos que já <span class='accent'>estão rodando</span>", lead: "Cada trabalho mostra potência instalada, módulos, inversor e a economia resultante. Filtre por tipo e compare.", heroImage: "flow/cena-6-cidade.webp", heroAlt: "Painéis sobre a cidade ao entardecer" },
  schema: [
    { "@type": "CollectionPage", name: "Trabalhos concluídos — Grupo HardSol", url: BASE + "/trabalhos.html", inLanguage: "pt-BR" },
    itemList("Projetos fotovoltaicos concluídos", WORKS.map((w) => ({ name: w.title + " — " + w.loc, url: BASE + "/trabalhos.html" }))),
  ],
  body: [
    section(`<div class="stats">
        <div class="stat" data-reveal><b><span data-count="${TOTAL_KWP}">0</span></b><span>kWp instalados</span></div>
        <div class="stat" data-reveal><b><span data-count="${WORKS.length}">0</span></b><span>obras em destaque</span></div>
        <div class="stat" data-reveal><b><span data-count="${STATES}">0</span></b><span>estados atendidos</span></div>
        <div class="stat" data-reveal><b><span data-count="2014">0</span></b><span>atuando desde</span></div></div>`),
    section(
      `<p class="lead">Cada card traz a potência instalada (kWp), o módulo, o inversor e — quando há dado de fatura — a economia mensal medida. Nenhum dos números abaixo é projeção: todos vêm de obras homologadas e operando. Por isso os dados se dividem em dois grupos — o que foi projetado (potência, módulo e inversor) e o que foi medido depois (geração e fatura). Quando uma obra não tem dado de fatura listado, o item é omitido em vez de estimado. Os Estados indicam onde o sistema operou.</p>
      <h2>Como ler este portfólio</h2><p>Os dados de cada obra vêm do projeto (potência, módulo e inversor) e do monitoramento pós-instalação (geração e fatura). O que não aparece aqui são números de vitrine: nenhuma obra é listada sem ter rodado, com monitoramento ativo e registro de geração.</p>
      <div class="filters" role="group" aria-label="Filtrar por tipo">
        ${["todos", "residencial", "comercial", "predial"].map((t, i) => `<button class="filter${i === 0 ? " is-active" : ""}" data-filter="${t}" aria-pressed="${i === 0}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>`).join("")}
      </div>
      <div class="grid grid--3" id="works-grid">${WORKS.map((w) => workCard(w, "")).join("\n        ")}</div>`
    ),
    ctaBand("Seu projeto pode ser o próximo"),
  ].join("\n"),
});

/* ---- sustentabilidade ---- */
pages["sustentabilidade.html"] = layout({
  file: "sustentabilidade.html",
  current: "sustentabilidade.html",
  title: "Sustentabilidade — Grupo HardSol",
  desc: "70 painéis na própria sede, captação de água da chuva e reciclagem. ODS 6, 7, 11 e 12.",
  hero: { crumb: "Sustentabilidade", eyebrow: "Compromisso", h1: "Aplicado na <span class='accent'>sede</span>", lead: "A nossa sede é o primeiro projeto em que aplicamos tudo o que vendemos.", heroImage: "flow/cena-1-amanhecer.webp", heroAlt: "Painéis solares ao amanhecer" },
  schema: [{ "@type": "WebPage", name: "Sustentabilidade — Grupo HardSol", url: BASE + "/sustentabilidade.html", inLanguage: "pt-BR" }],
  body: [
    section(
      `<div class="stats">
        <div class="stat" data-reveal><b><span data-count="70">0</span></b><span>painéis na nossa sede</span></div>
        <div class="stat" data-reveal><b><span data-count="4">0</span></b><span>ODS prioritários</span></div>
        <div class="stat" data-reveal><b><span data-count="100" data-suffix="%">0</span></b><span>recicláveis separados</span></div>
        <div class="stat" data-reveal><b><span data-count="2014">0</span></b><span>compromisso desde</span></div>
      </div>
      <p class="section-cta"><a class="btn btn--dark" href="contato.html">Fale com a engenharia</a></p>`
    ),
    section(
      `${secHead("Objetivos Globais", "Os ODS que <span class='accent'>perseguimos</span>", "Em 2015 os líderes mundiais acordaram 17 ODS para 2030. Estamos além da metade do caminho e apenas 15% deles estão no ritmo certo — por isso agimos onde temos impacto real.")}
      <div class="grid grid--2">
      ${ODS.map(
        ([t, sub, txt, img]) =>
          `<article class="card" data-reveal><div class="card__media"><img src="assets/img/${img}" alt="${esc(sub)}" width="800" height="500" loading="lazy" decoding="async" /></div><div class="card__body"><span class="card__meta">${esc(t)}</span><h3>${esc(sub)}</h3><p>${esc(txt)}</p></div></article>`
      ).join("\n      ")}
      </div>`,
      "section section--soft"
    ),
    section(
      `${secHead("Na prática", "Nossas <span class='accent'>diretrizes</span>")}
      <div class="values">
        ${[["Identificação e separação", "Lixeiras específicas para papel, plástico, vidro e metal."], ["Educação", "Treinamentos e campanhas regulares, com participação ativa da equipe."], ["Redução de resíduos", "Canecas reutilizáveis, impressão frente e verso e digitalização."], ["Parcerias", "Empresas locais de reciclagem para destinar corretamente cada material."]].map(([t, d]) => `<div class="value" data-reveal><h3>${t}</h3><p>${d}</p></div>`).join("\n        ")}
      </div>`
    ),
    ctaBand("Avaliar a sua geração e o seu consumo"),
  ].join("\n"),
});

/* ---- contato ---- */
pages["contato.html"] = layout({
  file: "contato.html",
  current: "contato.html",
  title: "Contato — Grupo HardSol",
  desc: "WhatsApp " + BRAND.whatsappLabel + ", telefone " + BRAND.phone2Label + ", e-mail " + BRAND.email + ". Avaliação de viabilidade para fotovoltaico e wallbox.",
  hero: { crumb: "Contato", eyebrow: "Fale com a engenharia", h1: "Solicitar <span class='accent'>avaliação</span>", lead: "Informe consumo e perfil. Devolvemos potência recomendada, curva de geração e projeção de payback.", heroImage: "flow/cena-4-carro.webp", heroAlt: "Carro elétrico carregando" },
  schema: [
    { "@type": "ContactPage", name: "Contato — Grupo HardSol", url: BASE + "/contato.html", inLanguage: "pt-BR", about: { "@id": BASE + "/#organization" } },
    { "@type": "LocalBusiness", telephone: BRAND.whatsappE164, address: { "@type": "PostalAddress", addressLocality: BRAND.city, addressRegion: BRAND.state, addressCountry: "BR" }, parentOrganization: { "@id": BASE + "/#organization" } },
  ],
  body: section(
    `<div class="grid grid--2">
      <div data-reveal>
        <h2>Contatos</h2>
        ${contactListHTML()}
        <h4 style="margin-top:1.6rem">Empresas do grupo</h4>
        ${BRAND.companies.map((b) => `<p style="margin:0 0 .4rem"><span class="g-dot g-dot--${b.id}" aria-hidden="true"></span> <strong>${b.suffix}</strong> — ${b.claim}</p>`).join("")}
      </div>
      <div data-reveal>${leadForm({ intent: "contato", brand: "hardsol", label: "Enviar avaliação" })}</div>
    </div>`,
    "section section--soft"
  ),
});

/* ---------------------------------- escrita ------------------------------- */

let n = 0;
Object.keys(pages).forEach((file) => {
  const out = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, pages[file].replace(/\n{3,}/g, "\n\n"));
  n++;
  console.log("  wrote " + file);
});
console.log("OK  " + n + " páginas.  (base=" + BASE + ", kWp=" + TOTAL_KWP + ", estados=" + STATES + ")");
