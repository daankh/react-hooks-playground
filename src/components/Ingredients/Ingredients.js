import React,  { useState, useEffect, useMemo }  from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';

const Ingredients = () => {
const url = "https://ingredients-store-88a49.firebaseio.com/ingredients.json"
  const [ingredients, setIngredients] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const visibleIngredients = useMemo(() => {
    if (searchInputValue) {
      return ingredients.filter((ingredient => ingredient.title.toLowerCase().includes(searchInputValue.toLocaleLowerCase())));
    }
    return ingredients; 
  }, [ingredients, searchInputValue]);

  const loadIngredients = () => {
    fetch(url).then(response => {
      return response.json();
    }).then(data => {
      const loadedIngredients = [];
      for(let ingredientId in data) {
        const ingredient = {
          id: ingredientId,
          ...data[ingredientId]
        };
        loadedIngredients.push(ingredient);
      }
      setIngredients(loadedIngredients);
    })
  }

  useEffect(() => {
    loadIngredients();
  }, [])

  const addIngredient = (ingredient) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': "application.json"
      }
    }).then(response => {
      return response.json()
    }).then(responseData => {
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        {id: responseData.name, ...ingredient}
      ]);
    })
  }

  const removeIngredient = (id) => {
    fetch("https://ingredients-store-88a49.firebaseio.com/ingredients/" + id + ".json", {
      method: "DELETE",
    }).then(() => {
      loadIngredients();
    });
  }

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredient}/>

      <section>
        <Search searchInputValue={searchInputValue} setSearchInputValue={setSearchInputValue}/>
        <IngredientList ingredients={visibleIngredients} onRemoveItem={removeIngredient}/>
      </section>
    </div>
  );
}

export default Ingredients;
