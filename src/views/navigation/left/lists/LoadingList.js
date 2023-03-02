import LoadingContactItem from "../contacts/LoadingContactItem";

export default function LoadingList ({loading, lengthItem = 8}) {
    return (
        loading &&
         (() => {
            const array = [];
            for(let i = 0; i < lengthItem; i++)
                array.push(`${i}th-item`);
            return array;
         })().map(key => (
            <LoadingContactItem
                key={key}
            />
        ))
    )
}