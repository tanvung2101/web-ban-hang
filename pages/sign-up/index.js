import dynamic from 'next/dynamic'
// import { Input, SEO } from "@/components";
// const Input = dynamic(() => import('../../components/Input'))
const SEO = dynamic(() => import('../../components/SEO/index'), { ssr: false })
import React, { useMemo, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthApis from "@/apis/authApis";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Input from '../../components/Input';
import { useMutation } from '@tanstack/react-query';


const PageRegister = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [hiddentPass, setHiddentPass] = useState(true);
  const [hiddentConfirmPass, setHiddentConfirmPass] = useState(true);
  const schema = useMemo(() => yup
    .object()
    .shape({
      referralCode: yup
        .string()
        .notRequired()
        .nullable()
        .matches(/(^\s*$|(^SS)[0-9]{6}$)/, "ID giới thiệu không đúng định dạng"),
      email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Trường bắt buộc")
        .max(255)
        .matches(
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
          "Vui long nhap email hop le"
        )
        .trim(),
      fullName: yup
        .string()
        .required("Trường bắt buộc")
        .min(3, "Tối thiểu 3 kí tự")
        .max(50, "Tối đa 50 kí tự")
        .trim(),
      password: yup.string().required("Trường bắt buộc").min(6, 'Tối thiểu 6 kí tự').max(30, 'Tối đa 30 kí tự').trim(),
      confirmPass: yup
        .string()
        .when("password", {
          is: (val) => (val && val.length > 0 ? true : false),
          then: () =>
            yup
              .string()
              .oneOf([yup.ref("password")], "Mật khẩu không giống nhau"),
        })
        .required("Trường bắt buộc")
        .trim(),
    }), [])
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    mutateAsync: registerUser,
  } = useMutation({
    mutationFn: AuthApis.signUpUser,
    onSuccess: (data) => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
      console.log(data.token);
      if (data) {
        router.push("/login");
      }
      toast.success('Đăng kí thành công')
    },
    onError: () => toast.error('Mật khẩu hoặc email sai')
  });
  const onSubmit = async (data) => {
    await registerUser(data)
  };

  return (
    <>
      <SEO title={t("sign_up")}></SEO>
      <div className="flex items-center my-20">
        <div className="mx-auto min-w-[30%] max-md:min-w-[80%]">
          <h3 className="text-2xl">{t("sign_up")}</h3>
          <div>
            <form
              className="inline-block w-full bg-white"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  {t("display_name")}
                </label>
                <div className="relative">
                  <Input
                    {...register("fullName")}
                    placeholder={t("display_name")}
                    type="text"
                    errors={errors?.fullName?.message}
                  />
                  {errors?.fullName?.message && (
                    <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                      <BiErrorCircle className="text-lg text-red-500" />
                    </span>
                  )}
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.fullName?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <Input
                    {...register("email")}
                    placeholder={t("email")}
                    type="text"
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm${errors?.email?.message
                      ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                      : "border border-slate-300 hover:border hover:border-slate-500"
                      }`}
                  />
                  {errors?.email?.message && (
                    <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                      <BiErrorCircle className="text-lg text-red-500" />
                    </span>
                  )}
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.email?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    placeholder={t("password")}
                    type={hiddentPass ? "password" : "text"}
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${errors?.password?.message
                      ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                      : "border border-slate-300 hover:border hover:border-slate-500"
                      }`}
                  />
                  <span
                    className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2"
                    onClick={() => setHiddentPass(!hiddentPass)}
                  >
                    {hiddentPass ? (
                      <AiOutlineEyeInvisible className="opacity-60"></AiOutlineEyeInvisible>
                    ) : (
                      <AiOutlineEye className="opacity-60"></AiOutlineEye>
                    )}
                  </span>
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.password?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  {t("confirm_password")}
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPass")}
                    placeholder={t("confirm_password")}
                    type={hiddentConfirmPass ? "password" : "text"}
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${errors?.confirmPass?.message
                      ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                      : "border border-slate-300 hover:border hover:border-slate-500"
                      }`}
                  />
                  <span
                    className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2"
                    onClick={() => setHiddentConfirmPass(!hiddentConfirmPass)}
                  >
                    {hiddentConfirmPass ? (
                      <AiOutlineEyeInvisible className="opacity-60"></AiOutlineEyeInvisible>
                    ) : (
                      <AiOutlineEye className="opacity-60"></AiOutlineEye>
                    )}
                  </span>
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.confirmPass?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor="referralCode"
                >
                  {t("referral_id")}
                </label>
                <div>
                  <input
                    {...register("referralCode")}
                    placeholder={t("referral_id")}
                    type="referralCode"
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${errors?.referralCode?.message
                      ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                      : "border border-slate-300 hover:border hover:border-slate-500"
                      }`}
                  />
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.referralCode?.message}
                </span>
              </div>
              <button className="inline-block w-full py-2 mt-10 text-lg text-white rounded-md cursor-pointer bg-regal-red">
                {t("sign_up")}
              </button>
              <div className="flex items-center justify-center mt-5">
                <span className="text-xs text-center">
                  {t("already_account")}
                  <Link href='/login' prefetch={true} className="ml-1 text-[14px] text-regal-red hover:text-yellow-400 cursor-pointer">
                    {t("login")}
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};


export async function getStaticProps({ locale }) {
  console.log(locale)
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], null, ['vi', 'en'])),
      // Will be passed to the page component as props
    },
  }
}

export default PageRegister;
