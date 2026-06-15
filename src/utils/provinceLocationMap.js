/**
 * Chuyển tên tỉnh/thành thành slug dùng trên URL (vd: "Tuyên Quang" -> "tuyen-quang").
 */
export const toProvinceSlug = (name = "") => {
  if (!name) {
    return "";
  }

  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Tạo các map tra cứu tỉnh/thành theo slug và code.
 * Province cần có: { code, shortName, slug? }
 */
export const buildProvinceLocationMaps = (provinces = []) => {
  const bySlug = new Map();
  const byCode = new Map();
  const codeToSlug = new Map();
  const slugToCity = new Map();

  for (const province of provinces) {
    if (!province?.code) {
      continue;
    }

    const code = String(province.code);
    const cityName = province.shortName || province.name || "";
    const slug = province.slug || toProvinceSlug(cityName);

    if (!slug) {
      continue;
    }

    const normalized = { ...province, code, slug, shortName: cityName };

    bySlug.set(slug, normalized);
    byCode.set(code, normalized);
    codeToSlug.set(code, slug);
    slugToCity.set(slug, cityName);
  }

  return { bySlug, byCode, codeToSlug, slugToCity };
};

export const findProvinceBySlug = (provinces, slug) => {
  if (!slug) {
    return null;
  }

  const { bySlug } = buildProvinceLocationMaps(provinces);
  return bySlug.get(slug) || null;
};

export const findProvinceByCode = (provinces, code) => {
  if (!code) {
    return null;
  }

  const { byCode } = buildProvinceLocationMaps(provinces);
  return byCode.get(String(code)) || null;
};

/**
 * Hỗ trợ URL cũ dạng loc=1 -> loc=tuyen-quang
 */
export const resolveLocationSlug = (provinces, locValue = "") => {
  const value = (locValue || "").trim();
  if (!value) {
    return "";
  }

  const { bySlug, byCode } = buildProvinceLocationMaps(provinces);

  if (bySlug.has(value)) {
    return value;
  }

  const byCodeMatch = byCode.get(value);
  if (byCodeMatch?.slug) {
    return byCodeMatch.slug;
  }

  return value;
};

export const getCityNameBySlug = (provinces, slug = "") => {
  if (!slug) {
    return "";
  }

  const province = findProvinceBySlug(provinces, slug);
  return province?.shortName || province?.name || "";
};
