/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { gardenIds } from './data';

const url = "https://kg.sofia.bg/api/stat-rating/waiting";

const getRankings = async () => {
    try {
        let result = [];
        for (let item of gardenIds) {
            const { id, name } = item;
            const response = await fetch(`${url}/${id}`);
            const data = await response.json();

            result = [
                ...result,
                {
                    id,
                    name,
                    items: {
                        ...data.items,
                        listCommon: [...data.items.listCommon.slice(0, 60)],
                    },
                },
            ];
        }

        return result;
    } catch (err) {
        console.error(err);
        return [];
    }
};

const RankingTable = ({ items, onClickHandler, selectedNum }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>N:</th>
                    <th>EGN</th>
                    <th>Име</th>
                    <th>Желание</th>
                    <th>Точки (точки желание)</th>
                </tr>
            </thead>
            <tbody>
                {items?.length &&
                    items.map((r, index) => (
                        <tr
                            key={r.id}
                            onClick={() => onClickHandler(r.childNum)}
                            className={selectedNum === r.childNum ? "selected" : ""}
                        >
                            <td>{++index}</td>
                            <td>{r.childNum}</td>
                            <td>
                                {r.firstName}
                                {r.middleName}
                                {r.lastName}
                            </td>
                            <td>{r.wishOrder}</td>
                            <td>
                                {r.displayText} ({r.orderPoints})
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [selectedNum, setSelectedNum] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getRankings();
            setRanking(result);
        };

        fetchData();
    }, []);

    const onRowClickHandler = (num) => setSelectedNum(num);

    return (
        <div className="ranking-cotainer">
            {ranking?.length &&
                ranking.map((item) => {
                    return (
                        <div key={item.id}>
                            <h3>{item.name}</h3>
                            <h4>Свободни соц: {item.items.freeSocial}</h4>
                            <RankingTable
                                items={item?.items?.listSocial}
                                onClickHandler={onRowClickHandler}
                                selectedNum={selectedNum}
                            />
                            <h4>Свободни общ: {item.items.freeCommon}</h4>
                            <RankingTable
                                items={item?.items?.listCommon}
                                onClickHandler={onRowClickHandler}
                                selectedNum={selectedNum}
                            />
                        </div>
                    );
                })}
        </div>
    );
};

export default RankingPage;