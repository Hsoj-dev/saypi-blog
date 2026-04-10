// src/lib/utils/campus.ts

export const campuses = [
  'Main Campus',
  'Ilocos Region Campus',
  'Cordillera Administrative Region Campus',
  'Cagayan Valley Campus',
  'Central Luzon Campus',
  'Calabarzon Region Campus',
  'MIMAROPA Region Campus',
  'Bicol Region Campus',
  'Western Visayas Campus',
  'Central Visayas Campus',
  'Eastern Visayas Campus',
  'Central Mindanao Campus',
  'Southern Mindanao Campus',
  'SOCCSKSARGEN Region Campus',
  'CARAGA Region Campus',
  'Zamboanga Peninsula Campus'
];

// Map full names → Drizzle enum codes
export const campusMap: Record<string, string> = {
  "Main Campus": "MC",
  "Ilocos Region Campus": "IRC",
  "Cordillera Administrative Region Campus": "CARC",
  "Cagayan Valley Campus": "CVC",
  "Central Luzon Campus": "CLC",
  "Calabarzon Region Campus": "CBZRC",
  "MIMAROPA Region Campus": "MRC",
  "Bicol Region Campus": "BRC",
  "Western Visayas Campus": "WVC",
  "Central Visayas Campus": "CVisC",
  "Eastern Visayas Campus": "EVC",
  "Central Mindanao Campus": "CMC",
  "Southern Mindanao Campus": "SMC",
  "SOCCSKSARGEN Region Campus": "SRC",
  "CARAGA Region Campus": "CRC",
  "Zamboanga Peninsula Campus": "ZRC"
};

// Helper function to get code safely
export function getCampusCode(name: string): string {
  const code = campusMap[name];
  if (!code) throw new Error(`Invalid campus name: ${name}`);
  return code;
}
