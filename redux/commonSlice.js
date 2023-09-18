import { MODE_THEME } from '@/constants';
import { createSlice } from '@reduxjs/toolkit';

const commonSlice = createSlice({
    name: 'common',
    initialState: {
        theme: MODE_THEME.DARK,
        lang: "en"
    },
    reducers: {
        changeTheme(state, action) {
            const newTheme = action.payload
            state.theme = newTheme
        },
        changeLanguage(state, action) {
            const newLang = action.payload
            state.lang = newLang
        }
    }
})

const { actions } = commonSlice

export const { changeTheme, changeLanguage } = actions
export default commonSlice.reducer