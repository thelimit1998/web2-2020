import React, { Component } from "react";
import { FaPlus, FaEdit, FaLock, FaLockOpen } from "react-icons/fa";
import "./style.css";
import ModalEditProfile from "./ModalEditProfile";

import { api } from "./api";
let staff = {
  id: "",
  id: null,
  name: "",
  position: "",
  salary: 0,
  role: 1,
  email: "",
};
class StaffManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: false,
      staffs: [],
    };
  }

  getAll = async () => {
    api.get("/listStaff").then(({ data }) => {
      if (data.data) {
        this.setState({
          staffs: data.data,
        });
      } else {
        this.props.onIsLogout();
      }
    });
  };
  Lock = (id) => {
    let index = this.findIndex(id);
    const staff = this.state.staffs[index];
    let { staffs } = this.state;
    api
      .put(`blockAccount/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.result === "ok") {
          staffs[index].isLock = !staff.isLock;
          this.setState({
            staffs: [...staffs],
          });
        }
      })
      .catch((err) => {
        console.log(err + "");
      });
  };
  componentDidMount() {
    this.getAll();
  }
  findIndex = (id) => {
    let staffs = this.state.staffs;
    let index = -1;
    staffs.forEach((item, i) => {
      if (item.accountId === id) {
        index = i;
      }
    });
    return index;
  };
  onLock = async (id) => {
    this.Lock(id);
  };
  listStaff = () => {
    let staffs = this.state.staffs;
    let list = staffs.map((item, index) => {
      let role = item.role === 1 ? "Staff" : "Admin";

      return (
        <tbody key={index}>
          <tr id="listStaff">
            <td>{item.accountId}</td>
            <td>{item.fullname}</td>
            <td>{item.Account.email}</td>
            <td>{item.position}</td>
            <td>{item.salary}</td>
            <td>{role}</td>
            <td style={{ maxWidth: 100 }}>
              <td style={{ border: "none" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.toggleModal(item.accountId)}
                >
                  <FaEdit />
                </button>
              </td>

              <td style={{ border: "none" }}>
                <button
                  type="button"
                  className="btn  btn-danger"
                  onClick={() => this.onLock(item.accountId)}
                >
                  {item.isLock ? <FaLock /> : <FaLockOpen />}
                </button>
              </td>
            </td>
          </tr>
        </tbody>
      );
    });
    return list;
  };

  toggleModal = (id) => {
    let staffs = this.state.staffs;
    if (id) {
      let index = this.findIndex(id);
      if (index !== -1) {
        staff = staffs[index];
      }
    } else {
      staff = {
        id: null,
        name: "",
        position: "",
        salary: 0,
        role: 1,
        isLock: false,
      };
    }
    this.setState({
      status: !this.state.status,
    });
  };

  render() {
    let { status } = this.state;

    return (
      <div
        style={{
          marginTop: 150,
          height: "auto",
          minHeight: "100%",
          backgroundColor: "#ffffdd",
        }}
      >
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3>STAFF MANAGER</h3>
          </div>
          <FaPlus
            color="blue"
            cursor="pointer"
            size="40px"
            onClick={this.toggleModal}
          />

          <table className="table table-bordered">
            <thead>
              <tr>
                <th> ID </th>
                <th> Name </th>
                <th>Email</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Role</th>
                <th>Handle</th>
              </tr>
            </thead>
            {this.listStaff()}
          </table>
        </div>
        {status === true ? (
          <ModalEditProfile
            staff={staff}
            onToggleModal={this.toggleModal}
            onGetAll={this.getAll}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default StaffManager;
