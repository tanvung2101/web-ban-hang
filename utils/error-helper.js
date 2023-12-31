import { STATUS_REQUEST } from '@/constants'
import i18n from '@/locales/i18n'
import { toast } from 'react-toastify'
import LocalStorage from './storage'
import errorsJson from '@/locales/errors/en.json'
import Config from '@/configs'
import { STORAGE_KEY } from '@/constants/storage-key'
import { logout } from '@/redux/accountSlice'
import { store } from '@/store'

function errorHelper(err) {
    if (Config.ENV === 'local') {
        console.log(err);
    }

    const statusCode = err?.response?.status || 500
    const messageError = err?.response?.data?.code || err?.message

    if (statusCode === STATUS_REQUEST.UNAUTHORIZED || err?.response?.data === 'Unauthorized') {
        store.dispatch(
            logout()
        )
        LocalStorage.remove(STORAGE_KEY.TOKEN)
        LocalStorage.remove(STORAGE_KEY.INFO)
        return toast.error(i18n.t('errors:SESSION_HAS_EXPIRED'))
    }

    if (statusCode === 500) {
        return toast.error(i18n.t('errors:INTERNAL_SERVER_ERROR'))
    }

    if (messageError) {
        return toast.error(errorsJson[messageError] ? i18n.t(`errors:${[messageError]}`) : messageError)
    }
}

export default errorHelper
