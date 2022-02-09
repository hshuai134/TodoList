import React, { Component } from 'react';
import {Modal,Form,Input,DatePicker} from "antd"
export default class AddOrEidtTodo extends Component {
  
  render() {
    //   console.log(this.props);
      const {temp,isModalVisible,formRef} = this.props.todoAction
    return (
        <Modal title={temp === null?"添加待办":"修改待办"} visible={isModalVisible} onOk={this.props.todoAction.addOrEditTodo()} onCancel={this.props.todoAction.closeWindow} >
            <Form ref={formRef} initialValues={temp} className = "addTodoFrom">
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
    );
  }
}
