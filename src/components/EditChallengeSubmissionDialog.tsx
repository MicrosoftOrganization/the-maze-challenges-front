import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EvaluationChallenge, Team } from "@/types";
import React, { useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Axios } from "@/helpers/axios";
import { toast } from "sonner";

type Props = {
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTeam: Team | null;
  handleEditModalClose: () => void;
  selectedChallenge: EvaluationChallenge | null;
};

export default function EditChallengeSubmissionDialog({
  handleEditModalClose,
  isEditModalOpen,
  selectedTeam,
  setIsEditModalOpen,
  selectedChallenge,
}: Props) {
  const queryClient = useQueryClient();

  const [score, setScore] = React.useState(selectedChallenge?.score || 0);
  const [description, setDescription] = React.useState(
    selectedChallenge?.description || "",
  );

  const deleteMutation = useMutation({
    mutationKey: ["delete", selectedChallenge],
    mutationFn: async () => {
      const { data } = await Axios.delete(
        `/challenges/${selectedChallenge?.id}/team/${selectedTeam?.id}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Challenge deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      handleEditModalClose();
    },
    onError: () => {
      toast.error("Failed to delete challenge");
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["update", selectedChallenge],
    mutationFn: async () => {
      const { data } = await Axios.patch(`/challenges`, {
        teamId: selectedTeam?.id,
        challengeId: selectedChallenge?.id,
        score,
        description,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      toast.success("Challenge Updated successfully");
      handleEditModalClose();
    },
    onError: () => {
      toast.error("Failed to update challenge");
    },
  });

  function handleUpdate() {
    //checking if the score is greater than the points
    if (score > (selectedChallenge?.points ?? 0)) {
      return toast.error("Score cannot be greater than the points");
    } else if (score < 0) {
      return toast.error("Score cannot be less than 0");
    } else if (isNaN(score)) {
      return toast.error("Score is required");
    }
    updateMutation.mutate();
  }

  function handleDelete() {
    const confirm = window.confirm(
      "Are you sure you want to delete this challenge?",
    );
    if (!confirm) return;
    deleteMutation.mutate();
  }

  useEffect(() => {
    setDescription(selectedChallenge?.description || "");
    setScore(selectedChallenge?.score || 0);
  }, [selectedTeam?.id, selectedChallenge?.id]);

  return (
    <Dialog onOpenChange={setIsEditModalOpen} open={isEditModalOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Challenge</DialogTitle>
          <DialogDescription>
            Make changes to the challenge. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">
              Team
            </Label>
            <Input
              id="team"
              defaultValue={selectedTeam?.name || ""}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="challengeName" className="text-right">
              Challenge
            </Label>
            <Input
              id="challengeName"
              defaultValue={selectedChallenge?.name || ""}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right">
              Score <sub>/{selectedChallenge?.points}</sub>
            </Label>
            <Input
              id="score"
              value={score}
              type="number"
              onChange={(e) => setScore(parseInt(e.target.value))}
              defaultValue={selectedChallenge?.score}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={selectedChallenge?.description}
              className="col-span-3 resize-none"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="flex w-full gap-2 sm:justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting" : "Delete"}
          </Button>
          <div className="flex flex-col gap-2 md:flex-row-reverse">
            <Button
              variant="outline"
              onClick={handleEditModalClose}
              className=""
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className=""
              type="submit"
            >
              {updateMutation.isPending ? "Saving" : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
