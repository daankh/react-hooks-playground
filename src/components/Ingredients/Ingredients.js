import React,  { useState, useMemo }  from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const visibleIngredients = useMemo(() => {
    if (searchInputValue) {
      return ingredients.filter((ingredient => ingredient.title.toLowerCase().includes(searchInputValue.toLocaleLowerCase())));
    }
    return ingredients; 
  }, [ingredients, searchInputValue]);

  const removeItem = (id) => {
    const filteredIngredients = ingredients.filter(ingredient => ingredient.id !== id);
    setIngredients(filteredIngredients);
  }

  return (
    <div className="App">
      <IngredientForm setIngredients={setIngredients}/>

      <section>
        <Search searchInputValue={searchInputValue} setSearchInputValue={setSearchInputValue}/>
        <IngredientList ingredients={visibleIngredients} onRemoveItem={removeItem}/>
      </section>
    </div>
  );
}

export default Ingredients;
