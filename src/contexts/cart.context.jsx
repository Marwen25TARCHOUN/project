import { createContext, useReducer } from 'react';

import { createAction } from '../utils/reducer/reducer.utils';

const CART_ACTION_TYPES = {
    SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    SET_CART_COUNT: 'SET_CART_COUNT',
    SET_CART_TOTAL: 'SET_CART_TOTAL',
};

const cartReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                ...payload
            }
        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
            return {
                ...state,
                isCartOpen: payload
            }
        case CART_ACTION_TYPES.SET_CART_COUNT:
            return {
                ...state,
            }
        case CART_ACTION_TYPES.SET_CART_TOTAL:
            return {
                ...state,
            }
        default:
            throw new Error(`Unhandled type ${type} in cartReducer`)
    }
}

const INIT_STATE = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    total: 0
}

const addCartItem = (cartItems, productToAdd) => {
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === productToAdd.id
    );

    if (existingCartItem) {
        return cartItems.map((cartItem) =>
            cartItem.id === productToAdd.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
    }

    return [...cartItems, { ...productToAdd, quantity: 1 }];
}

const removeCartItem = (cartItems, cartItemToRemove) => {
    // find the cart item to remove
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id
    );

    // check if quantity is equal to 1, if it is remove that item from the cart
    if (existingCartItem.quantity === 1) {
        return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
    }

    // return back cartitems with matching cart item with reduced quantity
    return cartItems.map((cartItem) =>
        cartItem.id === cartItemToRemove.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
    );
};

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => { },
    cartItems: [],
    addItemToCart: () => { },
    removeItemFromCart: () => { },
    clearItemFromCart: () => { },
    cartCount: 0,
    total: 0
});

export const CartProvider = ({ children }) => {
    const [{ cartItems, cartCount, total, isCartOpen }, dispatch] = useReducer(cartReducer, INIT_STATE);

    const updateCartItemsReducer = (newCartItems) => {
        const count = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity,
            0
        );

        const newCardTotal = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity * cartItem.price,
            0
        );

        const payload = {
            cartItems: newCartItems,
            cartCount: count,
            total: newCardTotal
        }

        dispatch(createAction(CART_ACTION_TYPES.SET_CART_ITEMS, payload));
    }

    const addItemToCart = (productToAdd) => {
        const newCartItems = addCartItem(cartItems, productToAdd);

        updateCartItemsReducer(newCartItems);
    }

    const removeItemFromCart = (productToRemove) => {
        const newCartItems = removeCartItem(cartItems, productToRemove);

        updateCartItemsReducer(newCartItems);
    }

    const clearItemFromCart = (cartItemToClear) => {
        const newCartItems = cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

        updateCartItemsReducer(newCartItems);
    }

    // useEffect(() => {
    //     const count = cartItems.reduce(
    //         (total, cartItem) => total + cartItem.quantity,
    //         0
    //     );
    //     setcartCount(count);
    // }, [cartItems]);

    // useEffect(() => {
    //     const newCardTotal = cartItems.reduce(
    //         (total, cartItem) => total + cartItem.quantity * cartItem.price,
    //         0
    //     );
    //     setTotal(newCardTotal);
    // }, [cartItems]);

    const setIsCartOpen = (bool) => {
        dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool))
    }

    const value = { isCartOpen, setIsCartOpen, addItemToCart, cartItems, cartCount, removeItemFromCart, clearItemFromCart, total };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};