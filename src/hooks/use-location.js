import { useEffect, useState, useMemo } from "react";

export function useLocation(initialProvinceCode = "", initialDistrictCode = "") {
  const [provinces, setProvinces] = useState([]); // [{code,name}, ...]
  const [districts, setDistricts] = useState([]); // [{code,name}, ...]

  const [provinceCode, setProvinceCode] = useState(
    initialProvinceCode || ""
  );
  const [districtCode, setDistrictCode] = useState(
    initialDistrictCode || ""
  );

  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);

   useEffect(() => {
   const next = initialProvinceCode ? String(initialProvinceCode) : "";
   setProvinceCode((cur) => (cur === next ? cur : next));
 }, [initialProvinceCode]);

 useEffect(() => {
   const next = initialDistrictCode ? String(initialDistrictCode) : "";
   setDistrictCode((cur) => (cur === next ? cur : next));
 }, [initialDistrictCode]);

  // load provinces once
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingProvince(true);
        const res = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await res.json();
        if (!ignore && Array.isArray(data)) {
          const sorted = [...data].sort((a, b) =>
            a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
          );
          setProvinces(sorted);
        }
      } catch (err) {
        console.error("Lỗi load provinces:", err);
      } finally {
        setLoadingProvince(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // load districts when provinceCode changes
  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      setDistrictCode("");
      return;
    }

    let ignore = false;
    (async () => {
      try {
        setLoadingDistrict(true);

        const res = await fetch(
          `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
        );
        const data = await res.json();

        if (!ignore) {
          const list = (data?.districts || []).map((d) => ({
            code: String(d.code),
            name: d.name,
          }));

          list.sort((a, b) =>
            a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
          );

          setDistricts(list);

          // still valid?
          const stillValid = list.some(
            (d) => String(d.code) === String(districtCode)
          );
          if (!stillValid) {
            setDistrictCode("");
          }
        }
      } catch (err) {
        console.error("Lỗi load districts:", err);
        setDistricts([]);
        setDistrictCode("");
      } finally {
        setLoadingDistrict(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [provinceCode]);

  // build options cho SimpleSelect
  const provinceOptions = useMemo(
    () =>
      provinces.map((p) => ({
        value: String(p.code),
        label: p.name,
      })),
    [provinces]
  );

  const districtOptions = useMemo(
    () =>
      districts.map((d) => ({
        value: String(d.code),
        label: d.name,
      })),
    [districts]
  );

  // lookup nhanh code -> name hiện tại
  const provinceName = useMemo(() => {
    const found = provinces.find(
      (p) => String(p.code) === String(provinceCode)
    );
    return found ? found.name : "";
  }, [provinces, provinceCode]);

  const districtName = useMemo(() => {
    const found = districts.find(
      (d) => String(d.code) === String(districtCode)
    );
    return found ? found.name : "";
  }, [districts, districtCode]);

  return {
    // cho UI
    provinceOptions,
    districtOptions,
    loadingProvince,
    loadingDistrict,

    // code đang chọn
    provinceCode,
    districtCode,
    setProvinceCode,
    setDistrictCode,

    // name tương ứng với code đang chọn
    provinceName,
    districtName,
  };
}
