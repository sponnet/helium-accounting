import React from "react";
import axios from "axios";
import NodeLookup from "./NodeLookup";
import moment from 'moment';
import { CSVLink } from "react-csv";

const Comp = () => {

    const [nodes, setNodes] = React.useState([]);
    const [months, setMonths] = React.useState([]);
    const [tableData, setTableData] = React.useState({});
    const [lookupQueue, setLookupQueue] = React.useState([]);

    const getTableKey = (node, month) => {
        return `${node.name}_${month}`;
    }

    React.useEffect(() => {
        let months = [];
        const amount = 3;
        for (let i = 0; i < amount; i++) {
            months.push(moment().subtract(amount - i, 'months').format('YYYYMM'))
        }
        setMonths(months);
    }, [])


    React.useEffect(() => {
        if (lookupQueue.length > 0) {
            const queueItem = lookupQueue[0];
            const startOfMonth = moment(`${queueItem.month}01`).clone().startOf('month').format('YYYY-MM-DD');
            const endOfMonth = moment(`${queueItem.month}01`).clone().endOf('month').format('YYYY-MM-DD');
            const q = `https://api.helium.io/v1/hotspots/${queueItem.node.address}/rewards/sum?min_time=${startOfMonth}&max_time=${endOfMonth}`;
            axios.get(q).then((r) => {
                setTableData(tableData => ({ ...tableData, [queueItem.key]: r.data.data.total }));
            });
            setTableData(tableData => ({ ...tableData, [queueItem.key]: `...` }));
            setLookupQueue(lookupQueue.filter(item => item.key !== queueItem.key));
        }
    }, [lookupQueue]);

    React.useEffect(() => {
        nodes.forEach((node) => {
            months.forEach((month) => {
                console.log(`${node.name}/${month}`);
                const key = getTableKey(node, month);
                if (!tableData[key]) {
                    setLookupQueue(lookupQueue => ([...lookupQueue, { key, node, month }]));
                }
            })
        })
    }, [nodes, months, tableData])


    const addNode = (node) => {
        console.log(`Adding node`, node);
        const _nodes = [
            ...nodes,
            node
        ];
        _nodes.sort((a, b) => { return a.name - b.name });
        setNodes(_nodes);
    }


    // create  CSV data
    let csvData = [[
        "name",
        ...months
    ]];

    console.log(csvData);

    const nodeList = () => {


        nodes.forEach((node) => {
            const m = months.map((month) => {
                const key = getTableKey(node, month);
                return tableData[key];
            });
            csvData.push([
                node.name,
                ...m
            ]);
        });






        const n = nodes.map((node) => {
            const m = months.map((month) => {
                const key = getTableKey(node, month);
                const data = tableData[key];
                return (<td key={key}>{data}</td>);
            })

            return (
                <tr key={node.name}>
                    <td>
                        {node.name}
                    </td>
                    {m}
                </tr>
            )
        })

        const mHeaders = months.map((month) => {
            return (<th key={month}><abbr title={`Earnings Month ${month}`}>{month}</abbr></th>)
        })
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th><abbr title="Hotspot name">Name</abbr></th>
                        {mHeaders}
                    </tr>
                </thead>
                <tbody>
                    {n}
                </tbody>
            </table>
        )
    }

    const header = () => {
        return (
            <section className="is-medium has-text-white">
                <div className="columns is-mobile">
                    <div className="column is-8-desktop is-10">
                        <h1 className="title is-1 is-spaced has-text-white">Helium hotspot rewards</h1>
                        <p className="">Shows the earnings of your hotspots over the last few months</p>
                    </div>
                </div>
                {nodeList()}
                <br />
                <CSVLink data={csvData}>Download as CSV</CSVLink>
            </section>
        )
    }

    return (
        <>
            {header()}
            <NodeLookup onNodeAdded={addNode} />
        </>
    )

};

export default Comp;