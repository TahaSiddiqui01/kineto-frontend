export function interpolate(text: string, variables: Record<string, string | boolean | number>): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    const key = name.trim();
    const value = variables[key];
    
    // Check if the value is defined (covers null and undefined)
    return value !== undefined && value !== null 
      ? String(value) 
      : `{{${key}}}`;
  });
}