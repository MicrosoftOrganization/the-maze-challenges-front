export type Team = {
  id: string;
  name: string;
  score: number;
  challenges: {
    id: number;
    name: string;
    points: number;
    score: number;
    number: number;
    description: string;
  }[];
};

export type Leaderboard = {
  id: string;
  name: string;
  score: number;
  challenges: {
    id: number;
    name: string;
    points: number;
    score: number;
    number: number;
    description: string;
  }[];
}[];

export type SubmissionForm = {
  teams: { id: string; name: string }[];
  challenges: {
    id: number;
    name: string;
    decription: string;
    points: number;
    number: number;
  }[];
};

export type EvaluationChallenge = {
  id: number;
  name: string;
  points: number;
  number: number;
  score: number;
  description: string;
};

export type Challenge = {
  id: number;
  name: string;
  points: number;
  number: number;
  description: string;
  tech?: string;
  key: string | null;
  hint: string | null;
  domaine: {
    id: number;
    name: string;
  };
};

export type CreateChallengeForm = {
  techs: { [key: string]: string };
  domains: { id: number; name: string }[];
};
