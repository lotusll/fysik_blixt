
import { Step } from './types';

export const STEPS: Step[] = [
  {
    id: 0,
    title: "1. En gigantisk frysbox",
    description: "Det är iskallt högt uppe i atmosfären.",
    longDescription: "Även en varm sommardag sjunker temperaturen ju högre upp man kommer. Ett åskmoln sträcker sig 10-15 km upp. Vid marken är det +25°C, men vid 5 km börjar vattnet frysa (-15°C) och i toppen är det ca -50°C!"
  },
  {
    id: 1,
    title: "2. Värmen är motorn",
    description: "Varm luft stiger som i en osynlig skorsten.",
    longDescription: "Sommarens värme gör luften lätt, vilket skapar kraftiga uppvindar. Denna motor tar med sig fukt som fryser direkt till ispartiklar och hagel när den når de kalla lagren. Utan denna 'is-maskin' får vi ingen blixt."
  },
  {
    id: 2,
    title: "3. Gnidning & Statisk Elektricitet",
    description: "Miljontals krockar i ismaskinen.",
    longDescription: "Inuti molnet virvlar ispartiklar och hagelkorn runt och krockar. Precis som när du gnuggar en ballong mot håret skrapas elektroner loss vid krockarna. Det är här den statiska elektriciteten föds."
  },
  {
    id: 3,
    title: "4. Uppdelning av laddningar",
    description: "Molnet laddas som ett batteri.",
    longDescription: "Lätta ispartiklar (+) blåser till toppen, medan tyngre hagelkorn (-) sjunker till botten. Naturen gillar inte obalans, och den enorma spänningen mellan toppen, botten och marken söker en väg ut."
  },
  {
    id: 4,
    title: "5. Gnistan hoppar",
    description: "Urladdningen jämnar ut skillnaden.",
    longDescription: "När spänningen blir för hög 'går luften sönder'. Elektriciteten rusar fram: inuti molnet, ut i luften eller ner till marken. När de negativa laddningarna i botten möter positiva från marken smäller det!"
  }
];

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const PARTICLE_COUNT = 45;
