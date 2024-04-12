import { useEffect, useState } from 'react';
import { gardenIds } from './data';

const url = "https://kg.sofia.bg/api/stat-rating/waiting";

const Ranking = () => {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            gardenIds.map(async ({ id, name }) => {
                const response = await fetch(`${url}/${id}`);
                const data = await response.json();

                setRanking((prevState) => [...prevState, {
                    id,
                    name,
                    items: data.items
                }]);
            });
        };

        fetchData();
    }, []);

    return (
        <>
            {ranking?.length && ranking.map((item) => {
                return (
                    <div key={item.id}>
                        <h3>{item.name}</h3>
                        <h4>Свободни соц: {item.items.freeSocial}</h4>
                        <h4>Свободни общ: {item.items.freeCommon}</h4>
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
                                {item.items?.listCommon?.length &&
                                    item.items.listCommon.map((r, index) => {
                                        return (
                                            <tr key={r.id}>
                                                <td>{++index}</td>
                                                <td>
                                                    {r.childNum}
                                                </td>
                                                <td>
                                                    {r.firstName}
                                                    {r.middleName}
                                                    {r.lastName}
                                                </td>
                                                <td>
                                                    {r.wishOrder}
                                                </td>
                                                <td>
                                                    {r.displayText} (
                                                    {r.orderPoints})
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </>
    );
};

export default Ranking;