import type { CommitType } from './commit';
import type { SetRating } from './rating';

export type RaceType = {
  id: number;
  name: string;
  desc: string;
  image: string;
  length: number;
  userId: number;
  date: string;
  RaceRatings: SetRating[];
  // дописать, что сюда придут комменты CommentRaces?: комменты[]
  CommentRaces?: CommitType[];
};

export type AddRaceFormType = {
  name: string;
  image: string;
  desc: string;
  length: number;
  date: string;
};

export type RaceStateType = {
  races: RaceType[];
  selectedRaces: RaceType | null;
  modalType: 'edit' | 'info' | null;
};
