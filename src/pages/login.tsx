import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WelcomePageHeader from "@/components/welcome-page-header";
import { useAuth } from "@/context/auth-context";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect } from "react";

const validationSchema = z.object({
  code: z.string(),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
  });

  const { login, isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(form: z.infer<typeof validationSchema>) {
    try {
      const { data } = await axios.post(
        (import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1/") +
          "auth/login",
        {
          code: form.code,
        },
      );

      login(data);
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message ?? "Invalid Credentials", {
        position: "bottom-right",
      });
    }
  }

  return (
    <div className="flex h-full flex-col">
      <WelcomePageHeader />
      <div className="flex flex-1 items-center justify-center ">
        <div className="w-full max-w-md -translate-y-10 rounded-md bg-slate-50 p-6 shadow-md dark:bg-gray-900">
          <div className="space-y-2 text-center">
            <h3 className="text-center text-4xl font-bold">Login</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome Mic Member! Please login to your account.
            </p>
          </div>
          <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                {...register("code")}
                className={clsx("rounded-md p-2")}
                placeholder="Enter the secret code"
                id="code"
                type="code"
                required
              />
            </div>
            <Button type="submit" className="mt-4 w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
