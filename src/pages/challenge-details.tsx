import { Button } from "@/components/ui/button";
import { Axios } from "@/helpers/axios";
import { Challenge } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MarkdownEditor from "@uiw/react-md-editor";
import { MdModeEdit } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "sonner";

// const fakeChallenge: Challenge = {
//   id: 1,
//   name: "Challenge Name",
//   points: 100,
//   number: 1,
//   description: "Challenge Description",
//   tech: "",
//   domaine: {
//     id: 2,
//     name: "Frontend",
//   },
// };

export default function ChallengeDetailsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: challenge,
    isLoading,
    error,
  } = useQuery<Challenge>({
    queryKey: ["challenge", id],
    queryFn: async () => {
      const { data } = await Axios.get(`/challenges/${id}`);
      return data;
      //   return fakeChallenge;
    },
  });

  const deleteChallengeMutation = useMutation({
    mutationKey: ["deleteChallenge"],
    mutationFn: async () => {
      return await Axios.delete(`/challenges/${id}`);
    },
    onSuccess: () => {
      toast.success("Challenge deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      navigate("/challenges");
    },
    onError: () => {
      toast.error("Failed to delete challenge");
    },
  });

  if (isLoading) {
    return (
      <p className="py-20 text-center text-xl font-semibold opacity-70">
        Loading Challenge...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-20 text-center text-xl font-semibold opacity-70">
        Failed to load challenge
      </p>
    );
  }

  return (
    <div className="">
      <div className="mx-auto max-w-4xl p-4 md:p-2">
        <h2 className="my-5 py-4 pb-2 text-center text-3xl font-bold xl:text-4xl">
          {challenge?.name}
        </h2>
        <header className="flex justify-end gap-2">
          <Link to={`/edit/${id}`}>
            <Button className="flex items-center gap-2">
              <MdModeEdit className="size-4" />
              Edit
            </Button>
          </Link>
          <Button
            disabled={deleteChallengeMutation.isPending}
            onClick={() => {
              const confirm = window.confirm(
                `Are you sure to delete challenge ${challenge?.name}`,
              );
              if (confirm) {
                deleteChallengeMutation.mutate();
              }
            }}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <MdDeleteOutline className="size-4" />
            {deleteChallengeMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </header>
        <div className="mt-6 space-y-4 p-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">
              Number
            </h3>
            <p>{challenge?.number}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">
              Technology
            </h3>
            <p>{challenge?.tech?.replace("_", " ")}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">
              Domaine
            </h3>
            <p>{challenge?.domaine?.name}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">
              Points
            </h3>
            <p>{challenge?.points}</p>
          </div>
          {challenge?.key && (
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">
                Secret
              </h3>
              <p>{challenge?.key}</p>
            </div>
          )}
          {challenge?.hint && (
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">
                Hint
              </h3>
              <p>{challenge?.hint}</p>
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">
              Description
            </h3>
            <div className="mt-4 w-full p-0 sm:pl-4">
              <MarkdownEditor.Markdown
                style={
                  {
                    // backgroundColor: "rgb(248 250 252 / var(--tw-bg-opacity))",
                  }
                }
                source={challenge?.description}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
