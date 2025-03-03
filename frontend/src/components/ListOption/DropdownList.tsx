import React from "react";

interface DropDownListProps {
    listId: string;
    listData: string[];
}
const DropDownList: React.FC<DropDownListProps> = ({ listId, listData }) => {

    return (
        <React.Fragment>
            <datalist id={listId}>
                {listData.map((value, index) => (
                    <option key={index} value={value} />
                ))}
            </datalist>
        </React.Fragment>
    );
};

export default DropDownList;
