import React, {Component} from 'react';
import axios from 'axios'
import Spinner from "../../components/UI/Spinner/Spinner";
import {connect} from "react-redux";
import ListCards from "../../components/ListCards/ListCards";

class FeaturedLists extends Component {
    state = {
        lists:null
    };


    componentDidMount = () => {
        axios.get('/featuredLists').then(response => {
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

const mapStateToProps = state => {
    return {
        userId: state.auth.userId
    };
};


export default connect(mapStateToProps)(FeaturedLists);



