import React, { Component } from 'react'
import {Table, Button,Space} from 'antd';
import AddTodo from "./components/AddTodo"
const { Column, ColumnGroup } = Table;

export default class App extends Component {
  
  state = {
    items :[],
    columns : [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '内容',
        dataIndex: 'content',
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
      },
      {
        title: '最后修改时间',
        dataIndex: 'turnoverTime',
      },
      {
        title: '操作',
        render: () => (
          <Space size="middle">
            <a>编辑</a>
            <a>删除</a>
          </Space>
        ),
      },
    ],
  }
  addTodo(){
    console.log(1);
  }
  componentDidMount(){
    //存入localStorage
    // var tempItems = JSON.stringify(this.state.items)
    // window.localStorage.setItem("itmes",tempItems)
    
    //从localStorage中取出

    var tempItems =JSON.parse(window.localStorage.getItem("itmes"));
    this.setState({items:tempItems})
  }
  render() {
    const {items,columns} = this.state
    return (
      <div>
        <Button onClick={this.addTodo} type="primary">添加代办</Button>
        <Button>批量删除</Button>
         <Table rowSelection columns={columns} dataSource={items}  rowKey={items => items.id}>
          <Space size="middle">
              <a>Invite</a>
              <a>Delete</a>
          </Space>
         </Table>
         <AddTodo></AddTodo>
      </div>
    )
  }
}
