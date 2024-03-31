import addMemoReducer from "../reducer/addMemoReducer";
import loginReducer from "../reducer/loginReducer";
import { configureStore } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const store = configureStore({
  reducer: {
    login: loginReducer, //login là key chứa dữ liệu là redux's state
    memos: addMemoReducer, // memo cũng là key
  },
});

export default store;

// LOGIN_REQUEST
export function dispatchLoginRequest(dispatch) {
  dispatch({ type: "LOGIN_REQUEST" });
}

// LOGIN_SUCCESS
export function dispatchLoginSuccess(email, dispatch) {
  try {
    // đẩy vào redux state storage
    dispatch({ type: "LOGIN_SUCCESS", payload: email });

    // và copy ngược lại từ redux vào lại 🙂
    const login = store.getState().login;

    // để sau khi refresh page lại thì nó vẫn copy ngược từ redux -> local -> redux mới sau đăng nhập
    localStorage.setItem(
      "login",
      JSON.stringify(
        { ...login } // get mọi thứ từ key 'login' bên trong redux global state: login status, who is currently logged in
      )
    );

    window.location.href = "/suggestions";
  } catch (error) {
    console.error("Error while setting item in localStorage:", error);
  }
}

export function getAllMemosFromLocal() {
  let memosFromLocal = JSON.parse(localStorage.getItem("memos"));

  if (!memosFromLocal) {
    return [];
  } else {
    // copy lại tất cả memos từ localStorage về lại redux
    store.dispatch({
      type: "GET_ALL_MEMOS_FROM_LOCALSTORAGE",
      payload: memosFromLocal,
    });

    return store.getState().memos;
  }
}

// ADD_MEMO
export function dispatchAddMemo(color, content, dispatch) {
  const memosGetBeforeAddNewOne = getAllMemosFromLocal();

  try {
    const memoID = uuidv4();
    // one memo insists of: color, memo's note, unique id (uuidv4)
    const newMemo = {
      id: memoID,
      color: color,
      content: content,
      complete: false,
    };

    dispatch({
      type: "ADD_MEMO",
      payload: newMemo,
    });

    const updatedMemos = [...memosGetBeforeAddNewOne, newMemo];

    localStorage.setItem("memos", JSON.stringify(updatedMemos));

    alert("One memo added!");
  } catch (error) {
    console.log("Error while adding memo: ", error);
  }
}

// TOGGLE
export function dispatchToggleComplete(id, dispatch) {
  dispatch({
    type: "TOGGLE_COMPLETE",
    payload: { id: id },
  });

  console.log(store.getState().memos);
  const afterToggle = store.getState().memos;

  localStorage.setItem("memos", JSON.stringify(afterToggle));

  console.log(id);
}
