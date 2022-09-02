import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
//import './App.css';
import { useState, useEffect } from "react";

function getIDFromPokemon(pokemon) {
  return pokemon.url.replace(
    "https://pokeapi.co/api/v2/pokemon/",
    ""
  ).replace("/", "");
}

function getPokeType(pokemon) {
  return (
    <ul>
      <li></li>
    </ul>
  )
}

function Card(props) {
  const [likes, setLikes] = useState(0);

  return (
    <div
      className="card col-4 d-flex justify-content-center"
      style={{ "width": "18rem" }}
    >
      <img src={props.src} className="card-img-top" alt="..." />
      <div className="card-body">
        <p className="card-text">{props.pokeNum}</p>
        <Link href={{ pathname: "pokemons/[id]", query: { id: props.id } }}>
          <a className="stretched-link"><h5 className="card-title">{props.title}</h5></a>
        </Link>
        <p className="card-text">{props.text}</p>
      </div>
    </div>
  );
}

function RandomPokemon() {
  const randomId = Math.floor(Math.random() * (905 - 1)) + 1;
  return (
    <div className="p-3">
      <Link href={{ pathname: "pokemons/[id]", query: { id: randomId } }}>
        <button className="btn btn-primary">Random Pokemon</button>
      </Link>
    </div>
  )
}

export function TitleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PadNum(str) {
  return String(str).padStart(3, '0');
}

function App() {

  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setIsLoading(false);
        setPokemonList([...pokemonList, ...json["results"]]);
      })
  }, [offset])

  return (
    <div className="App">
      <div className="container">
        <RandomPokemon />
        <div className="row">
          {pokemonList.map(pokemon => {
            const id = getIDFromPokemon(pokemon);
            return <Card
              key={id}
              id={id}
              pokeNum={"#" + PadNum(id)}
              title={TitleCase(pokemon["name"])}
              text=""
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            />
          })}
        </div>
        <div className="row text-center">
          {isLoading == true ? <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div> : null}
          <div className="p-3">
            <button
              className="btn btn-primary"
              onClick={() => { setOffset(offset + limit) }}
            >
              More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;