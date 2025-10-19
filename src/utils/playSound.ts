export const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.play().catch((err) => {
    console.warn("Sound could not play automatically:", err);
  });
};
