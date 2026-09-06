export type PhoneNormalizationResult =
  | { ok: true; canonical: string; local: string }
  | { ok: false; reason: string };

const arabicIndicDigits: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
};

function toAsciiDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (d) => arabicIndicDigits[d] ?? d);
}

export function normalizeSaudiMobile(input: unknown): PhoneNormalizationResult {
  if (input === null || input === undefined) {
    return { ok: false, reason: 'empty value' };
  }

  let value = toAsciiDigits(String(input).trim()).replace(/[^0-9+]/g, '');

  if (value.startsWith('+')) value = value.slice(1);
  if (value.startsWith('00')) value = value.slice(2);

  // Handle common spreadsheet/local variants.
  if (value.startsWith('9660')) value = `966${value.slice(4)}`;
  else if (value.startsWith('05')) value = `966${value.slice(1)}`;
  else if (value.startsWith('5') && value.length === 9) value = `966${value}`;

  if (!/^9665\d{8}$/.test(value)) {
    return { ok: false, reason: 'not a valid Saudi mobile number' };
  }

  return {
    ok: true,
    canonical: value,
    local: `0${value.slice(3)}`,
  };
}
