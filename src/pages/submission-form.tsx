import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Axios } from "@/helpers/axios";
import { SubmissionForm } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const validationSchema = z.object({
  teamId: z.string().min(1, "Team is required"),
  challengeId: z.string().min(1, "Challenge is required"),
  score: z.coerce.number(),
  description: z.string().optional(),
});

export default function SubmissionFormPage() {
  const queryClient = useQueryClient();

  const [challengeScore, setChallengeScore] = useState(0);

  const form = useForm<z.infer<typeof validationSchema>>({
    defaultValues: {
      teamId: "",
      challengeId: "0",
      score: 0,
      description: "",
    },
    resolver: zodResolver(validationSchema),
  });

  const {
    data: formData,
    isLoading: isLoadingForm,
    // error: errorForm,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useQuery<SubmissionForm, AxiosError<any, any>>({
    queryKey: ["form"],
    queryFn: async () => {
      const { data } = await Axios.get("/challenges/get-form");
      return data;
    },
  });

  const submission = useMutation({
    mutationFn: (data: z.infer<typeof validationSchema>) =>
      Axios.post("/challenges", {
        ...data,
        challengeId: parseInt(data.challengeId, 0),
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e) => {
      const error = e as AxiosError;
      if (error.response?.status === 409) {
        toast.error("Challenge has already been evaluated", {
          position: "bottom-right",
        });
      } else {
        toast.error("An error occurred", {
          position: "bottom-right",
        });
      }
    },
    onSuccess: async () => {
      toast.success(
        "Evaluation has been submitted successfully",

        { position: "bottom-right" },
      );
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof validationSchema>) => {
    if (data.score > challengeScore) {
      form.setError(
        "score",
        {
          type: "manual",
          message: "Score cannot be greater than the challenge score",
        },
        { shouldFocus: true },
      );
      return;
    }
    submission.mutate(data);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl overflow-y-auto p-4 md:p-2">
        <h2 className="my-5 py-4 pb-2 text-center text-3xl font-bold xl:text-4xl">
          Challenge Evaluation Form
        </h2>
        {isLoadingForm ? (
          <div className="my-4 flex items-center justify-center">
            <h2>Loading Form...</h2>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <Form {...form}>
              <form
                autoComplete="off"
                className="mt-4 flex flex-col gap-7 p-2 md:gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
              >
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select The Team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formData?.teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="challengeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge</FormLabel>
                      <Select
                        onValueChange={(e) => {
                          field.onChange(e?.toString());
                          setChallengeScore(
                            formData?.challenges.find(
                              (challenge) => challenge.id?.toString() === e,
                            )?.points ?? 0,
                          );
                        }}
                        value={
                          field.value?.toString() === "0" ? "" : field.value
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select The Challenge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {formData?.challenges.map((challenge) => (
                            <SelectItem
                              key={challenge.id}
                              value={challenge.id?.toString()}
                            >
                              {challenge.number} - {challenge.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* add score field and description field */}
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Score{" "}
                        {challengeScore > 0 && (
                          <span className="text-sm text-gray-500">
                            (Out of: {challengeScore})
                          </span>
                        )}
                      </FormLabel>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e?.target?.value, 0));
                        }}
                        type="number"
                        placeholder="Enter Score"
                        max={challengeScore}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Enter Description"
                        className="input"
                        rows={4}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="mt-6 self-center"
                  disabled={submission.isPending}
                >
                  {submission.isPending ? "Submitting" : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}
