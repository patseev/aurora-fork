export default class WorldMap {
    // splits world into grid of areas that can be explored
    constructor(world, granularity) {
        console.log(world.bounds);

        const width = world.bounds.width;
        const height = world.bounds.height;

        console.log(width, height);

        const areaWidth = width / granularity;
        const areaHeight = height / granularity;

        console.log(areaWidth, areaHeight);

        this.worldAreas = [];

        for (let i = 0; i < granularity; i++) {
            for (let j = 0; j < granularity; j++) {
                const newArea = new WorldArea(i * areaWidth, j * areaHeight, areaWidth, areaHeight, false);
                this.worldAreas.push(newArea);
            }
        }
    }

    get knownAreas() {
        return this.worldAreas.filter(area => area.isExplored);
    }

    get unknownAreas() {
        return this.worldAreas.filter(area => !area.isExplored);
    }

    // Saves info about player movement marking areas as explored
    registerMovement(sourceX, sourceY) {
        const area = this.unknownAreas.find(area => area.contains(sourceX, sourceY));

        if (area) {
            console.log('Area is reached');
            area.explore()
            return true;
        }

        return false;
    }

    // Returns boundaries of the closest unknown area
    // Might return null if whole map is explored
    closestUnknownArea(sourceX, sourceY) {
        const areasWithDistances =
            this.unknownAreas.map(area => ({ 
                area: area, 
                distance: area.distance(sourceX, sourceY)
            }));
        
        if (areasWithDistances.length == 0) return null;

        const closest = areasWithDistances.reduce((acc, next) => {
            return (next.distance < acc.distance) ? next : acc;
        })

        return closest.area;
    }
}

class WorldArea {
    constructor (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isExploredAt = null;
    }

    // area is considered to be explored if it was last visited in the last minute
    get isExplored() {
        return this.isExploredAt && (Date.now() - this.isExploredAt < 1000 * 60);
    }

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    get center() {
        const x = (this.x + this.right) / 2;
        const y = (this.y + this.bottom) / 2;

        return { x, y };
    }

    explore() {
        this.isExploredAt = Date.now();
    }

    distance(x, y) {
        const dx = Math.max(this.x - x, x - this.right);
        const dy = Math.max(this.y - y, y - this.bottom);

        return Math.sqrt(dx * dx + dy * dy);
    }

    contains(x, y) {
        return this.x <= x && x <= this.right && this.y <= y && y <= this.bottom;
    }
}