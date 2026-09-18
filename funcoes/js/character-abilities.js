/* Hurras Fantasy - habilidades raciais e de classe.
   Expansao autoral em dark fantasy, sem remover os dados existentes. */
(() => {
  const D = window.HURRAS_RPG;
  if (!D || D.__characterAbilitiesLoaded) return;
  D.__characterAbilitiesLoaded = true;

  const racial = {
    'Anjo': {
      active:{name:'Ascensão do Véu',cost:'2 Mana',cooldown:'3 turnos',effect:'Abre as asas por um turno, ignora terreno difícil e recebe +2 Reação até o próximo turno.'},
      trait:{name:'Sangue Luminar',effect:'Cura sagrada recebida restaura +1 ponto adicional e luz intensa nunca causa penalidade de visão.'}
    },
    'Anão': {
      active:{name:'Postura da Bigorna',cost:'1 Vigor',cooldown:'3 turnos',effect:'Até o próximo turno recebe +2 Bloqueio e não pode ser empurrado por inimigos do mesmo porte.'},
      trait:{name:'Memória da Forja',effect:'Reconhece qualidade, material e reparos de armas, armaduras e runas com um teste simples de Ofício.'}
    },
    'Demônio': {
      active:{name:'Erupção Infernal',cost:'2 Mana',cooldown:'4 turnos',effect:'Libera calor em volta do corpo; inimigos próximos sofrem dano de fogo baseado em Vigor.'},
      trait:{name:'Marca da Fornalha',effect:'Recebe +1 resistência contra Fogo e pode acender pequenas chamas sem teste.'}
    },
    'Djinn': {
      active:{name:'Forma de Essência',cost:'3 Mana',cooldown:'4 turnos',effect:'Por um turno o corpo torna-se parcialmente etéreo: +2 Esquiva contra ataques físicos, mas não pode usar armadura pesada.'},
      trait:{name:'Afinidade Primordial',effect:'Escolha um elemento ao criar a ficha; a primeira magia desse elemento em cada cena custa 1 Mana a menos.'}
    },
    'Draconiano': {
      active:{name:'Sopro Ancestral',cost:'3 Mana',cooldown:'4 turnos',effect:'Expele uma rajada elemental em cone curto. O elemento acompanha a linhagem escolhida.'},
      trait:{name:'Escamas Ancestrais',effect:'Quando estiver sem armadura, ainda conta como tendo +1 Armadura natural.'}
    },
    'Elfo': {
      active:{name:'Passo do Luar',cost:'1 Mana',cooldown:'2 turnos',effect:'Move-se imediatamente uma distância curta sem provocar reação e recebe +1 Furtividade no turno.'},
      trait:{name:'Sentidos Antigos',effect:'Visão noturna total e +1 Percepção para notar emboscadas, rastros ou detalhes à distância.'}
    },
    'Fada': {
      active:{name:'Pó do Engano',cost:'2 Mana',cooldown:'3 turnos',effect:'Cria um brilho ilusório que impõe -2 Percepção a um alvo até o fim do próximo turno.'},
      trait:{name:'Corpo Diminuto',effect:'Pode assumir forma pequena fora de combate, passando por frestas e recebendo +2 Furtividade, mas sem usar armas grandes.'}
    },
    'Faunos e Sátiros': {
      active:{name:'Canção da Mata Ferida',cost:'2 Mana',cooldown:'3 turnos',effect:'Aliados próximos recebem +1 Coragem e +1 Medicina por dois turnos.'},
      trait:{name:'Caminhante Verde',effect:'Ignora terreno difícil natural e reconhece plantas comuns, trilhas e sinais de animais.'}
    },
    'Gigante': {
      active:{name:'Pisada do Colosso',cost:'2 Vigor',cooldown:'4 turnos',effect:'Golpeia o solo; criaturas próximas testam Vigor ou ficam Caídas.'},
      trait:{name:'Mãos de Cerco',effect:'Pode usar armas de duas mãos com uma mão se a mesa permitir, mas sofre -1 Reação enquanto fizer isso.'}
    },
    'Goblin': {
      active:{name:'Truque de Sucata',cost:'1 item',cooldown:'1/cena',effect:'Improvisa uma ferramenta, distração ou armadilha simples usando sucata carregada.'},
      trait:{name:'Olho de Mercador',effect:'Recebe +1 Avaliação e Finanças ao negociar, estimar valor ou identificar falsificações.'}
    },
    'Homem-Fera': {
      active:{name:'Instinto Predador',cost:'1 Vigor',cooldown:'3 turnos',effect:'Marca uma criatura visível; recebe +2 Percepção para rastreá-la e +1 Crítico contra ela por dois turnos.'},
      trait:{name:'Faro Selvagem',effect:'Pode seguir cheiro recente e percebe sangue ou criaturas feridas em curta distância.'}
    },
    'Humano': {
      active:{name:'Superação',cost:'1 Força de Vontade',cooldown:'1/cena',effect:'Repete um teste recém-falhado e usa o novo resultado.'},
      trait:{name:'Versatilidade',effect:'Ao criar a ficha, escolha uma habilidade comum e receba +1 nela.'}
    },
    'Lich': {
      active:{name:'Fôlego do Filactério',cost:'3 Mana',cooldown:'1/cena',effect:'Se cair a 0 Vitalidade, permanece consciente por um turno e pode conjurar uma magia Sombria.'},
      trait:{name:'Carne Morta',effect:'Imune a doenças comuns e não precisa respirar, mas cura natural é reduzida.'}
    },
    'Lobisomem': {
      active:{name:'Frenesi Lunar',cost:'2 Vigor',cooldown:'4 turnos',effect:'Por dois turnos recebe +2 Força e +1 Crítico, mas sofre -1 Manipulação e não pode usar magia delicada.'},
      trait:{name:'Regeneração Bestial',effect:'Fora de combate recupera ferimentos leves mais rápido; prata e efeitos anti-regeneração ignoram esse benefício.'}
    },
    'Meio-Elfo': {
      active:{name:'Dupla Herança',cost:'1 Força de Vontade',cooldown:'1/cena',effect:'Escolha receber +2 Persuasão ou +2 Percepção por um turno.'},
      trait:{name:'Entre Dois Mundos',effect:'Recebe +1 em testes sociais com humanos e elfos quando sua origem é relevante.'}
    },
    'Meio-Orc': {
      active:{name:'Recusar a Queda',cost:'1 Força de Vontade',cooldown:'1/cena',effect:'Ao sofrer dano que o derrubaria, permanece com 1 Vitalidade.'},
      trait:{name:'Ossatura Densa',effect:'Recebe +1 Vigor contra empurrão, veneno físico e exaustão.'}
    },
    'Metamorfo': {
      active:{name:'Roubar Forma',cost:'3 Mana',cooldown:'1/cena',effect:'Assume aparência de uma criatura humanoide observada, sem copiar poderes, por até uma hora.'},
      trait:{name:'Carne Mutável',effect:'Pode alterar pequenos detalhes físicos livremente e recebe +1 Manipulação ao sustentar um disfarce.'}
    },
    'Minotauro': {
      active:{name:'Investida Labiríntica',cost:'2 Vigor',cooldown:'3 turnos',effect:'Avança em linha reta e, se atingir, causa dano adicional e tenta empurrar o alvo.'},
      trait:{name:'Memória de Caminhos',effect:'Dificilmente se perde em estruturas, cavernas e labirintos já percorridos.'}
    },
    'Orc': {
      active:{name:'Brado de Guerra',cost:'1 Vigor',cooldown:'3 turnos',effect:'Você e um aliado próximo recebem +1 Força e +1 Coragem até o fim do próximo turno.'},
      trait:{name:'Resistência de Clã',effect:'A primeira penalidade de ferimento físico em cada combate é reduzida em 1.'}
    },
    'Reptiliano': {
      active:{name:'Sangue Frio',cost:'1 Força de Vontade',cooldown:'3 turnos',effect:'Ignora medo e dor por um turno e recebe +2 Autocontrole.'},
      trait:{name:'Escamas Secas',effect:'Recebe +1 Armadura natural contra cortes leves, mas sofre mais em frio extremo conforme a narrativa.'}
    },
    'Sereianos': {
      active:{name:'Canto Abissal',cost:'2 Mana',cooldown:'3 turnos',effect:'Uma criatura que ouça testa Autocontrole; se falhar, sofre -2 Reação por um turno.'},
      trait:{name:'Respiração Anfíbia',effect:'Respira em água e ar e recebe +2 Cavalgada/Adestramento em criaturas aquáticas quando aplicável.'}
    },
    'Troll': {
      active:{name:'Regeneração Brutal',cost:'2 Vigor',cooldown:'1/cena',effect:'Recupera uma pequena faixa de Vitalidade; Fogo e ácido podem bloquear a recuperação.'},
      trait:{name:'Carne de Pedra',effect:'Recebe +1 Vigor contra trauma físico e veneno.'}
    },
    'Vampiro': {
      active:{name:'Mordida Carmesim',cost:'Ação',cooldown:'2 turnos',effect:'Em alvo agarrado, causa dano e recupera parte da Vitalidade causada.'},
      trait:{name:'Filho da Noite',effect:'Visão noturna e +1 Furtividade em escuridão; luz solar intensa pode impor penalidades narrativas.'}
    },
    'Zumbi': {
      active:{name:'Sem Dor',cost:'1 Força de Vontade',cooldown:'3 turnos',effect:'Ignora penalidades de ferimento por um turno.'},
      trait:{name:'Corpo Reanimado',effect:'Imune a doenças comuns, não precisa respirar e recebe +1 Vigor contra venenos.'}
    },
    'Animagos': {
      active:{name:'Forma Totêmica',cost:'2 Mana',cooldown:'1/cena',effect:'Assume uma forma animal definida na criação; mantém mente e recebe um benefício físico coerente com o animal.'},
      trait:{name:'Vínculo Animal',effect:'Recebe +2 Adestramento com a espécie ligada à sua forma totêmica.'}
    },
    'Homúnculo': {
      active:{name:'Reconfiguração Alquímica',cost:'2 Mana',cooldown:'1/cena',effect:'Troca temporariamente +1 de um atributo físico por +1 em outro até o fim da cena.'},
      trait:{name:'Corpo Construído',effect:'Recebe +1 Ciências ou Medicina em testes relacionados a alquimia corporal e anatomia artificial.'}
    },
    'Golens': {
      active:{name:'Âncora de Pedra',cost:'1 Vigor',cooldown:'3 turnos',effect:'Fica imóvel até o próximo turno, recebendo +3 Bloqueio e imunidade a empurrão.'},
      trait:{name:'Corpo Mineral',effect:'Não precisa respirar e recebe +2 Vigor contra veneno, mas pesa muito e nada com dificuldade.'}
    },
    'Wendigo': {
      active:{name:'Fome Invernal',cost:'2 Vigor',cooldown:'4 turnos',effect:'Ao ferir uma criatura, recebe +1 Força até o fim do próximo turno; não acumula.'},
      trait:{name:'Caçador do Frio',effect:'Ignora frio natural severo e recebe +1 Percepção em ambientes gelados.'}
    },
    'Elfos do Mar': {
      active:{name:'Corrente Azul',cost:'2 Mana',cooldown:'3 turnos',effect:'Cria uma corrente que desloca você ou um alvo pequeno alguns metros.'},
      trait:{name:'Filhos da Maré',effect:'Respiram na água, nadam sem penalidade e recebem +1 Percepção submersos.'}
    },
    'Doppelganger': {
      active:{name:'Máscara Perfeita',cost:'2 Mana',cooldown:'1/cena',effect:'Copia aparência e voz de alguém observado por alguns minutos, sem copiar memórias.'},
      trait:{name:'Olhar Mimético',effect:'Depois de observar alguém, recebe +1 Manipulação para imitá-lo.'}
    },
    'Espectro': {
      active:{name:'Passagem Etérea',cost:'3 Mana',cooldown:'4 turnos',effect:'Atravessa uma barreira fina não-mágica ou ignora um obstáculo físico curto.'},
      trait:{name:'Visão Etérea',effect:'Percebe espíritos, rastros sobrenaturais e presença de magia Sombria próxima.'}
    },
    'Kitsune': {
      active:{name:'Fogo-Fátuo Enganador',cost:'2 Mana',cooldown:'3 turnos',effect:'Cria três luzes ilusórias; até o próximo turno recebe +2 Esquiva contra o primeiro ataque recebido.'},
      trait:{name:'Nove Artimanhas',effect:'Recebe +1 Manipulação em ilusões, disfarces e blefes sobrenaturais.'}
    }
  };

  const classAbilities = {
    'Arqueiro':[
      {name:'Mira Paciente',type:'Técnica',effect:'Se não se mover no turno, recebe +2 Crítico no próximo ataque à distância.'},
      {name:'Passo do Caçador',type:'Técnica',effect:'Após acertar um ataque à distância, pode reposicionar-se uma distância curta.'},
      {name:'Chuva de Flechas',type:'Suprema',effect:'Uma vez por cena, ataca uma pequena área com penalidade reduzida contra múltiplos alvos.'}
    ],
    'Bardo':[
      {name:'Verso de Coragem',type:'Canção',effect:'Aliados próximos recebem +1 Coragem por dois turnos.'},
      {name:'Nota Cortante',type:'Canção',effect:'Transforma performance em ataque mental ou sônico baseado em Carisma.'},
      {name:'Balada do Último Fogo',type:'Suprema',effect:'Uma vez por cena, remove medo de aliados e concede +1 em testes até o próximo turno.'}
    ],
    'Bruxo':[
      {name:'Pacto Menor',type:'Ritual',effect:'Troca 1 Vitalidade por redução de 2 Mana no próximo feitiço Sombrio.'},
      {name:'Maldição Persistente',type:'Ritual',effect:'O primeiro alvo amaldiçoado na cena sofre -1 resistência mágica até o fim do combate.'},
      {name:'Fenda do Patrono',type:'Suprema',effect:'Uma vez por cena, conjura Sombrio com +2 Nível Mágico, mas sofre 1 ponto de exaustão.'}
    ],
    'Clérigo':[
      {name:'Prece Restauradora',type:'Milagre',effect:'A primeira cura da cena restaura +1 faixa adicional.'},
      {name:'Símbolo de Proteção',type:'Milagre',effect:'Abençoa um aliado com +2 resistência contra Sombrio por dois turnos.'},
      {name:'Intervenção',type:'Suprema',effect:'Uma vez por cena, impede que um aliado próximo caia, deixando-o com 1 Vitalidade.'}
    ],
    'Domador':[
      {name:'Comando Instintivo',type:'Técnica',effect:'Companheiro animal pode agir imediatamente após você sem perder reação.'},
      {name:'Vínculo Protetor',type:'Técnica',effect:'Quando o companheiro sofre dano, você pode dividir parte do dano com ele.'},
      {name:'Matilha Coordenada',type:'Suprema',effect:'Uma vez por cena, aliados animais recebem +2 ataque e movimento por um turno.'}
    ],
    'Druida':[
      {name:'Raízes Guardiãs',type:'Ritual',effect:'Cria cobertura natural e reduz movimento inimigo em pequena área.'},
      {name:'Seiva Curativa',type:'Ritual',effect:'Converte Mana em cura lenta por três turnos.'},
      {name:'Forma Ancestral',type:'Suprema',effect:'Uma vez por cena, assume forma bestial maior e recebe +2 Vigor e Força por dois turnos.'}
    ],
    'Guerreiro':[
      {name:'Postura de Ferro',type:'Técnica',effect:'Troca -1 Esquiva por +2 Bloqueio até o próximo turno.'},
      {name:'Contra-Ataque',type:'Técnica',effect:'Ao bloquear com sucesso, pode realizar um ataque básico com -1 acerto.'},
      {name:'Execução',type:'Suprema',effect:'Uma vez por cena, contra alvo muito ferido, recebe +3 Crítico e ignora 2 pontos de Armadura.'}
    ],
    'Ladino':[
      {name:'Golpe Oportunista',type:'Técnica',effect:'Causa dano adicional contra alvos distraídos, caídos ou flanqueados.'},
      {name:'Sombra entre Passos',type:'Técnica',effect:'Após esquivar, recebe +2 Furtividade até atacar.'},
      {name:'Ataque Perfeito',type:'Suprema',effect:'Uma vez por cena, transforma um acerto em crítico se o alvo não tiver percebido você.'}
    ],
    'Lanceiro':[
      {name:'Guarda de Alcance',type:'Técnica',effect:'Recebe +1 Bloqueio contra inimigos que entram no alcance da lança.'},
      {name:'Perfuração',type:'Técnica',effect:'Ataque de investida ignora 1 ponto de Armadura.'},
      {name:'Muralha de Lanças',type:'Suprema',effect:'Uma vez por cena, domina uma linha curta; inimigos que atravessarem sofrem ataque de reação.'}
    ],
    'Mago':[
      {name:'Canalização',type:'Arcana',effect:'Se passar um turno concentrando, a próxima magia custa 2 Mana a menos.'},
      {name:'Contrafeitiço',type:'Arcana',effect:'Gasta reação e Mana para tentar anular magia inimiga visível.'},
      {name:'Sobrecarga Arcana',type:'Suprema',effect:'Uma vez por cena, lança uma magia como se tivesse +2 Nível Mágico e sofre -1 Vigor até o fim da cena.'}
    ],
    'Monge':[
      {name:'Punho Vazio',type:'Técnica',effect:'Ataques desarmados contam como arma treinada e podem usar Destreza.'},
      {name:'Respiração de Pedra',type:'Técnica',effect:'Gasta ação para receber +2 Autocontrole e +1 Armadura por um turno.'},
      {name:'Cem Golpes',type:'Suprema',effect:'Uma vez por cena, realiza uma sequência rápida de ataques desarmados contra um alvo próximo.'}
    ],
    'Necromante':[
      {name:'Servo Cadavérico',type:'Ritual',effect:'Mantém um servo morto-vivo simples fora de combate, sujeito às regras da mesa.'},
      {name:'Roubo de Essência',type:'Ritual',effect:'Quando um inimigo morre próximo, recupera 1 Mana uma vez por turno.'},
      {name:'Procissão dos Mortos',type:'Suprema',effect:'Uma vez por cena, convoca sombras cadavéricas para ocupar uma área por dois turnos.'}
    ],
    'Ninja':[
      {name:'Passo Silencioso',type:'Técnica',effect:'O primeiro movimento furtivo de cada combate não quebra ocultação.'},
      {name:'Bomba de Fumaça',type:'Técnica',effect:'Uma vez por cena, cria cobertura de fumaça em pequena área.'},
      {name:'Corte Fantasma',type:'Suprema',effect:'Uma vez por cena, atravessa um inimigo e realiza ataque com +2 Crítico.'}
    ],
    'Tecnomancer':[
      {name:'Selo de Sobrecarga',type:'Runa',effect:'Carrega uma arma por dois turnos com +1 dano mágico.'},
      {name:'Drone Rúnico',type:'Runa',effect:'Cria um pequeno foco que concede +1 Percepção ou Tecnologia enquanto ativo.'},
      {name:'Colapso de Circuito',type:'Suprema',effect:'Uma vez por cena, causa dano de Raio e desativa mecanismo ou constructo por um turno se falhar resistência.'}
    ],
    'Transmutador':[
      {name:'Conversão de Matéria',type:'Alquimia',effect:'Transforma material comum em ferramenta simples de massa semelhante por alguns minutos.'},
      {name:'Catalisador Corporal',type:'Alquimia',effect:'Concede +1 em um atributo físico por dois turnos e -1 em outro.'},
      {name:'Grande Transmutação',type:'Suprema',effect:'Uma vez por cena, altera uma pequena porção do cenário em material conhecido.'}
    ],
    'Ilusionista':[
      {name:'Imagem Duplicada',type:'Arcana',effect:'Cria uma cópia ilusória; o primeiro ataque contra você tem chance de errar automaticamente.'},
      {name:'Voz Falsa',type:'Arcana',effect:'Projeta voz ou som em um ponto próximo.'},
      {name:'Palácio da Mentira',type:'Suprema',effect:'Uma vez por cena, uma pequena área fica coberta por ilusões complexas por dois turnos.'}
    ],
    'Trapaceiro':[
      {name:'Mão Mais Rápida',type:'Técnica',effect:'Saca, esconde ou troca um item pequeno como ação livre uma vez por turno.'},
      {name:'Jogo Sujo',type:'Técnica',effect:'Contra alvo distraído, pode impor -1 Reação em vez de dano adicional.'},
      {name:'Plano Dentro do Plano',type:'Suprema',effect:'Uma vez por cena, declara uma preparação plausível realizada antes da cena, sujeita à aprovação do mestre.'}
    ],
    'Psiónicos':[
      {name:'Impulso Telecinético',type:'Psíquica',effect:'Empurra ou puxa um objeto ou criatura leve em curta distância.'},
      {name:'Mente Blindada',type:'Psíquica',effect:'Recebe +2 Autocontrole contra medo, ilusão e dominação.'},
      {name:'Colapso Psíquico',type:'Suprema',effect:'Uma vez por cena, causa dano Mental que ignora Armadura física.'}
    ],
    'Antipaladino / Algoz':[
      {name:'Juramento Profanado',type:'Técnica',effect:'Ao ferir um alvo marcado, recebe +1 Bloqueio até o próximo turno.'},
      {name:'Aura de Pavor',type:'Técnica',effect:'Inimigos próximos sofrem -1 Coragem enquanto você estiver consciente.'},
      {name:'Sentença Negra',type:'Suprema',effect:'Uma vez por cena, golpe pesado recebe +2 Força e +2 Magia Sombria.'}
    ],
    'Arcanista':[
      {name:'Matriz Rúnica',type:'Arcana',effect:'Armazena uma magia Aprendiz em uma runa e a libera depois como ação.'},
      {name:'Leitura de Fluxo',type:'Arcana',effect:'Recebe +2 Encantamento para identificar efeitos mágicos ativos.'},
      {name:'Círculo Perfeito',type:'Suprema',effect:'Uma vez por cena, reduz em 3 Mana o custo de todas as magias aliadas conjuradas dentro de pequena área por um turno.'}
    ],
    'Clérigo de Guerra':[
      {name:'Liturgia de Aço',type:'Milagre',effect:'Sua arma recebe +1 dano Sagrado por dois turnos.'},
      {name:'Guarda do Mártir',type:'Milagre',effect:'Pode sofrer parte do dano que atingiria um aliado adjacente.'},
      {name:'Marcha dos Fiéis',type:'Suprema',effect:'Uma vez por cena, aliados próximos recebem +2 Coragem e +1 Bloqueio por dois turnos.'}
    ],
    'Clérigo Negro':[
      {name:'Bênção Invertida',type:'Ritual',effect:'Cura Sombria funciona em mortos-vivos e pode causar dano leve a seres sagrados.'},
      {name:'Selo de Agonia',type:'Ritual',effect:'Marca um alvo; a primeira cura recebida por ele é reduzida.'},
      {name:'Missa do Abismo',type:'Suprema',effect:'Uma vez por cena, aumenta em +2 a Magia Sombria de aliados próximos por um turno, ao custo de 1 Vitalidade de cada participante.'}
    ]
  };

  Object.entries(racial).forEach(([name, data]) => {
    const r = D.races[name];
    if (!r) return;
    r.habilidadeRacial = data.active;
    r.tracoRacial = data.trait;
  });
  Object.entries(classAbilities).forEach(([name, list]) => {
    const c = D.classes[name];
    if (!c) return;
    c.habilidadesClasse = list;
  });

  const casterSchools = {
    'Mago':['Fogo','Água','Vento','Terra','Raio','Mental','Sagrado','Sombrio'],
    'Bruxo':['Sombrio','Fogo','Mental','Veneno'],
    'Clérigo':['Sagrado','Água'],
    'Druida':['Terra','Água','Vento','Veneno'],
    'Necromante':['Sombrio','Veneno','Mental'],
    'Tecnomancer':['Raio','Mental','Fogo'],
    'Transmutador':['Terra','Fogo','Veneno','Raio'],
    'Ilusionista':['Mental','Sombrio','Vento'],
    'Psiónicos':['Mental','Raio'],
    'Arcanista':['Fogo','Água','Vento','Terra','Raio','Mental','Sagrado','Sombrio'],
    'Clérigo de Guerra':['Sagrado','Fogo'],
    'Clérigo Negro':['Sombrio','Veneno'],
    'Bardo':['Mental','Vento'],
    'Djinn':['Fogo','Água','Vento','Terra','Raio']
  };
  Object.entries(casterSchools).forEach(([name, schools]) => {
    if (D.classes[name]) D.classes[name].magicSchools = schools;
  });

  D.creation = Object.assign(D.creation || {}, {
    natures:['Errante','Desbravador','Estrategista','Protetor','Sobrevivente','Devoto','Caçador de Relíquias','Mercenário','Peregrino','Herege'],
    behaviors:['Leal','Curioso','Impulsivo','Reservado','Cruel','Compassivo','Obstinado','Cauteloso','Ambicioso','Melancólico'],
    professions:['Ferreiro','Caçador','Alquimista','Mercador','Curandeiro','Erudito','Soldado','Guia','Rúnico','Coveiro','Cartógrafo','Sacerdote'],
    beliefs:['A Chama Antiga','Os Nove Véus','Nenhuma','O Abismo','A Lua Partida','Os Ancestrais','O Juramento de Ferro','A Maré Eterna'],
    chronicles:['Cinzas de Valdoriem','A Marcha do Eclipse','Ruínas de Andakan','A Coroa Quebrada','Os Sinos do Abismo','Peregrinos de Nodlond'],
    names:{
      default:['Aldren','Mireya','Kael','Seraph','Dorian','Nyra','Varek','Elyra','Garran','Isolde','Rhun','Maelis','Theron','Vesper','Orin','Selene'],
      'Anão':['Brom','Durak','Hilda','Korga','Thrain','Marda'],
      'Elfo':['Aelar','Lethien','Sylra','Vaelis','Ilyra','Theren'],
      'Orc':['Gorak','Urza','Mog','Khar','Brakka','Drog'],
      'Goblin':['Nib','Grik','Skazz','Mikka','Tiv','Razz'],
      'Vampiro':['Valerius','Morcant','Lysandra','Severin','Drusilla','Noctis'],
      'Sereianos':['Neris','Thalassa','Maren','Oryx','Sirena','Calyp'],
      'Kitsune':['Akari','Ren','Mio','Yori','Kira','Sora']
    }
  });
})();

