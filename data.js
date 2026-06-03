// Глобын мэдээллийг globe-data.json-оос уншина — та зөвхөн тэр JSON-ийг засна.
import globe from "./globe-data.json";

export const COUNTRIES = globe.countries;
export const HOME = globe.home;

// Брэнд өнгө
export const BRAND = {
  pink: [1, 0.24, 0.63],
  blue: [0.17, 0.42, 0.78],
  base: [0.42, 0.48, 0.66],
};
