import React, {Component} from 'react';
import axios from 'axios';
import ListCard from '../../components/ListCard/ListCard'
import Spinner from '../../components/UI/Spinner/Spinner'

class UserProfile extends Component {

    state = {
        lists: null
    };

    componentDidMount = () => {
        axios.get('/lists/' + this.props.match.params.id).then(response => {
            this.setState({lists: response.data.lists})
        }).catch(error => {
            this.setState({error: true})
        })
    };

    render() {
        let displayLists = <Spinner/>;
        if (this.state.lists !== null) {
            displayLists = this.state.lists.map(aList => {
                return <ListCard key={aList.id} list={aList}/>
            });
        }
        return displayLists;
    }
}

export default UserProfile