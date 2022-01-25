import React, { Component } from 'react'
import moment from "moment"
import "./App.less";
import {Table,Modal,Button,Space,Form,Input,DatePicker,message} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {nanoid} from "nanoid";
const { Search } = Input;

export default class App extends Component {

  formRef = React.createRef();
  
  state = {
    isOpenEdit:false,
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
            <a className="editTodo" onClick={()=>this.openEditWindow(record)}>编辑</a>
            <a className="delete" onClick={()=>this.delConfirm(record.id)}>删除</a>
          </Space>
        ),
      },
    ],
    delKeys:[],
    isAddModalVisible:false,
    isEditModalVisible:false,
    showItems:null
  }
  openWindow = (type,values) => {
    if(values){
      console.log("我是添加");
    }else{
      console.log("我是编辑");
    }
  }
  //打开添加窗口
  openAddWindow = () => {
    this.setState({isAddModalVisible:true})
  }
  //打开编辑窗口
  openEditWindow = (value) => {
    this.setState({temp: this.formatFormValues(value),isOpenEdit:true})
    this.setState({isEditModalVisible:true})
  }
  formatFormValues = (values) => {
    values.deadline = moment(values.deadline);
    return values;
  };
  // 关闭添加窗口
  closeAddWindow = () => {
    this.setState({isAddModalVisible:false})
  }
  //关闭编辑窗口
  closeEditWindow = () => {
    this.setState({isOpenEdit:false})
    this.setState({isEditModalVisible:false})
  }
  //添加待办
  addTodo = async () => {
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
      this.setState({isAddModalVisible:false})
    },2000);
    
  }
  //编辑待办
  updateTodo = async () => {
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
      this.closeEditWindow();
    },2000)
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
          this.deleteTodo(id);
       },2000)
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
        const hide = message.loading("正在加载...")
        setTimeout(()=>{
          hide();
          this.deleteTodos(ids)
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
  }
  //搜索
  searchTodo = (e) => {
    console.log(e);
    this.search(e.trim())
  }
  search = (keyword) => {
    let NewShowItems = this.state.items.filter((val,i,arr) => {
      let str = val.name;
      return str.search(keyword)!== -1? val:null;
    })
    console.log(NewShowItems);
    this.setState({showItems:NewShowItems})
  }
  keywordChange = (e) => {
    if(e.target.value.trim() !== ''){
      this.search(e.target.value.trim())
    }else{
      this.setState({showItems:null})
    }
    console.log(e.target.value);
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
    
    const {items,columns,isAddModalVisible,isEditModalVisible,temp,isOpenEdit,showItems} = this.state
    return (
      <div style = {{width:"800px"}}>
        <Space size = "small">
            <Button  type="primary" onClick={this.openAddWindow}>添加待办</Button>
            <Button onClick={this.delAllconfirm} >批量删除</Button>
            <Search className="search_header" size = "middle" onChange = {this.keywordChange} placeholder="input search text" onSearch={this.searchTodo} enterButton />
        </Space>
         <Table rowSelection={this.rowSelection} columns={columns} dataSource={showItems?showItems:items} rowKey={items => items.id}>
         </Table>

        <Modal title="添加待办" visible={isAddModalVisible}  onOk={this.addTodo} onCancel={this.closeAddWindow} >
          <Form ref={this.formRef} className = "addTodoFrom">
              <Form.Item name='name' label="名称" rules={[{ required: true }]}>
                  <Input/>
              </Form.Item>
              <Form.Item name='content' label="内容" rules={[{ required: true }]}>
                  <Input/>
              </Form.Item>
              <Form.Item name='deadline' label="截止时间">
              <DatePicker showTime />
              </Form.Item>
          </Form>
        </Modal>
        {!isOpenEdit ? null : 
        <Modal title="修改待办" visible={isEditModalVisible} onOk={this.updateTodo} onCancel={this.closeEditWindow} >
            <Form ref={this.formRef} initialValues={temp}  form={this.form} className = "addTodoFrom">
                <Form.Item name='name' label="名称" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item  name='content' label="内容" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item name='deadline' label="截止时间">
                    <DatePicker showTime />
                    {/* <DatePicker defaultValue = {moment(temp.deadline)} showTime /> */}
                </Form.Item>
            </Form>
          </Modal>
        }
      </div>
    )
  }
}
