import { CART_ACTION_TYPES } from './cart.type'

const INIT_STATE = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    total: 0
}

export const cartReducer = (state = INIT_STATE, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                cartItems: payload
            }
        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
            return {
                ...state,
                isCartOpen: payload
            }
        default:
            return state;
    }
}