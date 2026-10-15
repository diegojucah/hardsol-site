#!/usr/bin/env bash
# Baixa os ativos do site atual da HardSol para assets/img (migração p/ domínio local).
set -u
cd "$(dirname "$0")/.." || exit 1
B="http://hardsol1.hospedagemdesites.ws/images"

fetch() {
  local url="$1" out="$2"
  curl -sSL -m 30 -o "assets/img/$out" "$url"
  if [ $? -eq 0 ] && [ -s "assets/img/$out" ]; then
    echo "ok   $out"
  else
    echo "FAIL $out"
  fi
}

# Serviços
fetch "$B/servicos/serv-1.jpg"              "servicos/solar-fotovoltaico.jpg"
fetch "$B/servicos/serv-2.jpg"              "servicos/eletrica.jpg"
fetch "$B/servicos/serv-3.jpg"              "servicos/carregamento-ev.jpg"
fetch "$B/servicos/serv-4.jpg"              "servicos/pos-venda.jpg"
fetch "$B/servicos/serv-5.jpg"              "servicos/aquecimento.jpg"
fetch "$B/servicos/serv-6.jpg"              "servicos/bombeamento.jpg"
fetch "$B/servicos/servico01.jpg"           "servicos/solar-hero.jpg"

# Trabalhos concluídos
fetch "$B/trabalhos/trab_2022_04_30.jpg"    "trabalhos/trabalho-01.jpg"
fetch "$B/trabalhos/trab_2022_04_29.jpg"    "trabalhos/trabalho-02.jpg"
fetch "$B/trabalhos/trab_2022_04_28.jpg"    "trabalhos/trabalho-03.jpg"
fetch "$B/trabalhos/trabalho001.jpg"        "trabalhos/trabalho-04.jpg"
fetch "$B/trabalhos/trabalho002.jpg"        "trabalhos/trabalho-05.jpg"
fetch "$B/trabalhos/trabalho003.jpg"        "trabalhos/trabalho-06.jpg"
fetch "$B/trabalhos/trabalho004.jpg"        "trabalhos/trabalho-07.jpg"
fetch "$B/trabalhos/trabalho005.jpg"        "trabalhos/trabalho-08.jpg"
fetch "$B/trabalhos/trabalho006.jpg"        "trabalhos/trabalho-09.jpg"
fetch "$B/trabalhos/trabalho007.jpg"        "trabalhos/trabalho-10.jpg"
fetch "$B/trabalhos/trabalho008.jpg"        "trabalhos/trabalho-11.jpg"
fetch "$B/trabalhos/trabalho009.jpg"        "trabalhos/trabalho-12.jpg"

# Cursos
fetch "$B/courses/course-1.jpg"             "cursos/solar-ongrid-offgrid.jpg"
fetch "$B/courses/course-4.jpg"             "cursos/aquecimento-agua.jpg"
fetch "$B/courses/course-7.jpg"             "cursos/carro-eletrico.jpg"
fetch "$B/courses/curso04.jpg"              "cursos/solar-hero.jpg"

# Sobre / professor
fetch "$B/about/about-us.jpg"               "about/about.jpg"
fetch "$B/about/quemsomos.jpg"              "about/quemsomos.jpg"
fetch "$B/teacher.jpg"                      "about/instrutor.jpg"
fetch "$B/banner/banner-feature.png"        "about/banner-feature.png"

echo "--- total ---"
find assets/img -type f | wc -l
