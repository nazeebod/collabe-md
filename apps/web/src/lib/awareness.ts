import type { AwarenessUser } from "@collabe-md/shared";

const ANIMALS = [
  "Fox",
  "Bear",
  "Owl",
  "Wolf",
  "Hawk",
  "Lynx",
  "Panda",
  "Tiger",
  "Eagle",
  "Otter",
  "Badger",
  "Heron",
  "Koala",
  "Raven",
  "Seal",
  "Falcon",
  "Moose",
  "Crane",
  "Bison",
  "Gecko",
];

const COLORS = [
  "#e06c75",
  "#61afef",
  "#98c379",
  "#e5c07b",
  "#c678dd",
  "#56b6c2",
  "#d19a66",
  "#be5046",
  "#7ec8e3",
  "#f4a261",
];

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function withAlpha(hex: string, alpha: string): string {
  return `${hex}${alpha}`;
}

export function createAwarenessUser(): AwarenessUser {
  const color = randomItem(COLORS);
  return {
    name: randomItem(ANIMALS),
    color,
    colorLight: withAlpha(color, "50"),
  };
}
