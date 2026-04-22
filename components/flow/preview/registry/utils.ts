export function interpolate(text: string, variables: Record<string, string>): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (_, name) => variables[name.trim()] ?? `{{${name.trim()}}}`);
}
