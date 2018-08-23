import React from 'react';
import './Query.css';
import { Progress } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { DatePicker, List } from 'antd-mobile';

class Query extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputValue: [],
      checked: false,
      date: null,
      operateTime: null,
    }
    this.inputHandler = this.inputHandler.bind(this);
  }
  componentDidMount(){
    this.dataHandler();
  }
  //存储数据
  inputHandler = (e) => {
    let inputValue = e.target.value;
    if(this.props.id === 7){
      let inputCheckbox = document.getElementsByTagName("input");
      let check_val = [];
      for(let k in inputCheckbox){
        if(inputCheckbox[k].checked) {
          check_val.push(inputCheckbox[k].name);
        }
      }
      localStorage.setItem('inputValue' + [this.props.id], check_val);
    }else{
      localStorage.setItem('inputValue' + [this.props.id], inputValue);
    }
    //存储分数name
    let inputVal = document.getElementsByTagName("input");
    if(this.props.id>=10 && this.props.id<=54){
      for(let i=0;i<inputVal.length;i++){
        if(inputVal[i].checked){
          let score = Number(inputVal[i].name);
          localStorage.setItem((this.props.id-9), score);
        }
      }
    }
    if(this.props.id === 55){
      localStorage.setItem('46',localStorage.getItem('inputValue55'));
    }
  }
  //发送数据
  sendHandler = () => {
    let questionData = this.props.query;
    let saq = [],sf_12 = [],phq_9 = [],eq_5d = [];
      for (let i = 0; i < questionData.length; i++) {
        let Datatype = questionData[i].category;
        let id = String(questionData[i].id) || null;
        let getVal = localStorage.getItem(id);
        if(Datatype === "SAQ"){
          saq.push({'id':id,'score':Number(getVal)})
            // saq[id]=getVal;
        }
        if(Datatype === "SF-12"){
          sf_12.push({'id':id,'score':Number(getVal)})
        }
        if(Datatype === "PHQ-9"){
          phq_9.push({'id':id,'score':Number(getVal)})
        }
        if(Datatype === "EQ-5D"){
            eq_5d.push({'id':id,'score':Number(getVal)})
        }
      }
    let deg = localStorage.getItem('inputValue7').split(',');
    let obj = {
      name:localStorage.getItem('inputValue0'),
      sex :localStorage.getItem('inputValue1'),
      birthday:localStorage.getItem('inputValue2'),
      height:localStorage.getItem('inputValue3'),
      weight :localStorage.getItem('inputValue4'),
      education:localStorage.getItem('inputValue5'),
      marriage:localStorage.getItem('inputValue6'),
      degree:deg,
      date:localStorage.getItem('inputValue8'),
      hospital:localStorage.getItem('inputValue9'),

      eq :eq_5d,
      phq :phq_9,
      saq :saq,
      sf :sf_12,

      // openId :'111',
      userId :'2438',
    };
    console.log(obj);

    const url='http://10.2.10.10/pci-micro/api/ruijin/save';
    fetch(url, {
      method: 'POST',
      mode: "cors",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json =>{
      console.log(json)
    }).catch(function (e) {
      console.log(e);
    });
  };
  //获取数据
  dataHandler = () => {
    let dateExtra = document.getElementsByClassName("am-list-extra")[0];
    let getValue = localStorage.getItem('inputValue'+[this.props.id]);
    if(this.props.id === 2 && localStorage.getItem('inputValue2') && dateExtra){
      dateExtra.innerHTML = localStorage.getItem('inputValue2');
    }
    if(this.props.id === 8 && localStorage.getItem('inputValue8') && dateExtra){
      dateExtra.innerHTML = localStorage.getItem('inputValue8');
    }
    let inputVal = document.getElementsByTagName("input");
    let labelBF = document.getElementsByTagName("label");
    for(let i=0;i<inputVal.length;i++){
      inputVal[i].checked=false;
      if(labelBF.length>1){
        labelBF[i].className = null;
      }
      //判断复选和单选之前是否已选
      // console.log(inputVal[i].value +"==="+ getValue)
      if(inputVal[i].value === getValue){
        inputVal[i].checked = true;
        labelBF[i].className = 'label';
      }else if(this.props.id === 7 && getValue){
        let length=getValue.split(",").length;
        for(let m=0;m<length;m++){
          let val=getValue.split(",")[m];
          if(inputVal[i].value === val){
            inputVal[i].checked = true;
          }
        }
      }else if(this.props.id === 0 || this.props.id === 2 || this.props.id === 3 ||
          this.props.id === 4 || this.props.id === 7 || this.props.id === 8 ||
          this.props.id === 9 || this.props.id === 55  ){
        inputVal[i].value = getValue;
      }
    }
  };
  componentDidUpdate(){
    if(this.props.id===2 && this.state.date){
      localStorage.setItem('inputValue2',this.state.date.toISOString().slice(0,10));
    }
    if(this.props.id===8 && this.state.operateTime){
      localStorage.setItem('inputValue8',this.state.operateTime.toISOString().slice(0,10));
    }
    this.dataHandler();
  }
  render() {
    let id = this.props.id;//获取当前url参数
    let length = this.props.query.length;
    let index = id;//点击上一题进行判断的参数
    index = index -1;//上一题
    id = id+1;//下一题
    let query_title=null,
        query_content=null,
        query_percent = (
            <div className="progress-container" style={{marginTop:'0.36rem',height:'0.36rem'}}>
              <Progress percent={this.props.percent} position="normal" style={{borderRadius:'1rem'}}/>
            </div>
        ),
        query_button = null;//页面显示的内容

    if(index<=0){
      index = 0;
    }

    if(id < (length+1)){
      query_title = <p className="title_header">{this.props.query[id-1].title}</p>;
    }

    if(id === 1 || id ===10){
      query_content = <input type="text" className="inputText" onChange={this.inputHandler}/>
    }else if(id === 2){
      query_content = (
        <div onClick={this.inputHandler}>
          <div className="female">
            <Link to={`/querys/${id}`}>
              <input type="radio" id="female" name="sex" value="女"/>
              <label htmlFor="female">女</label>
            </Link>
          </div>
          <div className="male">
            <Link to={`/querys/${id}`}>
              <input type="radio" id="male" name="sex" value="男"/>
              <label htmlFor="male">男</label>
            </Link>
          </div>
        </div>
      )
    }else if(id === 3){
      query_content = (
          <div>
            <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
              <DatePicker
                  mode="date"
                  title=" "
                  extra=" "
                  value={this.state.date}
                  // onChange={async(date) => {console.log(date);await this.setState({date: date});await console.log(this.state.date)}}
                  onChange={date => this.setState({ date })}
              >
                <List.Item arrow="horizontal"></List.Item>
              </DatePicker>
            </List>
          </div>
      )
    }else if(id === 9){
      query_content = (
          <div>
            <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
              <DatePicker
                  mode="date"
                  title=" "
                  extra=" "
                  value={this.state.operateTime}
                  // onChange={async(date) => {console.log(date);await this.setState({date: date});await console.log(this.state.date)}}
                  onChange={operateTime => this.setState({ operateTime })}
              >
                <List.Item arrow="horizontal"></List.Item>
              </DatePicker>
            </List>
          </div>
      )
    }else if(id === 4){
      query_content = (
          <div>
            <input type="text" onChange={this.inputHandler}/><span className="basic">厘米</span>
          </div>
      )
    }else if(id === 5){
      query_content = (
          <div>
            <input type="text" onChange={this.inputHandler}/><span className="basic">kg</span>
          </div>
      )
    }else if(id === 56){
      query_content = (
          <div>
            <input type="text" onChange={this.inputHandler}/><span className="basic">分</span>
          </div>
      )
    }else if(id === 8){
      query_content = (
          <div>
            {
              this.props.query[id-1].option.map((option,index) => {
                if(option.degree === "" || option.degree === null){
                  return null;
                }else{
                  return (
                      <div key={index} onClick={this.inputHandler} className="select">
                          <input type="checkbox" id={'selectCheckBox'+index} value={option.degree} name={option.degree}/>
                          <label htmlFor={'selectCheckBox'+index}>{option.degree}</label>
                      </div>
                  )
                }
              })
            }
          </div>
      )
    }else if(id === (length+1)){
      return query_content = (
          <div className="title">
            {query_percent}
            <div className="query_end">
              <img src="" alt="调查完成"/>
              <p>调查已完成，感谢你的参与。</p>
              <Link to={`/querys/${id}`} className="blue_btn whiteColor" onClick={this.sendHandler.bind(this)}>确定</Link>
            </div>
          </div>

      );
    }else if(id >= (length+2)){
      return query_content = (
          <div className="title">
            {query_percent}
            <div className="query_end">
              <img src="" alt="是否实名"/>
              <p>调查已完成，你尚未实名， 实名后可查阅全部病史</p>
              <button className="blue_btn whiteColor">立即实名</button>
              <br/><br/>
              <button className="white_btn blueColor">暂不实名</button>
            </div>
          </div>

      );
    }else{
      query_content = (
        <div>
          {
            this.props.query[id-1].option.map((option,index) => {
              if(option.degree === "" || option.degree === null){
                return null;
              }else{
                return (
                    <div key={index} className="select" onClick={this.inputHandler}>
                      <Link to={`/querys/${id}`}>
                        <input type="radio" id={'selectRadio'+index} value={option.degree} name={option.score}/>
                        <label htmlFor={'selectRadio'+index}>{option.degree}</label>
                      </Link>
                    </div>
                )
              }
            })
          }
        </div>
      )
    }

    // 上一题下一题判断
    const btn = {
      width:'100%',
      bottom:'0.52rem',
      display:'flex',
      justifyContent:'center',
      position:'absolute'
    };
    if(id === 1){
      query_button = (
          <ul style={btn}>
            <li className="blue_btn" style={{width:'92%',height:'6.6%'}}>
              <Link to={`/querys/${id}`} className="whiteColor">下一题</Link>
            </li>
          </ul>
      )
    }else if(id === 3 || id ===4 || id === 5 || id === 8 || id === 9 || id === 10 || id === 56){
      query_button = (
          <ul style={btn}>
            <li className="white_btn" style={{width:'40%',height:'6.6%'}}>
              <Link to={`/querys/${index}`} className="blueColor">上一题</Link>
            </li>
            <li className="blue_btn" style={{width:'40%',height:'6.6%'}}>
              <Link to={`/querys/${id}`} className="whiteColor">下一题</Link>
            </li>
          </ul>
      )
    }else{
      query_button = (
          <ul style={btn}>
            <li className="white_btn" style={{width:'92%',height:'6.6%'}}>
              <Link to={`/querys/${index}`} className="blueColor">上一题</Link>
            </li>
          </ul>
      )
    }
    return (
        <div>
          <div className="title">
            {query_percent}
            {query_title}
            {query_content}
          </div>
            {query_button}
        </div>
    )
  }
}

export default Query;
