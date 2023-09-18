import configDataApis from '@/apis/configDataApis';
import orderApis from '@/apis/orderApis';
import dynamic from 'next/dynamic'
const NavbarUser = dynamic(() => import('../../components/NavbarUser'), { loading: () => <Loading></Loading>, })
import Loading from '@/components/Loading';
import RequireAuth from "../../components/RequireAuth";
import { MASTER_DATA_NAME } from '@/constants';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { SEO } from '@/components';
import { Suspense } from 'react';


const PageMyOrder = () => {
    const { token, info } = useSelector((state) => state.account);
    const router = useRouter();

    const [orderList, setOrderList] = useState([])
    const [masterOrderStatus, setMasterOrderStatus] = useState()
    const fetchMasterData = async () => {
        const masterOrder = await axios.get('http://localhost:3001/api/master/get-master', {
            idMaster: MASTER_DATA_NAME.STATUS_ORDER
        })
        setMasterOrderStatus(masterOrder.data)
    }
    console.log('masterOrderStatus', masterOrderStatus)
    const fetchOrderList = async () => {
        const orderList = await orderApis.getOrderUser();
        console.log('orderList', orderList)
        setOrderList(orderList)
    }

    useEffect(() => {
        fetchMasterData()
        fetchOrderList()
    }, [])
    // if (!orderList) return <Loading></Loading>
    return (
        <>
            <SEO title="Đơn hàng của tôi"></SEO>
            <RequireAuth>
                <Suspense fallback={<Loading />}>
                    <NavbarUser bgBackground='my-order'>
                        <div className="w-[75%] flex-col items-start max-md:w-full">
                            <h3 className='text-[25px] pb-8'>Đơn hàng của tôi</h3>
                            {orderList.length > 0 ? orderList.map(item =>
                                <div key={item.id} className='flex items-center justify-between bg-white p-4 drop-shadow-xl max-md:mt-4 max-sm:flex-col max-sm:items-start'>
                                    <div className='flex flex-col items-start gap-2'>
                                        <p className='text-2xl font-bold'>Đơn hàng {`#${item?.orderCode}`}</p>
                                        <p className='font-normal font-serif'>Tổng giá trị: {item?.total.toLocaleString("vi", {
                                            style: "currency",
                                            currency: "VND",
                                        })}</p>
                                        <p className='font-normal font-serif'>Tình trạng: <span className='text-green-700'>{masterOrderStatus && masterOrderStatus.find((mas => mas.id === item.orderStatus))?.name}</span></p>
                                    </div>
                                    <div className='self-end flex items-end pr-28 max-sm:p-0 max-sm:self-start max-sm:mt-2'>
                                        <Link href={`my-order/${item?.orderCode}`} prefetch={true} className='uppercase text-base font-bold text-regal-red transition-all hover:text-yellow-300'>Xem chi tiết</Link>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </NavbarUser>
                </Suspense>
            </RequireAuth>
        </>
    )
}

export default PageMyOrder