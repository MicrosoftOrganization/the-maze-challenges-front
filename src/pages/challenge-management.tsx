import { Button } from "@/components/ui/button";
import { Axios } from "@/helpers/axios";
import { useQuery } from "@tanstack/react-query";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { Challenge } from "@/types";
import { FaLock } from "react-icons/fa";

export default function ChallengeManagementPage() {
  const {
    data: challenges,
    isLoading,
    error,
  } = useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data } = await Axios.get("/challenges");
      return data;
      //   return fakeChallenges;
    },
  });

  if (isLoading) {
    return (
      <p className="py-20 text-center text-xl font-semibold opacity-70">
        Loading Challenges...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-20 text-center text-xl font-semibold opacity-70">
        Failed to load challenges
      </p>
    );
  }

  return (
    <>
      <div className="my-5 mb-6">
        <h2 className=" flex-1 py-5 text-center text-xl font-bold xl:text-3xl 2xl:text-5xl">
          Challenges Managmenet
        </h2>
      </div>
      <main className="mx-auto max-w-4xl  p-2 md:p-0">
        <header className="flex items-center justify-between">
          <h2 className="text-xl">
            Total:{" "}
            <span className="font-semibold">{challenges?.length || 0}</span>
          </h2>
          <Link to="new">
            <Button className="flex items-center gap-2">
              <AiOutlinePlus />
              Create Challenge
            </Button>
          </Link>
        </header>
        <div className="mt-5 space-y-3">
          {challenges?.length === 0 ? (
            <p className="my-6 text-center text-lg font-semibold opacity-70">
              No Challenges Found
            </p>
          ) : (
            challenges?.map((challenge) => (
              <div
                key={challenge.id}
                className="relative rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800"
              >
                <Link
                  to={`/challenges/${challenge.id}`}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2">
                    {challenge?.key && <FaLock />}
                    <h3 className="text-xl font-semibold">
                      {challenge.name}
                      <span className="ml-2 text-gray-500">
                        #{challenge?.number}
                      </span>
                    </h3>
                  </div>
                  <p className="text-gray-500">
                    Domain: {challenge?.domaine?.name}
                  </p>
                  <span className="mt-4 w-fit rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                    Points: {challenge?.points}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  className="absolute right-2 top-2 cursor-pointer text-gray-700"
                  title="edit"
                >
                  <Link to={`/edit/${challenge.id}`}>
                    <MdModeEdit className="size-5" />
                  </Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
