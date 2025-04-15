export interface IMatchesData {
  id: string;
  time: string;
  team1: ITeamMatches;
  team2: ITeamMatches;
}

export interface ITeamMatches {
  name: string;
  logo: string;
  score: number;
}

export interface Action {
  type: string;
  payload: any; 
}

export interface Response {
  status: number;
  data: any; 
}
