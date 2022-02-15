class MovAvg {
    size: number;
    history: Array<number>;
    count: number;
    sum: number;
    avg: number;

    constructor(size: number, initAvg?: number) {
        this.size = size;
        this.history = [];
        this.sum = 0;
        this.count = 0;
        this.avg = initAvg || 0;
    }

    add(entry: number) {
        this.history.push(entry);
        if (this.history.length > this.size) {
            this.sum -= this.history.shift() as number;
            this.count--;
        }
        this.sum += entry;
        this.count++;
        this.avg = this.sum / this.count;
        return this.avg;
    }
}

export default MovAvg;
