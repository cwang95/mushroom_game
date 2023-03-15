const utils = {
    withGrid(n) {
        return n * 16;
    },
    asGridCoord(x,y) {
        // use comma for safe negative nums
        return `${x*16},${y*16}`
    },
    roundNearest(value, nearest) {
        Math.round(value / nearest) * nearest
    },
    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;

        const size = 16;

        if (direction === 'left') {
            x -= size;
        } else if (direction === 'right'){
            x += size;
        } else if (direction === 'up') {
            y -= size;
        } else if (direction === 'down'){
            y += size;
        }
        return { x,y };
    },
    oppositeDirection(direction) {
        if (direction === 'left') return 'right';
        if (direction === 'right') return 'left';
        if (direction === 'up') return 'down';
        if (direction === 'down') return 'up';
        return 'down';
    },
    emitEvent(name, detail) {
        // walking finished, trigger custom events
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }
}