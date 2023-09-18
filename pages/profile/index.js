import InputCopy from "@/components/InputCopy";
import PhoneInput from "@/components/PhoneInput";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { BsCurrencyDollar, BsGraphUpArrow, BsPeople, } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthApis from "@/apis/authApis";
import { setProfileAuth } from "@/redux/accountSlice";
import accountApis from "@/apis/accountApi";
import configDataApis from "@/apis/configDataApis";
import { MASTER_DATA_NAME, STATUS_ORDER } from "@/constants";
import orderApis from "@/apis/orderApis";
import { toast } from "react-toastify";
import { Button, Input, SEO, SelectCustom } from "@/components";
import useLocationForm from "@/components/location-vn";
import yup from "@/utils/yup";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from "@/components/Layout";
import RequireAuth from "../../components/RequireAuth";
import dynamic from "next/dynamic";
import Loading from "../../components/Loading";
const NavbarUser = dynamic(() => import('../../components/NavbarUser'))


const PageProfile = () => {
  const { token, info } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const schema = yup.object({
    fullName: yup.string().required().min(3).max(50).trim(),
    phoneCode: yup.string().max(5).trim().required().nullable(),
    phoneNumber: yup.string().min(9).max(20).trim().required().nullable(),
    address: yup.string().max(255).trim().required().nullable(),
    userCode: yup.string(),
    cityCode: yup.number().integer().required().nullable(),
    districtCode: yup.number().integer().required().nullable(),
    wardCode: yup.number().integer().required().nullable(),
  });


  const [listReferrer, setListReferrer] = useState([])
  const [listReferrerWithLevel, setListReferrerWithLevel] = useState();
  const [myBuyOfMonth, setMyBuyOfMonth] = useState(0);
  const [refBuyOfMonth, setRefBuyOfMonth] = useState(0);
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false)

  const getListReferrer = useCallback(async () => {
    const accounts = await accountApis.getMyReferrer(info?.id);
    setListReferrer(accounts)
    const listLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER
    })
    const referrerWithLevel = [];
    listLevel.map(level => {
      const userWithLevel = accounts.filter((a) => a.register.level === level.id)
      const quest = accounts.filter((a) => a.register.level === 0)
      referrerWithLevel.push({
        level: level.name,
        amount: userWithLevel.length,
      })

      setListReferrerWithLevel(referrerWithLevel)
    })

  }, [info])

  const getOrder = async () => {
    const myOrders = await orderApis.getOrderUser();
    const refsOrder = await orderApis.getOrderRef();
    let thisMonth = new Date().getMonth() + 1

    setMyBuyOfMonth(myOrders
      ?.filter((e) => new Date(e.orderDate).getMonth() + 1 === thisMonth && e.orderStatus === STATUS_ORDER.DELIVERED)
      ?.reduce((total, num) => {
        return total + (num.totalBeforeFee)
      }, 0)
    )

    setRefBuyOfMonth(refsOrder
      ?.filter((e) => new Date(e.orderDate).getMonth() + 1 === thisMonth && e.orderStatus === STATUS_ORDER.DELIVERED)
      ?.reduce((total, num) => {
        return total + (num.totalBeforeFee)
      }, 0))

  }

  useEffect(() => {
    getListReferrer()
  }, [getListReferrer])

  useEffect(() => {
    getOrder()
  }, [])


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    control,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: info?.email,
      fullName: info?.userInformation?.fullName,
      phoneCode: info?.phoneCode || "84",
      phoneNumber: info?.phoneNumber,
      address: info?.userInformation?.address,
      cityCode: info?.userInformation?.cityCode,
      districtCode: info?.userInformation?.districtCode,
      wardCode: info?.userInformation?.wardCode,
      referralCode: info?.userReferral?.referrerCode,
    },
    mode: "onChange",
  });
  const { phoneCode, phoneNumber, userCode, cityCode, districtCode, wardCode } =
    useWatch({
      control,
    });
  const { state, onCitySelect, onDistrictSelect, onWardSelect } =
    useLocationForm(
      true,
      info?.userInformation
    );
  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;
  const onSubmit = (data) => {
    const {
      fullName,
      phoneCode,
      phoneNumber,
      address,
      userCode,
      cityCode,
      districtCode,
      wardCode,
    } = data;
    setLoadingUpdateProfile(true)
    console.log({
      id: info?.id,
      fullName,
      phoneNumber: `${+phoneNumber}`,
      phoneCode: `${+phoneCode}`,
      address,
      cityCode: `${+cityCode}`,
      districtCode: `${+districtCode}`,
      wardCode: `${+wardCode}`,
    });
    AuthApis.updateProfileUser({
      id: info?.id,
      fullName,
      phoneNumber: `${+phoneNumber}`,
      phoneCode: `${+phoneCode}`,
      address,
      cityCode: `${+cityCode}`,
      districtCode: `${+districtCode}`,
      wardCode: +wardCode,
    })
      .then(() => {
        return AuthApis.getProfile();
      })
      .then((res) => {
        toast.success('Ban da cap nhat thanh cong')
        dispatch(setProfileAuth(res));
        setLoadingUpdateProfile(false)
        reset({
          fullName,
          phoneNumber: `+${phoneNumber}`,
          phoneCode: +phoneCode,
          address,
          cityCode: +cityCode?.id,
          districtCode: +districtCode?.id,
          wardCode: +wardCode?.is,
        });
      });
  };


  useEffect(() => {
    AuthApis.getProfile()
      .then((res) => dispatch(setProfileAuth(res)))
      .catch((err) => console.log(err))
      .finally(() => {
        console.log('thành công');
      });
  }, [token, dispatch]);
  return (
    <>
      <RequireAuth>
        <SEO title="Trang cá nhân"></SEO>
        <Suspense fallback={<Loading />}>
          <NavbarUser bgBackground='profile'>
            <div className="w-[75%] flex-col items-start max-md:w-full max-md:mt-4">
              <section className="flex items-start justify-between max-md:flex-col">
                <div className="flex flex-col items-start justify-between gap-2 w-[30%] px-4 py-4 rounded-md bg-slate-200 max-md:w-full">
                  <div className="flex items-center justify-between w-full mb-3">
                    <p className="text-lg font-bold text-regal-red">{myBuyOfMonth.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}</p>
                    <span>
                      <BsCurrencyDollar className="text-4xl text-center text-regal-red"></BsCurrencyDollar>
                    </span>
                  </div>
                  <div className={`relative w-[${Math.round((myBuyOfMonth / 15000000) * 100)}%] h-1 rounded-full bg-slate-200`}>
                    <div className={`absolute top-0 left-0 right-0 w-full h-1 bg-red-500 rounded-full`}></div>
                  </div>
                  <p className="text-sm">Doanh số trong tháng</p>
                </div>
                <div className="flex flex-col items-start justify-between gap-2 w-[30%] px-4 py-4 rounded-md bg-slate-200 max-md:w-full max-md:mt-4">
                  <div className="flex items-center justify-between w-full mb-3">
                    <p className="text-lg font-bold text-[#0dcaf0]">{refBuyOfMonth.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}</p>
                    <span>
                      <BsGraphUpArrow className="text-4xl text-center text-[#0dcaf0]"></BsGraphUpArrow>
                    </span>
                  </div>
                  <div className="relative w-full h-1 rounded-full bg-slate-200">
                    <div style={{
                      width: `${Math.round((refBuyOfMonth / 15000000) * 100)}%`
                    }} className={`absolute top-0 left-0 right-0 h-1 bg-[#0dcaf0] rounded-full`}></div>
                  </div>
                  <p className="text-sm">Doanh số người giới thiệu trong tháng</p>
                </div>
                <div className="flex flex-col items-start justify-between gap-2 w-[30%] px-4 py-4 rounded-md bg-slate-200 max-md:w-full max-md:mt-4">
                  <div className="flex items-center justify-between w-full mb-3">
                    <p className="text-lg font-bold text-yellow-300">{listReferrer.length}</p>
                    <span>
                      <BsPeople className="text-4xl text-center text-yellow-300"></BsPeople>
                    </span>
                  </div>
                  <div className="relative w-full h-1 rounded-full bg-slate-200">
                    <div style={{
                      width: `${Math.round((listReferrer.length / 20) * 100)}%`
                    }} className={`absolute top-0 left-0 right-0  h-1 bg-yellow-300 rounded-full`}></div>
                  </div>
                  <p className="text-sm">Số lượng người giới thiệu</p>
                </div>
              </section>
              <section className="px-1 pb-4 pt-16">
                <h3 className="font-sans font-bold text-3xl">Thông tin cá nhân</h3>
              </section>
              <form className="px-1" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-start justify-between gap-8 max-md:flex-col">
                  <div className="flex-col items-center justify-between gap-8 w-[50%] max-md:w-full">
                    <Layout label='ID giới thiệu'>
                      <InputCopy
                        value={info?.userCode}
                        disabled
                        placeholder="ID giới thiệu"
                      ></InputCopy>
                    </Layout>
                    <Layout label='Họ và tên' errors={errors?.fullName?.message} hiddent={true}>
                      <Input
                        {...register("fullName")}
                        placeholder="Họ và tên"
                        type="text"
                        errors={errors?.fullName?.message}
                      />
                    </Layout>
                    <Layout label='Email'>
                      <Input
                        placeholder="Địa chỉ"
                        defaultValue={info?.email}
                        disabled
                        type="text"
                        className={`inline-block w-full py-3 pl-4 pr-10 bg-[#fff] rounded-md outline-none text-sm border border-slate-300 hover:border hover:border-slate-500 cursor-not-allowed`}
                      />
                    </Layout>
                    <Layout label=' Số điện thoại' errors={errors?.phoneNumber?.message}>
                      <PhoneInput
                        phoneCode={phoneCode?.toString() || "84"}
                        onChangePhoneNumber={(newValue) => {
                          setValue("phoneNumber", +newValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        onChangePhoneCode={(newValue) => {
                          setValue("phoneCode", +newValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        namePhoneCode="phoneCode"
                        namePhoneNumber="phoneNumber"
                        register={register}
                      ></PhoneInput>
                    </Layout>
                  </div>
                  <div className="flex-col items-center justify-between gap-8 w-[50%] max-md:w-full">
                    <Layout label=' Địa chỉ' hiddent={true} errors={errors?.address?.message}>
                      <Input
                        {...register("address")}
                        placeholder="Địa chỉ"
                        type="text"
                        errors={errors?.address?.message}
                      />
                    </Layout>
                    <Layout label='Tỉnh/Thành' errors={errors?.cityCode?.message}>
                      <SelectCustom
                        {...register("cityCode")}
                        key={`cityCode_${selectedCity?.value}`}
                        isDisabled={cityOptions.length === 0}
                        options={cityOptions}
                        onChange={(option) => {
                          option.value !== selectedCity?.value &&
                            onCitySelect(option);
                          option.value === 0 &&
                            setValue("cityCode", null, {
                              shouldDirty: true,
                            });
                          setValue("wardCode", null);
                          setValue("districtCode", null);
                          option.value !== 0 &&
                            setValue("cityCode", option.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                        }}
                        placeholder={'Tinh'}
                        defaultValue={selectedCity}
                        className="select-custom"
                        classNamePrefix="select-custom"
                      />
                    </Layout>
                    <div className="flex-col w-full mt-4 ">
                      <label
                        htmlFor=""
                        className="inline-block mb-3 text-sm font-normal text-black"
                      >
                        Quận/Huyện
                      </label>
                      <div className="relative">
                        <SelectCustom
                          {...register("districtCode")}
                          key={`districtCode_${selectedDistrict?.value}`}
                          isDisabled={districtOptions.length === 0}
                          options={districtOptions}
                          onChange={(option) => {
                            option.value !== selectedDistrict?.value &&
                              onDistrictSelect(option);
                            setValue("districtCode", option.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          placeholder={'huyen'}
                          defaultValue={selectedDistrict}
                          className="select-custom"
                          classNamePrefix="select-custom"
                        />
                        <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                          {errors?.districtCode?.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex-col w-full mt-4 ">
                      <label
                        htmlFor=""
                        className="inline-block mb-3 text-sm font-normal text-black"
                      >
                        Phường/Xã
                      </label>
                      <div className="relative">
                        <SelectCustom
                          {...register("wardCode")}
                          key={`wardCode_${selectedWard?.value}`}
                          isDisabled={wardOptions.length === 0}
                          options={wardOptions}
                          placeholder='Phường/Xã'
                          onChange={(option) => {
                            onWardSelect(option);
                            setValue("wardCode", option.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          defaultValue={selectedWard}
                          className="select-custom"
                          classNamePrefix="select-custom"
                        />
                        <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                          {errors?.wardCode?.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-end justify-end mt-6">
                      <Button className='!w-[200px]' hiddent={true} type={'submit'} disabled={!isDirty} loading={loadingUpdateProfile || !isDirty}>Cập nhật thông tin</Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </NavbarUser>
        </Suspense>
      </RequireAuth>
    </>
  );
};


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer'], null, ['en', 'vi'])),
    },
    revalidate: 60,
  };
}

export default PageProfile;
