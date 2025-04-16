import EditChallengeSubmissionDialog from "@/components/EditChallengeSubmissionDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Axios } from "@/helpers/axios";
import { EvaluationChallenge, Leaderboard, Team } from "@/types";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Reorder } from "framer-motion";
import React, { useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
// import useSound from "use-sound";

export default function AdminLeaderboardPage() {
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [modal, setModal] = React.useState(false);
  const [selectedChallenge, setSelectedChallenge] =
    React.useState<EvaluationChallenge | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  // const [previousData, setPreviousData] = React.useState<
  //   Leaderboard | undefined
  // >(undefined);
  // const [playNotification] = useSound("/audio/notification.mp3");

  function handleModalOpen(team: Team) {
    setSelectedTeam(team);
    setModal(true);
  }

  function handleModalClose() {
    setModal(false);
    setSelectedTeam(null);
    setSelectedChallenge(null);
  }

  function handleEditModalOpen(challenge: EvaluationChallenge) {
    setSelectedChallenge(challenge);
    setModal(false);
    setIsEditModalOpen(true);
  }

  function handleEditModalClose() {
    setIsEditModalOpen(false);
    setModal(true);
    setSelectedChallenge(null);
  }

  const {
    data: leaderboard,
    error,
    isLoading,
  } = useQuery<Leaderboard>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await Axios.get("/challenges/admin-leaderboard");
      return data;
    },
  
  });

  useEffect(() => {
    if (selectedTeam) {
      setSelectedTeam(
        leaderboard?.find((team) => team.id === selectedTeam.id) || null,
      );
    }
  }, [leaderboard, selectedTeam, selectedChallenge]);

  useEffect(() => {
    if (!modal && !isEditModalOpen) {
      setSelectedTeam(null);
      setSelectedChallenge(null);
    }
  }, [modal, isEditModalOpen]);

  const sortedLeaderboard = React.useMemo(() => {
    return leaderboard?.sort((a, b) => b.score - a.score);
  }, [leaderboard]);

  // useEffect(() => {
  //   const previousSorted = previousData?.sort((a, b) => b.score - a.score);
  //   if (JSON.stringify(sortedLeaderboard) !== JSON.stringify(previousSorted)) {
  //     playNotification();
  //     setPreviousData(sortedLeaderboard);
  //   }
  // }, [sortedLeaderboard, previousData, playNotification]);

  return (
    <div className="mx-auto max-w-3xl p-4 font-mulish md:p-2">
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className=" max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader className="flex flex-row items-center gap-4">
            <h2 className="text-2xl font-semibold">{selectedTeam?.name}</h2>
          </DialogHeader>
          <div className="flex items-center gap-8 p-4">
            <div className="w-full space-y-5">
              <div className="flex items-baseline gap-4">
                Score:
                <h4 className="text-2xl font-bold text-blue-800">
                  {selectedTeam?.score || 0}
                </h4>
              </div>
              <ul className="space-y-2 sm:pl-4">
                {selectedTeam?.challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <li className="w-full text-start">
                            <div className="flex w-full items-center gap-4">
                              <div className="w-2/3 overflow-hidden text-ellipsis whitespace-nowrap text-nowrap">
                                {challenge?.number} - {challenge.name}
                              </div>
                              <div className="text-nowrap">
                                {challenge.score}
                                <sub>/ {challenge.points}</sub>
                              </div>
                            </div>
                          </li>
                        </AccordionTrigger>
                        <AccordionContent>
                          {challenge?.description}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Button
                      onClick={() => handleEditModalOpen(challenge)}
                      variant="outline"
                    >
                      <MdModeEdit />
                    </Button>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleModalClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <EditChallengeSubmissionDialog
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        selectedTeam={selectedTeam}
        handleEditModalClose={handleEditModalClose}
        selectedChallenge={selectedChallenge}
      />
      <div className="my-5 mb-6">
        <h2 className=" flex-1 py-5 text-center text-3xl font-bold xl:text-4xl">
          The Maze Leaderboard
        </h2>
      </div>
      {error ? (
        <div className="flex h-full items-center justify-center">
          <h3>Error while fetching registrations</h3>
        </div>
      ) : isLoading ? (
        <div className="flex h-full items-center justify-center">
          Loading Leaderboard...
        </div>
      ) : sortedLeaderboard?.length === 0 ? (
        <div className="my-10 flex h-full items-center justify-center">
          No Teams Found
        </div>
      ) : (
        <ul className="space-y-4">
          <Reorder.Group
            as="div"
            draggable={false}
            // dragControls={false}
            dragListener={false}
            axis="y"
            values={sortedLeaderboard || []}
            onReorder={() => {}}
          >
            {sortedLeaderboard
              ?.sort((a, b) => b.score - a.score)
              ?.map((team, index) => {
                return (
                  <Reorder.Item
                    key={team.id}
                    as="div"
                    dragListener={false}
                    draggable={false}
                    value={team}
                    className={clsx(
                      "my-3 flex cursor-pointer justify-between rounded-sm p-4 shadow-sm  md:grid-cols-3",
                      {
                        "bg-[#D7BE69] dark:bg-[#D7BE69]":
                          team.score !== 0 && index === 0,
                        "bg-[#C0C0C0] dark:bg-[#C0C0C0]":
                          team.score !== 0 && index === 1,
                        "bg-[#CD7F32] dark:bg-[#CD7F32]":
                          team.score !== 0 && index === 2,
                        "bg-white dark:bg-gray-900":
                          team.score === 0 || index > 2,
                      },
                    )}
                    onClick={() => handleModalOpen(team)}
                  >
                    <div className="flex items-center divide-x-2">
                      <div className="mr-3 text-lg font-medium">
                        {index + 1}
                      </div>
                      <div className="text-ellipsis pl-3 text-lg">
                        {team.name}
                      </div>
                    </div>
                    <div className="text-ellipsis text-lg font-semibold">
                      {team.score}
                    </div>
                  </Reorder.Item>
                );
              })}
          </Reorder.Group>
        </ul>
      )}
    </div>
  );
}
