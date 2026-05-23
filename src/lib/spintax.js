function hashString(text) {
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function applyValues(template, values) {
  return String(template ?? '').replace(/\[\[([a-zA-Z0-9_]+)\]\]/g, (match, key) => {
    const value = values?.[key];
    return value == null ? match : String(value);
  });
}

export function spinText(template, seed = '') {
  let counter = 0;

  return String(template ?? '').replace(/\{([^{}]+)\}/g, (match, choicesText) => {
    const choices = choicesText
      .split('|')
      .map((choice) => choice.trim())
      .filter(Boolean);

    if (choices.length === 0) return match;

    const choiceIndex = hashString(`${seed}:${counter}`) % choices.length;
    counter += 1;

    return choices[choiceIndex];
  });
}

export function renderSpintax(template, values = {}, seed = '') {
  return spinText(applyValues(template, values), seed);
}
