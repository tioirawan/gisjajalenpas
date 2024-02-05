
/**
 * Swaps the order of the coordinates in a LngLat or an array of LngLats.
 * 
 * This is used mainly for converting GeoJSON coordinates to Leaflet LatLngs.
 *
 * Example:
 * - [0, 1] -> [1, 0]
 * - [[0, 1], [2, 3]] -> [[1, 0], [3, 2]]
 * - [[[0, 1], [2, 3]], [[4, 5], [6, 7]]] -> [[[1, 0], [3, 2]], [[5, 4], [7, 6]]]
 * 
 * @param lngLat - A LngLat or an array of LngLats.
 * @returns A LngLat or an array of LngLats with the coordinates swapped.
 * @category Helper
 * @example
 * const lngLat = [0, 1];
 * const swappedLngLat = swapLngLat(lngLat);
  */

export function swapLngLat(lngLat: number[] | number[][] | number[][][]): number[] | number[][] | number[][][] {
  if (Array.isArray(lngLat)) {
    if (typeof lngLat[0] === 'number') {
      return [lngLat[1], lngLat[0]] as number[];
    } else {
      return lngLat.map((lngLat) => swapLngLat(lngLat as number[])) as number[][];
    }
  } else {
    return lngLat;
  }
}

export function colorFromKondisi(kondisi: string): string | undefined {
  // kondisi: Baik, Sedang, Rusak Ringan, Rusak Berat

  switch (kondisi) {
    case "Baik":
      return "#00ff00";
    case "Sedang":
      return "#ffff00";
    case "Rusak Ringan":
      return "#ff9900";
    case "Rusak Berat":
      return "#ff0000";
  }
}