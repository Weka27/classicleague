
import { useState } from "react";

const playersInit = [
  { id: 1, name: "PlayerOne", elo: 1200 },
  { id: 2, name: "PlayerTwo", elo: 1200 },
  { id: 3, name: "FragKing", elo: 1200 },
];

export default function LadderPage() {
  const [players, setPlayers] = useState(playersInit);
  const [challengerId, setChallengerId] = useState(1);
  const [opponentId, setOpponentId] = useState(2);
  const [winnerId, setWinnerId] = useState(null);

  const handleChallenge = () => {
    if (challengerId === opponentId || winnerId === null) return alert("Ungültige Auswahl");

    const k = 32;
    const playerA = players.find((p) => p.id === challengerId);
    const playerB = players.find((p) => p.id === opponentId);
    const winnerIsA = winnerId === challengerId;

    const expectedA = 1 / (1 + 10 ** ((playerB.elo - playerA.elo) / 400));
    const expectedB = 1 / (1 + 10 ** ((playerA.elo - playerB.elo) / 400));

    const newEloA = Math.round(playerA.elo + k * ((winnerIsA ? 1 : 0) - expectedA));
    const newEloB = Math.round(playerB.elo + k * ((winnerIsA ? 0 : 1) - expectedB));

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerA.id) return { ...p, elo: newEloA };
        if (p.id === playerB.id) return { ...p, elo: newEloB };
        return p;
      })
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🏆 ClassicCore Ladder</h1>

      <div className="space-y-2">
        {players
          .sort((a, b) => b.elo - a.elo)
          .map((p) => (
            <div key={p.id} className="flex justify-between border p-2 rounded bg-white shadow">
              <span>{p.name}</span>
              <span>{p.elo} ELO</span>
            </div>
          ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">⚔️ Spieler herausfordern</h2>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <select onChange={(e) => setChallengerId(Number(e.target.value))} value={challengerId}>
            {players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select onChange={(e) => setOpponentId(Number(e.target.value))} value={opponentId}>
            {players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label>Gewinner: </label>
          <select onChange={(e) => setWinnerId(Number(e.target.value))}>
            <option value="">-- auswählen --</option>
            <option value={challengerId}>{players.find(p => p.id === challengerId)?.name}</option>
            <option value={opponentId}>{players.find(p => p.id === opponentId)?.name}</option>
          </select>
        </div>

        <button onClick={handleChallenge} className="px-4 py-2 bg-blue-600 text-white rounded">
          Match eintragen & ELO berechnen
        </button>
      </div>
    </div>
  );
}
