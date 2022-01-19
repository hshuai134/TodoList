import React, { Component } from 'react'
import {Form, Input, Button} from 'antd'
import "./index.less"
import moment from "moment"
import {nanoid} from "nanoid";

export default class index extends Component {
    state = {
        id:this.props.todoTemp.id,
        name:"",
        content:"",
        deadline:"",
        turnoverTime:"",
    }
    closeWindow = ()=>{
        this.props.closeWindow()
    }
    getContent = (event)=>{
       var data = event.target.value;
       this.setState({content:data})
    }
    getitemName = (event)=>{
        var data = event.target.value;
        this.setState({name:data})
     }
    getdeadline = (event)=>{
        var data = event.target.value;
        this.setState({deadline:data})
     }
    onFinish = () => {
        if(this.state.name.trim() === ""){
            window.alert("名称不能为空")
        }else if(this.state.content.trim() === ""){
            window.alert("内容不能为空")
        }else if(this.state.deadline.trim() === ""){
            window.alert("请选择截止时间")
        }else{
            this.setState({turnoverTime:moment().format("YYYY-MM-DD HH:mm:ss")});
            this.setState({id:nanoid()});
            this.props.updateTodo(this.state);
        }
        // this.closeWindow()
    }
    
    render() {
        const {name,content,deadline} = this.props.todoTemp
        console.log(name,content,deadline);
        return (
            <div className= "addTodo" style = {{display:this.props.show?"none":"block"}}>
                <div className = "header">
                    <span className="title" >编辑待办</span>
                    <span onClick={this.closeWindow} className="close">X</span>
                </div>
                <Form onFinish = {this.onFinish} className = "addTodoFrom">
                    <Form.Item label="名称" rules={[{ required: true }]}>
                        <Input onChange={this.getitemName} defaultValue={name} ></Input>
                    </Form.Item>
                    <Form.Item label="内容" rules={[{ required: true }]}>
                        <Input onChange={this.getContent} defaultValue={content} ></Input>
                    </Form.Item>
                    <Form.Item label="截止时间">
                        <input type="date" placeholder="选择时间" onChange={this.getdeadline}></input>
                    </Form.Item>
                    <Form.Item className='btn'>
                        <Button onClick={this.closeWindow}>取消</Button>
                        <Button  type="primary" htmlType="submit">确认</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
