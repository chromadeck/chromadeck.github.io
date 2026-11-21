/** Catalog objects. Every one uses the same label schema: name, fact, controls. */
export type Screen = {
  id: string;
  title: string;
  hue: string;
  src: string;
  w: number;
  h: number;
  /** CSS width of the object on the pan rail. */
  width: string;
  alt: string;
  body: string;
  chips: string[];
};

export const SCREENS: Screen[] = [
  {
    id: "monitors",
    title: "Monitors",
    hue: "#fb923c",
    src: "/app/monitors.png",
    w: 2560,
    h: 496,
    width: "min(1120px, 74vw)",
    alt: "Three monitor cards. The LG UltraGear shows Warm Cinema applied. The Dell shows an empty drop target. The BenQ is offline.",
    body: "One card per display, with its name, serial and current preset. Drop a preset on a card to apply it. Offline monitors keep their card.",
    chips: ["Identify", "Reset", "Probe", "Pin"],
  },
  {
    id: "editor",
    title: "Editor",
    hue: "#818cf8",
    src: "/app/editor.png",
    w: 1416,
    h: 1504,
    width: "min(460px, calc((100vh - 330px) * 0.94))",
    alt: "Preset editor for Low Blue. Tag colour and shape pickers sit above two rows of ten swatches, original and adjusted, and six sliders.",
    body: "Gamma, brightness, contrast, vibrance, saturation and hue. Ten swatches show the colour before and after.",
    chips: ["Tag colour", "Tag shape", "ICC profile"],
  },
  {
    id: "apply",
    title: "Apply",
    hue: "#5eead4",
    src: "/app/apply.png",
    w: 1040,
    h: 904,
    width: "min(540px, calc((100vh - 330px) * 1.15))",
    alt: "Apply dialog for Photo Vibrant. LG UltraGear is selected. Dell is ready. BenQ is offline and greyed out.",
    body: "Pick the monitor by name and serial, or tick Apply to all. Offline monitors stay listed and can't be picked.",
    chips: ["Per monitor", "Apply to all"],
  },
  {
    id: "library",
    title: "Library",
    hue: "#22d3ee",
    src: "/app/library.png",
    w: 2560,
    h: 832,
    width: "min(1000px, 68vw)",
    alt: "Preset library with four cards: sRGB Standard, Low Blue, Vibrant and Photo Pro. Each card lists its gamma, brightness, contrast, vibrance and saturation.",
    body: "Every preset shows its values on the card. Filter by category, search by name, then apply, edit, duplicate or delete.",
    chips: ["Search", "Categories", "Duplicate"],
  },
];
