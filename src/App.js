import React, { Component } from 'react'
import moment from "moment"
import "./App.less";
import {Table,Modal,Button,Space,Input,message} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {nanoid} from "nanoid";
import AddOrEidtTodo from './components/AddOrEidtTodo';
const { Search } = Input;

export default class App extends Component {

  formRef = React.createRef();
  
  state = {
    isLoadWindow:false,
    temp:null,
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
            <a className="editTodo" onClick={()=>this.openWindow(record)}>编辑</a>
            <a className="delete" onClick={()=>this.delConfirm(record.id)}>删除</a>
          </Space>
        ),
      },
    ],
    delKeys:[],
    isModalVisible:false,
    showItems:null
  }
  //打开操作窗口
  openWindow = (values) => {
    if(values.id === undefined){
      console.log("执行添加");
      this.setState({isModalVisible:true,isLoadWindow:true})
    }else{
      console.log("执行编辑");
      this.setState({temp: this.formatFormValues(values),isLoadWindow:true})
      this.setState({isModalVisible:true})
    }
  }
  //添加和编辑操作
  addOrEditTodo = async () => {
    if(this.state.temp === null){
      console.log("添加新待办");
      const values = await this.formRef.current.validateFields();
      const hide = message.loading("正在加载...")
      //模拟数据加载
      setTimeout(()=>{
        hide();
        const newTodo = {
          id:nanoid(),
          name:values.name,
          content:values.content,
          deadline:moment(values.deadline).format("YYYY-MM-DD HH:mm:ss"),
          turnoverTime:moment().format("YYYY-MM-DD HH:mm:ss")
        }
          console.log(newTodo);
          this.setState({items:[...this.state.items,newTodo]})
          this.setState({isModalVisible:false});
          this.updateToLocalStorage();
      },2000);
    }else{
      console.log("编辑待办");
      const values = await this.formRef.current.validateFields();
      const todo = this.state.items
      const newTodo = {id:this.state.temp.id,
        name:values.name,
        content:values.content,
        deadline:moment(values.deadline).format("YYYY-MM-DD HH:mm:ss"),
        turnoverTime:moment().format("YYYY-MM-DD HH:mm:ss")
      }
      const hide = message.loading("正在加载...")
      //模拟数据加载
      setTimeout(()=>{
        hide();
        const newItems =todo.map((val,i,arr) => {
          return val.id === newTodo.id ? arr[i] = newTodo: val
        })
        this.setState({items:newItems})
        this.closeWindow();
        this.updateToLocalStorage();
      },2000)
    }
  }
  //关闭操作窗口
  closeWindow = () => {
    this.setState({temp:null})
    this.setState({isLoadWindow:false})
    this.setState({isModalVisible:false})
  }
  //格式化日期格式化
  formatFormValues = (values) => {
    values.deadline = moment(values.deadline);
    return values;
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
        const hide = message.loading("正在加载...")
        setTimeout(()=>{
          hide();
          this.setState({delKeys:[id]})
          this.deleteTodos();
        },2000)
      },
      onCancel() {
        console.log("取消");
      },
    })
  }
  //删除批量删除提示框
  delAllconfirm = () => {
    Modal.confirm({
      title: '确认要删除这些待办吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后待办不可恢复，请谨慎操作！',
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        const hide = message.loading("正在加载...")
        setTimeout(()=>{
          hide();
          this.deleteTodos()
       },2000)
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
    this.updateToLocalStorage();
  }
  //搜索
  search = (keyword) => {
    console.log(keyword);
    let NewShowItems = this.state.items.filter((val,i,arr) => {
      let str = val.name;
      return str.search(keyword.trim())!== -1? val:null;
    })
    console.log(NewShowItems);
    this.setState({showItems:NewShowItems})
  }
  //边输入边搜索
  keywordChange = (e) => {
    if(e.target.value.trim() !== ''){
      this.search(e.target.value.trim())
    }else{
      this.setState({showItems:null})
    }
    console.log(e.target.value);
  }
  //更新数据到localStorage
  updateToLocalStorage = () => {
    //存入localStorage
    var tempItems = JSON.stringify(this.state.items)
    window.localStorage.setItem("itmes",tempItems)
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
  }
  componentDidMount(){
    //从localStorage中取出
    var tempItems =JSON.parse(window.localStorage.getItem("itmes"));
    this.setState({items:tempItems})
  }

  render() {
    
    const {items,columns,isModalVisible,temp,isLoadWindow,showItems} = this.state
    return (
      <div style = {{width:"800px",border:"1px blue solid"}}>
        <Space size = "small">
            <Button  type="primary" onClick={this.openWindow}>添加待办</Button>
            <Button onClick={this.delAllconfirm} >批量删除</Button>
            <Search className="search_header" size = "middle" onChange = {this.keywordChange} placeholder="input search text" onSearch={this.search} enterButton />
        </Space>
         <Table rowSelection={this.rowSelection} columns={columns} dataSource={showItems?showItems:items} rowKey={items => items.id}>
         </Table>

        {!isLoadWindow ? null : 
        <AddOrEidtTodo todoAction={{temp,isModalVisible,addOrEditTodo:this.addOrEditTodo,closeWindow:this.closeWindow,formRef:this.formRef}} />
        }
      </div>
    )
  }
}
