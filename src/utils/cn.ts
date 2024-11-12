type ClassValue = string | number | boolean | undefined | null;
type ClassMapping = Record<string, boolean>;
type ClassArray = ClassValue[];

export function cn(...inputs: (ClassValue | ClassMapping | ClassArray)[]): string {
  const classes = new Set<string>();

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.add(input);
    } else if (Array.isArray(input)) {
      cn(...input).split(' ').forEach(cls => classes.add(cls));
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.add(key);
      });
    }
  }

  return Array.from(classes).join(' ');
}