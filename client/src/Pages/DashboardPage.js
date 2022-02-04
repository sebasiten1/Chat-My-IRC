import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { Link } from "react-router-dom";
import {MdBuild, MdDeleteForever, MdLogout, MdGetApp} from "react-icons/md";
import ModifyRoom from "./component/modifyRoom";
import DeleteRoom from "./component/deleteRoom";


const DashboardPage = (props) => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const chatroomRef = React.createRef();
  const [modal, setModal] = React.useState(false);
  const [del,setDel] = React.useState(false);
  const logout =() => {
    localStorage.clear();
    window.location.href = 'http://10.137.214.100:3000/';
}
  const createRoom = () => {
    const name = chatroomRef.current.value;
    axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem("CC_Token")}`}
    axios
      .post("http://10.137.214.100:8080/chatroom", {
        name
      }).then((response) => {
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
  };
  const setUpdate = () => {setModal(true);};
  const deleteRoom = () => {setDel(true)};
  const getChatrooms = () => {
    axios
      .get("http://10.137.214.100:8080/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card"> <br/><br/>
      <button onClick={logout}><MdLogout />Log Out !</button>
      <div className="cardHeader">Chatrooms</div>
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
      <button onClick={createRoom}>Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id+"/"+chatroom.name}>
              <button className="join"><MdGetApp/></button>
            </Link>
            <Link to="#"><button className="join" onClick={setUpdate}><MdBuild/></button></Link>
            {modal ? <ModifyRoom roomId = {chatroom._id} setModal={setModal}/>: null}
            <Link to="#"><button className="join" onClick={deleteRoom}><MdDeleteForever/></button></Link>
            {del ? <DeleteRoom roomId = {chatroom._id} setDel={setDel}/>: null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;