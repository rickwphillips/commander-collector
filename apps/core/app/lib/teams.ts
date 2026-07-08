// Shared 2HG team-labelling helpers. One source of truth for how a team is
// named and displayed, so the game log, turn tracker, winner banner, roll-off
// dialog, and TeamPanel all render the same team the same way (custom name from
// state.teamNames, falling back to "Team N", with members joined by " / ").

type TeamMember = { teamNumber?: number | null; playerName: string };

// The team's display name: the editable custom name when set (non-blank),
// otherwise "Team N".
export function teamName(
  teamNumber: number | null | undefined,
  teamNames?: Record<number, string> | null,
): string {
  return (teamNumber != null && teamNames?.[teamNumber]?.trim()) || `Team ${teamNumber}`;
}

// The team's accent color (MUI palette token). Team 1 = primary, others = secondary.
export function teamColor(teamNumber: number | null | undefined): string {
  return teamNumber === 1 ? 'primary.main' : 'secondary.main';
}

// The opposing team's number in a two-team (2HG) game.
export function otherTeam(teamNumber: number): number {
  return teamNumber === 1 ? 2 : 1;
}

// The team's name plus its members: "Name (A / B)".
export function teamLabel(
  teamNumber: number | null | undefined,
  players: TeamMember[],
  teamNames?: Record<number, string> | null,
): string {
  const members = players.filter((p) => p.teamNumber === teamNumber).map((p) => p.playerName);
  return `${teamName(teamNumber, teamNames)} (${members.join(' / ')})`;
}
