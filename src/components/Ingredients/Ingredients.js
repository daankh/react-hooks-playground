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

  useEffect(() => {
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
    fetch(url + "/" + id, {
      method: "DELETE",
    }).then(response => {
      return response.json();
    }).then(responseBody => {
      const filteredIngredients = ingredients.filter(ingredient => responseBody.name !== id);
      setIngredients(filteredIngredients);
    })
    
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
