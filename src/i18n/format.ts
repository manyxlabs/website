// Fills a catalogue string's {placeholders}.

export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!(key in vars)) throw new Error(`No value for {${key}} in "${template}"`);
    return String(vars[key]);
  });
}
