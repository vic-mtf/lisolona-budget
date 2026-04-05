import LoadingItem from "../items/LoadingItem";

export default function LoadingList ({loading, lengthItem = 4}) {
    return (
        loading &&
         (() => {
            const array = [];
            for(let i = 0; i < lengthItem; i++)
                array.push(`${i}th-item`);
            return array;
         })().map(key => (
            <LoadingItem
                key={key}
            />
        ))
    )
}