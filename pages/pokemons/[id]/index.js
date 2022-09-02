import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/link";
import { TitleCase, PadNum } from '../../index.js';
import { Carousel, OverlayTrigger, Tooltip, Accordion } from 'react-bootstrap';

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

    function getPokedexEntry(pokeSpecies) {
        if (pokeSpecies) {
            const pokedexEntries = pokeSpecies.flavor_text_entries;
            for (let i = 0; i < pokedexEntries.length; i++) {
                if (pokedexEntries[i].language.name == 'en' && pokedexEntries[i].version.name == 'black-2') {
                    return pokedexEntries[i].flavor_text;
                }
            }
        }
    }

    function getPokeType(pokemon, index) {
        const pokeType = pokemon.types[index].type.name;
        return (
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="button-tooltip-2">{`${TitleCase(pokeType)}`}</Tooltip>}>
                <span>
                    <Image
                        src={`/icons/${pokeType}.svg`}
                        alt={`${TitleCase(pokeType)}`}
                        style={{ height: "40px", width: "40px" }}
                        padding="15px"
                    />
                </span>
            </OverlayTrigger >
        );
    }

    function getTypeColor(type) {

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
                <Accordion.Body key="5">
                    {pokeAbilitiesList.map(function (name, index) {
                        return (
                            <li key={index}>{name}</li>
                        )
                })}
                </Accordion.Body>
            </Accordion>
        );
    }

    function pokemonPictures() {
        return (
            <Carousel>
                <Carousel.Item>
                    <Image
                        className="d-block w-50 border border-2 shadow-sm p-3 mb-5 bg-body rounded-5"
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                        alt="First slide"
                        style={{ margin: "auto" }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        className="d-block w-50 border border-2 shadow-sm p-3 mb-5 bg-body rounded-5"
                        src={`https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`}
                        alt="Second slide"
                        style={{ margin: "auto" }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        className="d-block w-50 border border-2 shadow-sm p-3 mb-5 bg-body rounded-5"
                        src={`https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`}
                        alt="Third slide"
                        style={{ margin: "auto" }}
                    />
                </Carousel.Item>
            </Carousel>
        );
    }

    return (
        <div className="container">
            <div className="row">&nbsp;</div>
            {isLoading == true ? <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> : null}
            {pokemon ? (
                <div className="row">
                    <div className="col align-self-center">
                        {pokemonPictures()}
                    </div>
                    <div className="col align-self-center">
                        <p>No. {PadNum(id)}</p>
                        <h4>{TitleCase(pokemon.name)} {getPokeType(pokemon, 0)} {pokemon.types[1] ? getPokeType(pokemon, 1) : null}</h4>
                        <p>{getPokedexEntry(pokeSpecies)}</p>
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
                        <hr></hr>
                        <div className="col-4">{getAbilities(pokemon.abilities)}</div>
                        <br></br>
                        <Link href="/">
                            <a className="btn btn-primary">
                                Back
                            </a>
                        </Link>
                    </div>
                </div>
            ) : null}
        </div>
    );
}