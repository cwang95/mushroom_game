const utils = {
    getInteractionRadius(x, y, radius) {
        const result = {};
        for (let i = -radius; i <= radius; i+= 16) {
          for (let j = -radius; j <= radius; j+=16) {
            result[`${x + i},${y + j}`] = true;
          }
        }
        // console.log(result);
        return result;
    },
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
        const nextX = x%16===0 ? x : Math.round(x / 16) * 16;
        const nextY = y%16===0 ? y : Math.round(y / 16) * 16;
        return { x: nextX, y: nextY };
    },
    nextPositions(initialX, initialY) {
        const size = 16;
        const x = initialX%size===0 ? initialX : Math.round(initialX / size) * size;
        const y = initialY%size===0 ? initialY : Math.round(initialY / size) * size;

        // return strings for self, up, down, left, & right
        return [`${x},${y}`, `${x-size},${y}`,`${x+size*2},${y}`, `${x+size},${y}`, `${x},${y-size}`, `${x},${y+size}`];
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

export default utils;