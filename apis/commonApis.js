import axios from "axios";
import axiosClient from "./axiosClient";
const config = { headers: { "Content-Type": "multipart/form-data" } };
const commonApis = {
    preUploadFile: (formData) => axiosClient.post('/api/common/create-presigned-url', formData),
    uploadFile: ({ urlUpload }) => {
        return fetch(urlUpload, {
            method: "PUT",
            body: file,
        })
    }
}

export default commonApis