import { Button, Input, SEO } from "@/components";
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { BiErrorCircle } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LOGIN_TYPE } from "@/constants";
import AuthApis from "@/apis/authApis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setProfileAuth, setToken } from "@/redux/accountSlice";
import Link from "next/link";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import yup from "@/utils/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

const PageLogin = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.account);

  const [hiddentPass, setHiddentPass] = useState(false);

  const schema = yup.object({
    email: yup
      .string()
      .email()
      .required()
      .max(255)
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        t("validations:email")
      )
      .trim(),
    password: yup.string().required().min(6).max(30).trim(),
    type: yup.number().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: LOGIN_TYPE.USER,
    },
  });

  const {
    mutateAsync: login,
    isSuccess,
    isPending,
    data,
  } = useMutation({
    mutationFn: AuthApis.login,
    onSuccess: (data) => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
      console.log(data.token);
      if (data) {
        router.push("/");
        dispatch(setToken(data.token));
      }
      toast.success('Đăng nhập thành công')
    },
    onError: () => toast.error('Mật khẩu hoặc email sai')
  });
  // console.log(data);
  const { data: getProfile, } = useQuery({
    queryKey: ["get-profile"],
    queryFn: AuthApis.getProfile,
    enabled: !!data
  });
  if (getProfile) dispatch(setProfileAuth(getProfile));

  const onSubmit = async (values) => {
    await login(values)
  };
  if (token) return router.push('/', undefined, { shallow: true })
  return (
    <>
      <SEO title={t('login')}></SEO>
      {!token ? <div className="flex items-center my-20">
        <div className="mx-auto min-w-[25%] max-md:min-w-[80%]">
          <h3 className="text-2xl">{t('login')}</h3>
          <form
            className="inline-block w-full bg-white max-md:block"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex-col mt-4">
              <label
                className="inline-block mb-3 text-sm font-normal text-black"
                htmlFor=""
              >
                {t('email')}
              </label>
              <div className="relative">
                <Input
                  {...register("email")}
                  placeholder={t("enter_your_email")}
                  type="text"
                  errors={errors?.email?.message}
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
                {t('password')}
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  placeholder={t("enter_your_password")}
                  type={hiddentPass ? "text" : "password"}
                  errors={errors?.password?.message}
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
            <div className="mt-4 cursor-pointer mb-10">
              <Link href='/forgot-password' className="text-sm text-regal-red hover:text-yellow-400">
                {t("forgot_password")}
              </Link>
            </div>
            <Button className='w-full' loading={isPending} disabled={isPending}>{t("login")}</Button>
            <div className="flex items-center justify-center mt-5">
              <span className="text-xs text-center">
                {t("already_account")}
                <Link href='/sign-up' className="ml-1 text-[14px] text-regal-red font-medium hover:text-yellow-400">
                  {t("sign_up")}
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div> : <div className="w-full h-screen"></div>}
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


export default PageLogin;
