import { useEffect, useState } from 'react'

type Props = {
    from?: number;
    to?: number;
    delay?: number;
    skip?:number;
    start?:boolean
}

export default function useCounter({ from = 0, to = 10, delay = 200,skip=1,start=true }: Props) {
    const [counter, setCounter] = useState(from);

    useEffect(() => {
        if(start){
            const timer = setInterval(() => {
                setCounter(c => {
                    if (c < to) {
                        const remains = to-c;
                        if(remains>skip){
                            return c + skip;
                        }
                        return c + remains;
                    } else {
                        clearInterval(timer);
                        return c;
                    }
                });
            }, delay);
        return () => clearInterval(timer);
        }else{
            setCounter(from)
        }

    }, [from, to, delay, skip,start]);

    return {
        from,
        to,
        current: counter
    }
}