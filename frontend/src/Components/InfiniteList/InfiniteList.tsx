import {ReactNode, useEffect, useState} from "react";
import { ListResponse } from "../../Api/apiInterface";
import { Button } from "react-bootstrap";

interface InfiniteListProps<T> {
    fetchItems: (page: number, pageSize: number) => Promise<ListResponse<T>>;
    renderItem: (item: T) => ReactNode;
}

export function InfiniteList<T>(props: InfiniteListProps<T>): JSX.Element {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    function replaceItems(response: ListResponse<T>) {
        setItems(response.items);
        setPage(response.page);
        setHasNextPage(response.nextPage !== null);
    }

    function appendItems(response: ListResponse<T>) {
        setItems(items.concat(response.items));
        setPage(response.page);
        setHasNextPage(response.nextPage !== null);
    }
    
    useEffect(() => {
        props.fetchItems(1, 10)
            .then(replaceItems);
    }, [props]);

    function incrementPage() {
        props.fetchItems(page + 1, 10)
            .then(appendItems);
    }
    
    return (
        <div className="infinite-list">
            {items.map(props.renderItem)}
            {hasNextPage && <Button className="custom-button" onClick={incrementPage}>Load More</Button>}
        </div>
    );
}