import LocalStorage from '@/utils/storage'
import i18n from 'i18next'

import enTransition from './en/transitions.json'
import enError from './en/errors.json'
import enValidation from './en/validations.json'
import enCommon from './en/common.json'

import viTransition from './vi/transitions.json'
import viError from './vi/errors.json'
import viValidation from './en/validations.json'
import viCommon from './en/common.json'
import { initReactI18next } from 'react-i18next'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            vi: {
                common: viCommon,
                translations: viTransition,
                errors: viError,
                validations: viValidation
            },
            en: {
                common: enCommon,
                translations: enTransition,
                errors: enError,
                validations: enValidation
            }
        },
        lng: "vi",
        fallbackLng: ['vi', 'en'],
        debug: false,
        ns: ['common', 'translations', 'errors', 'validations'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
            formatSeparator: ','
        },
        react: {
            wait: true
        },
    })

export default i18n