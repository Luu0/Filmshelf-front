import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import logo from "../assets/19e39a9ea246ceafb9f0673aa2addfe2c313e11c.png";
import { useRegister } from "../mutations/useRegister";
import { registerSchema } from "../schema/zodRegisterSchema";
import { parseRegisterError } from "../hooks/useRegisterErrors";

import Input from "../Components/input";

export default function Register() {
  const [, navigate] = useLocation();
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => navigate("/login"),
      onError: (err) => {
        const parsedErrors = parseRegisterError(err);
        Object.keys(parsedErrors).forEach((key) => {
          if (key === "general") {
            setError("root", {
              type: "manual",
              message: parsedErrors.general,
            });
          } else {
            setError(key, {
              type: "manual",
              message: parsedErrors[key],
            });
          }
        });
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0614] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-linear-to-br from-black/40 via-purple-900/20 to-black/60 pointer-events-none z-0" />

      <header className="absolute top-0 left-0 w-full flex items-center px-6 py-5 z-20">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" />
          <h1 className="text-white text-2xl font-bold tracking-wide">
            FILMSHELF
          </h1>
        </div>
      </header>

      <div className="relative bg-black/5 backdrop-blur-xl rounded-3xl px-11 py-[62px] max-w-lg w-full shadow-[0px_0px_50px_5px_rgba(128,0,255,0.1)] z-10">
        <h2 className="text-white text-[1.75rem] font-semibold text-center mb-11">
          Create free account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            placeholder="carlos@gmail.com"
            error={errors.email}
          />

          <Input
            label="Username"
            name="username"
            type="text"
            register={register}
            placeholder="carlos"
            error={errors.username}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            placeholder="example123"
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            placeholder="example123"
            error={errors.confirmPassword}
          />

          {errors.root && (
            <p className="text-red-400 text-center text-sm">
              {errors.root.message}
            </p>
          )}

          <button
            disabled={isPending}
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-4 rounded-xl shadow-xl text-[1.05rem]"
          >
            {isPending ? "Creating account..." : "Get started"}
          </button>
        </form>

        <p className="text-gray-400 text-center text-[0.95rem] mt-10">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-purple-400 hover:underline cursor-pointer">
              Sign in here
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