/* Afinidades raciais e magias-reliquia adicionais. */
(() => {
  const D=window.HURRAS_RPG;if(!D)return;
  const affinities={
    'Anjo':['Sagrado'],'Demônio':['Fogo','Sombrio'],'Djinn':['Fogo','Água','Vento','Terra','Raio'],
    'Draconiano':['Fogo'],'Elfo':['Vento','Mental'],'Fada':['Mental','Vento'],'Lich':['Sombrio'],
    'Sereianos':['Água'],'Vampiro':['Sombrio','Mental'],'Kitsune':['Fogo','Mental'],'Elfos do Mar':['Água','Vento'],
    'Espectro':['Sombrio','Mental'],'Wendigo':['Água','Sombrio'],'Homúnculo':['Terra','Veneno']
  };
  Object.entries(affinities).forEach(([n,s])=>{if(D.races[n])D.races[n].magicSchools=s});
  const relics={
    Fogo:[
      {name:'Fogueira do Juramento Partido',tier:'Relíquia',desc:'Ergue uma chama imóvel que fortalece quem permanece perto dela.',info:'+2 Coragem e +1 Fogo | Área 5m | 20 Mana'},
      {name:'Cinza que Caminha',tier:'Relíquia',desc:'Uma figura de cinzas persegue o alvo marcado e explode ao alcançá-lo.',info:'6d6 fogo | Perseguição 2 turnos | 24 Mana'}],
    Água:[
      {name:'Espelho da Maré Morta',tier:'Relíquia',desc:'Cria uma superfície líquida que reflete uma magia simples de volta ao conjurador.',info:'Reflete magia Aprendiz | 22 Mana'},
      {name:'Cálice do Inverno',tier:'Relíquia',desc:'Congela o chão e drena movimento de todos na área.',info:'-2 Movimento | Área 8m | 20 Mana'}],
    Vento:[
      {name:'Caminho do Peregrino Sem Peso',tier:'Relíquia',desc:'O grupo caminha como se a gravidade quase não existisse.',info:'+2 Movimento | 3 aliados | 18 Mana'},
      {name:'Sopro do Sino Quebrado',tier:'Relíquia',desc:'Onda de ar distorce audição e concentração.',info:'-2 Encantamento | Área 7m | 21 Mana'}],
    Terra:[
      {name:'Sepultura de Basalto',tier:'Relíquia',desc:'Paredes de pedra fecham-se sobre uma criatura.',info:'Prisão 2 turnos | 22 Mana'},
      {name:'Trono de Ferro Profundo',tier:'Relíquia',desc:'Ancora o conjurador ao solo e o torna quase impossível de mover.',info:'+4 Bloqueio | Imune a empurrão | 20 Mana'}],
    Raio:[
      {name:'Sino da Tempestade',tier:'Relíquia',desc:'Cada conjuração próxima faz um raio saltar para um inimigo aleatório.',info:'2d8 por conjuração | 3 turnos | 24 Mana'},
      {name:'Passo Fulminante',tier:'Relíquia',desc:'O conjurador desaparece em um clarão e surge alguns metros adiante.',info:'Teleporte curto | 16 Mana'}],
    Veneno:[
      {name:'Coroa dos Esporos',tier:'Relíquia',desc:'Esporos orbitam o conjurador e contaminam quem se aproxima.',info:'2d6 veneno/turno | Aura 3m | 22 Mana'},
      {name:'Sangria Esmeralda',tier:'Relíquia',desc:'Transforma a próxima ferida do alvo em foco de toxina.',info:'+3d6 veneno no próximo acerto | 18 Mana'}],
    Mental:[
      {name:'Catedral do Pensamento',tier:'Relíquia',desc:'Aliados conectados compartilham percepção por alguns instantes.',info:'+2 Percepção do grupo | 3 turnos | 20 Mana'},
      {name:'Nome Esquecido',tier:'Relíquia',desc:'Apaga a certeza do alvo sobre quem deve atacar.',info:'Alvo perde reação e escolhe novo foco | 22 Mana'}],
    Sombrio:[
      {name:'Lanterna do Abismo',tier:'Relíquia',desc:'Uma chama negra revela medo, maldição e presença de mortos-vivos.',info:'Detecta trevas | +2 Investigação | 16 Mana'},
      {name:'Porta sem Lua',tier:'Relíquia',desc:'Abre por um instante um atalho através de duas sombras próximas.',info:'Teleporte entre sombras | 24 Mana'}],
    Sagrado:[
      {name:'Círio do Último Juramento',tier:'Relíquia',desc:'Uma luz mantém aliados conscientes mesmo diante de ferimentos graves.',info:'Ignora 1 penalidade de ferimento | Área 6m | 22 Mana'},
      {name:'Lança da Aurora Pálida',tier:'Relíquia',desc:'Um projétil de luz perfura defesa sombria e deixa uma marca luminosa.',info:'6d8 Sagrado | -2 Furtividade no alvo | 24 Mana'}]
  };
  Object.entries(relics).forEach(([school,list])=>{D.spells=D.spells||{};D.spells[school]=D.spells[school]||[];for(const sp of list)if(!D.spells[school].some(x=>x.name===sp.name))D.spells[school].push(sp)});
})();

