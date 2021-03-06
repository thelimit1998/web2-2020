import React, { Component } from "react";
import { api } from "./api";
import Loading from "../Loading";
import Account from "./Account";
import { Redirect } from "react-router-dom";
import AccountEdit from "./AccountEdit";
import AddMoney from "./AddMoney";
import { FaLock, FaLockOpen } from "react-icons/fa";
import Notification from "./Notification";
let account = {};

export default class FindUser extends Component {
  constructor() {
    super();
    const token = localStorage.getItem("token") || "";
    api.defaults.headers["authorization"] = `bearer ${token} `;
    this.state = {
      listUser: [],
      key: "",
      isLoading: false,
      isOpenModal: false,
      isOpenModalEdit: false,
      redirect: false,
      type: "1",
    };
  }
  onChangeType = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  };
  findIndex = (id) => {
    let index = -1;

    this.state.listUser.forEach((item, i) => {
      if (item.Account.id === id) {
        index = i;
      }
    });
    return index;
  };
  Lock = (id) => {
    let index = this.findIndex(id);

    api
      .put(`blockAccount/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.result === "ok") {
          this.getAll();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onLock = async (id) => {
    this.Lock(id);
  };
  getAll = async () => {
    api
      .get("/find-user")
      .then(({ data }) => {
        if (data.result === "Ok") {
          this.setState({
            listUser: data.data,
            isLoading: true,
            isOpenModal: false,
            isOpenModalAdd: false,
          });
        }
      })
      .catch((err) => {
        Notification("Opps something went wrong!!!", "error", 3000);
        this.setState({
          isLoading: true,
        });
      });
  };
  componentDidMount() {
    this.getAll();
  }

  onChange = (e) => {
    let key = e.target.value;
    this.setState({
      key,
    });
  };
  onShowModal = (i) => {
    account = i;
    this.setState({
      isOpenModal: true,
    });
  };
  onShowModalEdit = (i) => {
    account = i;
    this.setState({
      isOpenModalEdit: true,
    });
  };
  onCloseModalEdit = () => {
    this.setState({
      isOpenModalEdit: false,
    });
    this.getAll();
  };
  onCloseModal = () => {
    this.setState({
      isOpenModal: false,
      isOpenModalAdd: false,
    });
    this.getAll();
  };
  onShowModalAddMoney = (i) => {
    account = i;
    this.setState({
      isOpenModalAdd: true,
    });
  };
  render() {
    let {
      key,
      listUser,
      isLoading,
      isOpenModal,
      redirect,
      isOpenModalEdit,
      type,
      isOpenModalAdd,
    } = this.state;
    if (redirect) {
      return <Redirect to="/503page" />;
    }
    if (!isLoading) {
      return <Loading />;
    }
    if (redirect) {
      localStorage.removeItem("token");
      return <Redirect to="/login" />;
    }
    if (type) {
      switch (type) {
        case "1":
          if (key) {
            listUser = listUser.filter((user) => {
              return user.Account.id.indexOf(key) !== -1;
            });
          }
          break;
        case "2":
          if (key) {
            listUser = listUser.filter((user) => {
              return (
                user.Account.username
                  .toLowerCase()
                  .indexOf(key.toLowerCase()) !== -1
              );
            });
          }
      }
    }
    let temp = [];
    let list = listUser.map((i, index) => {
      if (temp.indexOf(i.Account.id) > -1) {
        return;
      } else {
        temp.push(i.Account.id);
      }
      let defaultAcc = null;
      let spendAcc = null;

      listUser.forEach((item) => {
        if (item.Account.id === i.Account.id) {
          if (item.ServiceType.id === 0) {
            defaultAcc = item;
          } else {
            spendAcc = item;
          }
        }
      });
      return (
        <tr key={index}>
          <td>{i.Account.id}</td>
          <td>{i.Account.username}</td>
          <td>
            <button
              style={{ marginRight: 10 }}
              onClick={() => this.onShowModal(defaultAcc)}
              onCloseModal={this.onCloseModal}
              className="btn btn-primary"
            >
              detail
            </button>
            <button
              style={{ marginRight: 10 }}
              onClick={() => this.onShowModalAddMoney(defaultAcc)}
              onCloseModal={this.onCloseModal}
              className="btn btn-primary"
            >
              Add Money
            </button>
          </td>
          <td>
            <button
              disabled={spendAcc ? false : true}
              style={{ marginRight: 10 }}
              onClick={() => this.onShowModal(spendAcc)}
              onCloseModal={this.onCloseModal}
              className="btn btn-primary"
            >
              detail
            </button>
          </td>

          <td>
            <div>
              <button
                style={{ marginRight: 10 }}
                onClick={() => this.onShowModalEdit(i)}
                className="btn btn-primary"
              >
                ADD
              </button>

              <button
                onClick={() => this.onLock(i.Account.id)}
                className="btn btn-danger"
              >
                {i.Account.isBlocked ? <FaLock /> : <FaLockOpen />}
              </button>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <div
        style={{
          marginTop: 100,
          height: "auto",
          minHeight: "100%",
        }}
      >
        <div className="panel-heading">
          <h3>LIST USER</h3>
        </div>
        <div className="find" style={{ float: "left", marginLeft: 10 }}>
          <label style={{ paddingRight: 10 }}>Search</label>

          <input type="text" name="key" value={key} onChange={this.onChange} />
          <select
            style={{ marginLeft: 10 }}
            name="type"
            onChange={this.onChangeType}
          >
            <option value={1}>By ID</option>
            <option value={2}>By Name</option>
          </select>
        </div>
        <div class="panel panel-default">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Account Default</th>
                <th>Saving Account</th>
                <th>Handle</th>
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </table>
        </div>
        {isOpenModal ? (
          <Account Account={account} onCloseModal={this.onCloseModal} />
        ) : (
          ""
        )}
        {isOpenModalEdit ? (
          <AccountEdit
            Account={account}
            onCloseModalEdit={this.onCloseModalEdit}
          />
        ) : (
          ""
        )}
        {isOpenModalAdd ? (
          <AddMoney Account={account} onCloseModal={this.onCloseModal} />
        ) : (
          ""
        )}
      </div>
    );
  }
}
