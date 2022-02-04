import React from "react";
import axios from "axios";
import makeToast from "../../Toaster";

const DeleteRoom = (props) => {
    const deleteRoom = ()=>{
        props.setDel(false);
        axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem("CC_Token")}`}
        const _id = props.roomId;
        console.log("_id", _id);
        axios
            .post("http://10.137.214.100:8080/chatroom/delete", {
                _id
            }   
            ).then((response) => {
            makeToast("success ! ", response.data.message);
            window.location.reload(false);
          }).catch((err) => {
            if (
              err &&
              err.response &&
              err.response.data &&
              err.response.data.message
            )
              makeToast("error", err.response.data.message);
          });
    }
    return (
        <div className="card"> <br/><br/>
          <div className="cardHeader">Delete</div>
            <label htmlFor="chatroomName">Are you sure you want to delete it?</label>
            <button onClick={deleteRoom}>Delete Chatroom </button>
        </div>
      );
}
export default DeleteRoom;