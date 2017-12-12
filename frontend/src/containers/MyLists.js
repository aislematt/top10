import React, {Component} from 'react';
import axios from 'axios'
import Spinner from "../components/UI/Spinner/Spinner";
import ListCard from "../components/ListCard/ListCard";
import ListCards from "../components/ListCards/ListCards";

class MyLists extends Component {
    state = {
        lists: null
    };

    componentDidMount = () => {
        axios.get('/myLists').then(response => {
            console.log(response);
            this.setState({lists: response.data.lists})
        }).catch(error => {
            this.setState({error: true})
        })
    };

    render() {
        let displayLists = <Spinner/>;
        if (this.state.lists !== null) {
            displayLists = <ListCards lists={this.state.lists}/>
        }
        return displayLists;
    }
}
export default MyLists;