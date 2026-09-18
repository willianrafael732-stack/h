// Dados centrais do sistema Hurras Fantasy.
// Perfis raciais, pontos de classe e restrições de equipamento alimentam a ficha interativa.
window.HURRAS_RPG = {
  "races": {
    "Anjo": {
      "nome": "Anjo",
      "bonus": {
        "Persuasao": "+1",
        "Carisma": "+1",
        "MagiaSagrada": "+1"
      },
      "fraqueza": {
        "ResistenciaSombra": "-2",
        "Manipulacao": "-1"
      },
      "evolucao": {
        "MagiaSagrada": "+2"
      },
      "passiva": "Asas Celestiais: Voo livre e mobilidade. Reduz\n                            ataques sagrados pela metade.",
      "template": {
        "Forca": 1,
        "Destreza": 2,
        "Vigor": 1,
        "Carisma": 3,
        "Manipulacao": 1,
        "Persuasao": 2,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 2
      }
    },
    "Anão": {
      "nome": "Anão",
      "bonus": {
        "Runas": "+1",
        "Oficio": "+1"
      },
      "fraqueza": {
        "Esquiva": "-1",
        "Briga": "-1"
      },
      "evolucao": {
        "Vigor": "+2"
      },
      "passiva": "Forjador Hábil: +2 dados em\n                            testes de metalurgia e criação rúnica.",
      "template": {
        "Forca": 3,
        "Destreza": 1,
        "Vigor": 3,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 2,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Demônio": {
      "nome": "Demônio",
      "bonus": {
        "MagiaSombria": "+1",
        "ResistenciaFogo": "+1"
      },
      "fraqueza": {
        "ResistenciaSagrada": "-2"
      },
      "evolucao": {
        "MagiaSombria": "+2"
      },
      "passiva": "Corpo de Erupção: Ao passar num teste de Vigor, explode uma bolha de lava\n                            causando dano igual à sua Magia de Fogo.",
      "template": {
        "Forca": 3,
        "Destreza": 2,
        "Vigor": 2,
        "Carisma": 1,
        "Manipulacao": 2,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Djinn": {
      "nome": "Djinn",
      "bonus": {
        "MagiaElemento": "+1",
        "ResistenciaMagica": "+1"
      },
      "fraqueza": {
        "DanoFisicoRecebido": "+4"
      },
      "evolucao": {},
      "passiva": "Tenacidade Elemental: Converte o dano mágico do elemento escolhido em Mana\n                            para si, anulando o dano.",
      "template": {
        "Forca": 1,
        "Destreza": 2,
        "Vigor": 1,
        "Carisma": 2,
        "Manipulacao": 2,
        "Persuasao": 1,
        "Percepcao": 2,
        "Inteligencia": 2,
        "Reacao": 1
      }
    },
    "Draconiano": {
      "nome": "Draconiano",
      "bonus": {
        "MagiaFogo": "+1",
        "ResistenciaFogo": "+2"
      },
      "fraqueza": {
        "ResistenciaAguaGelo": "-3"
      },
      "evolucao": {
        "MagiaFogo": "+2",
        "ResistenciaFogo": "+2",
        "Forca": "+2",
        "Vigor": "+2"
      },
      "passiva": "Escamas de Fogo: Aumenta a dificuldade de magias de fogo inimigas contra\n                            você e facilita seu controle sobre o elemento.",
      "template": {
        "Forca": 3,
        "Destreza": 1,
        "Vigor": 3,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 2,
        "Reacao": 1
      }
    },
    "Elfo": {
      "nome": "Elfo",
      "bonus": {
        "Persuasao": "+1",
        "Encantamento": "+1"
      },
      "fraqueza": {
        "ResistenciaVeneno": "-1",
        "Tecnologia": "-1"
      },
      "evolucao": {
        "Mana": "+10"
      },
      "passiva": "Olhos Dourados: Visão noturna total e\n                            resistência a luz excessiva. +1 dado de reação em testes de visão.",
      "template": {
        "Forca": 1,
        "Destreza": 3,
        "Vigor": 1,
        "Carisma": 2,
        "Manipulacao": 1,
        "Persuasao": 2,
        "Percepcao": 2,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Fada": {
      "nome": "Fada",
      "bonus": {
        "Persuasao": "+2",
        "Carisma": "+1"
      },
      "fraqueza": {
        "Ferro": "+100% Dano"
      },
      "evolucao": {
        "MagiaMental": "+3"
      },
      "passiva": "Metamorfose Furtiva: Pode reduzir seu\n                            tamanho para 30cm, ganhando asas e +2 em Furtividade. Nesta forma, não pode usar armas ou\n                            armaduras.",
      "template": {
        "Forca": 1,
        "Destreza": 2,
        "Vigor": 1,
        "Carisma": 3,
        "Manipulacao": 2,
        "Persuasao": 2,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Faunos e Sátiros": {
      "nome": "Faunos e Sátiros",
      "bonus": {
        "Carisma": "+1",
        "Medicina": "+1"
      },
      "fraqueza": {
        "ResistenciaVeneno": "-2"
      },
      "evolucao": {
        "Forca": "+1",
        "Vigor": "+1"
      },
      "passiva": "Fauno (Caminhante): Pode tornar-se invisível na floresta quando não\n                            observado. A invisibilidade quebra se agir ofensivamente ou sair da mata.",
      "template": {
        "Forca": 2,
        "Destreza": 2,
        "Vigor": 2,
        "Carisma": 2,
        "Manipulacao": 1,
        "Persuasao": 2,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Gigante": {
      "nome": "Gigante",
      "bonus": {
        "Forca": "+2",
        "Vigor": "+2"
      },
      "fraqueza": {
        "Reacao": "-2",
        "Esquiva": "-3"
      },
      "evolucao": {
        "Forca": "+2"
      },
      "passiva": "Corpo Gigante: Possui alcance estendido (+1 turno de distância) em ataques\n                            físicos e +1 de movimento. Pode empunhar duas armas de duas mãos (2H) simultaneamente.",
      "template": {
        "Forca": 3,
        "Destreza": 1,
        "Vigor": 4,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Goblin": {
      "nome": "Goblin",
      "bonus": {
        "Financas": "+1",
        "Tecnologia": "+1"
      },
      "fraqueza": {
        "Carisma": "-1",
        "Briga": "-1"
      },
      "evolucao": {
        "Furtividade": "+2",
        "Percepcao": "+2"
      },
      "passiva": "Astúcia Goblinoide: Goblins recebem +1 sucesso automático em todos os\n                            testes de Percepção e Avaliação de itens.",
      "template": {
        "Forca": 1,
        "Destreza": 3,
        "Vigor": 1,
        "Carisma": 1,
        "Manipulacao": 2,
        "Persuasao": 1,
        "Percepcao": 2,
        "Inteligencia": 2,
        "Reacao": 1
      }
    },
    "Homem-Fera": {
      "nome": "Homem-Fera",
      "bonus": {
        "Carnivoros": "+1 Destreza, +1 Reacao, +1 Percepcao",
        "Herbivoros": "+1 Forca, +1 Vigor, +1 Bloqueio",
        "Mamiferos": "+1 Inteligencia, +1 Reacao, +1 Esquiva",
        "Onivoros": "+1 Forca, +1 Inteligencia, +1 Esquiva"
      },
      "fraqueza": {
        "Oficios": "-1",
        "Cavalgada": "-1",
        "ArmasDistancia": "-1"
      },
      "evolucao": {
        "Vigor": "+2",
        "Reacao": "+2"
      },
      "passiva": "Sentidos Aguçados: +1 sucesso em Percepção e facilidade\n                            em ações narrativas sensoriais.",
      "template": {
        "Forca": 3,
        "Destreza": 3,
        "Vigor": 2,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Humano": {
      "nome": "Humano",
      "bonus": {
        "Persuasao": "+1",
        "Carisma": "+1",
        "MagiaSagrada": "+1"
      },
      "fraqueza": {
        "ResistenciaSombra": "-2",
        "Manipulacao": "-1"
      },
      "evolucao": {
        "Inteligencia": "+2"
      },
      "passiva": "Curva de Aprendizado: até o nível 3, Atributos e Habilidades custam metade do XP.",
      "template": {
        "Forca": 2,
        "Destreza": 2,
        "Vigor": 2,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 2,
        "Percepcao": 1,
        "Inteligencia": 2,
        "Reacao": 1
      }
    },
    "Lich": {
      "nome": "Lich",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "passiva": "Versatilidade: Ganha +1 dado em qualquer teste\n                            de perícia que não tenha níveis de treino.",
      "template": {
        "Forca": 1,
        "Destreza": 1,
        "Vigor": 1,
        "Carisma": 1,
        "Manipulacao": 2,
        "Persuasao": 1,
        "Percepcao": 2,
        "Inteligencia": 4,
        "Reacao": 1
      }
    },
    "Lobisomem": {
      "nome": "Lobisomem",
      "bonus": {
        "Forca": "+1",
        "Reacao": "+1"
      },
      "fraqueza": {
        "Prata": "Dano Dobrado",
        "Inteligencia": "-1"
      },
      "evolucao": {
        "Vigor": "+2"
      },
      "passiva": "Faro de Sangue: +1 sucesso em Percepção para\n                            rastrear alvos feridos. Ignora penalidades de escuridão total se o alvo estiver sangrando.",
      "template": {
        "Forca": 3,
        "Destreza": 2,
        "Vigor": 3,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Meio-Elfo": {
      "nome": "Meio-Elfo",
      "bonus": {
        "Carisma": "+1",
        "Inteligencia": "+1"
      },
      "fraqueza": {
        "ResistenciaVeneno": "-1"
      },
      "evolucao": {
        "Mana": "+10",
        "Encantamento": "+1"
      },
      "passiva": "Diplomacia Inata: Recebe +1 sucesso em\n                            qualquer teste social (Persuasão ou Lábia) quando estiver negociando entre raças diferentes.",
      "template": {
        "Forca": 1,
        "Destreza": 2,
        "Vigor": 1,
        "Carisma": 2,
        "Manipulacao": 1,
        "Persuasao": 2,
        "Percepcao": 2,
        "Inteligencia": 2,
        "Reacao": 1
      }
    },
    "Meio-Orc": {
      "nome": "Meio-Orc",
      "bonus": {
        "Forca": "+1",
        "Vigor": "+1"
      },
      "fraqueza": {
        "Inteligencia": "-1"
      },
      "evolucao": {
        "Forca": "+2"
      },
      "passiva": "Resistência Incansável: Uma vez por sessão, ao\n                            cair para 0 de Vitalidade, pode permanecer com 1 ponto em vez de desmaiar.",
      "template": {
        "Forca": 3,
        "Destreza": 1,
        "Vigor": 3,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 2
      }
    },
    "Metamorfo": {
      "nome": "Metamorfo",
      "bonus": {
        "Manipulacao": "+1",
        "Furtividade": "+1"
      },
      "fraqueza": {
        "ForcaDeVontade": "-2"
      },
      "evolucao": {
        "Destreza": "+2",
        "Ciencia": "+2"
      },
      "passiva": "Toque Replicante: Ao tocar uma pessoa, pode replicar sua aparência. Exige\n                            teste de Manipulação + Furtividade .",
      "template": {
        "Forca": 1,
        "Destreza": 3,
        "Vigor": 1,
        "Carisma": 1,
        "Manipulacao": 3,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 2
      }
    },
    "Minotauro": {
      "nome": "Minotauro",
      "bonus": {
        "Forca": "+1",
        "Armas2H": "+1"
      },
      "fraqueza": {
        "ResistenciaFogo": "-1",
        "ResistenciaRaio": "-1"
      },
      "evolucao": {
        "Vigor": "+1",
        "ResistenciaTerra": "+1"
      },
      "passiva": "Coração de Boi: O Minotauro possui uma vitalidade excepcional, recebendo\n                            +10 de Vitalidade saudável permanente.",
      "template": {
        "Forca": 4,
        "Destreza": 1,
        "Vigor": 3,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 2,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Orc": {
      "nome": "Orc",
      "bonus": {
        "Forca": "+1",
        "Briga": "+1"
      },
      "fraqueza": {
        "Inteligencia": "-1",
        "Academicos": "-1"
      },
      "evolucao": {
        "Forca": "+1",
        "Vigor": "+1"
      },
      "passiva": "Força Bruta: A biologia Orc é feita para o impacto. Recebem um bônus\n                            passivo de +2 de Força .",
      "template": {
        "Forca": 4,
        "Destreza": 1,
        "Vigor": 3,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Reptiliano": {
      "nome": "Reptiliano",
      "bonus": {
        "MagiaTerra": "+1",
        "ResistenciaTerra": "+2"
      },
      "fraqueza": {
        "ResistenciaGelo": "-2"
      },
      "evolucao": {
        "MagiaTerra": "+2",
        "ResistenciaTerra": "+1"
      },
      "passiva": "Regeneração Escamosa: Recuperam +5 de Vida por turno sem\n                            custo. Nota: Dano de Gelo pausa esta cura por 2 turnos.",
      "template": {
        "Forca": 2,
        "Destreza": 2,
        "Vigor": 3,
        "Carisma": 1,
        "Manipulacao": 2,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Sereianos": {
      "nome": "Sereianos",
      "bonus": {
        "MagiaAgua": "+1",
        "ResistenciaAguaGelo": "+2"
      },
      "fraqueza": {
        "ResistenciaEletricidade": "-2"
      },
      "evolucao": {
        "MagiaAgua": "+2",
        "ResistenciaAguaGelo": "+1"
      },
      "passiva": "Tritão (Mestre): +1 dado com lanças e +2 de Reação quando estiver submerso.",
      "template": {
        "Forca": 1,
        "Destreza": 2,
        "Vigor": 2,
        "Carisma": 2,
        "Manipulacao": 1,
        "Persuasao": 2,
        "Percepcao": 2,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Troll": {
      "nome": "Troll",
      "bonus": {
        "Vitalidade": "+10",
        "Mana": "+5",
        "SuporteInvertido": "Magias de suporte causam dano/debuff"
      },
      "fraqueza": {},
      "evolucao": {
        "Armas1H": "+2",
        "Armas2H": "+2"
      },
      "passiva": "Regeneração Rápida: Recuperam automaticamente +4\n                                Vitalidade e +2 Mana por turno, sem custo.",
      "template": {
        "Forca": 3,
        "Destreza": 1,
        "Vigor": 4,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Vampiro": {
      "nome": "Vampiro",
      "bonus": {
        "Reacao": "+1",
        "Furtividade": "+1",
        "MorteSubitaSobSol": true
      },
      "fraqueza": {
        "ResistenciaSagrada": "-3"
      },
      "evolucao": {
        "Reacao": "+2",
        "Furtividade": "+2"
      },
      "passiva": "Regeneração Sanguínea: Pode converter Pontos de Sangue (Mana) em Vitalidade\n                            instantaneamente.",
      "template": {
        "Forca": 2,
        "Destreza": 3,
        "Vigor": 1,
        "Carisma": 2,
        "Manipulacao": 2,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 1,
        "Reacao": 1
      }
    },
    "Zumbi": {
      "nome": "Zumbi",
      "bonus": {
        "Virtudes": "+3"
      },
      "fraqueza": {
        "AtributosSociais": "-3"
      },
      "evolucao": {
        "MagiaSombria": "+2"
      },
      "passiva": "Imunes ao cansaço. Não precisam dormir ou respirar. Regeneram +3 Mana por\n                            turno passivamente.",
      "template": {
        "Forca": 2,
        "Destreza": 1,
        "Vigor": 4,
        "Carisma": 1,
        "Manipulacao": 1,
        "Persuasao": 1,
        "Percepcao": 1,
        "Inteligencia": 2,
        "Reacao": 1
      }
    },
    "Animagos": {
      "template": {
        "Forca": 3,
        "Destreza": 3,
        "Inteligencia": 1,
        "ForcaDeVontade": 2
      },
      "passiva": "Instinto da Fera: vantagem narrativa ao rastrear, caçar ou perceber perigo ligado à sua fera-guia.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=animagos",
      "nome": "Animagos"
    },
    "Homúnculo": {
      "template": {
        "Forca": 2,
        "Destreza": 1,
        "Inteligencia": 3,
        "ForcaDeVontade": 3
      },
      "passiva": "Corpo Preparado: resistência natural a venenos e doenças comuns.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=homunculo",
      "nome": "Homúnculo"
    },
    "Golens": {
      "template": {
        "Forca": 4,
        "Destreza": 1,
        "Inteligencia": 2,
        "ForcaDeVontade": 2
      },
      "passiva": "Carapaça Viva: absorve parte de impactos físicos leves.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=golens",
      "nome": "Golens"
    },
    "Wendigo": {
      "template": {
        "Forca": 3,
        "Destreza": 2,
        "Inteligencia": 1,
        "ForcaDeVontade": 3
      },
      "passiva": "Faro do Inverno: rastreia criaturas e rotas em neve ou neblina.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=wendigo",
      "nome": "Wendigo"
    },
    "Elfos do Mar": {
      "template": {
        "Forca": 1,
        "Destreza": 3,
        "Inteligencia": 3,
        "ForcaDeVontade": 2
      },
      "passiva": "Respiração Anfíbia: respira ar e água.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=elfos-do-mar",
      "nome": "Elfos do Mar"
    },
    "Doppelganger": {
      "template": {
        "Forca": 1,
        "Destreza": 4,
        "Inteligencia": 3,
        "ForcaDeVontade": 1
      },
      "passiva": "Olhar Mimético: memoriza detalhes visuais de alguém após observação atenta.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=doppelganger",
      "nome": "Doppelganger"
    },
    "Espectro": {
      "template": {
        "Forca": 1,
        "Destreza": 2,
        "Inteligencia": 3,
        "ForcaDeVontade": 3
      },
      "passiva": "Visão Etérea: percebe presenças espirituais e rastros sobrenaturais sutis.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=espectro",
      "nome": "Espectro"
    },
    "Kitsune": {
      "template": {
        "Forca": 1,
        "Destreza": 3,
        "Inteligencia": 3,
        "ForcaDeVontade": 2
      },
      "passiva": "Fogo-Fátuo: emite uma luz suave, fria e controlada.",
      "bonus": {},
      "fraqueza": {},
      "evolucao": {},
      "link": "origem.html?id=kitsune",
      "nome": "Kitsune"
    }
  },
  "classes": {
    "Arqueiro": {
      "nome": "Arqueiro",
      "statusInicial": {
        "bonus": {
          "Destreza": "+1",
          "ArmasDistancia": "+1"
        },
        "fraqueza": {
          "Briga": "-1"
        }
      },
      "variacoes": {
        "Patrulheiro": {
          "bonus": {
            "Destreza": "+2",
            "ArmasDistancia": "+1"
          },
          "fraqueza": {
            "Briga": "-1",
            "Vigor": "-1"
          }
        },
        "Atirador": {
          "bonus": {
            "ArmasDistancia": "+2",
            "Critico": "+1"
          },
          "fraqueza": {
            "Vigor": "-1",
            "Bloqueio": "-1"
          }
        }
      },
      "weapons": [
        "Arco e Flechas",
        "Adaga"
      ],
      "armor": [
        "Armadura Leve",
        "Armadura Média"
      ],
      "shields": [],
      "pontosClasse": {
        "Destreza": "+1",
        "ArmasDistancia": "+1"
      },
      "penalidadesClasse": {
        "Briga": "-1"
      }
    },
    "Bardo": {
      "nome": "Bardo",
      "statusInicial": {
        "bonus": {
          "Carisma": "+1",
          "Manipulacao": "+1"
        },
        "fraqueza": {
          "Forca": "-1"
        }
      },
      "variacoes": {
        "Iniciante": {
          "bonus": {
            "Carisma": "+1",
            "Manipulacao": "+1",
            "Persuasao": "+1"
          },
          "fraqueza": {
            "Forca": "-1",
            "Destreza": "-1",
            "Vigor": "-1"
          }
        },
        "Musico": {
          "bonus": {
            "Carisma": "+1",
            "Labia": "+1",
            "Manipulacao": "+1"
          },
          "fraqueza": {
            "Intimidacao": "-1",
            "Bloqueio": "-1",
            "Armadura": "-1"
          }
        }
      },
      "weapons": [
        "Cordas",
        "Sopro",
        "Percussão",
        "Adaga",
        "Espada"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "pontosClasse": {
        "Carisma": "+1",
        "Manipulacao": "+1"
      },
      "penalidadesClasse": {
        "Forca": "-1"
      }
    },
    "Bruxo": {
      "nome": "Bruxo",
      "statusInicial": {
        "bonus": {
          "Inteligencia": "+1",
          "MagiaSombria": "+1"
        },
        "fraqueza": {
          "Vigor": "-1"
        }
      },
      "variacoes": {
        "Feiticeiro": {
          "bonus": {
            "MagiaSombria": "+2",
            "Inteligencia": "+1"
          },
          "fraqueza": {
            "Vigor": "-1",
            "ResistenciaSagrada": "-1"
          }
        },
        "PaladinoNegro": {
          "bonus": {
            "Vigor": "+2",
            "MagiaSombria": "+1"
          },
          "fraqueza": {
            "ResistenciaSagrada": "-3"
          }
        }
      },
      "weapons": [
        "Varinha",
        "Cajado",
        "Grimório",
        "Orb",
        "Adaga",
        "Espada",
        "Foice"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "pontosClasse": {
        "Inteligencia": "+1",
        "MagiaSombria": "+1"
      },
      "penalidadesClasse": {
        "Vigor": "-1"
      }
    },
    "Clérigo": {
      "nome": "Clérigo",
      "statusInicial": {
        "bonus": {
          "Carisma": "+1",
          "Inteligencia": "+1"
        },
        "fraqueza": {
          "ResistenciaSombria": "-1"
        }
      },
      "variacoes": {
        "Sacerdote": {
          "bonus": {
            "Carisma": "+2",
            "Inteligencia": "+1"
          },
          "fraqueza": {
            "Forca": "-1",
            "ResistenciaSombria": "-1"
          }
        },
        "Paladino": {
          "bonus": {
            "Vigor": "+2",
            "MagiaSagrada": "+1"
          },
          "fraqueza": {
            "ResistenciaSombria": "-3"
          }
        }
      },
      "weapons": [
        "Martelo",
        "Cajado",
        "Varinha",
        "Lança — 1 Mão",
        "Mongual"
      ],
      "armor": [
        "Armadura Leve",
        "Armadura Média",
        "Armadura Pesada"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal",
        "Escudo de Torre"
      ],
      "pontosClasse": {
        "Carisma": "+1",
        "Inteligencia": "+1"
      },
      "penalidadesClasse": {
        "ResistenciaSombria": "-1"
      }
    },
    "Domador": {
      "nome": "Domador",
      "statusInicial": {
        "bonus": {
          "Reacao": "+1",
          "Adestramento": "+1"
        },
        "fraqueza": {
          "Destreza": "-1"
        }
      },
      "variacoes": {
        "ControladorDeBestas": {
          "bonus": {
            "Reacao": "+1",
            "EmpatiaComAnimais": "+2"
          },
          "fraqueza": {
            "Destreza": "-1",
            "ResistenciaFogo": "-1"
          }
        }
      },
      "weapons": [
        "Chicote",
        "Adaga"
      ],
      "armor": [
        "Armadura Média"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal"
      ],
      "pontosClasse": {
        "Reacao": "+1",
        "Adestramento": "+1"
      },
      "penalidadesClasse": {
        "Destreza": "-1"
      }
    },
    "Druida": {
      "nome": "Druida",
      "statusInicial": {
        "bonus": {
          "Inteligencia": "+1",
          "Medicina": "+1"
        },
        "fraqueza": {
          "ResistenciaFogo": "-1"
        }
      },
      "variacoes": {
        "Xama": {
          "bonus": {
            "Inteligencia": "+2",
            "Medicina": "+1"
          },
          "fraqueza": {
            "ResistenciaFogo": "-2"
          }
        },
        "Metamorfo": {
          "bonus": {
            "Vigor": "+2",
            "EmpatiaAnimal": "+1"
          },
          "fraqueza": {
            "ResistenciaFogo": "-1",
            "Esquiva": "-1"
          }
        }
      },
      "weapons": [
        "Cajado",
        "Varinha",
        "Foice",
        "Foice — 2 Mãos"
      ],
      "armor": [
        "Armadura Média"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal"
      ],
      "pontosClasse": {
        "Inteligencia": "+1",
        "Medicina": "+1"
      },
      "penalidadesClasse": {
        "ResistenciaFogo": "-1"
      }
    },
    "Guerreiro": {
      "nome": "Guerreiro",
      "statusInicial": {
        "bonus": {
          "Forca": "+1",
          "Vigor": "+1"
        },
        "fraqueza": {
          "Destreza": "-1"
        }
      },
      "variacoes": {
        "Barbaro": {
          "bonus": {
            "Forca": "+2",
            "Armas2H": "+1"
          },
          "fraqueza": {
            "Inteligencia": "-2"
          }
        },
        "Espadachim": {
          "bonus": {
            "Forca": "+1",
            "Armas1H": "+2"
          },
          "fraqueza": {
            "Destreza": "-2"
          }
        }
      },
      "weapons": [
        "Espada",
        "Montante",
        "Martelo",
        "Machado",
        "Lança — 1 Mão",
        "Lança — 2 Mãos",
        "Mongual"
      ],
      "armor": [
        "Armadura Média",
        "Armadura Pesada"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal",
        "Escudo de Torre"
      ],
      "pontosClasse": {
        "Forca": "+1",
        "Vigor": "+1"
      },
      "penalidadesClasse": {
        "Destreza": "-1"
      }
    },
    "Ladino": {
      "nome": "Ladino",
      "statusInicial": {
        "bonus": {
          "Critico": "+1",
          "Furtividade": "+1"
        },
        "fraqueza": {
          "Vigor": "-1"
        }
      },
      "variacoes": {
        "Assassino": {
          "bonus": {
            "Critico": "+1",
            "Furtividade": "+2"
          },
          "fraqueza": {
            "Vigor": "-1",
            "Bloqueio": "-1"
          }
        },
        "Ladrao": {
          "bonus": {
            "Critico": "+1",
            "Furtividade": "+1",
            "Seguranca": "+1"
          },
          "fraqueza": {
            "Forca": "-1",
            "Bloqueio": "-1"
          }
        }
      },
      "weapons": [
        "Adaga",
        "Espada",
        "Chicote"
      ],
      "armor": [
        "Armadura Leve",
        "Armadura Média"
      ],
      "shields": [],
      "pontosClasse": {
        "Critico": "+1",
        "Furtividade": "+1"
      },
      "penalidadesClasse": {
        "Vigor": "-1"
      }
    },
    "Lanceiro": {
      "nome": "Lanceiro",
      "statusInicial": {
        "bonus": {
          "Forca": "+1",
          "Destreza": "+1"
        },
        "fraqueza": {
          "Inteligencia": "-1"
        }
      },
      "variacoes": {
        "MestreDasLancas": {
          "bonus": {
            "Destreza": "+2",
            "Forca": "+1"
          },
          "fraqueza": {
            "Inteligencia": "-2"
          }
        },
        "CampeaoReal": {
          "bonus": {
            "Forca": "+2",
            "Carisma": "+2"
          },
          "fraqueza": {
            "Agilidade": "-2"
          }
        }
      },
      "weapons": [
        "Lança — 1 Mão",
        "Lança — 2 Mãos"
      ],
      "armor": [
        "Armadura Média",
        "Armadura Pesada"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal",
        "Escudo de Torre"
      ],
      "pontosClasse": {
        "Forca": "+1",
        "Destreza": "+1"
      },
      "penalidadesClasse": {
        "Inteligencia": "-1"
      }
    },
    "Mago": {
      "nome": "Mago",
      "statusInicial": {
        "bonus": {
          "Inteligencia": "+2"
        },
        "fraqueza": {
          "Vigor": "-1"
        }
      },
      "variacoes": {
        "Feiticeiro": {
          "bonus": {
            "Inteligencia": "+2",
            "Encantamento": "+2"
          },
          "fraqueza": {
            "Forca": "-2"
          }
        },
        "Elementalista": {
          "bonus": {
            "Inteligencia": "+1",
            "ResistenciaMagica": "+1 (Escola)"
          },
          "fraqueza": {
            "Vigor": "-2"
          }
        }
      },
      "weapons": [
        "Varinha",
        "Cajado",
        "Grimório",
        "Orb"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "pontosClasse": {
        "Inteligencia": "+2"
      },
      "penalidadesClasse": {
        "Vigor": "-1"
      }
    },
    "Monge": {
      "nome": "Monge",
      "statusInicial": {
        "bonus": {
          "Forca": "+1",
          "Agilidade": "+1"
        },
        "fraqueza": {
          "UsoArmasPesadas": "-1"
        }
      },
      "variacoes": {
        "ArtistaMarcial": {
          "bonus": {
            "Esquiva": "+1",
            "Briga": "+1",
            "Critico": "+1"
          },
          "fraqueza": {
            "Manipulacao": "-1",
            "Labia": "-1"
          }
        },
        "DobradorElemental": {
          "bonus": {
            "Inteligencia": "+1",
            "Reacao": "+1",
            "MagiaElemental": "+1 (Fogo, Água, Terra, Ar ou Raio)"
          },
          "fraqueza": {
            "Manipulacao": "-2",
            "ResistenciaSombria": "-5"
          }
        }
      },
      "weapons": [
        "Cajado"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "pontosClasse": {
        "Forca": "+1",
        "Agilidade": "+1"
      },
      "penalidadesClasse": {
        "UsoArmasPesadas": "-1"
      }
    },
    "Necromante": {
      "nome": "Necromante",
      "statusInicial": {
        "bonus": {
          "Inteligencia": "+1",
          "MagiaSombria": "+1"
        },
        "fraqueza": {
          "Vigor": "-1"
        }
      },
      "variacoes": {
        "Conjurador": {
          "bonus": {
            "Lideranca": "+2",
            "Inteligencia": "+1"
          },
          "fraqueza": {
            "Carisma": "-1",
            "ResistenciaSagrada": "-1"
          }
        },
        "Sombrio": {
          "bonus": {
            "MagiaSombria": "+2",
            "Inteligencia": "+1"
          },
          "fraqueza": {
            "ResistenciaSagrada": "-3"
          }
        }
      },
      "weapons": [
        "Foice",
        "Foice — 2 Mãos",
        "Varinha",
        "Cajado",
        "Grimório",
        "Orb"
      ],
      "armor": [
        "Armadura Média"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal"
      ],
      "pontosClasse": {
        "Inteligencia": "+1",
        "MagiaSombria": "+1"
      },
      "penalidadesClasse": {
        "Vigor": "-1"
      }
    },
    "Ninja": {
      "nome": "Ninja",
      "statusInicial": {
        "bonus": {
          "Furtividade": "+2"
        },
        "fraqueza": {
          "Forca": "-1"
        }
      },
      "variacoes": {
        "Jounin": {
          "bonus": {
            "Destreza": "+1",
            "Furtividade": "+1",
            "Investida": "+1"
          },
          "fraqueza": {
            "Vigor": "-2",
            "Forca": "-1"
          }
        }
      },
      "weapons": [
        "Adaga",
        "Espada",
        "Chicote"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "pontosClasse": {
        "Furtividade": "+2"
      },
      "penalidadesClasse": {
        "Forca": "-1"
      }
    },
    "Tecnomancer": {
      "nome": "Tecnomancer",
      "statusInicial": {
        "bonus": {
          "Inteligencia": "+1",
          "Tecnologia": "+1"
        },
        "fraqueza": {
          "Esquiva": "-1",
          "ResistenciaRaio": "-1"
        }
      },
      "variacoes": {
        "Arquitecnomante": {
          "bonus": {
            "Tecnologia": "+2",
            "Inteligencia": "+1"
          },
          "fraqueza": {
            "ResistenciaRaio": "-3"
          }
        }
      },
      "weapons": [
        "Espada",
        "Arco e Flechas",
        "Varinha",
        "Cajado",
        "Orb"
      ],
      "armor": [
        "Armadura Pesada"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal",
        "Escudo de Torre"
      ],
      "pontosClasse": {
        "Inteligencia": "+1",
        "Tecnologia": "+1"
      },
      "penalidadesClasse": {
        "Esquiva": "-1",
        "ResistenciaRaio": "-1"
      }
    },
    "Transmutador": {
      "nome": "Transmutador",
      "statusInicial": {
        "bonus": {
          "Medicina": "+1",
          "Ciencia": "+1"
        },
        "fraqueza": {
          "Forca": "-1"
        }
      },
      "variacoes": {
        "MestreDaTransmutacao": {
          "bonus": {
            "Ciencia": "+2",
            "Tecnologia": "+1"
          },
          "fraqueza": {
            "Forca": "-1",
            "Vigor": "-1"
          }
        }
      },
      "weapons": [
        "Espada",
        "Lança — 1 Mão",
        "Chicote",
        "Varinha",
        "Cajado"
      ],
      "armor": [
        "Armadura Média"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal",
        "Escudo de Torre"
      ],
      "pontosClasse": {
        "Medicina": "+1",
        "Ciencia": "+1"
      },
      "penalidadesClasse": {
        "Forca": "-1"
      }
    },
    "Ilusionista": {
      "nome": "Ilusionista",
      "statusInicial": {
        "bonus": {
          "Inteligencia": 2,
          "Manipulacao": 1
        },
        "fraqueza": {
          "Forca": -1
        }
      },
      "variacoes": {},
      "weapons": [
        "Varinha",
        "Grimório",
        "Orb"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "link": "origem.html?id=ilusionista",
      "pontosClasse": {
        "Inteligencia": 2,
        "Manipulacao": 1
      },
      "penalidadesClasse": {
        "Forca": -1
      }
    },
    "Trapaceiro": {
      "nome": "Trapaceiro",
      "statusInicial": {
        "bonus": {
          "Destreza": 2,
          "Furtividade": 1
        },
        "fraqueza": {
          "Vigor": -1
        }
      },
      "variacoes": {},
      "weapons": [
        "Adaga",
        "Espada",
        "Chicote"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "link": "origem.html?id=trapaceiro",
      "pontosClasse": {
        "Destreza": 2,
        "Furtividade": 1
      },
      "penalidadesClasse": {
        "Vigor": -1
      }
    },
    "Psiónicos": {
      "nome": "Psiónicos",
      "statusInicial": {
        "bonus": {
          "Inteligencia": 1,
          "ForcaDeVontade": 2
        },
        "fraqueza": {
          "Forca": -1
        }
      },
      "variacoes": {},
      "weapons": [
        "Varinha",
        "Cajado",
        "Orb"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "link": "origem.html?id=psionicos",
      "pontosClasse": {
        "Inteligencia": 1,
        "ForcaDeVontade": 2
      },
      "penalidadesClasse": {
        "Forca": -1
      }
    },
    "Antipaladino / Algoz": {
      "nome": "Antipaladino / Algoz",
      "statusInicial": {
        "bonus": {
          "Forca": 2,
          "Vigor": 1
        },
        "fraqueza": {
          "Carisma": -1
        }
      },
      "variacoes": {},
      "weapons": [
        "Montante",
        "Martelo",
        "Machado",
        "Mongual",
        "Espada"
      ],
      "armor": [
        "Armadura Pesada"
      ],
      "shields": [
        "Escudo de Metal",
        "Escudo de Torre"
      ],
      "link": "origem.html?id=antipaladino",
      "pontosClasse": {
        "Forca": 2,
        "Vigor": 1
      },
      "penalidadesClasse": {
        "Carisma": -1
      }
    },
    "Arcanista": {
      "nome": "Arcanista",
      "statusInicial": {
        "bonus": {
          "Inteligencia": 2,
          "Runas": 1
        },
        "fraqueza": {
          "Vigor": -1
        }
      },
      "variacoes": {},
      "weapons": [
        "Varinha",
        "Cajado",
        "Grimório",
        "Orb"
      ],
      "armor": [
        "Armadura Leve"
      ],
      "shields": [],
      "link": "origem.html?id=arcanista",
      "pontosClasse": {
        "Inteligencia": 2,
        "Runas": 1
      },
      "penalidadesClasse": {
        "Vigor": -1
      }
    },
    "Clérigo de Guerra": {
      "nome": "Clérigo de Guerra",
      "statusInicial": {
        "bonus": {
          "Forca": 1,
          "Vigor": 1,
          "Carisma": 1
        },
        "fraqueza": {
          "Destreza": -1
        }
      },
      "variacoes": {},
      "weapons": [
        "Martelo",
        "Mongual",
        "Lança — 1 Mão",
        "Lança — 2 Mãos",
        "Espada"
      ],
      "armor": [
        "Armadura Média",
        "Armadura Pesada"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal",
        "Escudo de Torre"
      ],
      "link": "origem.html?id=clerigo-de-guerra",
      "pontosClasse": {
        "Forca": 1,
        "Vigor": 1,
        "Carisma": 1
      },
      "penalidadesClasse": {
        "Destreza": -1
      }
    },
    "Clérigo Negro": {
      "nome": "Clérigo Negro",
      "statusInicial": {
        "bonus": {
          "Inteligencia": 1,
          "MagiaSombria": 2
        },
        "fraqueza": {
          "ResistenciaSagrada": -1
        }
      },
      "variacoes": {},
      "weapons": [
        "Foice",
        "Foice — 2 Mãos",
        "Grimório",
        "Cajado"
      ],
      "armor": [
        "Armadura Média"
      ],
      "shields": [
        "Broquel de Madeira",
        "Escudo de Metal"
      ],
      "link": "origem.html?id=clerigo-negro",
      "pontosClasse": {
        "Inteligencia": 1,
        "MagiaSombria": 2
      },
      "penalidadesClasse": {
        "ResistenciaSagrada": -1
      }
    }
  },
  "weapons": {
    "Espada": {
      "name": "Espada",
      "category": "1 Mão",
      "attribute": "Força ou Destreza",
      "bonus": "+1 Dano, +1 Crítico",
      "penalty": "-2 Bloqueio",
      "mods": {
        "Critico": 1,
        "Bloqueio": -2
      },
      "source": "curtoalacance.html",
      "allowedClasses": [
        "Bardo",
        "Bruxo",
        "Guerreiro",
        "Ladino",
        "Ninja",
        "Tecnomancer",
        "Transmutador",
        "Trapaceiro",
        "Antipaladino / Algoz",
        "Clérigo de Guerra"
      ]
    },
    "Adaga": {
      "name": "Adaga",
      "category": "1 Mão",
      "attribute": "Destreza",
      "bonus": "+2 Crítico",
      "penalty": "-3 Bloqueio",
      "mods": {
        "Critico": 2,
        "Bloqueio": -3
      },
      "source": "curtoalacance.html",
      "allowedClasses": [
        "Arqueiro",
        "Bardo",
        "Bruxo",
        "Domador",
        "Ladino",
        "Ninja",
        "Trapaceiro"
      ]
    },
    "Montante": {
      "name": "Montante",
      "category": "2 Mãos",
      "attribute": "Força",
      "bonus": "+4 Dano",
      "penalty": "-4 Reação",
      "mods": {
        "Reacao": -4
      },
      "source": "curtoalacance.html",
      "allowedClasses": [
        "Guerreiro",
        "Antipaladino / Algoz"
      ]
    },
    "Martelo": {
      "name": "Martelo",
      "category": "2 Mãos",
      "attribute": "Força",
      "bonus": "+4 Dano",
      "penalty": "-4 Reação",
      "mods": {
        "Reacao": -4
      },
      "source": "curtoalacance.html",
      "allowedClasses": [
        "Clérigo",
        "Guerreiro",
        "Antipaladino / Algoz",
        "Clérigo de Guerra"
      ]
    },
    "Machado": {
      "name": "Machado",
      "category": "2 Mãos",
      "attribute": "Força",
      "bonus": "+4 Dano",
      "penalty": "-4 Reação",
      "mods": {
        "Reacao": -4
      },
      "source": "curtoalacance.html",
      "allowedClasses": [
        "Guerreiro",
        "Antipaladino / Algoz"
      ]
    },
    "Lança — 1 Mão": {
      "name": "Lança — 1 Mão",
      "category": "Médio alcance / 1 Mão",
      "attribute": "Força",
      "bonus": "+1 Alcance, +1 Ignora Armadura",
      "penalty": "-2 Esquiva",
      "mods": {
        "Esquiva": -2
      },
      "source": "medioalcance.html",
      "allowedClasses": [
        "Clérigo",
        "Guerreiro",
        "Lanceiro",
        "Transmutador",
        "Clérigo de Guerra"
      ]
    },
    "Chicote": {
      "name": "Chicote",
      "category": "Médio alcance / 1 Mão",
      "attribute": "Destreza",
      "bonus": "+1 Alcance, +1 Ignora Armadura",
      "penalty": "-2 Esquiva",
      "mods": {
        "Esquiva": -2
      },
      "source": "medioalcance.html",
      "allowedClasses": [
        "Domador",
        "Ladino",
        "Ninja",
        "Transmutador",
        "Trapaceiro"
      ]
    },
    "Foice": {
      "name": "Foice",
      "category": "Médio alcance / 1 Mão",
      "attribute": "Inteligência",
      "bonus": "+1 Alcance, +1 Ignora Armadura",
      "penalty": "-2 Esquiva",
      "mods": {
        "Esquiva": -2
      },
      "source": "medioalcance.html",
      "allowedClasses": [
        "Bruxo",
        "Druida",
        "Necromante",
        "Clérigo Negro"
      ]
    },
    "Lança — 2 Mãos": {
      "name": "Lança — 2 Mãos",
      "category": "Médio alcance / 2 Mãos",
      "attribute": "Força",
      "bonus": "+1 Alcance, +3 Ignora Armadura",
      "penalty": "-2 Esquiva, -2 Bloqueio",
      "mods": {
        "Esquiva": -2,
        "Bloqueio": -2
      },
      "source": "medioalcance2M.html",
      "allowedClasses": [
        "Guerreiro",
        "Lanceiro",
        "Clérigo de Guerra"
      ]
    },
    "Mongual": {
      "name": "Mongual",
      "category": "Médio alcance / 2 Mãos",
      "attribute": "Força",
      "bonus": "+1 Alcance, +3 Ignora Armadura",
      "penalty": "-2 Esquiva, -2 Bloqueio",
      "mods": {
        "Esquiva": -2,
        "Bloqueio": -2
      },
      "source": "medioalcance2M.html",
      "allowedClasses": [
        "Clérigo",
        "Guerreiro",
        "Antipaladino / Algoz",
        "Clérigo de Guerra"
      ]
    },
    "Foice — 2 Mãos": {
      "name": "Foice — 2 Mãos",
      "category": "Médio alcance / 2 Mãos",
      "attribute": "Inteligência",
      "bonus": "+1 Alcance, +3 Ignora Armadura",
      "penalty": "-2 Esquiva, -2 Bloqueio",
      "mods": {
        "Esquiva": -2,
        "Bloqueio": -2
      },
      "source": "medioalcance2M.html",
      "allowedClasses": [
        "Druida",
        "Necromante",
        "Clérigo Negro"
      ]
    },
    "Arco e Flechas": {
      "name": "Arco e Flechas",
      "category": "À Distância",
      "attribute": "Destreza",
      "bonus": "Alvo sofre -1 dado de Esquiva",
      "penalty": "-2 Bloqueio",
      "mods": {
        "Bloqueio": -2
      },
      "source": "longo.html",
      "allowedClasses": [
        "Arqueiro",
        "Tecnomancer"
      ]
    },
    "Varinha": {
      "name": "Varinha",
      "category": "Mágica",
      "attribute": "Inteligência",
      "bonus": "+1 INT, +1 Reg. Mana",
      "penalty": "-1 Bloqueio, -1 Vigor",
      "mods": {
        "Inteligencia": 1,
        "Bloqueio": -1,
        "Vigor": -1
      },
      "source": "magicos.html",
      "allowedClasses": [
        "Bruxo",
        "Clérigo",
        "Druida",
        "Mago",
        "Necromante",
        "Tecnomancer",
        "Transmutador",
        "Ilusionista",
        "Psiónicos",
        "Arcanista"
      ]
    },
    "Cajado": {
      "name": "Cajado",
      "category": "Mágica / 2 Mãos",
      "attribute": "Inteligência",
      "bonus": "+3 INT, +3 Reg. Mana",
      "penalty": "-2 Bloqueio, -2 Vigor",
      "mods": {
        "Inteligencia": 3,
        "Bloqueio": -2,
        "Vigor": -2
      },
      "source": "magicos.html",
      "allowedClasses": [
        "Bruxo",
        "Clérigo",
        "Druida",
        "Mago",
        "Monge",
        "Necromante",
        "Tecnomancer",
        "Transmutador",
        "Psiónicos",
        "Arcanista",
        "Clérigo Negro"
      ]
    },
    "Grimório": {
      "name": "Grimório",
      "category": "Mágica",
      "attribute": "Inteligência",
      "bonus": "+2 INT",
      "penalty": "-2 Bloqueio",
      "mods": {
        "Inteligencia": 2,
        "Bloqueio": -2
      },
      "source": "magicos.html",
      "allowedClasses": [
        "Bruxo",
        "Mago",
        "Necromante",
        "Ilusionista",
        "Arcanista",
        "Clérigo Negro"
      ]
    },
    "Orb": {
      "name": "Orb",
      "category": "Mágica",
      "attribute": "Inteligência",
      "bonus": "+2 Reg. Mana",
      "penalty": "-2 Vigor",
      "mods": {
        "Vigor": -2
      },
      "source": "magicos.html",
      "allowedClasses": [
        "Bruxo",
        "Mago",
        "Necromante",
        "Tecnomancer",
        "Ilusionista",
        "Psiónicos",
        "Arcanista"
      ]
    },
    "Cordas": {
      "name": "Cordas",
      "category": "Instrumental",
      "attribute": "Carisma",
      "bonus": "Reduz 1 sucesso contra o músico",
      "penalty": "Não ataca nem bloqueia",
      "mods": {},
      "source": "Instrumentais.html",
      "allowedClasses": [
        "Bardo"
      ]
    },
    "Sopro": {
      "name": "Sopro",
      "category": "Instrumental",
      "attribute": "Carisma",
      "bonus": "+1 Regeneração de Vida e Mana",
      "penalty": "Não ataca nem bloqueia",
      "mods": {},
      "source": "Instrumentais.html",
      "allowedClasses": [
        "Bardo"
      ]
    },
    "Percussão": {
      "name": "Percussão",
      "category": "Instrumental",
      "attribute": "Carisma",
      "bonus": "+1 sucesso para aliados contra um alvo",
      "penalty": "Não ataca nem bloqueia",
      "mods": {},
      "source": "Instrumentais.html",
      "allowedClasses": [
        "Bardo"
      ]
    }
  },
  "armors": {
    "Armadura Leve": {
      "name": "Armadura Leve",
      "bonus": "+1 Armadura",
      "penalty": "Sem penalidades",
      "mods": {
        "Armadura": 1
      },
      "allowedClasses": [
        "Arqueiro",
        "Bardo",
        "Bruxo",
        "Clérigo",
        "Ladino",
        "Mago",
        "Monge",
        "Ninja",
        "Ilusionista",
        "Trapaceiro",
        "Psiónicos",
        "Arcanista"
      ]
    },
    "Armadura Média": {
      "name": "Armadura Média",
      "bonus": "+4 Armadura",
      "penalty": "-2 Esquiva, -1 Reação",
      "mods": {
        "Armadura": 4,
        "Esquiva": -2,
        "Reacao": -1
      },
      "allowedClasses": [
        "Arqueiro",
        "Clérigo",
        "Domador",
        "Druida",
        "Guerreiro",
        "Ladino",
        "Lanceiro",
        "Necromante",
        "Transmutador",
        "Clérigo de Guerra",
        "Clérigo Negro"
      ]
    },
    "Armadura Pesada": {
      "name": "Armadura Pesada",
      "bonus": "Alta Defesa",
      "penalty": "+2 dificuldade de Mobilidade; -2 Reação; -2 Res. Fogo/Raio",
      "mods": {
        "Reacao": -2,
        "ResistenciaFogo": -2,
        "ResistenciaRaio": -2
      },
      "allowedClasses": [
        "Clérigo",
        "Guerreiro",
        "Lanceiro",
        "Tecnomancer",
        "Antipaladino / Algoz",
        "Clérigo de Guerra"
      ]
    }
  },
  "shields": {
    "Broquel de Madeira": {
      "name": "Broquel de Madeira",
      "bonus": "Anula 1 sucesso / pode anular ataque",
      "penalty": "-2 Res. Fogo",
      "mods": {
        "ResistenciaFogo": -2
      },
      "allowedClasses": [
        "Clérigo",
        "Domador",
        "Druida",
        "Guerreiro",
        "Lanceiro",
        "Necromante",
        "Tecnomancer",
        "Transmutador",
        "Clérigo de Guerra",
        "Clérigo Negro"
      ]
    },
    "Escudo de Metal": {
      "name": "Escudo de Metal",
      "bonus": "Anula 2 sucessos; +1 Bloqueio",
      "penalty": "-2 Res. Fogo e Raio",
      "mods": {
        "Bloqueio": 1,
        "ResistenciaFogo": -2,
        "ResistenciaRaio": -2
      },
      "allowedClasses": [
        "Clérigo",
        "Domador",
        "Druida",
        "Guerreiro",
        "Lanceiro",
        "Necromante",
        "Tecnomancer",
        "Transmutador",
        "Antipaladino / Algoz",
        "Clérigo de Guerra",
        "Clérigo Negro"
      ]
    },
    "Escudo de Torre": {
      "name": "Escudo de Torre",
      "bonus": "Anula 3 sucessos; +3 Bloqueio; +8 Armadura",
      "penalty": "-4 Res. Elemental",
      "mods": {
        "Bloqueio": 3,
        "Armadura": 8
      },
      "allowedClasses": [
        "Clérigo",
        "Guerreiro",
        "Lanceiro",
        "Tecnomancer",
        "Transmutador",
        "Antipaladino / Algoz",
        "Clérigo de Guerra"
      ]
    }
  },
  "rules": {
    "version": "2.0",
    "racePoints": "Os atributos-base são definidos pela raça. Os nove atributos principais começam no perfil racial e podem ser ajustados na ficha.",
    "classPoints": "A classe acrescenta pontos de treinamento e penalidades sobre os atributos e habilidades da raça.",
    "equipment": "A classe determina quais armas, armaduras e escudos podem ser equipados. Cada equipamento aplica bônus e penalidades próprios."
  }
};

/* ==========================================================
   HURRAS FANTASY - EXPANSAO DARK FANTASY / SOULSLIKE
   Mantem o banco original e acrescenta armas, protecoes e magias.
   A compatibilidade e sincronizada automaticamente com as classes.
========================================================== */
(() => {
  const D = window.HURRAS_RPG;
  if (!D || D.__darkExpansionLoaded) return;
  D.__darkExpansionLoaded = true;

  const W = {
    'Espada Longa do Exilado': {category:'1 Mão',attribute:'Força',rarity:'Comum',requirement:'Força 2',bonus:'+1 Arma 1 Mão, +1 Bloqueio',penalty:'-1 Reação',mods:{Armas1H:1,Bloqueio:1,Reacao:-1},allowedClasses:['Guerreiro','Lanceiro','Clérigo','Clérigo de Guerra','Antipaladino / Algoz']},
    'Espada Curva da Cinza': {category:'1 Mão',attribute:'Destreza',rarity:'Incomum',requirement:'Destreza 2',bonus:'+2 Esquiva, +1 Crítico',penalty:'-1 Bloqueio',mods:{Esquiva:2,Critico:1,Bloqueio:-1},allowedClasses:['Ladino','Ninja','Arqueiro','Trapaceiro']},
    'Rapieira do Vigia': {category:'1 Mão',attribute:'Destreza',rarity:'Incomum',requirement:'Destreza 3',bonus:'+2 Crítico, +1 Reação',penalty:'-1 Briga',mods:{Critico:2,Reacao:1,Briga:-1},allowedClasses:['Ladino','Ninja','Bardo','Trapaceiro']},
    'Sabre da Lua Morta': {category:'1 Mão / Mágica',attribute:'Destreza + Inteligência',rarity:'Rara',requirement:'Destreza 2 / Inteligência 2',bonus:'+1 Crítico, +1 Magia Sombria',penalty:'-1 Vigor',mods:{Critico:1,MagiaSombria:1,Vigor:-1},allowedClasses:['Bruxo','Necromante','Ninja','Clérigo Negro']},
    'Machado de Mão do Carrasco': {category:'1 Mão',attribute:'Força',rarity:'Incomum',requirement:'Força 3',bonus:'+2 Investida, +1 Crítico',penalty:'-1 Esquiva',mods:{Investida:2,Critico:1,Esquiva:-1},allowedClasses:['Guerreiro','Antipaladino / Algoz','Clérigo de Guerra']},
    'Maça do Peregrino': {category:'1 Mão',attribute:'Força',rarity:'Comum',requirement:'Força 2',bonus:'+1 Bloqueio, +1 Armadura',penalty:'-1 Destreza',mods:{Bloqueio:1,Armadura:1,Destreza:-1},allowedClasses:['Clérigo','Guerreiro','Clérigo de Guerra']},
    'Picareta de Ferro Negro': {category:'1 Mão',attribute:'Força',rarity:'Incomum',requirement:'Força 2',bonus:'+2 Ofício, +1 Crítico',penalty:'-1 Persuasão',mods:{Oficio:2,Critico:1,Persuasao:-1},allowedClasses:['Guerreiro','Tecnomancer','Transmutador']},
    'Kukri do Rato Cinzento': {category:'1 Mão',attribute:'Destreza',rarity:'Comum',requirement:'Destreza 2',bonus:'+2 Furtividade, +1 Crítico',penalty:'-1 Bloqueio',mods:{Furtividade:2,Critico:1,Bloqueio:-1},allowedClasses:['Ladino','Ninja','Trapaceiro']},
    'Punhal do Vazio': {category:'1 Mão / Mágica',attribute:'Destreza + Inteligência',rarity:'Rara',requirement:'Destreza 2 / Inteligência 2',bonus:'+2 Furtividade, +1 Magia Sombria',penalty:'-2 Vigor',mods:{Furtividade:2,MagiaSombria:1,Vigor:-2},allowedClasses:['Bruxo','Necromante','Ladino','Clérigo Negro']},
    'Espada Rúnica de Kharn': {category:'1 Mão / Mágica',attribute:'Força + Runas',rarity:'Rara',requirement:'Força 2 / Runas 2',bonus:'+2 Runas, +1 Arma 1 Mão',penalty:'-1 Reação',mods:{Runas:2,Armas1H:1,Reacao:-1},allowedClasses:['Transmutador','Tecnomancer','Guerreiro','Arcanista']},

    'Ultra-Montante de Pedra': {category:'2 Mãos',attribute:'Força',rarity:'Rara',requirement:'Força 4',bonus:'+3 Investida, +2 Bloqueio',penalty:'-3 Esquiva, -1 Reação',mods:{Investida:3,Bloqueio:2,Esquiva:-3,Reacao:-1},allowedClasses:['Guerreiro','Antipaladino / Algoz']},
    'Grande Machado do Abismo': {category:'2 Mãos / Mágica',attribute:'Força',rarity:'Épica',requirement:'Força 4 / Magia Sombria 2',bonus:'+3 Crítico, +2 Magia Sombria',penalty:'-2 Reação, -2 Sagrado',mods:{Critico:3,MagiaSombria:2,Reacao:-2,ResistenciaSagrada:-2},allowedClasses:['Antipaladino / Algoz','Clérigo Negro','Necromante']},
    'Martelo Colossal do Sino': {category:'2 Mãos',attribute:'Força',rarity:'Rara',requirement:'Força 4',bonus:'+4 Bloqueio, +2 Armadura',penalty:'-3 Destreza',mods:{Bloqueio:4,Armadura:2,Destreza:-3},allowedClasses:['Guerreiro','Clérigo de Guerra']},
    'Alabarda do Guardião': {category:'Médio alcance / 2 Mãos',attribute:'Força + Destreza',rarity:'Incomum',requirement:'Força 2 / Destreza 2',bonus:'+2 Investida, +1 Bloqueio',penalty:'-1 Esquiva',mods:{Investida:2,Bloqueio:1,Esquiva:-1},allowedClasses:['Guerreiro','Lanceiro','Clérigo de Guerra']},
    'Glaive da Catedral': {category:'Médio alcance / 2 Mãos',attribute:'Destreza',rarity:'Rara',requirement:'Destreza 3',bonus:'+2 Arma 2 Mãos, +1 Crítico',penalty:'-1 Vigor',mods:{Armas2H:2,Critico:1,Vigor:-1},allowedClasses:['Lanceiro','Monge','Clérigo de Guerra']},
    'Foice do Ceifador Pálido': {category:'Médio alcance / 2 Mãos / Mágica',attribute:'Destreza + Inteligência',rarity:'Épica',requirement:'Destreza 3 / Inteligência 3',bonus:'+2 Crítico, +2 Magia Sombria',penalty:'-2 Bloqueio',mods:{Critico:2,MagiaSombria:2,Bloqueio:-2},allowedClasses:['Necromante','Bruxo','Clérigo Negro']},
    'Espadão Profanado': {category:'2 Mãos / Mágica',attribute:'Força + Inteligência',rarity:'Épica',requirement:'Força 3 / Inteligência 2',bonus:'+2 Força, +2 Magia Sombria',penalty:'-2 Res. Sagrado',mods:{Forca:2,MagiaSombria:2,ResistenciaSagrada:-2},allowedClasses:['Antipaladino / Algoz','Clérigo Negro']},
    'Marreta do Gigante Caído': {category:'2 Mãos',attribute:'Força',rarity:'Lendária',requirement:'Força 5',bonus:'+4 Investida, +3 Armadura',penalty:'-4 Esquiva, -2 Reação',mods:{Investida:4,Armadura:3,Esquiva:-4,Reacao:-2},allowedClasses:['Guerreiro']},
    'Lança do Dragão Morto': {category:'Médio alcance / 2 Mãos',attribute:'Força + Destreza',rarity:'Épica',requirement:'Força 3 / Destreza 3',bonus:'+3 Investida, +2 Crítico',penalty:'-1 Bloqueio',mods:{Investida:3,Critico:2,Bloqueio:-1},allowedClasses:['Lanceiro','Guerreiro']},
    'Machado Crescente de Ymir': {category:'2 Mãos',attribute:'Força',rarity:'Rara',requirement:'Força 4',bonus:'+3 Força, +1 Crítico',penalty:'-2 Destreza',mods:{Forca:3,Critico:1,Destreza:-2},allowedClasses:['Guerreiro','Antipaladino / Algoz']},
    'Corrente do Penitente': {category:'Médio alcance / 2 Mãos',attribute:'Força',rarity:'Rara',requirement:'Força 3',bonus:'+2 Investida, +1 Intimidação',penalty:'-2 Reação',mods:{Investida:2,Intimidacao:1,Reacao:-2},allowedClasses:['Clérigo de Guerra','Antipaladino / Algoz','Guerreiro']},

    'Arco Longo do Caçador Cinzento': {category:'À Distância',attribute:'Destreza',rarity:'Incomum',requirement:'Destreza 3',bonus:'+2 Arma Distância, +1 Percepção',penalty:'-1 Bloqueio',mods:{ArmasDistancia:2,Percepcao:1,Bloqueio:-1},allowedClasses:['Arqueiro','Ladino','Ninja']},
    'Arco Composto de Osso': {category:'À Distância',attribute:'Destreza',rarity:'Rara',requirement:'Destreza 3',bonus:'+2 Crítico, +1 Arma Distância',penalty:'-1 Vigor',mods:{Critico:2,ArmasDistancia:1,Vigor:-1},allowedClasses:['Arqueiro','Ladino']},
    'Besta Leve': {category:'À Distância',attribute:'Destreza',rarity:'Comum',requirement:'Destreza 2',bonus:'+1 Arma Distância, +1 Crítico',penalty:'-1 Reação após disparo',mods:{ArmasDistancia:1,Critico:1,Reacao:-1},allowedClasses:['Arqueiro','Ladino','Tecnomancer','Trapaceiro']},
    'Besta Pesada do Cerco': {category:'À Distância',attribute:'Força + Destreza',rarity:'Rara',requirement:'Força 3 / Destreza 2',bonus:'+3 Arma Distância, +2 Crítico',penalty:'-2 Reação, -1 Esquiva',mods:{ArmasDistancia:3,Critico:2,Reacao:-2,Esquiva:-1},allowedClasses:['Arqueiro','Guerreiro','Tecnomancer']},
    'Besta de Repetição': {category:'À Distância',attribute:'Destreza + Tecnologia',rarity:'Rara',requirement:'Destreza 2 / Tecnologia 2',bonus:'+2 Reação, +1 Arma Distância',penalty:'-1 Crítico',mods:{Reacao:2,ArmasDistancia:1,Critico:-1},allowedClasses:['Arqueiro','Tecnomancer','Trapaceiro']},
    'Arco Negro do Eclipse': {category:'À Distância / Mágica',attribute:'Destreza + Inteligência',rarity:'Épica',requirement:'Destreza 3 / Inteligência 2',bonus:'+2 Crítico, +2 Magia Sombria',penalty:'-2 Resistência Sagrada',mods:{Critico:2,MagiaSombria:2,ResistenciaSagrada:-2},allowedClasses:['Arqueiro','Bruxo','Clérigo Negro']},
    'Funda Rúnica': {category:'À Distância / Mágica',attribute:'Destreza + Runas',rarity:'Incomum',requirement:'Destreza 2 / Runas 1',bonus:'+2 Runas, +1 Arma Distância',penalty:'-1 Bloqueio',mods:{Runas:2,ArmasDistancia:1,Bloqueio:-1},allowedClasses:['Transmutador','Tecnomancer','Arqueiro']},
    'Lançador de Dardos Envenenados': {category:'À Distância',attribute:'Destreza',rarity:'Incomum',requirement:'Destreza 2',bonus:'+1 Crítico, +2 Veneno',penalty:'-1 Força',mods:{Critico:1,ResistenciaVeneno:2,Forca:-1},allowedClasses:['Ninja','Ladino','Trapaceiro']},

    'Cajado de Cinzas': {category:'Mágica / 2 Mãos',attribute:'Inteligência',rarity:'Rara',requirement:'Inteligência 3',bonus:'+3 Inteligência, +2 Reg. Mana',penalty:'-2 Bloqueio, -1 Vigor',mods:{Inteligencia:3,Bloqueio:-2,Vigor:-1},allowedClasses:['Mago','Bruxo','Druida','Arcanista']},
    'Catalisador Abissal': {category:'Mágica / 1 Mão',attribute:'Inteligência',rarity:'Épica',requirement:'Inteligência 4 / Sombrio 2',bonus:'+3 Magia Sombria, +1 Ocultação',penalty:'-3 Res. Sagrado',mods:{MagiaSombria:3,Ocultacao:1,ResistenciaSagrada:-3},allowedClasses:['Bruxo','Necromante','Clérigo Negro']},
    'Sino Sagrado do Peregrino': {category:'Mágica / 1 Mão',attribute:'Carisma',rarity:'Rara',requirement:'Carisma 3 / Sagrado 2',bonus:'+3 Magia Sagrada, +1 Coragem',penalty:'-1 Furtividade',mods:{MagiaSagrada:3,Coragem:1,Furtividade:-1},allowedClasses:['Clérigo','Clérigo de Guerra']},
    'Talismã de Ossos': {category:'Mágica / 1 Mão',attribute:'Inteligência',rarity:'Rara',requirement:'Inteligência 2 / Ocultação 2',bonus:'+2 Ocultação, +2 Magia Sombria',penalty:'-1 Carisma',mods:{Ocultacao:2,MagiaSombria:2,Carisma:-1},allowedClasses:['Necromante','Bruxo','Clérigo Negro']},
    'Grimório Profanado': {category:'Mágica / 2 Mãos',attribute:'Inteligência',rarity:'Épica',requirement:'Inteligência 4',bonus:'+3 Encantamento, +2 Magia Sombria',penalty:'-2 Reação',mods:{Encantamento:3,MagiaSombria:2,Reacao:-2},allowedClasses:['Bruxo','Necromante','Arcanista']},
    'Orbe do Eclipse': {category:'Mágica / 1 Mão',attribute:'Inteligência',rarity:'Épica',requirement:'Inteligência 4',bonus:'+2 Magia Mental, +2 Magia Sombria',penalty:'-2 Vigor',mods:{MagiaMental:2,MagiaSombria:2,Vigor:-2},allowedClasses:['Ilusionista','Psiónicos','Bruxo']},
    'Varinha de Cristal Negro': {category:'Mágica / 1 Mão',attribute:'Inteligência',rarity:'Rara',requirement:'Inteligência 3',bonus:'+2 Encantamento, +1 Crítico Mágico',penalty:'-1 Força',mods:{Encantamento:2,Forca:-1},allowedClasses:['Mago','Arcanista','Ilusionista']},
    'Lâmina Arcana': {category:'Mágica / 1 Mão',attribute:'Destreza + Inteligência',rarity:'Rara',requirement:'Destreza 2 / Inteligência 3',bonus:'+1 Arma 1 Mão, +2 Encantamento',penalty:'-1 Vigor',mods:{Armas1H:1,Encantamento:2,Vigor:-1},allowedClasses:['Mago','Arcanista','Transmutador']},
    'Chama Piromântica': {category:'Mágica / 1 Mão',attribute:'Inteligência',rarity:'Rara',requirement:'Inteligência 2 / Fogo 2',bonus:'+3 Magia de Fogo',penalty:'-2 Resistência Água',mods:{MagiaFogo:3,ResistenciaAgua:-2},allowedClasses:['Mago','Bruxo','Arcanista']},
    'Totem Druídico da Raiz Antiga': {category:'Mágica / 2 Mãos',attribute:'Inteligência + Medicina',rarity:'Rara',requirement:'Inteligência 2 / Medicina 2',bonus:'+2 Medicina, +2 Terra',penalty:'-2 Resistência Fogo',mods:{Medicina:2,MagiaTerra:2,ResistenciaFogo:-2},allowedClasses:['Druida']},
    'Ídolo Psíquico Fraturado': {category:'Mágica / 1 Mão',attribute:'Inteligência + Percepção',rarity:'Épica',requirement:'Inteligência 3 / Percepção 3',bonus:'+3 Magia Mental, +1 Percepção',penalty:'-2 Coragem',mods:{MagiaMental:3,Percepcao:1,Coragem:-2},allowedClasses:['Psiónicos','Ilusionista']},
    'Relicário do Sol Morto': {category:'Mágica / 1 Mão',attribute:'Carisma + Inteligência',rarity:'Lendária',requirement:'Carisma 4 / Sagrado 3',bonus:'+3 Magia Sagrada, +2 Força de Vontade',penalty:'-2 Magia Sombria',mods:{MagiaSagrada:3,MagiaSombria:-2},allowedClasses:['Clérigo','Clérigo de Guerra']},

    'Alaúde de Guerra': {category:'Instrumental / 2 Mãos',attribute:'Carisma',rarity:'Rara',requirement:'Carisma 3',bonus:'+2 Liderança, +2 Persuasão',penalty:'-2 Furtividade',mods:{Lideranca:2,Persuasao:2,Furtividade:-2},allowedClasses:['Bardo']},
    'Flauta de Ossos': {category:'Instrumental / 1 Mão',attribute:'Carisma',rarity:'Incomum',requirement:'Carisma 2',bonus:'+2 Manipulação, +1 Ocultação',penalty:'-1 Coragem',mods:{Manipulacao:2,Ocultacao:1,Coragem:-1},allowedClasses:['Bardo','Necromante']}
  };
  Object.entries(W).forEach(([name,w]) => { D.weapons[name] = {name, lore:'Relíquia de um mundo em ruínas. Seu poder exige preço, disciplina e domínio.', source:'armas.html', ...w}; });

  const A = {
    'Traje do Errante': {name:'Traje do Errante',rarity:'Comum',bonus:'+2 Esquiva, +1 Furtividade',penalty:'-1 Armadura',mods:{Esquiva:2,Furtividade:1,Armadura:-1},allowedClasses:['Ladino','Ninja','Arqueiro','Bardo','Ilusionista','Trapaceiro']},
    'Cota do Cavaleiro Cinzento': {name:'Cota do Cavaleiro Cinzento',rarity:'Rara',bonus:'+6 Armadura, +1 Bloqueio',penalty:'-2 Reação, -1 Esquiva',mods:{Armadura:6,Bloqueio:1,Reacao:-2,Esquiva:-1},allowedClasses:['Guerreiro','Lanceiro','Clérigo','Clérigo de Guerra']},
    'Armadura do Exilado': {name:'Armadura do Exilado',rarity:'Épica',bonus:'+8 Armadura, +2 Vigor',penalty:'-3 Esquiva, -2 Reação',mods:{Armadura:8,Vigor:2,Esquiva:-3,Reacao:-2},allowedClasses:['Guerreiro','Antipaladino / Algoz','Clérigo de Guerra']},
    'Vestes do Abismo': {name:'Vestes do Abismo',rarity:'Épica',bonus:'+2 Magia Sombria, +2 Ocultação',penalty:'-3 Res. Sagrado',mods:{MagiaSombria:2,Ocultacao:2,ResistenciaSagrada:-3},allowedClasses:['Bruxo','Necromante','Clérigo Negro']},
    'Manto do Arquimago': {name:'Manto do Arquimago',rarity:'Lendária',bonus:'+3 Inteligência, +2 Encantamento',penalty:'-2 Vigor',mods:{Inteligencia:3,Encantamento:2,Vigor:-2},allowedClasses:['Mago','Arcanista','Ilusionista']}
  };
  Object.assign(D.armors,A);

  const S = {
    'Escudo do Cavaleiro Morto': {name:'Escudo do Cavaleiro Morto',rarity:'Rara',bonus:'+3 Bloqueio, +4 Armadura',penalty:'-2 Reação',mods:{Bloqueio:3,Armadura:4,Reacao:-2},allowedClasses:['Guerreiro','Lanceiro','Clérigo de Guerra','Antipaladino / Algoz']},
    'Broquel Rúnico': {name:'Broquel Rúnico',rarity:'Rara',bonus:'+2 Bloqueio, +2 Runas',penalty:'-1 Esquiva',mods:{Bloqueio:2,Runas:2,Esquiva:-1},allowedClasses:['Transmutador','Tecnomancer','Clérigo','Guerreiro']},
    'Escudo Solar Quebrado': {name:'Escudo Solar Quebrado',rarity:'Épica',bonus:'+3 Bloqueio, +3 Res. Sombria',penalty:'-2 Furtividade',mods:{Bloqueio:3,ResistenciaSombria:3,Furtividade:-2},allowedClasses:['Clérigo','Clérigo de Guerra']}
  };
  Object.assign(D.shields,S);

  D.spells = D.spells || {};
  Object.assign(D.spells, {
    Fogo:[
      {name:'Brasa do Condenado',tier:'Aprendiz',desc:'Acende brasas malditas no alvo; se ele atacar, as chamas crescem.',info:'2d6 fogo | Queimadura 2 turnos | 6 Mana'},
      {name:'Arco de Cinzas',tier:'Aprendiz',desc:'Varre um arco curto de fogo e cinzas diante do conjurador.',info:'3d4 fogo | Cone 4m | 7 Mana'},
      {name:'Marca do Forno Negro',tier:'Profissional',desc:'Marca o inimigo; dano de fogo recebido por ele aumenta.',info:'+25% dano de fogo | 3 turnos | 12 Mana'},
      {name:'Chuva de Carvão',tier:'Profissional',desc:'Fragmentos incandescentes caem em uma pequena área.',info:'4d6 fogo | Área 6m | 14 Mana'},
      {name:'Coração de Magma',tier:'Mestre',desc:'O corpo pulsa como uma forja e devolve calor a quem se aproxima.',info:'+3 Armadura | 2d6 contato | 24 Mana'},
      {name:'Coroa da Primeira Chama',tier:'Mestre',desc:'Uma coroa de fogo antigo aumenta o poder, mas consome Vitalidade.',info:'+3 Fogo | perde 1 Vitalidade/turno | 30 Mana'}
    ],
    Água:[
      {name:'Lamento da Maré',tier:'Aprendiz',desc:'Uma corrente fria reduz o ímpeto do alvo.',info:'2d6 água | -1 Reação | 5 Mana'},
      {name:'Véu de Geada',tier:'Aprendiz',desc:'Fina camada de gelo protege o corpo.',info:'+2 Armadura | 3 turnos | 6 Mana'},
      {name:'Prisão do Lago Morto',tier:'Profissional',desc:'Gelo sombrio prende pernas e armas.',info:'Imobiliza 1 turno | 12 Mana'},
      {name:'Lâminas de Granizo',tier:'Profissional',desc:'Dispara fragmentos de gelo em sequência.',info:'5d4 | 12m | 14 Mana'},
      {name:'Trono da Maré',tier:'Mestre',desc:'Cria uma massa de água que empurra tudo ao redor.',info:'6d8 | Área 10m | Derruba | 26 Mana'},
      {name:'Silêncio Glacial',tier:'Mestre',desc:'Congela momentaneamente o fluxo mágico na área.',info:'Magias custam +50% | 2 turnos | 30 Mana'}
    ],
    Vento:[
      {name:'Passo da Névoa',tier:'Aprendiz',desc:'Um deslocamento veloz deixa apenas poeira e névoa.',info:'+3 Esquiva | 1 turno | 5 Mana'},
      {name:'Fio Invisível',tier:'Aprendiz',desc:'Uma lâmina de ar corta à distância.',info:'2d8 | 10m | 6 Mana'},
      {name:'Grito da Garganta Vazia',tier:'Profissional',desc:'Uma onda de pressão interrompe conjurações.',info:'3d6 | Interrompe magia | 12 Mana'},
      {name:'Muralha de Vendaval',tier:'Profissional',desc:'Projéteis desviam ao atravessar a corrente.',info:'+3 Defesa contra distância | 3 turnos | 14 Mana'},
      {name:'Asas do Exilado',tier:'Mestre',desc:'O vento sustenta o conjurador acima do solo.',info:'Voo | +2 Movimento | 4 turnos | 24 Mana'},
      {name:'Tempestade sem Nome',tier:'Mestre',desc:'Um ciclone violento domina o campo.',info:'7d8 | Área 12m | 30 Mana'}
    ],
    Terra:[
      {name:'Pele de Cascalho',tier:'Aprendiz',desc:'Pedras recobrem a pele e absorvem impactos.',info:'+2 Armadura | -1 Esquiva | 5 Mana'},
      {name:'Estaca de Basalto',tier:'Aprendiz',desc:'Uma ponta de pedra irrompe sob o alvo.',info:'2d8 | Derruba | 6 Mana'},
      {name:'Mãos do Túmulo',tier:'Profissional',desc:'Braços de terra prendem os pés do inimigo.',info:'Imobiliza | Área 4m | 12 Mana'},
      {name:'Muralha do Sepulcro',tier:'Profissional',desc:'Ergue uma parede de pedra antiga.',info:'Barreira 20 PV | 14 Mana'},
      {name:'Colosso de Rocha',tier:'Mestre',desc:'Invoca um guardião de pedra temporário.',info:'Invocação | 4 turnos | 26 Mana'},
      {name:'Ruptura do Mundo',tier:'Mestre',desc:'Abre fendas violentas no solo.',info:'8d8 | Área 14m | 32 Mana'}
    ],
    Raio:[
      {name:'Faísca do Carrasco',tier:'Aprendiz',desc:'Um arco elétrico salta para o alvo mais próximo.',info:'2d6 raio | 8m | 5 Mana'},
      {name:'Carga Nervosa',tier:'Aprendiz',desc:'Acelera reflexos com energia elétrica.',info:'+2 Reação | 3 turnos | 6 Mana'},
      {name:'Lança de Tempestade',tier:'Profissional',desc:'Concentra um raio perfurante em linha reta.',info:'5d6 | Linha 12m | 13 Mana'},
      {name:'Gaiola de Raios',tier:'Profissional',desc:'Círculo elétrico pune quem atravessa.',info:'3d6 por travessia | 3 turnos | 15 Mana'},
      {name:'Coração da Tormenta',tier:'Mestre',desc:'Raios orbitam o conjurador e atacam inimigos próximos.',info:'2d8/turno | Área 5m | 25 Mana'},
      {name:'Julgamento da Tempestade',tier:'Mestre',desc:'Um raio colossal cai após breve preparação.',info:'9d8 | 18m | 34 Mana'}
    ],
    Veneno:[
      {name:'Névoa Pútrida',tier:'Aprendiz',desc:'Uma nuvem venenosa corrói quem permanece nela.',info:'1d6/turno | Área 4m | 6 Mana'},
      {name:'Sangue Ácido',tier:'Aprendiz',desc:'Transforma o próprio sangue em toxina de contato.',info:'2d6 veneno | 3 turnos | 6 Mana'},
      {name:'Esporos do Cadáver',tier:'Profissional',desc:'Esporos reduzem cura e regeneração.',info:'-50% cura | Área 6m | 12 Mana'},
      {name:'Marca da Serpente',tier:'Profissional',desc:'O próximo golpe aplica veneno acumulativo.',info:'+2d6 veneno | 14 Mana'},
      {name:'Jardim da Pestilência',tier:'Mestre',desc:'Faz brotar plantas tóxicas em uma grande área.',info:'4d6/turno | Área 10m | 26 Mana'},
      {name:'Praga do Rei Verde',tier:'Mestre',desc:'Uma doença mágica enfraquece atributos físicos.',info:'-2 Força e Vigor | 4 turnos | 30 Mana'}
    ],
    Mental:[
      {name:'Sussurro do Poço',tier:'Aprendiz',desc:'Uma voz distante causa hesitação e medo.',info:'-1 Coragem | 6 Mana'},
      {name:'Eco de Memória',tier:'Aprendiz',desc:'Lê um fragmento emocional recente do alvo.',info:'Informação superficial | 5 Mana'},
      {name:'Labirinto Interior',tier:'Profissional',desc:'O alvo perde noção de direção e prioridade.',info:'-2 Percepção | 3 turnos | 13 Mana'},
      {name:'Mão Invisível',tier:'Profissional',desc:'Força psíquica empurra ou puxa um alvo.',info:'Empurra 5m | 12 Mana'},
      {name:'Trono da Mente',tier:'Mestre',desc:'Impõe uma ordem curta a um inimigo vulnerável.',info:'Comando 1 turno | 26 Mana'},
      {name:'Ruptura Psíquica',tier:'Mestre',desc:'Uma explosão mental atravessa armadura física.',info:'8d8 mental | ignora Armadura | 32 Mana'}
    ],
    Sombrio:[
      {name:'Mão do Abismo',tier:'Aprendiz',desc:'Uma sombra alongada agarra o tornozelo do alvo.',info:'2d6 sombrio | -2 Movimento | 6 Mana'},
      {name:'Véu Sem Luz',tier:'Aprendiz',desc:'Apaga a presença do conjurador por instantes.',info:'+3 Furtividade | 2 turnos | 7 Mana'},
      {name:'Lâmina da Humanidade',tier:'Profissional',desc:'Materializa uma espada de trevas na mão.',info:'4d8 sombrio | 3 turnos | 14 Mana'},
      {name:'Pacto do Sangue Frio',tier:'Profissional',desc:'Troca Vitalidade por poder sombrio.',info:'-2 Vitalidade | +3 Sombrio | 4 turnos'},
      {name:'Olho do Abismo',tier:'Mestre',desc:'Revela criaturas ocultas e fraquezas mágicas.',info:'+4 Percepção | vê invisíveis | 24 Mana'},
      {name:'Noite Devoradora',tier:'Mestre',desc:'Trevas densas drenam força de inimigos próximos.',info:'6d8 | Área 10m | -2 Força | 32 Mana'}
    ],
    Sagrado:[
      {name:'Faísca de Graça',tier:'Aprendiz',desc:'Uma pequena luz restaura um aliado.',info:'Cura 2d6 | 5 Mana'},
      {name:'Juramento do Guardião',tier:'Aprendiz',desc:'Abençoa o escudo ou a arma por poucos turnos.',info:'+1 Bloqueio ou +1 Acerto | 3 turnos | 6 Mana'},
      {name:'Luz contra o Morto',tier:'Profissional',desc:'Clarão especialmente nocivo a mortos-vivos.',info:'5d6 | +50% vs mortos-vivos | 13 Mana'},
      {name:'Círculo de Graça',tier:'Profissional',desc:'Aliados dentro do círculo resistem melhor a trevas.',info:'+3 Res. Sombria | Área 6m | 15 Mana'},
      {name:'Milagre do Último Fôlego',tier:'Mestre',desc:'Impede um aliado de cair uma única vez.',info:'Fica com 1 Vitalidade | 28 Mana'},
      {name:'Sol do Peregrino',tier:'Mestre',desc:'Uma luz dourada cura aliados e fere sombras.',info:'Cura 6d8 / dano 6d8 | Área 10m | 34 Mana'}
    ]
  });

  // Sincroniza a lista de equipamentos de cada classe com os allowedClasses.
  Object.values(D.weapons).forEach(w => (w.allowedClasses||[]).forEach(cn => {
    const c=D.classes[cn]; if(c){ c.weapons=c.weapons||[]; if(!c.weapons.includes(w.name)) c.weapons.push(w.name); }
  }));
  Object.values(D.armors).forEach(a => (a.allowedClasses||[]).forEach(cn => {
    const c=D.classes[cn]; if(c){ c.armor=c.armor||[]; if(!c.armor.includes(a.name)) c.armor.push(a.name); }
  }));
  Object.values(D.shields).forEach(s => (s.allowedClasses||[]).forEach(cn => {
    const c=D.classes[cn]; if(c){ c.shields=c.shields||[]; if(!c.shields.includes(s.name)) c.shields.push(s.name); }
  }));
})();
