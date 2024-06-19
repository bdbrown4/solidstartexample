import {
    createResource,
    createSignal,
    For,
    Show,
  } from "solid-js";
import { getPokemon, Pokemon } from "../services/get-pokemon";
import { useDebounce } from "~/hooks/debounceHook";

export default function Counter() {
    const [search, setSearch] = createSignal("");
    const debouncedSetSearch = useDebounce(setSearch, 1000);
    const [offset, setOffSet] = createSignal(0);
    const [pokemonCache, setPokemonCache] = createSignal([] as Pokemon[]);
    const [debounceStatus, setDebounceStatus] = createSignal(false);

    const [_, { refetch }] = createResource<Pokemon[]>(
        async () => {
            const result = await getPokemon(offset());
            setPokemonCache([...result]);
            return result;
        },
        {
            initialValue: [],
        }
    );

    const onLoadMore = async () => {
        setOffSet(offset() + 10);
        const pokemonCacheResult = pokemonCache();
        const refetchResult = await refetch() as Pokemon[];
        setPokemonCache([...pokemonCacheResult, ...refetchResult]);
    };

    return (
        <div class="lg flex flex-col justify-items-center items-center my-5 mx-10">
        <div class="flex w-1/2 space-x-10 my-10">
            <input
            type="text"
            class="w-2/3 px-5 h-12 border-4 rounded-md border-indigo-400"
            placeholder="Search Pokemon"
            onInput={(evt) => debounceStatus() ? debouncedSetSearch(evt.currentTarget.value) : setSearch(evt.currentTarget.value)}
            />
        </div>
        <div>
            <h3 class="px-4 text-center font-bold text-xl text-indigo-400 py-2 w-full">Debounce Status: {debounceStatus() ? 'ON' : 'OFF'}</h3>
            <button type="button"
            class="bg-indigo-500 hover:bg-blue-500 text-white p-2 font-bold rounded mr-5 mb-5"
            onClick={() => setDebounceStatus(true)}>Debounce</button>
            <button type="button"
            class="bg-indigo-500 hover:bg-blue-500 text-white p-2 font-bold rounded ml-5 mb-5"
            onClick={() => setDebounceStatus(false)}>No Debounce</button>
        </div>
        <div class="md w-1/2  p-5 rounded-md bg-indigo-100 overflow-x">
            <table class="overflow-y-scroll w-full">
            <thead>
                <tr>
                <th class="px-4 text-center font-bold text-xl text-indigo-400 py-2 w-1/2">
                    Name
                </th>
                <th class="px-4 text-center font-bold text-xl text-indigo-400  py-2 w-1/2">
                    Abilities
                </th>
                <th class="px-4 text-center font-bold text-xl text-indigo-400  py-2 w-1/4">
                    Height
                </th>
                </tr>
            </thead>
            <tbody>
                <For each={pokemonCache()}>
                {(pokemon) => (
                    <Show
                    when={pokemon.name
                        .toLowerCase()
                        .includes(search().toLowerCase())}
                    >
                    <tr class="text-indigo-400">
                        <td class="p-5 capitalize border-2 border-indigo-300">
                        {pokemon.name}
                        </td>
                        <td class="p-5 border-2 border-indigo-300">
                        <For each={pokemon.abilities}>
                            {({
                            ability: { name },
                            }: {
                            ability: { name: string };
                            }) => <span>{`${name} `}</span>}
                        </For>
                        </td>
                        <td class="p-5 border-2 border-indigo-300">
                        {pokemon.height}
                        </td>
                    </tr>
                    </Show>
                )}
                </For>
            </tbody>
            </table>
            <button
            onClick={onLoadMore}
            class="bg-indigo-500 hover:bg-blue-500 text-white p-2 font-bold rounded mt-5"
            >
            Load More
            </button>
        </div>
        </div>
    );
}