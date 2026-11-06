import prisma from "@/lib/prisma";

let cachedTheme: any = null;
let cachedThemeTimestamp = 0;
const THEME_CACHE_TTL_MS = 15000; // 15 seconds cache

export function invalidateStoreThemeCache() {
  cachedTheme = null;
  cachedThemeTimestamp = 0;
}

export async function getCachedStoreTheme(): Promise<any> {
  const now = Date.now();
  if (cachedTheme !== null && now - cachedThemeTimestamp < THEME_CACHE_TTL_MS) {
    return cachedTheme;
  }

  try {
    const theme = await prisma.storeThemeSetting.findFirst();
    cachedTheme = theme;
    cachedThemeTimestamp = now;
    return theme;
  } catch (err) {
    return cachedTheme || null;
  }
}
