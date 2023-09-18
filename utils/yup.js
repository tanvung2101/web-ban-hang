import i18n from "@/public/locales/i18n";
import * as yup from "yup";


yup.setLocale({
    mixed: {
        required: () => i18n.t("common:required"),
        default: ({ path }) => `${i18n.t(path)} ${i18n.t("common:invalid")}`,
    },
    string: {
        email: i18n.t("common:email"),
        min: ({ min }) => i18n.t("common:minLength", { min }),
        max: ({ max }) => i18n.t("common:maxLength", { max }),
        length: ({ length }) => i18n.t("common:length", { length }),
    },
    number: {
        min: ({ min }) => i18n.t("common:min", { min }),
        max: ({ max }) => i18n.t("common:max", { max }),
    },
});

export default yup;