/* Expansão V5: magias integradas aos níveis normais do grimório. */
(() => {
  const D=window.HURRAS_RPG;if(!D)return;
  const extra={
    Fogo:[
      {name:'Faísca do Peregrino',tier:'Aprendiz',desc:'Acende uma chama curta na arma ou na mão do conjurador.',info:'2d6 Fogo | 6 Mana'},
      {name:'Muralha de Brasas',tier:'Profissional',desc:'Ergue uma faixa de fogo que pune quem tenta atravessá-la.',info:'3d6 Fogo | Linha 8m | 14 Mana'},
      {name:'Sol Negro Incandescente',tier:'Mestre',desc:'Condensa uma esfera de fogo escuro que explode após breve atraso.',info:'8d8 Fogo | Área 7m | 32 Mana'}],
    Água:[
      {name:'Lâmina de Maré',tier:'Aprendiz',desc:'Reveste uma arma com água comprimida capaz de cortar.',info:'+2d6 Água | 6 Mana'},
      {name:'Prisão de Gelo Azul',tier:'Profissional',desc:'Congela o solo e prende as pernas de um alvo.',info:'Imobiliza 1 turno | 14 Mana'},
      {name:'Leviatã de Cristal',tier:'Mestre',desc:'Uma massa de água e gelo assume forma monstruosa e avança.',info:'8d8 Água/Gelo | Linha 12m | 32 Mana'}],
    Vento:[
      {name:'Passo de Brisa',tier:'Aprendiz',desc:'Impulso de ar desloca o conjurador alguns metros sem provocar reação.',info:'Movimento +4m | 5 Mana'},
      {name:'Círculo Cortante',tier:'Profissional',desc:'Lâminas de vento orbitam o conjurador e ferem aproximações.',info:'3d6/turno | Aura 2m | 15 Mana'},
      {name:'Olho da Tempestade',tier:'Mestre',desc:'Cria um domínio de ventos violentos ao redor do conjurador.',info:'Área 10m | -3 Movimento inimigo | 30 Mana'}],
    Terra:[
      {name:'Punho de Pedra',tier:'Aprendiz',desc:'Reforça um golpe com massa mineral.',info:'+2d6 impacto | 6 Mana'},
      {name:'Muralha do Sepulcro',tier:'Profissional',desc:'Ergue uma parede espessa de rocha negra.',info:'Cobertura pesada | 15 Mana'},
      {name:'Coração da Montanha',tier:'Mestre',desc:'O corpo assume densidade pétrea e se torna difícil de derrubar.',info:'+4 Bloqueio, +3 Vigor | 4 turnos | 30 Mana'}],
    Raio:[
      {name:'Agulha Elétrica',tier:'Aprendiz',desc:'Dispara uma descarga precisa contra um alvo.',info:'2d8 Raio | 6 Mana'},
      {name:'Corrente dos Condenados',tier:'Profissional',desc:'O raio salta entre inimigos próximos.',info:'4d6 em até 3 alvos | 16 Mana'},
      {name:'Julgamento da Tempestade',tier:'Mestre',desc:'Marca o céu e convoca sucessivos relâmpagos sobre uma área.',info:'8d8 Raio | Área 8m | 34 Mana'}],
    Veneno:[
      {name:'Névoa Tóxica',tier:'Aprendiz',desc:'Libera uma pequena nuvem irritante e venenosa.',info:'1d6 Veneno/turno | 6 Mana'},
      {name:'Sangue Corrosivo',tier:'Profissional',desc:'Transforma o sangue do conjurador em toxina corrosiva por alguns instantes.',info:'+3d6 Veneno em contra-ataque | 15 Mana'},
      {name:'Jardim da Pestilência',tier:'Mestre',desc:'Faz brotar fungos venenosos que contaminam uma grande área.',info:'5d6 Veneno/turno | Área 9m | 31 Mana'}],
    Mental:[
      {name:'Sussurro Intrusivo',tier:'Aprendiz',desc:'Insere uma frase simples na mente de uma criatura próxima.',info:'+2 Manipulação mental | 5 Mana'},
      {name:'Labirinto de Memórias',tier:'Profissional',desc:'Desorienta o alvo com lembranças conflitantes.',info:'-2 Reação e Percepção | 3 turnos | 16 Mana'},
      {name:'Trono da Consciência',tier:'Mestre',desc:'Projeta uma presença mental esmagadora sobre vários inimigos.',info:'Área 8m | medo/hesitação | 32 Mana'}],
    Sombrio:[
      {name:'Mão da Penumbra',tier:'Aprendiz',desc:'Uma sombra alongada agarra objetos e criaturas a curta distância.',info:'Puxão 3m | 6 Mana'},
      {name:'Véu do Túmulo',tier:'Profissional',desc:'Envolve aliados próximos em sombras que ocultam seus movimentos.',info:'+2 Furtividade | Área 5m | 15 Mana'},
      {name:'Eclipse Devorador',tier:'Mestre',desc:'Apaga a luz em uma região e fortalece magia sombria.',info:'+3 Sombrio | Área 10m | 33 Mana'}],
    Sagrado:[
      {name:'Luz Restauradora',tier:'Aprendiz',desc:'Fecha ferimentos leves com energia sagrada.',info:'Cura 2d6 | 6 Mana'},
      {name:'Círculo de Proteção',tier:'Profissional',desc:'Consagra o chão e reduz o dano sofrido por aliados.',info:'-2 dano recebido | Área 5m | 15 Mana'},
      {name:'Aurora do Último Santo',tier:'Mestre',desc:'Uma aurora dourada cura aliados e fere criaturas sombrias.',info:'Cura 5d8 aliados / 5d8 Sagrado inimigos | 34 Mana'}]
  };
  Object.entries(extra).forEach(([school,list])=>{D.spells=D.spells||{};D.spells[school]=D.spells[school]||[];for(const sp of list)if(!D.spells[school].some(x=>x.name===sp.name))D.spells[school].push(sp)});
})();
