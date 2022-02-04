import React from "react";
import axios from "axios";
import makeToast from "../../Toaster";

const ModifyRoom = (props) => {
    const chatroomRef = React.createRef();
    const updateRoom = ()=>{
        const _id = props.roomId;
        console.log("id", _id);
        const name = chatroomRef.current.value;
        axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem("CC_Token")}`}
        axios
            .put("http://10.137.214.100:8080/chatroom/update",{
                _id,
                name
            }).then((response) => {
            makeToast("success ! ", response.data.message);
            //window.location.reload(false);
            props.setModal(false);
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
          <div className="cardHeader"> Modify Chatrooms</div>
          <div className="cardBody">
            <div className="inputGroup">
              <label htmlFor="chatroomName">Chatroom Name</label>
              <input
                type="text"
                name="chatroomName"
                id="chatroomName"
                placeholder="ChatterBox"
                ref={chatroomRef}
              />
            </div>
          </div>
          <button onClick={updateRoom}>Update Chatroom</button>
        </div>
      );
}
export default ModifyRoom;