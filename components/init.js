import AuthApis from '@/apis/authApis';
import { MODE_THEME } from '@/constants';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, Zoom } from 'react-toastify';
import Loading from './Loading'

const Init = ({ children }) => {
    const { theme } = useSelector((state) => state.common);
    const { token } = useSelector((state) => state.account);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        switch (theme) {
            case MODE_THEME.DARK:
                document.documentElement.setAttribute("data-theme", "light");
                break;
            case MODE_THEME.LIGHT:
            default:
                document.documentElement.setAttribute("data-theme", "dark");
                break;
        }
    }, [theme]);
    useEffect(() => {
        if (token) {
            AuthApis.getProfile()
                .then((res) => {
                    dispatch(setProfileAuth(res));
                })
                .catch((err) => {

                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [dispatch, token]);
    return (
        <>
            {!loading ? children : <Loading />}
            <ToastContainer
                position="top-right"
                transition={Zoom}
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
            />
        </>
    )
}

export default Init