import React, {Component} from 'react'

import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {

    componentWillUpdate() {
        console.log("Order Summary will Update")
    }
    render() {
        const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => {
            return <li key={igKey}>
                <span style={{textTransform: 'capitilize'}}>{igKey}</span> : {this.props.ingredients[igKey]}
            </li>
        });
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A Delicious Burger with the following ingredients:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <strong>Total Price : {this.props.price.toFixed(2)}</strong>
                <p>Continue to Checkout?</p>
                <Button btnType="Danger" clicked={this.props.cancel}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.continue}>CONTINUE</Button>
            </Aux>
        )

    };
}

export default OrderSummary;