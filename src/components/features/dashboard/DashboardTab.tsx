// src/components/features/dashboard/DashboardTab.tsx

import { useTournamentStore } from '../../../store/useTournamentStore';
import { useScoringStore } from '../../../store/useScoringStore';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { MESSAGES } from '../../../constants/messages';
import { DashboardStats } from './DashboardStats';
import { DashboardFilter } from './DashboardFilter';
import { DashboardDistCharts } from './DashboardDistCharts';
import { DashboardRadarChart } from './DashboardRadarChart';

export const DashboardTab = () => {
  const { tournaments, activeTournamentId } = useTournamentStore();
  const { tournamentScores } = useScoringStore();

  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;
  const currentScores = activeTournamentId ? tournamentScores[activeTournamentId] || {} : {};

  const {
    selectedPlayers,
    playersInfo,
    distBarData,
    radarPlayers,
    radarData,
    statsData,
    togglePlayer,
    selectAll,
    deselectAll
  } = useDashboardData(activeT, currentScores);

  if (!activeT || activeT.players.length === 0 || activeT.criteria.length === 0) {
    return (
      <div className="card text-center p-10 mt-6">
        <p className="text-gray-500 mb-4">{MESSAGES.NO_DATA}</p>
      </div>
    );
  }

  const { totalStat, critStats } = statsData;

  return (
    <div className="flex flex-col gap-6 pb-20 tabular-nums w-full">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold">{MESSAGES.TAB_DASHBOARD}</h2>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <DashboardStats totalStat={totalStat!} critStats={critStats} />
        
        <DashboardFilter 
          playersInfo={playersInfo}
          selectedPlayers={selectedPlayers}
          togglePlayer={togglePlayer}
          selectAll={selectAll}
          deselectAll={deselectAll}
        />
      </div>

      {distBarData.length > 0 ? (
        <>
          <DashboardDistCharts 
            activeT={activeT}
            distBarData={distBarData}
            selectedPlayersCount={selectedPlayers.length}
          />
          <DashboardRadarChart 
            radarData={radarData}
            radarPlayers={radarPlayers}
            selectedPlayersCount={selectedPlayers.length}
          />
        </>
      ) : (
        <div className="card text-center p-10 mt-2 bg-gray-50 border border-dashed">
          <p className="text-gray-500">{MESSAGES.DASHBOARD_EMPTY_SELECTION}</p>
        </div>
      )}
    </div>
  );
};
