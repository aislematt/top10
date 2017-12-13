import React from 'react'

import {Link, withRouter} from 'react-router-dom'

class NavItem extends React.Component {
    render () {
        return (
            <li className={this.props.link === this.props.location.pathname ? 'active' : ''}>
                <Link to={this.props.link}
                       exact={this.props.exact}>{this.props.children}</Link>
            </li>
        )
    }
}


export default withRouter(NavItem);