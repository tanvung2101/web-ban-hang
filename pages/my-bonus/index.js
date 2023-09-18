import accountApis from '@/apis/accountApi';
import { SEO } from '@/components';
import Loading from '@/components/Loading';
import RequireAuth from '@/components/RequireAuth';
// import ModalWithdraw from '@/components/ModalWithdraw';
// import NavbarUser from '@/components/NavbarUser';
import { BONUS_TYPE, BONUS_TYPE_MAP, MASTER_DATA_NAME } from '@/constants';
import axios from 'axios';
import dynamic from 'next/dynamic';
const NavbarUser = dynamic(() => import('../../components/NavbarUser'), { loading: () => <Loading></Loading>, })
const ModalWithdraw = dynamic(() => import('../../components/ModalWithdraw'), { loading: () => <Loading></Loading>, })
import Link from 'next/link';
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';


async function fetchMasterCapacity(params) {
    const res = await axios.get(`http://localhost:3001/api/master/get-master`, {
        params,
    });
    return res.data;
}

const PageMyBonus = () => {
    const { info } = useSelector((state) => state.account);
    const [bonusList, setBonusList] = useState([]);
    const [totalBonus, setTotalBonus] = useState(0);
    const [masterOrderStatus, setMasterOrderStatus] = useState()
    const [showModal, setShowModal] = React.useState(false);

    const fetchMasterData = async () => {
        const masterOrder = await fetchMasterCapacity({
            idMaster: MASTER_DATA_NAME.STATUS_ORDER,
        })
        setMasterOrderStatus(masterOrder)
        // console.log(masterOrder)
    }

    const fetchBounsList = useCallback(async () => {
        const bonus = await accountApis.getMyBonus();
        const total = await accountApis.countTotalBonus({ userId: info?.id })
        setBonusList(bonus);
        setTotalBonus(total?.data === 0 ? 0 : total)
    }, [info?.id])

    useEffect(() => {
        fetchMasterData()
        fetchBounsList()
    }, [fetchBounsList])
    return (
        <>
            <RequireAuth>
                <SEO title="Lịch sử thưởng"></SEO>
                <Suspense fallback={<Loading />}>
                    <NavbarUser bgBackground='my-bonus'>
                        <div className="w-[75%] flex-col items-start max-lg:w-full max-md:overflow-auto">
                            <h3 className='text-3xl mb-4'>Lịch sử thưởng</h3>
                            <table className='w-full max-md:w-[1000px] max-md:mb-3'>
                                <thead>
                                    <tr className='text-center bg-[#d1e7dd]'>
                                        <th className='py-2'>#</th>
                                        <th>Người bạn giới thiệu</th>
                                        <th>Mã người bạn giới thiệu	</th>
                                        <th>Đơn hàng</th>
                                        <th>Hoa hồng</th>
                                        <th>Loại</th>
                                    </tr>
                                </thead>
                                {bonusList && bonusList.map((bonus, index) => {
                                    return (
                                        <tbody key={bonus.id}>
                                            <tr className={`text-center ${(index + 1) % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f2]'}`}>
                                                <td className='pt-2 pb-3 font-bold'>{index + 1}</td>
                                                <td className='text-base'>{bonus?.order?.fullName ? bonus?.order?.fullName : "-"}</td>
                                                <td className='text-base'>{bonus.type !== BONUS_TYPE.RECEIVER ? "-" : bonus?.order?.user ? bonus?.order?.user.userCode : 'GUEST'}</td>
                                                <td className='text-base text-regal-red hover:text-yellow-400'>
                                                    {
                                                        bonus.order ?
                                                            <Link href={`/search-order?email=${bonus?.order?.email}&orderCode=${bonus?.order?.orderCode}`} prefetch={true}>{bonus.order?.orderCode ? bonus.order?.orderCode : "-"}</Link>
                                                            : "-"
                                                    }
                                                </td>
                                                <td className='text-base'>{bonus?.priceBonus.toLocaleString("vi", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}</td>
                                                <td className=''>
                                                    <span className={`${bonus.type === BONUS_TYPE.RECEIVER ? 'bg-green-600' : bonus.type === BONUS_TYPE.WITHDRAW ? 'bg-[#0dcaf0]' : bonus.type === BONUS_TYPE.REQUEST ? 'bg-yellow-400' : 'bg-red-600'} rounded-lg text-[12px] font-bold text-white px-2 pb-1`}>{BONUS_TYPE_MAP.find((e) => e.value === bonus.type)?.label}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                                <tbody>
                                    <tr className='text-center bg-[#c7dbd2]'>
                                        <td className='pt-3 pb-4 font-bold'>Tổng thưởng</td>
                                        <td className='font-bold' colSpan='4'>{totalBonus && totalBonus.toLocaleString("vi", {
                                            style: "currency",
                                            currency: "VND",
                                        })}</td>
                                        <td colSpan='1' className=''>
                                            <button
                                                disabled={totalBonus && totalBonus === 0}
                                                className={`relative px-2 pt-1 pb-2 rounded-md text-sm text-white bg-regal-red ${totalBonus === 0 && "after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:w-full after:h-full after:rounded-md after:bg-slate-300 after:bg-opacity-20"}`}
                                                type="button"
                                                onClick={() => setShowModal(true)}
                                            >Yêu cầu rút tiền thưởng</button>
                                            <ModalWithdraw showModal={showModal} setShowModal={() => setShowModal(false)} totalBonus={totalBonus} userId={info?.id}></ModalWithdraw>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </NavbarUser>
                </Suspense>
            </RequireAuth>
        </>
    )
}

export default PageMyBonus