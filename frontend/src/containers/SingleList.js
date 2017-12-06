import React, {Component} from 'react';
import axios from 'axios'
import Spinner from "../components/UI/Spinner/Spinner";
import List from "../components/List/List";

class SingleList extends Component {
    state = {
        list: null
    }

    componentDidMount = () => {
        axios.get('/list/1').then(response => {
            console.log(response);
            this.setState({list: response.data.list})
        }).catch(error => {
            this.setState({error: true})
        })
    };

    render() {
        let displayLists = <Spinner></Spinner>
        if (this.state.list !== null) {
            return <List list={this.state.list}></List>
        }
        return displayLists;
    }
}
export default SingleList;