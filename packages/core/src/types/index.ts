export type StoredPlayer = {
  name: string;
};

export type GamePlayer = {
  id: string;
  name: string;
  score: number;
  previewScore: number;
  hasScored: boolean;
  consecutiveFarkles: number;
};
