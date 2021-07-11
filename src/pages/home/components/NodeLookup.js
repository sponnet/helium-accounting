import React from "react";
import axios from "axios";

const Comp = ({ onNodeAdded }) => {
    const [nodeName, setNodeName] = React.useState("");
    const [foundNodes, setFoundNodes] = React.useState([]);
    const [lookingUp, setLookingup] = React.useState(false);

    React.useEffect(() => {
        if (nodeName.length > 2 && !lookingUp) {
            setLookingup(true);
            axios.get(`https://api.helium.io/v1/hotspots/name?search=${nodeName}`).then((r) => {
                setFoundNodes(r.data.data);
                setLookingup(false);
            });
        }
    }, [nodeName,lookingUp]);

    const nodesResult = () => {
        if (!foundNodes) { return (null) }
        const nodeList = foundNodes.map((node) => {
            return (<li key={node.name} onClick={() => {
                onNodeAdded(node)
                setNodeName("");
                setFoundNodes([]);
                setLookingup(false);
            }}>{node.name}</li>)
        })
        return (
            <>
                <ul>
                    {nodeList}
                </ul>
            </>)
    }

    return (<>
        <section className="is-medium has-text-white">
            <div className="setting">
                <h3 className="is-size-5">Add Hotspot</h3>

                <div className="field">
                    <p className="control">
                        <input
                            placeholder="start typing a hotspot name"
                            type="text"
                            value={nodeName}
                            onChange={(e) => { setNodeName(e.target.value) }}
                            className="input"
                        />
                    </p>
                </div>
                {nodesResult()}
            </div>
        </section>
    </>);

};

export default Comp;