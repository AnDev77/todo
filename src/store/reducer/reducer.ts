import { boardReducer } from "../slices/boardSlice";
import { loggerReducer } from "../slices/loggerSlice";
import { modalReducer } from "../slices/modalSlice";
import { user } from "../slices/userSlice";

const reducer = {
    logger : loggerReducer,
    board : boardReducer,
    modal : modalReducer,
    user : user
}

export default reducer;