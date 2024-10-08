import { createContext, useState, useEffect } from 'react';

import PRODUCTS from '../shop-data.json';

import SHOP_DATA from '../shop-data';

import { addCollectionAndDocument, getCategoriesAndDocuments } from '../utils/firebase/firebase.utils';

export const CategoriesContext = createContext({
  categoriesMap: {},
});

export const CategoriesProvider = ({ children }) => {
  const [categoriesMap, setCategoriesMap] = useState({});
  const value = { categoriesMap };

  // useEffect(()=> {
  //   addCollectionAndDocument('categories', SHOP_DATA, 'title')
  // }, [])

  useEffect(()=> {
    const getCategoriesMap = async () => {
      const categoryMap = await getCategoriesAndDocuments()

      setCategoriesMap(categoryMap)
    }
    
    getCategoriesMap()
  }, [])

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
