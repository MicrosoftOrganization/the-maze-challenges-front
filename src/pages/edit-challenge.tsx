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

import { Input } from "@/components/ui/input";
import MarkdownEditor from "@uiw/react-md-editor";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Challenge, CreateChallengeForm } from "@/types";
import { Axios } from "@/helpers/axios";
import { useEffect } from "react";
import rehypePlugin from "rehype-highlight";
import remarkPlugin from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

const validationSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Challenge name is required"),
  number: z.coerce.number().min(1, "Challenge number is required"),
  points: z.coerce.number().min(1, "Challenge points is required"),
  description: z.string().min(1, "Challenge description is required"),
  tech: z.string().optional(),
  domaineId: z.coerce.number().min(1, "Challenge domain is required"),
  key: z.string().optional().nullable(),
  hint: z.string().optional().nullable(),
});

export default function EditChallengePage() {
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
    },
  });

  const {
    data: formData,
    isLoading: isFormDataLoading,
    error: formError,
  } = useQuery<CreateChallengeForm>({
    queryKey: ["create-challenge-form"],
    queryFn: async () => {
      const { data } = await Axios.get(`/challenges/get-create-form`);
      return data;
    },
  });

  const form = useForm<z.infer<typeof validationSchema>>({
    defaultValues: {
      id: 0,
      name: "",
      number: 0,
      points: 0,
      description: "",
      tech: "",
      domaineId: 0,
      key: "",
      hint: "",
    },
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    form.reset({ ...challenge, domaineId: challenge?.domaine?.id });
  }, [challenge]);

  const updateChallengeMutation = useMutation({
    mutationKey: ["update-challenge"],
    mutationFn: async (data: z.infer<typeof validationSchema>) => {
      return await Axios.patch(`/challenges/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Challenge updated successfully");
      queryClient.invalidateQueries({ queryKey: ["challenge", id] });
      navigate(-1);
    },
    onError: () => {
      toast.error("Failed to update challenge");
    },
  });

  const onSubmit = async (data: z.infer<typeof validationSchema>) => {
    const hint = data.hint ? data.hint : null;
    const key = data.key ? data.key : null;

    updateChallengeMutation.mutate({ ...data, hint, key });
  };

  if (isLoading || isFormDataLoading) {
    return (
      <p className="py-20 text-center text-xl font-semibold opacity-70">
        Loading Form...
      </p>
    );
  }

  if (error || formError) {
    return (
      <p className="py-20 text-center text-xl font-semibold opacity-70">
        Failed Loading From Data...
      </p>
    );
  }

  const techList = Object.entries(formData?.techs ?? {}).map(([key, value]) => [
    key?.replace("_", " "),
    value,
  ]);

  return (
    <div className="">
      <div className="mx-auto max-w-4xl p-4 md:p-2">
        <h2 className="my-5 py-4 pb-2 text-center text-3xl font-bold xl:text-4xl">
          Edit Challenge
        </h2>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Name</FormLabel>
                    <Input {...field} placeholder="Enter Challenge Name" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Number</FormLabel>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Enter Challenge Number"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Points</FormLabel>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Enter Challenge Points"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tech"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select The Challenge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {techList.map((tech) => (
                          <SelectItem key={tech[0]} value={tech[1]}>
                            {tech[0]}
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
                name="domaineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Domain</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select The Challenge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData?.domains.map((domain) => (
                          <SelectItem
                            key={domain.id}
                            value={domain.id?.toString()}
                          >
                            {domain.name}
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
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret</FormLabel>
                    <Input
                      {...field}
                      value={field.value ? field.value.toString() : ""}
                      placeholder="Enter Secret"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hint</FormLabel>
                    <Input
                      {...field}
                      value={field.value ? field.value.toString() : ""}
                      placeholder="Enter Hint"
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
                    <FormLabel>Challenge Description</FormLabel>
                    <MarkdownEditor
                      {...field}
                      className="h-[340px] rounded-md border border-gray-300"
                      previewOptions={{
                        remarkPlugins: [remarkPlugin],
                        rehypePlugins: [[rehypePlugin], [rehypeSanitize]],
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-6 self-center"
                disabled={updateChallengeMutation.isPending}
              >
                {updateChallengeMutation.isPending ? "Updating" : "Update"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
