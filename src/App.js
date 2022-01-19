import React, { Component } from 'react'
import {Table,Modal, Button,Space} from 'antd';
import AddTodo from "./components/AddTodo"
import EditTodo from "./components/EditTodo"
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default class App extends Component {
  
  state = {
    temp:{
      content:'',
      deadline:'',
      id:'',
      name:''
    },
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
      // {
      //   title: 'id',
      //   dataIndex: 'id',
      //   // colSpan:0,
      // },
      {
        title: '操作',
        render: (text,record) => (
          // this.setState()
          <Space size="middle">
            <span className="editTodo" onClick={()=>this.openWindow2(record)}>编辑</span>
            <span className="delete" onClick={()=>this.delConfirm(record.id)}>删除</span>
          </Space>
        ),
      },
    ],
    show1 : true,
    show2 : true,
    delKeys:[]
  }
  //打开添加窗口
  openWindow1 = () => {
    this.setState({show1:false})
  }
  //打开编辑窗口自
  openWindow2 = (record) => {
    console.log(record.id)
    this.setState({temp:record})
    this.setState({show2:false})
  }
  //关闭添加窗口
  closeWindow1 = () => {
    this.setState({show1:true})
  }
  //关闭编辑窗口
  closeWindow2 = () => {
    this.setState({show2:true})
  }
  //添加待办
  addTodo = (item) => {
    this.setState({items:[...this.state.items,item]});
    this.closeWindow1();
  }
  //编辑待办
  updateTodo = (item) => {
    var newData = this.state.items.map((value,i,arr)=>{
      if(value["id"] === this.state.temp.id){
        console.log(value["id"],this.state.temp.id);
        value = item;
      }
      return value
    })
    this.setState({items:newData})
    this.closeWindow2();
  }
  //删除提示框
  delConfirm = (id) => {
    Modal.confirm({
      title: '确认要删除这条待办吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后待办不可恢复，请谨慎操作！',
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
       this.deleteTodo(id)
      },
      onCancel() {
        console.log("取消");
      },
  })
  }
  //删除单个待办
  deleteTodo = (id) => {
    var newData = this.state.items.filter((value,i,arr)=>{
      return value.id !== id;
    })
    // console.log(newData);
    this.setState({items:newData})
  }
  //删除批量删除提示框
  delAllconfirm = (ids) => {
    Modal.confirm({
      title: '确认要删除这些待办吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后待办不可恢复，请谨慎操作！',
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
       this.deleteTodos(ids)
      },
      onCancel() {
        console.log("取消");
      },
  })
  }
  deleteTodos = () => {
    var newData = this.state.items.filter((value,i,arr)=>{
      return !this.state.delKeys.includes(value.id);  
    })
    this.setState({items:newData});
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // var temp = this.state.delKeys
      this.setState({delKeys:`${selectedRowKeys}`===""?[]:`${selectedRowKeys}`.split(',')});
      console.log(this.state.delKeys);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  componentDidMount(){
    //从localStorage中取出
    var tempItems =JSON.parse(window.localStorage.getItem("itmes"));
    this.setState({items:tempItems})
  }
  componentDidUpdate(){
    //存入localStorage
    var tempItems = JSON.stringify(this.state.items)
    window.localStorage.setItem("itmes",tempItems)
  }
  render() {
    const {items,columns,show1,show2,temp} = this.state
    return (
      <div style = {{width:"800px",border:"1px blue solid"}}>
        <Button  type="primary" onClick={this.openWindow1}>添加代办</Button>
        <Button onClick={this.delAllconfirm} >批量删除</Button>
         <Table rowSelection={this.rowSelection} columns={columns} dataSource={items} rowKey={items => items.id}>
         </Table>
         <AddTodo  show = {show1} closeWindow = {this.closeWindow1} addTodo={this.addTodo} ></AddTodo>
         <EditTodo  show = {show2} todoTemp={temp} closeWindow = {this.closeWindow2} updateTodo={this.updateTodo}></EditTodo>
      </div>
    )
  }
}
