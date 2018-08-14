import { put, takeLatest, call, select } from 'redux-saga/effects';
import * as axios from 'axios';

import { 
  actionTypes, updateQuestionsAction, 
  updateInputValueAction, appendInputValueAction, 
  surveyUpdateLocalAction, updateUserInfo, 
  updateCurrentPageAction
} from '../actions/global.action'

const PATH = {
  getQuestions: `${process.env.PUBLIC_URL}/static/questions.json`,
  saveSurvey: '/pci-micro/api/ruijin/save',
  getUserInfo: '/pci-micro/api/ruijin/userInfo',

}

function* saveCurrentPage(actions) {
  yield call([localStorage, 'setItem'], 'currentPage', actions.data)
  yield put(updateCurrentPageAction(actions.data))
}

function* getCurrentPage() {
  const page = yield call([localStorage, 'getItem'], 'currentPage')
  yield put(updateCurrentPageAction(page || 0))
}

const getQuestionsService = async () => {
  const service = await axios.get(`${PATH.getQuestions}`);
  const data = await service.data;
  return data;
}

function* loadQuestions() {
  try {
    const data = yield call(getQuestionsService);
    if (data) {
      yield put(updateQuestionsAction(data));
    }
  } catch (error) {
    throw new Error(error);
  }
}

const getUserInfoData = async (agent, id) => {
  const datas = await axios.get(`${PATH.getUserInfo}?${agent === 'app' ? 'userId' : 'openId'}=${id}`)
  const data = await datas.data
  return data
}

function* loadUserInfo(actions) {
  try {
    if (actions.agent && actions.id) {
      const data = yield call(getUserInfoData, actions.agent, actions.id)
      if (data.code===0 && data.data ) {
        yield put(updateUserInfo(data.data))
        data.data.name && (yield put(updateInputValueAction('name', data.data.name)))
        data.data.sex && (yield put(updateInputValueAction('sex', data.data.sex)))
        data.data.birthday && (yield put(updateInputValueAction('birthday', data.data.birthday)))
      }
    } else if (actions.agent === 'wechat' && !actions.id && actions.code) {
      console.log( actions.code)
      // window.location.href = 'http://www.baidu.com'
    } else if (actions.agent === 'wechat' && !actions.id && !actions.code) {
      throw new Error('no openid')
      // window.location.href = 'http://www.baidu.com'
    } else if (actions.agent === 'app' && !actions.id) {
      throw new Error('no userid')
      // window.location.href = 'http://www.baidu.com'
    } 
  } catch (error) {
    throw new Error(error)
  }
}

function* surveyStoreLocal(actions) {
  if (actions.option === 'update') {
    yield put(updateInputValueAction(actions.key, actions.value))
  } else if (actions.option === 'append') {
    yield put(appendInputValueAction(actions.key, actions.value, actions.id))
  }
  const { inputValue } = yield select(state => state.globalReducer)
  yield call([localStorage, 'setItem'], 'inputValue', JSON.stringify(inputValue))
}

function* surveyGetLocal() {
  const inputValue = yield call([localStorage, 'getItem'], 'inputValue')
  if (inputValue && typeof JSON.parse(inputValue) === 'object') {
    yield put(surveyUpdateLocalAction(JSON.parse(inputValue)))
  }
}

function* saveSurvey(actions) {
  try {
    const res = yield call([axios, 'post'], PATH.saveSurvey, actions.data)
    if (res) { 
      console.log(res)
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const globalSaga = [
  takeLatest(actionTypes.SAVE_CURRENT_PAGE, saveCurrentPage),
  takeLatest(actionTypes.GET_CURRENT_PAGE, getCurrentPage),
  takeLatest(actionTypes.LOAD_QUESTIONS, loadQuestions),
  takeLatest(actionTypes.SURVEY_STORE_LOCAL, surveyStoreLocal),
  takeLatest(actionTypes.SURVER_GET_LOCAL, surveyGetLocal),
  takeLatest(actionTypes.SAVE_SURVEY, saveSurvey),
  takeLatest(actionTypes.GET_USER_INFO, loadUserInfo),
];
