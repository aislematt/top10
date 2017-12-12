import React, {Component} from 'react';
import axios from 'axios'
import Spinner from "../components/UI/Spinner/Spinner";
import List from "../components/List/List";
import {connect} from "react-redux";
import Button from "../components/UI/Button/Button";

class SingleList extends Component {
    state = {
        list: null
    };

    editButtonHandler = () => {
        this.props.history.replace('/editList/' + this.state.list.id);
    };

    componentDidMount = () => {
        axios.get('/list/' + this.props.match.params.id).then(response => {
            this.setState({list: response.data.list})
        }).catch(error => {
            this.setState({error: true})
        })
    };

    render() {
        let displayLists = <Spinner/>;
        if (this.state.list !== null) {
            const list = <List list={this.state.list}/>;
            let editButton = null;
            if (this.state.list.user_id === this.props.userId) {
                editButton = <Button btnType="Success" clicked={this.editButtonHandler}>EDIT</Button>
            }
            displayLists = (
                <div>
                    {list}
                    {editButton}
                </div>
            )

        }
        return displayLists;
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId
    };
};


export default connect(mapStateToProps)(SingleList);



