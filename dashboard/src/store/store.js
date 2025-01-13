import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import forgotResetPasswordReducer from "./slices/forgotResetPasswordSlice.js";
import messagesReducer from "./slices/messagesSlice.js";
import timelineReducer from "./slices/timelineSlice.js";
import skillReducer from "./slices/skillSlice.js";
import projectReducer from "./slices/projectSlice.js";
import softwareApplicationReducer from "./slices/softwareApplicationSlice.js";
export const store = configureStore({
    reducer: {
        user:userReducer,
        forgotPassword : forgotResetPasswordReducer,
        messages : messagesReducer,
        timeline : timelineReducer,
        skill : skillReducer,
        project : projectReducer,
        softwareApplications : softwareApplicationReducer
    }
})