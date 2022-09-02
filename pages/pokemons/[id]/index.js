import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/link";
import { TitleCase, PadNum } from '../../index.js';
import { Carousel, OverlayTrigger, Tooltip, Accordion } from 'react-bootstrap';

function getPokedexEntry(pokeSpecies) {
    if (pokeSpecies) {
        const pokedexEntries = pokeSpecies.flavor_text_entries;
        for (let i = 0; i < pokedexEntries.length; i++) {
            if (pokedexEntries[i].language.name == 'en' && pokedexEntries[i].version.name == 'black-2') {
                return pokedexEntries[i].flavor_text;
            }
        }
    } return (
        <p>No Pokedex entry found. Feel free to contribute to <a href="https://pokeapi.co/">PokeAPI</a>!</p>
    )
}

function getPokeType(pokemon, index) {
    const pokeType = pokemon.types[index].type.name;
    return (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="button-tooltip-2">{`${TitleCase(pokeType)}`}</Tooltip>}>
            <span>
                <img
                    src={`/icons/${pokeType}.svg`}
                    alt={`${TitleCase(pokeType)}`}
                    style={{ height: "30px", width: "30px" }}
                    padding="15px"
                />
            </span>
        </OverlayTrigger >
    );
}

function getMoveList(pokeMoves) {
    const pokeMovesList = [];

    for (let i = 0; i < pokeMoves.length; i++) {
        pokeMovesList.push(pokeMoves[i].move.name);
        console.log(pokeMovesList[i]);
        pokeMovesList[i] = TitleCase(pokeMovesList[i]);
    }

    return (
        <Accordion >
            <Accordion.Header>Learnable Moves:</Accordion.Header>
            <Accordion.Body key="moveList">
                {pokeMovesList.map(function (name, index) {
                    return (
                        <li key={index}>{name}</li>
                    )
                })}
            </Accordion.Body>
        </Accordion>
    );
}

function getAbilities(pokeAbilities) {
    const pokeAbilitiesList = [];

    for (let i = 0; i < pokeAbilities.length; i++) {
        pokeAbilitiesList.push(pokeAbilities[i].ability.name);
        pokeAbilitiesList[i] = TitleCase(pokeAbilitiesList[i]);
    }

    return (
        <Accordion>
            <Accordion.Header>Abilities:</Accordion.Header>
            <Accordion.Body key="abilityList">
                {pokeAbilitiesList.map(function (name, index) {
                    return (
                        <li key={index}>{name}</li>
                    )
                })}
            </Accordion.Body>
        </Accordion>
    );
}

function PokemonCry(id) {
    let audio = new Audio(`/cries/${id}.ogg`);

    const start = (() => {
        audio.play();
    });

    return (
        <button>
            <img
                src="../icons/speaker.svg"
                alt="Play"
                style={{ height: "30px", width: "30px" }}
                onClick={start}
            />
        </button>
    );
}

function PokemonPictures(id) {
    return (
        <div className="bg-secondary bg-opacity-10 rounded-5 border border-2 shadow-sm p-3 mb-5">
            <Carousel variant="dark">
                <Carousel.Item>
                    <img
                        className="d-block w-50"
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                        alt="First slide"
                        style={{ margin: "auto" }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-50"
                        src={`https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`}
                        alt="Second slide"
                        style={{ margin: "auto" }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-50"
                        src={`https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`}
                        alt="Third slide"
                        style={{ margin: "auto" }}
                    />
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

function PokemonPhysical(pokemon) {
    return (
        <ul className="d-flex list-inline justify-content-evenly">
            <li className="list-inline-item"><b>HP</b></li>
            <li className="list-inline-item">{pokemon.stats[0].base_stat}</li>
            <li className="list-inline-item"></li>
            <li className="list-inline-item"><b>Height</b></li>
            <li className="list-inline-item">{pokemon.height / 10} m</li>
            <li className="list-inline-item"></li>
            <li className="list-inline-item"><b>Weight</b></li>
            <li className="list-inline-item">{pokemon.weight / 10} kg</li>
        </ul>
    )
}

function NavPage(id) {
    let prevId = Number(id) - 1;
    let nextId = Number(id) + 1;

    if (prevId < 1) {
        prevId = 905;
    }

    if (nextId > 905) {
        nextId = 1;
    }

    const prevUrl = "./" + prevId;
    const nextUrl = "./" + nextId;

    return (
        <div className="row p-3">
            <div className="col-2">
                <a href={prevUrl} className="btn btn-primary">
                    Prev
                </a>
            </div>
            <div className="col-2">
                <a href={nextUrl} className="btn btn-primary">
                    Next
                </a>
            </div>
        </div>
    )
}

export default function Pokemon() {
    const [pokemon, setPokemon] = useState(null);
    const [pokeSpecies, setSpecies] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!router.isReady) return;
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                setPokemon(json);
            });
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                setIsLoading(false);
                setSpecies(json);
            });
    }, [router.isReady]);

    return (
        <div className="container">
            <div className="row p-3">
                <div className="col-2">
                    <Link href="/">
                        <a className="btn btn-primary">
                            Back
                        </a>
                    </Link>
                </div>
            </div>
            {isLoading == true ? <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> : null}
            {pokemon ? (
                <div className="row">
                    <div className="col align-self-center">
                        {PokemonPictures(id)}
                    </div>
                    <div className="col align-self-center">
                        <p>No. {PadNum(id)}</p>
                        <h4>{TitleCase(pokemon.name)} {getPokeType(pokemon, 0)} {pokemon.types[1] ? getPokeType(pokemon, 1) : null} {PokemonCry(id)}</h4>
                        <p>{getPokedexEntry(pokeSpecies)}</p>
                        {PokemonPhysical(pokemon)}
                        <hr></hr>
                        <div className="row">
                            <div className="col-4">{getAbilities(pokemon.abilities)}</div>
                            <div className="col-4">{getMoveList(pokemon.moves)}</div>
                        </div>
                        <br></br>
                        {NavPage(id)}
                    </div>
                </div>
            ) : null}
        </div>
    );
}