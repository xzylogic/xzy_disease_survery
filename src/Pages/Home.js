import React from 'react'
import { connect } from 'react-redux'

import HomeComponent from '../Components/Home/HomeComponent'

class Index extends React.Component {

  render() {
    return <HomeComponent />
  }
}

export default connect(state => state)(Index)
