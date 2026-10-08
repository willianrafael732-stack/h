/* Trio em destaque: Thor original + semideusas Brynja e Solveig.
   Usa as mesmas fichas já carregadas pelo compêndio, sem duplicar os dados. */
(() => {
  "use strict";
  const root = document.getElementById("featuredTrio");
  const status = document.getElementById("featuredTrioCount");
  if (!root || !status) return;

  const mk = (tag, value, className) => {
    const node = document.createElement(tag);
    if (value !== null) node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const digits = value => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value);
  const dicePattern = /(\d+)d(10|12|8|6)\s*(físico|raio|sagrado|luz|gelo|fogo|veneno|morte|mágico|vento|terra)?/gi;

  function parseDice(expression) {
    return [...expression.matchAll(dicePattern)].map(match => ({
      count: Number(match[1]), sides: Number(match[2]),
      type: (match[3] || "dano").toLocaleLowerCase("pt-BR")
    }));
  }
  function formatDice(terms) {
    return terms.filter(x => x.count > 0)
      .map(x => x.count + "d" + x.sides + " " + x.type).join(" + ") || "sem dano";
  }
  function range(terms) {
    const minimum = terms.reduce((sum, term) => sum + term.count, 0);
    const maximum = terms.reduce((sum, term) => sum + term.count * term.sides, 0);
    return {
      min: minimum, max: maximum,
      average: (minimum + maximum) / 2
    };
  }
  function formulaRange(terms) {
    const r = range(terms);
    return digits(r.min) + "–" + digits(r.max) + " (média " + digits(r.average) + ")";
  }
  function rollDice(terms) {
    let value = 0;
    for (const term of terms) {
      for (let n = 0; n < term.count; n++) value += 1 + Math.floor(Math.random() * term.sides);
    }
    return value;
  }
  function bonusesFor(person, parts) {
    if (person === "THOR") {
      const physical = parts.some(p => p.type === "físico");
      const lightning = parts.some(p => p.type === "raio");
      return [
        ...(physical ? [
          { count: 4, sides: 10, type: "físico", label: "Força +4d10 físico" },
          { count: 5, sides: 10, type: "físico", label: "Mjölnir +5d10 físico" }
        ] : []),
        ...(lightning ? [
          { count: 5, sides: 10, type: "raio", label: "Mjölnir +5d10 raio" }
        ] : [])
      ];
    }
    if (person === "Brynja" && parts.some(p => p.type === "físico")) {
      return [{ count: 1, sides: 10, type: "físico", label: "Bênção Guardiã +1d10 físico (opcional, 5 Mana / 2 turnos)" }];
    }
    if (person === "Solveig" && parts.some(p => p.type === "luz")) {
      return [{ count: 1, sides: 10, type: "luz", label: "Foco da Aurora +1d10 luz (opcional, 5 Mana / 2 turnos)" }];
    }
    return [];
  }
  function subtractBonuses(total, bonuses) {
    const base = total.map(p => ({ ...p }));
    for (const b of bonuses) {
      const target = base.find(p => p.type === b.type && p.sides === b.sides);
      if (!target || target.count < b.count) return null;
      target.count -= b.count;
    }
    return base.filter(x => x.count > 0);
  }
  function addBonuses(base, bonuses) {
    const result = base.map(p => ({ ...p }));
    for (const b of bonuses) {
      const term = result.find(p => p.type === b.type && p.sides === b.sides);
      if (term) term.count += b.count;
      else result.push({ count: b.count, sides: b.sides, type: b.type });
    }
    return result;
  }
  function parseAttacks(raw) {
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const begin = lines.indexOf("Ataques");
    if (begin < 0) return [];
    const attacks = [];
    for (const line of lines.slice(begin + 1)) {
      if (/^(Poderes\s*\/\s*Técnicas|Suprema|♾️ Passiva|Drop(?:s)?)$/i.test(line)) break;
      const match = line.match(/^(.+?)\s+—\s+(.+)$/);
      if (match && parseDice(match[2]).length) {
        attacks.push({ title: match[1], expression: match[2] });
      }
    }
    return attacks;
  }
  function picture(person) {
    const fig = mk("figure", null, "trio-portrait trio-portrait--" + person.key);
    if (person.key === "thor") {
      const image = mk("img");
      image.loading = "lazy";
      image.decoding = "async";
      image.src = "../assets/i/thor_o_deus_do_trovão_em_asgard.png";
      image.alt = "Retrato de Thor no acervo de Hurras";
      image.onerror = () => {
        image.remove();
        fig.prepend(mk("span", "⚡", "trio-symbol"));
      };
      fig.append(image);
    } else {
      const symbol = mk("span", person.key === "brynja" ? "🛡️" : "☀️", "trio-symbol");
      symbol.setAttribute("aria-hidden", "true");
      fig.append(symbol);
    }
    fig.append(mk("figcaption", person.key === "thor" ? "Arte do acervo Hurras" : "Retrato ainda não cadastrado • símbolo ilustrativo"));
    return fig;
  }
  function damagePanel(attack, person, original) {
    const panel = mk("div", null, "trio-attack");
    panel.append(mk("strong", attack.title));

    const source = parseDice(attack.expression);
    if (!source.length) return panel;

    const bonuses = bonusesFor(person.name, source);
    let base, enhanced;
    if (original) {
      // Os golpes do Thor já estão com bônus no arquivo original.
      enhanced = source;
      base = subtractBonuses(enhanced, bonuses);
      if (base === null) {
        base = source;
        bonuses.length = 0;
      }
    } else {
      base = source;
      enhanced = addBonuses(base, bonuses);
    }

    const steps = mk("div", null, "trio-damage-row");
    const step = (label, value) => {
      const line = mk("div", null, "trio-step");
      line.append(mk("b", label + ": "), mk("span", value));
      steps.append(line);
    };
    step("Sem bônus", formatDice(base));
    step("Bônus especificados", bonuses.length ? bonuses.map(b => b.label).join(" • ") : "Não se aplica");
    step("Com bônus", formatDice(enhanced));
    panel.append(steps);

    const minmax = mk("div", null, "trio-range");
    minmax.append(mk("div", "🎲 Base: " + formulaRange(base)));
    minmax.append(mk("div", "⚡ Com bônus: " + formulaRange(enhanced)));
    panel.append(minmax);

    const controls = mk("div", null, "trio-roll-actions noprint");
    const output = mk("output", "Role o dano para simular a jogada.", "trio-roll-output");
    for (const [label, dice] of [["Rolar base", base], ["Rolar com bônus", enhanced]]) {
      const button = mk("button", label, "trio-roll-btn");
      button.type = "button";
      button.addEventListener("click", () => {
        output.textContent = label + " — " + digits(rollDice(dice)) + " de dano antes das resistências.";
      });
      controls.append(button);
    }
    panel.append(controls, output);
    return panel;
  }
  function render(person) {
    const card = mk("article", null, "trio-card trio-card--" + person.key);
    card.append(picture(person));
    const heading = mk("div", null, "trio-title-row");
    const title = mk("h3", person.display);
    const level = mk("span", "Nível " + person.level, "trio-level");
    heading.append(title, level);
    card.append(heading);
    card.append(mk("div", person.role, "trio-role"));
    card.append(mk("p", person.description, "trio-description"));
    card.append(mk("p", "❤ Vitalidade " + person.hp + " · ✦ Mana " + person.mana, "trio-attributes"));
    if (person.key === "thor") {
      card.append(mk("p", "Raio 15 · Sagrado 10 · Força de Vontade 12 · Mjölnir: 17d10 físico + 10d10 raio (sem bônus).", "trio-weapon"));
    } else if (person.key === "brynja") {
      card.append(mk("p", "Espada Curta das Asas: 3d10 físico. Bônus opcional da Bênção Guardiã por 2 turnos, não cumulativo.", "trio-weapon"));
    } else {
      card.append(mk("p", "Cajado Solar: 2d10 físico + 2d10 luz. Bônus opcional do Foco da Aurora por 2 turnos, não cumulativo.", "trio-weapon"));
    }

    const attacks = parseAttacks(person.raw);
    card.append(mk("h4", "⚔ Ataques: dano base e com bônus"));
    const visible = person.key === "thor" ? 3 : 2;
    for (const attack of attacks.slice(0, visible)) card.append(damagePanel(attack, person, person.key === "thor"));

    if (attacks.length > visible) {
      const details = mk("details", null, "trio-more-attacks");
      details.append(mk("summary", "Ver os outros " + (attacks.length - visible) + " golpes"));
      for (const attack of attacks.slice(visible)) details.append(damagePanel(attack, person, true));
      card.append(details);
    }

    const footer = mk("div", null, "trio-support");
    if (person.key === "thor") {
      footer.textContent = "⚠ Todos os valores de Thor vêm do compêndio original, sem enfraquecer a ficha. O dano base foi reconstruído retirando apenas os bônus declarados (+4d10 Força, +5d10 físico e +5d10 raio). Extras próprios de cada técnica permanecem.";
    } else if (person.key === "brynja") {
      footer.textContent = "🛡 Passiva: intercepta 1 golpe contra um aliado, uma vez por combate. Escolta: +2 Defesa ao aliado por 1 turno, custo 5 Mana. Suprema original: 5d10 sagrado, uma vez por combate; não recebe bônus físico.";
    } else {
      footer.textContent = "☀ Bênção da Manhã: cura 3d10 por 8 Mana. Luz Serena: remove medo leve por 6 Mana. Suprema original: 7d10 luz em área, uma vez por combate; o Foco da Aurora não a aumenta.";
    }
    card.append(footer);
    return card;
  }

  window.HurrasRenderFeaturedTrio = (existing, created) => {
    const thor = existing.find(c => c.page === 3 && c.name === "THOR");
    const brynja = created.find(c => c.name === "Brynja" && c.level === 4);
    const solveig = created.find(c => c.name === "Solveig" && c.level === 5);
    const missing = [thor, brynja, solveig].filter(v => !v).length;
    if (missing) {
      root.replaceChildren(mk("p", "Não foi possível localizar todas as três fichas no compêndio.", "trio-error"));
      status.textContent = "Verifique os dados originais no Compêndio Nórdico.";
      return;
    }
    const chars = [
      { ...thor, key: "thor", display: "⚡ Thor", role: "Deus do trovão • chefe do encontro",
        description: "Guardião de Asgard e portador do Mjölnir. Sua presença domina a batalha: o objetivo do grupo pode ser sobreviver, proteger aliados ou convencê-lo a interromper o confronto.",
        hp: 200, mana: 100 },
      { ...brynja, key: "brynja", display: "🛡️ Brynja", role: "Semideusa defensora • nível baixo",
        hp: 56, mana: 24 },
      { ...solveig, key: "solveig", display: "☀️ Solveig", role: "Semideusa de luz e cura • nível baixo",
        hp: 65, mana: 45 }
    ];
    root.replaceChildren(...chars.map(render));
    status.textContent = "3 fichas em destaque • " + parseAttacks(thor.raw).length + " golpes do Thor preservados • Os limites indicados são antes de Defesa, resistências e bloqueios.";
  };
})();
